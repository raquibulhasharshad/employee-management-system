import jwt from 'jsonwebtoken';

// Use environment variable with fallback
const SECRET = process.env.JWT_SECRET_ADMIN || "empmanagsys$123@&";

function setUser(user: any) {
    const payload = {
        id: user._id,
        email: user.email,
        adminName: user.adminName
    };
    return jwt.sign(payload, SECRET, { expiresIn: '2h' });
}

function getUser(token: string) {
    if (!token) return null;
    try {
        return jwt.verify(token, SECRET);
    } catch {
        return null;
    }
}

export default {
    setUser,
    getUser
};
