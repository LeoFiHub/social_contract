// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/access/Ownable.sol";

struct Quote{
    string symbol;
    uint256 price;
}

struct Signal{
    string name;
    string des;
    uint256 amount;
    address provider_adr;
    address vault_adr;
    uint256 created_at;
    uint256 end_at;
    string signal_type;
    string asset;
    uint256 market_trend; 
}

struct PerformanceMetrics{
    uint256 total_signals;
    uint256 win_rate;
    uint256 total_followers;
}

struct SystemFee{
    uint256 amount;
    string currency;
}

contract VaultSignal is Ownable{
    uint256 public quoteLength;
    address[] public whiteListAddress;

    mapping(address => bool) public isWhiteList ;
    mapping(string => uint256) quote;
    mapping(string => uint256) quoteUpdatedAt;
    mapping(address => Signal) public signal_provider;

    event NewQuote(string indexed symbol, uint256 newPrice, uint256 oldPrice, uint256 updatedAt);

    constructor(uint256 _quoteLength) {
        whiteListAddress.push(msg.sender);
        isWhiteList[msg.sender] = true;
        quoteLength = _quoteLength;
    }

    modifier onlyAdmin(){
        require(isWhiteList[msg.sender] == true, "Invalid admin");
        _;
    }

    function addwhiteListAddress(address _admin) public onlyOwner{
        whiteListAddress.push(_admin);
        isWhiteList[_admin] = true;
    }

    function getTotalQuotes() external  view  returns(uint256){
        return quoteLength;
    }

    function setQuoteLength(uint256 _quoteLength) public onlyAdmin{
        quoteLength = _quoteLength;
    }

    function setMultipleQuote(Quote[] memory _quotes) external onlyAdmin{
        for(uint256 i = 0; i < _quotes.length; i++){
            uint256 oldPrice = quote[_quotes[i].symbol];
            quote[_quotes[i].symbol] = _quotes[i].price;
            quoteUpdatedAt[_quotes[i].symbol] = block.timestamp;

            emit NewQuote(_quotes[i].symbol, _quotes[i].price, oldPrice, block.timestamp);
        }
    }

    function setSignal(string memory symbol, uint256 price, uint256 priceStatus) public onlyAdmin{
        require(priceStatus == 0, "Invalid price response");
        
        uint256 oldPrice = quote[symbol];
        quote[symbol] = price;
        quoteUpdatedAt[symbol] = block.timestamp;

        emit NewQuote(symbol, price, oldPrice, block.timestamp);
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice(string memory symbol) public view returns (uint256, uint256) {
        return (quote[symbol], quoteUpdatedAt[symbol]);
    }
}
