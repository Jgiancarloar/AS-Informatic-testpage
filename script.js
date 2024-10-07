document.addEventListener('DOMContentLoaded', function () {
    // Cargar el navbar
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;

            const headerElements = getHeaderElements();
            if (headerElements) {
                window.addEventListener('scroll', () => moveScroll(headerElements));
            }

            // Iniciar la lógica de los contadores después de cargar el header
            initCounters(); 
        })
        .catch(error => console.error('Error cargando el header:', error));

    // Slider de soluciones tecnológicas
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.dots');
    let currentIndex = 0;
    let slidesToShow = 1; // Número de slides a mostrar por defecto

    // Función para determinar cuántos slides mostrar según el tamaño de la pantalla
    function updateSlidesToShow() {
        if (window.matchMedia("(min-width: 1280px)").matches) {
            slidesToShow = 3; // Mostrar 3 slides en pantallas xl
        } else if (window.matchMedia("(min-width: 768px)").matches) {
            slidesToShow = 2; // Mostrar 2 slides en pantallas md
        } else {
            slidesToShow = 1; // Mostrar 1 slide en pantallas más pequeñas
        }
    }

    // Función para mostrar la diapositiva actual
    function showSlide(index) {
        currentIndex = index;
        const totalSlides = slides.length;

        // Muestra los slides activos
        slides.forEach((slide, i) => {
            slide.classList.remove('active'); // Oculta todos los slides
            if (i >= currentIndex && i < currentIndex + slidesToShow) {
                slide.classList.add('active'); // Muestra los slides dentro del rango
            }
        });

        updateDots();
    }

    // Función para actualizar los puntos
    function updateDots() {
        dotsContainer.innerHTML = '';
        const totalDots = Math.ceil(slides.length / slidesToShow);
        for (let index = 0; index < totalDots; index++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === Math.floor(currentIndex / slidesToShow)) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                showSlide(index * slidesToShow); // Cambia el índice al dot seleccionado
            });
            dotsContainer.appendChild(dot);
        }
    }

    // Navegación mediante dots
    const totalSlides = slides.length;
    updateSlidesToShow(); // Actualiza el número de slides a mostrar en la carga inicial
    showSlide(currentIndex); // Mostrar los slides iniciales

    // Escuchar cambios en el tamaño de la ventana
    window.addEventListener('resize', () => {
        updateSlidesToShow();
        showSlide(currentIndex); // Mostrar la diapositiva correcta después de ajustar
    });

    // Función para obtener los elementos del header
    function getHeaderElements() {
        const smallHeader = document.getElementById('small-header');
        const navbarBg = document.getElementById('navbar-bg');
        const navbar = document.getElementById('navbar');

        if (smallHeader && navbarBg && navbar) {
            return { smallHeader, navbarBg, navbar };
        } else {
            console.error('Algunos elementos del header no se encontraron.');
            return null;
        }
    }

    // Función para manejar el scroll
    function moveScroll({ smallHeader, navbarBg, navbar }) {
        const isScrolled = window.scrollY > 0;

        smallHeader.classList.toggle('lg:flex', !isScrolled);
        navbarBg.classList.toggle('opacity-100', isScrolled);

        if (isScrolled) {
            navbar.classList.remove('mt-5', 'mx-3');
        } else {
            navbar.classList.add('mt-5', 'mx-3');
        }
    }

    // Función para inicializar los contadores
    function initCounters() {
        const counters = document.querySelectorAll('.counter');

        counters.forEach(counter => {
            const updateCounter = () => {
                const target = +counter.getAttribute('data-target'); // Convertir a número
                const current = +counter.innerText.replace(/\D/g, ''); // Eliminar caracteres no numéricos

                // Aumentamos el incremento para hacerlo más rápido
                const increment = target / 50; // Cambiamos de 100 a 50 para un incremento más rápido

                if (current < target) {
                    counter.innerText = Math.ceil(current + increment) + '+';
                    
                    // Reducimos el tiempo entre actualizaciones
                    setTimeout(updateCounter, Math.random() * 50); // De 100ms a 50ms para más velocidad
                } else {
                    counter.innerText = target + '+';
                }
            };

            // Inicializamos el contador
            updateCounter();
        });
    }
});
