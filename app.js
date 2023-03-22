const express = require("express");
const ytdl = require('ytdl-core');
const fs = require('fs');
const { exec } = require("child_process");
const { dirname } = require("path");

const PORT = process.env.PORT || 3030;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const app = express();
app.use(express.urlencoded({
    extended: true
}))

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.post("/download", async (req, res) => {
    let videoURL = req.body.url
    let format = req.body.format

    if (format == "video") {
        ytdl(videoURL, { filter: 'audioandvideo' })
            .pipe(fs.createWriteStream(`${__dirname}/static/video.webm`))
            .on('finish', async () => {
                res.download(`${__dirname}/static/video.webm`)
                await new Promise(r => setTimeout(r, 5000));
                exec(`rm ${__dirname}/static/video.webm`)
            })
    }
    else {
        ytdl(videoURL, { filter: 'audioonly' })
            .pipe(fs.createWriteStream(`${__dirname}/static/audio.webm`))
            .on('finish', async () => {
                res.download(`${__dirname}/static/audio.webm`)
                await new Promise(r => setTimeout(r, 5000));
                exec(`rm ${__dirname}/static/audio.webm`)
            })
    }
})

app.listen(PORT, function () {
    console.log("server is running on port http://127.0.0.1:8000/");
})
