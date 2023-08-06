"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv");
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
// twitter Config
const BearerToken = process.env.TWITTER_BEARER_TOKEN;
const port = 8888;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.get('/getTwitterID/:userName', function (req, res) {
    var params = req.params;
    console.debug("=====", params.userName);
    (0, axios_1.default)({
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
});
app.get('/alive', function (req, res) {
    var params = req.params;
    res.send('ok');
});
app.listen(port, () => {
    console.log(`SA listening on http://127.0.0.1:8888`);
});
