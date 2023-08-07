"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
/// twitter Config
const BearerToken = process.env.TWITTER_BEARER_TOKEN;
const ClientID = process.env.TWITTER_APP_CLIENT_ID;
const ClientSecret = process.env.TWITTER_APP_CLIENT_SECRET;
const port = 8888;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.get("/api/twitter/get_id/:userName", function (req, res) {
    var params = req.params;
    console.debug("=====", params.userName);
    (0, axios_1.default)({
        method: "get",
        url: `https://api.twitter.com/2/users/by?usernames=${params.userName}`,
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${BearerToken}`
        }
    }).then((dataResult) => {
        res.send(dataResult.data);
    }).catch((error) => {
        res.status(500).send(error);
    });
});
app.post("/oauth/twitter", function (req, res) {
    var params = req.params;
    console.debug("=====", params);
    var body = req.body;
    console.debug("======body", body);
    // todo: add ethereum wallet signature from client
    var formdata = {
        "client_id": ClientID,
        "client_secret": ClientSecret,
        "grant_type": "authorization_code",
        "code_verifier": "challenge",
        "code": req.body.code,
        "redirect_uri": req.body.redirect_uri,
    };
    console.debug("=====formdata", formdata);
    console.debug("=====data", axios_1.default.toFormData(formdata));
    (0, axios_1.default)({
        method: "post",
        url: `https://api.twitter.com/2/oauth2/token`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
        },
        data: formdata
    }).then((dataResult) => {
        console.log(dataResult.data);
        // res.send(dataResult.data);
        (0, axios_1.default)({
            method: "get",
            url: "https://api.twitter.com/2/users/me",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
                "Authorization": "Bearer " + dataResult.data.access_token
            }
        }).then((dataResult) => {
            console.log(dataResult.data);
            res.send(dataResult.data);
        });
    }).catch((error) => {
        // console.debug(error);
        // console.debug(error.message);
        res.status(500).send(error);
    });
});
app.post("/oauth/discord", function (req, res) {
    var params = req.params;
    console.debug("=====", params);
    var body = req.body;
    console.debug("======body", body);
    res.send('ok');
});
app.get("/alive", function (req, res) {
    var params = req.params;
    res.send("ok");
});
app.listen(port, () => {
    console.log(`SA listening on http://127.0.0.1:8888`);
});
