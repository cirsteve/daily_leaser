pragma solidity^0.4.24;

contract Packing {

    function pack(uint16 a, uint24 b) public pure returns(uint40) {
        return (uint40(a) << 24) | uint40(b);
    }

    function unpack(uint40 c) public pure returns(uint16 a, uint24 b) {
        a = uint16(c >> 24);
        b = uint24(c);
    }
}
