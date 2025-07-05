import express from "express";
import bcrypt from "bcryptjs"; // convert passwords to hash
import jwt from "jsonwebtoken"; // add token to user so they don't need to login again
import {prisma} from "../prismaClient.js";
console.log(`Prisma Data: ${prisma}`)
const router = express.Router();

//register user:

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      return res.status(409).send({ message: "Username already taken" });
    }

    // encrypt the password:
    const hashedPassword = bcrypt.hashSync(password, 8);

    // inserting values into the database table using Prisma
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,

        // now we have user and want to add their first default todo:
        todos: {
          create: {
            task: "Hello :) Add your first todo",
          },
        },
      },
    });

    // creating a token:
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ token }); // send token to user
  } catch (error) {
    console.error(error);
    res.status(503).send({ message: "Registration failed" });
  }
});

// LOGGING IN user:

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // get user from database using Prisma
    const user = await prisma.user.findUnique({
      where: { username },
    });

    // IF user is not registered:
    if (!user) {
      return res.status(404).send({ message: "user not found" });
    }

    // comparing password:
    const passwordInValid = bcrypt.compareSync(password, user.password);

    // if password doesn’t match:
    if (!passwordInValid) {
      return res.status(404).send({ message: "In valid password" });
    }

    // if authentication is successful:
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ token }); // send token to user
  } catch (error) {
    console.error(error);
    res.status(503).send({ message: "Server error" });
  }
});

export default router;
