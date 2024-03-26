import React from "react";

function ReservationForm({reservation, changeHandler, cancelHandler, submitHandler, changePartyHandler}){
    return(
    <div>
        <form>
        <fieldset>
            <div>
                <label htmlFor="first_name">First Name</label>
                <input
                name="first_name"
                id="fist_name"
                type="text"
                placeholder="First Name"
                required={true}
                value={reservation.first_name}
                maxLength="50"
                onChange={changeHandler}
                />
            </div>
            <div>
                <label htmlFor="last_name">LastName</label>
                <input
                name="last_name"
                id="last_name"
                type="text"
                placeholder="Last Name"
                required={true}
                value={reservation.last_name}
                maxLength="50"
                onChange={changeHandler}
                />
            </div>
            <div>
                <label htmlFor="mobile_number">Mobile Number</label>
                <input
                name="mobile_number"
                id="mobile_number"
                type="tel"
                placeholder="123-456-7890"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                required={true}
                value={reservation.mobile_number}
                maxLength="12"
                onChange={changePartyHandler}
                />
            </div>
            <div>
                <label htmlFor="reservation_date">Reservation Date</label>
                <input
                name="reservation_date"
                id="reservation_date"
                type="date"
                placeholder="YYYY-MM-DD"
                pattern="\d{4}-\d{2}-\d{2}"
                required={true}
                value={reservation.reservation_date}
                maxLength="10"
                onChange={changeHandler}
                />
            </div>
            <div>
                <label htmlFor="reservation_time">Reservation Time</label>
                <input
                name="reservation_time"
                id="reservation_time"
                type="time"
                placeholder="HH:MM"
                pattern="[0-9]{2}:[0-9]{2}"
                required={true}
                value={reservation.reservation_time}
                maxLength="5"
                onChange={changeHandler}
                />
            </div>
            <div>
                <label htmlFor="people">Number of Guest</label>
                <input
                name="people"
                id="people"
                type="number"
                placeholder="##"
                value={reservation.people}
                maxLength="2"
                onChange={changePartyHandler}
                />   
            </div>
            <div className="group-row">
                <button className="btn btn-danger btn-lg" type="button" onClick={cancelHandler}>
                    Cancel
                </button>
                <button className="btn btn-success btn-lg" type="button" onClick={submitHandler}>
                    Submit
                </button>
            </div>
        </fieldset>
        </form>
    </div>
    );
}
export default ReservationForm;