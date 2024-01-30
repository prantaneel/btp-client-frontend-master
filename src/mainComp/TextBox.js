
import React, {useState} from 'react';

export default function TextBox(props){
    const [fieldValue, setFieldValue] = useState(null)

    const setFieldValueHandler = (event) =>{
        setFieldValue(event.target.value)
        if(props.sendData) props.sendData(event.target.value)
    }
    return(
        <div className='red-border padding-5 margin-5 flex-box-row'>
            <p>{props.fieldName}</p>
            <input type='text' className='textbox-comp' onChange={setFieldValueHandler}></input>
        </div>
    );
}