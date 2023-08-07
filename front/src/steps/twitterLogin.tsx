import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { TWITTER_APP_CLIENT_ID, TWITTER_REDIRECT_URL } from "../constants";


const POPUP_HEIGHT = 700;
const POPUP_WIDTH = 600;

interface IProps {
  handleBack?: () => void;
  handleNext: () => void;
}

export default function TwitterLoginStep({ handleNext }: IProps) {

  const onClickNext = () => {
    // do sth before go to next step if you want
    handleNext();
  };

  const onClickBtn = () => {
    var state = `${Date.now()}_${TWITTER_APP_CLIENT_ID}`;
    var url = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${TWITTER_APP_CLIENT_ID}&redirect_uri=${TWITTER_REDIRECT_URL}&scope=tweet.read%20users.read&state=${state}&code_challenge=challenge&code_challenge_method=plain`;
    const top = window.outerHeight / 2 + window.screenY - POPUP_HEIGHT / 2;
    const left = window.outerWidth / 2 + window.screenX - POPUP_WIDTH / 2;
    window.open(url, "OAuth2", `height=${POPUP_HEIGHT},width=${POPUP_WIDTH},top=${top},left=${left}`);
  };

  return (
    <TwitterStepStyle>
      <Button variant="contained" color="primary" onClick={onClickBtn}>
        Signin Twitter
      </Button>
      <OptionBox sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button onClick={onClickNext}>Next</Button>
      </OptionBox>
    </TwitterStepStyle>
  );
}

const TwitterStepStyle = styled.div``;

const OptionBox = styled(Box)`
  position: fixed;
  right: 80px;
  bottom: 60px;
`;
