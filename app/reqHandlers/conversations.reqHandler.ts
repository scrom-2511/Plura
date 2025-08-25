import axios from "axios";

export const conversations = async (userID: number, chatID: string) => {
  try {
    const res = await axios.post("http://localhost:3000/api/chat", {
      userID,
      chatID
    });
    
    return { success: true, data: res };
  } catch (error) {
    console.error("Request failed in conversations:", error);
    return { success: false, error };
  }
};
