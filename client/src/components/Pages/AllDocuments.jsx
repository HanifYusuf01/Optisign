import { useEffect, useState } from "react";
import { Box, Button, Text, VStack, Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const AllDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // Retrieve token from localStorage
        const token = localStorage.getItem("token");
        console.log("Retrieved Token:", token);

        if (!token) {
          console.error("No token found.");
          alert("You must be logged in.");
          navigate("/login");
          return;
        }

        // Decode JWT token to check expiry
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiryTime = new Date(payload.exp * 1000);
        console.log("Token Expiry Time:", expiryTime);

        // Check if token is expired
        if (expiryTime < new Date()) {
          console.warn("Token has expired. Redirecting to login.");
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        // Fetch documents with Authorization header
        const response = await fetch("http://100.24.4.111/api/File/documents", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,  // Pass token correctly
            "Accept": "application/json",
          },
        });

        // Debugging headers
        console.log("Request Headers:", {
          "Authorization": `Bearer ${token}`,
        });

        if (!response.ok) {
          console.error("Error: Response not OK", response.status);
          throw new Error(`Failed to fetch documents. Status: ${response.status}`);
        }

        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <Box p="6" maxWidth="600px" width="full" mx="auto">
      <Text fontSize="24px" fontWeight="bold" textAlign="center" mb={4}>
        Uploaded Documents
      </Text>

      {loading ? (
        <Spinner size="lg" />
      ) : (
        <VStack spacing={3}>
          {documents.length > 0 ? (
            documents.map((doc) => (
              <Box key={doc.id} p={3} borderWidth={1} width="full">
                <Text fontSize="18px" fontWeight="bold">{doc.name}</Text>
                <Text fontSize="14px" color="gray.600">{doc.type}</Text>
                <Button
                  mt={2}
                  size="sm"
                  colorScheme="blue"
                  onClick={() => window.open(doc.path, "_blank")}
                >
                  View Document
                </Button>
              </Box>
            ))
          ) : (
            <Text>No documents found.</Text>
          )}
        </VStack>
      )}

      <Button mt={6} onClick={() => navigate(-1)}>
        Back
      </Button>
    </Box>
  );
};

export default AllDocuments;
