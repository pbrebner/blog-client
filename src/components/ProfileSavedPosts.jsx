import { Link } from "react-router-dom";
import PostCard from "./PostCard";

function ProfileSavedPosts({
    savedPosts,
    usersProfile,
    deletePostOpen,
    setDeletePostOpen,
    numPosts,
    setNumPosts,
}) {
    async function handleDeletePostSubmit(postId) {
        // Need to add a try/catch to handle errors and display in form
        const response = await fetch(
            `https://blog-api-test.fly.dev/api/posts/${postId}`,
            {
                method: "delete",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        console.log(response);

        const result = await response.json();
        console.log(result);

        if (response.ok) {
            let val = numPosts - 1;
            setNumPosts(val);
        }
    }

    function handleEditPostSubmit(postId) {}

    return (
        <>
            <div className="savedPosts">
                <h4>Saved Posts</h4>
                {savedPosts.map((post) => (
                    <div key={post._id} className="postCardOuterContainer">
                        <PostCard post={post} />
                        {usersProfile && (
                            <>
                                <button
                                    onClick={() =>
                                        handleDeletePostSubmit(post._id)
                                    }
                                    className="deletePostBtn"
                                >
                                    Delete {post._id}
                                </button>
                                <Link
                                    to={`/posts/${post._id}/edit`}
                                    className="editPostLink"
                                >
                                    Edit
                                </Link>
                            </>
                        )}
                        <div className="hl"></div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default ProfileSavedPosts;
