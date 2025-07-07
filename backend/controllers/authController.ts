import express from 'express';
import User from '../model/userModel';

const handleUserSignup = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { adminName, companyName, email, phone, address, password } = req.body;

        await User.create({
            adminName,
            companyName,
            email,
            phone,
            address,
            password
        });

        res.status(201).json({ message: "Account created Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Signup Failed", error });
    }
};


const handleUserLogin = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, password });

        if (!user) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }

        res.status(200).json({ message: "Login Successful" });
    } catch (error) {
        res.status(500).json({ message: "Login Failed", error });
    }
};

export { handleUserSignup, handleUserLogin };
