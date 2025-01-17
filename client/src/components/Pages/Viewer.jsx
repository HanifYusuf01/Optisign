import { useState } from "react";
import { Box, Text, Flex, Button, VStack } from "@chakra-ui/react";
import { Document, Page } from "react-pdf";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import SignaturePad from "./SignaturePad";
import Draggable from "react-draggable";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `${import.meta.env.BASE_URL}pdf.worker.min.mjs`;

const Viewer = () => {
  const location = useLocation();
  const { document } = location.state;
  const [signatureImage, setSignatureImage] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [showFileInput, setShowFileInput] = useState(false);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleSaveSignature = (dataURL) => {
    setSignatureImage(dataURL);
    setShowSignaturePad(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatureImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    setShowFileInput(false);
  };

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="white"
      overflow="auto"
      py={6}
    >
      <VStack
        maxW="900px"
        mx="auto"
        spacing={6}
        align="stretch"
        px={4}
      >
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          Document Viewer
        </Text>

        <Box
          bg="gray.50"
          borderRadius="lg"
          p={6}
          position="relative"
          boxShadow="sm"
        >
          <Document
            file={document.path}
            onLoadSuccess={onDocumentLoadSuccess}
            className="w-full"
          >
            <Page
              pageNumber={pageNumber}
              width={800}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>

          {signatureImage && (
            <Draggable bounds="parent">
              <img
                src={signatureImage}
                alt="Signature"
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "150px",
                  height: "20px",
                  cursor: "move",
                  userSelect: "none"
                }}
              />
            </Draggable>
          )}
        </Box>

        <Flex justify="center" gap={4}>
          <Button
            onClick={() => setShowSignaturePad(true)}
            bgColor="#00AEEF"
            color="white"
            h="12"
            _hover={{ bg: "#0089BC" }}
          >
            Draw Your Signature
          </Button>
          <Button
            onClick={() => setShowFileInput(true)}
            bgColor="#00AEEF"
            color="white"
            h="12"
            _hover={{ bg: "#0089BC" }}
          >
            Upload Signature Image
          </Button>
        </Flex>

        {showSignaturePad && (
          <Box mt={4}>
            <SignaturePad onSave={handleSaveSignature} />
          </Box>
        )}

        {showFileInput && (
          <Box mt={4}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ width: '100%' }}
            />
          </Box>
        )}

        {numPages > 1 && (
          <Flex justify="center" align="center" gap={4}>
            <Button
              onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
              disabled={pageNumber <= 1}
              bg={pageNumber <= 1 ? "gray.300" : "#00AEEF"}
              color="white"
              _hover={{ bg: pageNumber <= 1 ? "gray.300" : "#0089BC" }}
            >
              Previous
            </Button>
            <Text>
              Page {pageNumber} of {numPages}
            </Text>
            <Button
              onClick={() => setPageNumber((prev) => Math.min(numPages, prev + 1))}
              disabled={pageNumber >= numPages}
              bg={pageNumber >= numPages ? "gray.300" : "#00AEEF"}
              color="white"
              _hover={{ bg: pageNumber >= numPages ? "gray.300" : "#0089BC" }}
            >
              Next
            </Button>
          </Flex>
        )}
      </VStack>
    </Box>
  );
};

Viewer.propTypes = {
  document: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    path: PropTypes.string.isRequired,
    type: PropTypes.string,
  }).isRequired,
};

export default Viewer;