import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

interface IProps {
  handleBack: () => void;
  handleNext: () => void;
}

export default function ConnectWalletStep({ handleBack, handleNext }: IProps) {
    const onClickBack = () => {
      // do sth before go to back step if you want
      handleBack();
    };
    const onClickNext = () => {
        // do sth before go to next step if you want
        handleNext();
    }
  return (
    <ConnectStepStyle>
      <Button variant="contained" color="primary">Connect Wallet</Button>
      <OptionBox sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Button
          color="inherit"
          onClick={onClickBack}
          sx={{ mr: 1 }}
        >
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