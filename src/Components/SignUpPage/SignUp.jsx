import React, {
  useRef,
  useState,
  useContext,
} from "react";
import AuthContext from "../../Storage/auth-context";
import scss from "./SignUp.module.scss";
import { useNavigate } from "react-router";
import Loader from "react-loader-spinner";
import { Checkbox, message } from "antd";
import api from "../../Services/api";
import userPolicy from "./UserPolicy";


const SignUp = (props) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const full_nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const password_confirmationRef = useRef("");
  const regionRef = useRef("");
  const loginRef = useRef("");

  function onChecked(e) {
    setIsChecked(e.target.checked);
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!isChecked) {
      message.info("Accept user policy!");
      return;
    }
    if (passwordRef.current.value.length < 4) {
      message.error("Password have to be more than 4 symbols!");
      return;
    }
    if (passwordRef.current.value !== password_confirmationRef.current.value) {
      message.error("Password are not equel!");
      return;
    }
    setIsLoading(true);
    const user = {
      login: loginRef.current.value,
      region: regionRef.current.value,
      full_name: full_nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: password_confirmationRef.current.value,
    };
    try {
      const response = await api().post("api/auth/register", {
        ...user,
      });

      if (response.status !== 200) {
        throw new Error(response.data.message);
      } else {
        message.success("Registration succeed😊 Now login!");
        navigate("/signIn");
      }
    } catch (error) {
      message.error(error.toString());
    }
    setIsLoading(false);
  };

  return (
    <div className={scss.SignUpDiv}>
      <div className={scss.SignUp}>
        <span className={scss.IntroText}>
          Sign Up
        </span>
        {isLoading && (
          <Loader
            type="TailSpin"
            color="#D2E1FF"
            height={100}
            width={100}
            timeout={3000}
            className={scss.Loader}
          />
        )}
        {!isLoading && (
          <form onSubmit={submitHandler}>
            <input type="text" placeholder="Login" ref={loginRef} required />
            <input type="text" placeholder="Full Name" ref={full_nameRef} required />
            <input
              type="email"
              placeholder="Email"
              ref={emailRef}
              required
            />
            <input type="text" placeholder="Region" ref={regionRef} required />
            <input
              type="password"
              placeholder="Password"
              ref={passwordRef}
              required
            />
            <input
              type="password"
              placeholder="Password Again"
              ref={password_confirmationRef}
              required
            />
            <div className={scss.CheckboxDiv}>
              <Checkbox onChange={onChecked} className={scss.TermsCheckbox}>
                Accept
              </Checkbox>{" "}
              <span className={scss.TermsOfUse} onClick={userPolicy}>
                User Policy
              </span>
            </div>
            <button type="submit" className={scss.button}>
              Sign Up
            </button>
            <span
              className={scss.HaveAcc}
              onClick={() => {
                navigate("/signIn");
              }}
            >
              I already have account
            </span>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
