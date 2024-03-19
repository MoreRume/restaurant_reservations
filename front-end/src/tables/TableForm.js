import React from "react";

function TableForm({ tableData, changeHandler, submitHandler, cancelHandler, changeCapacityHandler }){

    return(
        <div>
            <form>
                <fieldset>
                    <div>
                        <label htmlFor="table_name">Table Name</label>
                        <input
                        name="table_name"
                        id="table_name"
                        type="text"
                        required={true}
                        value={tableData.table_name}
                        maxLength="50"
                        onChange={changeHandler}
                        />
                    </div>
                    <div>
                        <label htmlFor="capacity">Capacity</label>
                        <input
                        name="capacity"
                        id="capacity"
                        type="number"
                        required={true}
                        value={tableData.capacity}
                        onChange={changeCapacityHandler}
                        />
                    </div>
                    <div className="group-row">
                        <button className="btn btn-primary btn-md" type="submit" onClick={submitHandler}>
                            Submit
                        </button>
                        <button className="btn btn-danger btn-md" type="button" onClick={cancelHandler}>
                            Cancel
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
}

export default TableForm;