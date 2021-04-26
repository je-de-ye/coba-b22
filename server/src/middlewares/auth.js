const jwt = require('jsonwebtoken');

const secretKey = "0a9sd0asd9mnds";

exports.auhtenticated = (req, res, next) => {
    try {
        let header, token;

        console.log("req", req.header("Authorization"));

        if (!(header = req.header("Authorization")) || !(token = header.replace("Bearer ", ""))) {
            return res.status(400).send({
                status: "Failed",
                message: "Access Denied"
            })
        }

        const verified = jwt.verify(token, secretKey);
        req.userId = verified;

        next();

    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: "Invalid Token",
        });
    }
}