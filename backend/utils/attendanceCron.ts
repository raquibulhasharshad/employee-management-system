import cron from "node-cron";
import Attendance from "../model/attendanceModel";
import Employee from "../model/employeeModel";
import Holiday from "../model/holidayModel";

// Every day at 23:59
cron.schedule("59 23 * * *", async () => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const holiday = await Holiday.findOne({ date: today });
    if (holiday) {
      console.log(`🎉 ${today} is a holiday. Skipping auto-marking.`);
      return;
    }

    const employees = await Employee.find();
    for (const emp of employees) {
      const record = await Attendance.findOne({ employee: emp._id, date: today });
      if (!record) {
        await Attendance.create({ employee: emp._id, date: today, status: "Absent" });
      } else if (!record.checkIn) {
        record.status = "Absent";
        await record.save();
      }
    }

    console.log("✅ Attendance cron job completed.");
  } catch (err) {
    console.error("❌ Cron job error:", err);
  }
});
