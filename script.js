document.addEventListener('DOMContentLoaded', function () {
    // Cargar el navbar
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;

            // Mueve la función para que se ejecute después de que se haya cargado el header
            const smallHeader = document.getElementById('small-header');
            
            // Asegúrate de que smallHeader se haya cargado correctamente
            if (smallHeader) {
                window.addEventListener('scroll', moveScroll);
            }
        });
});

function moveScroll() {
    const smallHeader = document.getElementById('small-header'); // Mover esta línea aquí

    if (window.scrollY > 0) {
        smallHeader.classList.add('hidden');
        console.log('moviendo');
    } else {
        smallHeader.classList.remove('hidden');
    }
}
