const particles = document.getElementById('particles');

// Лёгкие розоватые частицы на фоне
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

// Наклон карточки в сторону курсора
const profile = document.getElementById('profile');

if (profile && window.matchMedia('(pointer: fine)').matches) {
    profile.addEventListener('pointermove', (event) => {
        const rect = profile.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        const rotateY = (x - 0.5) * 9;
        const rotateX = (0.5 - y) * 9;

        profile.style.setProperty('--rx', rotateX + 'deg');
        profile.style.setProperty('--ry', rotateY + 'deg');
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

async function startMusic() {
    if (!audio) return;

    try {
        await audio.play();
        if (playerHint) playerHint.textContent = 'NOW PLAYING';
    } catch (error) {
        if (playerHint) playerHint.textContent = 'PRESS PLAY';
        console.log('Браузер ожидает нажатия пользователя для запуска музыки.');
    }
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

if (audio && playBtn && progress) {
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
        durationEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('durationchange', () => {
        if (Number.isFinite(audio.duration)) {
            durationEl.textContent = formatTime(audio.duration);
        }
    });

    audio.addEventListener('timeupdate', () => {
        currentTimeEl.textContent = formatTime(audio.currentTime);

        if (Number.isFinite(audio.duration) && audio.duration > 0) {
            progress.value = (audio.currentTime / audio.duration) * 100;
        }
    });

    progress.addEventListener('input', () => {
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
            audio.currentTime = (Number(progress.value) / 100) * audio.duration;
        }
    });

    audio.addEventListener('ended', () => {
        progress.value = 0;
        currentTimeEl.textContent = '0:00';
        updatePlayerState();
    });

    // Пытаемся включить музыку сразу при открытии страницы
    window.addEventListener('load', () => {
        startMusic();
    });

    // Если браузер заблокировал автозапуск, пробуем после первого нажатия
    document.addEventListener('pointerdown', (event) => {
        if (event.target.closest('#playBtn')) return;
        if (audio.paused) startMusic();
    }, { once: true });
}



// CLICK TO ENTER
const enterScreen = document.getElementById('enter-screen');

if (enterScreen) {
    document.body.classList.add('enter-locked');

    enterScreen.addEventListener('click', async () => {
        enterScreen.classList.add('is-leaving');
        document.body.classList.remove('enter-locked');

        const audio = document.getElementById('audio');

        if (audio) {
            try {
                await audio.play();
            } catch (error) {
                console.log('Нажми кнопку Play в плеере:', error);
            }
        }

        setTimeout(() => enterScreen.remove(), 850);
    }, { once: true });
}

