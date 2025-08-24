import axios from "axios";

export const chatHistory = async (userID: number, page: number) => {
  try {
    const res = await axios.post("http://localhost:3000/api/chatHistory", {
      userID,
      page,
    });
    
    return { success: true, data: res };
  } catch (error) {
    console.error("Request failed in chatHistory:", error);
    return { success: false, error }; // return error for consistent handling
  }
};
