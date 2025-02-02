import { useState } from "react";
import { Box, VStack, HStack, Flex, Text } from "@chakra-ui/react";
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your signup logic here
  };

  return (
    <Flex 
      minH="100vh" 
      align="center" 
      justify="center" 
      bg="gray.50"
    >
      <Box 
        p={8} 
        maxWidth="400px" 
        borderWidth={1} 
        borderRadius={8} 
        boxShadow="lg"
        bg="white"
      >
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="flex-start">
            <h2 className="text-2xl font-bold mb-6">Signup</h2>

            {/* Email Input */}
            <Field label="Email">
              <InputGroup>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter your email"
                  required
                />
              </InputGroup>
            </Field>

            {/* Password Input */}
            <Field label="Password">
              <InputGroup>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </InputGroup>
            </Field>

            {/* Confirm Password Input */}
            <Field label="Confirm Password">
              <InputGroup>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </InputGroup>
            </Field>

            {/* Signup Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </button>

            {/* Separator */}
            <HStack w="100%" justify="center" my={4}>
              <Box flex={1} h="1px" bg="gray.300" />
              <Text px={3} color="gray.500">
                Or Register with
              </Text>
              <Box flex={1} h="1px" bg="gray.300" />
            </HStack>

            {/* Google Button */}
            <button
              type="button"
              className="w-full border py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <FcGoogle size={20} />
              Register with Google
            </button>

            {/* Login Link */}
            <Flex w="100%" justify="center" mt={4}>
              <Text>
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:text-blue-700">
                  Login
                </Link>
              </Text>
            </Flex>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default Signup;