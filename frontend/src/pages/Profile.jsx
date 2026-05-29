import "./Profile.css";

export default function Profile() {
  return (
    <div className="p-6">
      <h1>Profile</h1>
      <div className="profile-avatar-wrap">
        <img
          src="/profile-blank.png"
          alt=""
          className="profile-avatar-large"
        />
      </div>
      <p className="mt-4">Username: johndoe</p>
      <p>Email: johndoe@example.com</p>
    </div>
  );
}