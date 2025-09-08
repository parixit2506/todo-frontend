import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from './components/Landing.js';
import SignUp from './components/SignUp.js';
import Login from './components/Login.js';
import DashBoard from './components/DashBoard.js';
import Profile from "./components/Profile.js";
import Edit from "./components/Edit.js"
import Todos from "./components/Todos.js";
import CreateTask from "./components/CreateTask.js";
import PageNotFound from "./components/PageNotFound.js";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/CreateTask" element={<CreateTask/>} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Todos" element={<Todos />} />
        <Route path="/Edit/:id" element={<Edit />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;