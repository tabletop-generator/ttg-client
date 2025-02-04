// api.js

const logger = require("@/utils/logger");

const apiUrl = process.env.API_URL || "http://localhost:8080";

/****************************************************************
 * Function: getAssetImage
 * Description: Sends a POST request to generate an asset image
 *              based on the provided asset data and type.
 * Parameters:
 *   - user (Object): Contains authentication details, including the ID token.
 *   - assetData (Object): The data required to generate the asset image.
 *   - assetType (String): The type of asset to generate.
 * Returns:
 *   - Object: The response data containing the generated asset details.
 * Throws:
 *   - Error if the API call fails or returns a non-OK response.
 ****************************************************************/

export async function getAssetImage(user, assetData, assetType) {
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
      type: assetType, // Ensures "type" is first
      visibility: "public", // Ensures "visibility" is second
      data: { ...assetData }, // Ensures "data" is last
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

/***************************************************************
 * Function: postUser
 * Description: Sends a POST request to register a user
 *              when they log in.
 * Parameters:
 *   - user (Object): Contains user details, including email and ID token.
 * Returns:
 *   - Object: Response status and data from the API.
 * Throws:
 *   - Error if the API call fails.
 ****************************************************************/

export async function postUser(user) {
  try {
    // Send a POST request to create a user
    const response = await fetch(`${apiUrl}/v1/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.id_token}`, // Use the ID token for authentication
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email, // Send the user's email in the request body
      }),
    });

    // If the API response is not OK, log the error and throw an exception
    if (!response.ok) {
      const errorDetails = await response.text();
      console.error(
        `API call failed with status: ${response.status}, Details: ${errorDetails}`,
      );
      throw new Error(`API call failed with status: ${response.status}`);
    }

    // If the request is successful, parse and return the response data
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    // Catch and log any errors that occur during the API request
    console.error("Error during postUser call:", error);
    throw error;
  }
}
