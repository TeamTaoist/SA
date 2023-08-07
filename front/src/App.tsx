import { BrowserRouter as Router } from "react-router-dom";
import RouterLink from "./router";
import OAuthEventListener from "./comp/OAuthEventListener";


function App() {
  return (
    <div className="App">
      <Router>
        <RouterLink />
      </Router>
      <OAuthEventListener />
    </div>
  );
}

export default App;
