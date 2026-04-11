function showSection(id)
{
    const sections = document.querySelectorAll('section');

    sections.forEach(sec =>
    {
        sec.classList.remove('active');
    });

    setTimeout(() =>
    {
        document.getElementById(id).classList.add('active');
    }, 50);
}