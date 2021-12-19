import scss from "./Nav.module.scss";
import { Link, useLocation } from "react-router-dom";
import React from "react";

const Nav = (props) => {
  const loc = useLocation();

  return (
    <ul className={scss.Nav}>
      <li
        className={loc.pathname === "/calendars" ? scss.Active : null}
      >
         <Link to="/calendars">Calendars</Link>
      </li>
      <li className={loc.pathname === "/events" ? scss.Active : null}>
        <Link to="/events">Events</Link>
      </li>
      <li className={loc.pathname === "/support" ? scss.Active : null}>
        <Link to="/support">Support</Link>
      </li>
    </ul>
  );
};

export default Nav;
