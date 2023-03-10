import React, { useContext, useEffect, useState } from 'react';

import { UnoContext } from '../../components/game/GameBoard';
import { SocketContext } from '../../providers/SocketProvider';

import { checkPlayableCards } from '../../../../shared/game/uno';
import { Card } from '../../../../shared/types';

import styles from './Card.module.css';

interface  CardProps {
    card: Card
    show?: boolean
    discard?: boolean
    children?: React.ReactNode
}

// mod function for card animation origin positioning
function mod(n:number, m:number) {
    return ((n % m) + m) % m;
  }

export default function GameCard({ card, show, discard }: CardProps){
    const uno = useContext(UnoContext);    
    const socket = useContext(SocketContext)
    const cardColor = card?.color

    const handleCardClick = () => {        
        socket.emit('play-card', uno.roomID, card)

        // if card is playable, finish turn
        const possibleCards = checkPlayableCards(uno);
        if( !uno.askForColor 
            && uno.currentPlayer === uno.playerIndex
            && (possibleCards && possibleCards.indexOf(card)) !== -1){

            console.log(uno.players[uno.currentPlayer!].hand.length,uno.players[uno.currentPlayer!].hand.length === 1,
                uno.players[uno.currentPlayer!].isUnoCallPossible,
                !uno.players[uno.currentPlayer!].isUno
                );
            

            if( // player should have called uno but didn't
                uno.players[uno.currentPlayer!].isUnoCallPossible &&
                !uno.players[uno.currentPlayer!].isUno
            ){
                socket.emit('set-uno-challenge', uno.roomID, uno.currentPlayer);
            }
            
            socket.emit('finish-turn', uno.roomID)
        }


    }

    const innerCard = 
        <>
            <div className={styles.TopLeft}>
                <h1>{card.value}</h1>
                {
                    (card.value === "6" || card.value === "9") && <h1>-</h1>
                }
            </div>
            <div className={styles.Middle}>
                {
                    !(card.value === "reverse" || card.value === "wild" || card.value === "skip") && <h1>{card.value}</h1>
                }
                
                {
                    (card.value === "6" || card.value === "9") && <h1>-</h1>
                }
            </div>
            <div className={styles.BotRight}>
                <h1>{card.value}</h1>
                {
                    (card.value === "6" || card.value === "9") && <h1>-</h1>
                }
            </div>
            
        </>
 
    if(discard && card){ // DISCARD PILE
        return(
            <div className={`${styles.RotationWrapper} ${mod(card.playedBy!-uno.playerIndex, 4) }`}> 
                <div 
                    className={`${styles.CardWrapper} ${styles.Discard} ${styles[cardColor!]}`}
                    style={{rotate:`${card.rotation}deg`, translate:`${card.offsetX}px ${card.offsetY}px`}}
                >
                    {innerCard}
                </div>
            </div>
        )
    }
    else if(!show){ // CARD BACKSIDE
        return(
            <div className={`${styles.CardWrapper} ${styles.HandCard}`}>
                <h1>UNO</h1>
            </div>
        )
    }
    else if (card){ // LOCAL PLAYERS HAND
        return(
            <div className={`
                    ${styles.CardWrapper} 
                    ${styles.HandCard} 
                    ${styles[cardColor!]} 
                    ${(uno.currentPlayer === uno.playerIndex && !uno.askForColor && !uno.players[uno.currentPlayer].isSkipped) && styles.Selectable}
                `} 
                onClick={() => (uno.currentPlayer === uno.playerIndex && uno.players[uno.currentPlayer].isSkipped === false) && handleCardClick()}
            >
                {innerCard}
            </div>
        )
    }
    else{
        return(
            <p>INVALID CARD TYPES</p>
        )}
}