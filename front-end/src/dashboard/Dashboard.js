import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import { previous, next } from "../utils/date-time";
import TableList from "../tables/TableList";
import ReservationList from "../reservations/ReservationList";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {
  let query = useQuery();
  date = query.get("date") || date;

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [currentDate, setCurrentDate] = useState(date);
  const [ tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const history = useHistory();

  useEffect(loadDashboard, [currentDate]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date: currentDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
      setTablesError(null);
      listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  //For date change
  const previousDayHandler = () => {
    setCurrentDate(previous(currentDate));
    history.push(`/dashboard?date=${previous(currentDate)}`);
  }

  const nextDayHandler = () => {
    setCurrentDate(next(currentDate));
    history.push(`/dashboard?date=${next(currentDate)}`);
  }

  const presentDayHandler = () => {
    setCurrentDate(today());
    history.push(`/dashboard`);
  }

  //html layout of Dashboard
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {currentDate}</h4>
      </div>
      <div className="item centered">
        <div className="group-row">
          <button className="btn btn-dark btn-md" onClick={previousDayHandler}>
            Previous
          </button>
          <button className="btn btn-dark btn-md" onClick={presentDayHandler}>
            Today
          </button>
          <button className="btn btn-dark btn-md" onClick={nextDayHandler}>
            Next
          </button>
        </div>
      </div>
      <ReservationList reservations={reservations} />
      <ErrorAlert error={reservationsError} />
      <TableList tables={tables} />
      <ErrorAlert error={tablesError} />
      {/* {JSON.stringify(reservations)} */}
    </main>
  );
}


export default Dashboard;
