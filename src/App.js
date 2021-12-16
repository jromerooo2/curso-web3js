import { Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "./views/home";
import Web3 from "web3";

function App() {
  useEffect(() => {
    if(window.ethereum) {
      const web3 = new Web3(window.ethereum);
      web3.eth.requestAccounts().then((acc) => {console.log(acc)});
    }
  }, [])
  return (
    <>
      <Route path="/" exact component={Home} />
    </>
  );
}

export default App;
