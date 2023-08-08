import styled from "@emotion/styled";
import LogoSrc from "../assets/logo.svg";


export default function Header() {
    return (
      <HeaderStyle>
        <img src={LogoSrc} alt="" />
      </HeaderStyle>
    );
}

const HeaderStyle = styled.div`
    height: 120px;
    text-align: center;
    img {
        margin-top: 20px;
    }

`