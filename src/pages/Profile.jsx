import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";

import ProfileSavedPosts from "../components/ProfileSavedPosts";
import ProfilePubPosts from "../components/ProfilePubPosts";
import ProfileSidebar from "../components/ProfileSidebar";
import PostCard from "../components/PostCard";
import Button from "../components/Button";
import PageLoader from "../components/PageLoader";
import "./styles/Profile.css";

function Profile() {
    const [user, setUser] = useState(null);
    const [usersProfile, setUsersProfile] = useState(null);

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [userDescription, setUserDescription] = useState("");
    const [avatar, setAvatar] = useState("");

    const [publishedPosts, setPublishedPosts] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);
    const [numPosts, setNumPosts] = useState(0);

    const [showSavedPosts, setShowSavedPosts] = useState(false);

    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [deleteProfileOpen, setDeleteProfileOpen] = useState(false);

    const [showLoader, setShowLoader] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const [formError, setFormError] = useState("");
    const [error, setError] = useState("");

    const [guestProfile, setGuestProfile] = useState(false);

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

                const data = await response.json();
                //console.log(data);

                setTimeout(() => {
                    setPageLoading(false);
                }, "1500");

                if (response.status == 401) {
                    setLoggedIn(false);
                    navigate("/blog-client/account/login", {
                        state: {
                            message: "Please sign-in to view this content.",
                        },
                    });
                } else if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                } else {
                    setUser(data.user);
                    setUsersProfile(data.usersProfile);

                    setName(data.user.name);
                    setUsername(data.user.username);
                    setUserDescription(data.user.userDescription);

                    if (data.user.username == "jimsmith@example.com") {
                        setGuestProfile(true);
                    }

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

                    setError("");
                }
            } catch (err) {
                setTimeout(() => {
                    setPageLoading(false);
                }, "1500");

                setError(err.message);
                setUser(null);
                setUsersProfile(null);
            }
        }
        getUser();
    }, [editProfileOpen, numPosts, userId]);

    async function handleEditProfileSubmit(e) {
        e.preventDefault();
        setShowLoader(true);

        setFormError("");
        setError("");

        let formData = {};

        if (avatar) {
            const file = avatar;

            // Get secure url from our server
            const accessUrlRequest = await fetch(
                "https://blog-api-test.fly.dev/api/s3Url",
                {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            const accessUrl = await accessUrlRequest.json();

            // post the image directly to the s3 bucket
            await fetch(accessUrl.url, {
                method: "put",
                body: file,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const imageUrl = accessUrl.url.split("?")[0];

            // Set form data for request to server
            formData = JSON.stringify({
                avatar: imageUrl,
                name: name,
                username: username,
                userDescription: userDescription,
            });
        } else {
            formData = JSON.stringify({
                name: name,
                username: username,
                userDescription: userDescription,
            });
        }

        // Send request to update the user
        try {
            const response = await fetch(
                `https://blog-api-test.fly.dev/api/users/${user._id}`,
                {
                    method: "put",
                    body: formData,
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            const result = await response.json();
            //console.log(result);

            setShowLoader(false);

            // Catch any errors
            if (response.status == 401) {
                setLoggedIn(false);
                navigate("/blog-client/account/login", {
                    state: {
                        message: "Please sign-in to perform this action.",
                    },
                });
            } else if (response.status == 400) {
                setFormError(result.errors);
            } else if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            } else {
                // User update successful
                setEditProfileOpen(false);
                setAvatar("");
            }
        } catch (err) {
            setEditProfileOpen(false);
            setError(err.message);
            setShowLoader(false);
        }
    }

    async function handleDeleteProfileSubmit(e) {
        e.preventDefault();
        setError("");

        if (!guestProfile) {
            setShowLoader(true);

            try {
                const response = await fetch(
                    `https://blog-api-test.fly.dev/api/users/${user._id}`,
                    {
                        method: "delete",
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );

                const result = await response.json();
                //console.log(result);

                setShowLoader(false);

                if (response.status == 401) {
                    setLoggedIn(false);
                    navigate("/blog-client/account/login", {
                        state: {
                            message: "Please sign-in to perform this action.",
                        },
                    });
                } else if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                } else {
                    localStorage.clear();
                    setLoggedIn(false);
                    navigate("/blog-client");
                }
            } catch (err) {
                setDeleteProfileOpen(false);
                setError(err.message);
                setShowLoader(false);
            }
        } else {
            setDeleteProfileOpen(false);
            alert(
                "Normally this would of deleted the profile and redirected you to the home page. Unfortunately, guest profiles can't be deleted."
            );
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

        setFormError("");
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
                    {pageLoading && <PageLoader />}
                    {error && (
                        <div className="errorContainer">
                            There was problem handling your request. Please try
                            again later.
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
                                        Drafts
                                    </button>
                                </div>
                                <div className="hl"></div>
                                {user.posts.length > 0 ? (
                                    <div className="postsContainer">
                                        {showSavedPosts && (
                                            <ProfileSavedPosts
                                                savedPosts={savedPosts}
                                                usersProfile={usersProfile}
                                                numPosts={numPosts}
                                                setNumPosts={setNumPosts}
                                            />
                                        )}
                                        {!showSavedPosts && (
                                            <ProfilePubPosts
                                                publishedPosts={publishedPosts}
                                                usersProfile={usersProfile}
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
                    <div className="modalContent">
                        <h2 className="modalHeader">Profile Information</h2>
                        <form className="editProfileForm modalForm">
                            <div className="formElement">
                                <label htmlFor="avatar">Profile Image: </label>
                                <input
                                    type="file"
                                    name="avatar"
                                    id="avatar"
                                    accept="image/*"
                                    file={avatar}
                                    onChange={(e) =>
                                        setAvatar(e.target.files[0])
                                    }
                                />
                            </div>
                            <div className="formElement">
                                <label htmlFor="name">Name: </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="formElement">
                                <label htmlFor="username">Username: </label>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    disabled={guestProfile}
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                />
                            </div>
                            <div className="formElement">
                                <label htmlFor="userDescription">Bio: </label>
                                <textarea
                                    name="userDescription"
                                    id="userDescription"
                                    rows={8}
                                    maxLength={300}
                                    value={userDescription}
                                    onChange={(e) =>
                                        setUserDescription(e.target.value)
                                    }
                                />
                            </div>
                            <div className="formElement">
                                <Button
                                    text="Update"
                                    onClick={handleEditProfileSubmit}
                                    loading={showLoader}
                                    disabled={showLoader}
                                />
                            </div>
                            {formError && (
                                <div className="formErrorContainer">
                                    <ul className="formErrorList">
                                        {formError.map((error, index) => (
                                            <li
                                                key={index}
                                                className="formError"
                                            >
                                                {error.msg}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
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
                    <div className="modalContent">
                        <h2 className="modalHeader">Delete Profile?</h2>
                        <p>
                            Deletion is not reversible, and the profile will be
                            completely deleted.
                        </p>
                        <Button
                            styleRef="deleteProfileConfirm"
                            text="Delete"
                            onClick={handleDeleteProfileSubmit}
                            loading={showLoader}
                            disabled={showLoader}
                        />
                    </div>
                </div>
                <div
                    className={`overlay ${
                        editProfileOpen || deleteProfileOpen ? "display" : ""
                    }`}
                    onClick={closeModal}
                ></div>
            </>
        );
    } else {
        return (
            <div className="main profilePage">
                {pageLoading && <PageLoader />}
                {error && (
                    <div className="errorContainer">
                        There was problem handling your request. Please try
                        again later.
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
