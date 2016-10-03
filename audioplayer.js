$(document).ready(() => {

    var aPlayer, artistData, audioCtx, duration, playhead, playlist, playlistSelector, timeline, timelineWidth
    var volume, volumeWidth, volumeHead
    var musicBuffer = {}

    var state = {
        currentTrackId: 0,
        currentVolume: 0.7,
        playall: true,
        shuffle: false,
        loop: false,
        shufflePlayList: []
    }

    const bindControls = () => {
        $('#audio-player-pause').on('click', pause)
        $('#audio-player-play').on('click', play)
        $('#audio-player-skip-forward').on('click', skipForward)
        $('#audio-player-skip-backward').on('click', skipBackward)
        $('#audio-player-console').on('ended', handleEndTrack)
        $('#audio-player-console').on("timeupdate", timeUpdate)
        $('#audio-player-console').on("canplaythrough", setDuration)
        $('#audio-player-volume').on("click", handleChangeVolume)
        $('#audio-player-timeline').on("click", handleMovePlayhead)
        $('#playall-switch').change(togglePlayall)
        $('#loop-switch').change(toggleLoop)
        $('#shuffle-switch').change(toggleShuffle)
    }


    const handleChangeVolume = e => {
        var newVol = (e.pageX - volume.offsetLeft) / volumeWidth
        if (newVol < 0) { newVol = 0 }
        else if (newVol > 1) { newVol = 1 }
        state.currentVolume = newVol
        setVolume()
    }

    const handleEndTrack = () => {
        if (state.loop) {
            playlistSelector(state.currentTrackId)
            play()
        } else if (state.playall) {
            skipForward()
        } else if (state.shuffle) {
            if (state.shufflePlayList.length) {
                playlistSelector(state.shufflePlayList.pop())
                state.shufflePlayList.push(state.currentTrackId)
                play()
            }
        }
    }

    const handleMovePlayhead = (event) => {
        movePlayhead(event)
        aPlayer.currentTime = duration * ((event.pageX - timeline.offsetLeft) / timelineWidth)
    }

    const listSelector = (playlist) => (id) => {
        state.currentTrackId = id
        setClassAsPlaying()
        setCurrentTrack(playlist[id])
        return
    }

    const movePlayhead = e => {
        var newWidth = e.pageX - timeline.offsetLeft
        if (newWidth >= 0 && newWidth <= timelineWidth) {
            playhead.style.width = newWidth + 'px'
        } else if (newWidth < 0) {
            playhead.style.width = '0px'
        } else if (newWidth > timelineWidth) {
            playhead.style.width = timelineWidth + "px"
        }
    }

    const play = () => {
        aPlayer.play()
    }

    const pause = () => {
        document.querySelector('#audio-player-console').pause()
    }
    
    const setClassAsPlaying = () => {
        var index = state.currentTrackId

        $('.audio-player-playlist-cell').each((i, cell) => {
            $(cell).removeClass("playing")
        })
        $('#playlist-cell-' + index).addClass("playing")
    }

    const setCurrentTrack = (track) => {
        $('#audio-player-track-title').text(track.name)
        $('#audio-player-console').attr('src', track.src)
    }

    const setDuration = () => duration = aPlayer.duration

    const setPlaylist = (playlist) => {
        var playlistHtml = playlist.map((track, i) => (`
            <div class="audio-player-playlist-cell"
                id="playlist-cell-${i}" >
                <p> Track: ${i + 1} - ${track.name}</p>
            </div>`)).join('')

        $('.audio-player-playlist-container').html(playlistHtml)

        playlist.forEach((track, i) => {
            $(`#playlist-cell-${i}`).on("click", (e) => playlistSelector(i))
        })
    }


    const setTitle = (titleData) => {
        var titleStr = titleData.name + " - " + titleData.albumName
        $('#name-and-album').html(titleStr)
        $('#link-to-website').attr('href', titleData.webUrl)
    }

    const shuffle = (array) => {
        var currentIndex = array.length, temporaryValue, randomIndex;

        while (0 !== currentIndex) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    const skipBackward = () => {
        if(state.shuffle) { return }
        if (state.currentTrackId == 0 || (aPlayer.currentTime / duration > 0.02)) {
            playlistSelector(state.currentTrackId)
            play()
        } else {
            playlistSelector(state.currentTrackId - 1)
            play()
        }
    }

    const skipForward = () => {
        if(state.shuffle) {
            if (state.shufflePlayList.length) {
                playlistSelector(state.shufflePlayList.pop())
                play()                
            } else {
                return
            }
        } else if (state.currentTrackId < playlist.length - 1) {
            playlistSelector(state.currentTrackId + 1)
            play()
        }
    }

    const timeUpdate = () => {
        var playPercent = timelineWidth * (aPlayer.currentTime / duration)
        playhead.style.width = playPercent + 'px'
    }


    const setVolume = () => {
        aPlayer.volume = state.currentVolume
        volumeHead.style.width = volumeWidth * aPlayer.volume + 'px'
    }

    const togglePlayall = () => {
        state.playall = !state.playall
        if(state.playall) {
            state.loop = false
            state.shuffle = false
            $('#loop-switch').prop('checked', false)
            $('#shuffle-switch').prop('checked', false)
            state.currentTrackId = 0
            playlistSelector(0)
            play()
        }
    }

    const toggleShuffle = () => {
        state.shuffle = !state.shuffle
        if(state.shuffle) {
            state.loop = false
            state.playall = false
            $('#loop-switch').prop('checked', false)
            $('#playall-switch').prop('checked', false)

            var newPlayList = []
            for(var i = 0; i < playlist.length; i++) {
                newPlayList.push(i)
            }

            state.shufflePlayList = shuffle(newPlayList)
            playlistSelector(state.shufflePlayList.pop())
            play()

        }
    }

    const toggleLoop = () => {
        state.loop = !state.loop
        if(state.loop) {
            state.playall = false
            state.shuffle = false
            $('#playall-switch').prop('checked', false)
            $('#shuffle-switch').prop('checked', false)
        }
    }

    const initAudioPlayer = () => {
        aPlayer = document.querySelector('#audio-player-console')
        playhead = document.querySelector('#audio-player-playhead')
        timeline = document.querySelector('#audio-player-timeline')
        volume = document.querySelector('#audio-player-volume')
        volumeHead = document.querySelector('#audio-player-volumehead')
        volumeWidth = volume.offsetWidth - volumeHead.offsetWidth
        setVolume()
        timelineWidth = timeline.offsetWidth - playhead.offsetWidth
        bindControls()
        playlist = musicData.playList
        artistData = musicData.data
        playlistSelector = listSelector(playlist)
        setTitle(artistData)
        setPlaylist(playlist)
        playlistSelector(state.currentTrackId)
    }

    initAudioPlayer()

})