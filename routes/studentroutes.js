const express = require('express');
const router = express.Router();
const fs = require('fs');
const fileName = 'studentdata.json';

let rawData = fs.readFileSync(fileName);
let data = JSON.parse(rawData);

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
/*
   @get request
   GET all users
*/
router.get('/', (request, response) => {
  response.send(data);
});

/*
@get request
GET single users
*/
router.get('/:id', (request, response) => {
  const found = data.some((student) => student.id === request.params.id);

  if (found) {
    single = data.filter((student) => student.id === request.params.id);
    response.send(single);
  } else {
    response.status(400).json({ msg: 'User not Found' });
  }
});

/*
@post request
POST user details
*/
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

/*
@delete request
DELETE user 
*/
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

// Update user Details

router.put('/:id', (req, res) => {
  const found = data.some((student) => student.id === req.params.id);
  console.log(req.params.id);

  if (found) {
    const updstudent = req.body;
    console.log(updstudent);
    data.forEach((student) => {
      if (student.id === req.params.id) {
        student.name = updstudent.name ? updstudent.name : student.name;
        student.score = updstudent.score ? updstudent.score : student.score;

        res.json({ msg: 'Updated Successfully', student });
      }
    });
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
  } else {
    res.status(400).json({ msg: 'User not Found' });
  }
});

module.exports = router;
