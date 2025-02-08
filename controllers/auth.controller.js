import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../db/User.js";
import { loginSchema, signupSchema } from "../validation/types.js";

export const signupController = async (req, res) => {
    try {
        const {username, email, password} = signupSchema.parse(req.body);

        // uniqueness check..
        const existingUser = await User.findOne({email});
        if(existingUser) {
            res.status(400).json({message: "User already exists with these creds."});
        };

        const usernameExists = await User.findOne({ username })
        if(usernameExists) {
            res.status(400).json({message: "User already exists."});
        };

        // hashing password
        const hashed = await bcryptjs.hash(password, 12);

        const newUser = new User({
            username,
            email,
            password: hashed
        });

        await newUser.save();
        res.status(201).json({message: "User registered successfully"});
        
    } catch (e) {
        if(e){
            res.status(401).json({error: e.errors});
        }
        res.status(500).json({message: "Server error"});
    }
};

export const loginController = async (req, res) => {
    try {
        const {username, password} = loginSchema.parse(req.body);

        // checking for existance
        const user = await User.findOne({ username });
        if(!user) {
            return res.status(401).json({message: "Invalid credentials"});
        };

        // matching security key
        const matches = await bcryptjs.compare(password, user.password);
        if(!matches) {
            return res.status(411).json({message: "Invalid creds"});
        };

        const token = jwt.sign(
            {userId: user._id, username: user.username},
            process.env.JWT_SECRET,
            {expiresIn: "8h"}
        );

        return res.status(201).json({ token });
        
    } catch (e) {
        if(e) {
            res.status(401).json({error: e.errors});
        }
        res.status(500).json({message: "Server error"});
    }
};

export const profileController = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if(user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.idAdmin
            });
        }
    } catch (error) {
        res.status(404).json({message: "User not found"});
    }
}