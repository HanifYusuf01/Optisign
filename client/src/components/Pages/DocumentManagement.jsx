import { Box, VStack, Text } from "@chakra-ui/react";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const DocumentManagement = () => {
 return (
   <Box display={'flex'} justifyContent={'center'} alignItems="center" h="100vh">
     <VStack  mx="20">
     <Link to='/upload'>
     <Box 
         borderRadius="3xl" 
         color="#00AEEF" 
         border="2px solid #00AEEF"
         p={4}
       >
         <MdOutlineFileUpload size={40}/>
       </Box>
     </Link>
       <Text fontSize="2xl" ml='8' mb='20'>Upload Document</Text>
       <Box 
         borderRadius="3xl" 
         color="#00AEEF" 
         border="2px solid #00AEEF"
         p={4}
       >
         <FaFileAlt size={40}/>
       </Box>
       <Text fontSize="2xl" pl='8'>Recieved Document</Text>
     </VStack>
   </Box>
 );
};

export default DocumentManagement;