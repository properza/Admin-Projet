import React, { useState, useEffect } from 'react'
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon'

function SelectBox(props){
    const { 
        labelTitle, 
        labelDescription, 
        defaultValue, 
        containerStyle, 
        placeholder, 
        labelStyle, 
        options, 
        updateType, 
        updateFormValue, 
        value: propValue 
    } = props;

    const [value, setValue] = useState(defaultValue || "");

    // ใช้ useEffect เพื่ออัปเดตค่า value ถ้า propValue เปลี่ยนแปลง
    useEffect(() => {
        if (propValue !== undefined) {
            setValue(propValue);
        }
    }, [propValue]);

    const updateValue = (newValue) => {
        setValue(newValue);
        if (newValue !== "PLACEHOLDER") {
            updateFormValue({ updateType, value: newValue });
        } else {
            updateFormValue({ updateType, value: "" });
        }
    };

    return (
        <div className={`inline-block ${containerStyle}`}>
            <label className={`label ${labelStyle}`}>
                <div className="label-text">
                    {labelTitle}
                    {labelDescription && (
                        <div className="tooltip tooltip-right" data-tip={labelDescription}>
                            <InformationCircleIcon className='w-4 h-4' />
                        </div>
                    )}
                </div>
            </label>

            <select
                className="select select-bordered w-full"
                value={value}
                onChange={(e) => updateValue(e.target.value)}
            >
                <option disabled value="PLACEHOLDER">{placeholder}</option>
                {options.map((o, k) => (
                    <option value={o.value || o.name} key={k}>
                        {o.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SelectBox;
