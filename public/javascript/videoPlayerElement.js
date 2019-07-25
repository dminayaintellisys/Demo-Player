class VideoPlayerElement extends HTMLElement {

    constructor() {
        super();

        const context = this;
        const shadow = this.attachShadow({mode: "open"});
        const template = document.querySelector("#video-player-element");
        shadow.appendChild(template.content.cloneNode(true));

        const close = shadow.querySelector('#close');
        const videoPlayer = shadow.querySelector('#video-player');
        const controlsBar = shadow.querySelector('#control-bar');
        const video = shadow.querySelector('video');
        const buttonPlay = shadow.querySelector('#button-play');
        const progress = shadow.querySelector('#progressbar');

        close.onclick = () => {

            // context.className = "slide-out";
            
            context.addEventListener("animationend", (e) => {
                console.log('animation end')
                
            }, false);
            
            main.removeChild(context)
        }

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
    }

}

customElements.define("video-player-element", VideoPlayerElement);