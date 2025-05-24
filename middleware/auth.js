import jwt from "jsonwebtoken";

export default function verifyJWT(req, res, next){
    const header = req.header("Authorization");
    if (header != null){
        const token = header.replace("Bearer ", "");
        jwt.verify(token, "tokenKey", (err, decoded)=>{
            if(decoded != null){
                req.user = decoded;
            }
        });
    }
    next(); //forward request
}