const sizes = document.querySelectorAll('.size');
const colors = document.querySelectorAll('.color');
const shoes = document.querySelectorAll('.shoe');
const gradients = document.querySelectorAll('.gradient');
const shoeBg = document.querySelector('.shoeBackground');

let prevColor = "blue";
let animationEnd = true;

function changeSize() {
    sizes.forEach(size => size.classList.remove('active'));
    this.classList.add('active');
}

function changeColor() {
    if (!animationEnd) return;
    let primary = this.querySelector('input').value;
    let color = this.querySelector('input').value;
    let shoe = document.querySelector(`.shoe[color="${color}"]`);
    let gradient = document.querySelector(`.gradient[color="${color}"]`);
    let prevGradient = document.querySelector(`.gradient[color="${prevColor}"]`);

    if (color == prevColor) return;

    colors.forEach(c => c.classList.remove('active'));
    this.classList.add('active');

    document.documentElement.style.setProperty('--primary', primary);

    shoes.forEach(s => s.classList.remove('show'));
    shoe.classList.add('show');

    gradients.forEach(g => g.classList.remove('first', 'second'));
    gradient.classList.add('first');
    prevGradient.classList.add('second');

    prevColor = color;
    animationEnd = false;

    gradient.addEventListener('animationend', () => {
        animationEnd = true;
    });
}

sizes.forEach(size => size.addEventListener('click', changeSize));
colors.forEach(c => c.addEventListener('click', changeColor));

let x = window.matchMedia("(max-width: 1000px)");

function changeHeight() {
    if (x.matches) {
        let shoeHeight = shoes[0].offsetHeight;
        shoeBg.style.height = `${shoeHeight * 0.9}px`;
    } else {
        shoeBg.style.height = "475px";
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('modal');
    const buyButton = document.getElementById('buyButton');
    const closeButton = document.querySelector('.close');
    const purchaseForm = document.getElementById('purchaseForm');

    buyButton.addEventListener('click', function () {
        modal.style.display = 'block';
    });

    closeButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: '0.01' // Remplacer par le montant réel
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert('Transaction completed by ' + details.payer.name.given_name);

                // Envoyer les données du formulaire au serveur
                const formData = new FormData(purchaseForm);
                fetch('/submit-form', {
                    method: 'POST',
                    body: formData
                }).then(response => {
                    if (response.ok) {
                        alert('Formulaire envoyé avec succès!');
                    } else {
                        alert('Erreur lors de l\'envoi du formulaire.');
                    }
                }).catch(error => {
                    console.error('Erreur:', error);
                });

                // Masquer la modal après paiement
                modal.style.display = 'none';
            });
        }
    }).render('#paypal-button-container');
});
