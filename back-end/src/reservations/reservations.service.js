const knex = require("../db/connection.js");

function list(reservation_date) {
  if (reservation_date) {
    return knex("reservations")
      .where({ reservation_date, status: "booked" })
      .orWhere({ reservation_date, status: "seated" })
      .orderBy("reservation_time");
  }
}

function read(reservation_id) {
  return knex("reservations").where({ reservation_id }).first();
}

function create(newReservation) {
  return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((createdReservation) => createdReservation[0]);
}

async function update(updatedData){
  const { reservation_id } = updatedData;
  await knex("reservations")
  .where({ reservation_id })
  .update(updatedData)
  .returning("*")

  return read(reservation_id);
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function resUpdate(updatedData){
  return knex("reservations")
  .select("*")
  .where({reservation_id: updatedData.reservation_id})
  .update(updatedData)
  .returning("*")
  .then((updatedRes) => updatedRes[0]);
}

module.exports = {
  list,
  read,
  create,
  update,
  search,
  resUpdate,
};