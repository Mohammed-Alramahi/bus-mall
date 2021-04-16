'use strict';
let myChart=document.getElementById('myChart');
let leftImage = document.getElementById('left');
let middleImage = document.getElementById('mid');
let rightImage = document.getElementById('right');
let container = document.getElementById('content');
let showResultsBtn = document.getElementById('result');
let imageNames=['bag','banana','bathroom','boots','breakfast','bubblegum','chair','cthulhu','dog-duck','dragon','pen','pet-sweep','scissors','shark','sweep','tauntaun','unicorn','usb','water-can','wine-glass'];
let list=document.getElementById('shown');
let heading=document.getElementById('canvas-head');
let rightIndex=0,midIndex=0,leftIndex=0,tries = 0,maxtrials = 25;
showResultsBtn.style.display='none';
list.style.display='none';

function random() {
  return Math.floor(Math.random() * ImageConstructor.images.length);
}

function ImageConstructor(name, path) {
  this.name = name;
  this.path = path;
  this.viewsNumber = 0;
  this.votesNumber = 0;
  ImageConstructor.images.push(this);
}
ImageConstructor.images = [];

for(let i=0;i<imageNames.length;i++)
{
  new ImageConstructor(imageNames[i],'img/'+imageNames[i]+'.jpg');
}
let temp=[];
function renderContents() {
  leftIndex=random();
  midIndex=random();
  rightIndex=random();
  
  while ( midIndex === rightIndex|| leftIndex === rightIndex || leftIndex === midIndex||temp.includes(leftIndex)||temp.includes(midIndex)||temp.includes(rightIndex)) {
    leftIndex = random();
    midIndex = random();
    rightIndex = random();
  }
  middleImage.src = ImageConstructor.images[midIndex].path;
  leftImage.src = ImageConstructor.images[leftIndex].path;
  rightImage.src = ImageConstructor.images[rightIndex].path;
  ImageConstructor.images[rightIndex].viewsNumber++;
  ImageConstructor.images[leftIndex].viewsNumber++;
  ImageConstructor.images[midIndex].viewsNumber++;
  temp=[];
  temp.push(leftIndex,midIndex,rightIndex);
}
renderContents();

container.addEventListener('click', onUserClick);
function onUserClick(event) {
  tries++;
  if (tries <= maxtrials) {
    if (event.target.id === 'left') {
      ImageConstructor.images[leftIndex].votesNumber++;
      renderContents();
    } else if (event.target.id === 'mid') {
      ImageConstructor.images[midIndex].votesNumber++;
      renderContents();
    } else if (event.target.id === 'right') {
      ImageConstructor.images[rightIndex].votesNumber++;
      renderContents();
    }
  } else {
    container.removeEventListener('click', onUserClick);
    showResultsBtn.style.display='block';
    showResultsBtn.addEventListener('click', showResults);



  }}

function setStorage(){
  let serializedArr= JSON.stringify(ImageConstructor.images);
  localStorage.setItem('Image',serializedArr);
}
function getStorage(){
  if(localStorage.getItem('Image')!==null)
  {
  let arr=JSON.parse(localStorage.getItem('Image'));
    ImageConstructor.images=arr;
  }
}

let totalVotesNumber=[];
let totalViewsNumber=[];
function showResults() {

  //From previous lab
  /*for ( let i=0 ; i< ImageConstructor.images.length ; i++){
    let resultElement = document.createElement('li');
    list.appendChild(resultElement);
    resultElement.textContent = `${ImageConstructor.images[i].name} got a total of ${ImageConstructor.images[i].votesNumber} votes, and were viewed ${ImageConstructor.images[i].viewsNumber} times`;
  }*/


  for (let i = 0; i < ImageConstructor.images.length; i++) {
    totalVotesNumber.push(ImageConstructor.images[i].votesNumber);
    totalViewsNumber.push(ImageConstructor.images[i].viewsNumber);
  }
  showResultsBtn.removeEventListener('click', showResults);
  showResultsBtn.style.display='none';
  //list.style.display='block';
  rightImage.style.display='none';
  middleImage.style.display='none';
  leftImage.style.display='none';
  heading.style.display='block';
  setStorage();
  drawChart();
  getStorage();
 
}
function drawChart(){
  let ctx = document.getElementById('myChart').getContext('2d');
  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: imageNames,
      datasets: [{
        label: 'Votes',
        data: totalVotesNumber,
        backgroundColor: [
          'rgba(255, 99, 132, 1)',
        ],
        borderColor: [
          'rgba(0, 0, 0, 1)',
        ],
        borderWidth: 0.5,
      },
      {
        label: 'Views',
        data: totalViewsNumber,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
        ],
        borderColor: [
          'rgba(0, 0, 0, 1)',
        ],
        borderWidth: 1,
      }
      ],
    }
  });
}

