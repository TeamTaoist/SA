import styled from "@emotion/styled";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

interface IProps {
  handleBack: () => void;
}

export default function VerifyStep({ handleBack }: IProps) {
  const onClickBack = () => {
    // do sth before go to back step if you want
    handleBack();
  };
  return (
    <VerifyStepStyle>
      <Button variant="contained" color="primary">
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
`
