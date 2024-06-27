import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import MyRoutes from "./components/Route";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import authAbi from "./contracts/Authentication.json";
import twitterAbi from "./contracts/Twitter.json";

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

  useEffect(() => {
    const connectWallet = async () => {
      const authContractAddress = "0x05Aa229Aec102f78CE0E852A812a388F076Aa555";
      const twitterContractAddress =
        "0x0b48aF34f4c854F5ae1A3D587da471FeA45bAD52";
      const authContractAbi = authAbi.abi;
      const twitterContractAbi = twitterAbi.abi;
      try {
        const { ethereum } = window;
        if (ethereum) {
          const acc = await ethereum.request({
            method: "eth_requestAccounts",
          });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
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
