import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import TableForm from "./TableForm";
import ErrorAlert from "../layout/ErrorAlert";

function TableNew() {
    const history = useHistory();
    const initialTableState = {
        table_name: "",
        capacity: "",
    };

    const [tableData, setTableData] = useState({initialTableState,});
    const [tableError, setTableError] = useState(null);

    const changeHandler = (e) => {
        e.preventDefault();
        setTableData({
            ...tableData,
            [e.target.name]: e.target.value,
        });
    };

    const changeCapacityHandler = (e) => {
        e.preventDefault();
        setTableData({
            ...tableData,
            [e.target.name]: Number(e.target.value),
        });
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const abortController = new AbortController();
        createTable(tableData, abortController.signal)
        .then(() => history.push("/"))
        .catch(setTableError);
        return () => abortController.abort();
    };

    const cancelHandler = (e) => {
        e.preventDefault();
        const abortController = new AbortController();
        history.push("/");
        return () => abortController.abort();
    };

    return(
        <section>
            <h2>New Table</h2>
            <ErrorAlert error={tableError} />
            <TableForm
            changeHandler={changeHandler}
            changeCapacityHandler={changeCapacityHandler}
            tableData={tableData}
            submitHandler={submitHandler}
            cancelHandler={cancelHandler}
            />
        </section>
    );
}

export default TableNew;