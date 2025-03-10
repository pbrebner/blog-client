import { useState, useEffect } from "react";

import Banner from "../components/Banner.jsx";
import PostCard from "../components/PostCard.jsx";
import PostCardLoader from "../components/PostCardLoader.jsx";

import "./styles/Home.css";

function Home() {
    const [posts, setPosts] = useState("");

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
                //console.log(data);

                setTimeout(() => {
                    setPageLoading(false);
                }, "3000");

                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                } else {
                    setPosts(data.posts);
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

    return (
        <div className="main homePage">
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
