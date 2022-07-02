const express = require("express");
const path = require("path");
const fs = require("fs-js");
const uuid = require("./helpers/uuid");

const PORT = process.env.PORT || 8080;
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
);

// display route
app.get("/api/notes", (req, res) => {
  fs.readFile("db/db.json", "utf8", (err) => {
    if (err) {
      console.log(err);
      return;
    }
    res.json(notes);
  });
});
// post route
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  let timeStamp = Date.now();
  let ident = JSON.stringify(timeStamp);
  if (title && text) {
    console.log(req.body);
    let newNote = {
      title,
      text,
      id: ident,
    };
    notes.push(newNote);
    const noteString = JSON.stringify(notes, null, 2);
    fs.writeFile("db/db.json", noteString, (err) => {
        if (err) {
          console.error(err);
        } else {
          const parsedNotes = JSON.parse(noteString);
          parsedNotes.push(noteString);
        }
      });

    const response = {
      status: "Note saved to db.json",
      body: newNote,
    };

    // console.log(response);
    res.status(201).json(response);
  } else {
    res.status(400).json("All fields required");
  }
});

// delete route
app.delete("/api/notes/:id", (req, res) => {
  let noteId = req.params.id;
  fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) console.log(err)
    let currentNotes = JSON.parse(data).filter((note) => {
      return note.id !== noteId;
    });
    notes = currentNotes;
    const stringNote = JSON.stringify(currentNotes);
    fs.writeFile("db/db.json", stringNote, (err) => {
      if (err) console.log(err);
      else {
        console.log("Note deleted from db.json");
      }
    });
    res.json(stringNote);
  });
});
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
