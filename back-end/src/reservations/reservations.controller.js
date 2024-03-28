/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//Middleware time:
async function resiIdExists(req, res, next) {
  const resiId = req.params.reservation_id;
  const reservation = await service.read(resiId);
  if(resiId && resiId !== "" && reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    message: `Reservation ${resiId} cannot be found`,
    status: 404,
  });
}

function validData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({
    message: "Reservation information required",
    status: 400,
  });
}

function firstName(req, res, next) {
  if (req.body.data.first_name){
    return next();
  }
  next({
    message: "first_name required",
    status: 400,
  });
}

function lastName(req, res, next){
  if(req.body.data.last_name){
    return next();
  }
  next({
    message: "last_name required",
    status: 400,
  });
}

function validMobileNumber(req, res, next){
  if(req.body.data.mobile_number){
    return next();
  }
  next({
    message: "Mobile number required",
    status: 400,
  });
}

function validDate(req, res, next){
  const date = req.body.data.reservation_date;
  const valid = Date.parse(date);

  if (date && date !=="" && valid){
    return next();
  }
  next({
    message: "Reservation date must be valid",
    status: 400,
  });
}

function hasTime(req, res, next){
  const time = req.body.data.reservation_time;

  if(time && typeof time=== "string"){
    return next();
  }
  next({
    message: "Reservation time is required",
    status: 400,
  });
}

function validTime(req, res, next){
  const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  const time = req.body.data.reservation_time;
  const valid = time.match(timeRegex);

  if(valid){
    return next();
  }
  next({
    message: "Reservation time not valid",
    status: 400,
  });
}

function validPeople(req, res, next){
  const people = req.body.data.people;

  if(people && people > 0 && typeof people === "number"){
    return next();
  }
  next({
    message: "People input is not valid",
    status: 400,
  });
}

//Middleware for Tuesday closures

function closedOnTues(req, res, next){
  const { reservation_date } = req.body.data;
  const tuesday = new Date(reservation_date).getUTCDay();
  if (tuesday === 2) {
    next({
      message: "We are closed on Tuesday!",
      status: 400,
    });
  }
  return next();
}

// MiddleWare to make sure all resis are for future dates

function futureResi(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const now = Date.now();
  const resDate = new Date(`${reservation_date} ${reservation_time}`).valueOf();
  if (resDate < now) {
    next({
      message: "Reservation must be made for the future",
      status: 400,
    });
  }
  return next();
}

//Make sure the restaurant is open

function areWeOpen(req, res, next){
  const { reservation_time } = req.body.data;
  const resiTime = reservation_time.split(":");
  const hour = Number(resiTime[0]);
  const mins = Number(resiTime[1]);

  if( hour < 10 || (hour === 10 && mins <30)){
    next({
      status: 400,
      message: "Reservation must be within business hours of 10:30 to 21:30",
    });
  }
  if(hour > 21 || (hour ===21 && mins > 30)){
    next({
      status: 400,
      message: "Reservation must be within business hours of 10:30 to 21:30",
    });
  }
  return next();
}

//MiddleWare for checking status of resis (checking, updating, and afterwards)

function postStatusCheck(req, res, next) {
  if (req.body.data.status) {
    if (req.body.data.status === "booked") {
      return next();
    } else {
      next({
        message: `Status cannot be ${req.body.data.status}`,
        status: 400,
      });
    }
  } else {
    return next();
  }
}

function updateStatusCheck(req, res, next) {
  const status = req.body.data.status;
  console.log(status)
  if (
    status === "booked" ||
    status === "seated" ||
    status === "finished" ||
    status === "cancelled"
  ) {
    return next();
  } else {
    next({
      message: `Unknown status ${status}`,
      status: 400,
    });
  }
}

function finishedRes(req, res, next) {
  if (res.locals.reservation.status === "finished") {
    next({
      message: "A finished reservation cannot be updated",
      status: 400,
    });
  }
  return next();
}

//List resis
async function list(req, res) {
  const { date, mobile_number } = req.query;
  if (mobile_number) {
    const reservationData = await service.search(mobile_number);
    res.json({ data: reservationData });
  } else {
    const reservationData = await service.list(date);
    res.json({ data: reservationData });
  }
}

//CRUD

async function create(req, res) {
  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = req.body.data;
  const newReservationData = {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status: "booked",
  };
  const newReservation = await service.create(newReservationData);
  res.status(201).json({ data: newReservation });
}

async function read(req, res) {
  const data = res.locals.reservation;
  res.status(200).json({ data });
}

async function update(req, res) {
  const updatedData = {
    ...res.locals.reservation,
    status: req.body.data.status,
  };
  const resStatusUpdate = await service.update(updatedData);
  res.status(200).json({ data: resStatusUpdate });
}

async function resUpdate(req, res) {
  const updatedData = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };

  const updatedReservation = await service.resUpdate(updatedData);
  res.status(200).json({ data: updatedReservation });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    asyncErrorBoundary(validData),
    asyncErrorBoundary(firstName),
    asyncErrorBoundary(lastName),
    asyncErrorBoundary(validMobileNumber),
    asyncErrorBoundary(validDate),
    asyncErrorBoundary(hasTime),
    asyncErrorBoundary(validTime),
    asyncErrorBoundary(validPeople),
    asyncErrorBoundary(areWeOpen),
    asyncErrorBoundary(closedOnTues),
    asyncErrorBoundary(futureResi),
    asyncErrorBoundary(postStatusCheck),
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(resiIdExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(resiIdExists),
    asyncErrorBoundary(updateStatusCheck),
    asyncErrorBoundary(finishedRes),
    asyncErrorBoundary(update),
  ],
  resUpdate: [
    asyncErrorBoundary(resiIdExists),
    asyncErrorBoundary(firstName),
    asyncErrorBoundary(lastName),
    asyncErrorBoundary(validMobileNumber),
    asyncErrorBoundary(validDate),
    asyncErrorBoundary(hasTime),
    asyncErrorBoundary(validTime),
    asyncErrorBoundary(validPeople),
    asyncErrorBoundary(areWeOpen),
    asyncErrorBoundary(closedOnTues),
    asyncErrorBoundary(futureResi),
    asyncErrorBoundary(postStatusCheck),
    asyncErrorBoundary(resUpdate),
  ],
};
