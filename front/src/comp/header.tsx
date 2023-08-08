import styled from "@emotion/styled";
import LogoSrc from "../assets/logo.svg";
import { Link } from "react-router-dom";

export default function Header() {
    return (
      <HeaderStyle>
        <Link to="/">
          <img src={LogoSrc} alt="" />
        </Link>
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