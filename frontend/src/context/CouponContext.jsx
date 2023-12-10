/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { Database } from "@tableland/sdk";
import Wenb3Model from "web3modal";
import {CouponAddress, CouponABI} from "./constants";
import { fetchQuery } from "@airstack/airstack-react";
import { poapMetric } from "./getMetrics";

const CouponContext = createContext({});

export const useCoupon = () => useContext(CouponContext);

const fetchContract = (signerOrProvider) =>
	new ethers.Contract(CouponAddress, CouponABI, signerOrProvider);

export const CouponContextProvider = ({ children }) => {
	const [count, setCount] = useState(0);

	const privateKey =
		"74727a21e67972b6f8acc6c45ad157351c9cb527a7bf8cf10c7efebfa5016208";
	const provider = new ethers.providers.JsonRpcProvider(
		"https://sepolia.infura.io/v3/f7d93a7b2f68495995120e9486e1e423"
	);

	const users_table = "users_dcoupons_11155111_381";
	const wallet = new ethers.Wallet(privateKey, provider);
	const signer = wallet.connect(provider);
	const db = new Database({ signer });

	const connectingWithSmartContract = async () => {
		try {
			const web3Modal = new Wenb3Model();
			const connection = await web3Modal.connect();
			const provider = new ethers.providers.Web3Provider(connection);
			const signer = provider.getSigner();
			const contract = fetchContract(signer);
			console.log(contract)
			return contract;
		} catch (error) {
			console.log("Something went wrong while connecting with contract!");
			console.log(error);
		}
	};

		
	const getUsersData = async() => {
		const stmt = db.prepare(`SELECT * FROM ${users_table};`);
		const { results } = await stmt.all();
		return results;
	};

	const checkIfUserExists = async(address) => {
		const stmt = db.prepare(`SELECT * FROM ${users_table} WHERE wallet_address='${address}';`);
		const { results } = await stmt.all();
		console.log(results.length)
		return results.length >= 1;
	} 

	const applyCouponTableland = async(address, amount) => {
		const { meta: insert } = await db
			.prepare(
				`UPDATE ${users_table} SET exhausted_score=exhausted_score+${amount} WHERE wallet_address='${address}'`
			)
			.run();

		await insert.txn?.wait();
		console.log("Updated");
	};

	const addUser = async(address, category, name) => {
		console.log("Adding...")
		const { meta: insert } = await db
			.prepare(
				`INSERT INTO ${users_table} (wallet_address, total_score, exhausted_score, category, name) VALUES ('${address}', ${0}, ${0}, '${category}', '${name}')`
			)
			.run();
		console.log("Waiting...")
		await insert.txn?.wait();

		console.log("Added!");
	};

	const getUserByAddress = async(address) => {
		const stmt = db.prepare(
			`SELECT * FROM ${users_table} where wallet_address=${address};`
		);
		const { results } = await stmt.all();
		return results;
	};

	const updateTotalScore = async(address, amount) => {
		const { meta: insert } = await db
			.prepare(
				`UPDATE ${users_table} SET total_score=(SELECT total_score from ${users_table} where wallet_address=${address})+${amount} WHERE wallet_address='${address}'`
			)
			.run();

		await insert.txn?.wait();
		console.log("Updated");
	};

	const getCompanyByAddress = async (address) => {
		const contract = await connectingWithSmartContract();
		console.log(address);
		const data = await contract.getCompanyByAddress(address);
		return data;
	}

	const addCompany = async(name, url, address)=> {
		const contract = await connectingWithSmartContract();
		await contract.addCompany(name, url, address);
	}
	const addBulkProducts = async(CompanyId, amount, tokenURIs, categorys, ratings)=> {
		console.log(CompanyId, amount, tokenURIs, categorys, ratings)
		const contract = await connectingWithSmartContract();
		const transaction = await contract.addBulkProducts(CompanyId, amount, tokenURIs, categorys, ratings);
		await transaction.wait();
	}

	const fetchUserCoupons = async() => {
		const contract = await connectingWithSmartContract();
		const data = await contract.fetchAllCouponOfUser();
		return data;
	}

	const applyCoupon = async(couponId, value) => {
		console.log(couponId)
		const contract = await connectingWithSmartContract();
		const transaction = await contract.useCoupon(couponId);
		await transaction.wait();
	}

	const fetchCompanyCoupons = async(companyId) => {
		const contract = await connectingWithSmartContract();
		const data = await contract.fetchAllCouponOfOwner();

		console.log(data);
		console.log(await contract.fetchAllCouponOfUser())

		let res = []
		for(let i=0; i<data.length; i++) {
			console.log(parseInt(data[i].companyId.toString()))
			if(parseInt(data[i].companyId.toString()) === companyId) {
				res.push(data[i]);
			}
		}

		return res;
	}

	const fetchUsersList = async() => {
		// TODO: fetch users list
		return [];
	}

	const buyCoupon = async(couponId, userAddress) => {
		const new_signer = new ethers.Wallet(privateKey, provider);
		const contract = fetchContract(new_signer);
		await contract.buyCoupon(couponId, userAddress);
		console.log("Done!")
	}

	const callXmtpQuery = async (address) => {
		const XMTP_QUERY = `
		query BulkFetchPrimaryENSandXMTP {
			XMTPs(input: {blockchain: ALL, filter: {owner: {_eq: "${address}"}}}) {
			XMTP {
				isXMTPEnabled
				owner {
				addresses
				primaryDomain {
					name
				}
				}
			}
			}
		}
		`;
	
		const { data, error } = await fetchQuery(XMTP_QUERY, { address });
		return data;
	}
	
	
	const callLensQuery = async (address,compare,count) => {
		const LENS_QUERY = `
		query GetAllSocials {
		  Socials(
			input: {filter: {userAssociatedAddresses: {_eq: "${address}"}, dappName: {_eq: lens}}, blockchain: ethereum}
		  ) {
			Social {
			  blockchain
			  dappName
			  profileName
			  userAssociatedAddresses
			  followerCount
			}
		  }
		}
		`;
	
		const { data, error } = await fetchQuery(LENS_QUERY, { address });
		return data;
	}
	
	const callFarcasterQuery = async (address) => {
		const FARCASTER_QUERY = `
		query GetAllSocials {
		  Socials(
			input: {filter: {userAssociatedAddresses: {_eq: "${address}"}, dappName: {_eq: farcaster}}, blockchain: ethereum}
		  ) {
			Social {
			  blockchain
			  dappName
			  profileName
			  userAssociatedAddresses
			  followerCount
			}
		  }
		}
		`;
	
		const { data, error } = await fetchQuery(FARCASTER_QUERY, { address });
		return data;
	}
	
	const callTokenQuery = async (address) => {
		const TOKEN_QUERY = ` 
		query tokens {
			erc20: TokenBalances(
			  input: {filter: {owner: {_in: ["${address}"]}, tokenType: {_in: [ERC20]}}, limit: 10, blockchain: ethereum}
			) {
			  data:TokenBalance {
				amount
				formattedAmount
				chainId
				id
				tokenAddress
				tokenId
				tokenType
				token {
				  name
				  symbol
				}
			  }
			}
		erc1155: TokenBalances(
			input: {filter: {owner: {_in: ["${address}"]}, tokenType: {_in: [ERC721]}, tokenAddress: {_nin: ["0x22C1f6050E56d2876009903609a2cC3fEf83B415"]}}, limit: 10, blockchain: ethereum}
		  ) {
			data:TokenBalance {
			  amount
			  formattedAmount
			  id
			  tokenAddress
			  tokenType
			  token {
				name
				symbol
			  }
			  tokenNfts {
				tokenId
				metaData {
				  name
				}
				contentValue {
				  image {
					medium
				  }
				}
			  }
			}
		  }
		erc6551: TokenBalances(
			input: {filter: {owner: {_in: ["${address}"]}, tokenType: {_in: [ERC721]}, tokenAddress: {_nin: ["0x22C1f6050E56d2876009903609a2cC3fEf83B415"]}}, limit: 10, blockchain: ethereum}
		  ) {
			data:TokenBalance {
			  amount
			  formattedAmount
			  id
			  tokenAddress
			  tokenType
			  token {
				name
				symbol
			  }
			  tokenNfts {
				tokenId
				metaData {
				  name
				}
				contentValue {
				  image {
					medium
				  }
				}
			  }
			}
		  }
			erc721: TokenBalances(
			  input: {filter: {owner:  {_in: ["${address}"]}, tokenType: {_in: [ERC721]}, tokenAddress: {_nin: ["0x22C1f6050E56d2876009903609a2cC3fEf83B415"]}}, limit: 10, blockchain: ethereum}
			) {
			  data:TokenBalance {
				amount
				formattedAmount
				id
				tokenAddress
				tokenType
				token {
				  name
				  symbol
				}
				tokenNfts {
				  tokenId
				  metaData {
					name
				  }
				  contentValue {
					image {
					  medium
					}
				  }
				}
			  }
			}
	  
			poap: TokenBalances(
				input: {filter: {owner:  {_in: ["${address}"]}}, limit: 10, blockchain: ethereum}
			  ) {
			  data:TokenBalance {
				amount
				id
				tokenAddress
				tokenType
				formattedAmount
				token {
				  name
				  symbol
				}
				tokenNfts {
				  metaData {
					name
				  }
				  tokenURI
				}
			  }
			}
		  }`;
	
		const { data, error } = await fetchQuery(TOKEN_QUERY, { address });
		return data;
	}

	const getAirStackData = async () => {
		let addressList = [
			"0x2F60D2BB84Eb8df6951F7215ef035eF052BA2725",
			"0xB0CCf43adA6CBaA26dcf4907117b496d49f74242",
		];
		const users = await getUsersData();
		console.log(users);
		for(const i in users) {
			addressList.push(users[i].wallet_address);
		}

		console.log(addressList)

		let xmtpData = []
		let lensData = [];
		let farcasterData = [];
		let userTokenValue = [];

		// xmtp
		for await (const item of addressList) {
	
			const res = await callXmtpQuery(item);
			if(res === null) continue;
			const newObj = {
				address: res?.XMTPs?.XMTP !== null ?  res?.XMTPs?.XMTP[0]?.owner?.addresses[0] : 0,
				enable: res?.XMTPs?.XMTP != null ? res?.XMTPs?.XMTP[0]?.isXMTPEnabled : 0
			}
			xmtpData.push(newObj);
		}
	
		for await (const item of addressList) {
			const res = await callLensQuery(item);
			const newObj = {
				address : item,
				followerCount: res?.Socials?.Social !== null ? res?.Socials?.Social[0]?.followerCount : 0
			}
		
			lensData.push(newObj);
		}

		for await (const item of addressList) {
		
			const res = await callFarcasterQuery(item);
			const newObj = {
				address : item,
				followerCount: res?.Socials?.Social !== null ? res?.Socials?.Social[0]?.followerCount : 0
			}
			farcasterData.push(newObj);
		}

		for await (const item of addressList) {
			
			const data = await callTokenQuery(item);
			const erc20 = data.erc20?.data?.length;
		
			const erc1155 = data.erc1155?.data?.length;
			const erc721 = data.erc721?.data?.length;

			const erc6551 = data.erc6551?.data?.length

			userTokenValue.push({
				address: item,
				erc20: erc20,
				erc1155: erc1155,
				erc721: erc721,
				erc6551: erc6551,
				poap: poapMetric(data),
			});
		
		}
		
		let finalRes = [];
		for(let i=0; i<addressList.length; i++) {
			finalRes.push({
				"lensFollowerCount": lensData[i].followerCount,
				"farcasterFollowerCount": farcasterData[i].followerCount,
				"erc": userTokenValue[i].erc20 + userTokenValue[i].erc1155 + userTokenValue[i].erc6551 + userTokenValue[i].erc721,
				"poap": userTokenValue[i].poap,
				"xmtp": xmtpData[i].enable ,
				"address": addressList[i]
			})
		}
		return finalRes;
	}

	const [users, setUsers] = useState([]);
	
	return (
		<CouponContext.Provider
			value={{
				setUsers,
				users,
				addUser,
				updateTotalScore,
				getUserByAddress,
				applyCouponTableland,
				getUsersData,
				checkIfUserExists,
				getCompanyByAddress,
				addCompany,
				setCount,
				fetchUserCoupons, 
				applyCoupon,
				addBulkProducts,
				fetchCompanyCoupons,
				fetchUsersList,
				buyCoupon,
				getAirStackData
			}}
		>
			{children}
		</CouponContext.Provider>
	);
};