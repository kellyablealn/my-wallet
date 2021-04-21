import React from 'react';
import {Container, Tag} from './styles';

interface IHistoryFinanceCardProps {
    tagColor: string;
    title: string;
    subtitle: string;
    amount: string;
}

const HistoryFinanceCard: React.FC<IHistoryFinanceCardProps> = ({
    title, subtitle, tagColor, amount
}) => {
    return (
        <Container>
            <Tag color={tagColor}/>
            <div>
                <span>{title}</span>
                <span>{subtitle}</span>
            </div>
            <h3>{amount}</h3>
        </Container>
    )
}

export default HistoryFinanceCard;