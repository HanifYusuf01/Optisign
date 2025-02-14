import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Image, Spinner, Text } from '@chakra-ui/react';

const baseUrl = "http://100.24.4.111"; // Ensure this is correct

const AllDocuments = () => {
  const location = useLocation();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/File/documents`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch documents. Status: ${response.status}`);
      }

      const data = await response.json();
      setDocuments(data);

      // Check for newly uploaded document after refresh
      if (location.state?.lastUploadedUrl) {
        const uploadedDoc = data.find(doc => doc.fileUrl === location.state.lastUploadedUrl);
        if (uploadedDoc) {
          console.log('Found uploaded document:', uploadedDoc);
        }
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [location.state?.refreshDocuments]); // Refresh when location state changes

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <Box p={4}>
      {documents.map((doc) => (
        <Box 
          key={doc.id} 
          mb={6} 
          p={4} 
          borderWidth="1px" 
          borderRadius="md"
          boxShadow="md"
        >
          {doc.contentType.startsWith('image/') ? (
            <Box 
              borderWidth="1px" 
              borderRadius="md" 
              overflow="hidden"
              maxW="100%"
              height="auto"
            >
              <Image 
                src={doc.fileUrl} 
                alt={doc.fileName} 
                objectFit="contain" 
                maxH="500px"
                width="100%"
                height="auto"
              />
            </Box>
          ) : doc.contentType === 'application/pdf' ? (
            <Box 
              position="relative" 
              height="600px" 
              width="100%" 
              borderWidth="1px"
              borderRadius="md"
              overflow="hidden"
            >
              <iframe 
                src={`${doc.fileUrl}#view=fitH`}
                title={doc.fileName}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
              />
              <Box 
                position="absolute" 
                bottom="0" 
                width="100%" 
                bg="rgba(0,0,0,0.7)" 
                p={2}
                textAlign="center"
              >
                <a 
                  href={doc.fileUrl} 
                  download 
                  style={{ color: 'white', textDecoration: 'underline' }}
                >
                  Download PDF
                </a>
              </Box>
            </Box>
          ) : (
            <Text>Unsupported file type: {doc.contentType}</Text>
          )}
          
          <Box mt={3}>
            <Text fontSize="lg" fontWeight="bold">
              {doc.fileName}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
            </Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default AllDocuments;