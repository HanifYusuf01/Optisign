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
    <Box p='4'>
      <Text fontSize="24px" fontWeight="bold" mb={4}>
        Signup
      </Text>
      <VStack spacing={3} width="full">
        <Field label="Username" helperText="Enter a username">
          <InputGroup>
            <Input
              fontSize="12px"
              h="12"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              width="290px"
            />
          </InputGroup>
        </Field>

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
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
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

        <Button
          fontSize="12px"
          h="12"
          bgColor="#00AEEF"
          onClick={handleSignup}
          width="290px"
        >
          SignUp
        </Button>

        <HStack spacing={0} align="center" width="full">
          <Box flex="1" borderBottom="1px solid" borderColor="gray.300" />
          <Text flexShrink="0" fontSize="sm" bg="white" px="2">
            Or Register with
          </Text>
          <Box flex="1" borderBottom="1px solid" borderColor="gray.300" />
        </HStack>

        <Button
          size="xs"
          width="24"
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