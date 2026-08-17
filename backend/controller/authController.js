const User = require("../models/users");
const OTP = require("../models/otp");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generatetoken");
const setAuthCookie = require("../utils/authcookie");
const sendEmail = require("../utils/sendemail");

const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            confirmPassword
        } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email.trim())) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters"
            });
        }

        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one uppercase letter"
            });
        }

        if (!/[a-z]/.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one lowercase letter"
            });
        }

        if (!/[0-9]/.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one number"
            });
        }

        if (!/[!@#$%^&*(),.?":{}|<>_\-]/.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one special character"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        await OTP.deleteMany({
            email: normalizedEmail
        });

        await OTP.create({
            email: normalizedEmail,
            otp: otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        await sendEmail(
            normalizedEmail,
            "NewsNest Email Verification",
            `Your NewsNest verification OTP is: ${otp}

This OTP is valid for 5 minutes.

If you did not request this OTP, please ignore this email.`
        );

        return res.status(200).json({
            message: "OTP sent successfully to your email"
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};
const verifyOTP = async (req, res) => {
    try {
        const {
            name,
            email,
            otp,
            password,
            confirmPassword
        } = req.body;

        if (!name || !email || !otp || !password || !confirmPassword) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters"
            });
        }

        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one uppercase letter"
            });
        }

        if (!/[a-z]/.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one lowercase letter"
            });
        }

        if (!/[0-9]/.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one number"
            });
        }

        if (!/[!@#$%^&*(),.?":{}|<>_\-]/.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one special character"
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const otpRecord = await OTP.findOne({
            email: normalizedEmail,
            otp: otp
        });

        if (!otpRecord) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({
                message: "OTP expired"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name,
            email: normalizedEmail,
            password: hashedPassword
        });

        await OTP.deleteMany({
            email: normalizedEmail
        });

        return res.status(201).json({
            message: "Registration successful",
            userId: user._id
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user._id);

        setAuthCookie(res, token);

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

const logout = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({
        message: "Logout successful"
    });
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email.trim())) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(404).json({
                message: "No account found with this email"
            });
        }

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        await OTP.deleteMany({
            email: normalizedEmail
        });

        await OTP.create({
            email: normalizedEmail,
            otp: otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        await sendEmail(
            normalizedEmail,
            "NewsNest Password Reset OTP",
            `Your NewsNest password reset OTP is: ${otp}

This OTP is valid for 5 minutes.

If you did not request a password reset, please ignore this email.`
        );

        return res.status(200).json({
            message: "Password reset OTP sent successfully"
        });

    } catch (error) {
        console.error("Forgot password error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


const resetPassword = async (req, res) => {
    try {
        const {
            email,
            otp,
            password,
            confirmPassword
        } = req.body;

        if (!email || !otp || !password || !confirmPassword) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email.trim())) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters"
            });
        }

        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one uppercase letter"
            });
        }

        if (!/[a-z]/.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one lowercase letter"
            });
        }

        if (!/[0-9]/.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one number"
            });
        }

        if (!/[!@#$%^&*(),.?":{}|<>_\-]/.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one special character"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const otpRecord = await OTP.findOne({
            email: normalizedEmail,
            otp: otp
        });

        if (!otpRecord) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        if (otpRecord.expiresAt < new Date()) {
            await OTP.deleteMany({
                email: normalizedEmail
            });

            return res.status(400).json({
                message: "OTP expired"
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        user.password = hashedPassword;

        await user.save();

        await OTP.deleteMany({
            email: normalizedEmail
        });

        return res.status(200).json({
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error("Reset password error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};
module.exports = {
    register,
    verifyOTP,
    login,
    logout,
    forgotPassword,
    resetPassword
};