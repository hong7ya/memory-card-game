import { JSDOM } from 'jsdom';
import { screen, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import game from './game';

async function render() {
  const dom = await JSDOM.fromFile('index.html');
  document.body.innerHTML = dom.window.document.body.innerHTML;

  const user = userEvent.setup();
  // html 로딩 후 실행 위함
  game(document.querySelector('#app'));

  return { user };
}

test('카드목록이 제대로 렌더링 된다.', async () => {
  const { user } = await render();

  const cards = screen.getAllByTestId('card');

  expect(cards).toHaveLength(12);

  cards.forEach((card) => {
    // 안에서 또 쿼리 하려면 within 사용
    expect(within(card).getByRole('checkbox')).toBeInTheDocument();
    expect(within(card).getByRole('img')).toBeInTheDocument();
  });
});
test('카드를 누르면 해당 카드는 보여지고 선택되며 다시 선택할 수 없다.', async () => {
  const { user } = await render();

  const cards = screen.getAllByTestId('card');

  await user.click(cards[0]);

  expect(within(cards[0]).getByRole('img')).toBeVisible();
  expect(within(cards[0]).getByRole('checkbox')).toBeChecked();
  expect(within(cards[0]).getByRole('checkbox')).toBeDisabled();
});

test('첫 번째 카드를 누른 후 두 번째 카드를 누르면, 같은 이미지일 경우 고정된다.', async () => {
  const { user } = await render();

  const [firstCard, secondCard] = screen
    .getAllByTestId('card')
    .filter(
      (ele) => ele.dataset.cardId === '1a' || ele.dataset.cardId === '1b'
    );

  await user.click(firstCard);
  await user.click(secondCard);

  expect(within(firstCard).getByRole('img')).toBeVisible();
  expect(within(firstCard).getByRole('checkbox')).toBeChecked();
  expect(within(firstCard).getByRole('checkbox')).toBeDisabled();

  expect(within(secondCard).getByRole('img')).toBeVisible();
  expect(within(secondCard).getByRole('checkbox')).toBeChecked();
  expect(within(secondCard).getByRole('checkbox')).toBeDisabled();
});

test('첫 번째 카드를 누른 후 두 번째 카드를 누르면, 다른 이미지일 경우 두 이미지 모두 누르기 이전 상태로 돌아간다.', async () => {
  const { user } = await render();

  const [firstCard, secondCard] = screen
    .getAllByTestId('card')
    .filter(
      (ele) => ele.dataset.cardId === '1a' || ele.dataset.cardId === '2b'
    );

  await user.click(firstCard);
  await user.click(secondCard);

  expect(within(firstCard).getByRole('img')).not.toBeVisible();
  expect(within(firstCard).getByRole('checkbox')).not.toBeChecked();
  expect(within(firstCard).getByRole('checkbox')).not.toBeDisabled();

  expect(within(secondCard).getByRole('img')).not.toBeVisible();
  expect(within(secondCard).getByRole('checkbox')).not.toBeChecked();
  expect(within(secondCard).getByRole('checkbox')).not.toBeDisabled();
});
