import jwt from "jsonwebtoken";
import dotenv from "dotenv";
export default function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];

  //if no token is attached:

  if (!token) {
    return res.status(404).send({ message: "no token provided" });
  }

  //if token is attached:
  //verification of toke:
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).send({ message: "not valid token" });
    }

    //decoded id:  come from log in token we created earlier
    //attach that id to request body , so that it can access all the todos of that token
    req.userId = decoded.id;

    next(); //tells to move from middleware to the route.
    //req--> middleware --> --> route --> response

    //OVERALL STEPS:

    //encode id in login to a token, decode that token in middleware
    //attach that to request , request move to route
    //and all todos related to that token (which actually is id), are fetched
  });
}
