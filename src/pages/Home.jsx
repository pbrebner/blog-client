import { useState, useEffect } from "react";

import Banner from "../components/Banner.jsx";
import PostCard from "../components/PostCard.jsx";
import PostCardLoader from "../components/PostCardLoader.jsx";

import "./styles/Home.css";

function Home() {
    const [posts, setPosts] = useState(null);
    const [error, setError] = useState(null);

    const [pageLoading, setPageLoading] = useState(true);

    // Fetch all posts and display on "home page"
    useEffect(() => {
        async function getPosts() {
            try {
                const response = await fetch(
                    "https://blog-api-test.fly.dev/api/posts"
                );

                const data = await response.json();
                //console.log(data);

                setTimeout(() => {
                    setPageLoading(false);
                }, "3000");

                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                } else {
                    setPosts(data);
                    setError(null);
                }
            } catch (err) {
                setTimeout(() => {
                    setPageLoading(false);
                }, "3000");

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
                    try again later.
                </div>
            )}
            <div className="homeMain">
                <div className="postsOuterContainer">
                    {pageLoading && <PostCardLoader />}
                    {posts && (
                        <div className="postsContainer">
                            {posts.map((post) => (
                                <div
                                    key={post._id}
                                    className="postCardOuterContainer"
                                >
                                    <PostCard post={post} />
                                    <div className="hl"></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
