import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

interface IProps {
  handleBack?: () => void;
  handleNext: () => void;
}

export default function TwitterLoginStep({ handleNext }: IProps) {
   
    const onClickNext = () => {
      // do sth before go to next step if you want
      handleNext();
    };
    return (
      <TwitterStepStyle>
        <Button variant="contained" color="primary">
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
