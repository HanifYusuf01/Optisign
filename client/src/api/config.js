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
    if (result && result.value) {
      // Assuming the token is in result.value
      return result.value; // Return the token (or the response value)
    }

    throw new Error("Token not found in response.");
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const uploadFileToServer = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${baseUrl}/api/File/upload`, {
        method: 'POST',
        headers: {
          "accept": "*/*",
          // Add authorization header if required
          // "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const result = await response.json();
      return result.value; // Assuming the response structure matches your API
    } catch (error) {
      console.error("Error during file upload:", error);
      throw error;
    }
  };