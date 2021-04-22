import React, {useMemo, useState, useEffect} from 'react';

import ContentHeader from '../../components/ContentHeader';
import SelectInput from '../../components/SelectInput';
import HistoryFinanceCard from '../../components/HistoryFinanceCard';

import {uuid} from 'uuidv4';

import gains from '../../repositories/gains';
import expenses from '../../repositories/expenses';
import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';

import listOfMonths from '../../utils/months';

import {Container, Content, Filters} from './styles';

interface IRouteParams {
    match: {
        params: {
            type: string;
        }
    }
}

interface IData {
    id: string,
    description: string;
    amountFormatted: string;
    frequency: string;
    dateFormatted: string;
    tagColor: string;
}

const List: React.FC<IRouteParams> = ({match}) => {
    const [data, setData] = useState<IData[]>([]);
    const [monthSelected, setMonthSelected] = useState<string>(String(new Date().getMonth() + 1));
    const [yearSelected, setYearSelected] = useState<string>(String(new Date().getFullYear()));

    const [selectedFrequency, setSelectedFrequency] = useState<string[]>(['recorrente', 'eventual']);
    
    const {type} = match.params;

    const title = useMemo(() => {
        return type === 'entry-balance' 
            ? {title: 'Entradas', lineColor: '#F7931B'} 
            : {title: 'Saídas', lineColor: '#E44C4E'};
    }, [type]);

    const listData = useMemo(() => {
        return type === 'entry-balance' ? gains : expenses;
    }, [type]);

    const months = useMemo(() => {
        return listOfMonths.map((month, index) => (
            {
                value: index + 1,
                label: month
            }
        ));
    }, [])    

    const years = useMemo(() => {
        
        let uniqueYears: number[] = [];

        listData.forEach(item => {
            const date = new Date(item.date);
            const year = date.getFullYear();

            if(!uniqueYears.includes(year)){
                uniqueYears.push(year);
            }
        });

        return uniqueYears.map(year => {
            return {
                value: year,
                label: year
            }
        });
    }, [listData]);

    const handleFrequencyClick = (frequency: string) => {
        const alreadySelected = selectedFrequency.findIndex(item => item === frequency);

        if (alreadySelected >= 0) {
            const filtered = selectedFrequency.filter(item => item !== frequency);
            setSelectedFrequency(filtered);
        } else {
            setSelectedFrequency((prev) => [...prev, frequency]);
        }
    }

    useEffect(() => {
        console.log(yearSelected);

        const filteredDate = listData.filter(item => {
            const date = new Date(item.date);
            
            const month = String(date.getMonth() + 1);
            const year = String(date.getFullYear());

            return month === monthSelected 
                && year === yearSelected
                && selectedFrequency.includes(item.frequency);
        });

        const formattedDate = filteredDate.map(item => {
            return {
                id: uuid(),   
                description: item.description,
                amountFormatted: formatCurrency(Number(item.amount)),
                frequency: item.frequency,
                dateFormatted: formatDate(item.date),
                tagColor: item.frequency === 'recorrente' ? '#4E41F0' : '#E44C4E'
            }
        });
    
        setData(formattedDate);

    }, [listData, monthSelected, yearSelected, data.length, selectedFrequency]);

    return (
        <Container>
            <ContentHeader title={title.title} lineColor={title.lineColor}>
                <SelectInput 
                    defaultValue={monthSelected}
                    options={months} 
                    onChange={(e) => setMonthSelected(e.target.value)}/>
                <SelectInput 
                    defaultValue={yearSelected}
                    options={years} 
                    onChange={(e) => setYearSelected(e.target.value)}/>
            </ContentHeader>

            <Filters>
                <button type='button' 
                    className={`tag-filter tag-filter-recurrent 
                        ${selectedFrequency.includes('recorrente') && 'tag-actived'}`}
                    onClick={() => handleFrequencyClick('recorrente')}>Recorrentes</button>
                <button type='button' 
                    onClick={() => handleFrequencyClick('eventual')}
                    className={`tag-filter tag-filter-eventual 
                        ${selectedFrequency.includes('recorrente') && 'tag-actived'}`}>Eventuais</button>
            </Filters>

            <Content>
                {
                    data.map(item => (
                        <HistoryFinanceCard 
                            key={item.id}
                            title={item.description} 
                            subtitle={item.dateFormatted} 
                            tagColor={item.tagColor}
                            amount={item.amountFormatted}
                        />
                    ))
                }
            </Content>
        </Container>
    );
}
export default List;