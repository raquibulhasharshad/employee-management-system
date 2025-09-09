import express from "express";
import mailController from "../controllers/mailController";

const mailRoutes = express.Router();

mailRoutes.post("/send", mailController.sendMail);

export default mailRoutes;
