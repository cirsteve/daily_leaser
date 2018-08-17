pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Blockspace.sol";

contract TestBlockspace {
  Blockspace public blockspace = Blockspace(DeployedAddresses.Blockspace());

  function testStartEpochIsSet() public {


    Assert.isAbove(blockspace.getStartEpoch(), 0, "The start epoch should be greater then zero.");
  }

  function testItUpdatesDeposit() public {


    blockspace.updateDepositAmount(5);

    uint expected = 5;

    Assert.equal(blockspace.getDepositAmount(), expected, "It should update the deposit amount to 5.");
  }

}
