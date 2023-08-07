import { Route, Routes } from "react-router-dom";
import HomePage from "./views/home";
import OauthPage from "./views/oauth";

function RouterLink() {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/oauth/*" element={<OauthPage />} />
      </Routes>
    );
}

export default RouterLink;
