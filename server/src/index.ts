import "dotenv/config";
import express from "express";
import axios from "axios";
import cors from "cors";
import { ethers } from 'ethers';
import { time } from "console";
import { sign } from "crypto";

/// twitter Config
const BearerToken = process.env.TWITTER_BEARER_TOKEN;
const ClientID = process.env.TWITTER_APP_CLIENT_ID;
const ClientSecret = process.env.TWITTER_APP_CLIENT_SECRET;
const ETH_PRIV_KEY = process.env.SA_ETHEREUM_PRI_KEY || '';

const port = 8888;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function signAttestMessage(receiver: string, twitterId: string, twitterName: string): Promise<any> {

    const provider = ethers.getDefaultProvider("homestead");
    const wallet = new ethers.Wallet(ETH_PRIV_KEY, provider);
    const address = wallet.address;

    const timestamp = Math.floor(new Date().getTime() / 1000);

    const payload = twitterId;

    const data = {
        attester: address,
        receiver: receiver,
        timestamp: timestamp,
        payload: payload
    };

    const abiCoder = ethers.AbiCoder.defaultAbiCoder();

    const packedData = abiCoder.encode(["address", "address", "uint256", "string"], [address, receiver, timestamp, twitterName]);
    const signature = await wallet.signMessage(packedData);

    // const returnData = Object.assign({ attesterSig: signature, ...data })

    return Object.assign({ attesterSig: signature, ...data });
    // return signature;
}

// function signAttestMessage(attester: string, receiver: string, saContract: string, timestamp: string, msg: string,): string {

//     const signingKey = new ethers.SigningKey(ETH_PRIV_KEY);
//     const address = ethers.computeAddress(signingKey.publicKey);

//     console.log(msg);

//     const data = {
//         signer: address,
//         ts: timestamp,
//         ...msg
//     }
//     console.log('data', data);

//     const signature = signingKey.sign(ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(data))));
//     console.log('signature', signature.serialized);

//     return Object.assign({ sig: signature.serialized, ...data });
// }

app.get("/api/twitter/get_id/:userName", function (req, res) {
    var params = req.params;
    console.debug("=====", params.userName)
    axios({
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
})


app.post("/oauth/twitter", function (req, res) {
    var params = req.params;
    console.debug("=====", params)

    var body = req.body;
    console.debug("======body", body);

    var code = req.body.code;
    var redirect_uri = req.body.redirect_uri;
    var receiver = req.body.receiver;

    var formdata = {
        "client_id": ClientID,
        "client_secret": ClientSecret,
        "grant_type": "authorization_code",
        "code_verifier": "challenge",
        "code": req.body.code,
        "redirect_uri": req.body.redirect_uri,
    }

    console.debug("=====formdata", formdata);

    console.debug("=====data", axios.toFormData(formdata));

    axios({
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

        axios({
            method: "get",
            url: "https://api.twitter.com/2/users/me",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
                "Authorization": "Bearer " + dataResult.data.access_token
            }
        }).then(async (dataResult) => {
            console.log(dataResult.data);

            var result = await signAttestMessage(receiver, dataResult.data.data.id, dataResult.data.data.username);
            console.log(result);
            res.send(JSON.stringify(result));
        })
    }).catch((error) => {
        // console.debug(error);
        // console.debug(error.message);
        res.status(500).send(error);
    });
});


app.post("/oauth/discord", function (req, res) {
    var params = req.params;
    console.debug("=====", params)


    var body = req.body;
    console.debug("======body", body);


    res.send('ok');
});

app.get("/alive", function (req, res) {
    var params = req.params;
    res.send("ok");
});

app.listen(port, () => {
    console.log(`SA listening on http://127.0.0.1:8888`)
});