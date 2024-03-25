import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables, updateSeat } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function Seats() {

    const history = useHistory();
    const [reservation, setReservations] = useState({});
    const [tables, setTables] = useState(null);
    const [tablesError, setTableError] = useState([]);
    const [tableId, setTableId] = useState(0);

    useEffect(loadTables, []);

    function loadTables() {
        const abortController = new AbortController();
        setTableError(null);
        listTables(abortController.signal)
        .then(setTables)
        .catch(setTableError);
        return () => abortController.abort();
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const abortController = new AbortController();
        updateSeat(reservation.reservation_id, tableId, abortController.signal)
        .then(() => history.push("/"))
        .catch(setTableError);
        return () => abortController.abort();
    };

    function changeHandler (e){
        e.preventDefault();
        setTableId(e.target.value);
    };

    function cancelHandler(e){
        e.preventDefault();
        history.push("/");
    };

    const tableList = tables.map((table) =>{
        return(
            <option key={table.table_id} value={table.table_id}>
                {table.table_name} - {table.capacity}
            </option>
        );
    });

    return(
        <div>
            <h1>Seat Reservation</h1>
            <ErrorAlert error={tablesError} />
            <form className="d-flex">
                <select
                id="table_id"
                name="table_id"
                required={true}
                onChange={changeHandler}
                >
                    <option defaultValue>Select a table</option>
                    {tableList}
                </select>
                <button type="submit" className="btn btn-info btn-lg" onClick={submitHandler} >Submit</button>
                <button type="reset" className="btn btn-danger btn-md" onClick={cancelHandler}>Cancel</button>
            </form>
        </div>
    );
}

export default Seats;