export default function game(app) {
  const currentMatch = [];
  const goodMatchedCards = [];
  let clearTimer;

  const cards = getCards({ getCardElement });

  const randomCards = getRandomCards({ cards });

  const boardElement = getBoardElement({ randomCards });

  const resetButtonElement = getResetButtonElement();

  boardElement.addEventListener('click', (e) => {
    e.stopPropagation();
    let cardElement;
    // 카드 3장 이상 연속 클릭 할 때, (그 중 앞의 2장이 미스매치됨 + 빠르게 하나더 클릭) 카드가 오픈되는 상황 방지
    if (clearTimer) return;

    if (e.target.dataset.testid === 'card') {
      cardElement = e.target;
    }
    if (e.target.matches('input')) {
      cardElement = e.target.parentElement;
    }
    if (e.target.matches('img')) {
      cardElement = e.target.parentElement;
    }

    if (!cardElement) return;

    // 더블 클릭 방지
    if (cardElement.firstElementChild.disabled) return;

    matchWith({ cardId: cardElement.dataset.cardId });
  });

  resetButtonElement.addEventListener('click', (e) => {
    goodMatchedCards.length = 0;
    const cards = getCards({ getCardElement });
    const randomCards = getRandomCards({ cards });
    boardElement.innerHTML = getBoardElement({ randomCards }).innerHTML;
    if (document.querySelector('span')) {
      document.querySelector('span').remove();
    }
  });

  function matchWith({ cardId }) {
    if (currentMatch.length === 0 || currentMatch.length === 1) {
      openCard({
        cardElement: document.querySelector(`div[data-card-id="${cardId}"]`),
      });
      currentMatch.push(cardId);
    }
    if (currentMatch.length === 2) {
      const [firstId, secondId] = currentMatch;

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

      currentMatch.length = 0;
    }
    if (goodMatchedCards.length === 12) {
      const End = document.createElement('span');
      End.textContent = 'End!!!';
      app.prepend(End);
    }
  }

  function closeCard({ cardElement }) {
    const checkboxElement = cardElement.firstElementChild;
    checkboxElement.checked = false;
    checkboxElement.disabled = false;
    if (cardElement.classList.length === 0) {
      // Init
      cardElement.classList.add('closed');
      return;
    }
    if (currentMatch.length === 2) {
      clearTimer = setTimeout(() => {
        cardElement.classList.add('closed');
        if (cardElement.classList.contains('open')) {
          cardElement.classList.remove('open');
        }
        clearTimer = null;
      }, 500);
    }
  }

  function openCard({ cardElement }) {
    const checkboxElement = cardElement.firstElementChild;
    checkboxElement.checked = true;
    checkboxElement.disabled = true;
    cardElement.classList.add('open');
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
