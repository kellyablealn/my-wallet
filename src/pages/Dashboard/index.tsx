import React, {useState, useMemo} from 'react';

import ContentHeader from '../../components/ContentHeader';
import SelectInput from '../../components/SelectInput';
import WalletBox from '../../components/WalletBox';
import MessageBox from '../../components/MessageBox';
import PieChart from '../../components/PieChart';
import HistoryBox from '../../components/HistoryBox';
import BarChartBox from '../../components/BarChartBox';

import gains from '../../repositories/gains';
import expenses from '../../repositories/expenses';
import listOfMonths from '../../utils/months';

import happyImg from '../../assets/happy.svg';
import sadImg from '../../assets/sad.svg';
import grinningImg from '../../assets/grinning.svg';

import {Container, Content} from './styles';

const Dashboard: React.FC = () => {
    const [monthSelected, setMonthSelected] = useState<number>(new Date().getMonth() + 1);
    const [yearSelected, setYearSelected] = useState<number>(new Date().getFullYear());

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

        [...expenses, ...gains].forEach(item => {
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
    }, []);

    const totalGains = useMemo(() => {
        let total : number = 0;
        gains.forEach(item => {
            const date = new Date(item.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            if (month === monthSelected && year === yearSelected) {
                try {
                    total += Number(item.amount);
                } catch {
                    throw new Error('Invalid amount! Amount must be number.');
                }    
            }
        });

        return total;
    }, [monthSelected, yearSelected]);

    const totalExpenses = useMemo(() => {
        let total : number = 0;
        expenses.forEach(item => {
            const date = new Date(item.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            if (month === monthSelected && year === yearSelected) {
                try {
                    total += Number(item.amount);
                } catch {
                    throw new Error('Invalid amount! Amount must be number.');
                }    
            }
        });

        return total;
    }, [monthSelected, yearSelected]);

    const totalBalance = useMemo(() => {
        return totalGains - totalExpenses;
    }, [totalGains, totalExpenses]);

    const message = useMemo(() => {
        if (totalBalance < 0) {
            return {
                title: 'Que triste!',
                description: 'Neste mês, você gastou mais do que deveria.',
                footerText: 'Verifique seus gastos e tente cortar algumas coisas desnecessárias.',
                icon: sadImg
            }
        } else if (totalBalance === 0) {
            return {
                title: 'Uuuuufa!',
                description: 'Neste mês, você gastou exatamente o que ganhou.',
                footerText: 'Tome cuidado. No próximo mês tente poupar o seu dinheiro.',
                icon: grinningImg
            }
        } else {
            return {
                title: 'Muito bem!',
                description: 'Sua carteira está positiva.',
                footerText: 'Continue assim. Considere investir o seu saldo.',
                icon: happyImg
            }
        }
    }, [totalBalance]);

    const relationExpensesVersusGains = useMemo(() => {
        const total = totalGains + totalExpenses;

        const percentGains = (totalGains / total) * 100;
        const percentExpenses = (totalExpenses / total) * 100;
        
        const data = [
            {
                name: 'Entradas',
                value: totalGains,
                percent: Number(percentGains.toFixed(1)),
                color: '#E44C4E'
            },
            {
                name: 'Saídas',
                value: totalExpenses,
                percent: Number(percentExpenses.toFixed(1)),
                color: '#F7931B'
            }
        ];

        return data;
    }, [totalGains, totalExpenses]);

    const historyData = useMemo(() => {
        return listOfMonths.map((_, month) => {
            let amountEntry = 0;
            gains.forEach(gain => {
                const date = new Date(gain.date);
                const gainMonth = date.getMonth();
                const gainYear = date.getFullYear();

                if(gainMonth === month && gainYear === yearSelected) {
                    try {
                        amountEntry += Number(gain.amount);
                    } catch {
                        throw new Error('AmountEntry is invalid.');
                    }
                }
            });

            let amountOutput = 0;
            expenses.forEach(expense => {
                const date = new Date(expense.date);
                const expenseMonth = date.getMonth();
                const expenseYear = date.getFullYear();

                if(expenseMonth === month && expenseYear === yearSelected) {
                    try {
                        amountOutput += Number(expense.amount);
                    } catch {
                        throw new Error('AmountOutput is invalid.');
                    }
                }
            });

            return {
                monthNumber: month,
                month: listOfMonths[month].substring(0, 3),
                amountEntry,
                amountOutput
            }
        })
        .filter(item => {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();

            return ((yearSelected === currentYear && item.monthNumber <= currentMonth) 
                || yearSelected < currentYear);
        });

    }, [yearSelected]);

    const relationRecurrentExpensesVersusEventualExpenses = useMemo(() => {
        let amountRecurrent = 0;
        let amountEventual = 0;

        expenses.filter((expense) => {
            const date = new Date(expense.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            return month === monthSelected && year === yearSelected;
        })
        .forEach(expense => {
            if(expense.frequency === 'recorrente') {
                return amountRecurrent += Number(expense.amount);
            }
            if(expense.frequency === 'eventual') {
                return amountEventual += Number(expense.amount);
            }
        });
        const total = amountRecurrent + amountEventual;
        
        return [
            {
                name: 'Recorrentes',
                amount: amountRecurrent,
                percent: Number(((amountRecurrent/total) * 100).toFixed(1)),
                color: '#F7931B'
            },
            {
                name: 'Eventuais',
                amount: amountEventual,
                percent: Number(((amountEventual/total) * 100).toFixed(1)),
                color: '#E44C4E'
            }
        ]
    }, [monthSelected, yearSelected]);

    const relationRecurrentGainsVersusEventualGains = useMemo(() => {
        let amountRecurrent = 0;
        let amountEventual = 0;

        gains.filter((gain) => {
            const date = new Date(gain.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            return month === monthSelected && year === yearSelected;
        })
        .forEach(gain => {
            if(gain.frequency === 'recorrente') {
                return amountRecurrent += Number(gain.amount);
            }
            if(gain.frequency === 'eventual') {
                return amountEventual += Number(gain.amount);
            }
        });
        const total = amountRecurrent + amountEventual;
        
        return [
            {
                name: 'Recorrentes',
                amount: amountRecurrent,
                percent: Number(((amountRecurrent/total) * 100).toFixed(1)),
                color: '#F7931B'
            },
            {
                name: 'Eventuais',
                amount: amountEventual,
                percent: Number(((amountEventual/total) * 100).toFixed(1)),
                color: '#E44C4E'
            }
        ]
    }, [monthSelected, yearSelected]);

    const handleMonthSelected = (month: string) => {
        try {
            const parseMonth = Number(month);
            setMonthSelected(parseMonth);
        } catch {
            throw new Error('Invalid month selected. Accept 1 - 12');
        }
    }

    const handleYearSelected = (year: string) => {
        try {
            const parseYear = Number(year);
            setYearSelected(parseYear);
        } catch {
            throw new Error('Invalid year selected. Only positive integers accepted');
        }
    }
    
    return (
        <Container>
            <ContentHeader title='Dashboard' lineColor='#F7931B'>
                <SelectInput 
                    defaultValue={monthSelected}
                    options={months} 
                    onChange={(e) => handleMonthSelected(e.target.value)}/>
                <SelectInput 
                    defaultValue={yearSelected}
                    options={years} 
                    onChange={(e) => handleYearSelected(e.target.value)}/>
            </ContentHeader>
            <Content>
                <WalletBox
                    title='Saldo'
                    amount={totalBalance}
                    footerlabel='atualizado com base nas entradas e saídas'
                    icon='dollar'
                    color='#4E41F0'
                />
                <WalletBox
                    title='Entradas'
                    amount={totalGains}
                    footerlabel='atualizado com base nas entradas e saídas'
                    icon='arrowUp'
                    color='#F7931B'
                />
                <WalletBox
                    title='Saídas'
                    amount={totalExpenses}
                    footerlabel='atualizado com base nas entradas e saídas'
                    icon='arrowDown'
                    color='#E44C4E'
                />
                <MessageBox 
                    title={message.title}
                    description={message.description}
                    footerText={message.footerText}
                    icon={message.icon}/>
                <PieChart data={relationExpensesVersusGains}/>    
                <HistoryBox 
                    data={historyData} 
                    lineColorAmountEntry={'#F7931B'} 
                    lineColorAmoutOutput={'#E44C4E'}/>
                <BarChartBox 
                    title={'Saídas'} 
                    data={relationRecurrentExpensesVersusEventualExpenses}/>
                <BarChartBox 
                    title={'Entradas'} 
                    data={relationRecurrentGainsVersusEventualGains}/>                    
            </Content>
        </Container>
    );
}
export default Dashboard;