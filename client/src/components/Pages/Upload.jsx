import { useState } from "react";
import { Box, Button, Text, Flex } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { MdOutlineFileUpload } from "react-icons/md";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of Link

const Upload = () => {
  const [file, setFile] = useState(null);
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
    <Flex
      height="100vh"
      width="100vw"
      align="center"
      justify="center"
      bg="gray.50"
    >
      <Box p={4} width="90%" maxWidth="500px">
        <Text fontSize="2xl" mb={10} fontWeight="bold" textAlign="center">Upload your document</Text>
        
        <Box
          {...getRootProps()}
          border="2px dashed"
          borderColor="#00AEEF"
          borderRadius="md"
          p={4}
          textAlign="center"
          cursor="pointer"
          color="#00AEEF"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <input {...getInputProps()} />
          <MdOutlineFileUpload size={40} />
          <Text color="gray.500">Upload File</Text>
        </Box>
        
        {file && <Text mt={2} mb="10" textAlign="center">File: {file.name}</Text>}
        
        <Button 
          mt={4} 
          bg="#00AEEF" 
          width="full" 
          onClick={handleUpload} 
          disabled={!file}
          textAlign="center"
        >
          Upload
        </Button>
      </Box>
    </Flex>
  );
};

export default Upload;
