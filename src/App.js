import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Pages/Login/Login';
import About from './Pages/About/About';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">login</Link>
          </li>
          <li>
            <Link to="/about">about</Link>
          </li>
        </ul>
        <Routes>
          <Route exact path='/about' element={< About />}></Route>
          <Route exact path='/login' element={< Login />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
