import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

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
                <div className="userContainer">
                    <h3>{user.name}</h3>
                    <p>{user.username}</p>
                </div>
            )}
        </div>
    );
}

export default Profile;
