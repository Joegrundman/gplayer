###gplayer

This is a skin for **html5 audio player** to meet a challenge requirement.  

The challenge requires a skin for either html5 audio player or jquery jplayer  

The audio player must take a playlist and allow selection of tracks for the player

Since the challenge did not specify cross-browser support, this is only tested on Chrome


## playlist data
For the playlist format, in its current form it only accepts data from a single album, and not a 
collection of mixes with different artists. 

The accepted format of tracks is 

`{name: string, src: string}`

Obviously it is trivial to implement mixed-artist playlists.

Also, it is trivial to implement getting the data as json from a server. 

The musicData is therefore not hardcoded. Any musicData can be passed in through index.js so long as it   
matches the shape of the hugsar sample. it will be merged into the playlistSelectorAndBind function.


## externals
Ionicons is the only external library in this app.  
http://ionicons.com/

## app design

I chose to base this app on javascript template strings and innerHTML rather than createElement.
I find createElement is harder to reason about and write.
template strings may have a slight performance hit, but it seems fast enough to me, and angular2 is based on it, so how slow can it be?
Most important difference as compared to createElement is to reattach eventHandlers
after updates as the DOM cannot track them through template strings. Event reattachment is all handled in a single function.

On top of the requirements this audio player also implements:

  skip forward, 
  skip back, 
  autoplay next track on end, 
  shuffle, 
  volume contro,
  sound visualizer

## music

Music by **hugsar**

www.hugsar.uk

