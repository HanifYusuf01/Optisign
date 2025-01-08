import { useRef} from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Box, Button, Text, Flex } from '@chakra-ui/react';
import PropTypes from "prop-types";


const SignaturePad = ({ onSave }) => {
  const signatureRef = useRef(null);

  const handleClear = () => {
    signatureRef.current.clear();
  };

  const handleSave = () => {
    const dataURL = signatureRef.current.getTrimmedCanvas().toDataURL("image/png");
    onSave(dataURL); // Pass the saved signature image to the parent component
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4} fontWeight="bold">Signature Pad</Text>
      <SignatureCanvas
        ref={signatureRef}
        penColor="blue"
        canvasProps={{ width: 500, height: 200, className: 'signature-canvas' }}
      />
      <Flex gap={2}>
        <Button mt={4} onClick={handleClear} bgColor="#00AEEF">Clear</Button>
        <Button mt={4} onClick={handleSave} bgColor="#00AEEF">Save Signature</Button>
      </Flex>
    </Box>
  );
};

SignaturePad.propTypes = {
  onSave: PropTypes.func.isRequired, // Ensure `onSave` is provided and is a function
};

export default SignaturePad;
