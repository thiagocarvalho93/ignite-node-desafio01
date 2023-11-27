import fs from "node:fs";
import { parse } from "csv-parse";

const filePath = new URL("file.csv", import.meta.url);

const postData = async (title, description) => {
  const response = await fetch("http://localhost:3333/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
    }),
  });
  console.log(
    response.status === 201 ? "Saved succesfully." : `Error while saving: ${response.status}`
  );
};

const processFile = async () => {
  const parser = fs.createReadStream(filePath).pipe(parse({ from: 2 }));

  for await (const row of parser) {
    const [title, description] = row;

    await postData(title, description);
  }
};

processFile();
