import { ApiResponse } from "@/types/types";
import axios from "axios";

/* ============================
 * API Call Functions
 * ============================ */

/**
 * Attempts to sign in a user using their email and password.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<ApiResponse<any>>} - Promise resolving to API response containing user data or error info.
 */
export const signIn = async (
  email: string,
  password: string
): Promise<ApiResponse<any>> => {
  // Input validation: check that email and password are non-empty strings
  if (email.trim() === "" || password.trim() === "") {
    console.warn(
      `Skipping signIn API call: invalid parameters email='${email}', password='${password}'`
    );
    return { success: false, data: null, error: "Invalid credentials" };
  }

  try {
    // Make POST request to sign-in API endpoint
    const res = await axios.post("http://localhost:3000/api/auth/signin", {
      email,
      password,
    });

    // Return success response with received data
    return { success: true, data: res.data };
  } catch (error) {
    // Log error and return failure response with error details
    console.error("Request failed in signIn:", error);
    return { success: false, data: null, error };
  }
};
