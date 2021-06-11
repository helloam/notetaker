const fs = require('fs');
const uniqid = require('uniqid');//found this unique ID generator in npm

module.exports = (app) => {
  var savedNotes = require(__dirname + '/../db/db.json');

  app.get('/api/notes', (req, res) => {
    res.json(savedNotes);
  });

  app.post('/api/notes', (req, res) => {
    var newText = req.body;
    newText.id = uniqid();

    savedNotes.push(newText);

    const dataInput = JSON.stringify(savedNotes);

    fs.writeFile(__dirname + '/../db/db.json', dataInput, (err) => {
      if (err) throw err;
    });
    res.end();
  });

  app.delete('/api/notes/:id', (req, res) => {
    var noteId = req.params.id;

    var filtered = savedNotes.filter(function (note) {
      return note.id != noteId;
    });

    newNoteData = JSON.stringify(filtered);
    savedNotes = filtered;

    fs.writeFileSync(__dirname + '/../db/db.json', newNoteData, (err) => {
      if (err) throw err;
    });

    res.end();
  });
};