import axios from "axios";
import { ApiResponse } from "@/types/types";
import { OptionsMenu } from "../zustand/store";

/* ============================
 * API Call Functions
 * ============================ */

/**
 * Sends a request to delete a chat by its component ID.
 *
 * @param {OptionsMenu} options - Object containing the chat component ID.
 * @returns {Promise<ApiResponse<void>>} - Promise resolving to API response indicating success or failure.
 */
export const deleteChat = async (options: OptionsMenu): Promise<ApiResponse<void>> => {
  // Input validation: Ensure options and componentID are valid
  if (!options || typeof options.componentID !== "string") {
    console.warn(`Skipping API call: invalid options provided: ${JSON.stringify(options)}`);
    return {
      success: false,
      data: null,
      error: "Invalid parameters: componentID must be a string",
    };
  }

  try {
    // Make POST request to deleteChat API endpoint with chatID
    await axios.post("http://localhost:3000/api/deleteChat", { chatID: options.componentID }, { withCredentials: true });

    // Return success response with no data
    return {
      success: true,
      data: null,
    };
  } catch (error) {
    // Log error and return failure response with error details
    console.error("AxiosError:", error);
    return {
      success: false,
      data: null,
      error,
    };
  }
};
