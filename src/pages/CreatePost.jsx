import { Link } from "react-router-dom";

// TODO: Add action to form (url of API)
function CreatePost() {
    return (
        <div className="main">
            <h2>Create Post Page</h2>

            <form action="" method="post">
                <div className="formElement">
                    <label htmlFor="title">Title: </label>
                    <input type="text" name="title" id="title" required />
                </div>
                <div className="formElement">
                    <label htmlFor="content">Content: </label>
                    <input type="text" name="content" id="content" required />
                </div>
                <div className="formElement">
                    <button type="submit">Publish</button>
                </div>
            </form>
            <p>
                Back to <Link to="/">Home</Link>
            </p>
        </div>
    );
}

export default CreatePost;
