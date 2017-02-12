var YoutubeMp3Downloader = require('youtube-mp3-downloader');

dbConfig = require('./config/db.dev.conf.js');

//Configure YoutubeMp3Downloader with your settings 
var YD = new YoutubeMp3Downloader({
    "ffmpegPath": "/opt/local/bin/ffmpeg",        // Where is the FFmpeg binary located? 
    "outputPath": "public/songs/",    // Where should the downloaded and encoded files be stored? 
    "youtubeVideoQuality": "lowest",       // What video quality should be used?
    "queueParallelism": 3,                  // How many parallel downloads/encodes should be started? 
    "progressTimeout": 2000                 // How long should be the interval of the progress reports 
});

process.argv.forEach(function (val, index, array) {
    if (index === 2) {
        YD.download(val);
    }
});
 
YD.on("finished", function(data) {
    console.log(data);
});
 
YD.on("error", function(error) {
    console.log(error);
});
 
YD.on("progress", function(progress) {
    console.log(progress);
});