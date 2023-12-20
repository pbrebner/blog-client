import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

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
    const [deletePostOpen, setDeletePostOpen] = useState(false);

    const { userId } = useParams();

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

    function closeModal() {
        setEditProfileOpen(false);
        setDeletePostOpen(false);
    }

    function toggleEditProfileOpen() {
        editProfileOpen === false
            ? setEditProfileOpen(true)
            : setEditProfileOpen(false);
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
                                            <div className="postCardOuterContainer">
                                                <PostCard
                                                    key={post._id}
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
                    className={`modalBackground ${
                        editProfileOpen || deletePostOpen ? "display" : ""
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
