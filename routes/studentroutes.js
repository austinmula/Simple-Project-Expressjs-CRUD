const express = require('express');
const router = express.Router();
const fs = require('fs');
const fileName = 'studentdata.json';

let rawData = fs.readFileSync(fileName);
let data = JSON.parse(rawData);

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/', (request, response) => {
  data.sort((a, b) => (a.score > b.score ? -1 : 1));
  response.send(data);
});

router.post('/', (req, res) => {
  const newUser = {
    id: req.body.id,
    name: req.body.name,
    score: req.body.score,
    grade: req.body.grade,
  };

  const found = data.some((student) => student.id === req.body.id);

  if (!found) {
    try {
      data.push(newUser);
      fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
      res.send(newUser);
    } catch (error) {
      res.send(error);
    }
  } else {
    res
      .status(400)
      .json({ msg: `Student of ID ${req.body.id} already exists` });
  }
});

router.delete('/:id', (request, response) => {
  const found = data.some((student) => student.id === request.params.id);

  if (found) {
    data = data.filter((student) => student.id !== request.params.id);
    console.log(data);
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    response.end();
  } else {
    response.status(400).json({ msg: 'Invalid ID' });
  }
});

module.exports = router;
