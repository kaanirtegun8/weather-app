import './App.css';
import React from 'react';
import SearchCity from './components/SearchCity';

function App() {
  return (
    <div className='app'>
      <h1 className='title'>Simple Weather App</h1>
      <SearchCity></SearchCity>
    </div>
  );
}

export default App;
