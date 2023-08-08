import styled from "@emotion/styled";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useWeb3React } from "@web3-react/core";
import { useStepContext } from "../../providers/stepProvider";

interface IProps {
  handleBack: () => void;
}

export default function AttestStep({ handleBack }: IProps) {
  const { account, provider } = useWeb3React();
  const { state: { twitter_data } } = useStepContext();
  const onClickBack = () => {
    // do sth before go to back step if you want
    handleBack();
  };
  const onClickAttest = async () => {
    if (!provider) {
      return;
    }

    console.log(twitter_data);
    
    // sign msg
    const signData = await provider.send("personal_sign", ["", account]);
  };
  return (
    <AttestStepStyle>
      <MainButtonBox>
        <Button variant="contained" color="primary" onClick={onClickAttest}>
          Attest
        </Button>
      </MainButtonBox>
      <OptionBox sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Button color="inherit" onClick={onClickBack} sx={{ mr: 1 }}>
          Back
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
      </OptionBox>
    </AttestStepStyle>
  );
}

const AttestStepStyle = styled.div``;

const OptionBox = styled(Box)`
  position: absolute;
  right: 40px;
  bottom: 40px;
`;

const MainButtonBox = styled.div`
  display: flex;
  height: 300px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
