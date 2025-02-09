import { useState, useRef } from "react";
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { Document, Page } from "react-pdf";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import SignaturePad from "./SignaturePad";
import Draggable from "react-draggable";
import { pdfjs } from "react-pdf";
import { showToast } from "../toastUtils";

const baseUrl = "http://100.24.4.111";

// Set worker URL to the local file
pdfjs.GlobalWorkerOptions.workerSrc = `${
  import.meta.env.BASE_URL
}pdf.worker.min.mjs`;

const Viewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { document: documentProp } = location.state || {};
  if (!documentProp || !documentProp.path) {
    console.error("Document path is missing");
  }
  const [signatureImage, setSignatureImage] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [showFileInput, setShowFileInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [signaturePosition, setSignaturePosition] = useState({ x: 0, y: 0 });

  // Refs for DOM elements
  const pdfRef = useRef(null);
  const signatureRef = useRef(null);
  const containerRef = useRef(null);

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

  const handleDragStop = (e, data) => {
    setSignaturePosition({ x: data.x, y: data.y });
  };

  const uploadSignedDocument = async () => {
    if (!signatureImage) {
      showToast("Please add a signature before saving", "error");
      return;
    }

    setIsUploading(true);
 const userEmail = localStorage.getItem("userEmail");
    try {
      const canvas = window.document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Get the PDF page element using ref
      const pdfPage = pdfRef.current.querySelector(".react-pdf__Page");
      if (!pdfPage) {
        throw new Error("PDF page not found");
      }

      // Set canvas dimensions to match PDF page
      canvas.width = pdfPage.offsetWidth;
      canvas.height = pdfPage.offsetHeight;

      // Draw PDF page
      const pdfCanvas = pdfPage.querySelector("canvas");
      if (!pdfCanvas) {
        throw new Error("PDF canvas not found");
      }
      context.drawImage(pdfCanvas, 0, 0);

      // Draw signature at its position
      const signatureImg = new Image();
      signatureImg.src = signatureImage;

      await new Promise((resolve, reject) => {
        signatureImg.onload = resolve;
        signatureImg.onerror = reject;
      });

      context.drawImage(
        signatureImg,
        signaturePosition.x,
        signaturePosition.y,
        150,
        20
      );

      // Convert canvas to blob
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      const signedDoc = new File([blob], "signed-document.png", {
        type: "image/png",
      });

      // Upload to server
      const formData = new FormData();
      formData.append("userEmail", userEmail);
      formData.append("file", signedDoc);

      const token = localStorage.getItem("token");
      if (token) {
        const [, payloadBase64] = token.split(".");

        const decodedPayload = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
        const payload = JSON.parse(decodedPayload); // Keep only one declaration
        
        const now = Math.floor(Date.now() / 1000);
        
        if (payload.exp && payload.exp < now) {
          console.error("Token has expired!");
        } else {
          console.log("Token is valid.");
        }
      }

      if (!token) {
        console.error("No auth token found in localStorage");
        return;
      }

      const response = await fetch(`${baseUrl}/api/File/upload`, {
        method: "POST",
        headers: {
          accept: "*/*",
         "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      await response.json();

      showToast("Document saved successfully", "success");
      navigate("/");
    } catch (error) {
      console.error("Error saving document:", error);
      showToast(error.message, "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4} fontWeight="bold">
        Document Viewer
      </Text>

      <Box className="relative bg-gray-100 rounded-lg p-4" ref={containerRef}>
        <div ref={pdfRef}>
          <Document
            file={documentProp.path}
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
        </div>

        {signatureImage && (
          <Draggable onStop={handleDragStop} nodeRef={signatureRef}>
            <img
              ref={signatureRef}
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
        <Button onClick={() => setShowSignaturePad(true)} bgColor="#00AEEF">
          Draw Your Signature
        </Button>
        <Button onClick={() => setShowFileInput(true)} bgColor="#00AEEF">
          Upload Signature Image
        </Button>
        <Button
          onClick={uploadSignedDocument}
          bgColor="#00AEEF"
          isLoading={isUploading}
          loadingText="Saving..."
          disabled={!signatureImage || isUploading}
        >
          Save Signed Document
        </Button>
      </Flex>

      {showSignaturePad && <SignaturePad onSave={handleSaveSignature} />}

      {showFileInput && (
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginTop: "20px" }}
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
