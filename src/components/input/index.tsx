import React, {InputHTMLAttributes} from 'react';

import {Container} from './styles';

type IInputPropps = InputHTMLAttributes<HTMLInputElement>;

const Input: React.FC<IInputPropps> = ({...rest}) => (
    <Container {...rest}/>
);

export default Input;