import { Box, Text, Button } from "@chakra-ui/react";

import PropTypes from "prop-types";

const Received = () => {
  return (
    <Box p={4}>
      <Text fontSize="xl" mb={4}>
        Received Documents
      </Text>

      <Box mb={4} p={4} border="1px solid gray">
        <Text>Document Name</Text>
        <Button mt={2} colorScheme="blue">
          View Document
        </Button>
      </Box>
    </Box>
  );
};
Received.propTypes = {
  email: PropTypes.string.isRequired,
};
export default Received;
