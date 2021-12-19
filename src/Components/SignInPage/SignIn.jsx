import React, { useState, useEffect, useReducer, useContext } from "react";
import AuthContext from "../../Storage/auth-context";
import scss from "./SignIn.module.scss";
import { useNavigate } from "react-router";
import Loader from "react-loader-spinner";
import { message } from "antd";
import api from "../../Services/api";

const loginReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return {
      value: action.val,
      isValid: action.val.trim().length >= 4,
    };
  }
  if (action.type === "BLUR") {
    return {
      value: state.value,
      isValid: state.value.trim().length >= 4,
    };
  }
  return { value: "", isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length >= 4 };
  }
  if (action.type === "BLUR") {
    return { value: state.value, isValid: state.value.trim().length >= 4 };
  }
  return { value: "", isValid: false };
};

const SignIn = (props) => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [formIsValid, setFormIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loginState, dispatchLogin] = useReducer(loginReducer, {
    value: "",
    isValid: null,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(loginState.isValid && passwordState.isValid);
    }, 100);

    return () => {
      clearTimeout(identifier);
    };
  }, [loginState.isValid, passwordState.isValid]);

  const loginChangeHandler = (event) => {
    dispatchLogin({ type: "USER_INPUT", val: event.target.value });
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });
  };

  const validateLoginHandler = () => {
    dispatchLogin({ type: "BLUR" });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: "BLUR" });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (formIsValid) {
      try {
        const response = await api().post("api/auth/login", {
          login: loginState.value,
          password: passwordState.value,
        });
        if (response.status === 200) {
          message.success("Sign In succeed");
          authCtx.login(response.data);
          navigate("/profile");
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        message.error(error.toString());
      }
    }
    setIsLoading(false);
  };

  return (
    <div className={scss.SignInDiv}>
      <div className={scss.SignIn}>
        <span className={scss.IntroText}>
          Sign In
        </span>
        {isLoading && (
          <Loader
            type="TailSpin"
            color="#D2E1FF"
            height={100}
            width={100}
            timeout={5000}
            className={scss.Loader}
          />
        )}
        {!isLoading && (
          <form onSubmit={submitHandler}>
            <input
              type="text"
              value={loginState.value}
              onChange={loginChangeHandler}
              onBlur={validateLoginHandler}
              placeholder="Login"
            />
            <input
              type="password"
              value={passwordState.value}
              onChange={passwordChangeHandler}
              onBlur={validatePasswordHandler}
              placeholder="Password"
            />
            <button
              type="submit"
              className={scss.button}
              disabled={!formIsValid}
            >
              Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignIn;
