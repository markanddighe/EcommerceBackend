import express from "express";
import User from "../models/user.js"
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import moment from 'moment'
import jwt from 'jsonwebtoken'
dotenv.config()


const authrouter = express.Router()


//BCRYPT PASSWORD USE THIS METHOD START
const secure = async (password) => {

    try {
      const passwordhash = await bcrypt.hash(password, 10)
      return passwordhash
  
    } catch (error) {
      res.status(400).send({ message: "error" })
    }
  }
  //BCRYPT PASSWORD USE THIS METHOD END


// Token create ke ley
const createtoken = async (id, res) => {

  try {

    // const tokn = await Jwt.sign({ _id: id }, config.secret)

    const tokn = await jwt.sign({ _id: id }, "privatekey", {

      expiresIn: "24h"
    })

    return tokn

  } catch (error) {

    res.send("error")
  }
}


authrouter.post("/register", async (req, res) => {

    const { name, email, password, cpassword, phone, address } = req.body
    var emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  
    if (!name || !email || !password || !cpassword || !phone || !address) {
  
      return res.status(422).send({ error: "please fill the field properly" })
    }
    var valid = emailRegex.test(email);
  
    if (!valid) {
      return res.status(422).send({ error: "you have enter a valid email address." })
    }
    if (phone.toString().length != 10) {
  
      return res.status(422).send({ error: "mobile number must be 10 digit" })
    }
    else {
  
      const spassword = await secure(req.body.password)
  
      const user = new User({
        name, email, phone, address,
        password: spassword,
        cpassword: spassword,
      })
  
      const userdata = await User.findOne({ email: req.body.email })
  
      if (userdata) {
  
        res.status(400).send({ error: "user already exist" })
  
      } else if (password != cpassword) {
  
        return res.status(422).send({ error: "password are not match" })
      }
      else {
  
        const userdata1 = await user.save()
  
  
        res.status(200).send({ message: "user register successfully" })
  
      }
    }
  });
  


//post method user register HIDE PASSWORD and BCRYPT PASSWORD START......................................
authrouter.post("/login", async (req, res, next) => {

  const { email, password } = req.body;

  if (!email || !password) {

    res.status(400).send({ error: "please fill the proper field " })
  }
  else {

    let user = await User.findOne({ email: req.body.email })

    if (!user) {

      return res.status(404).send({ error: "invalid email" })

    } else if (user.isVarified === 0) {

      res.status(400).send({ error: "not allow by admin" })

    } else {
      const checkpassword = await bcrypt.compare(req.body.password, user.password);

      if (!checkpassword) {

        return res.status(404).send({ error: "invalid password" })
      }
      const token = await createtoken(user._id)

      const date = moment().format('L')

      let Id = user._id
      res.status(200).send({ success: "😉welcome user..!!", token:token, auth:Id, date })

    }
  }
})

  export default authrouter