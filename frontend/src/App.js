import Home from './Pages/Home';
import Signin from './Pages/Signin'
import Signup from './Pages/Signup'
import { BrowserRouter as Router, Switch, Redirect, Route } from "react-router-dom";
import UserProfile from './Pages/Dashboard/MemberDashboard/MemberDashboard.js';
import Allbooks from './Pages/Allbooks';
import Header from './Components/Header';
import AdminDashboard from './Pages/Dashboard/AdminDashboard/AdminDashboard.js';
import { useContext } from "react"
import { AuthContext } from "./Context/AuthContext.js"
import BookDetails from "./Pages/BookDetails";

function App() {

  const { user } = useContext(AuthContext)

  return (
    <Router>
      <Header />
      <div className="App">
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route exact path='/signin'>
            {user ? (user.isAdmin ? <Redirect to='/dashboard@admin' /> : <Redirect to='/profile' />) : <Signin />}
          </Route>
          <Route exact path='/signup'>
            {user ? (user.isAdmin ? <Redirect to='/dashboard@admin' /> : <Redirect to='/profile' />) : <Signup />}
          </Route>
          <Route exact path='/profile'>
            {user ? (user.isAdmin === false ? <UserProfile /> : <Redirect to='/' />) : <Redirect to='/' />}
          </Route>
          <Route exact path='/dashboard@admin'>
            {user ? (user.isAdmin === true ? <AdminDashboard /> : <Redirect to='/' />) : <Redirect to='/' />}
          </Route>
          <Route exact path='/books'>
            <Allbooks />
          </Route>
          <Route path="/book/:id">
       
            <BookDetails />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;