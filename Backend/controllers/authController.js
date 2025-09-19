const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/user")

exports.register = async(req,res)=>{
    const {name,email,password} = req.body

    try{
        let existingUser = await User.findOne({email})

        if(existingUser)
            return res.status(400).json({msg:"Email id is already exists"})
        const hashedPassword = await bcrypt.hash(password,10)

        const newUser = new User({ name, email, password: hashedPassword })

        await newUser.save()

        return res.status(201).json({msg:"user register successfully"})

    }
    catch(err){
         return res.status(500).json({msg:"server error",err})
    }
}

exports.login = async(req,res)=>{
   
    try{

        const {email,password} = req.body

        const existingUser = await User.findOne({email})
        if(!existingUser)  
            return res.status(400).json({msg:"Email id is not exists"})

        const isMatch = await bcrypt.compare(password,existingUser.password)

        if(!isMatch ) 
            return res.status(400).json({msg:"password wrong"})

        const payload = {
            user:{
                id:existingUser.id
            }
        }

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "30m" },
            (err, token) => {
                if (err) throw err;
                return res.status(200).json({ msg: "Login successful",
                token,
                user: {
                        id: existingUser._id,
                        name: existingUser.name,
                        email: existingUser.email,
                        password:existingUser.password
                    }
                })     
            })  
}

     catch(error){
         return res.status(500).json({ msg: error.message });
    }
}