import React, { useEffect, ReactElement } from "react";
import PubSub from "pubsub-js";
import { LOCAL_OAUTH_KEY } from "../constants";

export default function OAuthEventListener() {
    const handleMessage = (e: { data: any }) => {
        const data = e.data || {};
        const msgType = data.msgType;

        console.log(`data`, data);
        
        if (msgType === LOCAL_OAUTH_KEY.Twitter) {
            PubSub.publish("SA_OAUTH_EVENT_TWITTER", e.data);
        } else if (msgType === LOCAL_OAUTH_KEY.Discord) {
            PubSub.publish("SA_OAUTH_EVENT_DISCORD", e.data);
        }
    };
    useEffect(() => {
        const _bc = new BroadcastChannel("SA_OAUTH");
        _bc.onmessage = handleMessage;
        return () => {
            _bc?.close();
        };
    }, []);
    return <React.Fragment></React.Fragment>
}
