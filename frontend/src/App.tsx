import { useState } from 'react';
import HomePage from './HomePage';
import SearchPage from './SearchPage';
import './App.css';

function App() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      {!showSearch ? (
        <HomePage onGetStarted={() => setShowSearch(true)} />
      ) : (
        <SearchPage onBackHome={() => setShowSearch(false)} />
      )}
    </>
  );
}

export default App;