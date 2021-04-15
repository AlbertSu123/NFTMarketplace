const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    develop: {
      port: 8545
    }
  },
  compilers: {
      solc: {
        version: "0.6.6",
       },
    }
};
