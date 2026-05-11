import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { searchPosts, setSearchTerm } from '../posts/postsSlice';

export default function SearchBar() {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedSearchTerm = localSearchTerm.trim();

    if (!trimmedSearchTerm) {
      return;
    }

    dispatch(setSearchTerm(trimmedSearchTerm));
    dispatch(searchPosts(trimmedSearchTerm));
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="search"
        value={localSearchTerm}
        onChange={(event) => setLocalSearchTerm(event.target.value)}
        placeholder="Search posts..."
        aria-label="Search posts"
      />
      <button type="submit">Search</button>
    </form>
  );
}