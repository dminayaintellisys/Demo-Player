import {VideoPlayerFrame} from './VideoPlayerFrame.mjs';

const header = document.querySelector('header')
const title = document.querySelector('#title')
const main = document.querySelector('main')
const playList = document.querySelector('#play-list')
const searchFrame = document.querySelector('#search-frame')
const inputSearch = document.querySelector('#input-search')
const buttonSearch = document.querySelector('#button-search')
const buttonClosePlayer = document.querySelector('#close-player')
const logout = document.querySelector('nav a')

const xHttp = new XMLHttpRequest();
let videoPlayerFrame = null;
const mediaQuery768px = window.matchMedia("(max-width: 768px)");
const mediaQueryHover = window.matchMedia("(hover: hover)");

buttonSearch.onclick = search
buttonClosePlayer.onclick = closePlayer

// Esta linea colisionaba con la rama principal, el problema se resolvio.

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
        
        // history.pushState(state, "Video player", "video-player");

        if (mediaQuery768px.matches) {
            setStyleVideoPlayerShow()
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

window.onpopstate = (event) => {

    if (!event.state) {

        closePlayer()

    } else {

        videoPlayerFrame = new VideoPlayerFrame(main);
        videoPlayerFrame.updateVideo(event.state.name, event.state.url)
    }
} 

mediaQuery768px.addListener((query) => {

    if (query.matches) {

        header.style.height = "64px"
        header.style.boxShadow = "none"
        title.style.fontSize = '1.3em'

        if (!VideoPlayerFrame.exists()) return;

        setStyleVideoPlayerShow()

    } else {

        setStyleVideoPlayerHide()

        header.style.height = "72px"
        header.style.boxShadow = "0px 2px 8px lightgray"
        title.style.fontSize = '1.5em'
    }

});

function search() {

    console.log("search");

    xHttp.open("GET", `/search/?text=${encodeURIComponent(inputSearch.value)}`, true);
    xHttp.send()

    xHttp.onreadystatechange = () => {
        
        if (xHttp.readyState == XMLHttpRequest.DONE && xHttp.status == 200) {
    
            const videos = JSON.parse(xHttp.response)
            const template = document.querySelector("#item-template")

            playList.innerHTML = ""
    
            for (let video of videos) {
    
                const content = template.content.cloneNode(true)
                const li = content.querySelector('li');
                const videoElement = content.querySelector('video');
                const title = content.querySelector('h3')
                const user = content.querySelector('h4');
    
                li.dataset.name = video.name;
                li.dataset.url = video.url;
                videoElement.src = video.url;
                title.innerText = video.name;
                user.innerText = video.user.name;
    
                playList.appendChild(content);
            }

            console.log("search 2");
        }
    }

    console.log("search 3");
}

function closePlayer() {

    main.removeChild(document.querySelector('#video-player-frame'))

    if (mediaQuery768px.matches) {

        setStyleVideoPlayerHide()  
    }
}

function setStyleVideoPlayerShow() {

    header.style.backgroundColor = "#222"
    header.style.boxShadow = "0px 3px 3px lightgray"
    header.style.height = "50px"
    title.style.color = "white"
    title.style.fontSize = '1.1em'
    searchFrame.style.display = "none"
    buttonClosePlayer.style.display = "inline"
    logout.style.display = "none"
}

function setStyleVideoPlayerHide() {

    header.style.display = 'flex'
    header.style.backgroundColor = 'white'
    header.style.boxShadow = "none"
    header.style.height = "64px"
    searchFrame.style.display = "flex"
    title.style.color = "var(--primary-color)"
    title.style.fontSize = '1.3em'
    title.innerText = "Demo Player"
    logout.style.display = "inline"
    buttonClosePlayer.style.display = "none" 
}