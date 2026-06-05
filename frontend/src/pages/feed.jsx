import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Feed.css";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [comments, setComments] = useState({});
  const [openPostId, setOpenPostId] = useState(null);
  const [feedType, setFeedType] = useState("all");
  const navigate = useNavigate();

  const loadFeed = () => {
    const url =
      feedType === "following"
        ? "/api/posts/feed/following"
        : "/api/posts/feed";

    fetch(url, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPosts(data.posts);
        }
      });
  };

  useEffect(() => {
    loadFeed();
  }, [feedType]);

  const handleLike = (postId) => {
    // 1. Instantly update the UI state optimistically
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post._id === postId) {
          const liked = !post.likedByMe;
          const currentCount = post.LikeCount ?? 0;
          return {
            ...post,
            likedByMe: liked,
            LikeCount: liked ? currentCount + 1 : Math.max(0, currentCount - 1),
          };
        }
        return post;
      })
    );

    // 2. Perform the server call in the background without blocking the UI
    fetch(`/api/posts/${postId}/like`, {
      method: "POST",
      credentials: "include",
    }).catch((err) => {
      console.error("Failed to toggle like on server:", err);
      // Rollback to server state if the request fails
      loadFeed();
    });
  };

  const handleComment = async (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ text }),
    });

    const data = await res.json();

    setComments((prev) => ({
      ...prev,
      [postId]: [data.comment, ...(prev[postId] || [])],
    }));

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  const loadComments = async (postId) => {
    const res = await fetch(`/api/posts/${postId}/comments`, {
      credentials: "include",
    });
    const data = await res.json();

    setComments((prev) => ({
      ...prev,
      [postId]: data.comments,
    }));

    setOpenPostId(postId);
  };

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h3 className="feed-logo" onClick={() => navigate("/app/feed")}>
          MySocial
        </h3>
        
        <div className="feed-tabs">
          <button
            className={`tab-button ${feedType === "all" ? "active" : ""}`}
            onClick={() => setFeedType("all")}
            disabled={feedType === "all"}
          >
            All
          </button>

          <button
            className={`tab-button ${feedType === "following" ? "active" : ""}`}
            onClick={() => setFeedType("following")}
            disabled={feedType === "following"}
          >
            Following
          </button>
        </div>

        <button className="profile-button" onClick={() => navigate("/app/profile")}>
          👤
        </button>
      </div>

      <div className="posts-list">
        {posts.map((post) => (
          <div key={post._id} className="post-card">
            <div className="post-header">
              <strong
                className="post-author"
                onClick={() => navigate(`/app/profile/${post.user._id}`)}
              >
                {post.user.name}
              </strong>
            </div>

            {post.image && (
              <div className="post-image-container">
                <img
                  src={post.image}
                  alt="post"
                  className="post-image"
                />
              </div>
            )}

            {post.content && <p className="post-content">{post.content}</p>}

            <div className="post-actions">
              <button
                onClick={() => handleLike(post._id)}
                className={`action-button like-button ${post.likedByMe ? "liked" : ""}`}
              >
                ❤️ {post.LikeCount ?? post.likeCount ?? 0}
              </button>

              <span className="comment-count">
                💬 {post.CommentCount ?? post.commentCount ?? 0}
              </span>
            </div>

            <div className="comments-section">
              <button
                className="view-comments-button"
                onClick={() =>
                  openPostId === post._id
                    ? setOpenPostId(null)
                    : loadComments(post._id)
                }
              >
                {openPostId === post._id ? "Close comments" : "View comments"}
              </button>

              {openPostId === post._id && (
                <div className="comments-list">
                  {comments[post._id]?.map((c) => (
                    <p key={c._id} className="comment">
                      <strong
                        className="comment-author"
                        onClick={() => navigate(`/app/profile/${c.user._id}`)}
                      >
                        {c.user.name}:
                      </strong>{" "}
                      {c.text}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="add-comment">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentInputs[post._id] ?? ""}
                onChange={(e) =>
                  setCommentInputs((prev) => ({
                    ...prev,
                    [post._id]: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleComment(post._id);
                  }
                }}
                className="comment-input"
              />
              <button
                type="button"
                onClick={() => handleComment(post._id)}
                disabled={!commentInputs[post._id]?.trim()}
                className="send-button"
              >
                Send
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;