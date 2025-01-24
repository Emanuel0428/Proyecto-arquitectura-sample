document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll(".section"); // Todas las secciones
  const menuItems = document.querySelectorAll(".menu-item"); // Elementos del menú
  let currentIndex = 0; // Índice actual de la sección visible
  const totalSections = sections.length;
  let isAnimating = false; // Para evitar múltiples cambios simultáneos
  const form = document.querySelector("#form"); // Suponiendo que el formulario tiene el id 'form'

  // Mostrar solo la primera sección al inicio
  sections[currentIndex].classList.add("active");
  menuItems[currentIndex].classList.add("active");

  // Detectar eventos de scroll
  window.addEventListener("wheel", (event) => {
    if (isAnimating) return; // Si ya hay una animación en curso, ignorar el scroll

    const direction = event.deltaY > 0 ? "down" : "up"; // Dirección del scroll

    if (direction === "down" && currentIndex < totalSections - 1) {
      // Avanzar a la siguiente sección
      changeSection(currentIndex + 1, direction);
    } else if (direction === "up" && currentIndex > 0) {
      // Retroceder a la sección anterior
      changeSection(currentIndex - 1, direction);
    }

    // Prevenir scroll predeterminado del navegador
    event.preventDefault();
  });

  // Detectar clic en los botones del menú
  menuItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      if (isAnimating || currentIndex === index) return; // Ignorar si ya está en la sección
      changeSection(index, index > currentIndex ? "down" : "up");
    });
  });

  // Cambiar a la sección especificada por índice
  function changeSection(newIndex, direction) {
    isAnimating = true; // Bloqueamos nuevas interacciones
    const currentSection = sections[currentIndex];
    const newSection = sections[newIndex];

    // Aplicar animación de salida y entrada dependiendo de la dirección del scroll
    if (direction === "down") {
      currentSection.classList.add("slideOutUp");  // Salida hacia arriba
      newSection.classList.add("slideInUp");     // Entrada desde abajo
    } else {
      currentSection.classList.add("slideOutDown"); // Salida hacia abajo
      newSection.classList.add("slideInUp");        // Entrada desde abajo
    }

    // Esperar a que termine la animación antes de cambiar de sección
    setTimeout(() => {
      currentSection.classList.remove("active", "slideOutUp", "slideOutDown");
      newSection.classList.remove("slideInUp", "slideInDown");
      newSection.classList.add("active");
      menuItems[currentIndex].classList.remove("active");
      menuItems[newIndex].classList.add("active");

      currentIndex = newIndex;
      isAnimating = false; // Permitir nuevas interacciones
    }, 500); // Ajusta el tiempo de la animación si es necesario

    // Animación del formulario dependiendo de la dirección
    if (direction === "down") {
      form.classList.remove("form-hidden"); // Muestra el formulario
      form.classList.add("form-active");    // Aplica animación de entrada
    } else {
      form.classList.remove("form-active"); // El formulario se oculta
      form.classList.add("form-hidden");    // Aplica animación de salida
    }
  }
});

// Funcion para controlar la reproducción de los videos
document.addEventListener("DOMContentLoaded", () => {
  const video1 = document.getElementById("video-fondo-1");
  const video2 = document.getElementById("video-fondo-2");

  // Inicia mostrando el primer video
  video1.classList.add("active");

  // Cambia al segundo video cuando el primero termina
  video1.addEventListener("ended", () => {
    video1.classList.remove("active");
    video2.classList.add("active");
    video2.play();
  });

  // Detiene el segundo video en el último cuadro
  video2.addEventListener("ended", () => {
    video2.pause();
    video2.currentTime = video2.duration;
  });

  // Reinicia la animación al hacer scroll hacia la sección
  const inicioSection = document.getElementById("inicio");
  let observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Reinicia ambos videos
          video2.pause();
          video2.currentTime = 0;
          video2.classList.remove("active");

          video1.classList.add("active");
          video1.play();
        }
      });
    },
    { threshold: 0.5 }
  );
});

// Logica para el carrusel

const carousel = document.querySelector('.equipo-carousel');
const leftBtn = document.querySelector('.scroll-btn.left');
const rightBtn = document.querySelector('.scroll-btn.right');
const equipoItems = document.querySelectorAll('.equipo-item');
const modal = document.getElementById('equipo-modal');
const closeBtn = document.querySelector('.close-btn');
const modalNombre = document.getElementById('modal-nombre');
const modalRol = document.getElementById('modal-rol');
const modalFoto = document.getElementById('modal-foto');
const modalExperiencia = document.getElementById('modal-experiencia');

// Tamaño de cada scroll (ancho de un miembro + gap)
const itemWidth = equipoItems[0].offsetWidth + 20; // Asegúrate de sumar el gap
let scrollPosition = 0; // Posición inicial del carrusel

function updateButtons() {
  leftBtn.style.display = scrollPosition === 0 ? 'none' : 'flex';
  rightBtn.style.display = scrollPosition >= (equipoItems.length - 3) * itemWidth ? 'none' : 'flex';
}

// Mover a la izquierda
leftBtn.addEventListener('click', () => {
  if (scrollPosition > 0) {
    scrollPosition -= itemWidth;
    carousel.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    updateButtons();
  }
});

// Mover a la derecha
rightBtn.addEventListener('click', () => {
  if (scrollPosition < (equipoItems.length - 3) * itemWidth) {
    scrollPosition += itemWidth;
    carousel.scrollBy({ left: itemWidth, behavior: 'smooth' });
    updateButtons();
  }
});

// Actualiza botones al cargar
updateButtons();

// Evento al hacer clic en un miembro del equipo
equipoItems.forEach((item) => {
  item.addEventListener('click', () => {
    const fotoSrc = item.querySelector('img').src; // Tomar la imagen del miembro
    const nombre = item.dataset.nombre;
    const rol = item.dataset.rol;
    const experiencia = item.dataset.experiencia;

    // Actualizar contenido del modal
    modalFoto.src = fotoSrc;
    modalNombre.textContent = nombre;
    modalRol.textContent = rol;
    modalExperiencia.textContent = experiencia;

    // Mostrar modal
    modal.style.display = 'flex';
  });
});

// Cerrar modal
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Cerrar modal al hacer clic fuera del contenido
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const gridItems = document.querySelectorAll("#proyectos .grid-item");
  const mainContent = document.querySelector("main"); // Contenido principal para aplicar el blur

  // Crear el panel deslizante dinámicamente
  const slidePanel = document.createElement("div");
  slidePanel.classList.add("slide-panel");
  slidePanel.innerHTML = `
    <img class="panel-image" src="" alt="Imagen">
    <h3 class="panel-title"></h3>
    <p class="panel-description"></p>
  `;
  document.body.appendChild(slidePanel);

  const panelImage = slidePanel.querySelector(".panel-image");
  const panelTitle = slidePanel.querySelector(".panel-title");
  const panelDescription = slidePanel.querySelector(".panel-description");

// Mostrar el panel al hacer clic en un ítem

// Iterar sobre los elementos 'grid-item'
gridItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Obtener la fuente de la imagen, el título y la descripción desde el atributo data-description
    const imgSrc = item.querySelector("img").src;
    const title = item.querySelector(".text-box").textContent;
    const description = item.getAttribute("data-description");

    // Rellenar el contenido del panel
    panelImage.src = imgSrc;
    panelTitle.textContent = title;
    panelDescription.textContent = description;

    // Mostrar el panel y aplicar blur al contenido principal
    slidePanel.classList.add("show");
    mainContent.classList.add("blur");
  });
});


// Cerrar el panel al hacer clic fuera de él
document.addEventListener("click", (event) => {
  if (!slidePanel.contains(event.target) && !event.target.closest(".grid-item")) {
    // Ocultar el panel y quitar el blur
    slidePanel.classList.remove("show");
    mainContent.classList.remove("blur");
  }
})});
