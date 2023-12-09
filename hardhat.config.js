require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  paths: {
    artifacts: "./frontend/src/artifacts",
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    polygon_mumbai: {
      url: `https://polished-attentive-film.matic-testnet.discover.quiknode.pro/30b6d013db1d5594d93f664dccea8fca81ca5b56/`,
      accounts: [
        "0x0c4b14ac12d6481fc20178e2e030c75dc59a04eb54a8d09b30330101a1b01962",
      ],
      allowUnlimitedContractSize: true,
    },
    goerli: {
      url: process.env.GOERLI_URL || "",
      accounts: {
        mnemonic: process.env.MNEMONIC || "",
        initialIndex: 0,
        count: 10,
      },
    },
    mantle: {
      url: `https://rpc.testnet.mantle.xyz/`,
      accounts: [
        "0x0c4b14ac12d6481fc20178e2e030c75dc59a04eb54a8d09b30330101a1b01962",
      ],
      chainId: 5001,
      allowUnlimitedContractSize: true,
    },
  },
};
