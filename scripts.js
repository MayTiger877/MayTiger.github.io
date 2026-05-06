// ---------- NAVIGATION ----------
// Simple page navigation - replaces the old section-switching system
function goTo(url)
{
    playSound();
    // Small delay so the nav sound plays before the page changes
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

// ---------- VIDEO / BGMUSIC SYNC ----------
function setupVideoAudioSync()
{
    const video   = document.querySelector('.plugin-video');
    const bgMusic = document.getElementById('bgMusic');
    if (!video || !bgMusic) return;

    video.addEventListener('play',  () => bgMusic.pause());
    video.addEventListener('pause', () => bgMusic.play().catch(() => {}));
    video.addEventListener('ended', () => bgMusic.play().catch(() => {}));
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

    rewind.addEventListener('click', () =>
    {
        audio.currentTime = Math.max(0, audio.currentTime - 10);
    });

    forward.addEventListener('click', () =>
    {
        audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
    });

    volume.addEventListener('input', () =>
    {
        audio.volume = parseFloat(volume.value);
    });

    audio.addEventListener('timeupdate', () =>
    {
        if (!audio.duration) return;
        const pct = (audio.currentTime / audio.duration) * 100;
        fill.style.width = pct + '%';
        head.style.left  = pct + '%';
        current.textContent = fmt(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () =>
    {
        total.textContent = fmt(audio.duration);
    });

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
        const pct  = (e.clientX - rect.left) / rect.width;
        audio.currentTime = pct * audio.duration;
    });
}

// ---------- LOADER ----------
let started = false;

document.addEventListener('DOMContentLoaded', () =>
{
    const startScreen = document.getElementById('start-screen');
    const loader      = document.getElementById('loader');
    const bootSound   = document.getElementById('bootSound');
    const bgMusic     = document.getElementById('bgMusic');
    const progress    = document.querySelector('.progress-fill');

    setupVideoAudioSync();
    setupPlayer();

    // Only show start screen on the home page
    const isHome = window.location.pathname.endsWith('intro.html')
                || window.location.pathname === '/'
                || window.location.pathname.endsWith('/');

    if (!isHome)
    {
        // On inner pages: skip start screen, just start bg music immediately
        if (startScreen) startScreen.style.display = 'none';
        if (loader)      loader.style.display = 'none';

        // Resume bg music on first click (browser autoplay policy)
        document.addEventListener('click', () =>
        {
            if (bgMusic && bgMusic.paused)
            {
                bgMusic.volume = 0.4;
                bgMusic.play().catch(() => {});
            }
        }, { once: true });

        return;
    }

    // Home page: show start screen and loader as before
    function startExperience()
    {
        if (started) return;
        
        started = true;

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
            if (bgMusic)
            {
                bgMusic.volume = 0.4;
                bgMusic.play().catch(() => {});
            }
        }, 800);
    }

    document.addEventListener('keydown', startExperience, { capture: true });
    document.addEventListener('click',   startExperience, { capture: true });
});
