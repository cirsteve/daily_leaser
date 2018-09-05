pragma solidity^0.4.24;

contract Packing {

    function pack(uint24 a, uint24 b) public pure returns(uint48) {
        return (uint48(a) << 24) | uint40(b);
    }

    function unpack(uint48 c) public pure returns(uint24 a, uint24 b) {
        a = uint24(c >> 24);
        b = uint24(c);
    }
}
