import express from "express";
import authService from '../service/auth';

let restrictToLoggedinUserOnly = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userUid = req.cookies.uid;

    if (!userUid) return res.redirect("/login");

    const user = authService.getUser(userUid);

    if (!user) return res.redirect("/login");

    // @ts-ignore
    req.user = user;

    next();
};

export default restrictToLoggedinUserOnly;
