pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';


import './BlockLease.sol';
import './DailyLease.sol';

/** @title Block space. */
contract Launcher is Pausable {
  address[] launchedBlockLeases;
  address[] launchedDailyLeases;


  event BlockLeaseLaunched(address addr, address owner);
  event DailyLeaseLaunched(address addr, address owner);


  function launchBlockLease (uint24 _spaceCount) public {
    BlockLease newContract = new BlockLease(_spaceCount, msg.sender);
    launchedBlockLeases.push(newContract);

    emit BlockLeaseLaunched(newContract, msg.sender);
  }

  function launchDailyLease (uint _startEpoch) public {
    DailyLease newContract = new DailyLease(_startEpoch, msg.sender);
    launchedDailyLeases.push(newContract);

    emit DailyLeaseLaunched(newContract, msg.sender);
  }

  function getLaunchedBlockLeases () public view returns(address[]) {
    return launchedBlockLeases;
  }

  function getLaunchedDailyLeases () public view returns(address[]) {
    return launchedDailyLeases;
  }
}
