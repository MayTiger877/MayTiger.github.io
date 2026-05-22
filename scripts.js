// ---------- NAVIGATION ----------
function goTo(url)
{
    saveBgMusicTime(); // save position before leaving
    playSound();
    setTimeout(() => { window.location.href = url; }, 120);
}

// ---------- SOUND ----------
function playSound()
{
    const s = document.getElementById('navSound');
    if (s)
    {
        s.currentTime = 0;
        s.volume = 0.4;
        s.play().catch(() => {});
    }
}

// Save BGM position to sessionStorage before navigating away
function saveBgMusicTime()
{
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic && !bgMusic.paused)
    {
        sessionStorage.setItem('bgMusicTime', bgMusic.currentTime);
    }
}

// Start BGM, restoring position from last page if available
function startBgMusic()
{
    const bgMusic = document.getElementById('bgMusic');
    if (!bgMusic) return;

    const savedTime = parseFloat(sessionStorage.getItem('bgMusicTime') || '0');
    if (savedTime > 0)
    {
        bgMusic.currentTime = savedTime;
    }

    bgMusic.volume = 0.8;
    bgMusic.play().catch(() => {});
}

// Also save on browser back/forward or tab close
window.addEventListener('beforeunload', saveBgMusicTime);
window.addEventListener('pagehide',     saveBgMusicTime);

// ---------- VIDEO / BGMUSIC SYNC ----------
function setupVideoAudioSync()
{
    const video   = document.querySelector('.plugin-video');
    const bgMusic = document.getElementById('bgMusic');
    if (!video || !bgMusic) return;

    video.addEventListener('play',  () => bgMusic.pause());
    video.addEventListener('pause', () => startBgMusic());
    video.addEventListener('ended', () => startBgMusic());
}

// ---------- PS2 AUDIO PLAYER ----------
function setupPlayer()
{
    const audio    = document.getElementById('sneakAudio');
    const playBtn  = document.getElementById('player-play');
    const rewind   = document.getElementById('player-rewind');
    const forward  = document.getElementById('player-forward');
    const fill     = document.getElementById('player-fill');
    const head     = document.getElementById('player-head');
    const scrubbar = document.getElementById('player-scrubbar');
    const current  = document.getElementById('player-current');
    const total    = document.getElementById('player-total');
    const volume   = document.getElementById('player-volume');

    if (!audio || !playBtn) return;

    audio.volume = parseFloat(volume.value);

    function fmt(s)
    {
        const m   = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return m + ':' + String(sec).padStart(2, '0');
    }

    playBtn.addEventListener('click', () =>
    {
        if (audio.paused)
        {
            audio.play().catch(() => {});
            playBtn.textContent = '\u23F8';
        }
        else
        {
            audio.pause();
            playBtn.textContent = '\u25B6';
        }
    });

    rewind.addEventListener('click',  () => { audio.currentTime = Math.max(0, audio.currentTime - 10); });
    forward.addEventListener('click', () => { audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10); });
    volume.addEventListener('input',  () => { audio.volume = parseFloat(volume.value); });

    audio.addEventListener('timeupdate', () =>
    {
        if (!audio.duration) return;
        const pct = (audio.currentTime / audio.duration) * 100;
        fill.style.width = pct + '%';
        head.style.left  = pct + '%';
        current.textContent = fmt(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => { total.textContent = fmt(audio.duration); });

    audio.addEventListener('ended', () =>
    {
        playBtn.textContent = '\u25B6';
        fill.style.width = '0%';
        head.style.left  = '0%';
        current.textContent = '0:00';
    });

    scrubbar.addEventListener('click', (e) =>
    {
        if (!audio.duration) return;
        const rect = scrubbar.getBoundingClientRect();
        audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
    });
}

// ---------- MAIN ----------
document.addEventListener('DOMContentLoaded', () =>
{
    const startScreen = document.getElementById('start-screen');
    const loader      = document.getElementById('loader');
    const bootSound   = document.getElementById('bootSound');
    const progress    = document.querySelector('.progress-fill');

    setupVideoAudioSync();
    setupPlayer();

    const isIntro = window.location.pathname.endsWith('index.html')
                 || window.location.pathname === '/'
                 || window.location.pathname.endsWith('/');

    // ── INTRO PAGE ──────────────────────────────────────────────────
    if (isIntro)
    {
        // Clear saved state so intro always plays fresh
        sessionStorage.removeItem('introPlayed');
        sessionStorage.removeItem('bgMusicTime');

        function startExperience()
        {
            if (sessionStorage.getItem('introPlayed')) return;
            sessionStorage.setItem('introPlayed', '1');

            document.removeEventListener('keydown', startExperience, { capture: true });
            document.removeEventListener('click',   startExperience, { capture: true });

            startScreen.style.display = 'none';

            if (progress)
            {
                progress.classList.remove('active');
                void progress.offsetWidth;
                setTimeout(() => progress.classList.add('active'), 50);
            }

            if (bootSound)
            {
                bootSound.volume = 0.3;
                bootSound.play().catch(() => {});
            }

            setTimeout(() =>
            {
                loader.classList.add('hidden');
                startBgMusic();
                setTimeout(() => { window.location.href = 'menu.html'; }, 400);
            }, 800);
        }

        document.addEventListener('keydown', startExperience, { capture: true });
        document.addEventListener('click',   startExperience, { capture: true });
        return;
    }

    // ── ALL OTHER PAGES ─────────────────────────────────────────────
    if (startScreen) startScreen.style.display = 'none';
    if (loader)      loader.style.display = 'none';

    if (sessionStorage.getItem('introPlayed'))
    {
        // Restore and resume BGM from where it left off
        startBgMusic();
    }
    else
    {
        // Direct link without intro — start on first interaction
        document.addEventListener('click',   startBgMusic, { once: true });
        document.addEventListener('keydown', startBgMusic, { once: true });
    }
});

// // ────────────────── Carousel ────────────────────────────────────────────

const options = document.querySelectorAll(".option");

let currentIndex = 0;

options.forEach((option, index) =>
{
    option.addEventListener("click", () =>
    {
        setActive(index);
    });
});

// // Function to activate selected slide
// function setActive(index)
// {
//     options.forEach(o => o.classList.remove("active"));
//     options[index].classList.add("active");
//     currentIndex = index;
// }

// // Auto slide every 3 seconds
// setInterval(() => 
// {
//     currentIndex = (currentIndex + 1) % options.length;
//     setActive(currentIndex);
// }, 3000);

let autoSlide;

// Function to activate selected slide
function setActive(index)
{
    options.forEach(o => o.classList.remove("active"));

    options[index].classList.add("active");

    currentIndex = index;
}

// Start auto slider
function startSlider()
{
    autoSlide = setInterval(() =>
    {
        currentIndex = (currentIndex + 1) % options.length;

        setActive(currentIndex);

    }, 3000);
}

// Reset timer after manual click
options.forEach((option, index) =>
{
    option.addEventListener("click", () =>
    {
        setActive(index);

        clearInterval(autoSlide);

        startSlider();
    });
});

// Init slider
startSlider();