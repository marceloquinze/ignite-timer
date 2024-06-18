import styled, { css } from "styled-components";

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success'
interface ButtonContainerProps {
	variant: ButtonVariant
}

// Esse componente é um elemento button com a interface ButtonContainerProps como seu tipo de propriedades.
export const ButtonContainer = styled.button<ButtonContainerProps>`
	width: 100px;
	height: 30px;

	${
		// O código aqui dentro é executado como uma função arrow
		// props representa as propriedades do componente Button (ex.: variant, etc)
		props => {
			// props.variant também vem do componente Button
			return css`
				background-color: ${ButtonVariants[props.variant]}
			`
			// Note que isso aqui tem que retornar red, blue etc
			// ${ButtonVariants[props.variant]}
			// por isso o formato de array. É pra usar como chave e retornar o valor
		}

	}
`

const ButtonVariants = {
	primary: 'red',
	secondary: 'blue',
	danger: 'green',
	success: 'yellow'
}