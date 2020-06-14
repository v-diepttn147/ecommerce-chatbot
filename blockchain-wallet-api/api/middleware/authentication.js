const CONSTANT = require('../../config/constants');

module.exports = {

  authentication : (req,res,next) => {
    if (req.headers['authorization']){
      extractAuthen = req.headers['authorization'].substring(6)
      if(Buffer.from(extractAuthen, 'base64').toString('base64') !== extractAuthen){
            res.status(401).json({
            status : "fail",
            message : "wrong format basic authentication"
          })
        return
      }
      try{
        buf = Buffer.from(extractAuthen, 'base64');
        buf = buf.toString()
        authen = buf.split(":")
      }
      catch(error){
        res.status(400).json({
          status : "fail",
          message : "basic authentication problem"
        })
        console.log(error)
        return
      }


      if (authen.length === 2 && authen[0] === CONSTANT.basic_auth.id && authen[1] === CONSTANT.basic_auth.pass) {
        next();
      }
      else{
        res.status(401).json({
          status : "fail",
          message : "Id and password are required"
        })
        return
      }
    }
    else {
      res.status(401).json({
        status : "fail",
        message : "Id and password are required"
      })
      return
    }
  }
}
