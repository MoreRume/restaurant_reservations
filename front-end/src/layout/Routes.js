import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import TableNew from "../tables/TableNew";
import Seats from "../seats/Seats";
import ReservationNew from "../reservations/ReservationNew";
import SearchResi from "../search/SearchResi";
import Edit from "../edit/Edit";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/tables">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard/?date=:date">
        <Dashboard date={"date"}/>
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route path="/reservations/new">
        <ReservationNew />
      </Route>
      <Route path="/tables/new">
        <TableNew />
      </Route>
      <Route path="/search">
        <SearchResi />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <Seats />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <Edit />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
