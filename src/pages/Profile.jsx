import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import ProfileSidebar from "../components/ProfileSidebar";
import PostCard from "../components/PostCard";
import "./styles/Profile.css";

function Profile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

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
                setUser(data);
                setError(null);
            } catch (err) {
                setError(err.message);
                setUser(null);
            }
        }
        getUser();
    }, []);

    return (
        <div className="main profilePage">
            {error && (
                <div className="errorContainer">
                    There was problem fetching the data from the server. Please
                    try again later
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
                    <ProfileSidebar user={user} />
                </div>
            )}
        </div>
    );
}

export default Profile;
