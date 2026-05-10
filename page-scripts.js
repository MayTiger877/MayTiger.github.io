// All navigation goes through the parent shell via postMessage
function goTo(url)
{
    window.parent.postMessage({ type: 'navigate', url: url }, '*');
}

// Video sync — tell shell to pause/resume BGM
function setupVideoAudioSync()
{
    const video = document.querySelector('.plugin-video');
    if (!video) return;

    video.addEventListener('play',  () => window.parent.postMessage({ type: 'videoPlay' },  '*'));
    video.addEventListener('pause', () => window.parent.postMessage({ type: 'videoPause' }, '*'));
    video.addEventListener('ended', () => window.parent.postMessage({ type: 'videoPause' }, '*'));
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
        if (audio.paused) { audio.play().catch(()=>{}); playBtn.textContent = '\u23F8'; }
        else              { audio.pause();               playBtn.textContent = '\u25B6'; }
    });

    rewind.addEventListener('click',  () => { audio.currentTime = Math.max(0, audio.currentTime - 10); });
    forward.addEventListener('click', () => { audio.currentTime = Math.min(audio.duration||0, audio.currentTime+10); });
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

document.addEventListener('DOMContentLoaded', () =>
{
    setupVideoAudioSync();
    setupPlayer();
});
