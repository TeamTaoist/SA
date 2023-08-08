import { Route, Routes } from "react-router-dom";
import AttestationPage from "./views/attestation";
import OauthPage from "./views/oauth";
import HomePage from "./views/home";

function RouterLink() {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/attestation" element={<AttestationPage />} />
        <Route path="/oauth/*" element={<OauthPage />} />
      </Routes>
    );
}

export default RouterLink;
