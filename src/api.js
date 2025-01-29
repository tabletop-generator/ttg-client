// api.js

const logger = require("@/utils/logger");

const apiUrl = process.env.API_URL || "http://localhost:8080";

export async function getCharacterImage(user, characterData) {
  logger.info("Starting API call to generate character image...");

  // Use the ID token with the "Bearer" prefix
  const token = `Bearer ${user.id_token}`;
  logger.info("Authorization token:", token);

  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    // Construct the request body in the expected order
    const requestBody = {
      type: "character", // Ensures "type" is first
      visibility: "public", // Ensures "visibility" is second
      data: { ...characterData }, // Ensures "data" is last
    };

    // Log the request details
    logger.info("Sending API Request:", {
      url: `${apiUrl}/v1/assets`,
      method: "POST",
      headers,
      body: JSON.stringify(requestBody), // Logs the serialized JSON
    });

    // Make the POST request
    const res = await fetch(`${apiUrl}/v1/assets`, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    // Log the status of the response
    logger.info(`API Response Status: ${res.status} ${res.statusText}`);

    // Handle non-OK responses
    if (!res.ok) {
      const error = `${res.status} ${res.statusText}`;
      logger.error("API call failed:", error);
      throw new Error(error);
    }

    // Parse and return the response
    const response = await res.json();
    logger.info("API Response Data:", response);

    return response;
  } catch (err) {
    logger.error("Error during API call:", { message: err.message });
    throw err;
  }
}
