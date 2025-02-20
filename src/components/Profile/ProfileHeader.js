export default function ProfileHeader({ username, profilePhoto, bio }) {
  return (
    <div className="text-center mb-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={profilePhoto}
        alt={`${username}'s profile`}
        className="w-32 h-32 mx-auto rounded-full shadow-2xl mb-4"
      />
      <h4 className="text-2xl font-bold text-white">{username}</h4>
      <p className="text-sm text-gray-400 italic mt-2">{bio}</p>
      <button
        onClick={() => alert("Placeholder for Edit Profile functionality")}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
      >
        Edit Profile
      </button>
    </div>
  );
}
