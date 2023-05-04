// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    address[]  wavers;

    constructor() {
        console.log("hey, I'm a smart contract");
    }

    function wave() public {
        totalWaves += 1;
        console.log("%s has waived!", msg.sender);
        wavers.push(msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }

    function getWavers() public view returns (address[] memory) {
        return wavers;
    }

}
