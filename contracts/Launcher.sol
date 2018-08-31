pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';


import './Blockspace.sol';

/** @title Block space. */
contract Launcher is Pausable {
  address[] launchedContracts;

  event ContractLaunched(address addr, address owner);

  function launchContract (uint startEpoch) public {
    Blockspace newContract = new Blockspace(startEpoch, msg.sender);
    launchedContracts.push(newContract);

    emit ContractLaunched(newContract, msg.sender);
  }

  function getLaunchedContracts () public view returns(address[]) {
    return launchedContracts;
  }
}
