import { render } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { MemoryRouter } from 'react-router-dom';

test('renders App component without crashing', () => {
  const { container } = render(
    <Provider store={store}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </Provider>
  );
  expect(container).toBeDefined();
});
