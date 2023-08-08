import { BrowserRouter as Router } from "react-router-dom";
import RouterLink from "./router";
import OAuthEventListener from "./comp/OAuthEventListener";
import Web3Provider from "./providers/web3Provider";
import Header from "./comp/header";

function App() {
  return (
    <div className="App">
      <Web3Provider>
        <Router>
          <Header />
          <RouterLink />
        </Router>
        <OAuthEventListener />
      </Web3Provider>
    </div>
  );
}

export default App;
