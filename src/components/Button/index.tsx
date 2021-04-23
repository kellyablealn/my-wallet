import React, {ButtonHTMLAttributes} from 'react';

import {Container} from './styles';

type IButtonPropps = ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<IButtonPropps> = ({children, ...rest}) => (
    <Container {...rest}>
        {children}
    </Container>
);

export default Button;  