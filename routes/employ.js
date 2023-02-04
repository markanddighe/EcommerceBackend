import  express  from "express";
import Employ from "../models/employ.js"
import checkauth from "../middleware/auth.js";
import User from "../models/user.js"


const router=express.Router()


  
//post method start...........................................................
  router.post("/post",checkauth ,async (req, res) => {

        try {
          
          const {  name, age ,city, salary} = req.body;
  
          if(!name || !age || !city || !salary ){
            res.status(400).send({error:"please fill the data"})
         
          }else{
   
            if(age<18 || age>=60){
              
              res.status(400).send({error:"your age should be in between 18 to 60 then only you can apply"})
            }else{
               req.user.password= undefined,          // password ko show nhi krwane ke ley
               req.user.email= undefined  ,
               req.user.address= undefined ,
                req.user.cpassword= undefined , req.user.token= undefined ,
                 req.user.phone= undefined ,req.user.name= undefined
              
              const user = new Employ({

                name,age,city,salary,postedby:req.user,         //req.user me user login ki details hai
                
              });

              const userdata = await Employ.findOne({ name:req.body.name}) 
              if (userdata) {
                res.status(400).send({ error: "user already exist" })

                }else{
              user.save()
              .then(()=>res.json({
                success: 1,
                user
              }))
            }
            }
          }
        } catch (error) {
            res.status(400).send({error:"token is invalid user not found"})
          }
         
  })


  router.get("/api/get",checkauth ,async (req, res) => {

    try{

      const user = await User.find({ _id: req.user._id })

      if(req.user.isVarified === 0) {

        return  res.status(400).send({message:"you block by admin this reason you not get details"})
      }else{

    const get= await  Employ.find({postedby:req.user._id}) .populate("postedby", "name")

    res.status(200).send(get)
    // res.status(200).send(get)
   }
      }
    catch(err)
    {
      res.status(400).send({message:"you are not allow by admin"})
    }
     
})

  export default router