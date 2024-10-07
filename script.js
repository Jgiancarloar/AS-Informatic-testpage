document.addEventListener('DOMContentLoaded', function () {
    // Cargar el navbar
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;

            const headerElements = getHeaderElements();
            if (headerElements) {
                window.addEventListener('scroll', () => moveScroll(headerElements));
                initMenu(headerElements);
            }

            // Iniciar la lógica del slider
            initSlider();
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
        try {
            if (!dotsContainer) {
                throw new Error('El contenedor de los puntos no se encontró.');
            }
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
        } catch (error) {
            console.error('Error en updateDots:', error.message);
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

    function initMenu({ menu, openMenu, closeMenu }) {
        openMenu.addEventListener('click', () => {
            menu.classList.remove('-translate-x-full');
            menu.classList.add('translate-x-0');
        });

        closeMenu.addEventListener('click', () => {
            menu.classList.remove('translate-x-0');
            menu.classList.add('-translate-x-full');
        });
    }

    // Función para obtener los elementos del header
    function getHeaderElements() {
        const smallHeader = document.getElementById('small-header');
        const navbar = document.getElementById('navbar');
        const menu = document.getElementById('menu')
        const openMenu = document.getElementById('open-menu')
        const closeMenu = document.getElementById('close-menu')

        if (smallHeader && navbar && menu && openMenu && closeMenu) {
            return { smallHeader, navbar, menu, openMenu, closeMenu };
        } else {
            console.error('Algunos elementos del header no se encontraron.');
            return null;
        }
    }

    // Función para manejar el scroll
    function moveScroll({ smallHeader, navbar }) {
        const isScrolled = window.scrollY > 0;

        smallHeader.classList.toggle('lg:flex', !isScrolled);

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

    // Crear un Intersection Observer para los contadores
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initCounters(); // Llamar a initCounters cuando el elemento es visible
                observer.unobserve(entry.target); // Dejar de observar
            }
        });
    });

    // Observar el elemento con los contadores
    const countersElement = document.querySelector('.counter'); // Asegúrate de que este selector sea correcto
    if (countersElement) {
        observer.observe(countersElement);
    }

    // Función para inicializar el slider
    function initSlider() {
        try {
            const sliderLogo = document.getElementById('sliderLogo'); // El contenedor que contiene las imágenes
            const arrowLeft = document.getElementById('arrow-left'); // Botón de la flecha izquierda
            const arrowRight = document.getElementById('arrow-right'); // Botón de la flecha derecha

            // Verificar si los elementos existen
            if (!sliderLogo || !arrowLeft || !arrowRight) {
                throw new Error('Elementos del slider no encontrados. Asegúrate de que el HTML tenga los IDs correctos.');
            }

            let scrollAmount = 0; // Mantener un seguimiento de la cantidad de desplazamiento
            const scrollStep = 200; // Cantidad de desplazamiento en píxeles por clic (ajustable)
            const imageCount = sliderLogo.children.length / 2; // Contar las imágenes (la mitad para el efecto infinito)

            // Click en la flecha izquierda
            arrowLeft.addEventListener('click', function () {
                if (scrollAmount > 0) {
                    scrollAmount -= scrollStep;
                    sliderLogo.style.transform = `translateX(-${scrollAmount}px)`;
                } else {
                    // Si llega al inicio, mover al final para el efecto infinito
                    scrollAmount = (imageCount - 1) * scrollStep; // Volver al último conjunto de imágenes
                    sliderLogo.style.transition = 'none'; // Sin transición
                    sliderLogo.style.transform = `translateX(-${scrollAmount}px)`;

                    // Forzar reflujo para reiniciar la transición
                    void sliderLogo.offsetWidth;
                    sliderLogo.style.transition = 'transform 0.5s ease-in-out'; // Volver a habilitar la transición

                    setTimeout(() => {
                        scrollAmount -= scrollStep; // Desplazarse una vez más
                        sliderLogo.style.transform = `translateX(-${scrollAmount}px)`;
                    }, 50);
                }
            });

            // Click en la flecha derecha
            arrowRight.addEventListener('click', function () {
                const maxScroll = (imageCount - 1) * scrollStep; // Máximo scroll permitido
                if (scrollAmount < maxScroll) {
                    scrollAmount += scrollStep;
                    sliderLogo.style.transform = `translateX(-${scrollAmount}px)`;
                } else {
                    // Si llega al final, mover al inicio para el efecto infinito
                    scrollAmount = 0; // Reiniciar el desplazamiento
                    sliderLogo.style.transition = 'none'; // Sin transición
                    sliderLogo.style.transform = `translateX(0)`; // Volver al inicio

                    // Forzar reflujo para reiniciar la transición
                    void sliderLogo.offsetWidth;
                    sliderLogo.style.transition = 'transform 0.5s ease-in-out'; // Volver a habilitar la transición

                    setTimeout(() => {
                        scrollAmount += scrollStep; // Desplazarse una vez más
                        sliderLogo.style.transform = `translateX(-${scrollAmount}px)`;
                    }, 50);
                }
            });
        } catch (error) {
            console.error('Error en initSlider:', error.message);
        }
    }

    // Función para manejar la aparición de elementos al hacer scroll
    function initScrollAnimations() {
        const elementsToShow = document.querySelectorAll('.scroll-reveal'); // Selector para los elementos que aparecerán
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible'); // Agrega una clase para animar
                    observer.unobserve(entry.target); // Deja de observar este elemento
                }
            });
        });

        elementsToShow.forEach(element => {
            observer.observe(element); // Observa cada elemento
        });
    }

    // Llamar a la función para inicializar las animaciones al hacer scroll
    initScrollAnimations();
});
