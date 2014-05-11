window.onload = function() {

	var myPeerConnection;
	var remotePeerConnection;

	var PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
	var SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;

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
		createPeerConnections(stream);
	}

	function createPeerConnections(stream) {
		// create local peer connection
		myPeerConnection = new PeerConnection(null);
		console.log('Created local peer connection object myPeerConnection');

		// create remote peer connection
		remotePeerConnection = new PeerConnection(null);
		console.log('Created remote peeer connection object remotePeerConnection');

		// listen for ICE candidates on each
		myPeerConnection.onicecandidate = gotMyIceCandidate;
		remotePeerConnection.onicecandidate = gotRemoteIceCandidate;

		// handle stream on each peer
		myPeerConnection.addStream(stream);
		console.log('Added local stream to myPeerConnection');
		remotePeerConnection.onaddstream = gotRemoteStream;

		// create local peer connection offer
		myPeerConnection.createOffer(gotLocalDescription);
		console.log('Created SDP offer on myPeerConnection');
	}

	// when local ice candidate is received ..
	function gotMyIceCandidate(event) {
		if(event.candidate) {
			//send the local ICE candidate to the remote peer
			remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
			// console.log("Local ice candidate: \n" + event.candidate.candidate);
			console.log('Sent my ICE candidates to remotePeerConnection');
		}
	}

	// when remote ice candidates are received by me ..
	function gotRemoteIceCandidate(event) {
		if(event.candidate) {
			// add the remote ice candidate to my local connection
			myPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
			// console.log("Remote ice candidate: \n" + event.candidate.candidate);
			console.log('Added remote ICE candidates to myPeerConnection');
		}
	}

	// create sdp offer
	function gotLocalDescription(description) {
		myPeerConnection.setLocalDescription(description);
		// console.log('Offer from myPeerConnection: \n' + description.sdp);
		console.log('Created offer from myPeerConnection');
		remotePeerConnection.setRemoteDescription(description);
		remotePeerConnection.createAnswer(gotRemoteDescription);
	}

	// when remote sdp arrives
	function gotRemoteDescription(description) {
		remotePeerConnection.setLocalDescription(description);
		// console.log('Answer from remotePeerConnection: \n' + description.sdp);
		console.log('Got answer from remotePeerConnection');
		myPeerConnection.setRemoteDescription(description);
	}

	// success! show the remote video
	function gotRemoteStream(event) {
		theirVideo.src = URL.createObjectURL(event.stream);
		theirVideo.play();
		console.log('Got remote stream');
	}

	document.getElementById('snapshot').onclick = function() { 
    var video = document.querySelector('video'); 
    var canvas = document.getElementById('canvas'); 
    var ctx = canvas.getContext('2d'); 
    ctx.drawImage(video,0,0, 100, 100); 
} 
}

