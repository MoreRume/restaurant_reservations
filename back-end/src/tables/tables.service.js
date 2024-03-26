const knex = require("../db/connection.js");


function freeTable(table_id){
    return knex("tables as t")
    .join("reservations as r", "t.reservation_id", "reservation_id")
    .where({ table_id });
}

function list() {
    return knex("tables")
    .select("*")
    .orderBy("table_name");
}

function create(table){
    return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdTable) => createdTable[0]);
}

function read(table_id){
    return knex("tables")
    .select("*")
    .where({ table_id })
    .first();
}

function readResi(reservation_id){
    return knex("reservations")
    .where({ reservation_id})
    .first();
}

async function update(updatedTable, updatedResi){
    const { table_id, reservation_id } = updatedTable;
    await knex("tables")
    .where({ table_id })
    .update(updatedTable)
    .returning("*");

    await knex("reservations")
    .where({ reservation_id })
    .update(updatedResi)
    .returning("*");

    return read(table_id);
}

async function destroy(openTable, reservation){
    const { table_id} = openTable;
    const { reservation_id } = reservation;
    await knex ("tables")
    .where({ table_id })
    .update(openTable)
    .returning("*")

    await knex(" reservations")
    .where({ reservation_id })
    .update(reservation)
    .returning("*")

    return freeTable(table_id);
}

module.exports = {
    list,
    create,
    read,
    readResi,
    update,
    destroy,
}