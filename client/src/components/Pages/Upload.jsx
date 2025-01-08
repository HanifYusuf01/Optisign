import { useState } from "react";
import { Box, Button, Center, Text } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
// import { useUploadDocumentMutation } from "../../services/documentApi";
import { MdOutlineFileUpload } from "react-icons/md";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of Link
import PropTypes from "prop-types";

const Upload = () => {
  const [file, setFile] = useState(null);
  // const [uploadDocument] = useUploadDocumentMutation();
  const navigate = useNavigate(); // Initialize useNavigate

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const handleUpload = () => {
    if (!file) return;
    
    const document = {
      id: file.name,
      path: URL.createObjectURL(file),
      type: file.type, // Add this line
    };
    
    navigate('/viewer', { state: { document } });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={10} fontWeight="bold">Upload your document </Text>
      <Box
        {...getRootProps()}
        border="2px dashed"
        borderColor="#00AEEF"
        borderRadius="md"
        p={4}
        textAlign="center"
        cursor="pointer"
        color="#00AEEF" 
      >
        <input {...getInputProps()} />
        <Center flexDirection="column">
          <MdOutlineFileUpload size={40}/>
          <Text color="gray.500">Upload File</Text>
        </Center>
      </Box>
      
      {file && <Text mt={2} mb='10'>File: {file.name}</Text>}
      <Button mt={4} bg="#00AEEF" width="full" onClick={handleUpload} disabled={!file}>
        Upload
      </Button>
    </Box>
  );
};

Upload.propTypes = {
  navigateToViewer: PropTypes.func.isRequired, // This prop is no longer needed
};

export default Upload;