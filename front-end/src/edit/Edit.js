import React, { useState, useEffect} from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";
import ReservationForm from "../reservations/ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";

function Edit() {
    const intitialResiState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
    };

    const { reservation_id } = useParams();
    const history = useHistory();
    const [error, setError] = useState(null);
    const [ reservation, setReservation] = useState({...intitialResiState});

    function loadResi() {
        const abortController = new AbortController();
        setError(null);
        readReservation(reservation_id, abortController.signal)
        .then(setReservation)
        .catch(setError);
        return () => abortController.abort();
    };

    useEffect(loadResi, [reservation_id])

    const changeHandler = (event) => {
        if (event.target.name === "mobile_number"){
            if(!isNaN(event.target.name)){
                setReservation({
                    ...reservation,
                    [event.target.name]: event.target.value,
                })
            }
        }
        else{
            setReservation({
                ...reservation,
                [event.target.name]: event.target.value,
            })
        }
    };

    const changePartyHandler = (e) => {
        //e.preventDefault();
        console.log(e.target.value)
        setReservation({
            ...reservation,
            [e.target.name]: Number(e.target.value),
        });
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const abortController = new AbortController();
        updateReservation(reservation, abortController.signal)
        .then(() => history.push(`/dashboard?date=${reservation.reservation_date}`))
        .catch(setError);
        return () => abortController.abort();
    };

    const cancelHandler = (e) => {
        e.preventDefault();
        const abortController = new AbortController();
        history.push("/");
        return () => abortController.abort();
    };

    return (
        <section>
            <h2>Edit Reservation</h2>
            <ErrorAlert error={error} />
            <ReservationForm
            changeHandler={changeHandler}
            reservation={reservation}
            submitHandler={submitHandler}
            cancelHandler={cancelHandler}
            changePartyHandler={changePartyHandler}
            />
        </section>
    );
}

export default Edit;