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
            playBtn.textContent = '⏸';
        }
        else
        {
            audio.pause();
            playBtn.textContent = '▶';
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
        playBtn.textContent = '▶';
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
const menuItems = ['about', 'projects', 'plugins', 'music'];
let menuIndex = 0;
let started = false;

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

// ---------- NAVIGATION ----------
function showSection(id)
{
    document.querySelectorAll('section').forEach(sec =>
        sec.classList.remove('active')
    );
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
}

function navigate(id)
{
    // Pause music preview when leaving the music page
    const sneak = document.getElementById('sneakAudio');
    if (sneak) sneak.pause();

    playSound();
    showSection(id);
}

// ---------- MENU UI ----------
function updateMenu()
{
    menuItems.forEach((id, i) =>
    {
        const el = document.getElementById('btn-' + id);
        if (!el) return;
        if (i === menuIndex)
            el.classList.add('active');
        else
            el.classList.remove('active');
    });
}

// ---------- CLICK HANDLERS ----------
function setupClicks()
{
    document.getElementById('btn-about').addEventListener('click',    () => navigate('about'));
    document.getElementById('btn-projects').addEventListener('click', () => navigate('projects'));
    document.getElementById('btn-plugins').addEventListener('click',  () => navigate('plugins'));
    document.getElementById('btn-music').addEventListener('click',    () => navigate('music'));
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

// ---------- KEYBOARD ----------
document.addEventListener('keydown', (e) =>
{
    if (!started) return;
    const isMenu = document.getElementById('home').classList.contains('active');
    if (!isMenu) return;

    if (e.key === 'ArrowDown')
    {
        menuIndex = (menuIndex + 1) % menuItems.length;
        updateMenu();
        playSound();
    }
    if (e.key === 'ArrowUp')
    {
        menuIndex = (menuIndex - 1 + menuItems.length) % menuItems.length;
        updateMenu();
        playSound();
    }
    if (e.key === 'Enter')
    {
        navigate(menuItems[menuIndex]);
    }
});

// ---------- LOADER ----------
document.addEventListener('DOMContentLoaded', () =>
{
    const startScreen = document.getElementById('start-screen');
    const loader      = document.getElementById('loader');
    const bootSound   = document.getElementById('bootSound');
    const bgMusic     = document.getElementById('bgMusic');
    const progress    = document.querySelector('.progress-fill');

    setupClicks();
    updateMenu();
    setupVideoAudioSync();
    setupPlayer();

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