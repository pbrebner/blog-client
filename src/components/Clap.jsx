import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandsClapping } from "@fortawesome/free-solid-svg-icons";

import "./styles/Clap.css";

function Clap({ shake }) {
    return (
        <>
            <FontAwesomeIcon
                icon={faHandsClapping}
                className={`${shake ? "shaking" : ""}`}
            />
        </>
    );
}

export default Clap;
