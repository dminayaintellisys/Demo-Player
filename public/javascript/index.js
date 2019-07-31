import {VideoPlayerFrame} from './VideoPlayerFrame.mjs';

const main = document.querySelector('main')
const playList = document.querySelector('#play-list')
const inputSearch = document.querySelector('#input-search')
const buttonSearch = document.querySelector('#button-search')

const xHttp = new XMLHttpRequest();
var videoPlayerFrame = null;
// videoPlayerFrame.updateVideo('Driving', 'https://www.videvo.net/videvo_files/converted/2017_12/preview/171124_C1_HD_012.mp449869.webm')


search()

playList.onclick = (event) => {

    const element = event.target
    if (element.nodeName != "LI") return;

    if (!VideoPlayerFrame.exists()) {
        videoPlayerFrame = null;
    }

    if (!videoPlayerFrame) {
        videoPlayerFrame = new VideoPlayerFrame(main);
        
        /*let stateObj = {
            foo: "bar",
        };
        
        history.pushState(stateObj, "page 2", "bar.html");
        */
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

buttonSearch.onclick = search

function search() {

    xHttp.open("GET", `/search/?text=${encodeURIComponent(inputSearch.value)}`, true);
    xHttp.send()

    xHttp.onreadystatechange = () => {
        
        if (xHttp.readyState == XMLHttpRequest.DONE && xHttp.status == 200) {
    
            const videos = JSON.parse(xHttp.response)
            const template = document.querySelector("#item-template")

            console.log('search()')

            playList.innerHTML = ""
    
            for (let video of videos) {
    
                const content = template.content.cloneNode(true)
                const li = content.querySelector('li');
                const videoElement = content.querySelector('video');
                const title = content.querySelector('h3')
    
                li.dataset.name = video.name;
                li.dataset.url = video.url;
                videoElement.src = video.url;
                title.innerText = video.name;
    
                playList.appendChild(content);
            }
        }
    }
}

/*history.onpopstate = (state) => {
    console.log('onpopstate')
}*/