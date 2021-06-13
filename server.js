
const express = require("express");
const path = require("path");
const fs = require ("fs");
const uuid = require("uuid");//found this unique ID generator in npm

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

//HTML Routes and Requests
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

//API Routes and Requests
//GET
app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/db.json"), function (err, data) {
    if(err) throw err;
    const notes = JSON.parse(data);
    res.json(notes);
  })
});

//POST
app.post("api/notes" , (req, res) => {
  fs.readFile(path.join(__dirname, "./db/db.json"), function (err, data) {
    if (err) throw err;
  const notes = JSON.parse(data);
  const newNotes = req.body;
  newNotes.id = uuid.v4();
  notes.push(newNotes);

  const createNote = JSON.stringify(notes);
  fs.writeFile(path.join(__dirname, "./db/db.json"), createNote, function (err, data) {
    if (err) throw err;
  });
  res.json(newNotes);
  console.log("Update your notes");
  })
});

//DELETE
app.delete("api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  fs.readFile(path.join(__dirname, "./db/db.json"), function (err, data) {
    if (err) throw err;
    const notes = JSON.parse(data);
    const notesArray = notes.filter(item => {
        return item.id !== noteId
    });
    fs.writeFile("./db/db.json", JSON.stringify(notesArray), function (err, data) {
        if (err) throw err;
        res.json(notesArray)

    });
  });

});

//LISTENER
app.listen(PORT, () => {
  console.log(`Angeli's Notetaker app is listening on PORT: ${PORT}`);
});