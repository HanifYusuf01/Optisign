import { useState } from "react";
import { Box, Input, Button, Text, VStack } from "@chakra-ui/react";
import { useLoginMutation } from "../../services/authApi";
import { Link } from "react-router-dom";
import { Field } from "../ui/field";  
import { InputGroup } from "../ui/input-group";  
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const result = await login({ email, password }).unwrap();
    localStorage.setItem("token", result.Token);
  };

  return (
    <Box p={4}>
      <Text fontSize="24px" fontWeight="bold" mb={4}>Login</Text>
      <VStack spacing={3}>
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
            onClick={handleLogin} 
            w="290px"
          >
            Login
          </Button>
        </Link>
      </VStack>
    </Box>
  );
};

export default Login;