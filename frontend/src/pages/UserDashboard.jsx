/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCoupon } from "../context/CouponContext";
import styled from "styled-components";

const UserDashboard = () => {
    const { currentAccount, checkIfWalletConnected } = useAuth();
    useEffect(() => {
        if (currentAccount === "") {checkIfWalletConnected();}
        else{ fetchData()}
    }, [currentAccount]);

    const [redeemedCoupons, setRedeemedCoupons] = useState([]);
    const { fetchUserCoupons, applyCoupon } = useCoupon();
    const fetchData = useCallback(async () => {
        console.log(currentAccount);
        const data = await fetchUserCoupons(currentAccount);
        console.log(data);
        setRedeemedCoupons(data);
    }, [currentAccount]);

    const applyCouponButton = async (index) => {
        try {
            const coupon = redeemedCoupons[index];
            await applyCoupon(coupon["couponId"], coupon["value"]);
            await fetchData();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <ExtensionContainer>
            <ExtensionContentCard
            >
                <SectionHeader>Redeemed Coupons</SectionHeader>
                <ContentSection>
                    {redeemedCoupons.map((coupon, index) => {
                        return (
                            <RedeemedCouponCard key={index}>
                                <PlainLine>Code: {
                                    JSON.parse(coupon.cid).code
                                }</PlainLine>
                                <PlainLine>Value: ₹{
                                    JSON.parse(coupon.cid).value
                                }/-</PlainLine>
                                
                                <ApplyButton
                                    onClick={(e) => applyCouponButton(index)}
                                >
                                    Apply
                                </ApplyButton>
                            </RedeemedCouponCard>
                        );
                    })}
                </ContentSection>
            </ExtensionContentCard>
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
    overflow-y: scroll;
    background-color: #1f1f1f;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    padding: 1rem;
`;

const GraphicSection = styled.div`
    flex: 1;
`;

const PlainLine = styled.div`
    display: flex;
    flex-direction: row;
`;

const ContentSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
`;

const SectionHeader = styled.div`
    font-size: 1.5rem;
    margin-bottom: 1rem;
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

const NewCouponsSection = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
`;

const RedeemedCouponCard = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #3e3e3e;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
`;

const ApplyButton = styled.button`
    background-color: #8e44ad;
    color: white;
    border: none;
    outline: none;
    border-bottom: #7d339c 6px solid;
    padding: 0.8rem 2rem;
    border-radius: 0.5rem;
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

export default UserDashboard;
