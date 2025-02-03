
export const baseUrl = "http://100.24.4.111"; 

// Function to make a POST request to the login endpoint
export const login = async (email, password) => {
  try {
    const response = await fetch(`${baseUrl}/api/User/login?email=${email}&password=${password}`, {
      method: "POST",
      headers: {
        "accept": "*/*",
      },
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const result = await response.json();
    return result.value; // Return the token (or the response value)
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};
