export const LOCALSTORAGE = {
    USER_TOKEN: "user_token",
    TOKEN_EXPIRE: "user_token_expire_at",
    WALLET: "selected_wallet",
};

export const TWITTER_APP_CLIENT_ID = "ZEhURHdBZWl3WHNlTmJsc2FWbnY6MTpjaQ"; // Need fetch from Twitter Developer Portal
export const TWITTER_REDIRECT_URL = "http://localhost:3000/oauth/twitter";

export const MAX_NAME_LENGTH = 30;
export const MAX_DESC_LENGTH = 300;

const getLocalOauthUserKey = (name: string) => {
    return `OAuth_User_${name}`;
};

export const LOCAL_OAUTH_USER = {
    Twitter: getLocalOauthUserKey("Twitter"),
    Discord: getLocalOauthUserKey("Discord"),
};

const getLocalOauthKey = (name: string) => {
    return `SA_${name}_Code`;
};

export const LOCAL_OAUTH_KEY = {
    Twitter: getLocalOauthKey("Twitter"),
    Discord: getLocalOauthKey("Discord"),
};

export const SELECT_WALLET = "Wallet";