const main = document.querySelector('main')
const playList = document.querySelector('#play-list')

playList.onclick = (event) => {

    let element = event.target
    if (element.nodeName != "LI") return;

    let videoPlayerFrame = main.querySelector('video-player-element');

    if (!videoPlayerFrame) {
        videoPlayerFrame = document.createElement('video-player-element');
        //videoPlayerFrame.name = element.dataset.name;
        main.append(videoPlayerFrame)
    
    } else {

        //videoPlayerFrame.name = element.dataset.name;
    }
}