import "./Other.scss";
import "../BlueButton.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faCircleQuestion,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function Other(): JSX.Element {
  const navigate = useNavigate();

  const goToPath = (path: string) => {
    return () => {
      navigate(path);
    };
  };

  return (
    <div className="other">
      <button className="blue-button" onClick={goToPath("settings")}>
        {/* settings button's icon */}
        <FontAwesomeIcon icon={faGear} color="white" className="icon" />
        Settings
      </button>
      <button className="blue-button" onClick={goToPath("about")}>
        <FontAwesomeIcon icon={faCircleInfo} color="white" className="icon" />
        About
      </button>
      <button className="blue-button" onClick={goToPath("help")}>
        <FontAwesomeIcon
          icon={faCircleQuestion}
          color="white"
          className="icon"
        />
        Help
      </button>
    </div>
  );
}
