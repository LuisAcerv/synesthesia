(async function () {
  "use strict";

  const URL = "http://localhost:3000/song";

  const context = new AudioContext();

  const playButton = document.querySelector("#play");
  const stopBurron = document.querySelector("#stop");

  var audioE = new Audio();
  audioE.crossOrigin = "anonymous";
  audioE.src = URL;
  audioE.load();

  var analyser = context.createAnalyser();
  analyser.connect(context.destination);

  let audio;
  var duration = 0;

  window
    .fetch(URL)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
    .then((audioBuffer) => {
      playButton.disabled = false;
      audio = audioBuffer;

      var source = context.createMediaElementSource(audioE);

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
    var freqByteData = new Uint8Array(analyser.fftSize / 2);
    var timeByteData = new Uint8Array(analyser.fftSize / 2);
    analyser.getByteFrequencyData(freqByteData);
    analyser.getByteTimeDomainData(timeByteData);
    return { f: freqByteData, t: timeByteData }; // array of all 1024 levels
  }

  //play button
  document.getElementById("play").addEventListener("click", function () {
    //audio.currentTime=420;
    audioE.paused ? (audioE.play(), draw()) : audioE.pause();
  });

  var currentTime;
  function draw(t) {
    currentTime = audioE.currentTime;
    var ID = requestAnimationFrame(draw);
    if (audioE.paused) {
      cancelAnimationFrame(ID);
    }
    var data = getDataFromAudio(); // {f:array, t:array}
    // console.log(getColor(convert(data.f)), getColor(convert(data.t)));

    var waveSum = 0;
    //draw live waveform and oscilloscope

    // for (let i = 0; i < data.f.length; i++) {
    //   const colorB = getColor(convert(data.t));
    //   //ctx.fillStyle = colorB;
    //   ctx.fillRect(i, ch, 1, -data.f[i]);
    //   waveSum += data.f[i]; //add current bar value (max 255)
    // }

    // for (let i = 0; i < data.t.length; i++) {
    //   const colorA = getColor(convert(data.f));
    //   ctx.fillStyle = colorA;
    //   ctx.fillRect(i * 2, data.t[i], 1, 1);
    // }

    const c = document.getElementById("canvas");
    let line;
    let circle;

    for (let i = 0; i < data.f.length; i++) {
      setTimeout(() => {
        const color = getColor(convert(data.f));
        const color2 = getColor(convert(data.f));
        const opacity = Math.random();

        //   circle = `
        //   <circle
        //   cx="${Math.random() * (data.f[i] - i)}"
        //   cy="${Math.random() * (data.f[i] - i)}"
        //   r="${Math.random() * data.f[i]}"
        //   opacity={opacity}
        //   fill="${color2}"
        // />`;
        if (i % 2 === 0) {
          line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("stroke", color);
          line.setAttribute("opacity", opacity);
          line.setAttribute("x1", Math.random() * (data.f[i] - i));
          line.setAttribute("x2", Math.random() * (i + data.f[i]));
          line.setAttribute("y1", Math.random() * (i + data.f[i]));
          line.setAttribute("y2", Math.random() * (i + data.f[i]));
          c.appendChild(line);
        }
      }, 600);
      setTimeout(() => {
        c.innerHTML = "";
      }, 900);
    }
  }

  function convert(Uint8Arr) {
    return String.fromCharCode.apply(null, Uint8Arr).replace(" ", "");
  }

  function getColor(str) {
    return "#" + intToRGB(hashCode(str));
  }

  function hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  function intToRGB(i) {
    var c = (i & 0x00ffffff).toString(16).toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
  }
})();

// https://s3-us-west-2.amazonaws.com/s.cdpn.io/123941/Yodel_Sound_Effect.mp3
