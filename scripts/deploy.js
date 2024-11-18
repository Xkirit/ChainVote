const hre = require("hardhat");

async function main() {
    const Voting = await hre.ethers.getContractFactory("Voting");
    const voting = await Voting.deploy("0x4F7E7fDD48154aedc2E472F4706fEc3f75f1F7f9");

    await voting.waitForDeployment();
    const address = await voting.getAddress();
    console.log("Voting contract deployed to:", address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });