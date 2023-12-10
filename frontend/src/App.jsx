import { useEffect, useState } from "react";
import "./App.css";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useCoupon } from "./context/CouponContext";
import { useAuth } from "./context/AuthContext";
import bg from "./assets/welcomebgfinal.png";

function App() {
    const { currentAccount, checkIfWalletConnected } = useAuth();
    const { checkIfUserExists, addUser, getCompanyByAddress } = useCoupon();
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
        if (currentAccount === "") checkIfWalletConnected();
    }, [currentAccount]);

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
        try {
            if (currentAccount === "") {
                console.error("Error");
                return;
            }
            console.log("Hello!")
            const fetchUser = await checkIfUserExists(currentAccount);

            console.log(fetchUser);
            if (fetchUser) {
                console.log("Exists!");
            } else {
                await addUser(currentAccount, 0, currentAccount);
            }
            navigate("/dashboard");
        } catch (err) {
            console.log(err);
        }
    };

    const companyLoginButton = async () => {
        if (currentAccount === "") {
            console.error("Error");
            return;
        }
        console.log(currentAccount);
        const company = await getCompanyByAddress(currentAccount);
        if (company["name"] !== "") {
            console.log("Exists!");
            navigate("/company");
        } else {
            navigate("/companyLogin");
        }
    };

    return (
        <ExtensionContainer>
            <ExtensionContentCard style={{backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                <GraphicSection></GraphicSection>
                <ContentSection>
                    <AppSubtitle>Get rewarded for using Web 3 ✨</AppSubtitle>
                    <AppLogo>CouponStack.</AppLogo>
                    <ActionButtons>
                        <UserLoginButton onClick={userLoginButton}>Get started</UserLoginButton>
                        <CompanyLoginButton onClick={companyLoginButton}>Partner</CompanyLoginButton>
                    </ActionButtons>
                </ContentSection>
            </ExtensionContentCard>
        </ExtensionContainer>
    );
}

const ExtensionContainer = styled.div`
    background-color: black;
    height: 100vh;
    min-width: 300px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: sans-serif;
    padding: 1rem;
    color: white;
`;

const ExtensionContentCard = styled.div`
    width: max(30%, 400px);
    height: 90%;
    background-color: #1f1f1f;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    padding: 1rem;
`;

const GraphicSection = styled.div`
    flex: 1;
`;

const ContentSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
`;

const AppSubtitle = styled.div`
    font-size: 1rem;
    background: -webkit-linear-gradient(right, #ff5f5f, #7494ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const AppLogo = styled.div`
    font-weight: bold;
    text-align: center;
    font-size: 3rem;
`;

const ActionButtons = styled.div`
    display: flex;
    flex-direction: row;
`;

const UserLoginButton = styled.button`
    background-color: #3498db;
    color: white;
    border: none;
    outline: none;
    border-bottom: #227fbd 6px solid;
    padding: 0.8rem 2rem;
    border-radius: 50vh;
    font-size: 1.1rem;
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    cursor: pointer;
    transition: all 0.5s ease;
    
    &:hover {
        transform: translateY(-2px);
    }
    &:active {
        transition: all 0.1s ease;
        transform: translateY(4px);
        border-bottom: 0;
    }
`;

const CompanyLoginButton = styled.button`
    background-color: #8e44ad;
    color: white;
    border: none;
    outline: none;
    border-bottom: #763293 6px solid;
    padding: 0.8rem 2rem;
    border-radius: 50vh;
    font-size: 1.1rem;
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.5s ease;
    &:hover {
        transform: translateY(-2px);
    }
    &:active {
        transition: all 0.1s ease;
        transform: translateY(4px);
        border-bottom: 0;
    }
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
