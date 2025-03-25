import "./styles/ViewUser.css";

export default function ViewUser({ user }) {
  if (!user) {
    return <div className="view-user"><h2>Select a user to view details</h2></div>;
  }

  return (
    <div className="view-user">
      <h2>User Profile</h2>
      <div className="user-details">
        <h3>Email: {user.email}</h3>
        <h3>Role: {user.role}</h3>
        <h3>ID: {user._id}</h3>
      </div>
    </div>
  );
}
