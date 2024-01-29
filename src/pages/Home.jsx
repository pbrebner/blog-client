import { useState, useEffect } from "react";

import Banner from "../components/Banner.jsx";
import PostCard from "../components/PostCard.jsx";
import PostCardLoader from "../components/PostCardLoader.jsx";

import "./styles/Home.css";

function Home() {
    const [posts, setPosts] = useState(null);
    const [error, setError] = useState(null);

    const [pageLoading, setPageLoading] = useState(false);

    // Fetch all posts and display on "home page"
    useEffect(() => {
        setPageLoading(true);

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
                console.log(data);

                setPageLoading(false);
                setPosts(data);
                setError(null);
            } catch (err) {
                setError(err.message);
                setPosts(null);
                setPageLoading(false);
            }
        }
        getPosts();
    }, []);

    const pageLoadingElements = [];
    for (let i = 0; i < 6; i++) {
        pageLoadingElements.push(
            <PostCardLoader key={i} pageLoading={pageLoading} />
        );
    }

    return (
        <div className="main homePage">
            <Banner />
            {error && (
                <div className="errorContainer">
                    There was problem fetching the data from the server. Please
                    try again later
                </div>
            )}
            <div className="homeMain">
                <div className="postsOuterContainer">
                    {pageLoadingElements}
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
