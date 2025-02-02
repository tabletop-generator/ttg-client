/**
 * postNewUser.js - Utility function to send an empty POST request.
 *
 * This file is placed inside the `utils/` directory because:
 * - It is NOT a React component, so it should not be inside `pages/`.
 * - It is NOT an API route, so it should not be inside `pages/api/`.
 *
 * Usage:
 *   import { postUser } from "@/utils/postNewUser";
 *
 * This function sends a POST request to create a new user in cognitoAuthConfig.js.
 */

const logger = require("@/utils/logger");

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function postUser(user) {
  try {
    //send empty post request
    const response = await fetch(`${API_URL}/v1/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.id_token}`, // Use the ID token
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hashedEmail: user.hashedEmail,
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error(
        `API call failed with status: ${response.status}, Details: ${errorDetails}`,
      );
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error("Error during postUser call:", error);
    throw error;
  }
}
