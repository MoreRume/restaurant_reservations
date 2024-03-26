import { useHistory } from "react-router-dom";
import { unassignTable } from "../utils/api";

function TableList({ tables }) {
    const history = useHistory();
  
    const finishHandler = (e) => {
      e.preventDefault();
      const abortcontroller = new AbortController();
      const message = `Is this table ready to seat new guests?`;
      if (window.confirm(message)) {
        unassignTable(e.target.value, abortcontroller.signal)
        .then(() => history.goBack())
      }
      return () => abortcontroller.abort();
    };

return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Table Name</th>
          <th scope="col">Capacity</th>
          <th scope="col">Status</th>
          <th scope="col">Click when table is free</th>
        </tr>
      </thead>
      <tbody>{tables.map((table) => {
        
    return (
      <tr key={table.table_id}>
        <td>{table.table_name}</td>
        <td>{table.capacity}</td>
        <td data-table-id-status={table.table_id}>{table.reservation_id ? "occupied" : "free" }</td>
        <td>
          {table.reservation_id ? (
            <button
              data-table-id-finish={table.table_id}
              type="button"
              className="btn btn-info btn-lg"
              onClick={finishHandler}
              value={table.table_id}
            >
              Finish
            </button>
          ) : null}
        </td>
      </tr>
    );
  })}</tbody>
    </table>
  );
}

export default TableList;