import { Box, VStack, Flex, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const AdminLandingPage = () => {
  const navigate = useNavigate();

  const handleGetDocuments = () => {
    navigate("/all-documents"); // Navigate to AllDocuments page
  };

  const handleGetUsers = () => {
    navigate("/all-users"); // Navigate to AllUsersPage
  };

  const handleSignOut = () => {
    navigate("/login"); // Navigate to Login page
  };

  return (
    <Flex height="100vh" width="100vw" align="center" justify="center">
      <Box p="6" maxWidth="400px" width="full">
        <VStack spacing={5} justifyContent="center" width="full">
          <Text fontSize="24px" fontWeight="bold" mb={4} textAlign="center">
            Admin Dashboard
          </Text>

          {/* Get Documents Button */}
          <Button
            width="290px"
            variant="outline"
            borderRadius="md"
            fontSize="16px"
            h="12"
            mt={4}
            onClick={handleGetDocuments}
          >
            Get Documents
          </Button>

          {/* Get Users Button */}
          <Button
            width="290px"
            variant="outline"
            borderRadius="md"
            fontSize="16px"
            h="12"
            mt={4}
            onClick={handleGetUsers} // Navigate to AllUsersPage
          >
            Get Users
          </Button>

          {/* Sign Out Button */}
          <Button
            width="290px"
            variant="outline"
            borderRadius="md"
            fontSize="16px"
            h="12"
            mt={4}
            onClick={handleSignOut} // Navigate to Login page
          >
            Sign Out
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default AdminLandingPage;
