import { useState } from "react";
import {
  Box,
  Input,
  Button,
  Text,
  VStack,
  HStack,
  Flex,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { InputGroup } from "../ui/input-group";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { baseURL } from "../../config";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Field = ({ label, helperText, children }) => (
  <Box width="full">
    <Text fontSize="sm" color="gray.600" mb={2}>
      {label}
    </Text>
    {children}
    <Text fontSize="xs" color="gray.500" mt={1}>
      {helperText}
    </Text>
  </Box>
);

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [roleError, setRoleError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    // Reset errors
    setEmailError("");
    setUsernameError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setRoleError("");

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    // Username validation
    if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters long.");
      return;
    }

    // Password validation
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords don't match!");
      return;
    }

    // Role validation
    if (!role) {
      setRoleError("Please select a role.");
      return;
    }

    setLoading(true);

    // Retrieve token from localStorage
    const token = localStorage.getItem("token");
    console.log("Retrieved token from localStorage:", token);

    if (!token) {
      console.warn("Authentication token is missing. Redirecting to login.");
      navigate("/login"); 
      return;
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
  console.log("Token Expiry:", new Date(payload.exp * 1000));

  if (payload.exp * 1000 < Date.now()) {
    console.warn("Token has expired. Redirecting to login.");
    localStorage.removeItem("token"); 
    navigate("/login"); // Redirect to login page if token is expired
    return;
  }

    try {
      console.log("Sending request with token:", `Bearer ${token}`); // Debugging

      const response = await fetch(`${baseURL}/api/User/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: 0, email, username, password, role }),
      });

      const contentType = response.headers.get("Content-Type");

      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (response.ok) {
        alert("Signup successful!");

        setTimeout(() => {
          navigate(role === "admin" ? "/adminlandingpage" : "/");
        }, 500);
      } else {
        if (typeof data === "string") {
          alert(data);
        } else {
          alert(data.message || "Signup failed!");
        }
      }
    } catch (error) {
      alert("An error occurred. Please try again. Details: " + error.message);
    } finally {
      setLoading(false);
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
      <Box
        p="6"
        maxWidth="400px"
        width="full"
        style={{
          boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)",
        }}
        mt={{ base: "10rem", sm: "0rem", md: "2rem", lg: "12rem" }}
        mx="auto"
        height={{ base: "auto", sm: "auto", md: "auto", lg: "auto" }}
      >
        <Text fontSize="24px" fontWeight="bold" mb={4} textAlign="center">
          Signup
        </Text>
        <VStack spacing={4} width="full">
          {/* username Input */}
          <Field label="Username">
            <Input
              fontSize="12px"
              h="12"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              width="290px"
            />
            {usernameError && (
              <Text color="red.500" fontSize="sm">
                {usernameError}
              </Text>
            )}
          </Field>

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
            {emailError && (
              <Text color="red.500" fontSize="sm">
                {emailError}
              </Text>
            )}
          </Field>

          {/* Password Input */}
          <Field label="Password" helperText="Must be at least 8 characters">
            <InputGroup
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
                placeholder="Must be 8 characters"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                width="290px"
              />
            </InputGroup>
            {passwordError && (
              <Text color="red.500" fontSize="sm">
                {passwordError}
              </Text>
            )}
          </Field>

          {/* Confirm Password Input */}
          <Field label="Confirm Password">
            <InputGroup
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
                placeholder="Repeat password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                width="290px"
              />
            </InputGroup>
            {confirmPasswordError && (
              <Text color="red.500" fontSize="sm">
                {confirmPasswordError}
              </Text>
            )}
          </Field>

          {/* Role Input */}
          <Field label="Role">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                fontSize: "12px",
                height: "58px",
                width: "295px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {roleError && (
              <Text color="red.500" fontSize="sm">
                {roleError}
              </Text>
            )}
          </Field>

          {/* SignUp Button */}
          <Button
            fontSize="12px"
            h="12"
            bgColor="#00AEEF"
            onClick={handleSignup}
            width="290px"
            mt={4}
            isLoading={loading}
          >
            SignUp
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Signup;
