import axios from "axios"

export const chatHistory = async () => {
    const data = {userID:1, page:1}
    const res = await axios.post("http://localhost:3000/api/chatHistory", data)
    console.log(res)
    return res
}