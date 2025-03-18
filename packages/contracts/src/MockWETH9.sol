// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockWETH9 is ERC20 {
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    constructor() ERC20("Wrapped Ether", "WETH") {}

    // Deposit ETH and receive WETH
    function deposit() external payable {
        require(msg.value > 0, "Must deposit ETH");
        _mint(msg.sender, msg.value);
        emit Deposit(msg.sender, msg.value);
    }

    // Withdraw WETH and receive ETH
    function withdraw(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "Insufficient WETH balance");
        _burn(msg.sender, amount);
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender, amount);
    }

    // Fallback function to receive ETH
    receive() external payable {
        _mint(msg.sender, msg.value);
        emit Deposit(msg.sender, msg.value);
    }
}

