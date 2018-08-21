pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

import './Packing.sol';

contract Blockspace is Packing, Ownable {

    uint depositAmount = 0;
    uint dailyFee = 0;

    uint startEpoch;//the unix epoch at the time of deployment, used to define the index day for the scheduler

    event SpaceCreated(uint id, address owner);
    event ReservationCreated(uint spaceId, uint16 start, uint16 end, uint amtPaid, uint cost);
    event ReservationPaid(uint spaceId, uint16 start, uint paidAmt, address payee);
    event ReservationCancelled(uint spaceId, uint16 start, uint refund, address owner);
    event RefundIssued(uint amt, address recipient);


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

    uint24 spaceId;

    uint24[] public spaceIds;

    mapping (uint24=> Space) public spaces;
    mapping (address => uint40[]) ownerReservations;


    constructor (uint _startEpoch) public {
        startEpoch = _startEpoch;
    }

    function updateDepositAmount(uint _deposit) public onlyOwner {
        depositAmount = _deposit;
    }

    function updateDailyFee(uint _fee) public onlyOwner {
        dailyFee = _fee;
    }

    function createSpace(string _dataHash) public onlyOwner {
        require(msg.sender == owner);
        Space memory space = Space(spaceId, _dataHash, true);
        spaces[spaceId] = space;
        spaceIds.push(spaceId);
        spaceId += 1;
        emit SpaceCreated(space.id, owner);
    }

    function updateAvailability (uint24 _spaceId, uint16 _start, uint16 _end, bool isAvailable) private {
        while (_start <= _end) {
            require(spaces[_spaceId].availability[_start] == !isAvailable);
            spaces[_spaceId].availability[_start] = isAvailable;
            _start++;
        }
    }

    function createReservation(uint24 _spaceId, uint16 _start, uint16 _end) public payable {
        require(msg.value >= depositAmount);
        updateAvailability(_spaceId, _start, _end, true);
        Space storage space = spaces[_spaceId];
        uint cost = (_end - _start + 1) * dailyFee;
        Reservation memory reservation = Reservation(msg.sender, _start, _end, msg.value, cost);
        space.reservations[_start] = reservation;
        uint40 reservationId = pack(_start, _spaceId);
        ownerReservations[msg.sender].push(reservationId);

        emit ReservationCreated(_spaceId, reservation.start, reservation.end, reservation.amtPaid, reservation.cost);
    }

    function payReservation (uint24 _spaceId, uint16 _resStart) public payable {
        spaces[_spaceId].reservations[_resStart].amtPaid += msg.value;
        emit ReservationPaid(_spaceId, _resStart, msg.value, msg.sender);
    }

    function cancelReservation(uint24 _spaceId, uint16 _resStart, uint _ownerReservationsIdx) public {
        Space storage space = spaces[_spaceId];
        Reservation storage reservation = space.reservations[_resStart];
        uint40 reservationId = pack(_resStart, _spaceId);
        require(reservationId == ownerReservations[msg.sender][_ownerReservationsIdx]);
        require(reservation.owner == msg.sender);
        ownerReservations[msg.sender][_ownerReservationsIdx] = 0;
        updateAvailability(_spaceId, reservation.start, reservation.end, false);
        uint refundAmt = reservation.amtPaid - depositAmount;
        reservation.amtPaid = depositAmount;

        if (refundAmt > 0) {
            msg.sender.transfer(refundAmt);
        }

        delete space.reservations[_resStart];
        emit ReservationCancelled(_spaceId, _resStart, refundAmt, msg.sender);

    }

    function issueRefund(uint _amt, address _recipient) public onlyOwner {
        _recipient.transfer(_amt);

        emit RefundIssued(_amt, _recipient);
    }

    function getStartEpoch() public view returns (uint) {
        return startEpoch;
    }

    function getDepositAmount() public view returns (uint) {
        return depositAmount;
    }

    function getDailyFee() public view returns (uint) {
        return dailyFee;
    }

    function getSpaces() public view returns (uint24[]) {
        return spaceIds;
    }

    function getSpace(uint24 _id) public view returns (uint24, string, bool) {
        Space storage space = spaces[_id];
        return (space.id, space.dataHash, space.active);
    }

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

 }
