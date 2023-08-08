import styled from "@emotion/styled";

import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ConnectWalletStep from "./connectWallet";
import TwitterLoginStep from "./twitterLogin";
import VerifyStep from "./verify";
import AttestStep from "./attest";
import StepProvider from "../../providers/stepProvider";
import { useWeb3React } from "@web3-react/core";

const steps = ["Connect Wallet", "Login Twitter", "Verify", "Attest"];

export default function Steps() {
  const { account } = useWeb3React();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const showCurrentStep = () => {
    switch (activeStep) {
      case 1:
        return (
          <TwitterLoginStep handleBack={handleBack} handleNext={handleNext} />
        );
      case 2:
        return <VerifyStep handleBack={handleBack} handleNext={handleNext} />;
      case 3:
        return <AttestStep handleBack={handleBack} />;
      default:
        return <ConnectWalletStep handleNext={handleNext} />;
    }
  };
  return (
    <StepProvider>
      <StepsContainer>
        <StepHeader>
          {}
          <span>
            {account
              ? `Account: ${account.slice(0, 6)}...${account.slice(-4)}`
              : ""}
          </span>
        </StepHeader>

        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </React.Fragment>
          ) : (
            <div style={{ marginTop: "40px" }}>{showCurrentStep()}</div>
          )}
        </Box>
      </StepsContainer>
    </StepProvider>
  );
}

const StepsContainer = styled.div`
  border: 5px solid #69d5f3;
  border-radius: 12px;
  height: calc(100vh - 200px);
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 0.5);
  width: 70%;
  margin: 0 auto;
  margin-top: 20px;
  min-width: 800px;
  padding: 0 30px 40px;
  position: relative;
`;

const StepHeader = styled.div`
  height: 40px;
  color: #666;
  line-height: 40px;
  margin: 30px 40px;
  padding: 0 40px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 30px;
`;
