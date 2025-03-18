// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IWETH9 as IWETH} from "./interfaces/IWETH9.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BrewHouse is ReentrancyGuard {
    using SafeERC20 for IERC20;

    error InsufficientCollateral();
    error OnlySequencer();

    address public sequencer;

    IWETH public constant weth = IWETH(0x82aF49447D8a07e3bd95BD0d56f35241523fBab1);

    mapping(address => uint256) public collateral;

    constructor(address _sequencer) {
        sequencer = _sequencer;
    }

    function depositCollateral(uint256 amount) external payable nonReentrant {
        weth.deposit{value: amount}();
        collateral[msg.sender] += amount;
    }

    function withdrawCollateral(uint256 amount) external nonReentrant {
        if (collateral[msg.sender] < amount) revert InsufficientCollateral();
        collateral[msg.sender] -= amount;
        weth.withdraw(amount);
        payable(msg.sender).transfer(amount);
    }

    function slashCollateral(address user, uint256 amount) external onlySequencer {
        collateral[user] -= amount;
        weth.withdraw(amount);
        payable(sequencer).transfer(amount);
    }

    receive() external payable {}

    modifier onlySequencer() {
        if (msg.sender != sequencer) revert OnlySequencer();
        _;
    }
}
