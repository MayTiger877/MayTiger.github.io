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
});

// ---------- LOADER ----------
document.addEventListener('DOMContentLoaded', () =>
{
    const loader = document.getElementById('loader');
    const bootSound = document.getElementById('bootSound');
    const bgMusic = document.getElementById('bgMusic');

    if (!sessionStorage.getItem('loaded'))
    {
        sessionStorage.setItem('loaded', 'true');

        // play boot sound
        if (bootSound)
        {
            bootSound.volume = 0.4;
            bootSound.play().catch(() => {});
        }

        setTimeout(() =>
        {
            loader.classList.add('hidden');

            // start background loop AFTER loader
            if (bgMusic)
            {
                bgMusic.volume = 0.2;
                bgMusic.play().catch(() => {});
            }

        }, 800);
    }
    else
    {
        loader.style.display = 'none';

        // start bg music immediately if returning
        if (bgMusic)
        {
            bgMusic.volume = 0.2;
            bgMusic.play().catch(() => {});
        }
    }
});