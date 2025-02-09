import { useEffect, useState } from "react";
import { Box, Button, Text, VStack, Spinner, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";

// Set PDF worker source (use CDN for reliability)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const baseUrl = "http://100.24.4.111"; // Ensure this is correct

const AllDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [fileType, setFileType] = useState(""); // Track file type
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in.");
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiryTime = new Date(payload.exp * 1000);

      if (expiryTime < new Date()) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
    } catch (error) {
      alert("Invalid session. Please log in again.");
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

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
          throw new Error(
            `Failed to fetch documents. Status: ${response.status}`
          );
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
  }, [navigate]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Handle file selection based on type
  const handleViewDocument = async (doc) => {
    const fileUrl = `${baseUrl}/uploads/${doc.fileName}`; // Construct file URL
    console.log("🔗 Constructed File URL:", fileUrl);
    console.log("📂 Document File Path:", doc.filePath);
    console.log("📝 Document Content Type:", doc.contentType);
  
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image. Status: ${response.status}`);
      }
  
      const blob = await response.blob();
      console.log("🖼️ Blob:", blob); // Logs the raw image blob
  
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        console.log("📸 Base64 Image:", reader.result); // Logs the image as a Base64 string
      };
  
      if (doc.contentType.includes("pdf")) {
        setFileType("pdf");
        setSelectedDocument(fileUrl);
      } else if (doc.contentType.includes("image")) {
        setFileType("image");
        setSelectedDocument(fileUrl);
      } else {
        window.open(fileUrl, "_blank"); 
      }
    } catch (error) {
      console.error("🚨 Error loading image:", error);
    }
  };
  
  

  return (
    <Box p="6" maxWidth="800px" width="full" mx="auto">
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
                <Text fontSize="18px" fontWeight="bold">
                  {doc.fileName}
                </Text>
                <Text fontSize="14px" color="gray.600">
                  {doc.contentType}
                </Text>
                <Button
                  mt={5}
                  width="290px"
                  variant="outline"
                  borderRadius="md"
                  fontSize="16px"
                  bgColor="#00AEEF"
                  h="12"
                  onClick={() => handleViewDocument(doc)}
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

      <Button
        mt={5}
        width="100px"
        variant="outline"
        borderRadius="md"
        fontSize="16px"
        bgColor="#00AEEF"
        h="12"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      {/* PDF Viewer Modal */}
      {selectedDocument && fileType === "pdf" && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          backgroundColor="rgba(0,0,0,0.8)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="9999"
          onClick={() => setSelectedDocument(null)} // Click outside to close
        >
          <Box
            bg="white"
            p={5}
            borderRadius="md"
            maxWidth="850px"
            width="90%"
            onClick={(e) => e.stopPropagation()} // Prevent modal close on inside click
          >
            <Text fontSize="20px" fontWeight="bold" mb={4}>
              PDF Viewer
            </Text>

            <Document
              file={selectedDocument}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page
                pageNumber={pageNumber}
                width={750}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>

            {numPages > 1 && (
              <Box display="flex" justifyContent="center" mt={3} gap={4}>
                <Button
                  size="sm"
                  colorScheme="blue"
                  disabled={pageNumber <= 1}
                  onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
                >
                  Previous
                </Button>
                <Text>
                  Page {pageNumber} of {numPages}
                </Text>
                <Button
                  size="sm"
                  colorScheme="blue"
                  disabled={pageNumber >= numPages}
                  onClick={() =>
                    setPageNumber((prev) => Math.min(numPages, prev + 1))
                  }
                >
                  Next
                </Button>
              </Box>
            )}

            <Button
              mt={4}
              colorScheme="red"
              onClick={() => setSelectedDocument(null)}
            >
              Close Viewer
            </Button>
          </Box>
        </Box>
      )}

      {/* Image Viewer Modal */}
      {selectedDocument && fileType === "image" && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          backgroundColor="rgba(0,0,0,0.8)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="9999"
          onClick={() => setSelectedDocument(null)} // Click outside to close
        >
          <Box
            bg="white"
            p={5}
            borderRadius="md"
            maxWidth="850px"
            width="90%"
            textAlign="center"
            onClick={(e) => e.stopPropagation()} // Prevent modal close on inside click
          >
            <Text fontSize="20px" fontWeight="bold" mb={4}>
              Image Viewer
            </Text>

            <Image
              src={selectedDocument}
              alt="Document Preview"
              maxWidth="100%"
              maxHeight="500px"
            />

            <Button
              mt={5}
              width="200px"
              bgColor="red"
              onClick={() => setSelectedDocument(null)}
            >
              Close Viewer
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AllDocuments;
