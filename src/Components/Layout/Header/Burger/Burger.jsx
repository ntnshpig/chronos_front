import React, { useContext, useState } from "react";
import scss from "./Burger.module.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../../../Storage/auth-context";
import { CSSTransition } from "react-transition-group";

const Burger = (props) => {
  const navigate = useNavigate();
  const loc = useLocation();
  const authCtx = useContext(AuthContext);

  return (
    <>
      <div
        className={`${scss.Burger} ${scss.hamburger} ${
          scss["hamburger--spin"]
        } ${props.burgerIsOpen ? scss["is-active"] : null}`}
        role="button"
        onClick={props.onBurgerMenuOpen}
      >
        <div className={`${scss["hamburger-box"]}`}>
          <div className={`${scss["hamburger-inner"]}`}></div>
        </div>
      </div>
      <CSSTransition
        in={props.burgerIsOpen}
        timeout={200}
        classNames={{
          enterActive: scss.BurgerMenuEnterActive,
          enterDone: scss.BurgerMenuEnterDone,
          exitActive: scss.BurgerMenuExit,
          exitDone: scss.BurgerMenuExitActive,
        }}
        mountOnEnter
        unmountOnExit
      >
        <div className={scss.BurgerMenu}>
          <ul className={scss.Nav}>
            <li className={loc.pathname === "/calendars" ? scss.Active : null}>
              <Link to="/calendars" onClick={() => props.onBurgerMenuOpen()}>
                Calendars
              </Link>
            </li>
            <li className={loc.pathname === "/events" ? scss.Active : null}>
              <Link to="/events" onClick={() => props.onBurgerMenuOpen()}>
                Events
              </Link>
            </li>
            <li className={loc.pathname === "/support" ? scss.Active : null}>
              <Link to="/support" onClick={() => props.onBurgerMenuOpen()}>
                Support
              </Link>
            </li>
          </ul>
          {!authCtx.isLoggedIn && (
            <div className={scss.ButtonsDiv}>
              <button
                className={`${scss.Button} ${scss.SignIn}`}
                onClick={() => {
                  props.onBurgerMenuOpen();
                  navigate("/signIn");
                }}
              >
                Sign In
              </button>
              <button
                className={`${scss.Button} ${scss.SignUp}`}
                onClick={() => {
                  navigate("/signUp");
                  props.onBurgerMenuOpen();
                }}
              >
                Sign Up
              </button>
            </div>
          )}
          {authCtx.isLoggedIn && (
            <div className={scss.ButtonsDiv}>
              <button
                className={`${scss.Button} ${scss.Profile}`}
                onClick={() => {
                  navigate("/profile");
                  props.onBurgerMenuOpen();
                }}
              >
                {authCtx.userLogin}
              </button>
              <button
                className={`${scss.Button} ${scss.Logout}`}
                onClick={() => {
                  authCtx.logout();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </CSSTransition>
    </>
  );
};

export default Burger;
