import styled from "@emotion/styled";
import LogoImg from "../assets/images/logo.svg";
import MainImg from "../assets/images/img.svg";
import { Link } from "react-router-dom";

const Box = styled.div`
  min-height: 100vh;
  background-size: 100% 100%;
  display: flex;
  align-content: center;
  justify-content: center;
`;
const InnerBox = styled.div`
  width: 1270px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const HeaderBox = styled.div`
  display: flex;
  align-content: center;
  justify-content: space-between;
  width: 100%;
  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

const RhtBox = styled.div`
  display: flex;
  align-items: center;
`;

const SelectBox = styled.div`
  .lan {
    background: rgba(0, 0, 0, 0);
    border: 0;
    font-size: 30px;
    cursor: pointer;
    padding: 0 10px;
    &:focus {
      outline: none;
    }
  }
`;
const BtnBox = styled.div`
  background: #fff;
  color: #191919;
  font-weight: 700;
  font-size: 30px;
  padding: 5px 40px;
  border-radius: 30px;
  margin-left: 30px;
`;

const ContentBox = styled.div`
  display: flex;
  align-content: center;
  background: url(${MainImg}) no-repeat 30% center;
  padding: 100px 0;
`;

const LBtm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 60%;
`;

const TitBox = styled.div`
  font-size: 74px;
  font-family: "SourceHanSansSC-Heavy";
  @media (max-width: 1200px) {
    font-size: 37px;
  }
`;

const StartBox = styled(Link)`
  display: inline-block;
  font-size: 32px;
  background: #fff;
  margin-top: 100px;
  padding: 5px 40px;
  border-radius: 40px;
  font-weight: bold;
`;

export default function Home() {
  return (
    <Box>
      <InnerBox>
        <HeaderBox>
          <div className="lft">
            <img src={LogoImg} alt="" />
          </div>
          <RhtBox>
            <SelectBox>
              <select className="lan">
                <option value="en">English</option>
                <option value="zh-CN">简体中文</option>
                <option value="zh-TW">繁體中文</option>
                <option value="fr">Français</option>
              </select>
            </SelectBox>

            <BtnBox>Connect</BtnBox>
          </RhtBox>
        </HeaderBox>
        <ContentBox>
          <LBtm>
            <TitBox>
              A NFT-compatible Attestation Tool for Social Networks.
            </TitBox>
            <StartBox to="/attestation">Get Started</StartBox>
          </LBtm>
        </ContentBox>
      </InnerBox>
    </Box>
  );
}
