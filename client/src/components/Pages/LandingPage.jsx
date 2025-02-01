import { Box, VStack, Flex } from "@chakra-ui/react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
const LandingPage = () => {
  return (
    <Flex height="100vh"
    width="100vw"
    align="center"
    justify="center">
      <Box p="6">
        <VStack spacing={5} justifyContent="center">
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
    </Flex>
  );
};

export default LandingPage;
