export class VideoPlayerFrame {

    constructor(parent) {

        this._exists = true;
        let context = this;
        const template = document.querySelector("#video-player-template");
        parent.appendChild(template.content.cloneNode(true));
        const frame = parent.querySelector('#video-player-frame')

        const close = frame.querySelector('#close');
        const videoPlayer = frame.querySelector('#video-player');
        const controlsBar = frame.querySelector('#control-bar');
        this.video = frame.querySelector('video');
        this.buttonPlay = frame.querySelector('#button-play');
        this.title = frame.querySelector('#video-player-frame-title')
        this.progress = mdc.linearProgress.MDCLinearProgress.attachTo(frame.querySelector('#progressbar'))
        const volumen = mdc.slider.MDCSlider.attachTo(frame.querySelector('.mdc-slider'));

        close.onclick = () => {
            // context.className = "slide-out";

            frame.addEventListener("animationend", (e) => {
                console.log('animation end')

            }, false);

            parent.removeChild(frame)
        }

        videoPlayer.onmouseover = (event) => {
            controlsBar.style.visibility = "visible"
        }

        videoPlayer.onmouseout = (event) => {
            controlsBar.style.visibility = "hidden"
        }

        this.buttonPlay.onclick = () => {

            if (this.video.paused || this.video.ended) {
                this.video.play();
                this.buttonPlay.innerText = "pause";
            } else {
                this.video.pause();
                this.buttonPlay.innerText = "play_arrow";
            }
        }

        this.video.ontimeupdate = () => {
            const progressValue = Math.round((this.video.currentTime / this.video.duration) * 100) / 100
            this.progress.progress = progressValue
            console.log('progress: ' + progressValue)
        }

        this.video.onended = () => {
            this.buttonPlay.innerText = "play_arrow";
            this.progress.progress = 0;
        }

    }

    updateVideo(name, path) {

        this.video.src = `/videos/${path}`;
        this.title.innerText = name;

        this.buttonPlay.innerText = "play_arrow"
        this.progress.progress = 0;
    }

    static exists() {
        return document.querySelector('#video-player-frame') != null;
    }
}