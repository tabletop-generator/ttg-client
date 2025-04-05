// api.js

const logger = require("@/utils/logger");

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
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

    console.log("Sending Request:", JSON.stringify(requestBody, null, 2));

    // Log the request details
    logger.debug("Sending API Request:", {
      url: `${apiUrl}/v1/assets`,
      method: "POST",
      headers,
      body: JSON.stringify(requestBody), // Logs the serialized JSON
    });

    // Extra debugging log
    console.log("Sending API Request:", {
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

    if (isDebug) console.log(data);

    return { status: response.status, data };
  } catch (error) {
    console.error("Error during getUser call:", error);
    throw error;
  }
}

/****************************************************************
 * Function: getUserAssets
 * Description: Sends a GET request to retrieve user assets from
 *              the backend, optionally applying query parameters.
 * Parameters:
 *   - user (Object): Contains authentication details, including the ID token.
 *   - queryParams (Object): An object containing optional query parameters.
 * Returns:
 *   - Object: The parsed JSON response from the API, which should
 *             include a list of assets under the key "assets".
 * Throws:
 *   - Error if the API call fails or returns a non-OK response.
 ****************************************************************/
export async function getUserAssets(user, hashedEmail, expand = true) {
  try {
    const url = `${apiUrl}/v1/assets?userId=${hashedEmail}${expand ? "&expand=true" : ""}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.id_token}`, // Pass authentication token
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
    console.log("assets", data);

    // Return the status and assets from the API response
    return {
      status: data.status,
      assets: data.assets,
    };
  } catch (error) {
    console.error("Error during getUserAssets call:", error);
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
      if (data.asset && data.asset.user) {
        console.log("Asset creator hashedEmail:", data.asset.user.hashedEmail);
      }
    }

    let creatorName = "Anonymous";
    if (data.asset && data.asset.user && data.asset.user.hashedEmail) {
      const response2 = await getUser(user, data.asset.user.hashedEmail);
      if (response2 && response2.data && response2.data.user) {
        creatorName = response2.data.user.displayName;
      } else {
        console.log("Cannot get Creator's name");
      }
    }

    // Optionally attach the creator's name to the asset object
    if (data.asset) {
      data.asset.creatorName = creatorName;
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
 * Description: Sends a PATCH request to update user information
 *              using the provided authentication token.
 * Parameters:
 *   - userToken (string): The ID token of the authenticated user.
 *   - hashedEmail (string): The hashed email identifier of the user.
 *   - newInfo (Object): An object containing the updated user fields.
 * Returns:
 *   - Object: The parsed JSON response containing the updated user data.
 * Throws:
 *   - Error if the token or update data is missing, or if the API request fails.
 ***************************************************************/

export async function updatePrismaUserInfo(userToken, hashedEmail, newInfo) {
  console.log("Update User Request Sent ");

  if (!userToken) {
    throw new Error("User authentication token is missing");
  }

  if (!newInfo) {
    throw new Error("New Info is missing");
  }

  if (isDebug) {
    console.log(`updatePrismaUserInfo: Fetching user: ${userToken}...`);
  }

  try {
    console.log("Calling PATCH request...");
    const response = await fetch(`${apiUrl}/v1/users/${hashedEmail}`, {
      method: "PATCH",

      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newInfo),
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
 * Function: updatePrismaAssetInfo
 * Description: Sends a PATCH request to update asset information
 *              using the authenticated user's credentials.
 * Parameters:
 *   - user (Object): The authenticated user object containing the ID token.
 *   - uuid (string): The unique identifier (UUID) of the asset to update.
 *   - updatedData (Object): An object containing updated asset fields.
 * Returns:
 *   - Object: The parsed JSON response with updated asset information.
 * Throws:
 *   - Error if the user, token, or UUID is missing, or if the API call fails.
 ***************************************************************/

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
 * Description: Sends a DELETE request to remove an asset by its UUID.
 * Parameters:
 *   - user (Object): The authenticated user object containing the ID token.
 *   - uuid (string): The unique identifier (UUID) of the asset to delete.
 * Returns:
 *   - Response: The raw fetch response object from the API.
 * Throws:
 *   - Error if the user, token, or UUID is missing, or if the API call fails.
 ***************************************************************/

export async function deletePrismaAsset(user, uuid) {
  if (!user?.id_token) {
    throw new Error("User authentication token is missing");
  }

  if (!uuid) {
    throw new Error("Asset UUID is missing");
  }

  if (isDebug) {
    console.log(`deletePrismaAsset: deleting asset with UUID: ${uuid}...`);
  }

  try {
    console.log("DELETE Asset Request Sent");

    const response = await fetch(`${apiUrl}/v1/assets/${uuid}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.id_token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    if (isDebug) {
      console.log("Asset deleted successfully:", response);
    } else {
      console.log("Could not delete asset");
    }

    return response;
  } catch (error) {
    console.error("Error fetching or updating asset:", error);
    throw error;
  }
}

/***************************************************************
 * Function: postCollection
 * Description: Sends a POST request to create a new collection
 *              using the authenticated user's credentials.
 * Parameters:
 *   - user (Object): The authenticated user object containing the ID token.
 *   - collectionInfo (Object): The details of the collection to create.
 * Returns:
 *   - Object: The response status and the created collection data.
 * Throws:
 *   - Error if the user token is missing, or if the API call fails.
 ***************************************************************/

export async function postCollection(user, collectionInfo) {
  console.log("Post a collection Request Sent ");

  if (!user?.id_token) {
    throw new Error("User authentication token is missing");
  }

  if (isDebug) {
    console.log("Request to create a collection: ", collectionInfo);
  }

  try {
    console.log("Calling Create a collection...");

    const response = await fetch(`${apiUrl}/v1/collections`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.id_token}`, // Use the ID token for authentication
        "Content-Type": "application/json",
      },
      body: JSON.stringify(collectionInfo), // Convert collectionInfo to a JSON string
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
    console.error("Error during postCollection call:", error);
    throw error;
  }
}

/***************************************************************
 * Function: updateCollectionDetails
 * Description: Sends a PATCH request to update information of an
 *              existing collection by its ID.
 * Parameters:
 *   - user (Object): The authenticated user object containing the ID token.
 *   - collectionId (string): The unique identifier of the collection to update.
 *   - details (Object): The updated collection fields.
 * Returns:
 *   - Object: The parsed JSON response with updated collection data.
 * Throws:
 *   - Error if the user token is missing, or if the API request fails.
 ***************************************************************/

export async function updateCollectionDetails(user, collectionId, details) {
  console.log("Update a collection Request Sent ");

  if (!user?.id_token) {
    throw new Error("User authentication token is missing");
  }

  if (isDebug) {
    console.log("Request to update a collection id: ", collectionId);
    console.log("New info: ", details);
  }

  try {
    const response = await fetch(`${apiUrl}/v1/collections/${collectionId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user.id_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(details),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(
        `API call failed with status ${response.status}: ${errorDetails}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating collection details:", error);
    throw error;
  }
}

/***************************************************************
 * Function: addAssetsToCollection
 * Description: Sends a PATCH request to add one or more assets
 *              to a specific collection using the authenticated user.
 * Parameters:
 *   - user (Object): The authenticated user object containing the ID token.
 *   - collectionId (string): The unique identifier of the collection.
 *   - assetIds (Array<string>): An array of asset UUIDs to add to the collection.
 * Returns:
 *   - Object: The parsed JSON response from the API, typically including
 *             the updated collection or a success status message.
 * Throws:
 *   - Error if the user or ID token is missing, if the request fails,
 *     or if the response status is not OK.
 ***************************************************************/
export async function addAssetsToCollection(user, collectionId, assetIds) {
  console.log("add assets to a collection Request Sent ");

  if (!user?.id_token) {
    throw new Error("User authentication token is missing");
  }

  if (isDebug) {
    console.log("Request to add assets to a collection id: ", collectionId);
    console.log("Asset uuid: ", assetIds);
  }

  // assetIds is an array of asset UUIDs to add.
  try {
    const response = await fetch(`${apiUrl}/v1/collections/${collectionId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user.id_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ assetsToAdd: assetIds }),
    });

    if (isDebug) {
      console.log("Add assets response: ", response);
    }

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(
        `API call failed with status ${response.status}: ${errorDetails}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding assets to collection:", error);
    throw error;
  }
}

/***************************************************************
 * Function: removeAssetsFromCollection
 * Description: Sends a PATCH request to remove one or more assets
 *              from a specific collection using the authenticated user.
 * Parameters:
 *   - user (Object): The authenticated user object containing the ID token.
 *   - collectionId (string): The unique identifier of the collection.
 *   - assetIds (Array<string>): An array of asset UUIDs to remove from the collection.
 * Returns:
 *   - Object: The parsed JSON response from the API, typically including
 *             the updated collection or status message.
 * Throws:
 *   - Error if the user or ID token is missing, if the request fails,
 *     or if the response status is not OK.
 ***************************************************************/
export async function removeAssetsFromCollection(user, collectionId, assetIds) {
  console.log("remove assets from a collection Request Sent ");

  if (!user?.id_token) {
    throw new Error("User authentication token is missing");
  }

  if (isDebug) {
    console.log(
      "Request to remove an assets from a collection id: ",
      collectionId,
    );
    console.log("Asset uuid: ", assetIds);
  }

  // assetIds is an array of asset UUIDs to remove.
  try {
    const response = await fetch(`${apiUrl}/v1/collections/${collectionId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user.id_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ assetsToRemove: assetIds }),
    });

    if (isDebug) {
      console.log("Remove assets response: ", response);
    }

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(
        `API call failed with status ${response.status}: ${errorDetails}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error removing assets from collection:", error);
    throw error;
  }
}

/***************************************************************
 * Function: getCollectionById
 * Description: Sends a GET request to retrieve a specific collection
 *              by its ID using the authenticated user's credentials.
 * Parameters:
 *   - user (Object): The authenticated user object containing the ID token.
 *   - collectionId (string): The unique identifier of the collection to fetch.
 * Returns:
 *   - Object: The parsed JSON response from the API, typically including
 *             the collection data under the "collection" key.
 * Throws:
 *   - Error if the user or ID token is missing, if the API request fails,
 *     or if the response status is not OK.
 ***************************************************************/
export async function getCollection(user, userId, expand = true) {
  if (!user?.id_token) {
    throw new Error("User is not authenticated. Missing id_token.");
  }

  // Construct query parameters
  const queryParams = new URLSearchParams();
  if (userId) queryParams.append("userId", userId);
  if (expand) queryParams.append("expand", "true");

  const url = `${apiUrl}/v1/collections?${queryParams.toString()}`;

  if (isDebug) {
    console.log("getCollection for user:", user);
    console.log("Using URL:", url);
  }

  try {
    const response = await fetch(url, {
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
    if (isDebug) console.log("Fetched Collections Data:", data);

    return data;
  } catch (error) {
    console.error("Error fetching collections:", error);
    throw error;
  }
}

/***************************************************************
 * Function: deleteCollectionById
 * Description: Sends a DELETE request to remove a specific collection
 *              by its ID using the authenticated user's credentials.
 * Parameters:
 *   - user (Object): The authenticated user object containing the ID token.
 *   - collectionId (string): The unique identifier of the collection to delete.
 * Returns:
 *   - Object: The parsed JSON response from the API, usually including
 *             status and a success message.
 * Throws:
 *   - Error if the user or ID token is missing, if the API request fails,
 *     or if the response status is not OK.
 ***************************************************************/
export async function getCollectionById(user, collectionId) {
  if (!user?.id_token) {
    throw new Error("User authentication token is missing");
  }
  try {
    // Append a timestamp to force a fresh fetch
    const url = `${apiUrl}/v1/collections/${collectionId}?_=${new Date().getTime()}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user.id_token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store", // Prevent caching
    });

    if (isDebug)
      console.log("Fetched Collections Data by ID response:", response);

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`API call failed: ${response.status} ${errorDetails}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching collection:", error);
    throw error;
  }
}

/***************************************************************
 * Function: deleteCollectionById
 * Description: Sends a DELETE request to remove a specific collection
 *              by its ID using the authenticated user's credentials.
 * Parameters:
 *   - user (Object): The authenticated user object containing the ID token.
 *   - collectionId (string): The unique identifier of the collection to delete.
 * Returns:
 *   - Object: The parsed JSON response from the API, typically including
 *             a status and confirmation message.
 * Throws:
 *   - Error if the user or ID token is missing, or if the API request fails.
 ***************************************************************/

export async function deleteCollectionById(user, collectionId) {
  console.error("deleteCollectionById was called");

  // Check for valid token
  if (!user?.id_token) {
    throw new Error("User authentication token is missing");
  }

  try {
    const url = `${apiUrl}/v1/collections/${collectionId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.id_token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store", // prevent caching
    });

    if (isDebug) console.log("Delete Collection by ID response:", response);

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`API call failed: ${response.status} ${errorDetails}`);
    }

    // Return the JSON response (e.g., { status: "ok", message: "Collection deleted successfully" })
    return await response.json();
  } catch (error) {
    console.error("Error deleting collection:", error);
    throw error;
  }
}

/****************************************************************
 * Function: getPublicAssets
 * Description: Fetches all public assets from the backend.
 * Parameters:
 *   - user (Object): Contains authentication details, including the ID token.
 * Returns:
 *   - Object: The assets retrieved from the API.
 * Throws:
 *   - Error if the API call fails or returns a non-OK response.
 ****************************************************************/
export async function getPublicAssets(user) {
  try {
    const url = `${apiUrl}/v1/assets?visibility=public&expand=true`;

    const headers = {
      "Content-Type": "application/json",
    };

    // Add auth token if user is provided and authenticated
    if (user?.id_token) {
      headers.Authorization = `Bearer ${user.id_token}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error(
        `API call failed with status: ${response.status}, Details: ${errorDetails}`,
      );
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("public assets", data);

    // Return the status and assets from the API response
    return {
      status: data.status,
      assets: data.assets,
    };
  } catch (error) {
    console.error("Error during getPublicAssets call:", error);
    throw error;
  }
}

/*********************
 * Function: getComments Fetches comments associated with a specific asset from the API.
 * Parameters:
 *   - assetId (string): The unique identifier of the asset for which
 *     comments are being requested.
 * Returns:
 *   - Object: Contains the comments data retrieved from the API.
 * Throws:
 *   - Error if the assetId is missing.
 *   - Error if the API call fails or the response has an unexpected structure.
 * *********************/
export async function getComments(assetId) {
  console.log("getComments: comment Request Sent");

  if (!assetId) {
    throw new Error("Asset ID is missing");
  }
  try {
    console.log("Calling getComments API...");
    // Construct URL with assetId as query parameter
    const response = await fetch(`${apiUrl}/v1/comments?assetId=${assetId}`);

    // Check if the response is OK (status 200-299)
    if (!response.ok) {
      throw new Error(`Failed to fetch comments, status: ${response.status}`);
    }

    // Parse the JSON response from the backend
    const json = await response.json();
    console.log("API response:", json);

    // Check for the expected structure
    if (json.success && json.data && json.data.comments) {
      return json.data;
    } else if (json.comments) {
      return json;
    } else {
      throw new Error("Invalid response structure from getComments API");
    }
  } catch (error) {
    console.error("Error during getComments call:", error);
    throw error;
  }
}

/*********************
 * Function: postComments
 * Description: Posts a new comment for a specific asset to the API.
 * Parameters:
 *   - user: An object representing the authenticated user. Must include a valid `id_token`.
 *   - assetId: A string representing the asset's unique identifier (UUID or ID).
 *   - commentBody: A string containing the text of the comment to be posted.
 * Returns:
 *   - A Promise that resolves to an object containing the HTTP status and the parsed response data.
 * Throws:
 *   - An Error if the user authentication token, assetId, or commentBody is missing,
 *     or if the API call fails.
 * *********************/
export async function postComments(user, assetId, commentBody) {
  console.log("Post a comment Request Sent");

  if (!user?.id_token) {
    throw new Error("User authentication token is missing");
  }
  if (!assetId) {
    throw new Error("Asset ID is missing");
  }
  if (!commentBody) {
    throw new Error("Comment Body is missing");
  }

  if (isDebug) {
    console.log(`Request to post a comment by: ${user.id}
      For asset: ${assetId}
      Comment: ${commentBody}
      `);
  }

  try {
    console.log("Calling post comment API...");

    const response = await fetch(`${apiUrl}/v1/comments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.id_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ assetId, body: commentBody }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error(
        `API call failed with status: ${response.status}, Details: ${errorDetails}`,
      );
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("data from post: ", data);
    return { status: response.status, data };
  } catch (error) {
    console.error("Error during postComments call:", error);
    throw error;
  }
}

/*********************
 * Function: editComment
 * Sends a PATCH request to update an existing comment for the specified user.
 * Parameters:
 *  - user (Object): The authenticated user object containing an id_token.
 *  - commentId (string | number): The unique identifier of the comment to be edited.
 *  - newBody (string): The updated text content of the comment.
 * Returns:
 *  - An object containing:
 *      - status (number): HTTP status code 200 if successful.
 *      - comment (Object): The updated comment object returned from the API.
 * Throws:
 *  - Error if the user, token, comment ID, or new comment body is missing or invalid.
 *  - Error if the request fails or the response structure is invalid.
 *********************/

export async function editComment(user, commentId, newBody) {
  // User is combined user at the front (cognito+prisma)
  if (!user) {
    throw new Error("User is missing");
  }

  if (!user?.id_token) {
    throw new Error("User authentication token is missing");
  }

  if (!commentId) {
    throw new Error("Comment ID is missing");
  }
  if (!newBody || newBody.trim().length === 0) {
    throw new Error("New comment body is required");
  }

  try {
    const response = await fetch(`${apiUrl}/v1/comments/${commentId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user.id_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body: newBody }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update comment, status: ${response.status}`);
    }

    const patchedComment = await response.json();
    console.log("editComment response JSON:", patchedComment);

    // Wrap the returned comment with a status for consistency
    if (patchedComment.status === "ok" && patchedComment.comment) {
      return {
        status: 200,
        comment: patchedComment.comment,
      };
    } else {
      throw new Error("Invalid response structure from update comment API");
    }
  } catch (error) {
    console.error("Error during updateComment call:", error);
    throw error;
  }
}

/****************************************************************
 * Function: deleteComment
 * Description: Sends a DELETE request to remove a specific comment
 *              by its ID using the authenticated user's credentials.
 * Parameters:
 *   - user (Object): The authenticated user object containing the ID token.
 *   - commentId (string): The unique identifier of the comment to delete.
 * Returns:
 *   - Object: The parsed JSON response from the API.
 * Throws:
 *   - Error if the user or ID token is missing, if the commentId is invalid,
 *     or if the API call fails.
 ****************************************************************/

export async function deleteComment(user, commentId) {
  console.error("Calling deleteComment....");
  // User is combined user at the front (cognito+prisma)
  if (!user) {
    throw new Error("User is missing");
  }

  if (!user?.id_token) {
    throw new Error("User authentication token is missing");
  }

  if (!commentId) {
    throw new Error("Comment ID is missing");
  }

  try {
    const url = `${apiUrl}/v1/comments/${commentId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.id_token}`,
        "Content-Type": "application/json",
      },
    });

    if (isDebug) console.log("Delete comment by ID response:", response);

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`API call failed: ${response.status} ${errorDetails}`);
    }

    // Return the JSON response (e.g., { status: "ok", message: "Comment deleted successfully" })
    return await response.json();
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
}

/****************************************************************************************************
 * Function: likeAsset
 * Description: Sends a PATCH request to toggle a like on an asset.
 *              The backend will check if the user has already liked the asset and will remove the like,
 *              or create a like if it doesn't exist.
 * Parameters:
 *   - user (Object): The authenticated user object containing the ID token.
 *   - uuid (string): The unique identifier (UUID) of the asset to like/unlike.
 * Returns:
 *   - Object: The parsed JSON response with updated like count.
 * Throws:
 *   - Error if the user token or UUID is missing, or if the API call fails.
 *****************************************************************************************************/
export async function likeAsset(user, uuid) {
  if (!user?.id_token) {
    throw new Error("User authentication token is missing");
  }

  if (!uuid) {
    throw new Error("Asset UUID is missing");
  }

  try {
    const response = await fetch(`${apiUrl}/v1/assets/${uuid}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user.id_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ like: true }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    console.log("Asset like toggled successfully:", data);
    return data;
  } catch (error) {
    console.error("Error toggling like on asset:", error);
    throw error;
  }
}

/**
 * Function: unlikeAsset
 * Description: Sends a PATCH request to unlike an asset.
 *              This function assumes the asset is already liked and
 *              uses the same backend endpoint (which toggles the like state).
 * Parameters:
 *   - user (Object): The authenticated user object containing the ID token.
 *   - uuid (string): The unique identifier (UUID) of the asset to unlike.
 * Returns:
 *   - Object: The parsed JSON response with updated like count.
 * Throws:
 *   - Error if the user token or UUID is missing, or if the API call fails.
 */
export async function unlikeAsset(user, uuid) {
  if (!user?.id_token) {
    throw new Error("User authentication token is missing");
  }
  if (!uuid) {
    throw new Error("Asset UUID is missing");
  }

  try {
    const response = await fetch(`${apiUrl}/v1/assets/${uuid}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user.id_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ like: true }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    console.log("Asset unliked successfully:", data);
    return data;
  } catch (error) {
    console.error("Error unliking asset:", error);
    throw error;
  }
}
