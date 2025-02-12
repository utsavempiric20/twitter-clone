const hre = require("hardhat");

async function main() {
  const authentication = await hre.ethers.getContractFactory("Authentication");
  const authContract = await authentication.deploy();
  console.log("authContract--> ", authContract);
  console.log("authContract address-->", authContract.target);
  const twitter = await hre.ethers.getContractFactory("Twitter");
  const twitterContract = await twitter.deploy(authContract.target);
  console.log("twitterContract--> ", twitterContract);
  console.log("twitterContract address--> ", twitterContract.target);
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
//authContract :    0x5FbDB2315678afecb367f032d93F642f64180aa3
//twitterContract : 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

// sepolia auth :    0x40F1678BCD3FC8161b2b50937D7620FCc1d546a4
// sepolia twitter : 0x5572FE757924b6fE16c85dAdc661830c435831fe
