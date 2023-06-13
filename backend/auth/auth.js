const jsonwebtoken = require("jsonwebtoken");

const authVerify = async (req,res,next) => {
    try {
        const header = req.headers.authorization;
        if(header == null){
            return res.status(400).json({
                message : " missing token",
                err: null,
            });
        }

        let token = header.split(" ")[1];
        const SECRET_KEY = "secretcode";

        let decodedToken;
        try {
            decodedToken = await jsonwebtoken.verify(token, SECRET_KEY);
        } catch (error) {
            if (error instanceof jsonwebtoken.TokenExpiredError) {
                return res.status(400).json({
                    message: "token expired",
                    err: error,
                });
            }
            return res.status(400).json({
                message: "invalid token",
                err:error,
            });
        }

        req.userData = decodedToken;
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: error,
        });
    }
};

module.exports = {authVerify};