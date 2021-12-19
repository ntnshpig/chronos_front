import scss from "./Profile.module.scss";
import { useContext, useState, useRef, useEffect } from "react";
import AuthContext from "../../Storage/auth-context";
import Loader from "react-loader-spinner";
import { message } from "antd";
import api from "../../Services/api";

const Profile = (props) => {
  const authCtx = useContext(AuthContext);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [newName, setNewName] = useState(authCtx.fullName);
  const [newEmail, setNewEmail] = useState(authCtx.email);
  const [isLoading, setIsLoading] = useState(false);

  const changeNewNameHandler = (event) => {
    setNewName(event.target.value);
  };
  const changeNewEmailHandler = (event) => {
    setNewEmail(event.target.value);
  };

  const cahngeIsEdit = () => {
    setIsEditProfile((prevState) => !prevState);
  };

  const submitEditProfileHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    // alert(authCtx.token);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${authCtx.userId}`,
        {
          method: "POST",
          body: JSON.stringify({
            full_name: newName,
            email: newEmail,
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );
      if (response.ok) {
        message.success("Updated secceed!");
        authCtx.update_info();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.toString());
    }
    setIsEditProfile(false);
    setIsLoading(false);
  };

  useEffect(() => {
    authCtx.update_info();
  }, []);

  return (
    <div className={scss.ProfileDiv}>
      <div className={scss.TopDiv}>
        <span className={scss.FullName}>{authCtx.userLogin}</span>
        <span className={scss.Email}>{authCtx.email}</span>
      </div>
      {isLoading && (
        <Loader
          type="TailSpin"
          color="#D2E1FF"
          height={100}
          width={100}
          timeout={50000}
          className={scss.Loader}
        />
      )}
      {!isLoading && (
        <div className={scss.BottomDiv}>
          <div className={scss.TopInfoDiv}>
            <div className={scss.LeftInfoBlock}>
              <span>{authCtx.userLogin}</span>
              {!isEditProfile && <span>{authCtx.fullName}</span>}
              {!isEditProfile && <span>{authCtx.email}</span>}
              {isEditProfile && (
                <div className={scss.EditProfile}>
                  <input
                    type="text"
                    value={newName}
                    onChange={changeNewNameHandler}
                  />
                  <input
                    type="email"
                    value={newEmail}
                    className={scss.EmailChange}
                    onChange={changeNewEmailHandler}
                  />
                </div>
              )}
            </div>
            <div className={scss.RightInfoBlock}>
              {/* Kek */}
              {/* <div className={scss.RightInfoElem}>
                <span>Bizon 365</span>
                {authCtx.isBizon ? (
                  <Icon.Check2All className={scss.CheckIcon} color="#3CDF87" />
                ) : (
                  <Icon.Check2 className={scss.CheckIcon} color="#697CA6" />
                )}
              </div>
              <div className={scss.RightInfoElem}>
                <span>GetCourse</span>
                {authCtx.isGetCourse ? (
                  <Icon.Check2All className={scss.CheckIcon} color="#3CDF87" />
                ) : (
                  <Icon.Check2 className={scss.CheckIcon} color="#697CA6" />
                )}
              </div>
              <div className={scss.RightInfoElem}>
                <span>AmoCRM</span>
                {authCtx.isAmoCRM ? (
                  <Icon.Check2All className={scss.CheckIcon} color="#3CDF87" />
                ) : (
                  <Icon.Check2 className={scss.CheckIcon} color="#697CA6" />
                )}
              </div> */}
            </div>
          </div>
          <div className={scss.ButtonsDiv}>
            <div className={scss.LeftBlockOfButtons}>
              <span
                className={isEditProfile ? scss.Active : null}
                onClick={cahngeIsEdit}
              >
                Edit profile
              </span>
            </div>
            <div className={scss.RightBlockOfButtons}>
              {isEditProfile && (
                <button
                  className={scss.button}
                  onClick={submitEditProfileHandler}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
