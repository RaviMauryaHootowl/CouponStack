import { useEffect, useState } from "react";
import "./App.css";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useCoupon } from "./context/CouponContext";
import { useAuth } from "./context/AuthContext";

function App() {
    const {currentAccount, checkIfWalletConnected} = useAuth();
    const {checkIfUserExists, addUser, getCompanyByAddress} = useCoupon();
    const [count, setCount] = useState(0);
	const navigate = useNavigate();
 
    const [redeemedCoupons, setRedeemedCoupons] = useState([
        {
            name: "Flipkart Big Billion Days",
            offer: "1000 discount",
            value: 1000,
        },
        {
            name: "Amazon Web3 Sale",
            offer: "1000 discount",
            value: 1000,
        },
    ]);
    
    useEffect(() => {
        if(currentAccount === "") checkIfWalletConnected();
    }, [currentAccount])

    const onClick = async () => {
        let [tab] = await chrome.tabs.query({ active: true });
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                document.body.style.backgroundColor = "green";
                document.querySelector('[title="Search"]').value = "Sarah 👉👈";
            },
        });
    };

    const userLoginButton = async () => {
        try{
            if (currentAccount === "") {
                console.error("Error");
                return
            }
            const fetchUser = await checkIfUserExists(currentAccount);

            console.log(fetchUser)
            if(fetchUser) {
            console.log("Exists!") 
            } else {
                await addUser(currentAccount, 0, currentAccount);
            }
            navigate("/dashboard")
        }catch(err) {
            console.log(err)
        }
    }

    const companyLoginButton = async () => {
        if (currentAccount === "") {
            console.error("Error");
            return
        }
        const company = await getCompanyByAddress(currentAccount);
        if(company["name"] !== "") {
           console.log("Exists!") 
           navigate("/company")
        } else {
            navigate("/companyLogin")
        }
    }


    return (
        <ExtensionContainer>
            <AppLogo>Web3Coupons</AppLogo>
                <button onClick={userLoginButton}>User Login </button>
                <button onClick={companyLoginButton}>Company Login </button>
        </ExtensionContainer>
    );
}

const ExtensionContainer = styled.div`
	min-width: 300px;
    width: 100%;
    display: flex;
    flex-direction: column;
    font-family: sans-serif;
    padding: 1rem;
`;

const AppLogo = styled.div`
    font-weight: bold;
    text-align: center;
    padding: 1rem;
    font-size: 1.2rem;
`;

const RedeemedCouponsSection = styled.div`
    display: flex;
    flex-direction: column;
	margin-bottom: 1rem;
`;

const NewCouponsSection = styled.div`
    display: flex;
    flex-direction: column;
	margin-bottom: 1rem;
`;

const SectionHeader = styled.div`
    margin-bottom: 0.4rem;
`;

const RedeemedCouponCard = styled.div`
    margin-bottom: 0.4rem;
    background-color: #e0e0e0;
    padding: 0.4rem;
`;

export default App;
