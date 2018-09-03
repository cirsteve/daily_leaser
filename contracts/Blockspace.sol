pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';

import './Packing.sol';

/** @title Block space. */
contract Blockspace is Packing, Pausable {
    using SafeMath for uint;

    uint public depositAmount = 0;
    uint public dailyFee = 0;
    uint public startEpoch;//the unix epoch at the time of deployment, used to define the index day for the scheduler
    uint24 spaceId;
    uint24[] public spaceIds;
    string public layoutHash;//string representing a hash for an image file on ipfs

    struct Reservation {
        address owner;
        uint16 start;
        uint16 end;
        uint amtPaid;
        uint cost;
    }

    struct Space {
        uint24 id;
        string dataHash;
        bool active;
        mapping(uint16 => Reservation) reservations;//mapping of uint16 representing the first date of a reservation to a reservation
        mapping(uint16 => bool) availability;//mapping of uint16 representing a date and its availability
    }

    mapping (uint24=> Space) public spaces;
    mapping (address => uint40[]) ownerReservations;
    mapping (address => uint) public credits;

    event SpaceCreated(uint id, address owner);
    event ReservationCreated(uint spaceId, uint16 start, uint16 end, uint amtPaid, uint cost);
    event ReservationPaid(uint spaceId, uint16 start, uint paidAmt, address payee);
    event ReservationCancelled(uint spaceId, uint16 start, uint refund, address owner, address cancelledBy);
    event CreditClaimed(address claimant, uint amount);
    event RefundIssued(uint amt, address recipient);
    event Withdraw(address to, uint amt);

    /** @dev instantiates the contract.
      * @param _startEpoch unix epoch at time contract is deployed.
      */
    constructor (uint _startEpoch, address _owner) public {
        startEpoch = _startEpoch;
        owner = _owner;
    }

    function updateDepositAmount(uint _deposit) public onlyOwner {
        depositAmount = _deposit;
    }

    function updateDailyFee(uint _fee) public onlyOwner {
        dailyFee = _fee;
    }

    function updateLayoutHash (string _hash) public onlyOwner {
        layoutHash = _hash;
    }

    /** @dev adds a new Space to the contract state.
      * @param _dataHash hash of the metadata for the space stored on ipfs.
      */
    function createSpace(string _dataHash) public onlyOwner whenNotPaused {
        Space memory space = Space(spaceId, _dataHash, true);
        spaces[spaceId] = space;
        spaceIds.push(spaceId);
        spaceId += 1;
        emit SpaceCreated(space.id, owner);
    }

    /** @dev changes the daily availability for a space.
      * @param _spaceId id of Space to update.
      * @param _start first date to be updated.
      * @param _end last date to be updated.
      * @param isAvailable what value to update availability to.
      */
    function updateAvailability (uint24 _spaceId, uint16 _start, uint16 _end, bool isAvailable) private {
        while (_start <= _end) {
            require(spaces[_spaceId].availability[_start] == !isAvailable, 'Space is not available');
            spaces[_spaceId].availability[_start] = isAvailable;
            _start++;
        }
    }

    /** @dev creates a reservation.
      * @param _spaceId id of Space to update.
      * @param _start first date of reservation.
      * @param _end last date of reservation.
      */
    function createReservation(uint24 _spaceId, uint16 _start, uint16 _end) public payable whenNotPaused {
        require(msg.value >= depositAmount, 'Minumum deposit required');
        updateAvailability(_spaceId, _start, _end, true);
        Space storage space = spaces[_spaceId];
        require(space.active, 'Space is not active');
        uint cost = (_end - _start + 1) * dailyFee;
        Reservation memory reservation = Reservation(msg.sender, _start, _end, msg.value, cost);
        space.reservations[_start] = reservation;
        uint40 reservationId = pack(_start, _spaceId);
        ownerReservations[msg.sender].push(reservationId);

        emit ReservationCreated(_spaceId, reservation.start, reservation.end, reservation.amtPaid, reservation.cost);
    }

    /** @dev pay for reservation.
      * @param _spaceId id of Space of the reservation.
      * @param _resStart first date of reservation used as index.
      */
    function payReservation (uint24 _spaceId, uint16 _resStart) public payable whenNotPaused {
        spaces[_spaceId].reservations[_resStart].amtPaid = spaces[_spaceId].reservations[_resStart].amtPaid.add(msg.value);
        emit ReservationPaid(_spaceId, _resStart, msg.value, msg.sender);
    }

    /** @dev cancels a reservation.
      * @param _spaceId id of Space of the reservation.
      * @param _resStart first date of reservation used as index.
      * @param _ownerReservationsIdx index of reservation to be cancelled in ownerReservations array.
      */
    function cancelReservation(uint24 _spaceId, uint16 _resStart, uint _ownerReservationsIdx) public whenNotPaused {
        Space storage space = spaces[_spaceId];
        Reservation storage reservation = space.reservations[_resStart];
        uint40 reservationId = pack(_resStart, _spaceId);
        require(reservationId == ownerReservations[reservation.owner][_ownerReservationsIdx]);
        require(reservation.owner == msg.sender || owner == msg.sender);
        ownerReservations[reservation.owner][_ownerReservationsIdx] = 0;
        updateAvailability(_spaceId, reservation.start, reservation.end, false);
        uint refundAmt = reservation.amtPaid - depositAmount;
        reservation.amtPaid = depositAmount;
        credits[reservation.owner] = credits[reservation.owner].add(refundAmt);

        delete space.reservations[_resStart];
        emit ReservationCancelled(_spaceId, _resStart, refundAmt, reservation.owner, msg.sender);
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

    function getSpaces() public view returns (uint24[]) {
        return spaceIds;
    }

    /** @dev get details of a Space
      * @param _id id of Space.
      * @return uint24 space id.
      * @return string hash of meta data stored in ipfs.
      * @return bool if the space is active.
      */
    function getSpace(uint24 _id) public view returns (uint24, string, bool) {
        Space storage space = spaces[_id];
        return (space.id, space.dataHash, space.active);
    }

    /** @dev get reservations for a Space
      * @param _spaceId id of Space.
      * @param _start of range of reservations.
      * @param _end end of range of reservations.
      * @return owners of reservations.
      * @return starts start dates of reservations.
      * @return ends end dates of reservations.
      * @return amts amount paid on reservations.
      * @return costs cost of reservations.
      */
    function getReservations(uint24 _spaceId, uint16 _start, uint16 _end) public view returns (address[] owners, uint16[] starts, uint16[] ends, uint[] amts, uint[] costs) {
        uint16 reservationsCount = _end - _start;
        uint16 index = 0;
        owners = new address[](reservationsCount);
        starts = new uint16[](reservationsCount);
        ends = new uint16[](reservationsCount);
        amts = new uint[](reservationsCount);
        costs = new uint[](reservationsCount);
        for (_start; _start < _end; _start++) {
            Reservation storage reservation = spaces[_spaceId].reservations[_start];
            owners[index] = reservation.owner;
            starts[index] = reservation.start;
            ends[index] = reservation.end;
            amts[index] = reservation.amtPaid;
            costs[index] = reservation.cost;
            index++;
        }

        return (owners, starts, ends, amts, costs);

    }

    /** @dev get availability for a Space
      * @param _spaceId id of Space.
      * @param _start of range of availability.
      * @param _end end of range of reseavailabilityrvations.
      * @return availability array of bools indicating availability of space.
      */
    function getAvailability(uint24 _spaceId, uint16 _start, uint16 _end) public view returns (bool[] availability) {
      uint16 availabilityCount = _end - _start + 1;
      uint16 index = 0;
      availability = new bool[](availabilityCount);
      while (_start < _end) {
          availability[index] = spaces[_spaceId].availability[_start];
          _start++;
          index++;
      }

      return availability;
    }

    /** @dev get reservations for an account
      * @param _owner address of reservations.
      * @return resSpaceIds space ids of reservations.
      * @return starts start dates of reservations.
      */
    function getReservationsForOwner (address _owner) public view returns (uint24[] resSpaceIds, uint16[] starts) {
      uint40[] storage reservations = ownerReservations[_owner];
      resSpaceIds = new uint24[](reservations.length);
      starts = new uint16[](reservations.length);
      for (uint i = 0; i < reservations.length; i++) {
          uint40 reservationId = reservations[i];
          (uint16 reservationStart, uint24 resSpaceId) = unpack(reservationId);
          resSpaceIds[i] = resSpaceId;
          starts[i] = reservationStart;
      }
    }

    function getContractBalance () public view returns (uint){
      return address(this).balance;
    }

 }
