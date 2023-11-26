import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf-8")
      .then((data) => (this.#database = JSON.parse(data)))
      .catch(() => this.#persist());
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table, search) {
    let data = this.#database[table] ?? [];
    if (search) {
      console.log(search);
      const entries = Object.entries(search);
      data = data.filter((row) =>
        entries.some(([key, value]) => row[key].toLowerCase().includes(value.toLowerCase()))
      );
    }

    return data;
  }

  selectById(table, id) {
    let data = this.#database[table] ?? [];

    return data.find((x) => x.id === id);
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  update(table, id, data) {
    const index = this.#database[table].findIndex((row) => row.id === id);
    if (index < 0) return;

    this.#database[table][index] = { id, ...data };
    this.#persist();
  }

  delete(table, id) {
    const index = this.#database[table].findIndex((row) => row.id === id);
    if (index < 0) return;

    this.#database[table].splice(index, 1);

    this.#persist();
  }
}
