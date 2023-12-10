/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useAuth } from '../context/AuthContext';
import { useCoupon } from '../context/CouponContext';
import { calculateMetricSocialMedia, nftMetric, poapMetric, xmtpMetric } from '../context/getMetrics';

const CompanyDashboard = () => {
  const {currentAccount, checkIfWalletConnected} = useAuth();

  useEffect(() => {
      if(currentAccount === "") checkIfWalletConnected();
  }, [currentAccount])

  const [threshold, setThreshold] = useState(0);

  const [open, setOpen] = useState(0);
  const [options, setOptions] = useState([
    {label: "NFT", value: "NFT", weight: 0, threshold: 0}, 
    {label: "POAP", value: "POAP", weight: 0, threshold: 0}, 
    {label: "Chat", value: "Chat", weight: 0, threshold: 0}, 
    {label: "Social Media", value: "Social Media",  weight: 0, threshold: 0}
  ])
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);

  const [customOptions, setCustomOptions] = useState([
    {label: "Ankit", value: 0, selected: false},
    {label: "Anki1t", value: 0, selected: false},
    {label: "Anki1t1", value: 0, selected: false}
  ])

  const {getAirStackData, setUsers} = useCoupon();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(options)
    if(open === 2) {
      let count = 0;
      for(let i=0; i<options.length; i++) {
        count += parseInt(options[i].weight);
      }

      if (count !== 100) {
        console.error("Not Possible!")
        return;
      }

      const data = await getAirStackData();
      let users = [];
      for (let i=0; i<data.length; i++) {
        const values = {
          "Chat": xmtpMetric(data[i].xmtp),
          "POAP": data[i].poap * 100,
          "NFT": nftMetric(data[i].erc),
          "Social Media": calculateMetricSocialMedia(data[i].lensFollowerCount + data[i].farcasterFollowerCount)
        };

        console.log(values);

        let total = 0;
        for (let j=0; j<options.length; j++) {
          total += values[options[j].value] * options[j].weight/100;
        }

        console.log(total, threshold);

        if(total >= threshold) {
          users.push(data[i].address);
        }
      }

      setUsers(users);
    } else {
      let finalOptions = [];
      for(let i=0; i<customOptions.size(); i++) {
        if(customOptions[i].selected)
          finalOptions.push(customOptions[i]);
      } 

      // TODO: Handle api calls 
      console.log(selectedOption);
    }
    navigate("/generate")
  }

  const updateCustomOptionSelect = (ind) => {
    let temp = [];
    for(let i=0; i<customOptions.length; i++) {
      if(i === ind) {
        console.log(customOptions[i])
        temp.push({...customOptions[i], selected: !customOptions[i].selected});
      } else {
        temp.push(customOptions[i]);
      }
    }
    setCustomOptions(temp);
  }

  const upateCustomOptionValue = (ind, val) => {
    let temp = [];
    for(let i=0; i<customOptions.length; i++) {
      if(i === ind) {
        temp.push({...customOptions[i], value: val});
      } else {
        temp.push(customOptions[i]);
      }
    }
    setCustomOptions(temp);
  }

  const updateGuidedOptionsWeight = (index, val) => {
    let temp = [];
    for(let i=0; i<options.length; i++) {
      if(i === index) {
        temp.push({...options[i], weight: val});
      } else {
        temp.push(options[i]);
      }
    }
    setOptions(temp);
  }
  
  return (
    <div>
      Company Dashboard
      <div>
        <button onClick={e => setOpen(1)}>Custom</button>
        <button onClick={e => setOpen(2)}>Guided</button>
        {open === 1 ? (
          <div>
            {
              customOptions.map((opt, index) => {
                return (
                  <div key={index}>
                    <input type='checkbox' value={opt.label} checked={opt.selected} onChange={e => updateCustomOptionSelect(index)}/>
                    <input type='number' value={opt.value} onChange={e => upateCustomOptionValue(index, e.target.value)} />
                  </div>
                )
              })
            }

          </div>
        ) : null}

        {open === 2 ? (<div>
            Threshold
            <input type='number' value={threshold} onChange={e => setThreshold(e.target.value)} />
            {
              options.map((opt, index) => {
                return (
                  <div key={index}>
                    <p>{opt.label}</p>
                    <input type='number' value={opt.weight} onChange={e => updateGuidedOptionsWeight(index, e.target.value)} />
                  </div>
                )
              })
            }
        </div>) : null}

        <button onClick={handleSubmit} disabled={!open}>Generate </button> 
      </div>
    </div>
    
  )
}
//guided, existing
export default CompanyDashboard