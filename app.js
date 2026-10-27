/**
 * ZapStickers - Interactive Experience Logic
 * Web Audio Synth, Sticker Generator, Confetti Cannon & Pack Modal
 */

// ==========================================================================
// Web Audio Synth for Interactive Meme Sound Effects
// ==========================================================================
class SoundFX {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Comedic Pop sound (Sticker pick/add)
  playPop() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;

    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Boing / Cartoon Spring (for meme laughs)
  playBoing() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    const now = this.ctx.currentTime;

    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(440, now + 0.15);
    osc.frequency.linearRampToValueAtTime(260, now + 0.3);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // WhatsApp Incoming Message Ding
  playDing() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;

    osc.frequency.setValueAtTime(784, now); // G5
    osc.frequency.setValueAtTime(1046.5, now + 0.08); // C6

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  // Airhorn / Hype synth (Victory / Confetti sound)
  playAirhorn() {
    this.init();
    const notes = [466.16, 466.16, 466.16, 466.16, 622.25];
    const delays = [0, 0.1, 0.2, 0.3, 0.42];

    delays.forEach((delay, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      const now = this.ctx.currentTime + delay;

      osc.frequency.setValueAtTime(notes[i], now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (i === 4 ? 0.4 : 0.08));

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + (i === 4 ? 0.4 : 0.08));
    });
  }
}

const sfx = new SoundFX();

// ==========================================================================
// Canvas Confetti Generator
// ==========================================================================
function launchConfetti() {
  const count = 70;
  const colors = ['#25D366', '#FFFFFF', '#FF5A1F', '#FFD21F', '#2F80ED'];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-particle';
    const size = Math.random() * 8 + 6;
    const bg = colors[Math.floor(Math.random() * colors.length)];

    Object.assign(el.style, {
      position: 'fixed',
      width: `${size}px`,
      height: `${size * (Math.random() > 0.5 ? 1 : 2)}px`,
      backgroundColor: bg,
      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      top: '50%',
      left: '50%',
      zIndex: '9999',
      pointerEvents: 'none',
      transform: 'translate(-50%, -50%)',
      transition: 'all 1s cubic-bezier(0.25, 1, 0.5, 1)'
    });

    document.body.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 350 + 150;
    const destX = Math.cos(angle) * velocity;
    const destY = Math.sin(angle) * velocity - 100;
    const rot = Math.random() * 720 - 360;

    requestAnimationFrame(() => {
      el.style.transform = `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) rotate(${rot}deg)`;
      el.style.opacity = '0';
    });

    setTimeout(() => {
      el.remove();
    }, 1100);
  }
}

// ==========================================================================
// Toast Notification Controller
// ==========================================================================
function showToast(message, badgeText = '✓') {
  const toast = document.getElementById('toastNotice');
  const toastText = document.getElementById('toastNoticeText');
  const toastBadge = document.getElementById('toastNoticeBadge');

  if (toast && toastText) {
    toastText.innerText = message;
    if (toastBadge) toastBadge.innerText = badgeText;
    toast.classList.add('show');
    sfx.playDing();

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }
}

// ==========================================================================
// Modal Controller (Simulated WhatsApp Pack Installation)
// ==========================================================================
const modalOverlay = document.getElementById('packModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalConfirmBtn = document.getElementById('modalConfirmBtn');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalImage = document.getElementById('modalPackImage');
const modalProgress = document.getElementById('modalProgress');

function openPackModal(title, desc, imgSrc) {
  if (!modalOverlay) return;
  sfx.playPop();

  if (modalTitle) modalTitle.innerText = title;
  if (modalDesc) modalDesc.innerText = desc;
  if (modalImage) modalImage.src = imgSrc;
  if (modalProgress) modalProgress.style.width = '0%';
  if (modalConfirmBtn) {
    modalConfirmBtn.disabled = false;
    modalConfirmBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"/>
      </svg>
      Adicionar ao WhatsApp Agora
    `;
  }

  modalOverlay.classList.add('active');
}

function closePackModal() {
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
  }
}

if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closePackModal);
}

if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closePackModal();
  });
}

// Simulate WhatsApp Installation Progress
if (modalConfirmBtn) {
  modalConfirmBtn.addEventListener('click', () => {
    modalConfirmBtn.disabled = true;
    modalConfirmBtn.innerText = 'Instalando no WhatsApp...';
    if (modalProgress) modalProgress.style.width = '100%';

    sfx.playPop();

    setTimeout(() => {
      sfx.playAirhorn();
      launchConfetti();
      modalConfirmBtn.innerText = 'Pacote Adicionado com Sucesso! 🎉';
      showToast('Pacote sincronizado com o seu WhatsApp!', '🔥');

      setTimeout(() => {
        closePackModal();
      }, 1500);
    }, 1200);
  });
}

// ==========================================================================
// Setup Pack Buttons
// ==========================================================================
document.querySelectorAll('.pack-add-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.currentTarget.closest('.pack-card');
    const title = card.querySelector('.pack-title')?.innerText || 'Pacote de Figurinhas';
    const desc = card.querySelector('.pack-desc')?.innerText || 'Pronto para uso';
    const img = card.querySelector('.pack-main-sticker')?.src || 'assets/mascot-capy.png';

    openPackModal(title, desc, img);
  });
});

// Setup Main Hero CTA Button
document.querySelectorAll('.js-hero-cta').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openPackModal(
      'Super Pack Oficial 2026',
      'Inclui Capivara Sincera, Vira-Lata Caramelo, Gato Chocadíssimo e +150 figurinhas animadas em HD.',
      'assets/mascot-capy.png'
    );
  });
});

// ==========================================================================
// Interactive AI Sticker Maker (Card 1 Playground)
// ==========================================================================
const makerInput = document.getElementById('makerInput');
const makerSpeechBubble = document.getElementById('makerSpeechBubble');
const makerStickerChar = document.getElementById('makerStickerChar');
const moodChips = document.querySelectorAll('.mood-chip');
const makerActionBtn = document.getElementById('makerActionBtn');

const moodPresets = {
  deboche: {
    quote: 'Falou pouco mas falou bosta 💅',
    avatar: 'assets/dog-caramelo.png'
  },
  clt: {
    quote: 'Segundou com vontade de me aposentar ☕',
    avatar: 'assets/flork-coffee.png'
  },
  gatos: {
    quote: 'Tá tudo bem (não tá nada bem) 🥲',
    avatar: 'assets/cat-crying.png'
  },
  capy: {
    quote: 'Paz terrível, nada me abala hoje 😎',
    avatar: 'assets/mascot-capy.png'
  },
  fogo: {
    quote: 'Soltei a bomba e saí do grupo 🔥',
    avatar: 'assets/flame-fire.png'
  }
};

if (makerInput && makerSpeechBubble) {
  makerInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    makerSpeechBubble.innerText = val ? val : 'Digite algo para a sua figurinha...';
  });
}

moodChips.forEach(chip => {
  chip.addEventListener('click', () => {
    moodChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    sfx.playPop();

    const moodKey = chip.getAttribute('data-mood');
    const preset = moodPresets[moodKey];

    if (preset) {
      if (makerInput) makerInput.value = preset.quote;
      if (makerSpeechBubble) {
        makerSpeechBubble.innerText = preset.quote;
        makerSpeechBubble.style.transform = 'scale(1.08)';
        setTimeout(() => makerSpeechBubble.style.transform = 'scale(1)', 150);
      }
      if (makerStickerChar) {
        makerStickerChar.src = preset.avatar;
        makerStickerChar.style.transform = 'rotate(-8deg) scale(1.1)';
        setTimeout(() => makerStickerChar.style.transform = 'rotate(0deg) scale(1)', 250);
      }
    }
  });
});

if (makerActionBtn) {
  makerActionBtn.addEventListener('click', () => {
    sfx.playAirhorn();
    launchConfetti();
    showToast('Sua figurinha personalizada foi copiada!', '✨');
  });
}

// ==========================================================================
// Interactive Soundboard (Card 2 Playground)
// ==========================================================================
document.querySelectorAll('.sound-item').forEach(item => {
  item.addEventListener('click', () => {
    const type = item.getAttribute('data-sound');
    if (type === 'boing') {
      sfx.playBoing();
    } else if (type === 'pop') {
      sfx.playPop();
    } else if (type === 'ding') {
      sfx.playDing();
    } else if (type === 'horn') {
      sfx.playAirhorn();
    }
    showToast(`Áudio: "${item.querySelector('.sound-title').innerText}" reproduzido!`, '🔊');
  });
});

// Chat Audio Message in Phone Mockup
const chatAudioPlayBtn = document.getElementById('chatAudioPlayBtn');
if (chatAudioPlayBtn) {
  chatAudioPlayBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sfx.playBoing();
    showToast('Áudio de meme do Zap reproduzido! 🍻', '🔊');
  });
}

// ==========================================================================
// Category Filtering for Sticker Gallery
// ==========================================================================
const filterBtns = document.querySelectorAll('.filter-btn');
const packCards = document.querySelectorAll('.pack-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    sfx.playPop();

    const cat = btn.getAttribute('data-filter');

    packCards.forEach(card => {
      const cardCat = card.getAttribute('data-category');
      if (cat === 'all' || cardCat === cat) {
        card.style.display = 'flex';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ==========================================================================
// 3D Mouse Parallax on Hero Section
// ==========================================================================
const heroStage = document.getElementById('heroStage');
const floatElements = document.querySelectorAll('.hero-stage .floating-element');

if (heroStage && window.innerWidth > 768) {
  heroStage.addEventListener('mousemove', (e) => {
    const rect = heroStage.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    floatElements.forEach((el, index) => {
      const depth = (index + 1) * 0.025;
      const moveX = x * depth;
      const moveY = y * depth;
      el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
  });

  heroStage.addEventListener('mouseleave', () => {
    floatElements.forEach(el => {
      el.style.transform = '';
    });
  });
}

// Clicking any sticker on page produces fun pop
document.querySelectorAll('img[src*="assets/"]').forEach(img => {
  img.addEventListener('click', () => {
    sfx.playPop();
  });
});
