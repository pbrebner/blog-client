import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

import TopPosts from "../components/TopPosts.jsx";
import Banner from "../components/Banner.jsx";
import PostCard from "../components/PostCard.jsx";
import PostCardLoader from "../components/PostCardLoader.jsx";

import "./styles/Home.css";

function Home() {
    const [posts, setPosts] = useState("");
    const [topPosts, setTopPosts] = useState("");

    const [pageLoading, setPageLoading] = useState(true);
    const [loggedIn, setLoggedIn, setError] = useOutletContext();

    // Fetch all posts and display on "home page"
    useEffect(() => {
        async function getPosts() {
            try {
                const response = await fetch(
                    "https://blog-api-test.fly.dev/api/posts"
                );

                const data = await response.json();
                console.log(data);

                setTimeout(() => {
                    setPageLoading(false);
                }, "2000");

                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                } else if (data.posts) {
                    setPosts(data.posts);
                    setTopPosts(getTopPosts(data.posts));
                    setError("");
                }
            } catch (err) {
                setTimeout(() => {
                    setPageLoading(false);
                }, "3000");

                setError(err.message);
                setPosts("");
            }
        }
        getPosts();
    }, []);

    function compare(a, b) {
        if (a.likes < b.likes) {
            return 1;
        }
        if (a.likes > b.likes) {
            return -1;
        }
        return 0;
    }

    function getTopPosts(posts) {
        posts.sort(compare);

        console.log(posts.slice(0, 3));

        return posts.slice(0, 4);
    }

    return (
        <div className="main homePage">
            {posts && (
                <div className="homeSupp">
                    <div className="topPostsOuterContainer">
                        <h2>Top Posts</h2>
                        <TopPosts topPosts={topPosts} />
                    </div>
                </div>
            )}
            <Banner />
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
