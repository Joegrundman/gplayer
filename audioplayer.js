/**
 * Obviously this is not the only way to do it, but i decided for a small app why bother
 * with jquery or angular when native js templating can handle it fine. It is versatile and easy.
 * Could be useful to turn into a react component
 */

//state object contains state of gplayer
const state = {
    isPlaying: true,
    currentTrackId: 0
}

// variable declarations
var duration
var aPlayer
var playhead
var playListSelector
var timeline

function bindNewAudioPlayer () {
    aPlayer = document.querySelector('#audio-player-console')
    playhead = document.querySelector('#audio-player-playhead')
    timeline = document.querySelector('#audio-player-timeline')
    aPlayer.removeEventListener("timeupdate", timeUpdate)
    aPlayer.removeEventListener("canplaythrough", setDuration)
    aPlayer.load()
    aPlayer.addEventListener("timeupdate", timeUpdate, false)
    aPlayer.addEventListener("canplaythrough", setDuration, false)
}

/**
 * functions
 */

const setClassAsPlaying = (index) => {
    var playListCells = document.querySelectorAll('.audio-player-playlist-cell')
    playListCells.forEach(cell => {
        cell.classList.remove("playing")
    })
    var node = document.querySelector(`#playlist-cell-${index}`)
    node.classList.add("playing")
}

const setDuration = () => duration = aPlayer.duration

// update location of playhead
const timeUpdate = () => {
    var playPercent = 100 * (aPlayer.currentTime / duration)
    playhead.style.marginLeft = playPercent + "%"
}

//function accepts playList as first argument and id for second creating a playlist specific selector
const listSelectorAndBind = playList => id => {
    state.currentTrackId = id

    // attach new audio player, reattach event listeners and dom bindings
    document.querySelector('#audio-player-hook').innerHTML = audioPlayer(playList[state.currentTrackId])
    bindNewAudioPlayer()
    return
}

const playAudio = () => {
    aPlayer.play()       
}

const pauseAudio = () => {
    aPlayer.pause()
     
}

const forwardAudio = () => {
    state.currentTrackId++
    playListSelectorAndBind(state.currentTrackId)
}


/**
 * rendered components
 */

// main container for the audio player component
const audioPlayerContainer = (data) => {

    // create playListSelector by passing in the playList to listSelector
    playListSelectorAndBind = listSelectorAndBind(data.playList)

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
            <p id="audio-player-track-title"> Now Playing: ${track.name} </p>
            <audio id="audio-player-console" src="${track.src}">
                <p>Your browser does not support this audio player </p>
            </audio>
            <br>
            <button id="audio-player-play-button" class="audio-player-main-button" onclick="playAudio()">
                <i class="ion-play"></i>
            </button>
            <button id="audio-player-pause-button" class="audio-player-main-button" onclick="pauseAudio()">
                <i class="ion-pause"></i>
            </button>
            <button id="audio-player-forward-button" class="audio-player-main-button" onclick="forwardAudio()">
                <i class="ion-skip-forward"></i>
            </button>
            <button id="audio-player-backward-button" class="audio-player-main-button" onclick="backAudio()">
                <i class="ion-skip-backward"></i>
            </button>
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
                onclick="playListSelectorAndBind(${i}); setClassAsPlaying(${i})">
            <p> Track: ${i + 1} - ${track.name}</p>
            </div>`)).join('')}
    </div>`)

window.onload = function() {
        bindNewAudioPlayer()
}




