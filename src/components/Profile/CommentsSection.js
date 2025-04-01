/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { deleteComment, editComment, getComments, postComments } from "@/api";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

export default function CommentsSection({ user, cognitoUser, asset }) {
  const auth = useAuth();
  const router = useRouter();

  // Using to send one obj for user info (token and hashed, token cognito, hashed prisma)
  const combinedUser = { ...user, id_token: cognitoUser.id_token };

  // State for toggling comment section, comment text, and storing comments
  const [isOpen, setIsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  // Additional state for editing a comment
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Function to fetch comments from the API
  const fetchComments = async () => {
    try {
      const assetId = asset?.uuid;
      console.log("getComments assetId: ", assetId);
      const response = await getComments(assetId);
      console.log("assetId:", assetId);
      console.log("response:", response);

      // Now we just check if the response has a comments array
      if (response && response.comments) {
        setComments(response.comments);
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Fetch comments when the component mounts or when asset changes
  useEffect(() => {
    if (asset) {
      fetchComments();
    }
  }, [asset]);

  // Toggle the comment section open/closed
  const toggleComments = () => {
    setIsOpen((prev) => !prev);
  };

  // Handle posting a new comment
  const handlePost = async () => {
    if (!commentText.trim()) return; // ignore empty input
    try {
      const assetId = asset?.uuid || asset?.id;
      const response = await postComments(combinedUser, assetId, commentText);
      if (response && response.status === 201) {
        // Re-fetch comments to update the list
        await fetchComments();
        setCommentText(""); // clear input after successful post
      } else {
        console.error("Failed to post comment. Response:", response);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  // Start editing a comment (only available for comments that are yours)
  const startEditing = (commentId, currentBody) => {
    setEditingCommentId(commentId);
    setEditingText(currentBody);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  // Save the edited comment by calling the editComment API
  const saveEditedComment = async (commentId) => {
    try {
      const response = await editComment(combinedUser, commentId, editingText);
      if ((response && response.status === 200) || response.status === "ok") {
        await fetchComments();
        cancelEditing();
      } else {
        console.error("Failed to edit comment. Response:", response);
      }
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  // Delete a comment (available if the comment is yours or the asset is yours)
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await deleteComment(combinedUser, commentId);
      if (response && response.status === "ok") {
        await fetchComments();
      } else {
        console.error("Failed to delete comment. Response:", response);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Determine ownership for actions
  const currentUserHashedEmail = user?.hashedEmail;
  const assetIsMine = asset?.user?.hashedEmail === currentUserHashedEmail;

  return (
    <div className="mt-4">
      {/* Button to toggle comment section */}
      <button
        onClick={toggleComments}
        className="w-full py-2 bg-gray-800 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2"
      >
        <MessageSquare className="w-4 h-4" />
        View {comments.length} Comments
      </button>

      {isOpen && (
        <div className="mt-4 bg-gray-900 p-4 rounded-lg">
          {/* Comment Input Section */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-grow p-2 text-black rounded-md"
              placeholder="Add a comment..."
            />
            <button
              onClick={handlePost}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Post
            </button>
          </div>

          {/* Comments Display */}
          <div className="space-y-3">
            {comments.length > 0 ? (
              comments.map((comment, index) => {
                // Check if the comment belongs to the current user
                const commentIsMine = comment.userId === currentUserHashedEmail;
                return (
                  <div key={index} className="flex items-start gap-3">
                    {/* Avatar with first letter of displayName */}
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">
                      {comment.userName
                        ? comment.userName.charAt(0).toUpperCase()
                        : "A"}
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        {comment.userName}
                      </p>
                      {editingCommentId === comment.id ? (
                        <>
                          <input
                            type="text"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="p-2 text-black rounded-md mb-1"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEditedComment(comment.id)}
                              className="text-xs text-blue-400 underline"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-xs text-gray-400 underline"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-400 text-sm">{comment.body}</p>
                      )}
                      {/* Render action buttons conditionally */}
                      <div className="mt-1 flex gap-2">
                        {commentIsMine && editingCommentId !== comment.id && (
                          <button
                            onClick={() =>
                              startEditing(comment.id, comment.body)
                            }
                            className="text-xs text-blue-400 underline"
                          >
                            Edit
                          </button>
                        )}
                        {(commentIsMine || assetIsMine) &&
                          editingCommentId !== comment.id && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-xs text-red-400 underline"
                            >
                              Delete
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 text-sm">No comments yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
