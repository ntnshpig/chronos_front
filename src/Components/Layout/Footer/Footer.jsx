import scss from "./Footer.module.scss";
import * as Icon from "react-bootstrap-icons";
import AuthContext from "../../../Storage/auth-context";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

const Footer = (props) => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <footer className={scss.Footer}>
      <div className={scss.Top}>
        <div className={scss.TopLeftBox}>
          <ul className={scss.Nav}>
            <li>
              <Link to="/calendars">Calendars</Link>
            </li>
            <li>
              <Link to="/events">Events</Link>
            </li>
            <li>
              <Link to="/support">Support</Link>
            </li>
          </ul>
        </div>
        <div className={scss.TopRightBox}>
          <div className={scss.SocialMedia}>
              <Icon.Facebook className={scss.SocialMediaIcon}/>
              <Icon.Twitter className={scss.SocialMediaIcon}/>
              <Icon.Linkedin className={scss.SocialMediaIcon}/>
          </div>
          {!authCtx.isLoggedIn && (
            <button
              className={`${scss.Button} ${scss.SignUp}`}
              onClick={() => navigate("/signUp")}
            >
              Sign Up
            </button>
          )}
        </div>
      </div>
      <div className={scss.Bot}>
        <span>© We love our customers! by CHRONOS</span>
      </div>
    </footer>
  );
};

export default Footer;
