
      var audio, playbtn, mutebtn, seekslider, volumeslider, seeking=false, seekto, curtimetext, durtimetext;
function initAudioPlayer(val){
	 audio = new Audio();
	audio.src = val;
	audio.loop = true;
	audio.play();
	// Set object references
	playbtn = document.getElementById("playpausebtn");
	mutebtn = document.getElementById("mutebtn");
	seekslider = document.getElementById("seekslider");
	volumeslider = document.getElementById("volumeslider");
	curtimetext = document.getElementById("curtimetext");
	durtimetext = document.getElementById("durtimetext");
	// Add Event Handling
	playbtn.addEventListener("click",playPause);
	mutebtn.addEventListener("click", mute);
	seekslider.addEventListener("mousedown", function(event){ seeking=true; seek(event); });
	// seekslider.addEventListener("mousemove", function(event){ seek(event); });
	seekslider.addEventListener("mouseup",function(){ seeking=false; });
	volumeslider.addEventListener("mousemove", setvolume);
	audio.addEventListener("timeupdate", function(){ seektimeupdate(); });
	// Functions
	function playPause(){
		if(audio.paused){
            audio.play();
            document.getElementById("playbtn").style.display='none'
             document.getElementById("pausebtn").style.display='block'

		    // playbtn.style.background = "url(pause.png) no-repeat";
	    } else {
            audio.pause();
             document.getElementById("pausebtn").style.display='none'
            document.getElementById("playbtn").style.display='block'

		    // playbtn.style.background = "url(play.webp) no-repeat";
	    }
    }
    playPause()
	function mute(){
		if(audio.muted){
		    audio.muted = false;
		    mutebtn.style.background = "url(images/speaker.png) no-repeat";
	    } else {
		    audio.muted = true;
		    mutebtn.style.background = "url(images/speaker_muted.png) no-repeat";
	    }
	}
	function seek(event){
	    if(seeking){
		    seekslider.value = event.screenX/10 ;
	        seekto = audio.duration * (seekslider.value/100 );
            console.log(seekslider.value,seekslider.offsetLeft,event.screenX );
	        audio.currentTime = seekto ;
             seektimeupdate()
	    }
    }
	function setvolume(){
	    audio.volume = volumeslider.value / 100;
    }
	function seektimeupdate(){
		var nt = audio.currentTime * (100 / audio.duration);
		seekslider.value = nt;
        console.log(seekslider.value);

		var curmins = Math.floor(audio.currentTime / 60);
	    var cursecs = Math.floor(audio.currentTime - curmins * 60);
	    var durmins = Math.floor(audio.duration / 60);
	    var dursecs = Math.floor(audio.duration - durmins * 60);
		if(cursecs < 10){ cursecs = "0"+cursecs; }
	    if(dursecs < 10){ dursecs = "0"+dursecs; }
	    if(curmins < 10){ curmins = "0"+curmins; }
	    if(durmins < 10){ durmins = "0"+durmins; }
		curtimetext.innerHTML = curmins+":"+cursecs;
	    durtimetext.innerHTML = durmins+":"+dursecs;
	}

   var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();

    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 256;

    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);

    var dataArray = new Uint8Array(bufferLength);

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    function renderFrame() {
      requestAnimationFrame(renderFrame);

      x = 0;

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        
        var r = barHeight + (25 * (i/bufferLength));
        var g = 250 * (i/bufferLength);
        var b = 50;

        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    }

    audio.play();
    renderFrame();
}
//window.addEventListener("load", initAudioPlayer);
      window.onload = function() {
  
  var file = document.getElementById("thefile");
  var audio = document.getElementById("audio");
  
  file.onchange = function() {
    var files = this.files;
    initAudioPlayer(URL.createObjectURL(files[0]))
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();
 
  };
};
