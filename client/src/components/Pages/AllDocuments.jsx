import { useEffect, useState } from "react";
import { Box, Button, Text, VStack, Spinner, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "../../styling/documents.css";

// PDF worker source (use CDN for reliability)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const baseUrl = "http://100.24.4.111";

const AllDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [fileType, setFileType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        // console.error("Error fetching documents:", error);
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
  // const handleViewDocument = async (doc) => {
  //   const fileUrl = `${baseUrl}/uploads/${doc.fileName}`;
  //   console.log("🔗 Constructed File URL:", fileUrl);
  //   console.log("📂 Document File Path:", doc.filePath);
  //   console.log("📝 Document Content Type:", doc.contentType);

  //   try {
  //     const response = await fetch(fileUrl);
  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch image. Status: ${response.status}`);
  //     }

  //     const blob = await response.blob();
  //     console.log("🖼️ Blob:", blob);

  //     const reader = new FileReader();
  //     reader.readAsDataURL(blob);
  //     reader.onloadend = () => {
  //       console.log("📸 Base64 Image:", reader.result);
  //     };

  //     if (doc.contentType.includes("pdf")) {
  //       setFileType("pdf");
  //       setSelectedDocument(fileUrl);
  //     } else if (doc.contentType.includes("image")) {
  //       setFileType("image");
  //       setSelectedDocument(fileUrl);
  //     } else {
  //       window.open(fileUrl, "_blank");
  //     }
  //   } catch (error) {
  //     console.error("🚨 Error loading image:", error);
  //   }
  // };

  const handleViewDocument = (doc) => {
    setSelectedDocument(doc.filePath);
    setFileType(doc.contentType.startsWith("image") ? "image" : "pdf");
    setIsModalOpen(true);
  };

  return (
    <Box className="box-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>File Name</th>
            <th>File Path</th>
            <th>Content Type</th>
            <th>Upload Date</th>
            <th>User Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.length > 0 ? (
            documents.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.id}</td>
                <td>{doc.fileName}</td>
                <td>{doc.filePath}</td>
                <td>{doc.contentType}</td>
                <td>{doc.uploadDate}</td>
                <td>{doc.userEmail}</td>
                <td>
                  <button onClick={() => handleViewDocument(doc)}>View</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-documents">
                No documents found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && selectedDocument && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="modal">
            <button onClick={() => setIsModalOpen(false)}>Close</button>
            {fileType === "image" ? (
              <Image src={selectedDocument} alt="Document Preview" />
            ) : (
              <Document
                file={selectedDocument}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page pageNumber={pageNumber} />
              </Document>
            )}
          </div>
        </>
      )}
    </Box>
  );
};

export default AllDocuments;
