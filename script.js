const particles = document.getElementById('particles');

// Розоватые частицы
if (particles) {
    for (let i = 0; i < 180; i++) {
        const dot = document.createElement('span');
        dot.className = 'particle';

        const size = Math.random() * 3 + 1;
        const duration = Math.random() * 13 + 9;

        dot.style.setProperty('--x', Math.random() * 100 + 'vw');
        dot.style.setProperty('--size', size + 'px');
        dot.style.setProperty('--duration', duration + 's');
        dot.style.setProperty('--delay', -Math.random() * duration + 's');
        dot.style.setProperty('--opacity', Math.random() * 0.55 + 0.15);
        dot.style.setProperty('--drift', (Math.random() * 100 - 50) + 'px');

        particles.appendChild(dot);
    }
}

// Наклон карточки
const profile = document.getElementById('profile');

if (profile && window.matchMedia('(pointer: fine)').matches) {
    profile.addEventListener('pointermove', (event) => {
        const rect = profile.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        profile.style.setProperty('--rx', (0.5 - y) * 9 + 'deg');
        profile.style.setProperty('--ry', (x - 0.5) * 9 + 'deg');
    });

    profile.addEventListener('pointerleave', () => {
        profile.style.setProperty('--rx', '0deg');
        profile.style.setProperty('--ry', '0deg');
    });
}

// Музыкальный плеер
const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const playingIndicator = document.getElementById('playingIndicator');
const playerHint = document.getElementById('playerHint');

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return '0:00';

    const minutes = Math.floor(seconds / 60);
    const secondsLeft = Math.floor(seconds % 60);

    return `${minutes}:${String(secondsLeft).padStart(2, '0')}`;
}

function updatePlayerState() {
    if (!audio || !playBtn) return;

    if (audio.paused) {
        playBtn.textContent = '▶';
        playBtn.setAttribute('aria-label', 'Воспроизвести');
        playingIndicator?.classList.remove('active');

        if (playerHint) playerHint.textContent = 'PAUSED';
    } else {
        playBtn.textContent = 'Ⅱ';
        playBtn.setAttribute('aria-label', 'Пауза');
        playingIndicator?.classList.add('active');

        if (playerHint) playerHint.textContent = 'NOW PLAYING';
    }
}

async function startMusic() {
    if (!audio) return;

    try {
        await audio.play();
    } catch (error) {
        if (playerHint) playerHint.textContent = 'PRESS PLAY';
        console.error('Ошибка запуска музыки:', error);
    }
}

if (audio && playBtn) {
    playBtn.addEventListener('click', async () => {
        if (audio.paused) {
            await startMusic();
        } else {
            audio.pause();
        }
    });

    audio.addEventListener('play', updatePlayerState);
    audio.addEventListener('pause', updatePlayerState);

    audio.addEventListener('loadedmetadata', () => {
        if (durationEl) durationEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
        if (currentTimeEl) {
            currentTimeEl.textContent = formatTime(audio.currentTime);
        }

        if (progress && Number.isFinite(audio.duration) && audio.duration > 0) {
            progress.value = (audio.currentTime / audio.duration) * 100;
        }
    });

    if (progress) {
        progress.addEventListener('input', () => {
            if (Number.isFinite(audio.duration) && audio.duration > 0) {
                audio.currentTime = (Number(progress.value) / 100) * audio.duration;
            }
        });
    }

    audio.addEventListener('ended', () => {
        if (progress) progress.value = 0;
        if (currentTimeEl) currentTimeEl.textContent = '0:00';
        updatePlayerState();
    });

    audio.addEventListener('error', () => {
        if (playerHint) playerHint.textContent = 'AUDIO ERROR';
        console.error('Не удалось загрузить music.mp3');
    });

    updatePlayerState();
}

// CLICK TO ENTER — единственное место автоматического запуска
const enterScreen = document.getElementById('enter-screen');

if (enterScreen) {
    document.body.classList.add('enter-locked');

    enterScreen.addEventListener('click', async () => {
        enterScreen.classList.add('is-leaving');
        document.body.classList.remove('enter-locked');

        await startMusic();

        setTimeout(() => {
            enterScreen.remove();
        }, 850);
    }, { once: true });
}
