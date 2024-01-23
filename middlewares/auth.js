import jwt from "jsonwebtoken";

const auth = async(req, res, next) => {
   let token ;
    if(req.header){
        try { 
            token = await req.headers["x-auth-token"];
            const decodeData = jwt.verify(token,process.env.JWT_SECRET);
            req.userId = await decodeData?.id;
            next();
            
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Internal Server Error!!!"});
  }
}
}

export default auth;