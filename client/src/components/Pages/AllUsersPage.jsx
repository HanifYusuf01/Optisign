import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      console.log("Fetching users...");

      // Function to check if the token is valid (not expired)
      const checkTokenValidity = (token) => {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const expiryTime = new Date(payload.exp * 1000);  // Convert to milliseconds
          console.log("Token Expiry Time:", expiryTime);
          
          if (expiryTime < new Date()) {
            console.warn("Token has expired.");
            return false;
          }
          return true;
        } catch (error) {
          console.error("Invalid token format:", error);
          return false;
        }
      };
      
      const token = localStorage.getItem("token");
      
      if (!token || !checkTokenValidity(token)) {
        console.warn("No valid token. Redirecting...");
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
      
      // Log the headers to ensure the token is being sent correctly
      console.log("Sending Request with Headers:", {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      });
      
      try {
        // Make the API request with the token
        const response = await fetch("http://100.24.4.111/api/User/api/allUsers", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
        });

        // If the response is not ok, throw an error
        if (!response.ok) {
          throw new Error(`Failed to fetch users. Status: ${response.status}`);
        }

        // Parse the response data as JSON
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        // Set the error state and show an alert
        setError(error.message);
        window.alert(error.message);  // Alert the user
      } finally {
        setLoading(false);  // Set loading to false once the request is completed
      }
    };

    // Fetch the users when the component mounts
    fetchUsers();
  }, [navigate]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Users</h2>

      {loading ? (
        <p>Loading...</p>  // Display loading message while fetching users
      ) : error ? (
        <div style={{ color: "red", fontWeight: "bold" }}>
          Error: {error}  // Display any error that occurs
        </div>
      ) : (
        <ul>
          {users.length > 0 ? (
            users.map((user) => (
              <li key={user.id}>
                <strong>{user.username}</strong> - {user.email}
              </li>
            ))
          ) : (
            <p>No users found.</p>  // Display message if no users are returned
          )}
        </ul>
      )}
    </div>
  );
};

export default AllUsersPage;
