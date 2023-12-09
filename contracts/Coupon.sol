// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract Coupon is ERC1155, ERC1155Burnable {
    address private owner;

    constructor() ERC1155("") {
        owner = msg.sender;
    }

    using Counters for Counters.Counter;

    Counters.Counter private companyCouponIds;

    mapping(uint256 => string[]) id_to_ipfsUri;
    mapping(uint256 => address) private _tokenOwners;
    mapping(address => uint256) private _ownedTokensCount;
    mapping(uint256 => string) private tokenToUri;
    mapping(uint256 => uint256) private couponIdToCompanyId;

    struct Company {
        uint256 companyId;
        string name;
        string url;
        address companyAddress;
        uint256 count;
    }

    struct CompanyCoupon {
        uint256 companyId;
        uint256 couponId; //TokenId
        address owner;
        bool isPurchased;
        string cid; //TokenURI
        string category;
        uint rating;
    }

    uint256 private CompanyCount;
    mapping(uint256 => CompanyCoupon) public companyCouponMapping;
    mapping(address => Company) public addressToCompany;
    mapping(uint256 => Company) private companyMapping;
    mapping(uint256 => uint256) private companyIdToCouponsCount;

    function addCompany(
        string memory name,
        string memory url,
        address caddress
    ) public {
        Company memory newCompany = Company(
            CompanyCount,
            name,
            url,
            caddress,
            0
        );
        companyMapping[CompanyCount++] = newCompany;
        addressToCompany[caddress] = newCompany;
    }

    function getCompanyByAddress(
        address caddress
    ) public view returns (Company memory) {
        return addressToCompany[caddress];
    }
}
