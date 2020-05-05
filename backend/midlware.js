const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
try{
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, 'test_proba_izmisljam_jer_nisam_kreativan');
    next();
}catch(error){
    res.status(401).json({message:'auth failed'});

}

}