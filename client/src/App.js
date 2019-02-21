import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import './App.css';

/* Once the 'Authservice' and 'withAuth' componenets are created, import them into restaurantList.js */
import AuthHelperMethods from './components/auth/AuthHelperMethods';

//Our higher order component
import withAuth from './components/auth/withAuth';

class App extends Component {

  state = {
    username: ''
  };
  /* Create a new instance of the 'AuthHelperMethods' compoenent*/
  Auth = new AuthHelperMethods();

  _handleLogout = () => {
    this.Auth.logout();
    this.props.history.push('/login');
  };

  componentWillMount() {
    console.log(this.props.history);
  }
  //Render the protected component
  render() {
    let name = null;
    if (this.props.confirm) {
      name = this.props.confirm.username;
    }
    //let name = this.props.confirm.username;
    console.log("Rendering Appjs!")
    return (

      <div className="App">
        <div className="App">
          <div className="main-page">
            <header className="top-section">
              <div>
                <span>Welcome, {name}</span>
                <button onClick={this._handleLogout}>LOGOUT</button>
              </div>
            </header>
            <div className="bottom-section">

            </div>
          </div>
        </div>
      </div>
    );
  }
}

//In order for this component to be protected, we must wrap it with what we call a 'Higher Order Component' or HOC.

export default withAuth(App);

