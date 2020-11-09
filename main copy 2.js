(async function () {
  "use strict";

  const URL = "http://localhost:3000/radiohead/nude/drum_stem";

  const context = new AudioContext();

  const playButton = document.querySelector("#play");
  const stopBurron = document.querySelector("#stop");

  let audioE = new Audio();
  audioE.crossOrigin = "anonymous";
  audioE.src = URL;
  audioE.load();

  let analyser = context.createAnalyser();
  analyser.connect(context.destination);

  let audio;
  let duration = 0;

  window
    .fetch(URL)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
    .then((audioBuffer) => {
      playButton.disabled = false;
      audio = audioBuffer;

      let source = context.createMediaElementSource(audioE);

      source.connect(analyser);
      document.getElementById("play").style.display = "block";

      duration = audioE.duration;
      draw();
    });

  playButton.onclick = () => play(audio);
  stopBurron.onclick = () => stop(audio);

  function play(audioBuffer) {
    const source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(context.destination);
    source.start();
  }

  function stop(audioBuffer) {
    window.location.reload();
  }

  function getDataFromAudio() {
    //analyser.fftSize = 2048;
    let freqByteData = new Uint8Array(analyser.fftSize / 2);
    analyser.getByteFrequencyData(freqByteData);
    return { f: freqByteData }; // array of all 1024 levels
  }

  //play button
  document.getElementById("play").addEventListener("click", function () {
    //audio.currentTime=420;
    audioE.paused ? (audioE.play(), draw()) : audioE.pause();
  });

  let currentTime;
  function draw(t) {
    currentTime = audioE.currentTime;
    let ID = requestAnimationFrame(draw);
    if (audioE.paused) {
      cancelAnimationFrame(ID);
    }
    let { f } = getDataFromAudio(); // {f:array, t:array}

    const canva = document.getElementById("canvas");

    // Drums
    generateDrums(f, canva);
  }

  function convert(Uint8Arr) {
    return String.fromCharCode.apply(null, Uint8Arr).replace(" ", "");
  }

  function getColor(str) {
    return "#" + intToRGB(hashCode(str));
  }

  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  function intToRGB(i) {
    let c = (i & 0x00ffffff).toString(16).toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
  }

  function generateDrums(f, canva) {
    let element;

    ////////
    const color = getColor(convert(f));
    const fnum = f.reduce((a, b) => a + b);
    const opacity = Math.random();

    if (fnum > 1000) {
      element = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      element.setAttribute("id", "drum-element");
      element.setAttribute("fill", color);
      element.setAttribute("opacity", opacity);
      element.setAttribute("cx", Math.random() * fnum);
      element.setAttribute("cy", Math.random() * fnum);
      element.setAttribute("r", Math.random() * fnum);
      canva.appendChild(element);
      if (canva.hasChildNodes()) {
        setTimeout(() => {
          canva.removeChild(element);
        }, 300);
      }
    }
    ///////
  }

  function mixDown(bufferList, totalLength, numberOfChannels = 2) {
    //create a buffer using the totalLength and sampleRate of the first buffer node
    let finalMix = context.createBuffer(
      numberOfChannels,
      totalLength,
      bufferList[0].sampleRate
    );

    //first loop for buffer list
    for (let i = 0; i < bufferList.length; i++) {
      // second loop for each channel ie. left and right
      for (let channel = 0; channel < numberOfChannels; channel++) {
        //here we get a reference to the final mix buffer data
        let buffer = finalMix.getChannelData(channel);

        //last is loop for updating/summing the track buffer with the final mix buffer
        for (let j = 0; j < bufferList[i].length; j++) {
          buffer[j] += bufferList[i].getChannelData(channel)[j];
        }
      }
    }

    return finalMix;
  }
})();
