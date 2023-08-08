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
import StepProvider from "../../providers/stepProvider"

const steps = ["Connect Wallet", "Login Twitter", "Verify", "Attest"];

export default function Steps() {
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
        return <TwitterLoginStep handleBack={handleBack} handleNext={handleNext} />;
      case 2:
        return <VerifyStep handleBack={handleBack} handleNext={handleNext} />;
      case 3:
        return <AttestStep handleBack={handleBack} />;
      default:
        return (
          <ConnectWalletStep handleNext={handleNext} />
        );
    }
  };
  return (
    <StepProvider>
      <StepsContainer>
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};
              if (isStepOptional(index)) {
                labelProps.optional = (
                  <Typography variant="caption">Optional</Typography>
                );
              }
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
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
            <React.Fragment>{showCurrentStep()}</React.Fragment>
          )}
        </Box>
      </StepsContainer>
    </StepProvider>
  );
}

const StepsContainer = styled.div``;
