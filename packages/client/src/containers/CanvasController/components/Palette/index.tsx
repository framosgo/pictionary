import React from 'react';
import styles from "./styles.module.css";
import { COLORS } from "../../constants/colors";
import ColorPicker from './ColorPicker';

interface Props {
    onPick: (color: string) => void
}

const Palette: React.FC<Props> = ({onPick}) => {

    return (
        <div className = {styles.palette}>
            {COLORS.map((color) => 
                <ColorPicker key = {color} color = {color} onPick = {(color: string) => onPick(color)} />
            )}
        </div>
    )
}

export default Palette