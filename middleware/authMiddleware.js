import User from "../models/userModel.js"


    var userAuth = async function (req, res, next){

        try{
            const apiKey = req.query.apiKey;

            if(!apiKey){
                return res.status(400).json({message:"apiKey is mandatory"})
            }
            const user = await User.findOne({apiKey:apiKey})

            if(!user){
                return res.status(400).json({message:"apiKey does not exist"})
            }
            req.user = user;
            next();

        }catch(err){
            return res.status(400).send(err)
        }
    }


    export default userAuth;