import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { injected as connector } from "../../wallet/connector";
import { useWeb3React } from "@web3-react/core";
import { Card } from "@mui/material";

interface IProps {
  handleBack: () => void;
  handleNext: () => void;
}

export default function ConnectWalletStep({ handleBack, handleNext }: IProps) {
  const { account } = useWeb3React();
  const onClickBack = () => {
    // do sth before go to back step if you want
    handleBack();
  };
  const onClickNext = () => {
    // do sth before go to next step if you want
    handleNext();
  };

  const onClickConnect = async () => {
    try {
      await connector.activate();
    } catch (error) {
      console.error("connect failed", error);
    }
  };

  return (
    <ConnectStepStyle>
      {account ? (
        <CardBox>
          <Typography variant="h6" component="div">
            {account}
          </Typography>
         
        </CardBox>
      ) : (
        <Button variant="contained" color="primary" onClick={onClickConnect}>
          Connect Wallet
        </Button>
      )}

      <OptionBox sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Button color="inherit" onClick={onClickBack} sx={{ mr: 1 }}>
          Back
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button onClick={onClickNext}>Next</Button>
      </OptionBox>
    </ConnectStepStyle>
  );
}

const ConnectStepStyle = styled.div``;

const OptionBox = styled(Box)`
  position: fixed;
  right: 80px;
  bottom: 60px;
`;

const CardBox = styled(Card)`
  padding: 20px;
`;
