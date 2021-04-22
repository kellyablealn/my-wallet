import React, {useMemo, useState, useEffect} from 'react';
import {uuid} from 'uuidv4';

import ContentHeader from '../../components/ContentHeader';
import SelectInput from '../../components/SelectInput';
import HistoryFinanceCard from '../../components/HistoryFinanceCard';

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
    const [monthSelected, setMonthSelected] = useState<number>(new Date().getMonth() + 1);
    const [yearSelected, setYearSelected] = useState<number>(new Date().getFullYear());

    const [frequencyFilterSelected, setFrequencyFilterSelected] = 
        useState<string[]>(['recorrente', 'eventual']);
    
    const movimentType = match.params.type;

    const pageData = useMemo(() => {
        return movimentType === 'entry-balance' ? 
        {
            title: 'Entradas',
            lineColor: '#4E41EF',
            data: gains
        } :
        {
            title: 'Saídas',
            lineColor: '#E44C4E',
            data: expenses
        }
    }, [movimentType]);

    const months = useMemo(() => {
        return listOfMonths.map((month, index) => (
            {
                value: index + 1,
                label: month
            }
        ));
    }, []);

    const years = useMemo(() => {     
        let uniqueYears: number[] = [];

        pageData.data.forEach(item => {
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
    }, [pageData.data]);

    const handleFrequencyClick = (frequency: string) => {
        const alreadySelected = frequencyFilterSelected.findIndex(item => item === frequency);

        if (alreadySelected >= 0) {
            const filtered = frequencyFilterSelected.filter(item => item !== frequency);
            setFrequencyFilterSelected(filtered);
        } else {
            setFrequencyFilterSelected((prev) => [...prev, frequency]);
        }
    }

    const handleMonthSelected = (month: string) => {
        try {
            const parseMonth = Number(month);
            setMonthSelected(parseMonth);
        } catch (err) {
            throw new Error('Invalid month selected. Accept 1 - 12');
        }
    }

    const handleYearSelected = (year: string) => {
        try {
            const parseYear = Number(year);
            setYearSelected(parseYear);
        } catch (err) {
            throw new Error('Invalid year selected. Only positive integers accepted');
        }
    }

    useEffect(() => {

        const filteredDate = pageData.data.filter(item => {
            const date = new Date(item.date);
            
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            return month === monthSelected 
                && year === yearSelected
                && frequencyFilterSelected.includes(item.frequency);
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

    }, [pageData.data, monthSelected, yearSelected, data.length, frequencyFilterSelected]);

    return (
        <Container>
            <ContentHeader title={pageData.title} lineColor={pageData.lineColor}>
                <SelectInput 
                    defaultValue={monthSelected}
                    options={months} 
                    onChange={(e) => handleMonthSelected(e.target.value)}/>
                <SelectInput 
                    defaultValue={yearSelected}
                    options={years} 
                    onChange={(e) => handleYearSelected(e.target.value)}/>
            </ContentHeader>

            <Filters>
                <button type='button' 
                    className={`tag-filter tag-filter-recurrent 
                        ${frequencyFilterSelected.includes('recorrente') && 'tag-actived'}`}
                    onClick={() => handleFrequencyClick('recorrente')}>Recorrentes</button>
                <button type='button' 
                    onClick={() => handleFrequencyClick('eventual')}
                    className={`tag-filter tag-filter-eventual 
                        ${frequencyFilterSelected.includes('recorrente') && 'tag-actived'}`}>Eventuais</button>
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