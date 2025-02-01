import { useState } from "react";
import {
  Box,
  Input,
  Button,
  Text,
  VStack,
  HStack,
  Flex,
  Center,
} from "@chakra-ui/react";
import { useSignupMutation } from "../../services/authApi";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { Field } from "../ui/field";
import { InputGroup } from "../ui/input-group";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [signup] = useSignupMutation();

  const handleSignup = async () => {
    try {
      const response = await signup({ username, email, password, role }).unwrap();
      console.log("Signup response:", response);
      alert("Signup successful!");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed!");
    }
  };

  return (
    <Flex
      height="100vh"
      width="100vw"
      align="center"
      justify="center"
      bg="gray.50"
    >
      <Box p="6" maxWidth="400px" width="full">
        <Text fontSize="24px" fontWeight="bold" mb={4} textAlign="center">
          Signup
        </Text>
        <VStack spacing={4} width="full">
          {/* Email Input */}
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

          {/* Password Input */}
          <Field label="Password" helperText="Must be at least 8 characters">
            <InputGroup
              endElement={
                <Button
                  variant="link"
                  onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Show eye or eye-slash icon */}
                </Button>
              }
            >
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

          {/* Confirm Password Input */}
          <Field label="Confirm Password" helperText="Repeat your password">
            <InputGroup
              endElement={
                <Button
                  variant="link"
                  onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Show eye or eye-slash icon */}
                </Button>
              }
            >
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
                
          {/* SignUp Button */}
          <Link to="/document">
            <Button
              fontSize="12px"
              h="12"
              bgColor="#00AEEF"
              onClick={handleSignup}
              width="290px"
              mt={4}
            >
              SignUp
            </Button>

          </Link>
          {/* Separator and Google Button */}
          <HStack spacing={0} align="center" width="full">
            <Box flex="1" borderBottom="1px solid" borderColor="gray.300" />
            <Text flexShrink="0" fontSize="sm" bg="white" px="2">
              Or Register with
            </Text>
            <Box flex="1" borderBottom="1px solid" borderColor="gray.300" />
          </HStack>

          <Button
            size="xs"
            width="full"
            variant="outline"
            borderRadius="md"
            fontSize="10px"
            leftIcon={<FcGoogle />}
          >
            Register with Google
          </Button>

          {/* Login Link */}
          <Text fontSize="sm" textAlign="center">
            Already have an account?{" "}
            <Link to="/login">
              <Text as="span" fontWeight="bold" color="#00AEEF">
                Login
              </Text>
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Signup;
