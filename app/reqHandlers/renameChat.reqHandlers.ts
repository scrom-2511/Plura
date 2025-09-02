import axios from "axios";
import { OptionsMenu } from "../zustand/store";

export const renameChat = (options: OptionsMenu, newName: string) => {
  const req = axios.post("http://localhost:3000/api/renameChat", {chatID: options.componentID, newName}, { withCredentials: true });
};
