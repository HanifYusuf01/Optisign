import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text, Spinner, IconButton } from "@chakra-ui/react";
import { BiTrash } from "react-icons/bi";
import "../../styling/users.css";

const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      console.log("Fetching users...");

      const getTokenData = (token) => {
        try {
          if (!token) return null;

          const parts = token.split(".");
          if (parts.length !== 3) {
            return null;
          }

          const payload = JSON.parse(atob(parts[1]));
          return payload;
        } catch (error) {
          console.error("Error decoding token:", error);
          return null;
        }
      };

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const tokenData = getTokenData(token);

      if (!tokenData) {
        alert("Invalid session. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const expiryTime = new Date(tokenData.exp * 1000);
      console.log("Token Expiry Time:", expiryTime);

      if (expiryTime < new Date()) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      console.log("Sending Request with Headers:", {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      });

      try {
        const response = await fetch("http://100.24.4.111/api/User/api/allUsers", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch users. Status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
        window.alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  // Function to delete a user
  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`http://100.24.4.111/api/User/api/deleteUser/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete user. Status: ${response.status}`);
      }

      // Remove the user from the state
      setUsers(users.filter((user) => user.id !== userId));
      alert("User deleted successfully.");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Box p={6} bg="gray.50" minH="100vh" w="100vw" maxW="100vw">
      {/* Page Header */}
      <Flex justify="center" mb={6}>
        <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="blue.600">
          USERS DETAILS
        </Text>
      </Flex>

      {/* Conditional Rendering for Loading, Error & No Users */}
      {loading ? (
        <Flex justify="center">
          <Spinner size="xl" />
        </Flex>
      ) : error ? (
        <Flex justify="center">
          <Text fontSize="lg" color="red.500" fontWeight="bold">
            Error: {error}
          </Text>
        </Flex>
      ) : users.length === 0 ? (
        <Flex justify="center">
          <Text fontSize="lg" color="gray.500">
            No users found.
          </Text>
        </Flex>
      ) : (
        <Box bg="white" boxShadow="lg" borderRadius="md" overflowX="auto" p={4}>
          {/* Custom Styled Table */}
          <table className="user-table">
            {/* Table Head */}
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td className="bold">{user.username}</td>
                  <td>{user.email}</td>
                  <td className="role">{user.role}</td>
                  <td style={{display:"flex", alignItems:"center", gap:"0.3rem"}}> Delete
                    <BiTrash
                      aria-label="Delete user"
                      // icon={<FaTrash />}
                      colorScheme="red"
                      size={18}
                      style={{ cursor: "pointer", color: "red" }}
                      onClick={() => handleDeleteUser(user.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      )}
    </Box>
  );
};

export default AllUsersPage;
