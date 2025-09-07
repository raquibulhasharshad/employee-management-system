import { Request, Response } from "express";
import Holiday from "../model/holidayModel";

// Add holiday
const addHoliday = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, reason } = req.body;
    if (!date) {
      res.status(400).json({ message: "Date is required" });
      return;
    }

    const existing = await Holiday.findOne({ date });
    if (existing) {
      res.status(400).json({ message: "Holiday already exists" });
      return;
    }

    const holiday = await Holiday.create({ date, reason });
    res.json({ success: true, holiday });
  } catch (err) {
    res.status(500).json({ message: "Adding holiday failed", error: err });
  }
};

// Get holidays
const getHolidays = async (req: Request, res: Response): Promise<void> => {
  try {
    const holidays = await Holiday.find().sort({ date: -1 });
    res.json(holidays);
  } catch (err) {
    res.status(500).json({ message: "Fetching holidays failed", error: err });
  }
};

export { addHoliday, getHolidays };
