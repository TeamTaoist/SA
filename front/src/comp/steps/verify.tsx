import styled from "@emotion/styled";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useWeb3React } from "@web3-react/core";
import { useStepContext } from "../../providers/stepProvider";

interface IProps {
  handleBack: () => void;
}

export default function VerifyStep({ handleBack }: IProps) {
  const { account, provider } = useWeb3React();
  const { state: { twitter_data } } = useStepContext();
  const onClickBack = () => {
    // do sth before go to back step if you want
    handleBack();
  };
  const onClickVerify = async () => {
    if (!provider) {
      return;
    }
    // sign msg
    const signData = await provider.send("personal_sign", ["", account]);
  };
  return (
    <VerifyStepStyle>
      <Button variant="contained" color="primary" onClick={onClickVerify}>
        Verify
      </Button>
      <OptionBox sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Button color="inherit" onClick={onClickBack} sx={{ mr: 1 }}>
          Back
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
      </OptionBox>
    </VerifyStepStyle>
  );
}

const VerifyStepStyle = styled.div``;

const OptionBox = styled(Box)`
  position: fixed;
  right: 80px;
  bottom: 60px;
`;
