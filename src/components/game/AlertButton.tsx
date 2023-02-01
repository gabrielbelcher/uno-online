import React, { useContext, useEffect } from 'react';
import { UnoContext } from '../../components/game/GameBoard';
import { SettingsContext } from '../../providers/SettingsProvider';
import { SocketContext } from '../../providers/SocketProvider';

import Styles from './AlertButton.module.css';

interface Props{
    text: string;
    action: () => void;
    alert?: boolean;
}

export default function AlertButton({text, action, alert}:Props) {
    return(
        <div className={`${Styles.UnoButtonWrapper} ${alert && Styles.Alert}`}>
            <div className={Styles.UnoButton} onClick={action}>
                <div className={Styles.UnoButtonCircle}/>
                <h1 className={Styles.SelectButton}>{text}</h1>
            </div>
        </div>
    )
}