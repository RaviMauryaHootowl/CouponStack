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

    function setURI(string memory newuri) public {
        _setURI(newuri);
    }

    function mint(
        uint256 companyId,
        string memory tokenURI,
        string memory category,
        uint256 rating
    ) public {
        companyCouponIds.increment();
        uint256 newItemId = companyCouponIds.current();

        _mint(owner, newItemId, 1, "");
        tokenToUri[newItemId] = tokenURI;
        companyIdToCouponsCount[companyId]++;
        couponIdToCompanyId[newItemId] = companyId;
        companyCouponMapping[newItemId] = CompanyCoupon({
            companyId: companyId,
            couponId: newItemId,
            owner: owner,
            isPurchased: false,
            cid: tokenURI,
            category: category,
            rating: rating
        });
    }

    function addBulkProducts(
        uint256 CompanyId,
        uint256 amount,
        string[] memory tokenURI,
        string[] memory category,
        uint256[] memory rating
    ) public {
        for (uint256 i = 0; i < amount; i++) {
            mint(CompanyId, tokenURI[i], category[i], rating[i]);
        }
    }

    function fetchCompanyById(
        uint256 companyId
    ) public view returns (Company memory) {
        return companyMapping[companyId];
    }

    function fetchAllCompany() public view returns (Company[] memory) {
        Company[] memory result = new Company[](CompanyCount);

        for (uint256 i = 0; i < CompanyCount; i++) {
            Company storage cur = companyMapping[i];
            result[i] = cur;
        }

        return result;
    }

    // function fetchCompanyCouponsById(
    //     uint256 itemId
    // ) public view returns (CompanyCoupon memory) {
    //     require(
    //         !companyCouponMapping[itemId].isPurchased,
    //         "Coupon is already Used"
    //     );
    //     return companyCouponMapping[itemId];
    // }

    function safeTransferFromHelper(
        address sender,
        address receiver,
        uint256 id
    ) public {
        safeTransferFrom(sender, receiver, id, 1, "");
    }

    function buyCoupon(uint256 CouponId, address claimAddr) public {
        require(
            !companyCouponMapping[CouponId].isPurchased,
            "Coupon is already used or is Invalid!!"
        );

        companyCouponMapping[CouponId].owner = claimAddr;
        companyCouponMapping[CouponId].isPurchased = true;
        safeTransferFromHelper(owner, claimAddr, CouponId);

        //emit TransferSingle(owner, owner, msg.sender, CouponId, 1);
    }

    function useCoupon(uint CouponId) public {
        require(
            companyCouponMapping[CouponId].owner == msg.sender,
            "You don't have the coupon or the coupon is invalid."
        );
        _burn(msg.sender, CouponId, 1);
        companyIdToCouponsCount[couponIdToCompanyId[CouponId]]--;
        delete companyCouponMapping[CouponId];
    }

    function fetchAllCouponOfUser()
        public
        view
        returns (CompanyCoupon[] memory)
    {
        uint256 totalItemCount = companyCouponIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (companyCouponMapping[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        CompanyCoupon[] memory items = new CompanyCoupon[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (companyCouponMapping[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                CompanyCoupon storage currentItem = companyCouponMapping[
                    currentId
                ];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchAllCouponOfOwner()
        public
        view
        returns (CompanyCoupon[] memory)
    {
        uint256 totalItemCount = companyCouponIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (companyCouponMapping[i + 1].owner == owner) {
                itemCount += 1;
            }
        }

        CompanyCoupon[] memory items = new CompanyCoupon[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (companyCouponMapping[i + 1].owner == owner) {
                uint256 currentId = i + 1;
                CompanyCoupon storage currentItem = companyCouponMapping[
                    currentId
                ];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
