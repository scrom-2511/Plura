import axios from "axios";

export const chatHistory = async (userID: number, page: number) => {
  try {
    if (!userID || !page) {
      console.warn("Skipping API call: missing userID or chatID");
      return null;
    }
    
    const res = await axios.post("http://localhost:3000/api/chatHistory", {
      userID,
      page
    });
    return res.data;
  } catch (error) {
    console.error("AxiosError:", error);
  }
};
