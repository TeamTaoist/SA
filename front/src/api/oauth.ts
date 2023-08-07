import request, { ResponseData } from "./request";

interface IClientIdResponse {
    twitter: { clientId: string };
    discord: { clientId: string };
}


export interface ITwitterUser {
    userId: string;
    username: string;
}

export const oauthTwitter = (code: string, redirectUri: string): Promise<ResponseData<ITwitterUser>> => {
    console.log(`code: ${code}, redirect uri: ${redirectUri}`);
    return request.post("/oauth/twitter", { code: code, redirect_uri: redirectUri });
};

export interface IDiscordUser {
    userId: string;
    username: string;
}

export const oauthDiscord = (code: string, redirectUri: string): Promise<ResponseData<IDiscordUser>> => {
    return request.post("/oauth/discord", { code, redirectUri });
};
