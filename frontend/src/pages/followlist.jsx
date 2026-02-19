import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/FollowList.css";

function FollowList() {
  const { id, type } = useParams();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/users/${id}/${type}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUsers(data.users);
      });
  }, [id, type]);

  return (
    <div className="followlist-container">
      <div className="followlist-header">
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        
        <h3 className="followlist-title">
          {type === "followers" ? "Followers" : "Following"}
        </h3>
      </div>

      <div className="users-list">
        {users.length === 0 ? (
          <div className="empty-state">
            <p>No {type === "followers" ? "followers" : "following"} yet</p>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="user-item"
              onClick={() => navigate(`/app/profile/${user._id}`)}
            >
              <div className="user-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-handle">@{user.name.toLowerCase().replace(/\s+/g, '')}</span>
              </div>

              <div className="arrow-icon">→</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FollowList;