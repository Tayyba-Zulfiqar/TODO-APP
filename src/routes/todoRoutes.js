import express from "express";
import {prisma} from "../prismaClient.js"

const router = express.Router();

//  get todos for logged-in users

router.get("/", async (req, res) => {
  try {
    // fetch all todos that belong to the logged-in user
    const todos = await prisma.todo.findMany({
      where: {
        userId: req.userId,
      },
    });
    console.log(todos);
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(503).send({ message: "Failed to get todos" });
  }
});

// add new todos 

router.post("/", async (req, res) => {
  const { task } = req.body;
  try {
    // insert todo using Prisma
    const newTodo = await prisma.todo.create({
      data: {
        task,
        user: {
          connect: {
            id: req.userId,
          },
        },
      },
    });

    // send back the created todo
    res.json({ id: newTodo.id, task: newTodo.task, completed: newTodo.completed });
  } catch (error) {
    console.error(error);
    res.status(503).send({ message: "Failed to add todo" });
  }
});

// update a todo

router.put("/:id", async (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;

  try {
    const updatedTodo = await prisma.todo.updateMany({
      where: {
        id: parseInt(id),
        userId: req.userId,
      },
      data: {
        completed: !!completed, // make sure it's boolean
      },
    });

    res.json({ message: "Todo updated successfully", updatedTodo });
  } catch (error) {
    console.error(error);
    res.status(503).send({ message: "Failed to update todo" });
  }
});


// delete todo:

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // delete the todo that matches the id and belongs to the user
    await prisma.todo.deleteMany({
      where: {
        id: parseInt(id),
        userId: req.userId,
      },
    });

    res.json({ message: "deleted" });
  } catch (error) {
    console.error(error);
    res.status(503).send({ message: "Failed to delete todo" });
  }
});

export default router;
