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
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="white"
    >
      <Box
        w="100%"
        maxW="290px"
      >
        <Text fontSize="24px" fontWeight="bold" mb={4}>
          Signup
        </Text>
        <VStack spacing={3} width="100%" align="stretch">
          <Field label="Email" helperText="Enter a valid email address" width="100%">
            <InputGroup width="100%">
              <Input
                fontSize="12px"
                h="12"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                width="100%"
              />
            </InputGroup>
          </Field>

          <Field label="Password" helperText="Must be at least 8 characters" width="100%">
            <InputGroup
              width="100%"
              endElement={
                <Button
                  variant="link"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
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
                width="100%"
              />
            </InputGroup>
          </Field>

          <Field label="Confirm Password" helperText="Repeat your password" width="100%">
            <InputGroup
              width="100%"
              endElement={
                <Button
                  variant="link"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
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
                width="100%"
              />
            </InputGroup>
          </Field>

          <Link to="/document" style={{ width: '100%' }}>
            <Button
              fontSize="12px"
              h="12"
              bgColor="#00AEEF"
              onClick={handleSignup}
              width="100%"
              color="white"
              borderRadius="6px"
            >
              SignUp
            </Button>
          </Link>

          <HStack spacing={0} align="center" width="100%" pt={2} pb={2}>
            <Box flex="1" borderBottom="1px solid" borderColor="gray.300" />
            <Text flexShrink="0" fontSize="sm" bg="white" px="2">
              Or Register with
            </Text>
            <Box flex="1" borderBottom="1px solid" borderColor="gray.300" />
          </HStack>

          <Button
            size="xs"
            width="100%"
            variant="outline"
            borderRadius="md"
            fontSize="10px"
            leftIcon={<FcGoogle />}
          >
            <FcGoogle />
          </Button>

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
    </Box>
  );
};

export default Signup;