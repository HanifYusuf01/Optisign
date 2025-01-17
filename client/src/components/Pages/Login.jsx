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
      <Box w="100%" maxW="290px" p={4}>
        <Text fontSize="24px" fontWeight="bold" mb={4}>
          Login
        </Text>
        <VStack spacing={3} align="stretch">
          <Field label="Email" width="100%">
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

          <Field
            label="Password"
            width="100%"
          >
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

          <Link to="/document" style={{ width: "100%" }}>
            <Button
              fontSize="12px"
              mt={4}
              h="12"
              bgColor="#00AEEF"
              onClick={handleLogin}
              width="100%"
              color="white"
            >
              Login
            </Button>
          </Link>
        </VStack>
      </Box>
    </Box>
  );
};

export default Login;
