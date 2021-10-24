const server = 'http://localhost:3000';

var average;
var medianNum;
var modeNum;
let students;
let scores = [];
let grades = [];

async function fetchStudents() {
  const url = server + '/api/students';
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  };
  const response = await fetch(url, options);
  students = await response.json();
  DataManipulation(students);
}

function DataManipulation(students) {
  students.map((student) => {
    scores.push(student.score);
    grades.push(student.grade);
  });
  plotGradeProjections();
  plotCharts();
}

const avgCalculator = (array) => array.reduce((a, b) => a + b) / array.length;

function plotGradeProjections() {
  gradelbl = ['A', 'B', 'C', 'D', 'F'];
  counts = [];
  const countOccurences = (arr, val) => {
    return arr.reduce((acc, elem) => {
      return val === elem ? acc + 1 : acc;
    }, 0);
  };

  gradelbl.forEach((i) => {
    counts.push(countOccurences(grades, i));
  });

  let chart1 = document.getElementById('chart1').getContext('2d');
  let grdchart = new Chart(chart1, {
    type: 'bar',
    data: {
      labels: gradelbl,
      datasets: [
        {
          label: gradelbl,
          data: counts,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Grade Report',
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });

  console.log(countOccurences(grades, 'B'));
  console.log(counts);
}

function plotCharts() {
  //find average
  average = avgCalculator(scores);

  //find median
  const arrSort = scores.sort();
  const mid = Math.ceil(scores.length / 2);
  const median =
    scores.length % 2 == 0
      ? (arrSort[mid] + arrSort[mid - 1]) / 2
      : arrSort[mid - 1];
  medianNum = median;

  //Mode
  modeNum = mode(scores);

  let data = [average, medianNum, modeNum];

  let chart2 = document.getElementById('chart2').getContext('2d');
  let grdchart1 = new Chart(chart2, {
    type: 'pie',
    data: {
      labels: ['Mean', 'Median', 'Mode'],
      datasets: [
        {
          label: 'Mean, Mode, Median',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
}

function mode(arr) {
  let freq = 0,
    freqNum,
    list = [];

  arr.forEach(function (num) {
    let foundNum = list.find(function (el) {
      return el.num == num;
    });

    if (foundNum) {
      foundNum.count++;
      if (foundNum.count > freq) {
        freqNum = num;
        freq = foundNum;
      }
    } else list.push({ num: num, count: 1 });
  });

  return freqNum;
}
