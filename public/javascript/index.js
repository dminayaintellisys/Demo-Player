const videoPlayer = document.querySelector('#video-player');
const controlsBar = document.querySelector('#control-bar');
const video = document.querySelector('video')
const buttonPlay = document.querySelector('#button-play');
const progress = document.querySelector('#progressbar');

videoPlayer.onmouseover = (event) => {
    controlsBar.style.display = "block"
}

videoPlayer.onmouseout = (event) => {
    controlsBar.style.display = "none"
}

buttonPlay.onclick = () => {
    
    if (video.paused || video.ended) {
    
        video.play();
    
    } else {
    
        video.pause();
    }
}

video.addEventListener('loadedmetadata', function() {
    progress.setAttribute('max', video.duration);
});

video.addEventListener('timeupdate', function() {
    progress.value = Math.floor((video.currentTime / video.duration) * 100);
 });