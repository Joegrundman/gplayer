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
    currentVolume: 0.7
}

// variable declarations
var aPlayer
var audioCtx
var audioBuffer
var canvasCtx
const canvasHeight = 200
const canvasWidth = 300
var duration
var playhead
var soundtrack
var playListSelectorAndBind
var timeline
var timelineWidth 
var visualizerCanvas
var volume
var volumeWidth
var volumeHead

// remove and reassign eventhandlers on change of audioplayer
function bindNewEventHandlers () {
    aPlayer = document.querySelector('#audio-player-console')
    // aPlayer.crossOrigin = 'anonymous'
    playhead = document.querySelector('#audio-player-playhead')
    timeline = document.querySelector('#audio-player-timeline')
    visualizerCanvas = document.querySelector('#audio-player-visualizer')
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
    playhead.style.width = playPercent + 'px'
    // playhead.style.marginLeft = playPercent + 'px'
}

const onEnded = () => {
    state.currentTrackId ++
    playListSelectorAndBind(state.currentTrackId)
}

const handleMovePlayhead = (event) => {
    movePlayhead(event)
    aPlayer.currentTime = duration * ((event.pageX - timeline.offsetLeft) / timelineWidth)
}

const movePlayhead = e => {
    var newWidth = e.pageX - timeline.offsetLeft
    if(newWidth >= 0 && newWidth <= timelineWidth){
        playhead.style.width = newWidth + 'px'
    } else if (newWidth < 0) {
        playhead.style.width = '0px'
    } else if (newWidth > timelineWidth) {
        playhead.style.width = timelineWidth + "px"
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
    volumeHead.style.width = volumeWidth * aPlayer.volume + 'px'
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
    // getSoundTrack(playList[id].src, () => {
        
    // } )
    // attach new audio player, reattach event listeners and dom bindings
    document.querySelector('#audio-player-hook').innerHTML = audioPlayer(playList[state.currentTrackId])
    bindNewEventHandlers()
    setVolume()
    return
}

const play = () => {
    aPlayer.play()       
}

const playAudioUsingBuffer = () => {
    var src = audioCtx.createBufferSource()
    src.buffer = buf
    src.connect(audioCtx.destination)
    src.noteOn(0)
}

const pause = () => {
    aPlayer.pause()  
}

const skipForward = () => {
    playListSelectorAndBind(state.currentTrackId + 1)
}

const skipBackward = () => {
    if(state.currentTrackId == 0 || (aPlayer.currentTime / duration > 0.02)) {
        playListSelectorAndBind(state.currentTrackId)       
    } else {
    playListSelectorAndBind(state.currentTrackId -1)
    }
}

/**
 * ============================
 *    component templates
 * ============================
 */


// main container for the audio player component
const audioPlayerContainer = (data) => (`
    <div class="audio-player-container">
        ${audioPlayerTitle(data.data)}
        <div class="audio-player-playList-and-player-container">
            ${playListContainer(data.playList)}
            <br>
            <br>
            <div id="audio-player-hook"></div>
        </div>
     </div>`)

// // audio player and controls component
// const audioPlayer = (track) => (`
//         <div class="audio-player">
//             <p id="audio-player-track-title"> ${track.name} </p>
//             <audio id="audio-player-console" autoplay>
//                 <p>Your browser does not support this audio player </p>
//             </audio>
//             <button id="audio-player-skip-backward" 
//                 class="audio-player-main-button" 
//                 onclick="skipBackward()">
//                 <i class="ion-skip-backward"></i>
//             </button>
//             <button id="audio-player-play" 
//                 class="audio-player-main-button" 
//                 onclick="play()">
//                 <i class="ion-play"></i>
//             </button>
//             <button id="audio-player-pause" 
//                 class="audio-player-main-button" 
//                 onclick="pause()">
//                 <i class="ion-pause"></i>
//             </button>
//             <button id="audio-playerskip-forward" 
//                 class="audio-player-main-button" 
//                 onclick="skipForward()">
//                 <i class="ion-skip-forward"></i>
//             </button>
//             <br>
//             <div id="audio-player-timeline-and-volume-container">
//                 <div id="audio-player-timeline">
//                     <div id="audio-player-playhead"></div>
//                 </div>
//                 <i class="ion-volume-medium"></i>
//                 <div id="audio-player-volume">
//                     <div id="audio-player-volumehead"></div>
//                 </div> 
//             </div>
//             <div id="audio-player-visualizer-container">
//                 <canvas id="audio-player-visualizer" height="${canvasHeight}px" width="${canvasWidth}px" style="border:1px solid #000000"></canvas>
//             </div>
//         </div>`)



// audio player and controls section
const audioPlayer = (track) => (`
        <div class="audio-player">
            <p id="audio-player-track-title"> ${track.name} </p>
            <audio id="audio-player-console" src="${track.src}" autoplay>
                <p>Your browser does not support this audio player </p>
            </audio>
            <button id="audio-player-skip-backward" 
                class="audio-player-main-button" 
                onclick="skipBackward()">
                <i class="ion-skip-backward"></i>
            </button>
            <button id="audio-player-play" 
                class="audio-player-main-button" 
                onclick="play()">
                <i class="ion-play"></i>
            </button>
            <button id="audio-player-pause" 
                class="audio-player-main-button" 
                onclick="pause()">
                <i class="ion-pause"></i>
            </button>
            <button id="audio-playerskip-forward" 
                class="audio-player-main-button" 
                onclick="skipForward()">
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
            <div id="audio-player-visualizer-container">
                <canvas id="audio-player-visualizer" height="${canvasHeight}px" width="${canvasWidth}px" style="border:1px solid #000000"></canvas>
            </div>
        </div>`)


// title and album name header
const audioPlayerTitle = (titleData) => (`
    <div class="audio-player-title">
        <span id="logo">gplayer</span>   
        <a href="${titleData.webUrl}" target="_blank">
            <span id="name-and-album">${titleData.name} - ${titleData.albumName}</span>
        </a>
    </div>`)



// draw playlist with onclick callback
const playListContainer = (playList) => (`
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

// initialize visualizer
const initVisualizer = () => {
    canvasCtx = visualizerCanvas.getContext("2d")
    audioCtx =  new (window.AudioContext  || window.webkitAudioContext)()
    var audioSrc = audioCtx.createMediaElementSource(aPlayer)
    var analyser = audioCtx.createAnalyser()
    audioSrc.connect(analyser)
    analyser.fftSize = 2048
    var bufferLength = analyser.frequencyBinCount
    var dataArray = new Uint8Array(bufferLength)
    analyser.getByteTimeDomainData(dataArray)

    const drawVisualizer = () => {
        var drawVisual = requestAnimationFrame(drawVisualizer)
        analyser.getByteTimeDomainData(dataArray)

        canvasCtx.fillStyle = 'rgb(200, 200, 200)'
        canvasCtx.fillRect(0, 0, canvasWidth, canvasHeight)

        canvasCtx.lineWidth = 2
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)'

        canvasCtx.beginPath()
        var sliceWidth = canvasWidth * 1.0 / bufferLength
        var x = 0
        for (var i = 0; i < bufferLength; i++) {
            var v = dataArray[i] / 128.0
            var y = v * canvasHeight/2

            if(i === 0) {
                canvasCtx.moveTo(x, y)
            } else {
                canvasCtx.lineTo(x, y)
            }

            x += sliceWidth
        }
        canvasCtx.lineTo(visualizerCanvas.width, visualizerCanvas.height / 2)
        canvasCtx.stroke()
    }
    drawVisualizer()    
}


// initialise the audio player and set track 0 to active
window.onload = function() {
        playListSelectorAndBind(0)
        bindNewEventHandlers()
        timelineWidth = timeline.offsetWidth - playhead.offsetWidth
        volumeWidth = volume.offsetWidth - volumeHead.offsetWidth
        setVolume()
        initVisualizer()
}

