pragma solidity ^0.4.24;

import './Lease.sol';
/** @title Block space. */
contract BlockLease is Lease {

    uint24 public spaceLimit;//number of spaces for lease in the contract;



    mapping (uint24 => Space) public spaces;
    mapping (address => uint24[]) public ownerReservations;

    struct Space {
        uint24 id;
        uint fee;
        address reservedBy;
        Multihash metaHash;
    }

    event ReservationCreated(uint24 spaceId, uint24 start, uint24 end, uint amtPaid, uint cost);
    event ReservationCancelled(uint24 spaceId, uint refund, address owner, address cancelledBy);

    /** @dev instantiates the contract.
      * @param _spaceLimit the number of spaces available
      */
    constructor (uint24 _spaceLimit, address _owner) public {
        spaceLimit = _spaceLimit;
        owner = _owner;
    }

    /** @dev adds a new Space to the contract state.
      * @param _id is of Space to update
      * @param _feeIdx index of fee in fees.
      * @param _metaHashIdx index of metaHash in metaHashes.
      */
    function updateSpace(uint24 _id, uint24 _feeI, uint24 _metaHashIdx) public onlyOwner whenNotPaused {
        Space storage space = spaces[_id];
        space.feeIdx = _feeIdx;
        space.metaHashIdx = _metaHashIdx;
        emit SpaceUpdated(space.id);
    }
    /** @dev creates a reservation.
      * @param _spaceId id of space to reserve.
      */
    function reserveSpace(uint24 _spaceId) public payable whenNotPaused {
        require(_spaceId > 0 && _spaceId <= spaceLimit, 'Space Id must be within range');
        Space storage space = spaces[_spaceId];
        require(msg.value == fees[space.feeIdx], 'Fee must be paid in full');
        require(space.reservedBy != 0x0, 'Space is not available');
        space.reservedBy = msg.sender;
        ownerReservations[msg.sender].push(_spaceId);

        emit SpaceReserved(_spaceId, msg.sender, msg.value);
    }

    /** @dev cancels a reservation.
      * @param _spaceId id of space of the reservation.
      * @param _ownerReservationsIdx index of reservation to be cancelled in ownerReservations array.
      */
    function cancelReservation(uint24 _spaceId, uint _ownerReservationsIdx) public whenNotPaused {
        require(ownerReservations[msg.sender][_ownerReservationsIdx] == _spaceId, 'Must supply correct index of space Id in owner array');
        Space storage space = spaces[_spaceId];
        require(space.reservedBy == msg.sender || owner == msg.sender, "Must have the space reserved to cancel it");

        ownerReservations[space.reservedBy][_ownerReservationsIdx] = 0;
        space.reservedBy = 0x0;
        uint fee = fees[space.feeIdx];
        uint depositAmount = fee * (depositPct/100);
        uint refundAmt = fee - depositAmount;
        credits[space.reservedBy] = credits[space.reservedBy].add(refundAmt);

        emit ReservationCancelled(_spaceId, refundAmt, space.reservedBy, msg.sender);
    }


    function getSpaces(uint24 _start, uint24 _end) public view returns (uint24[] currentSpaces, address[] reservedBy, uint[] spaceFees, uint24[] spaceMetaHashes) {
      uint24 spaceCount = _end - _start;
      uint index = 0;
      currentSpaces = new uint24[](spaceCount);
      reservedBy = new address[](spaceCount);
      spaceFees = new uint[](spaceCount);
      spaceMetaHashes = new uint24[](spaceCount);
      for (_start; _start < _end; _start++) {
          Space storage space = spaces[_start];
          currentSpaces[index] = space.id;
          reservedBy[index] = space.reservedBy;
          spaceFees[index] = fees[space.feeIdx];
          spaceMetaHashes[index] = space.metaHashIdx;
          index++;
      }

      return (currentSpaces, reservedBy, spaceFees, spaceMetaHashes );
    }

    /** @dev get reservations for an account
      * @param _owner address of reservations.
      * @return resSpaceIds space ids of reservations.
      * @return starts start dates of reservations.
      */
    function getReservationsForOwner (address _owner) public view returns (uint24[]) {
      return ownerReservations[_owner];
    }
 }
