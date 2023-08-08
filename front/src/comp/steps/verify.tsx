import styled from "@emotion/styled";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useWeb3React } from "@web3-react/core";
import { useStepContext } from "../../providers/stepProvider";

import { oauthTwitter } from "../../api/oauth";
import useSubcribe from "../useSubscribe";
import { TWITTER_APP_CLIENT_ID, TWITTER_REDIRECT_URL, LOCAL_OAUTH_KEY } from "../../constants";


interface IProps {
  handleBack: () => void;
  handleNext: () => void;
}

export default function VerifyStep({ handleBack, handleNext }: IProps) {
  const { account, provider } = useWeb3React();
  const { state: { twitter_data } } = useStepContext();
  const onClickBack = () => {
    // do sth before go to back step if you want
    handleBack();
  };

  const onClickNext = () => {
    // do sth before go to next step if you want
    handleNext();
  };

  const onClickVerify = async () => {
    if (!provider) {
      return;
    }

    console.log(twitter_data);

    // sign msg
    const signData = await provider.send("personal_sign", ["", account]);


    // await oauthTwitter(twitter_data.code, TWITTER_REDIRECT_URL, account!);
  };
  return (
    <VerifyStepStyle>
      <MainButtonBox>
        <Button variant="contained" color="primary" onClick={onClickVerify}>
          Verify
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
    </VerifyStepStyle>
  );
}

const VerifyStepStyle = styled.div``;

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
`;
