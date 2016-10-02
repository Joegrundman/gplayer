const audioPlayerRoot = document.querySelector('#audio-player-root')

//version one
audioPlayerRoot.innerHTML = initAudioPlayer(musicData)


// other version
// const playListUrl = 'https://s3.eu-central-1.amazonaws.com/hugsar-music-repo/hugsar-playlist.json'
// // version 2.0
// utils.ajax(playListUrl, 'text', onSuccess, onError)

// function onSuccess (musicData) {
//     audioPlayerRoot.innerHTML = audioPlayer.getAudioPlayer(JSON.parse(musicData))
// }

// function onError (error) {
//     console.log("could not get music data", error)
//     audioPlayerRoot.innerHTML = `
//         <h1Could not initialise player because no playlist was recevied</h1>
//     `
// }