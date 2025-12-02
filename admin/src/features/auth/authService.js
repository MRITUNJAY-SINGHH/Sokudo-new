import axiosInstance from "@/utils/axiosInstance";

const API_URL = "/api/users";

// REGISTER
const register = async (userData) => {
  const response = await axiosInstance.post(`${API_URL}/register`, userData);
  return response.data; // { user, token, message }
};

// LOGIN


const login = async (userData) => {
  const response = await axiosInstance.post(`${API_URL}/login`, userData);
  console.log("Login response:", response.data); // <-- yahi dekhna
  return response.data;
};


// LOGOUT
const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

const authService = { register, login, logout };

export default authService;
