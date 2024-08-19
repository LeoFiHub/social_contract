// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

struct UserProfile{
    address user;
    uint256 manager_id;
    string name;
    string contact_info;
    uint256 created_at;
    uint256 updated_at;
    Asset[] assets;
}

struct Asset{
    uint256 asset_id;
    uint256 fund_id;
    string name;
    string asset_type;
    uint256 value;
    uint256 status;
    uint256 created_at;
    uint256 updated_at;
}

contract DigiTrustProfile is Initializable, ERC1155Upgradeable, AccessControlUpgradeable, ERC1155PausableUpgradeable, ERC1155BurnableUpgradeable, ERC1155SupplyUpgradeable, UUPSUpgradeable {
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    mapping(address => uint256) public following;
    mapping(address => bool) public isAdmin;

    mapping(address => UserProfile) public userProfiles;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address defaultAdmin, address pauser, address minter, address upgrader)
        initializer public
    {
        __ERC1155_init("https://digitrust-gm.vercel.app/");
        __AccessControl_init();
        __ERC1155Pausable_init();
        __ERC1155Burnable_init();
        __ERC1155Supply_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, pauser);
        _grantRole(MINTER_ROLE, minter);
        _grantRole(UPGRADER_ROLE, upgrader);

        isAdmin[msg.sender] = true;
    }

    function createUserProfile(
        address _user,
        uint256 _manager_id,
        string memory _name,
        string memory _contact_info,
        Asset[] memory _assets
    ) public {
        UserProfile storage userProfile = userProfiles[_user];
        userProfile.user = _user;
        userProfile.manager_id = _manager_id;
        userProfile.name = _name;
        userProfile.contact_info = _contact_info;
        userProfile.created_at = block.timestamp;
        userProfile.updated_at = block.timestamp;
        delete userProfile.assets;
        for (uint i = 0; i < _assets.length; i++) {
            userProfile.assets.push(_assets[i]);
        }
    }

    function addAssetToUserProfile(
        address _user,
        uint256 _asset_id,
        uint256 _fund_id,
        string memory _name,
        string memory _asset_type,
        uint256 _value,
        uint256 _status
    ) public {
        UserProfile storage userProfile = userProfiles[_user];
        require(userProfile.user == _user, "UserProfile not found");

        Asset memory newAsset = Asset({
            asset_id: _asset_id,
            fund_id: _fund_id,
            name: _name,
            asset_type: _asset_type,
            value: _value,
            status: _status,
            created_at: block.timestamp,
            updated_at: block.timestamp
        });

        userProfile.assets.push(newAsset);
        userProfile.updated_at = block.timestamp;
    }

    function updateUserProfile(
        address _user,
        uint256 _manager_id,
        string memory _name,
        string memory _contact_info
    ) public {
        UserProfile storage userProfile = userProfiles[_user];
        require(userProfile.user == _user, "UserProfile not found");

        userProfile.manager_id = _manager_id;
        userProfile.name = _name;
        userProfile.contact_info = _contact_info;
        userProfile.updated_at = block.timestamp;
    }

    function getUserProfile(address _user) public view returns (UserProfile memory) {
        return userProfiles[_user];
    }

    function setURI(string memory newuri) public onlyRole(URI_SETTER_ROLE) {
        _setURI(newuri);
    }

    function setAsset(Asset memory asset) external{
        
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyRole(MINTER_ROLE)
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyRole(MINTER_ROLE)
    {
        _mintBatch(to, ids, amounts, data);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(UPGRADER_ROLE)
        override
    {}

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155Upgradeable, ERC1155PausableUpgradeable, ERC1155SupplyUpgradeable)
    {
        super._update(from, to, ids, values);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}