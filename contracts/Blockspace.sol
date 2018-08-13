pragma solidity ^0.4.24;

contract Blockspace {
    address owner;

    uint depositAmount = 0;

    uint depositDeadline;

    uint startEpoch;//the unix epoch at the time of deployment, used to define the index day for the scheduler

    event SpaceCreated(uint id, address owner);
    event ReservationCreated(uint spaceId, uint16 start, uint16 end, uint amtPaid);
    event ReservationPaid(uint spaceId, uint16 start, uint paidAmt, address payee);
    event ReservationCancelled(uint spaceId, uint16 start, uint refund, address owner);


    struct Reservation {
        address owner;
        uint16 start;
        uint16 end;
        uint amtPaid;
    }

    struct Space {
        uint id;
        string dataHash;
        bool active;
        mapping(uint16 => Reservation) reservations;
        mapping(uint16 => bool) availability;
    }

    uint spaceId;

    uint[] public spaceIds;

    mapping (uint => Space) public spaces;
    mapping (address => uint16[]) ownerReservations;


    constructor (uint _startEpoch) public {
        owner = msg.sender;
        startEpoch = _startEpoch;
    }

    function updateDepositAmount(uint _deposit) public {
        depositAmount = _deposit;
    }

    function updateDeadline(uint _deadline) public {
        depositDeadline = _deadline;
    }

    function createSpace(string _dataHash) public {
        require(msg.sender == owner);
        Space memory space = Space(spaceId, _dataHash, true);
        spaces[spaceId] = space;
        spaceIds.push(spaceId);
        spaceId += 1;
        emit SpaceCreated(space.id, owner);
    }

    function updateAvailability (uint _spaceId, uint16 _start, uint16 _end, bool isAvailable) private {
        while (_start < _end) {
            require(spaces[_spaceId].availability[_start] == !isAvailable);
            spaces[_spaceId].availability[_start] = isAvailable;
            _start++;
        }
    }

    function createReservation(uint _spaceId, uint16 _start, uint16 _end) public payable {
        require(msg.value >= depositAmount);
        updateAvailability(_spaceId, _start, _end, true);
        Space storage space = spaces[_spaceId];
        Reservation memory reservation = Reservation(msg.sender, _start, _end, msg.value);
        space.reservations[_start] = reservation;
        ownerReservations[msg.sender].push(_start);

        emit ReservationCreated(_spaceId, reservation.start, reservation.end, reservation.amtPaid);
    }

    function payReservation (uint _spaceId, uint16 _resStart) public payable {
        spaces[_spaceId].reservations[_resStart].amtPaid += msg.value;
        emit ReservationPaid(_spaceId, _resStart, msg.value, msg.sender);
    }

    function cancelReservation(uint _spaceId, uint16 _resStart) public {
        Space storage space = spaces[_spaceId];
        Reservation storage reservation = space.reservations[_resStart];
        require(reservation.owner == msg.sender);
        updateAvailability(_spaceId, reservation.start, reservation.end, false);
        uint refundAmt = reservation.amtPaid - depositAmount;

        if (refundAmt < 0) {
            msg.sender.transfer(refundAmt);
        }

        delete space.reservations[_resStart];
        emit ReservationCancelled(_spaceId, _resStart, refundAmt, msg.sender);

    }

    function getStartEpoch() public view returns (uint) {
        return startEpoch;
    }

    function getDepositAmount() public view returns (uint) {
        return depositAmount;
    }

    function getSpaces() public view returns (uint[]) {
        return spaceIds;
    }

    function getSpace(uint _id) public view returns (uint, string, bool) {
        Space storage space = spaces[_id];
        return (space.id, space.dataHash, space.active);
    }

    function getReservations(uint _spaceId, uint16 _start, uint16 _end) public view returns (address[] owners, uint16[] starts, uint16[] ends, uint[] amts) {
        uint16 reservationsCount = _end - _start + 1;
        uint16 index = 0;
        owners = new address[](reservationsCount);
        starts = new uint16[](reservationsCount);
        ends = new uint16[](reservationsCount);
        amts = new uint[](reservationsCount);
        for (_start; _start < _end; _start++) {
            Reservation storage reservation = spaces[_spaceId].reservations[_start];
            owners[index] = reservation.owner;
            starts[index] = reservation.start;
            ends[index] = reservation.end;
            amts[index] = reservation.amtPaid;
            index++;
        }

        return (owners, starts, ends, amts);

    }

    function getAvailability(uint _spaceId, uint16 _start, uint16 _end) public view returns (bool[] availability) {
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

    function getReservationsForOwner (address _owner) public view returns (uint16[]) {
        return ownerReservations[_owner];
    }

 }
