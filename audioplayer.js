/**
 * Obviously this is not the only way to do it, but i decided for a small app why bother
 * with jquery or angular when native js templating can handle it fine. It is versatile and easy.
 */

//state object contains state of gplayer
const state = {
    isPlaying: true,
    currentTrackId: 0
}

// variable declarations
var duration
var ap
var playhead
var playListSelector


/**
 * functions
 */

//function accepts playList as first argument and id for second creating a playlist specific selector
const listSelector = playList => id => {
    state.currentTrackId = id
    document.querySelector('#audio-player-hook').innerHTML = audioPlayer(playList[state.currentTrackId])
    return
}

const setClassAsPlaying = (index) => {
    var playListCells = document.querySelectorAll('.audio-player-playlist-cell')
    playListCells.forEach(cell => {
        cell.classList.remove("playing")
    })
    var node = document.querySelector(`#playlist-cell-${index}`)
    node.classList.add("playing")
}

// update location of playhead
const timeUpdate = () => {
    console.log("duration", duration)
    var playPercent = 100 * (ap.currentTime / duration)
    console.log('playPercent', playPercent)
    playhead.style.marginLeft = playPercent + "%"
}

const playAudio = () => {
    // if(!ap){ap = document.querySelector('#audio-player-console')}   
    if(ap.paused) {
        ap.play()       
    }
}

const pauseAudio = () => {
    //  if(!ap){ap = document.querySelector('#audio-player-console')}
     if (!ap.paused ) {
         ap.pause()
     }
}

const forwardAudio = () => {

}


/**
 * rendered components
 */

// main container for the audio player component
const audioPlayerContainer = (data) => {

    // create playListSelector by passing in the playList to listSelector
    playListSelector = listSelector(data.playList)

    // render audio player 
    return (`<div class="audio-player-container">
        ${audioPlayerTitle(data.data)}
        <div class="audio-player-playList-and-player-container">
            ${playList(data.playList)}
            <br>
            <br>
            <div id="audio-player-hook">${audioPlayer(data.playList[state.currentTrackId])}</div>
        </div>
     </div>`)
}

// audio player and controls section
const audioPlayer = (track) => (
    `<div class="audio-player">
            <h3 id="audio-player-track-title"> Now Playing: ${track.name} </h3>
            <audio id="audio-player-console" src="${track.src}" controls>
                <p>Your browser does not support this audio player </p>
            </audio>
            <br>
            <br>
            <button id="audio-player-play-button" class="audio-player-main-button" onclick="playAudio()"><i class="ion-play"></i></button>
            <button id="audio-player-pause-button" class="audio-player-main-button" onclick="pauseAudio()"><i class="ion-pause"></i></button>
            <button id="audio-player-forward-button" class="audio-player-main-button" onclick="forwardAudio()"><i class="ion-skip-forward"></i></button>
            <button id="audio-player-backward-button" class="audio-player-main-button" onclick="backAudio()"><i class="ion-skip-backward"></i></button>
            <br>
            <div id="audio-player-timeline-container">
                <div id="audio-player-timeline">
                    <div id="audio-player-playhead"></div>
                    <span id="audio-player-duration"></span>
                </div>
            </div>
        </div>`)


// title and album name header
const audioPlayerTitle = (titleData) => (`
    <div class="audio-player-title">
        <span id="logo">gplayer</span>   <span id="name-and-album">${titleData.name} - ${titleData.albumName}</span>
    </div>`)

// draw playlist with onclick callback
const playList = (playList) => (`
    <div class="audio-player-playlist-container">
        ${playList.map((track, i, playListArr) => (`
            <div class="audio-player-playlist-cell"
                id="playlist-cell-${i}"" 
                onclick="playListSelector(${i}); setClassAsPlaying(${i})">
            <p> Track: ${i + 1} - ${track.name}</p>
            </div>`)).join('')}
    </div>`)

window.onload = function() {
        playhead = document.querySelector('#audio-player-playhead')
        ap = document.querySelector('#audio-player-console')
        ap.addEventListener("timeupdate", timeUpdate, false)
        console.log('duration', ap.duration)
        ap.addEventListener("canplaythrough", () => {return duration = ap.duration}, false)
}




