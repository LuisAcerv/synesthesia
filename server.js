const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());

app.get('/song', (req, res) => {
    res.sendFile(path.join(__dirname, '/audio', 'paranoid_android.mp3'));
})


app.get('/radiohead/nude/drum_stem', (req, res) => {
    res.sendFile(path.join(__dirname, '/audio/radiohead_nude', 'nude_drum_stem.wav'));
})

app.get('/radiohead/nude/bass_stem', (req, res) => {
    res.sendFile(path.join(__dirname, '/audio/radiohead_nude', 'nude_bass_stem.wav'));
})

app.get('/radiohead/nude/string_stem', (req, res) => {
    res.sendFile(path.join(__dirname, '/audio/radiohead_nude', 'nude_string_fx.wav'));
})

app.get('/radiohead/nude/voice_stem', (req, res) => {
    res.sendFile(path.join(__dirname, '/audio/radiohead_nude', 'nude_voice_stem.wav'));
})


app.listen(3000, () => console.log('server running at http://localhost:3000'))