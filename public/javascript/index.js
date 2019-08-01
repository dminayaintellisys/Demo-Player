import {VideoPlayerFrame} from './VideoPlayerFrame.mjs';

const header = document.querySelector('header')
const main = document.querySelector('main')
const playList = document.querySelector('#play-list')
const searchFrame = document.querySelector('#search-frame')
const inputSearch = document.querySelector('#input-search')
const buttonSearch = document.querySelector('#button-search')

const xHttp = new XMLHttpRequest();
let videoPlayerFrame = null;
const mediaQuery = window.matchMedia("(max-width: 768px)");
const mediaQueryHover = window.matchMedia("(hover: hover)");

search()

playList.onclick = (event) => {

    const element = event.target
    if (element.nodeName != "LI") return;

    if (!VideoPlayerFrame.exists()) {
        videoPlayerFrame = null;
    }

    if (!videoPlayerFrame) {

        videoPlayerFrame = new VideoPlayerFrame(main);
        
        let state = {
            name: element.dataset.name,
            url: element.dataset.url
        };
        
        history.pushState(state, "Video player", "video-player");

        if (mediaQuery.matches) {

            header.style.display = "none"
            searchFrame.style.display = "none"
        }
        
    }

    videoPlayerFrame.updateVideo(element.dataset.name, element.dataset.url)
}

if (mediaQueryHover.matches) {
    
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

window.onpopstate = (event) => {

    if (!event.state) {

        main.removeChild(document.querySelector('#video-player-frame'))

        if (mediaQuery.matches) {

            header.style.display = 'flex'
            searchFrame.style.display = "flex"
        }

    } else {

        videoPlayerFrame = new VideoPlayerFrame(main);
        videoPlayerFrame.updateVideo(event.state.name, event.state.url)
    }
}