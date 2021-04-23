import React, {useState} from 'react';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/input';
import Button from '../../components/Button';

import {useAuth} from '../../hooks/auth';

import {Container, Logo, Form, FormTitle} from './styles';

const SignIn: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const {signIn} = useAuth();

    return (
        <Container>
            <Logo>
                <img src={logoImg} alt='Minha Carteira'/>
                <h2>Minha Carteira</h2>
            </Logo>
            <Form onSubmit={() => signIn(email, password)}>
                <FormTitle>Entrar</FormTitle>
                <Input 
                    type='email'
                    placeholder='email'
                    onChange={e => setEmail(e.target.value)}
                    required/>
                <Input 
                    placeholder='senha'
                    onChange={e => setPassword(e.target.value)}
                    type='password'
                    required/>

                <Button type='submit'>Acessar</Button>
            </Form>
        </Container>
    );
}
export default SignIn;