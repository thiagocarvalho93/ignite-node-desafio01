import { randomUUID } from "node:crypto";

export class TaskModel {
  constructor({ id, title, description, completed_at, created_at, updated_at }) {
    this.id = id || randomUUID();
    this.title = title;
    this.description = description;
    this.completed = completed_at || null;
    this.created_at = created_at || Date.now();
    this.updated_at = updated_at || Date.now();
  }

  static create(title, description) {
    return new TaskModel({
      id: randomUUID(),
      title,
      description,
      completed_at: null,
      created_at: Date.now(),
      updated_at: Date.now(),
    });
  }

  static parse(obj) {
    return new TaskModel(obj);
  }

  update(title, description) {
    this.title = title;
    this.description = description;
    this.updated_at = Date.now();
  }

  isValid() {
    return !!(this.title && this.description);
  }

  getValidationErrors() {
    let errors = [];

    if (!this.title) {
      errors.push("Title is required.");
    }
    if (!this.description) {
      errors.push("Description is required.");
    }

    return errors;
  }

  complete() {
    this.completed_at = Date.now();
    this.updated_at = Date.now();
  }
}
