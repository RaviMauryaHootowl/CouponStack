/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useAuth } from '../context/AuthContext';

const CompanyDashboard = () => {
  const {currentAccount, checkIfWalletConnected} = useAuth();

  useEffect(() => {
    if(currentAccount === "") checkIfWalletConnected();
}, [currentAccount])

  const [open, setOpen] = useState(0);
  const options = [{label: "Ankit", value: "Ankit"}, {label: "1Ankit", value: "Ankit"}]
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);

  const [customOptions, setCustomOptions] = useState([
    {label: "Ankit", value: 0, selected: false},
    {label: "Anki1t", value: 0, selected: false},
    {label: "Anki1t1", value: 0, selected: false}
  ])

  
  const handleSubmit = (e) => {
    e.preventDefault();
    if(open === 1) {
      console.log(customOptions)
      // TODO: Handle api calls 

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

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const updateCustomOptionSelect = (ind) => {
    console.log(ind)
    console.log(customOptions)
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
                    <input type='radio' value={opt.label} checked={opt.selected} onChange={e => updateCustomOptionSelect(index)}/>
                    <input type='number' value={opt.value} onChange={e => upateCustomOptionValue(index, e.target.value)} />
                  </div>
                )
              })
            }

          </div>
        ) : null}

        {open === 2 ? (<div>
          <Select 
            onChange={handleChange}
            options={options}
          />
        </div>) : null}

        <button onClick={handleSubmit} disabled={!open}>Generate </button> 
      </div>
    </div>
    
  )
}
//guided, existing
export default CompanyDashboard