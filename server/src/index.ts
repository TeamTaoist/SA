import "dotenv";
import express from "express";
import axios from "axios";
import cors from "cors";

// twitter Config
const BearerToken = process.env.TWITTER_BEARER_TOKEN;

const port = 8888;
const app = express();

app.use(cors());

app.get('/getTwitterID/:userName', function (req, res) {
    var params = req.params;
    console.debug("=====", params.userName)
    axios({
        method: 'get',
        url: `https://api.twitter.com/2/users/by?usernames=${params.userName}`,
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${BearerToken}`
        }
    }).then((dataResult) => {
        res.send(dataResult.data);
    }).catch((error) => {
        res.status(500).send(error);
    });
})


app.get('/alive', function (req, res) {
    var params = req.params;
    res.send('ok');
})

app.listen(port, () => {
    console.log(`SA listening on http://127.0.0.1:8888`)
})