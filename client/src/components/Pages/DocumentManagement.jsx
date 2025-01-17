import { Box, VStack, Text } from "@chakra-ui/react";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const DocumentManagement = () => {
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
      <VStack spacing={4} align="center">
        <VStack spacing={2} align="center" mb={8}>
          <Link to='/upload'>
            <Box 
              borderRadius="3xl" 
              color="#00AEEF" 
              border="2px solid #00AEEF"
              p={4}
              display="flex"
              alignItems="center"
              justifyContent="center"
              _hover={{
                backgroundColor: "rgba(0, 174, 239, 0.1)"
              }}
            >
              <MdOutlineFileUpload size={40}/>
            </Box>
          </Link>
          <Text fontSize="2xl">Upload Document</Text>
        </VStack>

        <VStack spacing={2} align="center">
          <Box 
            borderRadius="3xl" 
            color="#00AEEF" 
            border="2px solid #00AEEF"
            p={4}
            display="flex"
            alignItems="center"
            justifyContent="center"
            _hover={{
              backgroundColor: "rgba(0, 174, 239, 0.1)"
            }}
          >
            <FaFileAlt size={40}/>
          </Box>
          <Text fontSize="2xl">Received Document</Text>
        </VStack>
      </VStack>
    </Box>
  );
};

export default DocumentManagement;