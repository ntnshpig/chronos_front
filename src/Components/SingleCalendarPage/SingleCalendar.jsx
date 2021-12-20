import scss from "./SingleCalendar.module.scss";
import { useState, useEffect, useContext, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Holidays from "date-holidays";
import { message } from "antd";
import AuthContext from "../../Storage/auth-context";
import { Modal, Input, Select, DatePicker } from "antd";
import "./CalendarOverrides.scss";
import { PlusCircle } from "react-bootstrap-icons";
import { HexColorPicker } from "react-colorful";

const SingleCalendar = (props) => {
  const authCtx = useContext(AuthContext);
  const [calendar, setCalendar] = useState(null);
  const [events, setEvents] = useState([]);
  const [fullCalendarEvents, setFullCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [color, setColor] = useState("#aabbcc");
  const [type, setType] = useState("task");

  const changeTitleHandler = ({ target: { value } }) => {
    setTitle(value);
  };

  const changeContentHandler = ({ target: { value } }) => {
    setContent(value);
  };

  const { Option } = Select;
  function onChangeDate(value, dateString) {
    setDate(dateString);
  }

  function selectChange(value) {
    setType(value);
  }

  const holidayToFullCalendarEvent = (e) => {
    const res = {
      title: e.name,
      start: e.date,
    };
    return res;
  };

  const eventToFullCalendarEvent = (e) => {
    const res = {
      id: e.id.toString(),
      title: e.title,
      start: e.event_date,
      color: e.color,
    };
    return res;
  };

  useEffect(() => {
    const main = async () => {
      setLoading(true);
      try {
        const calendar_res = await fetch(
          `http://127.0.0.1:8000/api/calendars/${props.calendar_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + authCtx.token,
            },
          }
        );

        if (calendar_res.ok) {
          const data = await calendar_res.json();
          setCalendar(data);
        } else {
          throw new Error(calendar_res.message);
        }

        const events_res = await fetch(
          `http://127.0.0.1:8000/api/events/${props.calendar_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + authCtx.token,
            },
          }
        );

        if (events_res.ok) {
          const eventsData = await events_res.json();
          setEvents(eventsData);

          let fullCalendarEventsToSet = eventsData.map((e) =>
            eventToFullCalendarEvent(e)
          );

          const holidays = new Holidays(authCtx.region);
          const holidaysData = holidays.getHolidays();
          fullCalendarEventsToSet = fullCalendarEventsToSet.concat(
            holidaysData.map((h) => holidayToFullCalendarEvent(h))
          );
          setFullCalendarEvents(fullCalendarEventsToSet);
        } else {
          throw new Error(events_res.message);
        }
      } catch (error) {
        message.error(error.toString());
      }
      setLoading(false);
    };
    main();
  }, []);

  const addEvent = async (e) => {
    // const title = prompt('Enter your event title');
    // const description = prompt('Enter your event description') ;
    // const date = prompt('Enter your event date in YYYY-MM-DD HH:MM:SS format', e.dateStr);
    // const color = prompt('Enter your event color');
    // const response = await fetch(
    //           `http://127.0.0.1:8000/api/events/get/${props.calendar_id}`,
    //           {
    //             method: "POST",
    //             body: JSON.stringify({
    //               title: title,
    //               description: description,
    //               event_date: date,
    //               color: color,
    //               category: "task",
    //             }),
    //             headers: {
    //               "Content-Type": "application/json",
    //               Accept: "application/json",
    //               Authorization: "Bearer " + authCtx.token,
    //             },
    //           });
    //           if (response.ok) {
    //                   const responseData = await response.json();
    //                   setFullCalendarEvents([
    //                     ...fullCalendarEvents,
    //                     {
    //                       id: responseData.id,
    //                       title: responseData.title,
    //                       start: responseData.event_date,
    //                       color: responseData.color,
    //                     },
    //                   ]);
    //                 }
    //                 console.log(title, content, color, date, type);
    Modal.confirm({
      icon: <PlusCircle style={{ display: "none" }} />,
      content: (
        <div className={scss.EventCreate}>
          <h2>Create event</h2>
          <Input className={scss.Elem} placeholder="Title" onChange={changeTitleHandler} />
          <Input className={scss.Elem} placeholder="Descrition" onChange={changeContentHandler} />
          <Select
          className={scss.Elem}
            defaultValue="task"
            style={{ width: 200 }}
            onChange={selectChange}
          >
            <Option value="task">Task</Option>
            <Option value="arrangement">Arrangement</Option>
            <Option value="reminder">Reminder</Option>
          </Select>
          <DatePicker className={scss.Elem} showTime onChange={onChangeDate} />
          <HexColorPicker color={color} onChange={setColor} />
        </div>
      ),
      async onOk() {
        if (title.length === 0) {
          message.error("Something Wrong!");
          return;
        }
        const response = await fetch(
          `http://127.0.0.1:8000/api/events/get/${props.calendar_id}`,
          {
            method: "POST",
            body: JSON.stringify({
              title: title,
              description: content,
              event_date: date,
              color: color,
              category: type,
            }),
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + authCtx.token,
            },
          }
        );
        if (response.ok) {
          const responseData = await response.json();
          setFullCalendarEvents([
            ...fullCalendarEvents,
            {
              id: responseData.id,
              title: responseData.title,
              start: responseData.event_date,
              color: responseData.color,
            },
          ]);
        }
        console.log(title, content, color, date, type);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const showEvent = async (e) => {
    console.log(e.event._def.publicId);

    const eventRes = await fetch(
      `http://127.0.0.1:8000/api/events/one/${e.event._def.publicId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
      }
    );
    const data = await eventRes.json();

    if (eventRes.status === 200) {
      Modal.info({
        width: 400,
        content: (
          <div className={scss.EventInfo}>
            <h2>{data[0].title}</h2>

            <p>{data[0].description}</p>
            <p>{data[0].category}</p>
          </div>
        ),
        onOk() {},
      });
    } else {
      console.log(data.message);
    }
  };

  return (
    <div className={scss.SingleCalendarDiv}>
      {!loading && (
        <div className={scss.CalendarTitle}>
          {/* <span>{calendar.title}</span> */}
        </div>
      )}
      <FullCalendar
        height={660}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        eventClick={(arg) => showEvent(arg)}
        dateClick={(arg) => addEvent(arg)}
        events={fullCalendarEvents}
        initialView="dayGridMonth"
      />
      
    </div>
  );
};

export default SingleCalendar;
