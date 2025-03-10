import { MessageSquare } from "lucide-react";
import { useState } from "react";

export default function CommentsSection({ commentCount = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const toggleComments = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mt-4">
      {/* View Comments Button */}
      <button
        onClick={toggleComments}
        className="w-full py-2 bg-gray-800 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2"
      >
        <MessageSquare className="w-4 h-4" />
        View {commentCount} Comments
      </button>

      {/* Comment Section */}
      {isOpen && (
        <div className="mt-4 bg-gray-900 p-4 rounded-lg">
          {/* Placeholder Comment Input */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-grow p-2 text-black rounded-md"
              placeholder="Add a comment..."
              disabled
            />
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
              disabled
            >
              Post
            </button>
          </div>

          {/* Placeholder Comments */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
              <div>
                <p className="text-white font-semibold">Skunkley</p>
                <p className="text-gray-400 text-sm">
                  AI really said, Trust me, I got this, and honestly… Im
                  impressed. 😂🔥
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
              <div>
                <p className="text-white font-semibold">Cyan</p>
                <p className="text-gray-400 text-sm">
                  This is what happens when AI reads my mind… and adds extra
                  drama. 🤖🎭😂
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
