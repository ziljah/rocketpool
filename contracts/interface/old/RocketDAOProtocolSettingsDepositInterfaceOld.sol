pragma solidity 0.7.6;

// SPDX-License-Identifier: GPL-3.0-only

interface RocketDAOProtocolSettingsDepositInterfaceOld {
    function getDepositEnabled() external view returns (bool);
    function getAssignDepositsEnabled() external view returns (bool);
    function getMinimumDeposit() external view returns (uint256);
    function getMaximumDepositPoolSize() external view returns (uint256);
    function getMaximumDepositAssignments() external view returns (uint256);
}
