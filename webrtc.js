navigator.getWebcam = (
	navigator.getUserMedia || 
	navigator.webkitGetUserMedia || 
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia );

navigator.getWebcam(
	// constraint
	{ video: true, audio: false },
	// success callback
	gotWebcam,
	//error callback
	function(err) {
		console.log("Oops! Something not right." + err);
	}

);

function gotWebcam(stream) {
	localVideo.src = window.URL.createObjectURL(stream);
	localVideo.play();

	// display some of the attributes of the MediaStream and MediaStreamTrack
	// first, reach into the mediastream object to access info about the mediaStreamTrack
	var video_track = stream.getVideoTracks()[0];

	// show this info in a div
	var output = document.getElementById('output');

	// print id of the mediastream object
	output.innerHTML = "stream id: " + stream.id + "<br>";

	// print info about the mediastream track
	output.innerHTML += "track readyState = " + video_track.readyState + "<br>";
	output.innerHTML += "track id = " + video_track.id + "<br>";
	output.innerHTML += "kind = " + video_track.kind + "<br>";
}