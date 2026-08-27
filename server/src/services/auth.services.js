import User from "../models/User.models.js";
import bcrypt from 'bcrypt';

const registerUser = async (name, email, password) => {

    const existingUser = await User.findOne({email: email}).exec();

    if(existingUser !== null) {
       throw new Error("E-mail already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    await User.create({name: name, email: email, passwordHash: passwordHash})

    return "User registered";
};  

export default registerUser;