import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Text, Button, Spinner } from "@chakra-ui/react";
import { baseUrl } from "../../api/config";
import PropTypes from "prop-types";

const Received = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSharedDocuments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${baseUrl}/api/File/shared-with-me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error("Failed to fetch documents");
        
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedDocuments();
  }, []);

  const handleSignDocument = (sharedDocument) => {
    navigate("/viewer", {
      state: {
        isSharedDocument: true,
        sharedDocId: sharedDocument.id,
        document: {
          id: sharedDocument.documentId,
          path: sharedDocument.fileUrl,
          fileName: sharedDocument.fileName
        }
      }
    });
  };

  if (loading) return <Spinner size="xl" />;

  return (
    <Box p={4}>
      <Text fontSize="xl" mb={4}>Documents Shared With You</Text>
      
      {documents.length === 0 ? (
        <Text>No documents available</Text>
      ) : (
        documents.map((doc) => (
          <Box key={doc.id} mb={4} p={4} border="1px solid gray" borderRadius="md">
            <Text fontSize="lg" fontWeight="bold">{doc.fileName}</Text>
            <Text fontSize="sm" color="gray.500">From: {doc.senderEmail}</Text>
            <Text fontSize="sm" color="gray.500">
              Shared on: {new Date(doc.sharedDate).toLocaleDateString()}
            </Text>
            
            <Button
              mt={2}
              colorScheme="blue"
              onClick={() => handleSignDocument(doc)}
            >
              Review and Sign
            </Button>
          </Box>
        ))
      )}
    </Box>
  );
};
Received.propTypes = {
    email: PropTypes.string.isRequired,
  };
export default Received;
