var Blockspace = artifacts.require("Blockspace");

module.exports = function(deployer) {
  deployer.deploy(Blockspace, new Date().getTime());
};
