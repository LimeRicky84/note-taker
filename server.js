const express = require("express");
const path = require("path");
const fs = require("fs-js");
const uuid = require("./helpers/uuid");

const PORT = 3001;
const app = express();

let notes = require("./db/db.json");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// routes
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get(
  "/notes",
  (req, res) => res.sendFile(path.join(__dirname, "public/notes.html"))

  // console.info
);

app.get("/api/notes", (req, res) => {
  fs.readFile("db/db.json", "utf8", (err) => {
    if (err) {
      console.log(err);
      return;
    }
    res.json(notes);
  });
});

app.post("/api/notes", (req, res) => {
//   const { title, text } = req.body;
  let timeStamp = Date.now();
  let ident = JSON.stringify(timeStamp)
//   if (title && text) {
    let newNote = {
      id: ident,
      title: noteTitle.req.body,
      text: noteText.req.body,
    };
    // notes.push(newNote);
    const noteString = JSON.stringify(newNote);
    fs.readFile("db/db.json", noteString, (err) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);
      }
      fs.writeFile;
    });

    const response = {
      status: "Note successfully saved to db.json",
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
//   } else {
//     res.status(500).json("All fields required");
//   }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
