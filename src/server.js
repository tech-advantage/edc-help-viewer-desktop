const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require("../conf/config_electron_viewer.json");

let viewerUrl = "";

const app = express();

app
.use(cors())
.use(bodyParser.json());

app.post('/viewerurl', (req, res) => {
    viewerUrl = req.body;
    res.json(req.body);
})

app.get('/viewerurl', (req, res) => {
    res.status(200).json(viewerUrl);
})

app.use(({res}) => {
    const message = "Unable to find the requested resource ! You can try another URL.";
    res.status(404).json({message});
})

app.listen(config.server_port, () => console.log(`Our node application is started on : ${config.protocol + config.hostname}:${config.server_port}`));