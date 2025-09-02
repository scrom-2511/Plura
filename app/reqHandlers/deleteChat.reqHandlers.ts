import axios from "axios";
import { OptionsMenu } from "../zustand/store";

export const deleteChat = (options: OptionsMenu) => {
  const req = axios.post("http://localhost:3000/api/deleteChat", {chatID: options.componentID }, { withCredentials: true });
};
