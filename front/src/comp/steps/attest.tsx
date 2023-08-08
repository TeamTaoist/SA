import styled from "@emotion/styled";
import { ethers } from 'ethers';

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useWeb3React } from "@web3-react/core";
import { useStepContext } from "../../providers/stepProvider";
import FinishedModal from "../modal";
import { useState } from "react";

import SARegistryABI from "../../abi/SARegistry.json";
import SATwitterABI from "../../abi/SATwitter.json";

import { SA_REGISTRY_CONTRACT } from "../../constants";

interface IProps {
  handleBack: () => void;
}

export default function AttestStep({ handleBack }: IProps) {
  const { account, provider } = useWeb3React();
  const { state: { twitter_data, sign_data } } = useStepContext();
  const [showModal, setShowModal] = useState(false);

  const onClickBack = () => {
    // do sth before go to back step if you want
    handleBack();
  };
  const onClickAttest = async () => {
    if (!provider) {
      return;
    }

    console.log('twitter_data', twitter_data);

    const userSig = sign_data;

    const { attester, attesterSig, receiver, timestamp, saContract } = twitter_data;
    const { twitterId, twitterName, twitterUserName } = twitter_data.payload;

    const saPayload = ethers.solidityPacked(["string", "string", "string"], [twitterId, twitterName, twitterUserName]);
    const packedData = ethers.keccak256(ethers.solidityPacked(["address", "address", "uint256", "address", "bytes"], [attester, receiver, BigInt(timestamp), saContract, saPayload]));

    

    const saRegistryContract = new ethers.Contract(SA_REGISTRY_CONTRACT, SARegistryABI);
    console.log("saRegistryContract===", saRegistryContract);


    const rt = await saRegistryContract.attest(attester, attesterSig, receiver, userSig, timestamp, saContract, saPayload);
    console.log("rt===", rt);
    
    // sign msg
  };
  return (
    <AttestStepStyle>
      <MainButtonBox>
        <Button variant="contained" color="primary" onClick={onClickAttest}>
          Attest
        </Button>
      </MainButtonBox>
      <OptionBox sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        <Button
          onClick={onClickBack}
          sx={{ mr: 1 }}
          variant="outlined"
        >
          Back
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
      </OptionBox>
      {showModal && (
        <FinishedModal
          show={showModal}
          handleClose={() => setShowModal(false)}
        />
      )}
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
