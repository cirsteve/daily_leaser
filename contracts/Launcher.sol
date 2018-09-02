pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';


import './Blockspace.sol';
import './Space.sol';

/** @title Block space. */
contract Launcher is Pausable {
  address[] launchedBlockspaces;
  address[] launchedSpaces;


  event BlockspaceLaunched(address addr, address owner);
  event SpaceLaunched(address addr, address owner);


  function launchBlockspace (uint _startEpoch) public {
    Blockspace newContract = new Blockspace(_startEpoch, msg.sender);
    launchedBlockspaces.push(newContract);

    emit BlockspaceLaunched(newContract, msg.sender);
  }

  function launchSpace (uint16 _spaceCount) public {
    Space newContract = new Space(_spaceCount, msg.sender);
    launchedSpaces.push(newContract);

    emit SpaceLaunched(newContract, msg.sender);
  }

  function getLaunchedBlockspaces () public view returns(address[]) {
    return launchedBlockspaces;
  }

  function getLaunchedSpaces () public view returns(address[]) {
    return launchedSpaces;
  }
}
