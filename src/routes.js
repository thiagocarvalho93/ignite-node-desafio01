import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";
import { TaskModel } from "./models/task-model.js";

const database = new Database();

export const routes = [
  // Criação de uma task
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { description, title } = req.body;
      const task = TaskModel.create(description, title);

      if (!task.isValid()) {
        return res.writeHead(400).end();
      }

      database.insert("tasks", task);
      return res.writeHead(201).end();
    },
  },
  // Listagem de todas as tasks
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
  // Atualização de uma task pelo id
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      let taskDb = database.selectById("tasks", id);

      if (!taskDb) {
        return res.writeHead(404).end();
      }

      const { title, description } = req.body;
      let task = new TaskModel(taskDb);
      task.update(title, description);

      if (!task.isValid()) {
        return res.writeHead(400).end();
      }

      database.update("tasks", id, task);

      return res.writeHead(204).end();
    },
  },
  // Remover uma task pelo id
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      let taskDb = database.selectById("tasks", id);

      if (!taskDb) {
        return res.writeHead(404).end();
      }

      database.delete("tasks", id);

      return res.writeHead(204).end();
    },
  },
  // Marcar pelo id uma task como completa
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      let taskDb = database.selectById("tasks", id);

      if (!taskDb) {
        return res.writeHead(404).end();
      }

      let task = new TaskModel(taskDb);
      task.complete();
      
      database.update("tasks", id, task);

      return res.writeHead(204).end();
    },
  },

  // Importação de tasks em massa por um arquivo CSV
];
