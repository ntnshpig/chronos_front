import scss from "./Calendars.module.scss";
import { useContext, useState, useRef, useEffect } from "react";
import AuthContext from "../../Storage/auth-context";
import Loader from "react-loader-spinner";
import { message } from "antd";
import api from "../../Services/api";
import TextareaAutosize from "react-textarea-autosize";
import { useNavigate } from "react-router";

const Calendars = (props) => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [createCalendar, setCreateCalendar] = useState(false);
  const [calendars, setCalendars] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const changeContentHandler = (event) => {
    setContent(event.target.value);
  };

  const changeCreateHandler = (event) => {
    setCreateCalendar((prevState) => !prevState);
  };

  const changeTitleHandler = (event) => {
    setTitle(event.target.value);
  };

  const getCalendars = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/calendars/getCalendarsForUser`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCalendars(data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.toString());
    }
    setIsLoading(false);
  };

  const addCalendar = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/calendars/`,
        {
          method: "POST",
          body: JSON.stringify({
            title: title,
            description: content,
          }),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );

      if (response.ok) {
        setCreateCalendar(false);
        getCalendars();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.toString());
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getCalendars();
  }, []);

  return (
    <div className={scss.CalendarsDiv}>
      {!createCalendar && (
        <div className={scss.ButtonDiv}>
          <button className={scss.button} onClick={changeCreateHandler}>
            Create new calnedar
          </button>
        </div>
      )}
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
      {!isLoading && !createCalendar && (
        <div className={scss.Calendars}>
          {Array.from(calendars).map((c) => (
            <div className={scss.Calendar} key={c.calendar_data.id}>
              <span className={scss.Title} onClick={()=>navigate(`/calendars/${c.calendar_data.id}`)}>
                {c.calendar_data.title}
                {c.calendar_data.main && (
                  <span className={scss.MainSpan}>(main)</span>
                )}
              </span>
              <span className={scss.Descrition}>
                {c.calendar_data.description}
              </span>
            </div>
          ))}
        </div>
      )}
      {!isLoading && createCalendar && (
        <>
          <span className={scss.IntroText}>Create Calendar</span>
          <form className={scss.CreateCalDiv}>
            <div className={`${scss.FormElem} ${scss.EmailElem}`}>
              <span className={scss.InfoText}>Title:</span>
              <input
                type="text"
                required
                value={title}
                onChange={changeTitleHandler}
              />
            </div>
            <div className={`${scss.FormElem} ${scss.ContentElem}`}>
              <span className={scss.InfoText}>Descriton:</span>
              <TextareaAutosize
                minRows={3}
                className={scss.ContentInput}
                value={content}
                onChange={changeContentHandler}
              />
            </div>
            <div className={`${scss.FormElem}`}>
            <button type="submit" className={scss.button} onClick={addCalendar}>
              Create
            </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default Calendars;
