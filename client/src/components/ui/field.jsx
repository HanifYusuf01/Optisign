import { Field as ChakraField } from '@chakra-ui/react'
import * as React from 'react'
import PropTypes from 'prop-types';

export const Field = React.forwardRef(function Field(props, ref) {
  const { label, children, helperText, errorText, optionalText, ...rest } =
    props
  return (
    <ChakraField.Root ref={ref} {...rest}>
      {label && (
        <ChakraField.Label>
          {label}
          <ChakraField.RequiredIndicator fallback={optionalText} />
        </ChakraField.Label>
      )}
      {children}
      {helperText && (
        <ChakraField.HelperText>{helperText}</ChakraField.HelperText>
      )}
      {errorText && <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>}
    </ChakraField.Root>
  )
})


Field.propTypes = {
  label: PropTypes.node,
  children: PropTypes.node.isRequired,
  helperText: PropTypes.node,
  errorText: PropTypes.node,
  optionalText: PropTypes.node,
};
