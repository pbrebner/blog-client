import "./styles/AppError.css";

function AppError({ error }) {
    return (
        <div className="appError">
            <div>
                There was a problem connecting to the server. Please try again
                later.
            </div>
        </div>
    );
}

export default AppError;
