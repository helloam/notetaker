
//Defining dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");//found this unique ID generator in npm library

const app = express();
const PORT = process.env.PORT || 9000;

//Setting up middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//HTML Routing and Requests
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});


//API Routing and Requests
//GET for retrieving data
app.get("/api/notes", function (req, res) {
    fs.readFile(path.join(__dirname, "./db/db.json"), function (err, data) {
        if (err) throw err;
        const notes = JSON.parse(data);
        res.json(notes);
    })

});


//POST for creating a new note
app.post("/api/notes", function (req, res) {
    fs.readFile(path.join(__dirname, "./db/db.json"), function (err, data) {
        if (err) throw err;
        const notes = JSON.parse(data);
        const newInput = req.body;
        newInput.id = uuid.v4();
        notes.push(newInput);


        const createNew = JSON.stringify(notes);
        fs.writeFile(path.join(__dirname, "./db/db.json"), createNew, function (err, data) {
            if (err) throw err;
        });
        res.json(newInput);
    

    })

});


//DELETE for deleting notes
app.delete("/api/notes/:id", function (req, res) {
    const noteId = req.params.id;
    fs.readFile(path.join(__dirname, "./db/db.json"), function (err, data) {
        if (err) throw err;
        const notes = JSON.parse(data);
        const notesList = notes.filter(item => {
            return item.id !== noteId
        });
        fs.writeFile('./db/db.json', JSON.stringify(notesList), function (err, data) {
            if (err) throw err;
            res.json(notesList)

        });
    });

});

//LISTENER
app.listen(PORT, () => {
  console.log(`Angeli's Notetaker app is listening on PORT: ${PORT}`);
});