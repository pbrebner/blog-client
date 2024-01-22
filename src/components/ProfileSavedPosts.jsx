import { useState } from "react";
import { Link } from "react-router-dom";

import PostCard from "./PostCard";
import Button from "../components/Button";

function ProfileSavedPosts({
    savedPosts,
    usersProfile,
    deletePostOpen,
    setDeletePostOpen,
    numPosts,
    setNumPosts,
}) {
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    async function handleDeletePostSubmit(postId) {
        setShowLoader(true);

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
            setShowLoader(false);
        }
    }

    function togglePostDelete() {
        confirmDeleteOpen === true
            ? setConfirmDeleteOpen(false)
            : setConfirmDeleteOpen(true);
    }

    return (
        <>
            {savedPosts.length > 0 ? (
                <div className="savedPosts">
                    {savedPosts.map((post) => (
                        <div key={post._id} className="postCardOuterContainer">
                            <PostCard post={post} />
                            {usersProfile && (
                                <div className="postBtns">
                                    <button
                                        onClick={togglePostDelete}
                                        className={`postDeleteBtn postBtn ${
                                            confirmDeleteOpen ? "" : "display"
                                        }`}
                                    >
                                        Delete
                                    </button>
                                    <div
                                        className={`postDeleteConfirm ${
                                            confirmDeleteOpen ? "display" : ""
                                        }`}
                                    >
                                        <Button
                                            styleRef="postDeleteConfirmBtn postBtn"
                                            text="Confirm"
                                            onClick={() =>
                                                handleDeletePostSubmit(post._id)
                                            }
                                            loading={showLoader}
                                            disabled={showLoader}
                                        />
                                        <button
                                            className="postDeleteCancelBtn postBtn"
                                            onClick={togglePostDelete}
                                            disabled={showLoader}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                    <Link
                                        to={`/posts/${post._id}/edit`}
                                        className="editPostLink"
                                        disabled={showLoader}
                                    >
                                        Edit
                                    </Link>
                                </div>
                            )}
                            <div className="hl"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>You don't have any drafts.</p>
            )}
        </>
    );
}

export default ProfileSavedPosts;
