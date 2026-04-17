const menuItems = ['about', 'projects', 'plugins', 'music'];
let menuIndex = 0;

// ---------- SOUND ----------
function playSound()
{
    const s = document.getElementById('navSound');
    if (s)
    {
        s.currentTime = 0;
        s.volume = 0.5;
        s.play();
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
    document.getElementById('btn-about').addEventListener('click', () => navigate('about'));
    document.getElementById('btn-projects').addEventListener('click', () => navigate('projects'));
    document.getElementById('btn-plugins').addEventListener('click', () => navigate('plugins'));
    document.getElementById('btn-music').addEventListener('click', () => navigate('music'));
}

// // ---------- KEYBOARD ----------
// document.addEventListener('keydown', (e) =>
// {
//     const isMenu = document.getElementById('home').classList.contains('active');

//     if (!isMenu) return;

//     if (e.key === 'ArrowDown')
//     {
//         menuIndex = (menuIndex + 1) % menuItems.length;
//         updateMenu();
//         playSound();
//     }

//     if (e.key === 'ArrowUp')
//     {
//         menuIndex = (menuIndex - 1 + menuItems.length) % menuItems.length;
//         updateMenu();
//         playSound();
//     }

//     if (e.key === 'Enter')
//     {
//         navigate(menuItems[menuIndex]);
//     }
// });

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () =>
{
    setupClicks();
    updateMenu();
    setupVideoAudioSync();
});

// ---------- LOADER ----------
document.addEventListener('DOMContentLoaded', () =>
{
    const startScreen = document.getElementById('start-screen');
    const loader = document.getElementById('loader');

    const bootSound = document.getElementById('bootSound');
    const bgMusic = document.getElementById('bgMusic');

    const progress = document.querySelector('.progress-fill');

    function startExperience()
    {
        document.removeEventListener('keydown', startExperience);
        document.removeEventListener('click', startExperience);

        startScreen.style.display = 'none';

        
        // RESET progress (important)
        if (progress)
        {
            progress.classList.remove('active');
            void progress.offsetWidth; // force reflow
            setTimeout(() => progress.classList.add('active'), 50);
            // progress.classList.add('active');
        }

        // play boot sound
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
                bgMusic.volume = 0.1;
                bgMusic.play().catch(() => {});
            }

        }, 800);

        const video = document.querySelector('.plugin-video');

        if (video)
        {
            video.muted = false;
            video.volume = 1;
        
            // force browser to "unlock" video audio
            video.play().then(() =>
            {
                video.pause(); // pause immediately so user can press play later
                video.currentTime = 0;
            }).catch(() => {});
        }
    }

    // wait for ANY interaction
    document.addEventListener('keydown', startExperience);
    document.addEventListener('click', startExperience);
});

document.addEventListener('click', enableAudio, { once: true });
document.addEventListener('keydown', enableAudio, { once: true });

function enableAudio()
{
    const bgMusic = document.getElementById('bgMusic');

    if (bgMusic)
    {
        bgMusic.volume = 0.2;
        bgMusic.play().catch(() => {});
    }
}

function setupVideoAudioSync()
{
    const video = document.querySelector('.plugin-video');
    const bgMusic = document.getElementById('bgMusic');

    if (!video || !bgMusic) return;

    // When video starts playing → pause music
    video.addEventListener('play', () =>
    {
        bgMusic.pause();
    });

    // When video is paused → resume music
    video.addEventListener('pause', () =>
    {
        bgMusic.play().catch(() => {});
    });

    // When video ends → resume music
    video.addEventListener('ended', () =>
    {
        bgMusic.play().catch(() => {});
    });
}