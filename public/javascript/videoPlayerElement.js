class VideoPlayerElement extends HTMLElement {

    title = {}
    video = {}

    constructor() {
        super();

        const context = this;
        const shadow = this.attachShadow({mode: "open"});
        const template = document.querySelector("#video-player-element");
        shadow.appendChild(template.content.cloneNode(true));

        const close = shadow.querySelector('#close');
        const videoPlayer = shadow.querySelector('#video-player');
        const controlsBar = shadow.querySelector('#control-bar');
        this.video = shadow.querySelector('video');
        const buttonPlay = shadow.querySelector('#button-play');
        const progress = shadow.querySelector('#progressbar');
        this.title = shadow.querySelector('#title')

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
            
            if (this.video.paused || this.video.ended) {
                this.video.play();
                buttonPlay.style.backgroundImage = "url('/images/pause.svg')";
            } else {
                this.video.pause();
                buttonPlay.style.backgroundImage = "url('/images/play.svg')";
            }
        }
        
        this.video.addEventListener('loadedmetadata', function() {
            progress.setAttribute('max', this.video.duration);
        });
        
        this.video.addEventListener('timeupdate', function() {
            progress.value = Math.floor((this.video.currentTime / this.video.duration) * 100);
        });
    }

    set path(value) {
        this.video.src = `/videos/${value}`
    }

    set name(value) {
        this.title.innerText = value;
    }

}

customElements.define("video-player-element", VideoPlayerElement);