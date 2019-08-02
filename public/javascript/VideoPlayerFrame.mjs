export class VideoPlayerFrame {

    static KEY_SPACE = ' '
    static KEY_ARROW_UP = 'ArrowUp'
    static KEY_ARROW_DOWN = 'ArrowDown'
    static KEY_ARROW_LEFT = 'ArrowLeft'
    static KEY_ARROW_RIGHT = 'ArrowRight'

    constructor(parent) {

        this._exists = true;
        let context = this;
        const template = document.querySelector("#video-player-template");
        parent.appendChild(template.content.cloneNode(true));
        const frame = parent.querySelector('#video-player-frame')

        const mediaQueryHover = window.matchMedia("(hover: hover)");
        const mediaQuery1640px = window.matchMedia('(max-width: 1640px)')
        const mediaQuery1224px = window.matchMedia('(max-width: 1224px)')
        this.mediaQuery768px = window.matchMedia('(max-width: 768px)')

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
        const buttonForward = frame.querySelector('#button-forward');
        const fullScreen = frame.querySelector('#button-fullscreen')
        const currentTime = frame.querySelector('#current-time');
        const finalTime = frame.querySelector('#final-time');
        const touchProgress = frame.querySelector('#touch-progress');

        let lastVolumeValue = 0.5;
        let isMute = false;
        let isTouch = false;
        let timeoutId;
        this.video.volume = lastVolumeValue;
        this.buttonPlay.onclick = onclick
        

        close.onclick = () => {
            parent.removeChild(frame)
        }

        if (mediaQueryHover.matches) {

            videoPlayer.onmouseover = (event) => {    
                controlsBar.style.visibility = "visible"
                cancelTimeout()
            }

            videoPlayer.onmouseout = (event) => {
                countDownTohiddenControlBar()
            }

        } else {

            videoPlayer.onclick = (event) => {

                if (!isTouch) {
                    controlsBar.style.visibility = "visible"
                } else {
                    controlsBar.style.visibility = "hidden"
                }
    
                isTouch = !isTouch
            }
        }

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

        touchProgress.onclick = function(e) {

            const position = e.pageX  - this.getBoundingClientRect().left
            const percent = (position / this.offsetWidth) * 100;
            const percentTime = context.video.duration / 100;
            context.video.currentTime = percent * percentTime;
        }

        buttonVolume.onclick = (event) => {

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
            this.video.currentTime -= 5;
        }

        buttonForward.onclick = () => {
            this.video.currentTime += 5;
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

                if (this.mediaQuery768px.matches) {
                    frame.style.setProperty('--width-video-player', '100vw');
                } else if (mediaQuery1224px.matches) {
                    frame.style.setProperty('--width-video-player', '624px');
                } else if (mediaQuery1640px.matches) {
                    frame.style.setProperty('--width-video-player', '768px');
                } else {
                    frame.style.setProperty('--width-video-player', '960px');
                }
            }
        }

        document.onkeydown = (event) => {

            switch (event.key) {

                case VideoPlayerFrame.KEY_SPACE:
                    onclick()
                    break;

                case VideoPlayerFrame.KEY_ARROW_LEFT:
                    this.video.currentTime -= 5;
                    break;

                case VideoPlayerFrame.KEY_ARROW_RIGHT:
                    this.video.currentTime += 5;
                    break;

                case VideoPlayerFrame.KEY_ARROW_UP: 
                    volumeUp()
                    break;

                case VideoPlayerFrame.KEY_ARROW_DOWN:
                    volumeDown()
                    break;
            }

            event.stopPropagation();
            event.preventDefault();
        }

        function onclick(event) {
            
            if (context.video.paused || context.video.ended) {
                context.video.play();
                context.buttonPlay.innerText = "pause";
            } else {
                context.video.pause();
                context.buttonPlay.innerText = "play_arrow";
            }

            if (event != undefined) event.stopPropagation();
        }

        function volumeUp() {

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

        function countDownTohiddenControlBar() {

            timeoutId = setTimeout(() => {
                controlsBar.style.visibility = "hidden";
                isTouch = false;
            }, 2000)
        }

        function cancelTimeout() {
            window.clearTimeout(timeoutId);
        }
    }

    updateVideo(name, path) {

        this.video.src = `${path}`;
        this.title.innerText = name;
        this.buttonPlay.innerText = "play_arrow"
        this.progress.progress = 0;
        this.buttonPlay.click();

        if (this.mediaQuery768px.matches) {
            document.querySelector('#title').innerText = name;
        }
    }

    static exists() {
        return document.querySelector('#video-player-frame') != null;
    }
}