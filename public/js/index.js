const server = 'http://localhost:3000';
const form = document.getElementById('form');
studentId = document.getElementById('studentid');
studentName = document.getElementById('studentname');
studentScore = document.getElementById('studentscore');

async function fetchStudents() {
  const url = server + '/api/students';
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  };
  const response = await fetch(url, options);
  const students = await response.json();
  populateContent(students);
}

async function addStudent() {
  const url = server + '/api/students';
  const student = {
    id: studentId.value,
    name: studentName.value,
    score: parseInt(studentScore.value),
    grade: addGrade(studentScore.value),
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(student),
  };
  const response = await fetch(url, options);

  const newstudent = await response.json();
  displaynewStudent(newstudent);
}

async function deleteStudent(id) {
  const url = server + '/api/students/' + id;
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  await fetch(url, options);
}

function displaynewStudent(newstudent) {
  console.log(newstudent);
  if (newstudent.id) {
    var content = document.getElementById('content');
    var row = document.createElement('tr');
    content.appendChild(row);

    row.innerHTML = `<td>${newstudent.id}</td><td>${newstudent.name}</td><td>${newstudent.score}</td>`;
    form.reset();
  } else {
    alert(newstudent.msg);
    studentId.classList.add('is-invalid');
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (studentId.value && studentName.value && studentScore.value) {
    if (studentScore.value < 101 && studentScore.value > 0) {
      addStudent();
    } else {
      studentScore.classList.add('is-invalid');
    }
  } else {
    alert('Empty');
  }
});

function HandleDelete(e, id) {
  const item = e.target;
  const data = item.parentElement.parentElement;

  try {
    deleteStudent(id);
  } catch (error) {
    console.log(error);
  }
  data.remove();
}

function addGrade(score) {
  if (score > 89) {
    grade = 'A';
  } else if (score > 79) {
    grade = 'B';
  } else if (score > 69) {
    grade = 'C';
  } else if (score > 59) {
    grade = 'D';
  } else {
    grade = 'F';
  }

  return grade;
}
