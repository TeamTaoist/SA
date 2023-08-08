import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { oauthTwitter } from "../../api/oauth";
import useSubcribe from "../useSubscribe";


import { TWITTER_APP_CLIENT_ID, TWITTER_REDIRECT_URL, LOCAL_OAUTH_KEY } from "../../constants";
import { StepActionType, useStepContext } from "../../providers/stepProvider";


const POPUP_HEIGHT = 700;
const POPUP_WIDTH = 600;

interface IProps {
  handleBack: () => void;
  handleNext: () => void;
}

export default function TwitterLoginStep({ handleBack, handleNext }: IProps) {
  const { dispatch } = useStepContext();

  const onClickBack = () => {
    // do sth before go to back step if you want
    handleBack();
  };

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

  const handleOauth = async (code: string, msgType: string) => {
    try {
      // let resp;
      // if (msgType === LOCAL_OAUTH_KEY.Twitter) {
      //   resp = await oauthTwitter(code, TWITTER_REDIRECT_URL);
      // }
      dispatch({ type: StepActionType.SET_TWITTER_DATA, payload: { code } });

      handleNext();
      // return resp?.data;
    } catch (genericError) {
      console.error(genericError);
    }
  };

  useSubcribe("SA_OAUTH_EVENT_TWITTER", async (_: any, { code, msgFrom, msgType }: { code: string; msgFrom: string; msgType: string }) => {
    console.log(`from ${msgFrom}`);
    await handleOauth(code, msgType);
  });

  return (
    <TwitterStepStyle>
      <MainButtonBox>
        <Button variant="contained" color="primary" onClick={onClickBtn}>
          Signin Twitter
        </Button>
      </MainButtonBox>

      <OptionBox sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Button onClick={onClickBack} sx={{ mr: 1 }} variant="outlined">
          Back
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button onClick={onClickNext} variant="contained">
          Next
        </Button>
      </OptionBox>
    </TwitterStepStyle>
  );
}

const TwitterStepStyle = styled.div``;

const OptionBox = styled(Box)`
  position: absolute;
  right: 40px;
  bottom: 40px;
`;
const MainButtonBox = styled.div`
  display: flex;
  height: 200px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
