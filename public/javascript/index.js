import {VideoPlayerFrame} from './VideoPlayerFrame.mjs';

const main = document.querySelector('main')
const playList = document.querySelector('#play-list')
var videoPlayerFrame = null;
// videoPlayerFrame.updateVideo('Driving', 'https://www.videvo.net/videvo_files/converted/2017_12/preview/171124_C1_HD_012.mp449869.webm')

playList.onclick = (event) => {

    const element = event.target
    if (element.nodeName != "LI") return;

    if (!VideoPlayerFrame.exists()) {
        videoPlayerFrame = null;
    }

    if (!videoPlayerFrame) {
        videoPlayerFrame = new VideoPlayerFrame(main);
    }

    videoPlayerFrame.updateVideo(element.dataset.name, element.dataset.url)
}

playList.onmouseover = (event) => {

    const element = event.target
    if (element.nodeName != "LI") return;

    const video = element.querySelector('video')

    video.play()
}

playList.onmouseout = (event) => {

    const element = event.target
    if (element.nodeName != "LI") return;

    const video = element.querySelector('video')

    video.pause()
}