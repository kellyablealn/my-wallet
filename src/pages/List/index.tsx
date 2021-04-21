import React, {useMemo} from 'react';

import ContentHeader from '../../components/ContentHeader';
import SelectInput from '../../components/SelectInput';
import HistoryFinanceCard from '../../components/HistoryFinanceCard';

import {Container, Content, Filters} from './styles';

interface IRouteParams {
    match: {
        params: {
            type: string;
        }
    }
}

const List: React.FC<IRouteParams> = ({match}) => {
    
    const {type} = match.params;

    const title = useMemo(() => {
        return type === 'entry-balance' 
            ? {title: 'Entradas', lineColor: '#F7931B'} 
            : {title: 'Saídas', lineColor: '#E44C4E'};
    }, [type]);

    const months = [
        {value: 7, label: 'Julho'},
        {value: 8, label: 'Agosto'},
        {value: 9, label: 'Setembro'}
    ];

    const years = [
        {value: 2021, label: 2021},
        {value: 2022, label: 2022},
        {value: 2023, label: 2023}
    ];

    return (
        <Container>
            <ContentHeader title={title.title} lineColor={title.lineColor}>
                <SelectInput options={months}/>
                <SelectInput options={years}/>
            </ContentHeader>

            <Filters>
                <button type='button' 
                    className='tag-filter tag-filter-recurrent'>Recorrentes</button>
                <button type='button' 
                    className='tag-filter tag-filter-eventual'>Eventuais</button>
            </Filters>

            <Content>
                <HistoryFinanceCard 
                    title='Conta de luz' 
                    subtitle='27/07/2020' 
                    tagColor='#E44C4E'
                    amount='R$ 130,00'
                />
            </Content>
        </Container>
    );
}
export default List;