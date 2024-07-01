import React, { useEffect, useState } from 'react'

const RequirementField = ({name, label, register, errors, setValue, getValues}) => {
    const [requirement, setRequirement] = useState("");
    const [requirementList, setRequirementList] = useState([]);

    const handleAddRequirement =() =>{
        if(requirement){
            setRequirementList([...requirementList,requirement]);
            setRequirement("");
        }
    }

    const handleRemoveRequirement =(index) =>{
        const updateRequirementList = [...requirementList];
        updateRequirementList.slice(index,1);
        setRequirementList(updateRequirementList);
    }

    useEffect(()=>{
        register(name,{required:true, validate: (value)=> value.length>0})
    },[])

    useEffect(()=>{
        setValue(name,requirementList)
    },[requirementList])
  return (
    <div>
      <label htmlFor={name}>{label}<sup>*</sup></label>
      <div>
        <input 
            type="text" 
            id={name}
            value={requirement}
            onChange={(e)=> setRequirement(e.target.value)}
        />
        <button type='button' onClick={handleAddRequirement}>Add</button>
      </div>
      {
        requirementList.length > 0 && (
            <ul>
                {
                    requirementList.map((requirement, index) =>{
                        <li key={index}>
                            <span>{requirement}</span>
                            <button type='button' onClick={handleRemoveRequirement(index)}>clear</button>
                        </li>
                    })
                }
            </ul>
        )
      }
      {
        errors[name] && (
            <span>{label} is required</span>
        )
      }
    </div>
  )
}

export default RequirementField
