pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

import './Packing.sol';

/** @title Block space. */
contract Space is Packing, Pausable {
    using SafeMath for uint;

    uint public depositAmount;
    uint public fee;

    uint public startEpoch;//the unix epoch at the time of deployment, used to define the index day for the scheduler
    uint16 public spaceLimit;

    string public layoutHash;//string representing a hash for an image file on ipfs


    mapping (uint16 => address) public spaces;
    mapping (address => uint16[]) public ownerReservations;
    mapping (address => uint) public credits;

    event SpaceReserved(uint16 spaceId, address reservedBy, uint cost);
    event ReservationCancelled(uint16 spaceId, uint refund, address owner, address cancelledBy);
    event CreditClaimed(address claimant, uint amount);
    event RefundIssued(uint amt, address recipient);
    event Withdraw(address to, uint amt);

    /** @dev instantiates the contract.
      * @param _spaceLimit the number of spaces available
      */
    constructor (uint16 _spaceLimit, address _owner) public {
        spaceLimit = _spaceLimit;
        owner = _owner;
    }

    function updateDepositAmount(uint _deposit) public onlyOwner {
        depositAmount = _deposit;
    }

    function updateFee(uint _fee) public onlyOwner {
        fee = _fee;
    }

    function updateLayoutHash (string _hash) public onlyOwner {
        layoutHash = _hash;
    }

    /** @dev creates a reservation.
      * @param _spaceId id of space to reserve.
      */
    function reserveSpace(uint16 _spaceId) public payable whenNotPaused {
        require(msg.value == fee, 'Fee must be paid in full');
        require(spaces[_spaceId] == 0x0, 'Space is not available');
        require(_spaceId > 0 && _spaceId <= spaceLimit, 'Space Id must be within range');
        spaces[_spaceId] = msg.sender;
        ownerReservations[msg.sender].push(_spaceId);

        emit SpaceReserved(_spaceId, msg.sender, msg.value);
    }

    /** @dev cancels a reservation.
      * @param _spaceId id of space of the reservation.
      * @param _ownerReservationsIdx index of reservation to be cancelled in ownerReservations array.
      */
    function cancelReservation(uint16 _spaceId, uint _ownerReservationsIdx) public whenNotPaused {
        require(ownerReservations[msg.sender][_ownerReservationsIdx] == _spaceId, 'Must supply correct index of space Id in owner array');
        address reserver = spaces[_spaceId];
        require(reserver == msg.sender || owner == msg.sender, "Must have the space reserved to cancel it");

        ownerReservations[reserver][_ownerReservationsIdx] = 0;
        spaces[_spaceId] = 0x0;
        uint refundAmt = fee - depositAmount;
        credits[reserver] = credits[reserver].add(refundAmt);

        emit ReservationCancelled(_spaceId, refundAmt, reserver, msg.sender);
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

    function getSpaces(uint16 _start, uint16 _end) public view returns (uint16[] currentSpaces, address[] reservedBy) {
      uint16 spaceCount = _end - _start;
      uint index = 0;
      currentSpaces = new uint16[](spaceCount);
      reservedBy = new address[](spaceCount);
      for (_start; _start < _end; _start++) {
          currentSpaces[index] = _start;
          reservedBy[index] = spaces[_start];
          index++;
      }

      return (currentSpaces, reservedBy);
    }

    /** @dev get reservations for an account
      * @param _owner address of reservations.
      * @return resSpaceIds space ids of reservations.
      * @return starts start dates of reservations.
      */
    function getReservationsForOwner (address _owner) public view returns (uint16[]) {
      return ownerReservations[_owner];
    }

    function getContractBalance () public view returns (uint){
      return address(this).balance;
    }

 }
