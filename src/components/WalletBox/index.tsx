import React, {useMemo} from 'react';
import CountUp from 'react-countup';

import dollar from '../../assets/dollar.svg';
import arrowUp from '../../assets/arrow-up.svg';
import arrowDown from '../../assets/arrow-down.svg';

import {Container} from './styles';

interface IWalletBoxProps {
    title: string;
    amount: number;
    footerlabel: string;
    icon: 'dollar' | 'arrowUp' | 'arrowDown';
    color: string;
}

const WalletBox: React.FC<IWalletBoxProps> = ({
    title, amount, footerlabel, icon, color
}) => {
    
    const iconSelected = useMemo(() => {
        switch (icon) {
            case 'dollar':
                return dollar;
            case 'arrowUp':
                return arrowUp;
            case 'arrowDown':
                return arrowDown;
            default:
                return undefined;
        }
    }, [icon]);

    return (
        <Container color={color}>
            <span>{title}</span>
            <h1>
                <strong>R$ </strong>
                <CountUp 
                    end={amount}    
                    separator='.'
                    decimal=','
                    decimals={2}
                />
            </h1>
            <small>{footerlabel}</small>
            <img src={iconSelected} alt={title}/>
        </Container>
    )
}

export default WalletBox;