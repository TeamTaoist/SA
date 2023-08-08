import {createGlobalStyle} from "styled-components";
import "../fonts/fonts.scss";

const GlobalStyle = createGlobalStyle`
    body,html{
      min-height: 100% ;
      padding: 0;
      margin: 0;
      font-family: "SourceHanSansSC-Normal";
    }
    *{
      scrollbar-width: none!important;
      &::-webkit-scrollbar {
        width: 0 ;
        display: none;
      }
    }
   ul,li,dl,dt,dd{
     padding: 0;
     margin: 0;
     list-style: none;
   }
   a {
     
     text-decoration: none;
     color: unset;

     &:hover {
       color: unset;
     }
   }
`;

export default GlobalStyle;
