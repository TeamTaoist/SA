import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { injected as connector } from "../../wallet/connector";
import { useWeb3React } from "@web3-react/core";
import { Card } from "@mui/material";

import FinishedModal from "../modal";
import { useState } from "react";

import SARegistryABI from "../../abi/SARegistry.json";
import SATwitterABI from "../../abi/SATwitter.json";

import { SA_REGISTRY_CONTRACT } from "../../constants";

interface IProps {
  handleBack?: () => void;
  handleNext: () => void;
}

export default function ConnectWalletStep({ handleBack, handleNext }: IProps) {
  const { account } = useWeb3React();
  const [showModal, setShowModal] = useState(false);

  const onClickNext = () => {
    // do sth before go to next step if you want
    handleNext();
  };

  const onClickConnect = async () => {
    try {
      await connector.activate();
      // setShowModal(true);

    } catch (error) {
      console.error("connect failed", error);
    }
  };

  return (
    <ConnectStepStyle>
      <MainButtonBox>
        {account ? (
          <CardBox>
            <Typography variant="body1" component="div">
              Account: {account}
            </Typography>
          </CardBox>
        ) : (
          <Button variant="contained" color="primary" onClick={onClickConnect}>
            Connect Wallet
          </Button>
        )}
      </MainButtonBox>

      <OptionBox sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button onClick={onClickNext} variant="contained">
          Next
        </Button>
      </OptionBox>

      {showModal && (
        <FinishedModal
          show={showModal}
          handleClose={() => setShowModal(false)}
        />
      )}

    </ConnectStepStyle>
  );
}

const ConnectStepStyle = styled.div`
`;

const OptionBox = styled(Box)`
  position: absolute;
  right: 40px;
  bottom: 40px;
`;

const CardBox = styled(Card)`
  padding: 20px;
`;

const MainButtonBox = styled.div`
  display: flex;
  height: 200px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
