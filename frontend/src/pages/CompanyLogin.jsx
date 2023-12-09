import { useEffect, useState } from 'react'
import styled from 'styled-components';
import { useCoupon } from '../context/CouponContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CompanyLogin = () => {
    const navigate = useNavigate()
    const {currentAccount, checkIfWalletConnected} = useAuth();

    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    // name,
    const {addCompany} = useCoupon(); 
  
    const addCompanyButton = async() => {
        try{ 
            await addCompany(name, url, currentAccount);
            navigate("/company")
        } catch(e){
            console.log(e);
        }
    } 

    useEffect(() => {
        if(currentAccount === "") checkIfWalletConnected();
    }, [currentAccount])

    return (
        <ExtensionContainer>
            <div>
                <h2>Company Register</h2>
                <div>
                <input name="" value={currentAccount} disabled={true}/>
                    
                    <input placeholder='Company Name' name="name" value={name} onChange={e => setName(e.target.value)} />
                    <input placeholder='Company URL' name="url" value={url} onChange={e => setUrl(e.target.value)}/>
                    <button onClick={addCompanyButton} >Register</button>
                </div> 
            </div>
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

export default CompanyLogin