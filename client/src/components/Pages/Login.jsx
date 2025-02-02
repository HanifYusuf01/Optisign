import { useState } from "react";
import { Box, Input, Button, Text, VStack, Flex } from "@chakra-ui/react";

import { Link } from "react-router-dom";
import { Field } from "../ui/field";  
import { InputGroup } from "../ui/input-group";  
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);


  return (
    <Flex  height="100vh"
    width="100vw"
    align="center"
    justify="center">
    <Box p={6}>
      <Text fontSize="24px" fontWeight="bold" mb={4} textAlign="center">Login</Text>
      <VStack spacing={3}  align="stretch">
        <Field label="Email">
          <InputGroup>
            <Input 
              fontSize="12px" 
              h="12" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              width="290px" 
            />
          </InputGroup>
        </Field>

        <Field label="Password">
          <InputGroup endElement={
            <Button
              variant="link"
              onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Show eye or eye-slash icon */}
            </Button>
          }>
            <Input 
              fontSize="12px" 
              h="12" 
              placeholder="Password" 
              type={showPassword ? "text" : "password"} // Toggle between text and password
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              width="290px" 
            />
          </InputGroup>
        </Field>

        <Link to='/document'>
          <Button 
            fontSize="12px" 
            mt={4} 
            h="12" 
            bgColor="#00AEEF" 
            w="290px"
          >
            Login
          </Button>
        </Link>
      </VStack>
    </Box>
    </Flex>
  );
};

export default Login;