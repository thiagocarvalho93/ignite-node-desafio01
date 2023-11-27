import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";
import { TaskModel } from "./models/task-model.js";

const database = new Database();

export const routes = [
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      if (!req.body) return res.writeHead(415).end();

      const { description, title } = req.body;
      const task = TaskModel.create(title, description);

      if (!task.isValid()) {
        const errorMessages = JSON.stringify({
          errors: task.getValidationErrors(),
        });

        return res.writeHead(400).end(errorMessages);
      }

      database.insert("tasks", task);
      return res.writeHead(201).end();
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;
      const searchObj = {
        title: search,
        description: search,
      };

      const tasks = database.select("tasks", search ? searchObj : null);

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      if (!req.body) return res.writeHead(415).end();
      
      const { title, description } = req.body;
      const { id } = req.params;

      let taskDb = database.selectById("tasks", id);

      if (!taskDb) {
        const errorMessages = JSON.stringify({
          errors: [`Task ${id} not found.`],
        });

        return res.writeHead(400).end(errorMessages);
      }

      let task = TaskModel.parse(taskDb);
      task.update(title, description);

      if (!task.isValid()) {
        const errorMessages = JSON.stringify({
          errors: task.getValidationErrors(),
        });

        return res.writeHead(400).end(errorMessages);
      }

      database.update("tasks", id, task);

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      let taskDb = database.selectById("tasks", id);

      if (!taskDb) {
        const errorMessages = JSON.stringify({
          errors: [`Task ${id} not found.`],
        });

        return res.writeHead(404).end(errorMessages);
      }

      database.delete("tasks", id);

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      let taskDb = database.selectById("tasks", id);

      if (!taskDb) {
        const errorMessages = JSON.stringify({
          errors: [`Task ${id} not found.`],
        });

        return res.writeHead(404).end(errorMessages);
      }

      let task = TaskModel.parse(taskDb);
      task.complete();

      database.update("tasks", id, task);

      return res.writeHead(204).end();
    },
  },
];
