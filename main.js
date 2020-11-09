(async function () {
  "use strict";
  // BUTTONS
  const playButton = document.querySelector("#play");
  const stopBurron = document.querySelector("#stop");

  // AUDIO HANDLING
  const context = new AudioContext();
  const arrayOfAudioBuffers = [];

  // DRUMS
  const DRUMS_URL = "http://localhost:3000/radiohead/nude/drum_stem";
  let audioDrums = new Audio();
  audioDrums.crossOrigin = "anonymous";
  audioDrums.src = DRUMS_URL;
  audioDrums.load();

  let drumsAnalyser = context.createAnalyser();
  drumsAnalyser.connect(context.destination);

  let audioDrumsBuf;

  // FETCH
  const drumsRes = await window.fetch(DRUMS_URL);
  const drumsArrayBuf = await drumsRes.arrayBuffer();
  const drumsDecodedArrayBuf = await context.decodeAudioData(drumsArrayBuf);

  audioDrumsBuf = drumsDecodedArrayBuf;
  arrayOfAudioBuffers.push(drumsDecodedArrayBuf);

  let drumsSrc = context.createMediaElementSource(audioDrums);
  drumsSrc.connect(drumsAnalyser);

  ////////

  // BASS
  const BASS_URL = "http://localhost:3000/radiohead/nude/bass_stem";
  let audioBass = new Audio();
  audioBass.crossOrigin = "anonymous";
  audioBass.src = BASS_URL;
  audioBass.load();

  let bassAnalyser = context.createAnalyser();
  bassAnalyser.connect(context.destination);

  let audioBassBuf;

  // FETCH
  const bassRes = await window.fetch(BASS_URL);
  const bassArrayBuf = await bassRes.arrayBuffer();
  const bassDecodedArrayBuf = await context.decodeAudioData(bassArrayBuf);

  audioBassBuf = bassDecodedArrayBuf;
  arrayOfAudioBuffers.push(bassDecodedArrayBuf);

  let bassSrc = context.createMediaElementSource(audioBass);
  bassSrc.connect(bassAnalyser);

  ////////

  // STRING FX
  const STRING_URL = "http://localhost:3000/radiohead/nude/string_stem";
  let audioStrings = new Audio();
  audioStrings.crossOrigin = "anonymous";
  audioStrings.src = STRING_URL;
  audioStrings.load();

  let stringAnalyser = context.createAnalyser();
  stringAnalyser.connect(context.destination);

  let audioStringBuf;

  // FETCH
  const stringRes = await window.fetch(STRING_URL);
  const stringArrayBuf = await stringRes.arrayBuffer();
  const stringDecodedArrayBuf = await context.decodeAudioData(stringArrayBuf);

  audioStringBuf = stringDecodedArrayBuf;
  arrayOfAudioBuffers.push(stringDecodedArrayBuf);

  let stringSrc = context.createMediaElementSource(audioStrings);
  stringSrc.connect(stringAnalyser);

  // VOICE
  const VOICE_URL = "http://localhost:3000/radiohead/nude/voice_stem";
  let audioVoice = new Audio();
  audioVoice.crossOrigin = "anonymous";
  audioVoice.src = VOICE_URL;
  audioVoice.load();

  let voiceAnalyser = context.createAnalyser();
  voiceAnalyser.connect(context.destination);

  let audioVoiceBuf;

  // FETCH
  const voiceRes = await window.fetch(VOICE_URL);
  const voiceArrayBuf = await voiceRes.arrayBuffer();
  const voiceDecodedArrayBuf = await context.decodeAudioData(voiceArrayBuf);

  audioVoiceBuf = voiceDecodedArrayBuf;
  arrayOfAudioBuffers.push(voiceDecodedArrayBuf);

  let voiceSrc = context.createMediaElementSource(audioVoice);
  voiceSrc.connect(voiceAnalyser);

  ////////

  function getStringsDataFromAudio() {
    //drumsAnalyser.fftSize = 2048;
    let freqByteData = new Uint8Array(stringAnalyser.fftSize / 2);
    stringAnalyser.getByteFrequencyData(freqByteData);
    return { f: freqByteData }; // array of all 1024 levels
  }

  function getDrumsDataFromAudio() {
    //drumsAnalyser.fftSize = 2048;
    let freqByteData = new Uint8Array(drumsAnalyser.fftSize / 2);
    drumsAnalyser.getByteFrequencyData(freqByteData);
    return { f: freqByteData }; // array of all 1024 levels
  }

  function getBassDataFromAudio() {
    //drumsAnalyser.fftSize = 2048;
    let freqByteData = new Uint8Array(bassAnalyser.fftSize / 2);
    bassAnalyser.getByteFrequencyData(freqByteData);
    return { f: freqByteData }; // array of all 1024 levels
  }

  function getVoiceDataFromAudio() {
    //drumsAnalyser.fftSize = 2048;
    let freqByteData = new Uint8Array(voiceAnalyser.fftSize / 2);
    voiceAnalyser.getByteFrequencyData(freqByteData);
    return { f: freqByteData }; // array of all 1024 levels
  }

  /// PLAY / STOP
  playButton.onclick = () => play();
  stopBurron.onclick = () => stop();

  function play() {
    const mix = context.createBufferSource();
    mix.buffer = mixDown(arrayOfAudioBuffers, getSongLength(), 2);
    mix.connect(context.destination);
    mix.start();
  }

  function stop() {
    window.location.reload();
  }

  //play button
  document.getElementById("play").addEventListener("click", function () {
    //audio.currentTime=420;
    audioVoice.paused ? (audioVoice.play(), draw()) : audioVoice.pause();
    audioStrings.paused ? (audioStrings.play(), draw()) : audioStrings.pause();
    audioDrums.paused ? (audioDrums.play(), draw()) : audioDrums.pause();
    audioBass.paused ? (audioBass.play(), draw()) : audioBass.pause();
  });

  /// DRAW
  let currentTime;
  function draw(t) {
    currentTime = audioDrums.currentTime;
    let ID = requestAnimationFrame(draw);
    if (audioDrums.paused) {
      cancelAnimationFrame(ID);
    }
    let { f: fDrums } = getDrumsDataFromAudio(); // {f:array, t:array}
    let { f: fBass } = getBassDataFromAudio(); // {f:array, t:array}
    let { f: fStrings } = getStringsDataFromAudio(); // {f:array, t:array}
    let { f: fVoice } = getVoiceDataFromAudio(); // {f:array, t:array}

    const bg = ["url(assets/noise_logo.gif);", "url(assets/noise_logo2.gif);", "url(assets/noise_logo3.gif);"]
    const canva = document.getElementById("canvas");
    canva.style =
      "width: 100%; height: 90%; border: 1px solid white;background-image:"+ bg[Math.floor(Math.random() * bg.length)];
    
    generateVoice(fVoice, canva);
    generateStrings(fStrings, canva);
    generateBass(fBass, canva);
    generateDrums(fDrums, canva);
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
      const filter = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "filter"
      );
      filter.setAttribute("id", "f1");
      filter.innerHTML = `
      <feMorphology operator="dilate" radius="4" in="SourceGraphic" result="BEVEL_10" />
        <feFuncR type="linear" slope="0.5" intercept="0.0" />
        <feSpecularLighting surfaceScale="0" specularConstant=".75" specularExponent="30" lighting-color="#white" in="GREEN-FRONT-1_10" result="GREEN-FRONT-1_20">
        <fePointLight x="0" y="-30" z="400" />
      </feSpecularLighting>
      `;

      const feComponentTransfer = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "feComponentTransfer"
      );
      feComponentTransfer.setAttribute("in", "SourceGraphic");
      feComponentTransfer.innerHTML = `
      <feFuncA type="linear" slope="2.0" intercept="0.3" />
      <feFuncG type="linear" slope="1.0" intercept="0.1" />
      <feFuncR type="linear" slope="0.5" intercept="0.0" />
      <feFuncB type="linear" slope="1.5" intercept="0.2" />
      `;

      element = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      element.setAttribute("id", "drum-element");
      element.setAttribute("fill", color);
      element.setAttribute("filter", "url(#f1)");
      element.setAttribute("opacity", opacity);
      element.setAttribute("cx", Math.random() * fnum);
      element.setAttribute("cy", Math.random() * fnum);
      element.setAttribute("r", Math.random() * fnum);

      filter.appendChild(feComponentTransfer);
      canva.appendChild(filter);
      canva.appendChild(element);
      if (canva.hasChildNodes()) {
        setTimeout(() => {
          canva.removeChild(element);
        }, 300);
      }
    }
    ///////
  }

  function generateBass(f, canva) {
    let line;

    ////////
    const color = getColor(convert(f));
    const fnum = f.reduce((a, b) => a + b);
    const opacity = Math.random();

    if (fnum > 1000) {
      const filter = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "filter"
      );
      filter.setAttribute("id", "f3");

      const feComponentTransfer = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "feComponentTransfer"
      );
      feComponentTransfer.setAttribute("in", "SourceGraphic");
      feComponentTransfer.innerHTML = `
      <feFuncA type="linear" slope="2.0" intercept="0.3" />
      <feFuncG type="linear" slope="1.0" intercept="0.1" />
      <feFuncR type="linear" slope="0.5" intercept="0.0" />
      <feFuncB type="linear" slope="1.5" intercept="0.2" />
      `;

      line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("id", "drum-element");
      line.setAttribute("stroke", color);
      line.setAttribute("opacity", opacity);
      line.setAttribute("filter", "url(#f3)");
      line.setAttribute("x1", Math.random() * fnum);
      line.setAttribute("x2", Math.random() * fnum);
      line.setAttribute("y1", Math.random() * fnum);
      line.setAttribute("y2", Math.random() * fnum);

      filter.appendChild(feComponentTransfer);
      canva.appendChild(filter);
      canva.appendChild(line);

      if (canva.hasChildNodes()) {
        setTimeout(() => {
          canva.removeChild(line);
        }, 900);
      }
    }
    ///////
  }

  function generateStrings(f, canva) {
    let line;

    ////////
    const color = getColor(convert(f));
    const fnum = f.reduce((a, b) => a + b);
    const opacity = Math.random();
    const p1 = Math.floor(Math.random() * fnum);
    const p2 = Math.floor(Math.random() * fnum);
    const p21 = Math.floor(Math.random() * fnum);
    const p3 = Math.floor(Math.random() * fnum);
    const p4 = Math.floor(Math.random() * fnum);
    const p41 = Math.floor(Math.random() * fnum);
    const p5 = Math.floor(Math.random() * fnum);

    if (fnum > 1000) {
      const filter = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "filter"
      );
      filter.setAttribute("id", "f2");

      const feComponentTransfer = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "feComponentTransfer"
      );
      feComponentTransfer.setAttribute("in", "SourceGraphic");
      feComponentTransfer.innerHTML = `
      <feFuncR type="linear" slope="0.5" intercept="0.0" />
      <feFuncG type="linear" slope="1.0" intercept="0.1" />
      <feFuncB type="linear" slope="1.5" intercept="0.2" />
      <feFuncA type="linear" slope="2.0" intercept="0.3" />

      <feTurbulence result="TURBULENCE" baseFrequency="0.08" numOctaves="1" seed="1" />
      <feDisplacementMap in="SourceGraphic" in2="TURBULENCE" scale="9" />
      `;

      line = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      line.setAttribute("id", "drum-element");
      line.setAttribute("fill", color);
      line.setAttribute("filter", "url(#f2)");
      line.setAttribute("opacity", opacity);
      line.setAttribute("style", "z-index:2;");
      line.setAttribute("points", `${p1},${p2} ${p21},${p3},${p4}${p41},${p5}`);

      filter.appendChild(feComponentTransfer);
      canva.appendChild(filter);
      canva.appendChild(line);

      if (canva.hasChildNodes()) {
        setTimeout(() => {
          canva.removeChild(line);
        }, 300);
      }
    }
    ///////
  }

  function generateVoice(f, canva) {
    let line;

    ////////
    const color = getColor(convert(f));
    const fnum = f.reduce((a, b) => a + b);
    const opacity = Math.random();
    const p1 = Math.floor(Math.random() * fnum);
    const p2 = Math.floor(Math.random() * fnum);
    const p21 = Math.floor(Math.random() * fnum);
    const p3 = Math.floor(Math.random() * fnum);
    const p31 = Math.floor(Math.random() * fnum);
    const p4 = Math.floor(Math.random() * fnum);
    const p41 = Math.floor(Math.random() * fnum);
    const p5 = Math.floor(Math.random() * fnum);
    const p51 = Math.floor(Math.random() * fnum);
    const p6 = Math.floor(Math.random() * fnum);
    const p61 = Math.floor(Math.random() * fnum);
    const p7 = Math.floor(Math.random() * fnum);

    if (fnum > 1000) {
      const filter = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "filter"
      );
      filter.setAttribute("id", "f2");
      filter.innerHTML = `
      <feFuncR type="linear" slope="0.5" intercept="0.0" />
        <feSpecularLighting surfaceScale="0" specularConstant=".75" specularExponent="30" lighting-color="#white" in="GREEN-FRONT-1_10" result="GREEN-FRONT-1_20">
        <fePointLight x="0" y="-30" z="400" />
      </feSpecularLighting>
      `;

      const feComponentTransfer = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "feComponentTransfer"
      );
      feComponentTransfer.setAttribute("in", "SourceGraphic");
      feComponentTransfer.innerHTML = `
      <feFuncR type="linear" slope="0.5" intercept="0.0" />
      `;

      line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      line.setAttribute("id", "drum-element");
      line.setAttribute("fill", color);
      line.setAttribute("filter", "url(#f2)");
      line.setAttribute("opacity", opacity);
      line.setAttribute(
        "style",
        `z-index:2;fill:${color};stroke:${color};stroke-width:${
          Math.random() * fnum
        }`
      );
      line.setAttribute(
        "points",
        `${p1},${p2} ${p21},${p3} ${p31},${p4} ${p41},${p5} ${p51},${p6} ${p61},${p7}`
      );

      filter.appendChild(feComponentTransfer);
      canva.appendChild(filter);
      canva.appendChild(line);

      if (canva.hasChildNodes()) {
        setTimeout(() => {
          canva.removeChild(line);
        }, 300);
      }
    }
    ///////
  }

  // MIX
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

  function getSongLength() {
    let songLength = 0;

    for (let track of arrayOfAudioBuffers) {
      if (track.length > songLength) {
        songLength = track.length;
      }
    }

    return songLength;
  }
})();
