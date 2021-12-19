import scss from "./Support.module.scss";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

const Support = (props) => {
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");

  const changeContentHandler = (event) => {
    setContent(event.target.value);
  };

  const changeEmailHandler = (event) => {
    setEmail(event.target.value);
  };

  return (
    <div className={scss.SupportDiv}>
      <div className={scss.Support}>
        <div className={scss.TopDiv}>
          <span className={scss.IntroText}>Support</span>
          <span></span>
        </div>
        <form className={scss.BottomDiv}>
          <div className={`${scss.FormElem} ${scss.EmailElem}`}>
            <span className={scss.InfoText}>Your email to contact</span>
            <input
              type="email"
              required
              value={email}
              onChange={changeEmailHandler}
            />
          </div>
          <div className={`${scss.FormElem} ${scss.ContentElem}`}>
              <span className={scss.InfoText}>
              Describe your problem
              </span>
              <TextareaAutosize
              minRows={8}
              className={scss.ContentInput}
              value={content}
              onChange={changeContentHandler}
              />
          </div>
          <button type="submit" className={scss.button}>Send</button>
        </form>
      </div>
    </div>
  );
};

export default Support;
