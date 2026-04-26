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