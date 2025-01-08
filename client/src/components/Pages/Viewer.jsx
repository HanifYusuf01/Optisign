import { useState } from "react";
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { Document, Page } from "react-pdf";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import SignaturePad from "./SignaturePad";
import Draggable from "react-draggable";
import { pdfjs } from "react-pdf";

// Set worker URL to the local file
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
    setSignatureImage(dataURL); // Save the signature image
    setShowSignaturePad(false); // Hide the signature pad after saving
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatureImage(reader.result); // Set the signature image
      };
      reader.readAsDataURL(file);
    }
    setShowFileInput(false); // Hide the file input after selecting a file
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4} fontWeight="bold">
        Document Viewer
      </Text>

      <Box className="relative bg-gray-100 rounded-lg p-4">
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
          <Draggable>
            <img
              src={signatureImage}
              alt="Signature"
              className="absolute top-0 left-0 cursor-move"
              style={{
                width: "150px",
                height: "20px",
                border: "none",
              }}
            />
          </Draggable>
        )}
      </Box>

      <Flex mt={4} gap={4}>
        <Button onClick={() => setShowSignaturePad(true)} bgColor="#00AEEF" >
          Draw Your Signature
        </Button>
        <Button onClick={() => setShowFileInput(true)} bgColor="#00AEEF" >
          Upload Signature Image
        </Button>
      </Flex>

      {showSignaturePad && (
        <SignaturePad onSave={handleSaveSignature} />
      )}

      {showFileInput && (
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginTop: '20px' }}
        />
      )}

      {numPages > 1 && (
        <Flex justify="center" mt={4} gap={4}>
          <button
            onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
            disabled={pageNumber <= 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <Text>
            Page {pageNumber} of {numPages}
          </Text>
          <button
            onClick={() =>
              setPageNumber((prev) => Math.min(numPages, prev + 1))
            }
            disabled={pageNumber >= numPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </Flex>
      )}
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