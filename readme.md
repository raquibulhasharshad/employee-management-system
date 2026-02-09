Employee Management System (EMS)
A full-stack Employee Management System built using React, Node.js, Express, MongoDB, and TypeScript.
The system supports role-based authentication (Admin & Employee) and provides a complete workflow for managing employees, leaves, salaries, and profiles.
🚀 Features
🔐 Authentication & Authorization
Role-based login: Admin and Employee
Secure authentication using JWT
Password hashing using bcrypt
Protected routes for both roles
👨‍💼 Admin Panel
Admin login
Dashboard with summary stats
Add, edit, view, and delete employees
Auto-generate employee credentials
Manage employee leaves (Approve / Reject)
View employee salary details
Revoke employee access on deletion
👩‍💻 Employee Panel
Employee login using email & generated password
Dashboard
View profile details
Apply for leave
View leave status (Pending / Approved / Rejected)
View salary details
Change password securely
📋 Leave Management
Employee can apply for leave
Admin can approve or reject leave requests
Status updates reflected in real time
🛠️ Tech Stack
Frontend
React
React Router DOM
CSS Modules / Custom CSS
Axios
Backend
Node.js
Express.js
TypeScript
MongoDB with Mongoose
JWT Authentication
Cloudinary
MVC Architecture

Employee Credential Generation
When an admin adds a new employee:
Copy code

Password = adminName + employeePhone + empId
Example: JohnDoe9876543210123


dummy employee id- abcd@mail.com 
password -123456789