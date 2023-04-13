const express = require("express");
const ytdl = require('ytdl-core');
const fs = require('fs');
const { exec } = require("child_process");
const { dirname } = require("path");

const PORT = process.env.PORT || 3030;
process.env.YTDL_NO_UPDATE = 'true';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const app = express();
app.use(express.urlencoded({
    extended: true
}))

app.post("/", async (req, res) => {
    let videoURL = req.body.url
    let format = req.body.formata

    if (format == "video") {
        ytdl(videoURL, { filter: 'audioandvideo' })
            .pipe(fs.createWriteStream(`${__dirname}/static/video.mp4`))
            .on('finish', () => {
                res.download(`${__dirname}/static/video.mp4`)
                sleep(5000).then(() => {
                    exec(`rm ${__dirname}/static/video.mp4`)
                });
            });
    }
    else {
        ytdl(videoURL, { filter: 'audioonly' })
            .pipe(fs.createWriteStream(`${__dirname}/static/audio.webm`))
            .on('finish', () => {
                res.download(`${__dirname}/static/audio.webm`)
                sleep(5000).then(() => {
                    exec(`rm ${__dirname}/static/audio.webm`)
                });
            });
    };

}),
    app.listen(3030, function () {
        console.log("server is running on port http://127.0.0.1:3030/, https://ytmp3-dw2o.onrender.com/");
    });
