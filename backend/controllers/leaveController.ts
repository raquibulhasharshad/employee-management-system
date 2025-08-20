import express from "express";
import Employee from "../model/employeeModel";
import Leave from "../model/leaveModel";

// Employee applies for leave
const applyLeave = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const employeeId = (req as any)?.user?._id;

    if (!employeeId) {
      res.status(401).json({ success: false, message: "Unauthorized. Employee ID not found." });
      return;
    }

    const { leaveType, fromDate, toDate, description } = req.body;

    if (!leaveType || !fromDate || !toDate || !description) {
      res.status(400).json({ success: false, message: "All fields are required" });
      return;
    }

    const newLeave = await Leave.create({
      employee: employeeId,
      leaveType,
      fromDate,
      toDate,
      description,
    });

    res.status(201).json({ success: true, leave: newLeave });
  } catch (error) {
    console.error("Apply Leave Error:", error);
    res.status(500).json({ success: false, message: "Failed to apply for leave" });
  }
};

// Admin fetches all leave requests
const getAllLeaves = async (req: express.Request, res: express.Response) => {
  try {
    const adminId = (req as any).user.id;

    const leaves = await Leave.find()
      .populate({
        path: "employee",
        select: "name empId email image department createdBy",
      })
      .sort({ appliedAt: -1 });

    // Filter manually where employee?.createdBy matches adminId (as string)
    const filtered = leaves.filter(
      (leave) =>
        leave.employee &&
        (leave.employee as any).createdBy === adminId // plain string comparison
    );

    const formatted = filtered.map((leave) => ({
      id: leave._id,
      name: (leave.employee as any).name,
      empId: (leave.employee as any).empId,
      email: (leave.employee as any).email,
      image: (leave.employee as any).image,
      department: (leave.employee as any).department,
      leaveType: leave.leaveType,
      fromDate: leave.fromDate,
      toDate: leave.toDate,
      description: leave.description,
      appliedAt: leave.appliedAt,
      status: leave.status,
    }));

    res.status(200).json({ success: true, leaves: formatted });
  } catch (error) {
    console.error("Error in getAllLeaves:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Employee fetches their leave requests
const getMyLeaves = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const employeeId = (req as any)?.user?._id;

    if (!employeeId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const leaves = await Leave.find({ employee: employeeId }).sort({ appliedAt: -1 });

    const formatted = leaves.map((leave) => ({
      id: leave._id,
      leaveType: leave.leaveType,
      fromDate: leave.fromDate,
      toDate: leave.toDate,
      description: leave.description,
      appliedAt: leave.appliedAt,
      status: leave.status,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Get My Leaves Error:", error);
    res.status(500).json({ message: "Error fetching your leaves" });
  }
};

// Admin updates leave status
// Admin updates leave status without leaveId in URL
const updateLeaveStatus = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      res.status(400).json({ success: false, message: "Missing required fields" });
      return;
    }

    const validStatuses = ["Pending", "Approved", "Rejected"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: "Invalid status value" });
      return;
    }

    const leave = await Leave.findById(id);
    if (!leave) {
      res.status(404).json({ success: false, message: "Leave not found" });
      return;
    }

    // ✅ Prevent status change if already Approved or Rejected
    if (leave.status === "Approved" || leave.status === "Rejected") {
      res.status(400).json({ success: false, message: `Leave is already ${leave.status} and cannot be changed.` });
      return;
    }

    leave.status = status;
    await leave.save();

    res.status(200).json({ success: true, message: `Leave marked as ${status}`, leave });
  } catch {
    res.status(500).json({ success: false, message: "Error updating leave status" });
  }
};



export {
  applyLeave,
  getAllLeaves,
  getMyLeaves,
  updateLeaveStatus,
};
