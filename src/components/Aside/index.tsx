import React, { useState } from 'react';
import {
    MdDashboard, 
    MdArrowDownward, 
    MdArrowUpward, 
    MdExitToApp,
    MdMenu,
    MdClose
} from 'react-icons/md';

import Toggle from '../Toggle';

import logoImg from '../../assets/logo.svg';

import {useTheme} from '../../hooks/theme';
import {useAuth} from '../../hooks/auth';

import { 
    Container, 
    Header, 
    LogImg, 
    Title, 
    MenuContainer, 
    MenuItemLink,
    MenuItemButton,
    ToggleMenu,
    ThemeToggleFooter
} from './styles';

const Aside: React.FC = () => {
    const {signOut} = useAuth();
    const {toggleTheme, theme} = useTheme();

    const [toggleMenuIsOpened, setToggleMenuIsOpened] = useState(true);
    const [darkTheme, setDarkTheme] = useState(()=> theme.title === 'dark' ? true : false);

    const handleToggleMenu = () => {
        setToggleMenuIsOpened(!toggleMenuIsOpened);
    }

    const handleChangeTheme = () => {
        setDarkTheme(!darkTheme);
        toggleTheme();
    }

    return (
        <Container menuIsOpen={toggleMenuIsOpened}>
            <Header>
                <ToggleMenu onClick={handleToggleMenu}>
                    {toggleMenuIsOpened ? <MdClose /> : <MdMenu />}
                </ToggleMenu>
                <LogImg src={logoImg} alt='Logo Minha Carteira'/>
                <Title>Minha Carteira</Title>
            </Header>
            <MenuContainer>
                <MenuItemLink href='/'>
                    <MdDashboard/> Dashboard
                </MenuItemLink>
                <MenuItemLink href='/list/entry-balance'>
                    <MdArrowUpward /> Entradas
                </MenuItemLink>
                <MenuItemLink href='/list/exit-balance'>
                    <MdArrowDownward /> Saídas
                </MenuItemLink>
                <MenuItemButton onClick={signOut}>
                    <MdExitToApp /> Sair
                </MenuItemButton>
            </MenuContainer>
            <ThemeToggleFooter menuIsOpen={toggleMenuIsOpened}>
                <Toggle 
                    labelRight='Dark' 
                    labelLeft='Light' 
                    checked={darkTheme}
                    onChange={handleChangeTheme}
                />
            </ThemeToggleFooter>
        </Container>
    );
}
export default Aside;