import { useEffect, useState } from "react";
import { Box, VStack, Text, Spinner, Alert } from "@chakra-ui/react";

const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      console.log("Fetching users..."); 
      try {
        const response = await fetch("http://100.24.4.111/api/User/api/allUsers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch: ", response.status); 
          throw new Error("Failed to fetch users. Please log in.");
        }

        const data = await response.json();
        console.log("Fetched users: ", data); 
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users: ", error); 
        setError(error.message);
      } finally {
        console.log("Fetch operation complete");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box p={6}>
      <Text fontSize="24px" fontWeight="bold" mb={4}>All Users</Text>

      {loading ? (
        <Spinner size="lg" />
      ) : error ? (
        <Alert status="error">
          {/* <AlertIcon /> */}
          {error}
        </Alert>
      ) : (
        <VStack spacing={3} align="start">
          {users.map((user) => (
            <Box key={user.id} p={3} border="1px solid gray" borderRadius="md" width="full">
              <Text fontWeight="bold">{user.username}</Text>
              <Text>{user.email}</Text>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default AllUsersPage;
