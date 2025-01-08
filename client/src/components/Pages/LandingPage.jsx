import { Box, VStack } from "@chakra-ui/react";
import {Button} from "../ui/button"
import { Link } from "react-router-dom";
const LandingPage = () => {
  return (
<Box p='4'>
<VStack spacing={4} justifyContent="center">
    <Link to="/login">
    <Button
        bgColor="#00AEEF"
        fontSize="16px" 
        h="12" 
        width="290px" 
        borderRadius="md"
      >
        Sign In
      </Button>
    </Link>
    <Link to="/signup">
    <Button
        width="290px" 
        variant="outline"
        borderRadius="md"
        fontSize="16px" 
        h="12" 
      >
        Create account
      </Button>
    </Link>
    </VStack>
</Box>
  )
  ;
};

export default LandingPage;
