import { useState, useRef } from "react";
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { Document, Page } from "react-pdf";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import SignaturePad from "./SignaturePad";
import { useDraggable } from "@dnd-kit/core";
import { pdfjs } from "react-pdf";
import { showToast } from "../toastUtils";
import { PDFDocument } from "pdf-lib";
import {useDroppable} from '@dnd-kit/core';

const baseUrl = "http://100.24.4.111";

pdfjs.GlobalWorkerOptions.workerSrc = `${
  import.meta.env.BASE_URL
}pdf.worker.min.mjs`;

const Viewer3 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { document: documentProp } = location.state || {};
  if (!documentProp || !documentProp.path) {
    console.error("Document path is missing");
  }

  // Existing state
  const [signatureImage, setSignatureImage] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [showFileInput, setShowFileInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [signaturePositions, setSignaturePositions] = useState({});
  const [pageDimensions, setPageDimensions] = useState({});
  const [recipientEmail, setRecipientEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "draggable",
  });
  const setDroppableRef = useDroppable({
    id: 'droppable',
  });
  
  console.log(setDroppableRef)

  // Refs for DOM elements
  const pdfRef = useRef(null);
  const signatureRef = useRef(null);
  const containerRef = useRef(null);

  // Existing functions remain the same...
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
    const currentPage = pageDimensions[pageNumber];
    console.log("pageDimensions:", pageDimensions);
    if (!currentPage) return;

    const viewerElement = pdfRef.current?.querySelector(".react-pdf__Page");
    if (!viewerElement) return;

    const viewerRect = viewerElement.getBoundingClientRect();
    const signatureHeight = 200;
    console.log("data:", data);
    console.log("viewerRect:", viewerRect);
    const xPercent = (data.x / viewerRect.width) * 100;
    const yPercent = (data.y / viewerRect.height) * 100;
    console.log("xPercent:", xPercent);
    console.log("yPercent:", yPercent);
    const pdfX = (currentPage.originalWidth * xPercent) / 100;
    const pdfY =
      currentPage.originalHeight -
      (currentPage.originalHeight * yPercent) / 100 -
      signatureHeight;

    setSignaturePositions((prev) => ({
      ...prev,
      [pageNumber]: { x: pdfX, y: pdfY },
    }));
  };

  // New function to generate signed PDF
  const generateSignedPDF = async () => {
    if (!signatureImage) {
      showToast("Please add a signature before proceeding", "error");
      return null;
    }

    try {
      const response = await fetch(documentProp.path);
      const existingPdfBytes = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      const signatureBase64 = signatureImage.split(",")[1];
      const signatureBytes = Uint8Array.from(atob(signatureBase64), (c) =>
        c.charCodeAt(0)
      );
      console.log(signatureBytes);
      console.log(signatureImage);
      const embeddedImage = await pdfDoc.embedPng(signatureImage);

      const pages = pdfDoc.getPages();
      // pages[0].drawImage(embeddedImage, {
      //   x: 25,
      //   y: 25,
      //   width: 150,
      //   height: 50,
      //   opacity: 1,
      // });

      // pages[0].drawText("You can modify PDFs too!");
      pages.forEach((page, index) => {
        const pageNum = index + 1;
        const position = signaturePositions[pageNum];

        if (position) {
          console.log(position, signaturePositions, pageNum);
          console.log(page.getSize());
          page.drawImage(embeddedImage, {
            x: position.x,
            y: position.y / 1.5,
            width: 100,
            height: 30,
            opacity: 1,
          });
        }
      });

      return await pdfDoc.save({
        useObjectStreams: false,
        addDefaultPage: false,
        preservePDFForm: true,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      showToast("Error generating signed PDF", "error");
      return null;
    }
  };

  // New function to download signed PDF
  const downloadSignedPDF = async () => {
    const pdfBytes = await generateSignedPDF();
    if (!pdfBytes) return;

    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "signed-document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Updated upload function to include sending to recipient
  const uploadSignedDocument = async (shouldSendToRecipient = false) => {
    if (shouldSendToRecipient && !recipientEmail) {
      showToast("Please enter recipient email", "error");
      return;
    }

    setIsUploading(true);
    try {
      const pdfBytes = await generateSignedPDF();
      if (!pdfBytes) return;

      const signedFile = new File([pdfBytes], "signed-document.pdf", {
        type: "application/pdf",
        lastModified: new Date().getTime(),
      });

      const formData = new FormData();
      formData.append("file", signedFile);
      formData.append("userEmail", localStorage.getItem("userEmail"));
      if (shouldSendToRecipient) {
        formData.append("recipientEmail", recipientEmail);
      }

      const token = localStorage.getItem("token");
      const endpoint = `${baseUrl}/api/File/upload`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Operation failed");
      const response = await res.json();

      showToast("Document saved!", "success");
      if (!shouldSendToRecipient) {
        navigate("/", {
          state: {
            refreshDocuments: true,
            lastUploadedUrl: response.fileUrl,
          },
        });
      }
    } catch (error) {
      console.error("Error:", error);
      showToast(error.message, "error");
    } finally {
      setIsUploading(false);
      setShowEmailInput(false);
    }
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4} fontWeight="bold">
        Document Viewer
      </Text>

      {/* Existing PDF viewer code remains the same... */}
      <Box className="relative bg-gray-100 rounded-lg p-4" ref={containerRef}>
        <div ref={pdfRef} >
            <Box ref={setDroppableRef.setNodeRef}>
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
              onLoadSuccess={(page) => {
                const pdfPageElement =
                  pdfRef.current.querySelector(".react-pdf__Page");
                if (pdfPageElement) {
                  setPageDimensions((prev) => ({
                    ...prev,
                    [pageNumber]: {
                      originalWidth: /* 612 */ page.width,
                      originalHeight: /* 792*/ page.height,
                      renderedWidth: pdfPageElement.offsetWidth,
                      renderedHeight: pdfPageElement.offsetHeight,
                    },
                  }));
                }
              }}
            />
          </Document>
            </Box>
     
        </div>

        {signatureImage && (
          <Box ref={setNodeRef}  {...listeners} {...attributes}>
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
          </Box>
        )}
      </Box>

      {/* Updated buttons section */}
      <Flex mt={4} gap={4} flexWrap="wrap">
        <Button onClick={() => setShowSignaturePad(true)} bgColor="#00AEEF">
          Draw Your Signature
        </Button>
        <Button onClick={() => setShowFileInput(true)} bgColor="#00AEEF">
          Upload Signature Image
        </Button>
        <Button
          onClick={() => uploadSignedDocument(false)}
          bgColor="#00AEEF"
          isLoading={isUploading}
          loadingText="Saving..."
          disabled={!signatureImage || isUploading}
        >
          Save Signed Document
        </Button>
        <Button
          onClick={downloadSignedPDF}
          bgColor="#00AEEF"
          disabled={!signatureImage || isUploading}
        >
          Download Signed PDF
        </Button>
      </Flex>

      {/* Email input section */}
      {showEmailInput && (
        <Box mt={4}>
          <input
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="Enter recipient's email"
            className="border p-2 mr-2 rounded"
          />
          <Button
            onClick={() => uploadSignedDocument(true)}
            bgColor="#00AEEF"
            isLoading={isUploading}
            loadingText="Sending..."
            disabled={!recipientEmail || isUploading}
          >
            Send
          </Button>
        </Box>
      )}

      {/* Existing signature pad and file input sections */}
      {showSignaturePad && <SignaturePad onSave={handleSaveSignature} />}

      {showFileInput && (
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginTop: "20px" }}
        />
      )}

      {/* Existing pagination section */}
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

Viewer3.propTypes = {
  document: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    path: PropTypes.string.isRequired,
    type: PropTypes.string,
  }).isRequired,
};

export default Viewer3;
