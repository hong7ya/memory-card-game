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
      let cardElement;
      if (e.target.dataset.testid === 'card') {
        cardElement = e.target;
      }
      if (e.target.matches('input')) {
        cardElement = e.target.parentElement;
      }
      if (e.target.matches('img')) {
        cardElement = e.target.parentElement;
      }
      openCard({ cardElement });

      if (clickableForMatch) {
        matchWith({ cardId: cardElement.dataset.cardId });
      }
    }
  });

  const resetButtonElement = getResetButtonElement();

  resetButtonElement.addEventListener('click', (e) => {
    const cards = getCards({ getCardElement });
    const randomCards = getRandomCards({ cards });
    boardElement.innerHTML = getBoardElement({ randomCards }).innerHTML;
  });

  const { clickableForMatch, matchWith } = getMatches();

  function getMatches() {
    const currentMatch = [];
    const goodMatchedCards = [];
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
          goodMatchedCards.push(firstCard, secondCard);
        }
      }
      if (goodMatchedCards.length === 12) {
        const End = document.createElement('span');
        End.textContent = 'End!!!';
        app.prepend(End);
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

  function openCard({ cardElement }) {
    const checkboxElement = cardElement.firstElementChild;
    checkboxElement.checked = true;
    checkboxElement.disabled = true;
    cardElement.style.opacity = 1;
  }

  app.append(boardElement, resetButtonElement);

  function getResetButtonElement() {
    const button = document.createElement('button');
    button.textContent = 'reset';

    return button;
  }

  function getBoardElement({ randomCards }) {
    const board = document.createElement('div');
    board.id = 'board';
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
    closeCard({ cardElement: card });

    return card;
  }
}
