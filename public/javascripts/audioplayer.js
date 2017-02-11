var wavesurfer = WaveSurfer.create({
	container: '#waveform',
	waveColor: 'grey',
	progressColor: 'purple',
	scrollParent: true,
	splitChannels: false,
	height: 140,
	interact:false
});

function startPlay(audioUrl, startTime){
	wavesurfer.load(audioUrl);
	console.log("once");
	// wavesurfer.disableDragSelection();
	wavesurfer.on('ready', function () {
		wavesurfer.play(startTime);
		// currentTime = wavesurfer.getCurrentTime();
		// duration = wavesurfer.getDuration();
		// currentTime = wavesurfer.getCurrentTime();
		// duration = wavesurfer.getDuration();
		// console.log("Duration === "+duration);
		// timeOut = (duration - currentTime)-6;
		// console.log("Timeout === "+timeOut);
		// millisecond = timeOut*1000;
		// if(timeOut>6){
		// 	setTimeout(function(){ console.log("Hello  "+timeOut); }, millisecond);
		// }else{
		// 	console.log("already timeout" + timeOut);
		// }
	});
}


var playPauseCounter = 1;
function playPause(){
	//alert(wavesurfer.getCurrentTime());
	if(playPauseCounter===1){
		wavesurfer.pause();
		playPauseCounter = 2;
	}else{
		var newAudio = 'https://wavesurfer-js.org/example/split-channels/stereo.mp3';
		var newStartTime = 35;
		startPlay(newAudio, newStartTime);
		playPauseCounter = 1;
	}
}


var duration = null;
var currentTime = null;
var timeOut = null;
var audioUrl = 'https://wavesurfer-js.org/example/split-channels/stereo.mp3';
var startTime = 14;
startPlay(audioUrl, startTime);
window.setInterval(function(){
	getNextSong();
}, 5000);

function getNextSong(){
	var isPlaying = wavesurfer.isPlaying();
	duration = wavesurfer.getDuration();
	currentTime = wavesurfer.getCurrentTime();
	if(duration!==0 && currentTime!==0){
		if((duration-currentTime>=5 && duration-currentTime<10) && isPlaying){
			console.log("requesting for new song");
		}
	}
}