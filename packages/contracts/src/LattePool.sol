// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IWETH9 as IWETH} from "./interfaces/IWETH9.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LattePool is ReentrancyGuard {
    using SafeERC20 for IERC20;

    error InvalidSignature();
    error AlreadyBorrowed();

    mapping(address => mapping(address => uint256)) public borrowed;
    mapping(bytes32 => bool) public hasBorrowed;
    mapping(address => mapping(address => uint256)) public liquidity;

    event Borrowed(address indexed user, address indexed token, uint256 amount);
    event Repaid(address indexed user, address indexed token, uint256 amount);
    event LiquidityDeposited(address indexed user, address indexed token, uint256 amount);
    event LiquidityWithdrawn(address indexed user, address indexed token, uint256 amount);

    function borrow(
        address token,
        uint256 amount,
        bytes32 sequencerSignature
    ) external nonReentrant {
        bytes32 borrowId = keccak256(abi.encode(msg.sender, token, amount));
        if (hasBorrowed[borrowId]) revert AlreadyBorrowed();
        if (!_verifySequencerApproval(borrowId, sequencerSignature))
            revert InvalidSignature();

        hasBorrowed[borrowId] = true;
        borrowed[msg.sender][token] += amount;
        IERC20(token).safeTransfer(msg.sender, amount);

        emit Borrowed(msg.sender, token, amount);
    }

    function repay(address token, uint256 amount) external nonReentrant {
        borrowed[msg.sender][token] -= amount;
        emit Repaid(msg.sender, token, amount);
    }

    function depositLiquidity(
        address token,
        uint256 amount
    ) external nonReentrant {
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        liquidity[msg.sender][token] += amount;
        
        emit LiquidityDeposited(msg.sender, token, amount);
    }

    function withdrawLiquidity(
        address token,
        uint256 amount
    ) external nonReentrant {
        require(liquidity[msg.sender][token] >= amount, "Insufficient liquidity");
        liquidity[msg.sender][token] -= amount;
        IERC20(token).safeTransfer(msg.sender, amount);
        
        emit LiquidityWithdrawn(msg.sender, token, amount);
    }

    function _verifySequencerApproval(
        bytes32 data,
        bytes32 sequencerSignature
    ) internal pure returns (bool) {
        // TODO: Implement signature verification
        return true;
    }
}

