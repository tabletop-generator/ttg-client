// api.js

const logger = require("@/utils/logger");

const apiUrl = process.env.API_URL || "http://localhost:8080";
const logLevel = process.env.NEXT_PUBLIC_LOG_LEVEL; // Retrieve the log level for controlling console logs securely
const isDebug = logLevel === "debug"; // Boolean flag to enable debug-level console logging
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

    // Extract "name" from assetData and ensure it's at the top level
    const { name, ...data } = assetData;

    // Construct the request body in the expected order
    const requestBody = {
      name, // Ensure "name" is at the top level
      type: assetType, // Ensures "type" is next
      visibility: "public", // Ensures "visibility" follows
      data, // "data" now excludes "name"
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

/****************************************************************
 * Function: getUser
 * Description: Sends a GET request to retrieve user information
 *              from the backend using the provided email.
 * Parameters:
 *   - user (Object): Contains authentication details, including the ID token.
 *   - email (String): The email of the user whose details need to be fetched.
 * Returns:
 *   - Object: Response status and data from the API.
 * Throws:
 *   - Error if the API call fails or returns a non-OK response.
 ****************************************************************/

export async function getUser(user, email) {
  try {
    const response = await fetch(`${apiUrl}/v1/users/${email}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.id_token}`,
        "Content-Type": "application/json",
      },
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
    console.error("Error during getUser call:", error);
    throw error;
  }
}

/****************************************************************
 * Function: getAssetByID
 * Description: Sends a GET request to retrieve user's asset information
 *              from the backend using the provided asset ID.
 * Parameters:
 *   - user (Object): Contains authentication details, including the ID token.
 *   - id (String): The asset UUID.
 * Returns:
 *   - Object: Response status and data from the API.
 * Throws:
 *   - Error if the API call fails or returns a non-OK response.
 ****************************************************************/
export async function getAssetByID(user, uuid) {
  console.log(`Fetching asset details for ID: ${uuid}`);

  if (!user?.id_token) {
    throw new Error("User authentication token is missing");
  }

  try {
    const response = await fetch(`${apiUrl}/v1/assets/${uuid}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.id_token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (isDebug) {
      console.log("Fetched Asset Data:", data);
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return { status: response.status, data };
  } catch (error) {
    console.error("Error fetching asset:", error);
    throw error;
  }
}

/***************************************************************
 * Function: updatePrismaUserInfo
 * Description: Sends a PATCH request to update a user information
 ****************************************************************/

export async function updatePrismaUserInfo(user, newInfo) {
  console.log("Update User Request Sent ");
  return;
}

/***************************************************************
 * Function: updatePrismaAssetInfo
 * Description: Sends a PATCH request to update a user information
 ****************************************************************/

export async function updatePrismaAssetInfo(user, uuid, updatedData) {
  if (!user?.id_token) {
    throw new Error("User authentication token is missing");
  }

  if (!uuid) {
    throw new Error("Asset UUID is missing");
  }

  if (isDebug) {
    console.log(`updatePrismaAssetInfo: Fetching Asset with UUID: ${uuid}...`);
  }

  try {
    console.log("Calling PATCH request...");
    const response = await fetch(`${apiUrl}/v1/assets/${uuid}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user.id_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    const patchedData = await response.json();

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    if (isDebug) {
      console.log("Asset updated successfully:", patchedData);
    } else {
      console.log("Asset updated successfully");
    }
    return patchedData;
  } catch (error) {
    console.error("Error fetching or updating asset:", error);
    throw error;
  }
}

/***************************************************************
 * Function: deletePrismaAsset
 * Description: Sends a DELETE request to update a user information
 ****************************************************************/

export async function deletePrismaAsset(user, newInfo) {
  console.log("DELETE Asset Request Sent ");
  return;
}
