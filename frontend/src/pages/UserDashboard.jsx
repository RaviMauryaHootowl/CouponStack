/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react'
import {useAuth} from "../context/AuthContext"
import { useCoupon } from '../context/CouponContext'
import styled from 'styled-components';

const UserDashboard = () => {

    const {currentAccount, checkIfWalletConnected} = useAuth();
    useEffect(() => {
        if(currentAccount === "") checkIfWalletConnected()
    }, [currentAccount])

    const [redeemedCoupons, setRedeemedCoupons] = useState([])
    const {fetchUserCoupons, applyCoupon} = useCoupon();
    const fetchData = useCallback(async() => {
        const data = await fetchUserCoupons(currentAccount);
        setRedeemedCoupons(data);
    }, [])

    useState(() => {
        const onLoad = () => {
            fetchData();
        }
        onLoad()
    }, [])

    const applyCouponButton = async (index) => {
        try{
            const coupon = redeemedCoupons[index];
            await applyCoupon(coupon["couponId"], coupon["value"]);
            await fetchData();
        } catch(err) {
            console.log(err)
        }
    }

  return (
    <ExtensionContainer>
            <AppLogo>Web3Coupons</AppLogo>
            <RedeemedCouponsSection>
                <SectionHeader>Redeemed Coupons</SectionHeader>
                {redeemedCoupons.map((coupon, index) => {
                    return (
                        <RedeemedCouponCard key={index}>
                            <button onClick={e => applyCouponButton(index)}>Apply</button>
                        </RedeemedCouponCard>
                    );
                })}
            </RedeemedCouponsSection>
            </ExtensionContainer>
  )
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


const SectionHeader = styled.div`
    margin-bottom: 0.4rem;
`;

const RedeemedCouponCard = styled.div`
    margin-bottom: 0.4rem;
    background-color: #e0e0e0;
    padding: 0.4rem;
`;
export default UserDashboard