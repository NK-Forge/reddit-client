import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import postsReducer from '../features/posts/postsSlice';
import SearchBar from '../features/search/SearchBar';

const renderWithStore = () => {
  const store = configureStore({
    reducer: {
      posts: postsReducer,
    },
  });

  render(
    <Provider store={store}>
      <SearchBar />
    </Provider>
  );

  return store;
};

describe('SearchBar', () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: {
              children: [],
            },
          }),
      })
    );

    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('renders the search input and button', () => {
    renderWithStore();

    expect(screen.getByLabelText(/search posts/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('searches posts when a search term is submitted', async () => {
    const user = userEvent.setup();

    renderWithStore();

    await user.type(screen.getByLabelText(/search posts/i), 'react testing');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        'https://www.reddit.com/search.json?q=react%20testing&limit=25'
      );
    });
  });

  it('does not search when the input is empty', async () => {
    const user = userEvent.setup();

    renderWithStore();

    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(fetchMock).not.toHaveBeenCalled();
  });
});