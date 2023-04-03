// set up basic variables for app

const record = document.querySelector('.record');
const border = document.querySelector('.border');
const canvas = document.querySelector('.visualizer');
const mainSection = document.querySelector('.main-controls');
const printout = document.querySelector('.printout');
const canvasCtx = canvas.getContext("2d");

let recording = false;
let audioCtx;

if (navigator.mediaDevices.getUserMedia) {
  const constraints = { audio: true };
  // this stores the data for the audio blob
  let chunks = [];

  let onSuccess = function(stream) {
    const mediaRecorder = new MediaRecorder(stream);
    visualize(stream);
    // when the user clicks on the record button
    record.onclick = function() {
      // start the recording
      if (recording == false) {
        mediaRecorder.start();
        record.style.background = "red";
        record.innerHTML = "<i class='fa-solid fa-stop'></i>";
        recording = true;
      } else {
        // stop the recording
        mediaRecorder.stop();
        record.style.background = "";
        record.innerHTML = "<i class='fa-solid fa-microphone'></i>";
        recording = false;
      }
    }
    // when the user clicks on the stop button
    mediaRecorder.onstop = function(e) {
      // create an audio blob in webm format
      const blob = new Blob(chunks, { type: "audio/webm" });
      // add it to the form
      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');
      // send the audio blob to the server
      fetch('/record', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        // display the respond on the browser
        out = '<div class="text-primary-emphasis fw-bolder pt-3">' + data["input"] +
        '</div><div class="text-body-emphasis">' + data["output"] + '</div>';
        printout.innerHTML += out;
        // move to the bottom of the div
        border.scrollTop = border.scrollHeight;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      chunks = [];
    }
    // add the data into chunks when its available
    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
  }
  let onError = function(err) {
    console.log('The following error occured: ' + err);
  }
  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
} 
else {
   console.log('getUserMedia not supported on your browser!');
}

// display the visualization
function visualize(stream) {
  if(!audioCtx) {
    audioCtx = new AudioContext();
  }

  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);
  draw()

  function draw() {
    const WIDTH = canvas.width
    const HEIGHT = canvas.height;
    requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);
    canvasCtx.fillStyle = 'aliceblue';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'LightSteelBlue';
    canvasCtx.beginPath();

    let sliceWidth = WIDTH * 1.0 / bufferLength;
    let x = 0;
    for(let i = 0; i < bufferLength; i++) {
      let v = dataArray[i] / 128.0;
      let y = v * HEIGHT/2;
      if(i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke();
  }
}

window.onresize = function() {
  canvas.width = mainSection.offsetWidth;
}

window.onresize();