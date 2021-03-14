import React from 'react';
import styles from "./styles.module.css";

interface Props {
    color: string;
    onPick: (color: string) => void;
}

const ColorPicker : React.FC<Props> = ({color, onPick}) => {
    return (
        <div onClick = {() => onPick(color)} className = {styles.picker} style = {{backgroundColor: color}}/>
    )
}

export default ColorPicker;