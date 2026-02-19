import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/profile.css";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [posts, setPosts] = useState([]);

  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState("");

  const isMyProfile = !id || currentUserId === id;

  useEffect(() => {
    fetch("/api/users/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setCurrentUserId(data.user._id));

    fetch(isMyProfile ? "/api/users/me" : `/api/users/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setBioText(data.user.bio || "");
      });

    fetch(isMyProfile ? "/api/posts/user/me" : `/api/posts/user/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setPosts(data.posts));

    if (!isMyProfile) {
      fetch(`/api/users/${id}/follow-status`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setIsFollowing(data.following));
    }
  }, [id, isMyProfile]);

  useEffect(() => {
    if (!user) return;

    const profileUserId = isMyProfile ? user._id : id;

    fetch(`/api/users/${profileUserId}/follow-count`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setFollowersCount(data.followersCount);
        setFollowingCount(data.followingCount);
      });
  }, [user, id]);

  const createPost = async () => {
    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);

    await fetch("/api/posts", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    setContent("");
    setImage(null);

    const res = await fetch("/api/posts/user/me", {
      credentials: "include",
    });
    const data = await res.json();
    setPosts(data.posts);
  };

  const saveBio = async () => {
    const res = await fetch("/api/users/me/bio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ bio: bioText }),
    });

    const data = await res.json();
    setUser((prev) => ({ ...prev, bio: data.bio }));
    setIsEditingBio(false);
  };

  const handleFollow = async () => {
    const res = await fetch(`/api/users/${id}/follow`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();
    setIsFollowing(data.followed);

    const countRes = await fetch(`/api/users/${id}/follow-count`, {
      credentials: "include",
    });
    const countData = await countRes.json();
    setFollowersCount(countData.followersCount);
  };

  const deletePost = async (postId) => {
    const res = await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      setPosts(posts.filter((p) => p._id !== postId));
    }
  };

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          
          <div className="profile-details">
            <h2 className="profile-name">{user.name}</h2>

            {isEditingBio ? (
              <div className="bio-edit">
                <textarea
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  maxLength={150}
                  className="bio-textarea"
                  placeholder="Tell us about yourself..."
                />
                <div className="bio-actions">
                  <button onClick={saveBio} className="save-bio-button">
                    Save Bio
                  </button>
                  <button
                    onClick={() => setIsEditingBio(false)}
                    className="cancel-bio-button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="bio-display">
                <p className="bio-text">{user.bio || "No bio yet"}</p>
                {isMyProfile && (
                  <button
                    onClick={() => setIsEditingBio(true)}
                    className="edit-bio-button"
                  >
                    ✏️ Edit Bio
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="follow-stats">
          <div
            className="stat-item"
            onClick={() => navigate(`/app/profile/${user._id}/followers`)}
          >
            <span className="stat-number">{followersCount}</span>
            <span className="stat-label">Followers</span>
          </div>

          <div
            className="stat-item"
            onClick={() => navigate(`/app/profile/${user._id}/following`)}
          >
            <span className="stat-number">{followingCount}</span>
            <span className="stat-label">Following</span>
          </div>

          <div className="stat-item">
            <span className="stat-number">{posts.length}</span>
            <span className="stat-label">Posts</span>
          </div>
        </div>

        {!isMyProfile && (
          <button
            onClick={handleFollow}
            className={`follow-button ${isFollowing ? "following" : ""}`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>

      {isMyProfile && (
        <div className="create-post-section">
          <h3 className="section-title">Create New Post</h3>
          
          <div className="image-upload">
            <label className="upload-label">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="file-input"
              />
              <span className="upload-text">
                {image ? `📷 ${image.name}` : "📷 Choose an image"}
              </span>
            </label>
          </div>

          <textarea
            placeholder="Write a caption..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="caption-textarea"
          />

          <button onClick={createPost} className="post-button">
            Post
          </button>
        </div>
      )}

      <div className="posts-section">
        <h3 className="section-title">
          {isMyProfile ? "My Posts" : `${user.name}'s Posts`}
        </h3>
        
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post._id} className="post-item">
              {post.image && (
                <div className="post-image-wrapper">
                  <img
                    src={post.image}
                    alt="post"
                    className="post-image"
                  />
                </div>
              )}

              {post.content && <p className="post-caption">{post.content}</p>}

              {isMyProfile && (
                <button
                  onClick={() => deletePost(post._id)}
                  className="delete-button"
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="no-posts">
            <p>No posts yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;