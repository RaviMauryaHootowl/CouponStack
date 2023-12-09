/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { Database } from "@tableland/sdk";
import Wenb3Model from "web3modal";
import {CouponAddress, CouponABI} from "./constants";

const CouponContext = createContext({});

export const useCoupon = () => useContext(CouponContext);

const fetchContract = (signerOrProvider) =>
	new ethers.Contract(CouponAddress, CouponABI, signerOrProvider);

export const CouponContextProvider = ({ children }) => {
	const [count, setCount] = useState(0);

	const privateKey =
		"74727a21e67972b6f8acc6c45ad157351c9cb527a7bf8cf10c7efebfa5016208";
	const provider = new ethers.providers.JsonRpcProvider(
		"https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78"
	);

	const users_table = "users_80001_8416";
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
		return results.size === 1;
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
		const data = await contract.getCompanyByAddress(address);
		console.log(await contract.fetchAllN())
		return data;
	}

	const addCompany = async(name, url, address)=> {
		const contract = await connectingWithSmartContract();
		await contract.addCompany(name, url, address);
	}
	const addBulkProducts = async(CompanyId, amount, tokenURI, category, rating)=> {
		const contract = await connectingWithSmartContract();
		await contract.addBulkProducts(CompanyId, amount, tokenURI, category, rating);
	}

	const fetchUserCoupons = async() => {
		const contract = await connectingWithSmartContract();
		const data = await contract.fetchAllCouponOfUser();
		return data;
	}

	const applyCoupon = async(couponId, value) => {
		const contract = await connectingWithSmartContract();
		await contract.useCoupon(couponId);
	}



	
	return (
		<CouponContext.Provider
			value={{
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
				addBulkProducts
			}}
		>
			{children}
		</CouponContext.Provider>
	);
};