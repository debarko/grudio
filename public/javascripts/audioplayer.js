var wavesurfer = WaveSurfer.create({
	container: '#waveform',
	waveColor: 'grey',
	progressColor: 'purple',
	scrollParent: true,
	splitChannels: false,
	height: 140,
	interact:false
});


function init(){
	startPlay(startingSong, startTime, function(){
		getNextSong(0);
	});

	baseUrl = document.location.origin;
	wavesurfer.on('finish', function () {
		if(nextSong){
			startPlay(nextSong, 0);
		}
	});
}

function startPlay(audioUrl, startTime, callback){
	wavesurfer.load(audioUrl);

	wavesurfer.on('ready', function () {
		wavesurfer.play(startTime);
		if(callback){
			callback();
		}
	});
}


var playPauseCounter = 1;
function playPause(){
	//alert(wavesurfer.getCurrentTime());
	if(playPauseCounter===1){
		wavesurfer.pause();
		playPauseCounter = 2;
	}else{
		reqCurSong(function(err, data){
			if(err){
				alert('Some unexpected error happed please refresh!!');
			}
			if(data){
				var curSong = baseUrl+'/'+data.file_path;
				var curSeek = data.seek;
				curSongFullData = data;
				startPlay(curSong, curSeek);
			}
		});
		playPauseCounter = 1;
	}
}


function getNextSong(refresh){
	var isPlaying = wavesurfer.isPlaying();
	duration = wavesurfer.getDuration();
	currentTime = wavesurfer.getCurrentTime();

	if(duration!==0 && currentTime!==0){
		if((duration-currentTime<=5 && !refresh) || ((duration-currentTime>=5 && duration-currentTime<10) && isPlaying)){
			reqCurSong(function(err, data){
				if(err){
					alert('Some unexpected error happed please refresh!!');
				}
				if(data){
					nextSong = baseUrl+'/'+data.file_path;
					seek = data.seek;
					curSongFullData = data;
				}
			});
		}
	}
}

function reqCurSong(callback){
	$.ajax({
		url:"http://localhost:8989/syncPlayer?category=1&user=1",
		type:"GET",
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		cache: false,
		success: function(data){
			callback(null, data);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			callback('err');
			//console.log(textStatus);
			//console.log(XMLHttpRequest);
			//alert("Status: " + textStatus);
			//alert("Error: " + errorThrown);
		}
	});
}





var duration = null;
var currentTime = null;
var timeOut = null;
var baseUrl = null;
var nextSong = null;
var seek = null;
var startingSong = 'https://wavesurfer-js.org/example/split-channels/stereo.mp3';
var startTime = 50;
var curSongFullData = null;

$(document).ready(function(){
	init();
});


window.setInterval(function(){
	getNextSong(1);
}, 5000);