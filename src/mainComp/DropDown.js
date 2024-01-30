
import React, {useState} from 'react';

export default function DropDown(props){
    const [selectedOption, setSelectedOption] = useState(null)

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value)
        if(props.sendData) props.sendData(event.target.value)
    }
    return(
        <div className='red-border padding-5 margin-5 flex-box-row'>
            <p>{props.listName}</p>
            <select className='dropdown-comp' onChange={handleOptionChange} value={selectedOption} defaultValue={props.defaultValue}>
                {
                    props.optionList?.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))
                }
            </select>
        </div>
    );
}