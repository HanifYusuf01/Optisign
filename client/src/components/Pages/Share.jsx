import { useState } from "react";
import { Box, Input, Button, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";

const Share = () => {
  const [recipient, setRecipient] = useState("");
  const [platform, setPlatform] = useState("email");

  return (
    <Box p={4}>
      <Text fontSize="xl" mb={4}>
        Share Document
      </Text>
      <Input
        placeholder="Recipient Email"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <Input
        placeholder="Platform (e.g., email, whatsapp)"
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
      />
      <Button mt={4} colorScheme="blue" disabled={!recipient || !platform}>
        Share
      </Button>
    </Box>
  );
};

Share.propTypes = {
  document: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
};
export default Share;
