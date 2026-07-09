// Banco de nombres organizado por personalidad
const nameBank = {
  elegante: ['Aurelia', 'Casimiro', 'Duquesa', 'Sirius', 'Valentina', 'Lord Whiskers', 'Ophelia', 'Constantino'],
  traviesa: ['Torbellino', 'Pícaro', 'Caos', 'Trufa Chueca', 'Bandido', 'Michi Destructor', 'Trueno', 'Garrapata Feliz'],
  dormilona: ['Siesta', 'Nube', 'Bostezo', 'Manta', 'Almohada', 'Perezoso Real', 'Colchón', 'Rocío Tibio']
};

let currentMood = 'elegante';
let counter = 0;
const usedNames = [];

const nameText = document.getElementById('nameText');
const generateBtn = document.getElementById('generateBtn');
const moodOptions = document.getElementById('moodOptions');
const historyList = document.getElementById('historyList');
const counterValue = document.getElementById('counterValue');
const clearBtn = document.getElementById('clearBtn');
const pawTrail = document.getElementById('pawTrail');
const portraitImg = document.getElementById('portraitImg');
const portraitPlaceholder = document.getElementById('portraitPlaceholder');

// Cambiar personalidad seleccionada
moodOptions.addEventListener('click', (e) => {
  const btn = e.target.closest('.mood-btn');
  if (!btn) return;

  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentMood = btn.dataset.mood;
});

// Generar un nombre nuevo evitando repetir el último mostrado
function pickName(mood) {
  const options = nameBank[mood];
  let name;
  do {
    name = options[Math.floor(Math.random() * options.length)];
  } while (name === nameText.textContent && options.length > 1);
  return name;
}

function addToHistory(name, mood) {
  usedNames.unshift({ name, mood });
  if (usedNames.length > 6) usedNames.pop();

  historyList.innerHTML = '';
  usedNames.forEach(entry => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${entry.name}</span><span class="history-tag">${entry.mood}</span>`;
    historyList.appendChild(li);
  });
}

// Trae una foto de gato real desde una API pública (cataas.com), con
// caché-busting para que cada clic traiga una distinta.
function loadPortrait() {
  portraitPlaceholder.hidden = false;
  portraitPlaceholder.classList.add('loading');
  portraitPlaceholder.querySelector('p').textContent = 'Buscando un gatito...';
  portraitImg.hidden = true;

  const url = `https://cataas.com/cat?width=500&height=375&t=${Date.now()}`;
  const img = new Image();

  img.onload = () => {
    portraitImg.src = url;
    portraitImg.hidden = false;
    portraitPlaceholder.hidden = true;
    portraitPlaceholder.classList.remove('loading');
  };

  img.onerror = () => {
    portraitPlaceholder.classList.remove('loading');
    portraitPlaceholder.querySelector('p').textContent = 'No se pudo cargar la imagen (revisa tu conexión).';
  };

  img.src = url;
}

generateBtn.addEventListener('click', () => {
  const name = pickName(currentMood);

  nameText.textContent = name;
  nameText.classList.remove('empty');

  counter += 1;
  counterValue.textContent = counter;

  addToHistory(name, currentMood);
  loadPortrait();

  // Pequeño efecto de "pulso" en el botón
  generateBtn.style.transform = 'scale(0.95)';
  setTimeout(() => (generateBtn.style.transform = ''), 120);
});

clearBtn.addEventListener('click', () => {
  usedNames.length = 0;
  historyList.innerHTML = '<li class="history-empty">Aún no has generado ningún nombre.</li>';
  counter = 0;
  counterValue.textContent = counter;
  nameText.textContent = '¿Cómo se llamará?';
  nameText.classList.add('empty');

  portraitImg.hidden = true;
  portraitPlaceholder.hidden = false;
  portraitPlaceholder.querySelector('p').textContent = 'El retrato aparecerá aquí';
});

// Rastro decorativo de huellitas que sigue el mouse (respeta reduced-motion)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  let lastPaw = 0;
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastPaw < 220) return;
    lastPaw = now;

    const paw = document.createElement('span');
    paw.className = 'paw';
    paw.textContent = '🐾';
    paw.style.left = e.clientX + 'px';
    paw.style.top = e.clientY + 'px';
    pawTrail.appendChild(paw);

    setTimeout(() => paw.remove(), 900);
  });
}

// Estado inicial
nameText.classList.add('empty');
