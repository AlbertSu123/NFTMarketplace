// var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var MerchToken = artifacts.require("./MerchToken.sol");

module.exports = function(deployer) {
  // deployer.deploy(SimpleStorage);
  deployer.deploy(MerchToken);
};
