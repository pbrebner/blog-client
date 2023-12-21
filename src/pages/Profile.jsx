import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ProfileSidebar from "../components/ProfileSidebar";
import PostCard from "../components/PostCard";
import "./styles/Profile.css";

function Profile() {
    const [user, setUser] = useState(null);
    const [usersProfile, setUsersProfile] = useState(null);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState(null);
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [deleteProfileOpen, setDeleteProfileOpen] = useState(false);
    const [deletePostOpen, setDeletePostOpen] = useState(false);

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
                setError(null);
            } catch (err) {
                setError(err.message);
                setUser(null);
                setUsersProfile(null);
            }
        }
        getUser();
    }, [editProfileOpen, deletePostOpen]);

    async function handleEditProfileSubmit(e) {
        e.preventDefault();

        const formData = JSON.stringify({
            name: e.target.name.value,
            username: e.target.username.value,
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
                                <div className="hl"></div>
                                <h3>Drafts? Ability to edit and delete</h3>
                                {user.posts.length > 0 ? (
                                    <div className="postsContainer">
                                        {user.posts.map((post) => (
                                            <div
                                                key={post._id}
                                                className="postCardOuterContainer"
                                            >
                                                <PostCard
                                                    post={post}
                                                    usersProfile={usersProfile}
                                                    deletePostOpen={
                                                        deletePostOpen
                                                    }
                                                    setDeletePostOpen={
                                                        setDeletePostOpen
                                                    }
                                                />
                                                <div className="hl"></div>
                                            </div>
                                        ))}
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
                            {user.posts.length > 0 ? (
                                <div className="postsContainer">
                                    {user.posts.map((post) => (
                                        <PostCard key={post._id} post={post} />
                                    ))}
                                </div>
                            ) : (
                                <div>You haven't made any posts yet.</div>
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
