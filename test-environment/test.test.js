import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { JSDOM } from 'jsdom';

test('use jsdom in this test file', () => {
  const element = document.createElement('div');
  expect(element).not.toBeNull();
});

test('uses jest-dom', () => {
  document.body.innerHTML = `
    <span data-testid="not-empty"><span data-testid="empty"></span></span>
    <div data-testid="visible">Visible Example</div>
  `;

  expect(screen.queryByTestId('not-empty')).not.toBeEmptyDOMElement();
  expect(screen.getByText('Visible Example')).toBeVisible();
});

test('uses user-event : type into an input field', async () => {
  // We recommend invoking userEvent.setup() before the component is rendered.
  // https://testing-library.com/docs/user-event/intro/#writing-tests-with-userevent
  const user = userEvent.setup();

  const element = document.createElement('input');
  element.setAttribute('type', 'text');
  element.setAttribute('value', 'Hello,');
  document.body.appendChild(element);

  const textInput = screen.getByRole('textbox');

  await user.type(textInput, ' World!');

  expect(textInput).toHaveValue('Hello, World!');
});

test('init jsdom : synchronized with a html file', async () => {
  const dom = await JSDOM.fromFile('index.html');

  // use globalJSDOM for screen
  document.body.innerHTML = dom.window.document.body.innerHTML;

  document.body.appendChild(document.createElement('input'));

  // index.html의 body 내부 element와, 새로 추가한 textInput 공존 확인
  expect(screen.getByRole('main')).toBeInTheDocument();
  expect(screen.getByRole('textbox')).toBeInTheDocument();
});
