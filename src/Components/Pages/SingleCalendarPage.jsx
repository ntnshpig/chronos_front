import React from "react";
import { useParams } from "react-router";
import SingleCalendar from "../SingleCalendarPage/SingleCalendar";

const SingleCalendarPage = (props) => {
  let { calendar_id } = useParams();
  return <SingleCalendar calendar_id={calendar_id}/>;
};

export default SingleCalendarPage;
