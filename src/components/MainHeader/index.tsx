import React, {useMemo, useState} from 'react';
import { Container, Profile, Welcome, UserName } from './styles';

import Toggle from '../Toggle';
import {emojis} from '../../utils/emojis';

import {useTheme} from '../../hooks/theme';

const MainHeader: React.FC = () => {

    const {toggleTheme, theme} = useTheme();

    const [darkTheme, setDarkTheme] = useState(() => theme.title === 'dark' ? true : false);

    const handleChangeTheme = () => {
        setDarkTheme(!darkTheme);
        toggleTheme();
    }

    const emoji = useMemo(() => {
        const index = Math.floor(Math.random() * emojis.length);
        return emojis[index];
    }, []);

    return (
        <Container>
            <Toggle 
                labelRight='Dark' 
                labelLeft='Light' 
                checked={darkTheme}
                onChange={handleChangeTheme}
            />
            <Profile>
                <Welcome>Olá, {emoji}</Welcome>
                <UserName>Kelly Neves</UserName>
            </Profile>
        </Container>
    );
}

export default MainHeader;