import jwt from 'jsonwebtoken';
const secret = "empmanagsys$123@&";

function setUser(user: any) {
    const payload = {
        id: user._id,
        email: user.email,
        adminName: user.adminName
    };
    return jwt.sign(payload, secret, { expiresIn: '2h' });
}

function getUser(token: string) {
    if (!token) return null;
    try {
        return jwt.verify(token, secret);
    } catch {
        return null;
    }
}

export default {
    setUser,
    getUser
};
