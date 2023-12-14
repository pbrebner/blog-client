import { useState, useEffect } from "react";

import "./styles/ProfileSidebar.css";

function ProfileSidebar({ user }) {
    return (
        <div className="profileSidebar">
            <div className="picture">Profile Picture Coming Soon</div>
            <h3 className="name">{user.name}</h3>
            <p className="username">{user.username}</p>
            <p className="userDescription">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam
                exercitationem molestiae aperiam, ipsa iusto id labore mollitia
                inventore eveniet impedit eligendi, blanditiis repellendus
                beatae, officiis iure? Voluptas labore doloribus assumenda.
            </p>
        </div>
    );
}

export default ProfileSidebar;
