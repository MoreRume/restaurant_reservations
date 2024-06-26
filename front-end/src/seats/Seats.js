import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables, updateSeat } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function Seats() {

    const history = useHistory();
    const { reservation_id } = useParams();
    const [tables, setTables] = useState([]);
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

    const submitHandler = async (e) => {
        e.preventDefault();
        const abortController = new AbortController();
        try {
            await updateSeat(tableId, reservation_id, abortController.signal);
            history.push("/");
        } catch (error) {
            setTableError(error);
        } finally {
            abortController.abort();
        }
    };

    function changeHandler (e){
        e.preventDefault();
        setTableId(e.target.value);
    };

    function cancelHandler(e){
        e.preventDefault();
        history.push("/reservations/new");
    };

    

    return(
        <div>
            <h1>Seat Reservation</h1>
            <ErrorAlert error={tablesError} />
            <form className="d-flex" onSubmit={submitHandler}>
                <select name="table_id" className="form-select mb-2 mr-1" aria-label="Select Table" id="table_id" onChange={changeHandler}>
                    <option defaultValue>Select a table</option>
                    {tables.map((table) => {
                        return(
                            <option value={table.table_id} key={table.table_id}>
                                {table.table_name} - {table.capacity}
                            </option>
                        );
                    })}
                </select>
                <button type="submit" className="btn btn-info btn-lg">Submit</button>
                <button type="reset" className="btn btn-danger btn-md" onClick={cancelHandler}>Cancel</button>
            </form>
        </div>
    );
}

export default Seats;