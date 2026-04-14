const menuItems = ['projects', 'plugins', 'music'];
let menuIndex = 0;

function playSound()
{
    const s = document.getElementById('navSound');
    if (s) {
        s.currentTime = 0;
        s.play();
    }
}

function showSection(id)
{
    document.querySelectorAll('section').forEach(sec =>
        sec.classList.remove('active')
    );

    document.getElementById(id).classList.add('active');
}

function navigate(id)
{
    playSound();
    showSection(id);
}

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

document.addEventListener('keydown', (e) =>
{
    const isMenu = document.getElementById('about').classList.contains('active');

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

updateMenu();