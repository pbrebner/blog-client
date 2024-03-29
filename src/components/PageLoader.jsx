import loadingIcon from "../assets/icons/iconFull.svg";
import "./styles/PageLoader.css";

function PageLoader() {
    return (
        <div className="pageLoadingContainer">
            <div className="pageLoader">
                <img
                    src={loadingIcon}
                    alt="Loading Icon"
                    className="pageLoaderImage"
                />
                <p>Loading...</p>
            </div>
        </div>
    );
}

export default PageLoader;
