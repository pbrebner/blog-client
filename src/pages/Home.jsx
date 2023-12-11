import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Banner from "../components/Banner.jsx";
import PostCard from "../components/PostCard.jsx";

import "./styles/Home.css";

function Home() {
    const [posts, setPosts] = useState(null);
    const [error, setError] = useState(null);

    // Fetch all posts and display on "home page"
    useEffect(() => {
        async function getPosts() {
            try {
                const response = await fetch(
                    "https://blog-api-test.fly.dev/api/posts"
                );

                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                }

                const data = await response.json();
                setPosts(data);
                setError(null);
            } catch (err) {
                setError(err.message);
                setPosts(null);
            }
        }
        getPosts();
    }, []);

    return (
        <div className="main homePage">
            <Banner />
            {error && (
                <div className="errorContainer">
                    There was problem fetching the data from the server. Please
                    try again later
                </div>
            )}
            {posts && (
                <div className="postsContainer">
                    {posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;
