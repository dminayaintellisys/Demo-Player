export class VideoPlayerFrame {

    static KEY_SPACE = ' '
    static KEY_ARROW_UP = 'ArrowUp'
    static KEY_ARROW_DOWN = 'ArrowDown'

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
        const buttonVolume = frame.querySelector('#button-volume')
        const volumen = mdc.slider.MDCSlider.attachTo(frame.querySelector('.mdc-slider'));
        const replay = frame.querySelector('#button-replay');
        const fullScreen = frame.querySelector('#button-fullscreen')
        const currentTime = frame.querySelector('#current-time');
        const finalTime = frame.querySelector('#final-time');

        let lastVolumeValue = 0.5;
        this.video.volume = lastVolumeValue;
        let isMute = false;

        close.onclick = () => {
            // context.className = "slide-out";

            frame.addEventListener("animationend", (e) => {
                console.log('animation end')

            }, false);

            parent.removeChild(frame)
            document.onkeydown = null;
        }

        /*videoPlayer.onmouseover = (event) => {
            controlsBar.style.visibility = "visible"
        }

        videoPlayer.onmouseout = (event) => {
            controlsBar.style.visibility = "hidden"
        }*/

        this.buttonPlay.onclick = onclick

        this.video.onloadedmetadata = () => {
            finalTime.innerText = formatCurrentTime(this.video.duration)
        }

        this.video.ontimeupdate = () => {
            const progressValue = Math.round((this.video.currentTime / this.video.duration) * 100) / 100
            this.progress.progress = progressValue
            currentTime.innerText = formatCurrentTime(this.video.currentTime)
        }

        this.video.onended = () => {
            this.buttonPlay.innerText = "play_arrow";
        }

        frame.querySelector('#touch-progress').onclick = function(e) {
            var pos = (e.pageX  - this.offsetLeft) / this.offsetWidth;
            context.progress.progress = pos * context.video.duration
            console.log('progress: ' + pos)
        }

        this.progress.listen('MDCLinearProgress:click', (e) => {
            
            //video.currentTime = pos * video.duration;
        });

        buttonVolume.onclick = () => {

            if (!isMute) {

                this.video.volume = 0;
                buttonVolume.innerText = 'volume_off';
                volumen.disabled = true;
                volumen.value = 0;
                

            } else {

                this.video.volume = lastVolumeValue;
                buttonVolume.innerText = 'volume_up'
                volumen.disabled = false;
                volumen.value = lastVolumeValue;
            }
            
            isMute = !isMute;
        }

        volumen.listen('MDCSlider:input', () => {
            
            const volumeValue = Math.round(volumen.value * 10) / 10

            if (volumeValue != lastVolumeValue) {
                this.video.volume = volumeValue
            }
            
            lastVolumeValue = volumeValue;
        })

        replay.onclick = () => {
            const replay10Seconds = this.video.currentTime - 10;
            console.log('current time: ' +this.video.currentTime+ ', replay: ' +replay10Seconds)
            this.video.currentTime = replay10Seconds;
        }

        fullScreen.onclick = () => {
            
            if (!document.fullscreen) {
                
                videoPlayer.requestFullscreen()
                fullScreen.innerText = 'fullscreen_exit'
            
            } else {
                
                document.exitFullscreen()
                fullScreen.innerText = 'fullscreen'
            }
        }

        document.onfullscreenchange = () => {

            if (document.fullscreen) {
                frame.style.setProperty('--width-video-player', '100vw');
            } else {
                frame.style.setProperty('--width-video-player', '960px');
            }
        }

        document.onkeydown = (event) => {

            switch (event.key) {

                case VideoPlayerFrame.KEY_SPACE:
                    onclick()
                    break;

                case VideoPlayerFrame.KEY_ARROW_UP: 
                    volumeUp()
                    break;

                case VideoPlayerFrame.KEY_ARROW_DOWN:
                    volumeDown()
                    break;
            }
        }

        function onclick() {
            
            if (context.video.paused || context.video.ended) {
                context.video.play();
                context.buttonPlay.innerText = "pause";
            } else {
                context.video.pause();
                context.buttonPlay.innerText = "play_arrow";
            }
        }

        function volumeUp(value) {

            const volumeValue = Math.round((context.video.volume + 0.1) * 10) / 10;

            if (volumeValue < 1) {

                context.video.volume = volumeValue;
                volumen.value = volumeValue;

            } else {

                context.video.volume = 1;
                volumen.value = 1;
            }

            lastVolumeValue = volumeValue
        }

        function volumeDown() {

            const volumeValue = Math.round((context.video.volume - 0.1) * 10) / 10;

            if (volumeValue > 0) {

                context.video.volume = volumeValue;
                volumen.value = volumeValue;

            } else {

                context.video.volume = 0;
                volumen.value = 0;
            }

            lastVolumeValue = volumeValue
        }

        function formatCurrentTime(value) {

            const valueTrunc = Math.trunc(value)

            if (valueTrunc < 10) {
                return '00:0' + valueTrunc;
            }

            return '00:' + valueTrunc;
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