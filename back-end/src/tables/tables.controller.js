const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { as } = require("../db/connection");

//Middleware

async function validData(req, res, next) {
    if(req.body.data) {
        return next();
    }
    next({
        message: `Table information required.`,
        status: 400
    })
}

function hasId(req, res, next) {
    const resiId = req.body.data.reservation_id;
    if(resiId) {
        return next();
    }
    next({
        message: `Reservation Id required.`,
        status: 400
    })
}

async function validResi(req, res, next) {
    const resiId = req.body.data.reservation_id;
    const reservation = await service.readResi(resiId);
    if(reservation){
        res.locals.reservation = reservation;
        return next();
    }
    next({
        message: `Reservation Id: ${resiId} does not exist.`,
        status: 404,
    })
}

async function resiAlreadySat(req, res, next){
    if(res.locals.reservation.status === "seated"){
        next({
        message: `Reservation is already sat.`,
        status: 400,
        });
    }
    return next();
}

async function validTable(req, res, next){
    const table_id = req.params.table_id;
    const table = await service.read(table_id);
    if(table){
        res.locals.table = table;;
        return next();
    }
    next({
        message: `Table ${table_id} is imaginary.`,
        status: 404,
    });
}

function hasTableName(req, res, next){
    const name = req.body.data.table_name;
    if(name && name !== "" && name.length > 1){
        return next();
    }
    next({
        message: `Table name required.`
    })
}

async function validCapacity(req, res, next){
    const cap = req.body.data.capacity;
    if(cap && cap > 0 && typeof cap === "number"){
        return next();
    }
    next({
        message: `Capacity is required.`,
        status: 400,
    });
}

function checkCapacity(req, res, next){
    const cap = res.locals.table.capacity;
    const guest = res. locals.reservation.people;
    if (cap >= guest){
        return next(
        );
    }
    next({
        message: `Table does not have enough capacity.`,
        status: 400
    });
}
async function tableFree(req, res, next){
    const resiId = res.locals.table.reservation_id;
    if (resiId){
        return next();
    }
    next({
        message: `Table is occupied.`,
        status: 400,
    });
}

async function tableTaken(req, res, next){
    const resiId = res.locals.table.reservation_id;
    if (resiId){
        return next({
            message: `Table is occupied`,
            status: 400,
        });
        
    }
    return next();
}

// Time for the CRUD

async function list(req, res){
    const tables = await service.list();
    res.json({ data: tables });
}

async function create(req, res){
    const { table_name, capacity } = req.body.data;
    const newTableData = {
        table_name,
        capacity,
    };
    const newTable = await service.create(newTableData);
    res.status(201).json({ data: newTableData });
}

function read(req, res){
    res.json({ data: res.locals.table });
}

async function update(req, res){
    const reservation_id = req.body.data.reservation_id;
    const { table_name, capacity, table_id } = res.locals.table;
    const tableUpdate = {
        table_id,
        table_name,
        capacity,
        reservation_id,
    };
    const updateResi = { ...res.locals.reservation, status: "seated" };
    const updatedTable = await service.update(tableUpdate, updateResi);
    res.status(200).json({ data: updatedTable });
}

async function destroy(req, res){
    const resiId = res.locals.table.reservation_id;
    const openTable = {
       ...res.locals.table,
       reservation_id: null,
    };
    const resi = await service.readResi(resiId);
    const resiUpdate = {
        ...resi,
        status: "finished",
    };
    const cancelledResi = await service.destroy(openTable, resiUpdate);
    res.status(200).json({ data: cancelledResi});
}

module.exports = {
    list: [asyncErrorBoundary(list)],
    create: [asyncErrorBoundary(validData),
        asyncErrorBoundary(hasTableName),
        asyncErrorBoundary(validCapacity),
        asyncErrorBoundary(create),],
    read : [asyncErrorBoundary(validTable),
         asyncErrorBoundary(read),],
    update: [asyncErrorBoundary(validTable),
        asyncErrorBoundary(validData),
        asyncErrorBoundary(hasId),
        asyncErrorBoundary(validResi),
        asyncErrorBoundary(resiAlreadySat),
        asyncErrorBoundary(checkCapacity),
        asyncErrorBoundary(tableTaken),
        asyncErrorBoundary(update),],
    delete: [asyncErrorBoundary(validTable),
        asyncErrorBoundary(tableFree),],
}