import { Box, VStack, Text, Flex } from "@chakra-ui/react";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const DocumentManagement = () => {
  return (
    <Flex
      height="100vh"
      width="100vw"
      align="center"
      justify="center"
    >
      <VStack spacing={8} align="center" mx={4}>
        <Link to="/upload">
          <Box 
            borderRadius="3xl" 
            color="#00AEEF" 
            border="2px solid #00AEEF"
            p={4}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <MdOutlineFileUpload size={40} />
          </Box>
        </Link>
        <Text fontSize="2xl" textAlign="center">Upload Document</Text>

        <Box 
          borderRadius="3xl" 
          color="#00AEEF" 
          border="2px solid #00AEEF"
          p={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <FaFileAlt size={40} />
        </Box>
        <Text fontSize="2xl" textAlign="center">Received Document</Text>
      </VStack>
    </Flex>
  );
};

export default DocumentManagement;
