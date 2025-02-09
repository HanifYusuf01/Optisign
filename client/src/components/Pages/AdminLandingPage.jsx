import { Box, VStack, Flex, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const AdminLandingPage = () => {
  return (
    <Flex height="100vh" width="100vw" align="center" justify="center">
      <Box p="6" maxWidth="400px" width="full">
        <VStack spacing={5} justifyContent="center" width="full">
          <Text fontSize="24px" fontWeight="bold" mb={4} textAlign="center">
            Admin Dashboard
          </Text>

          {/* Additional 'Get Document' Button */}
          <Link to="/all-users">
            <Button
              width="290px"
              variant="outline"
              borderRadius="md"
              fontSize="16px"
              bgColor="#00AEEF"
              h="12"
              mt={4}
              text="white"
            >
              Get Document
            </Button>
          </Link>

          {/* SignOut Button */}
          <Link to="/login">
            <Button
              width="290px"
              variant="outline"
              borderRadius="md"
              fontSize="16px"
              bgColor="#00AEEF"
              h="12"
              mt={4}
              text="white"
            >
              Sign Out
            </Button>
          </Link>
        </VStack>
      </Box>
    </Flex>
  );
};

export default AdminLandingPage;
