// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.2;
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

interface IERC20 {
    function balanceOf(address owner) external view returns (uint256);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function approve(address spender, uint256 value) external returns (bool);

    function transfer(address to, uint256 value) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);
    function adminTransferFrom(address from, address to, uint tokens) external returns(bool success);
}

contract DigiTrustVault is KeeperCompatibleInterface {
    address public owner; //Person who deploys and uses the contract
    IERC20 public dgt = IERC20(0xDdf9B62DbfbDd5D473bB89295843915D7F21cFed);
    address[] public whiteListAddress;

    mapping(address => bool) public isWhiteList;
    mapping (address => bool) public  isInvestor;

    event DepositVault(address owner, uint256 amount, address vault , uint256 openAt);
    event WithdrawVault(address receiver, uint256 amount, address vault , uint256 openAt);

    constructor(uint updateInterval, address _dgt) {
        owner = msg.sender;
        interval = updateInterval; //specified in seconds
        lastTimeStamp = block.timestamp;

        dgt = IERC20(_dgt);
        whiteListAddress.push(msg.sender);
        isWhiteList[msg.sender] = true;
    }

    modifier onlyAdmin(){
        require(isWhiteList[msg.sender] == true, "Invalid admin");
        _;
    }

    function setDGTToken(address _dgtToken) external onlyAdmin{
        dgt = IERC20(_dgtToken);
    }

    function depositOrder(address _sender, uint256 _amount) external {
        require(dgt.balanceOf(_sender) > _amount, "invalid amount to deposit");
        dgt.adminTransferFrom(_sender, address(this), _amount * 10**18);
        isInvestor[_sender] = true;

        emit DepositVault(_sender, _amount, address(this), block.timestamp);
    }

    function withdraw(uint256 _amount) external {
        require(isInvestor[msg.sender] == true, "invalid investor");

        dgt.adminTransferFrom(address(this), msg.sender, _amount * 10**18);

        emit WithdrawVault(msg.sender, _amount, address(this), block.timestamp);
    }

    function deposit() external payable {}

    function balanceOfContract() external view returns(uint256) {
        return address(this).balance;
    }

    uint public immutable interval;
    uint public lastTimeStamp;

    function checkUpkeep(bytes calldata ) external override returns(bool upkeedNeeded, bytes memory performData) {
        upkeedNeeded = (block.timestamp - lastTimeStamp) > interval; //If upkeep needed is greater than interval, return true. Upkeep needed is true
    }

    function performUpkeep(bytes calldata performData) external override {
        if ((block.timestamp - lastTimeStamp) > interval) {
            lastTimeStamp = block.timestamp; //Reset the timer for checkUpKeep
            payable(address(owner)).transfer(0.1 ether); //Pay out the specified amount
        }
    }
}