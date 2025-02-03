import { useState } from "react";
import { Box, Input, Button, Text, VStack, Flex } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";  // Import useNavigate
import { Field } from "../ui/field";  
import { InputGroup } from "../ui/input-group";  
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from "../../api/config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use navigate instead of useHistory

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await login(email, password);
      console.log("Login successful:", response);

      // Store the JWT token in localStorage (or any other method)
      localStorage.setItem("token", response.token);

      // Redirect the user to a different page (e.g., dashboard)
      navigate("/document");  // Use navigate to redirect to a different route

    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex height="100vh" width="100vw" align="center" justify="center">
      <Box p={6}>
        <Text fontSize="24px" fontWeight="bold" mb={4} textAlign="center">Login</Text>
        <VStack spacing={3} align="stretch">
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

          {error && <Text color="red.500">{error}</Text>} {/* Display error message */}

          <Button
            fontSize="12px"
            mt={4}
            h="12"
            bgColor="#00AEEF"
            w="290px"
            onClick={handleLogin}
            isLoading={loading} // Show loading spinner
            loadingText="Logging In"
          >
            Login
          </Button>

          {/* Redirect or link to another page after successful login */}
          {/* <Link to='/document'>
            <Text fontSize="12px" color="blue.500">Go to Documents</Text>
          </Link> */}
        </VStack>
      </Box>
    </Flex>
  );
};

export default Login;
