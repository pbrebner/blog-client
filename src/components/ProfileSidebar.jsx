import { Link } from "react-router-dom";
import { formatDate } from "../utils/dates";

import "./styles/ProfileSidebar.css";

function ProfileSidebar({
    user,
    usersProfile,
    toggleEditProfileOpen,
    toggleDeleteProfileOpen,
}) {
    if (usersProfile) {
        return (
            <div className="profileSidebar">
                <div className="picture">Profile Picture Coming Soon</div>
                <h3 className="name">{user.name}</h3>
                <p className="username">{user.username}</p>
                <p className="userDescription">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Magnam exercitationem molestiae aperiam, ipsa iusto id
                    labore mollitia inventore eveniet impedit eligendi,
                    blanditiis repellendus beatae, officiis iure? Voluptas
                    labore doloribus assumenda.
                </p>
                <p className="timeStamp">
                    Member since {formatDate(user.timeStamp)}
                </p>
                <button
                    onClick={toggleEditProfileOpen}
                    className="editProfileBtn"
                >
                    Edit Profile
                </button>
                <button
                    onClick={toggleDeleteProfileOpen}
                    className="deleteProfileBtn"
                >
                    Delete Profile
                </button>
            </div>
        );
    } else {
        return (
            <div className="profileSidebar">
                <div className="picture">Profile Picture Coming Soon</div>
                <h3 className="name">{user.name}</h3>
                <p className="userDescription">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Magnam exercitationem molestiae aperiam, ipsa iusto id
                    labore mollitia inventore eveniet impedit eligendi,
                    blanditiis repellendus beatae, officiis iure? Voluptas
                    labore doloribus assumenda.
                </p>
                <p className="timeStamp">
                    Member since {formatDate(user.timeStamp)}
                </p>
            </div>
        );
    }
}

export default ProfileSidebar;
