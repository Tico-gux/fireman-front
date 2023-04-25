import React from 'react'
import { TextField, MenuItem } from '@mui/material'

import { useField, useFormikContext } from 'formik'
interface ISelectProps {
    name: string
    options: any[]
    label: string
    nameSelected: string
}
const Select = ({ name, options, label, nameSelected, ...otherProps }: ISelectProps) => {
    const { setFieldValue } = useFormikContext()
    const [field] = useField(name)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setFieldValue(name, value)
    }

    const configSelect = {
        ...field,
        ...otherProps,
        select: true,
        fullWidth: true,
        onChange: handleChange,
        label: label
    }

    // if (meta && meta.touched && meta.error) {
    //     configSelect.error = true
    //     configSelect.helperText = meta.error
    // }
    return (
        <TextField {...configSelect}>
            <MenuItem value={nameSelected} disabled>
                {nameSelected}
            </MenuItem>
            {options.map((item: any) => {
                return (
                    <MenuItem key={item.name} value={item}>
                        {item.name}
                    </MenuItem>
                )
            })}
        </TextField>
    )
}

export default Select
