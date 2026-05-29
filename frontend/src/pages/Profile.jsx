export default function Profile() {
  return (
    <div className="p-6">
      <h1>Profile</h1>
      <button
        className="account-avatar-btn"
      >
        <img
          src="/profile-blank.png"
          alt=""
          className="account-avatar"
        />
      </button>
    </div>
  );
}