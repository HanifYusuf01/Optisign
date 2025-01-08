import { useState } from "react";
import {
  Box,
  Input,
  Button,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useSignupMutation } from "../../services/authApi";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { Field } from "../ui/field";
import { InputGroup } from "../ui/input-group";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signup] = useSignupMutation();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    await signup({ email, password }).unwrap();
    alert("Signup successful!");
  };

  return (
    <Box p='4'>
      <Text fontSize="24px" fontWeight="bold" mb={4}>
        Signup
      </Text>
      <VStack spacing={3} width="full"> {/* Ensure VStack takes full width */}
        <Field label="Email" helperText="Enter a valid email address">
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

        <Field label="Password" helperText="Must be at least 8 characters">
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
              placeholder="must be 8 characters"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              width="290px" 
            />
          </InputGroup>
        </Field>

        <Field label="Confirm Password" helperText="Repeat your password">
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
              placeholder="repeat password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              width="290px" 
            />
          </InputGroup>
        </Field>

        <Link to="/document">
          <Button
            fontSize="12px" 
            h="12" 
            bgColor="#00AEEF"
            onClick={handleSignup}
            width="290px" 
          >
            SignUp
          </Button>
        </Link>

        <HStack spacing={0} align="center" width="full"> 
          <Box flex="1" borderBottom="1px solid" borderColor="gray.300" />
          <Text flexShrink="0" fontSize="sm" bg="white" px="2">
            Or Register with
          </Text>
          <Box flex="1" borderBottom="1px solid" borderColor="gray.300" />
        </HStack>

        <Button
          size="xs"
          width="24" // Ensure Button takes full width
          variant="outline"
          borderRadius="md"
          fontSize="10px"
          leftIcon={<FcGoogle />}
        >
          <FcGoogle />
        </Button>

        <Text fontSize="sm">
          Already have an account?{" "}
          <Link to="/login">
            <Text as="span" fontWeight="bold" color="#00AEEF">
              Login
            </Text>
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};

export default Signup;