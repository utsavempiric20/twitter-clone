import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import MyRoutes from "./components/Route";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import authAbi from "./contracts/Authentication.json";
import twitterAbi from "./contracts/Twitter.json";

const authContractAddress = "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0"; /// AUTH_CONTRACT_ADDRESS
const twitterContractAddress = "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82";

function App() {
  const [walletData, setWalletData] = useState({
    provider: null,
    signer: null,
    authContract: null,
    twitterContract: null,
  });
  const [account, setAccount] = useState();
  const [userDetails, setUserDetails] = useState({
    username: null,
    registerTime: null,
  });

  const connectWallet = async () => {
    const authContractAbi = authAbi.abi;
    const twitterContractAbi = twitterAbi.abi;
    try {
      const { ethereum } = window;
      if (ethereum) {
        const acc = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const authContract = new ethers.Contract(
          authContractAddress,
          authContractAbi,
          signer
        );
        const twitterContract = new ethers.Contract(
          twitterContractAddress,
          twitterContractAbi,
          signer
        );

        setAccount(acc[0]);
        setWalletData({ provider, signer, authContract, twitterContract });
      } else {
        alert("install metamask");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);
  return (
    <>
      <Router>
        <MyRoutes
          authContract={walletData.authContract}
          twitterContract={walletData.twitterContract}
          account={account}
          userDetails={userDetails}
          setUserDetails={setUserDetails}
        />
      </Router>
    </>
  );
}

export default App;
