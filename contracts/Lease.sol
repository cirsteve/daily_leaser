pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';


/** @title Block space. */
contract Lease is Pausable {
    using SafeMath for uint;

    uint public depositPct;
    uint[] fees;
    Multihash[] public metaHashes; //ipfs file has of json object representing metadata about a space
    Multihash public layoutHash;//string representing a hash for an image file on ipfs

    mapping (address => uint24[]) public ownerReservations;
    mapping (address => uint) public credits;

    struct Multihash {
      bytes32 hash;
      uint8 hashFunction;
      uint8 size;
    }


    event SpaceReserved(uint24 spaceId, address reservedBy, uint cost);
    event SpaceUpdated(uint24 spaceId);
    event CreditClaimed(address claimant, uint amount);
    event RefundIssued(uint amt, address recipient);
    event Withdraw(address to, uint amt);

    function updateDepositPct(uint _deposit) public onlyOwner {
        depositPct = _deposit;
    }

    function addFees(uint32[] _fees) public onlyOwner {
      for (uint i = 0; i<_fees.length;i++) {
        fees.push(_fees[i]);
      }
    }

    function addFee(uint32 _fee) public onlyOwner {
        fees.push(_fee);
    }

    function addMetaHash(bytes32 _hash, uint8 _hashFunction, uint8 _size) public onlyOwner {
        Multihash memory multihash = Multihash(_hash, _hashFunction, _size);
        metaHashes.push(multihash);
    }

    function addLayoutHash (bytes32 _hash, uint8 _hashFunction, uint8 _size) public onlyOwner {
        Multihash memory multihash = Multihash(_hash, _hashFunction, _size);
        layoutHash = multihash;
    }

    function claimCredit () public whenNotPaused {
        uint creditAmt = credits[msg.sender];
        credits[msg.sender] = 0;
        msg.sender.transfer(creditAmt);

        emit CreditClaimed(msg.sender, creditAmt);
    }

    function withdraw (uint _amt) public onlyOwner {
      owner.transfer(_amt);

      emit Withdraw(owner, _amt);
    }

    /** @dev issue refund.
      * @param _amt gwei to refund.
      * @param _recipient recipient of refund.
      */
    function issueRefund(uint _amt, address _recipient) public onlyOwner {
      _recipient.transfer(_amt);

      emit RefundIssued(_amt, _recipient);
    }

    function getContractBalance () public view returns (uint){
      return address(this).balance;
    }

 }
