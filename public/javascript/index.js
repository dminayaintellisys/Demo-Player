import {VideoPlayerFrame} from './VideoPlayerFrame.mjs';

const main = document.querySelector('main')
const playList = document.querySelector('#play-list')
var videoPlayerFrame = null;

playList.onclick = (event) => {

    const element = event.target
    if (element.nodeName != "LI") return;

    if (!VideoPlayerFrame.exists()) {
        videoPlayerFrame = null;
    }

    if (!videoPlayerFrame) {
        videoPlayerFrame = new VideoPlayerFrame(main);
    }

    videoPlayerFrame.updateVideo(element.dataset.name, element.dataset.path)
}