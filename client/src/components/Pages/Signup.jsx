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
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { showToast } from "../toastUtils";
import PropTypes from "prop-types";

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

const Signup = ({ onSuccess }) => {
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

    try {
      const response = await fetch(`http://100.24.4.111/api/User/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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


      console.log("Parsed Response Data:", data);

      if (response.ok) {
        showToast("Signup successful!", "success");

        // ✅ Store email in localStorage
        localStorage.setItem("userEmail", email);

        // ✅ Log token and expiration date to console
       

        onSuccess && onSuccess();
        setTimeout(() => {
          navigate(role === "Admin" ? "/adminlandingpage" : "/");
        }, 500);
      } else {
        if (typeof data === "string") {
          console.log(data);
        } else {
          console.log(data.message || "Signup failed!");
        }
      }
    } catch (error) {
      showToast("An error occurred. Please try again. Details: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex height="100vh" width="100vw" align="center" justify="center" bg="gray.50">
      <Box
        p="6"
        maxWidth="400px"
        width="full"
        boxShadow="0 0 10px 0 rgba(0,0,0,0.1)"
        mt={{ base: "10rem", sm: "0rem", md: "2rem", lg: "12rem" }}
        mx="auto"
      >
        <Text fontSize="24px" fontWeight="bold" mb={4} textAlign="center">
          Signup
        </Text>
        <VStack spacing={4} width="full">
          <Field label="Username">
            <Input fontSize="12px" h="12" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} width="290px" />
            {usernameError && <Text color="red.500" fontSize="sm">{usernameError}</Text>}
          </Field>

          <Field label="Email" helperText="Enter a valid email address">
            <Input fontSize="12px" h="12" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} width="290px" />
            {emailError && <Text color="red.500" fontSize="sm">{emailError}</Text>}
          </Field>

          <Field label="Password" helperText="Must be at least 8 characters">
            <InputGroup endElement={<Button variant="link" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</Button>}>
              <Input fontSize="12px" h="12" placeholder="Must be 8 characters" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} width="290px" />
            </InputGroup>
            {passwordError && <Text color="red.500" fontSize="sm">{passwordError}</Text>}
          </Field>

          <Field label="Confirm Password">
            <InputGroup endElement={<Button variant="link" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</Button>}>
              <Input fontSize="12px" h="12" placeholder="Repeat password" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} width="290px" />
            </InputGroup>
            {confirmPasswordError && <Text color="red.500" fontSize="sm">{confirmPasswordError}</Text>}
          </Field>

          <Field label="Role">
            <select value={role} onChange={(e) => setRole(e.target.value)} style={{ fontSize: "12px", height: "58px", width: "295px", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </Field>

          <Button fontSize="12px" h="12" bgColor="#00AEEF" onClick={handleSignup} width="290px" mt={4} isLoading={loading}>
            SignUp
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

Signup.propTypes = {
  onSuccess: PropTypes.func,
};

export default Signup;
