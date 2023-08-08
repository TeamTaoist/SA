import Steps from "../comp/steps";
import Header from "../comp/header";
import StepProvider from "../providers/stepProvider";

export default function AttestationPage() {
  return (
    <StepProvider>
      <Header />
      <Steps />
    </StepProvider>
  );
}
