import { useState } from "react";
import { Box, Button, Text, Flex } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { MdOutlineFileUpload } from "react-icons/md";
import { useNavigate } from "react-router-dom";

// Define the Base URL for API calls
const BASE_URL = "http://100.24.4.111/api";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    try {
      const response = await fetch(`${BASE_URL}/File/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer your-jwt-token-here`, // Replace with an actual token
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Upload successful:", data);

        const document = {
          id: data.fileId || file.name,
          path: URL.createObjectURL(file),
          type: file.type,
        };

        navigate("/viewer", { state: { document } });
      } else {
        console.error("Upload failed:", await response.text());
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Flex
      height="100vh"
      width="100vw"
      align="center"
      justify="center"
      bg="gray.50"
    >
      <Box p={4} width="90%" maxWidth="500px">
        <Text fontSize="2xl" mb={10} fontWeight="bold" textAlign="center">
          Upload your document
        </Text>

        <Box
          {...getRootProps()}
          border="2px dashed"
          borderColor="#00AEEF"
          borderRadius="md"
          p={4}
          textAlign="center"
          cursor="pointer"
          color="#00AEEF"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <input {...getInputProps()} />
          <MdOutlineFileUpload size={40} />
          <Text color="gray.500">Upload File</Text>
        </Box>

        {file && (
          <Text mt={2} mb="10" textAlign="center">
            File: {file.name}
          </Text>
        )}

        <Button
          mt={4}
          bg="#00AEEF"
          width="full"
          onClick={handleUpload}
          disabled={!file || uploading}
          textAlign="center"
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </Box>
    </Flex>
  );
};

export default Upload;
