import styled from "@emotion/styled";
import { Modal } from "@mui/material";
import LogoIcon from "../assets/logo.svg";
import DoneIcon from "../assets/images/done.svg";

import { useWeb3React } from "@web3-react/core";

import SARegistryABI from "../abi/SARegistry.json";
import SATwitterABI from "../abi/SATwitter.json";

import { SA_REGISTRY_CONTRACT } from "../constants";

interface IProps {
  show: boolean;
  handleClose: () => void;
}

export default function FinishedModal({ show, handleClose }: IProps) {

  const { account, provider } = useWeb3React();

  return (
    <Modal open={show} onClose={handleClose}>
      <ModalContainer>
        <div className="head">
          <img src={DoneIcon} alt="" className="done" />
          <div className="title">VERIFIED</div>
        </div>
        <div className="nft">
          <img src={LogoIcon} alt="" />
        </div>
        <div></div>
      </ModalContainer>
    </Modal>
  );
}


const ModalContainer = styled.div`
  width: 400px;
  height: 500px;
  background-color: #fff;
  margin: 80px auto;
  padding: 50px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  &:focus-visible {
    outline: none;
  }
  .head {
    text-align: center;
    .done {
      width: 64px;
    }
    .title {
      font-size: 26px;
      font-weight: 500;
    }
  }
  .nft {
    border: 1px solid #aaa;
  }
`;
