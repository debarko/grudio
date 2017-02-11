var wavesurfer = WaveSurfer.create({
	container: '#waveform',
	waveColor: 'grey',
	progressColor: 'purple',
	scrollParent: true,
	splitChannels: false,
	height: 140,
	interact:false
});

wavesurfer.load('https://wavesurfer-js.org/example/split-channels/stereo.mp3');

// wavesurfer.disableDragSelection();
wavesurfer.on('ready', function () {wavesurfer.play(24);});