import { useState } from "react";
import { Box, Button, Center, Text } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { MdOutlineFileUpload } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Upload = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const handleUpload = () => {
    if (!file) return;
    
    const document = {
      id: file.name,
      path: URL.createObjectURL(file),
      type: file.type,
    };
    
    navigate('/viewer', { state: { document } });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="white"
    >
      <Box
        w="100%"
        maxW="500px"
        p={6}
      >
        <Text 
          fontSize="2xl" 
          mb={8} 
          fontWeight="bold"
          textAlign="center"
        >
          Upload your document
        </Text>

        <Box
          {...getRootProps()}
          border="2px dashed"
          borderColor="#00AEEF"
          borderRadius="md"
          p={8}
          textAlign="center"
          cursor="pointer"
          color="#00AEEF"
          transition="all 0.2s"
          _hover={{
            borderColor: "#0089BC",
            bg: "rgba(0, 174, 239, 0.05)"
          }}
        >
          <input {...getInputProps()} />
          <Center flexDirection="column" gap={3}>
            <MdOutlineFileUpload size={50}/>
            <Text color="gray.500">
              Drag and drop your file here, or click to select
            </Text>
          </Center>
        </Box>
        
        {file && (
          <Box mt={4} p={3} bg="gray.50" borderRadius="md">
            <Text color="gray.700">Selected file: {file.name}</Text>
          </Box>
        )}

        <Button
          mt={6}
          bg="#00AEEF"
          width="100%"
          onClick={handleUpload}
          disabled={!file}
          color="white"
          h="12"
          _hover={{
            bg: "#0089BC"
          }}
        >
          Upload
        </Button>
      </Box>
    </Box>
  );
};

Upload.propTypes = {
  navigateToViewer: PropTypes.func.isRequired,
};

export default Upload;