export default function game(app) {
  const cards = getCards({ getCardElement });

  const randomCards = getRandomCards({ cards });

  const boardElement = getBoardElement({ randomCards });

  boardElement.addEventListener('click', (e) => {
    if (
      e.target.dataset.testid === 'card' ||
      e.target.matches('input') ||
      e.target.matches('img')
    ) {
      let checkboxElement;
      if (e.target.dataset.testid === 'card') {
        checkboxElement = e.target.firstElementChild;
      }
      if (e.target.matches('input')) {
        checkboxElement = e.target;
      }
      if (e.target.matches('img')) {
        checkboxElement = e.target.previousElementSibling;
      }
      checkboxElement.checked = true;
      checkboxElement.disabled = true;

      if (clickableForMatch) {
        matchWith({ cardId: checkboxElement.parentElement.dataset.cardId });
      }
    }
  });

  const { clickableForMatch, matchWith } = getMatches();

  function getMatches() {
    const currentMatch = [];
    const clickableForMatch = currentMatch.length < 2;
    function matchWith({ cardId }) {
      currentMatch.push(cardId);
      if (currentMatch.length === 2) {
        const firstId = currentMatch.pop();
        const secondId = currentMatch.pop();

        const firstCard = document.querySelector(
          `div[data-card-id="${firstId}"]`
        );
        const secondCard = document.querySelector(
          `div[data-card-id="${secondId}"]`
        );

        if (firstId[0] !== secondId[0]) {
          closeCard({ cardElement: firstCard });
          closeCard({ cardElement: secondCard });
        } else {
        }
      }
    }

    return { clickableForMatch, matchWith };
  }

  function closeCard({ cardElement }) {
    const checkboxElement = cardElement.firstElementChild;
    checkboxElement.checked = false;
    checkboxElement.disabled = false;
    cardElement.style.opacity = 0;
  }
  app.append(boardElement);
  function getBoardElement({ randomCards }) {
    const board = document.createElement('div');
    board.dataset.testid = 'board';
    board.append(...randomCards.values());

    return board;
  }
  function getRandomCards({ cards }) {
    const showedRandoms = new Set();
    for (let i = 1; i <= 12; i++) {
      let randomNum = Math.floor(Math.random() * 12) + 1;
      while (showedRandoms.has(randomNum)) {
        randomNum = Math.floor(Math.random() * 12) + 1;
      }
      showedRandoms.add(randomNum);
    }

    const randomCards = new Map();
    for (const random of showedRandoms.values()) {
      randomCards.set(random, cards.get(random));
    }

    return randomCards;
  }
  function getCards({ getCardElement }) {
    const cards = new Map();
    for (let i = 1; i <= 6; i++) {
      const cardElement1 = getCardElement({ imageNum: i, cardId: `${i}a` });
      cards.set(i, cardElement1);

      const cardElement2 = getCardElement({ imageNum: i, cardId: `${i}b` });
      cards.set(i + 6, cardElement2);
    }
    return cards;
  }
  function getCardElement({ imageNum, cardId }) {
    const card = document.createElement('div');
    card.dataset.testid = 'card';
    card.dataset.cardId = cardId;

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.name = imageNum;

    const img = document.createElement('img');
    img.src = `/card${imageNum}.png`;

    card.append(check, img);

    return card;
  }
}
