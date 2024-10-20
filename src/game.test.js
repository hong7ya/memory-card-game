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
