import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import MyRoutes from "./components/Route";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

function App() {
  const [walletData, setWalletData] = useState({
    provider: null,
    signer: null,
    contract: null,
  });

  useEffect(() => {
    const connectWallet = async () => {
      // const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
      // const contractAbi = abi.abi;
      try {
        const { ethereum } = window;
        if (ethereum) {
          const account = await ethereum.request({
            method: "eth_requestAccounts",
          });
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          // const contract = await ethers.Contract(
          //   contractAddress,
          //   contractAbi,
          //   signer
          // );
          // setWalletData({ provider, signer, contract });
        } else {
          alert("install metamask");
        }
      } catch (error) {
        console.log(error);
      }
    };
    connectWallet();
  }, []);
  return (
    <>
      <Router>
        <MyRoutes />
      </Router>
    </>
  );
}

export default App;
