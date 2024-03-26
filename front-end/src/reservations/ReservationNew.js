import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";
//import { userParams } from "../../back-end/src/db/connection";

function ReservationNew() {
    const history = useHistory();

    const initialResiState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
    };

    const [reservation, setReservation] = useState({...initialResiState,});
    const [resiError, setResiError] = useState(null);

    const changeHandler = (e) => {
        if(e.target.name === "mobile_number"){
            if(!isNaN(e.target.value)){
                setReservation({
                    ...reservation,
                    [e.target.name]: e.target.value,
                })
            }
        }
        else{
            setReservation({
                ...reservation,
                [e.target.name]: e.target.value,
            })
        }
    };

    const changePartyHandler = (e) => {
        e.preventDefault();
        setReservation({
            ...reservation,
            [e.target.name]: Number(e.target.value),
        })
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const abortController = new AbortController();
        createReservation(reservation, abortController.signal)
        .then(() => history.push(`/dashboard?date${reservation.reservation_date}`))
        .catch(setResiError);
        return () => abortController();
    };

    const cancelHandler = (e) => {
        e.preventDefault();
        const abortController = new AbortController();
        history.push("/");
        return () => abortController.abort();
    };

    return(
        <section>
            <h2>Reservation</h2>
            <ErrorAlert error={resiError} />
            <ReservationForm
            changeHandler={changeHandler}
            changePartyHandler={changePartyHandler}
            reservation={reservation}
            submitHandler={submitHandler}
            cancelHandler={cancelHandler}
            />
        </section>
    );
}

export default ReservationNew;
