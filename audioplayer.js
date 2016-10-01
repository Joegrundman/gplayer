/**
 * Obviously this is not the only way to do it, but i decided for a small app to forego
 * jquery or angular and stick to native js templating. 
 * Could be useful to turn into a react component
 */

/**
 * ======================================
 * Declarations, state and event bindings
 * ======================================
 */

//state object contains state of gplayer
const state = {
    currentTrackId: 0,
    currentVolume: 0.5
}

// variable declarations
var duration
var aPlayer
var playhead
var playListSelectorAndBind
var timeline
var timelineWidth 
var volume
var volumeWidth
var volumeHead

// remove and reassign eventhandlers on change of audioplayer
function bindNewEventHandlers () {
    aPlayer = document.querySelector('#audio-player-console')
    playhead = document.querySelector('#audio-player-playhead')
    timeline = document.querySelector('#audio-player-timeline')
    volume = document.querySelector('#audio-player-volume')
    volumeHead = document.querySelector('#audio-player-volumehead')

    aPlayer.removeEventListener("timeupdate", timeUpdate)
    aPlayer.removeEventListener("canplaythrough", setDuration)
    aPlayer.removeEventListener("ended", onEnded)
    timeline.removeEventListener("click", movePlayhead)
    volume.removeEventListener("click", handleChangeVolume)

    aPlayer.load()
    aPlayer.addEventListener("timeupdate", timeUpdate, false)
    aPlayer.addEventListener("canplaythrough", setDuration, false)
    aPlayer.addEventListener("ended", onEnded, false)
    timeline.addEventListener("click", handleMovePlayhead, false)
    volume.addEventListener("click", handleChangeVolume, false)
    
}

/**
 * =======================
 * event handler functions
 * =======================S
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

const timeUpdate = () => {
    var playPercent = timelineWidth * (aPlayer.currentTime / duration)
    playhead.style.marginLeft = playPercent + 'px'
}

const onEnded = () => {
    state.currentTrackId ++
    playListSelectorAndBind(state.currentTrackId)
}

const handleMovePlayhead = (event) => {
    movePlayhead(event)
    //set audioplayer position to % of duration
    aPlayer.currentTime = duration * ((event.pageX - timeline.offsetLeft) / timelineWidth)
}

const movePlayhead = e => {
    var newMargleft = e.pageX - timeline.offsetLeft
    if(newMargleft >= 0 && newMargleft <= timelineWidth){
        playhead.style.marginLeft = newMargleft + 'px'
    } else if (newMargleft < 0) {
        playhead.style.marginLeft = '0px'
    } else if (newMargleft > timelineWidth) {
        playhead.style.marginLeft = timelineWidth + "px"
    }
}

const handleChangeVolume = e => {
    var newVol = (e.pageX - volume.offsetLeft) / volumeWidth
    if (newVol < 0) { newVol = 0}
    else if (newVol > 1) {newVol = 1}
    state.currentVolume = newVol
    setVolume()
}

const setVolume = () => {
    aPlayer.volume = state.currentVolume
    volumeHead.style.marginLeft = volumeWidth * aPlayer.volume + 'px'
}

/**
 * ===============
 * Main functions
 * ===============
 */

//function accepts playList as first argument and id for second creating a playlist specific selector
const listSelectorAndBind = playList => id => {
    state.currentTrackId = id
    setClassAsPlaying(id)
    
    // attach new audio player, reattach event listeners and dom bindings
    document.querySelector('#audio-player-hook').innerHTML = audioPlayer(playList[state.currentTrackId])
    bindNewEventHandlers()
    return
}

const playAudio = () => {
    aPlayer.play()       
}

const pauseAudio = () => {
    aPlayer.pause()  
}

const forwardAudio = () => {
    playListSelectorAndBind(state.currentTrackId + 1)
}

const backAudio = () => {
    if(state.currentTrackId == 0 || (aPlayer.currentTime / duration > 0.02)) {
        playListSelectorAndBind(state.currentTrackId)       
    } else {
    playListSelectorAndBind(state.currentTrackId -1)
    }
}

/**
 * ============================
 *     template components
 * ============================
 */


// main container for the audio player component
const audioPlayerContainer = (data) => (`<div class="audio-player-container">
        ${audioPlayerTitle(data.data)}
        <div class="audio-player-playList-and-player-container">
            ${playList(data.playList)}
            <br>
            <br>
            <div id="audio-player-hook"></div>
        </div>
     </div>`)




// audio player and controls section
const audioPlayer = (track) => (`
        <div class="audio-player">
            <p id="audio-player-track-title"> ${track.name} </p>
            <audio id="audio-player-console" src="${track.src}" autoplay>
                <p>Your browser does not support this audio player </p>
            </audio>
            <button id="audio-player-backward-button" 
                class="audio-player-main-button" 
                onclick="backAudio()">
                <i class="ion-skip-backward"></i>
            </button>
            <button id="audio-player-play-button" 
                class="audio-player-main-button" 
                onclick="playAudio()">
                <i class="ion-play"></i>
            </button>
            <button id="audio-player-pause-button" 
                class="audio-player-main-button" 
                onclick="pauseAudio()">
                <i class="ion-pause"></i>
            </button>
            <button id="audio-player-forward-button" 
                class="audio-player-main-button" 
                onclick="forwardAudio()">
                <i class="ion-skip-forward"></i>
            </button>
            <br>
            <div id="audio-player-timeline-and-volume-container">
                <div id="audio-player-timeline">
                    <div id="audio-player-playhead"></div>
                </div>
                <i class="ion-volume-medium"></i>
                <div id="audio-player-volume">
                    <div id="audio-player-volumehead"></div>
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
                onclick="playListSelectorAndBind(${i})">
            <p> Track: ${i + 1} - ${track.name}</p>
            </div>`)).join('')}
    </div>`)

/**
 * ====================================
 *      initialise and launch app
 * ===================================
 */

// return the completed audioplayer component   
const initAudioPlayer = (data) => {
    // create playListSelector by passing in the playList to listSelector
    playListSelectorAndBind = listSelectorAndBind(data.playList)
    return audioPlayerContainer(data)
}


// initialise the audio player and set track 0 to active
window.onload = function() {
        playListSelectorAndBind(0)
        bindNewEventHandlers()
        timelineWidth = timeline.offsetWidth - playhead.offsetWidth
        volumeWidth = volume.offsetWidth - volumeHead.offsetWidth
        setVolume()
}

