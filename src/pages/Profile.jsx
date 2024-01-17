import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";

import ProfileSavedPosts from "../components/ProfileSavedPosts";
import ProfilePubPosts from "../components/ProfilePubPosts";
import ProfileSidebar from "../components/ProfileSidebar";
import PostCard from "../components/PostCard";
import "./styles/Profile.css";

function Profile() {
    const [user, setUser] = useState(null);
    const [usersProfile, setUsersProfile] = useState(null);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [userDescription, setUserDescription] = useState("");

    const [publishedPosts, setPublishedPosts] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);
    const [numPosts, setNumPosts] = useState(0);

    const [showSavedPosts, setShowSavedPosts] = useState(false);

    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [deleteProfileOpen, setDeleteProfileOpen] = useState(false);
    const [deletePostOpen, setDeletePostOpen] = useState(false);

    const [error, setError] = useState(null);

    const { userId } = useParams();
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useOutletContext();

    // Fetch the post and display contents
    useEffect(() => {
        async function getUser() {
            try {
                const response = await fetch(
                    `https://blog-api-test.fly.dev/api/users/${userId}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                }

                const data = await response.json();
                console.log(data);

                setUser(data.user);
                setUsersProfile(data.usersProfile);
                setName(data.user.name);
                setUsername(data.user.username);
                setUserDescription(data.user.userDescription);

                let publishedPostsTemp = [];
                let savedPostsTemp = [];

                data.user.posts.map((post) => {
                    if (post.published == true) {
                        publishedPostsTemp.push(post);
                    } else {
                        savedPostsTemp.push(post);
                    }
                });

                setSavedPosts(savedPostsTemp);
                setPublishedPosts(publishedPostsTemp);
                setNumPosts(data.user.posts.length);

                setError(null);
            } catch (err) {
                setError(err.message);
                setUser(null);
                setUsersProfile(null);
            }
        }
        getUser();
    }, [editProfileOpen, numPosts]);

    async function handleEditProfileSubmit(e) {
        e.preventDefault();

        const formData = JSON.stringify({
            name: e.target.name.value,
            username: e.target.username.value,
            userDescription: e.target.userDescription.value,
        });

        // Need to add a try/catch to handle errors and display in form
        const response = await fetch(
            `https://blog-api-test.fly.dev/api/users/${user._id}`,
            {
                method: "put",
                body: formData,
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
            setEditProfileOpen(false);
        }
    }

    async function handleDeleteProfileSubmit(e) {
        e.preventDefault();

        // Need to add a try/catch to handle errors and display in form
        const response = await fetch(
            `https://blog-api-test.fly.dev/api/users/${user._id}`,
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
            localStorage.clear();
            setLoggedIn(false);
            navigate("/");
        }
    }

    function togglePostDisplay() {
        showSavedPosts === false
            ? setShowSavedPosts(true)
            : setShowSavedPosts(false);
    }

    function closeModal() {
        setEditProfileOpen(false);
        setDeleteProfileOpen(false);
        setDeletePostOpen(false);
    }

    function toggleEditProfileOpen() {
        editProfileOpen === false
            ? setEditProfileOpen(true)
            : setEditProfileOpen(false);
    }

    function toggleDeleteProfileOpen() {
        deleteProfileOpen === false
            ? setDeleteProfileOpen(true)
            : setDeleteProfileOpen(false);
    }

    if (usersProfile) {
        return (
            <>
                <div className="main profilePage">
                    {error && (
                        <div className="errorContainer">
                            There was problem fetching the data from the server.
                            Please try again later
                        </div>
                    )}
                    {user && (
                        <div className="profileContainer">
                            <div className="profileMain">
                                <h2 className="profileHeader">{user.name}</h2>
                                <div className="postDisplayBtns">
                                    <button
                                        onClick={togglePostDisplay}
                                        className={`postDisplayBtn ${
                                            showSavedPosts ? "" : "selected"
                                        }`}
                                    >
                                        Pulished
                                    </button>
                                    <button
                                        onClick={togglePostDisplay}
                                        className={`postDisplayBtn ${
                                            showSavedPosts ? "selected" : ""
                                        }`}
                                    >
                                        Saved
                                    </button>
                                </div>
                                <div className="hl"></div>
                                {user.posts.length > 0 ? (
                                    <div className="postsContainer">
                                        {showSavedPosts && (
                                            <ProfileSavedPosts
                                                savedPosts={savedPosts}
                                                usersProfile={usersProfile}
                                                deletePostOpen={deletePostOpen}
                                                setDeletePostOpen={
                                                    setDeletePostOpen
                                                }
                                                numPosts={numPosts}
                                                setNumPosts={setNumPosts}
                                            />
                                        )}
                                        {!showSavedPosts && (
                                            <ProfilePubPosts
                                                publishedPosts={publishedPosts}
                                                usersProfile={usersProfile}
                                                deletePostOpen={deletePostOpen}
                                                setDeletePostOpen={
                                                    setDeletePostOpen
                                                }
                                                numPosts={numPosts}
                                                setNumPosts={setNumPosts}
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <div>You haven't made any posts yet.</div>
                                )}
                            </div>
                            <div className="vl"></div>
                            <ProfileSidebar
                                user={user}
                                usersProfile={usersProfile}
                                toggleEditProfileOpen={toggleEditProfileOpen}
                                toggleDeleteProfileOpen={
                                    toggleDeleteProfileOpen
                                }
                            />
                        </div>
                    )}
                </div>
                <div
                    className={`editProfileModal ${
                        editProfileOpen ? "display" : ""
                    }`}
                >
                    <button onClick={closeModal} className="closeModalBtn">
                        &#10005;
                    </button>
                    <div className="profileModalContent">
                        <div className="profileModalHeader">
                            <p>Profile Information</p>
                        </div>
                        <form
                            onSubmit={handleEditProfileSubmit}
                            className="profileModalForm"
                        >
                            <div className="formElement">
                                <label htmlFor="name">Name: </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="formElement">
                                <label htmlFor="username">Username: </label>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="formElement">
                                <label htmlFor="userDescription">Bio: </label>
                                <textarea
                                    name="userDescription"
                                    id="userDescription"
                                    rows={15}
                                    maxLength={300}
                                    value={userDescription}
                                    onChange={(e) =>
                                        setUserDescription(e.target.value)
                                    }
                                />
                            </div>
                            <div className="formElement">
                                <button type="submit" className="submitBtn">
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div
                    className={`deleteProfileModal ${
                        deleteProfileOpen ? "display" : ""
                    }`}
                >
                    <button onClick={closeModal} className="closeModalBtn">
                        &#10005;
                    </button>
                    <div className="profileModalContent">
                        <h2 className="profileModalHeader">Delete Profile</h2>
                        <p>
                            Deletion is not reversible, and the profile will be
                            completely deleted.
                        </p>
                        <button
                            onClick={handleDeleteProfileSubmit}
                            className="deleteProfileConfirm"
                        >
                            Delete
                        </button>
                    </div>
                </div>
                <div
                    className={`modalBackground ${
                        editProfileOpen || deleteProfileOpen || deletePostOpen
                            ? "display"
                            : ""
                    }`}
                    onClick={closeModal}
                ></div>
            </>
        );
    } else {
        return (
            <div className="main profilePage">
                {error && (
                    <div className="errorContainer">
                        There was problem fetching the data from the server.
                        Please try again later
                    </div>
                )}
                {user && (
                    <div className="profileContainer">
                        <div className="profileMain">
                            <h2 className="profileHeader">{user.name}</h2>
                            <div className="hl"></div>
                            {publishedPosts.length > 0 ? (
                                <div className="postsContainer">
                                    {publishedPosts.map((post) => (
                                        <PostCard key={post._id} post={post} />
                                    ))}
                                </div>
                            ) : (
                                <div>This user hasn't made any posts yet.</div>
                            )}
                        </div>
                        <div className="vl"></div>
                        <ProfileSidebar
                            user={user}
                            usersProfile={usersProfile}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default Profile;
