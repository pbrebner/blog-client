import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import ProfileSidebar from "../components/ProfileSidebar";
import PostCard from "../components/PostCard";
import "./styles/Profile.css";

function Profile() {
    const [user, setUser] = useState(null);
    const [usersProfile, setUsersProfile] = useState(null);
    const [error, setError] = useState(null);
    const [editProfileOpen, setEditProfileOpen] = useState(false);

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
                setError(null);
            } catch (err) {
                setError(err.message);
                setUser(null);
                setUsersProfile(null);
            }
        }
        getUser();
    }, [editProfileOpen]);

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
            e.target.name.value = "";
            e.target.username.value = "";
        }
    }

    function closeModal() {
        setEditProfileOpen(false);
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
                                            <PostCard
                                                key={post._id}
                                                post={post}
                                            />
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
                    className={`editProfileTab ${
                        editProfileOpen ? "display" : ""
                    }`}
                >
                    <div className="editProfileHeader">
                        <p>Profile Information</p>
                        <button onClick={closeModal} className="closeTabBtn">
                            &#10005;
                        </button>
                    </div>
                    <form
                        onSubmit={handleEditProfileSubmit}
                        className="editProfileForm"
                    >
                        <div className="formElement">
                            <label htmlFor="name">Name: </label>
                            <input type="text" name="name" id="name" required />
                        </div>
                        <div className="formElement">
                            <label htmlFor="username">Username: </label>
                            <input
                                type="text"
                                name="username"
                                id="username"
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
                <div
                    className={`modalBackground ${
                        editProfileOpen ? "display" : ""
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
