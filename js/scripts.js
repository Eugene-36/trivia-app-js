const game = document.getElementById('game'),
  scoreDisplay = document.getElementById('score');

let score = 0;

const genres = [
  {
    name: 'Books',
    id: 10,
  },
  {
    name: 'Film',
    id: 11,
  },
  {
    name: 'Music',
    id: 12,
  },
  {
    name: 'Video Games',
    id: 15,
  },
];
const levels = ['easy', 'medium', 'hard'];

function addGenre(genre) {
  const { name, id } = genre;
  console.log('genres', id);

  const column = document.createElement('div');
  column.classList.add('genre-column');
  column.innerHTML = name;
  game.append(column);

  levels.forEach((level) => {
    const card = document.createElement('div');
    card.classList.add('card');
    column.append(card);

    if (level === 'easy') {
      card.innerHTML = 100;
    }

    if (level === 'medium') {
      card.innerHTML = 200;
    }

    if (level === 'hard') {
      card.innerHTML = 300;
    }

    fetch(
      `https://opentdb.com/api.php?amount=1&category=${id}&difficulty=${level}&type=boolean`
    )
      .then((respons) => respons.json())
      .then((data) => {
        console.log('data', data);
        card.setAttribute('data-question', data.results[0].question);
        card.setAttribute('data-answer', data.results[0].correct_answer);
        card.setAttribute('data-value', card.getInnerHTML());
      })
      .then((done) => card.addEventListener('click', flipCard));
  });
}

//addGenre(genres[0]);
genres.forEach((genre) => addGenre(genre));

function flipCard() {
  this.innerHTML = '';
  this.style.fontSize = '15px';
  document.createElement('div');
  const textDisplay = document.createElement('div');
  const trueButton = document.createElement('button');
  const falseButton = document.createElement('button');

  trueButton.innerHTML = 'True';
  falseButton.innerHTML = 'False';

  // style for the button
  trueButton.classList.add('true-button');
  falseButton.classList.add('false-button');
  //===========
  trueButton.addEventListener('click', getResult);
  falseButton.addEventListener('click', getResult);
  //===========

  textDisplay.innerHTML = this.getAttribute('data-question');
  this.append(textDisplay, trueButton, falseButton);
  console.log('cheacking for the click ');

  const allCards = Array.from(document.querySelectorAll('.card'));

  allCards.forEach((card) => card.removeEventListener('click', flipCard));
}

function getResult() {
  const allCards = Array.from(document.querySelectorAll('.card'));
  allCards.forEach((card) => card.addEventListener('click', flipCard));

  const cardOfButton = this.parentElement;

  if (cardOfButton.getAttribute('data-answer') === this.innerHTML) {
    console.log('its a match');
    score = score + parseInt(cardOfButton.getAttribute('data-value'));
    scoreDisplay.innerHTML = score;
    cardOfButton.classList.add('correct-answer');

    setTimeout(() => {
      while (cardOfButton.firstChild) {
        cardOfButton.removeChild(cardOfButton.lastChild);
      }
      cardOfButton.innerHTML = cardOfButton.getAttribute('data-value');
    }, 100);
  } else {
    cardOfButton.classList.add('wrong-answer');

    setTimeout(() => {
      while (cardOfButton.firstChild) {
        cardOfButton.removeChild(cardOfButton.lastChild);
      }
      cardOfButton.innerHTML = 0;
    }, 100);
  }

  cardOfButton.removeEventListener('click', flipCard);
}
