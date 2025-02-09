import { useState } from "react";
import { Box, Input, Button, Text, VStack, Flex } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";  
import { Field } from "../ui/field";  
import { InputGroup } from "../ui/input-group";  
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from "../../api/config"; // Assuming this is where your login function is

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await login(email, password); 

      console.log("Login successful:", response);

      // Store the token in localStorage
      const token = response.token;
      localStorage.setItem("token", token);

      // Log the token and its expiry time
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode the token to get the payload
      console.log("Token:", token);
      console.log("Token Expiry:", new Date(payload.exp * 1000)); // Log expiry time in a human-readable format

      // Fetch the user's role after login
      const userRole = response.role; 

      // Redirect based on user role
      if (userRole === "admin") {
        navigate("/admin-landing"); // Redirect to the admin landing page if admin
      } else {
        navigate("/document");  // Redirect to the general user dashboard
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isTokenExpired = (token) => {
    if (!token) return true;

    const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT token (if it's JWT)
    const expirationTime = decoded.exp * 1000; // Expiration time in milliseconds
    return expirationTime < Date.now();
  };

  const fetchDataWithToken = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token not found. Please log in again.");
      navigate("/login");
      return;
    }

    if (isTokenExpired(token)) {
      alert("Your session has expired. Please log in again.");
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    console.log("Token being passed in request:", token);

    try {
      const response = await fetch("/api/some-endpoint", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Add the token in the header
        },
      });

      if (response.status === 401) {
        // Token is expired, prompt user to log in again
        localStorage.removeItem("token");
        alert("Your session has expired. Please log in again.");
        navigate("/login");
        return;
      }

      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.error("Error fetching data:", err);
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
        </VStack>
      </Box>
    </Flex>
  );
};

export default Login;
