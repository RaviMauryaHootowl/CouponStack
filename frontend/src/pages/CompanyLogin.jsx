import { useEffect, useState } from "react";
import styled from "styled-components";
import { useCoupon } from "../context/CouponContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bg from "../assets/welcomebgfinal.png";

const CompanyLogin = () => {
    const navigate = useNavigate();
    const { currentAccount, checkIfWalletConnected } = useAuth();

    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    // name,
    const { addCompany } = useCoupon();

    const addCompanyButton = async () => {
        try {
            await addCompany(name, url, currentAccount);
            navigate("/company");
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if (currentAccount === "") checkIfWalletConnected();
    }, [currentAccount]);

    return (
        <ExtensionContainer>
            <ExtensionContentCard
                style={{
                    backgroundImage: `url(${bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <GraphicSection></GraphicSection>
                <ContentSection>
                    <AppSubtitle>Get rewarded for using Web 3 ✨</AppSubtitle>
                    <AppLogo>CouponStack.</AppLogo>
                    <ActionForm>
                        <CustomInput name="" value={currentAccount} />

                        <CustomInput
                            placeholder="Company Name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <CustomInput
                            placeholder="Company URL"
                            name="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        <RegisterButton onClick={addCompanyButton}>Register</RegisterButton>
                        {/* <UserLoginButton onClick={userLoginButton}>Get started</UserLoginButton>
                    <CompanyLoginButton onClick={companyLoginButton}>Partner</CompanyLoginButton> */}
                    </ActionForm>
                </ContentSection>
            </ExtensionContentCard>
        </ExtensionContainer>
    );

    return (
        <ExtensionContainer>
            <div>
                <h2>Company Register</h2>
                <div></div>
            </div>
        </ExtensionContainer>
    );
};

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
    margin-bottom: 1rem;
`;

const ActionForm = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const CustomInput = styled.input`
    padding: 0.6rem;
    font-size: 1rem;
    border: none;
    outline: none;
    border-radius: 50vh;
    margin-bottom: 1rem;
`;

const RegisterButton = styled.button`
    width: 100%;
    background-color: #3498db;
    color: white;
    border: none;
    outline: none;
    border-bottom: #227fbd 6px solid;
    padding: 0.8rem 2rem;
    border-radius: 50vh;
    font-size: 1.1rem;
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

export default CompanyLogin;
