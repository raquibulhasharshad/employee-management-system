import { Router } from "express";
import { addHoliday, getHolidays } from "../controllers/holidayController";
import restrictToLoggedinUserOnly from "../middlewares/auth";

const holidayRoute = Router();

holidayRoute.post("/", restrictToLoggedinUserOnly, addHoliday);
holidayRoute.get("/", restrictToLoggedinUserOnly, getHolidays);

export default holidayRoute;
