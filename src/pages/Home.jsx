import { useState, useEffect } from "react";

function Home() {
    // Fetch all posts and display on "home page"
    useEffect(() => {
        const getPosts = async () => {
            //Try/catch block to fetch data
        };
        getPosts();
    }, []);

    return (
        <div className="main">
            <div>Home Page</div>
        </div>
    );
}

export default Home;
