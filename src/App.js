import React, {useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Link,} from 'react-router-dom';
import Login from './Controllers/Login/Login';
import Recent from './Controllers/Recent/Recent';
import Settings from './Controllers/Settings/Settings';
import Files from "./Controllers/Files/Files";
import './App.css';

window.API_URL = "http://localhost:8080/api";
window.BACKEND_BASE_URL = "http://localhost:8080";
window.FRONTEND_BASE_URL = "http://localhost:3000";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route exact path='/login' element={< Login/>}></Route>
                    <Route exact path='/' element={< Recent/>}></Route>
                    <Route exact path='/files' element={< Files/>}></Route>
                    <Route exact path='/settings' element={<Settings/>}></Route>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
