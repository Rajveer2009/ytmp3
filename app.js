const express = require("express");
const ytdl = require('ytdl-core');
const fs = require('fs');
const { exec } = require("child_process");
const pathlib = require("path");

const port = 8000

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const app = express();
app.use(express.urlencoded({
    extended: true
}))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.post("/post", async (req, res) => {
    let videoURL = req.body.url
    let format = req.body.format
    let vpath = pathlib.join(__dirname, "/static/video.mp4")
    let apath = pathlib.join(__dirname, "/static/audio.webm")

    console.log("req accept");

    if (format == "video") {
        ytdl(videoURL, { filter: 'videoandaudio' })
            .pipe(fs.createWriteStream(vpath))
            .on('finish', () => {
                res.download(vpath);
            });
    }
    else if(format == "audio") {
        ytdl(videoURL, { filter: 'audioonly' })
            .pipe(fs.createWriteStream(apath))
            .on('finish', () => {
                res.download(apath);
            });
    }
    else {
        res.sendStatus(400);
    }

}),
    app.listen(port, function() {
        console.log(`server is running on port http://127.0.0.1:${port}/`);
    });
