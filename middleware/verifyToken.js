const jwt = require('jsonwebtoken')

const verifyToken = (req,res,next) => {
    const token = req.cookies.token
    if(!token){
        return res.status(401).json('You are not authenticated')
    }
    jwt.verify(token,process.env.JWT_SECRET,async (err,data) => {
        if(err){
            return req.status(403).json("Your token is invalid")
        }
        req.userId=data._id
        console.log('passed')
        next()
    })
}

module.exports = verifyToken