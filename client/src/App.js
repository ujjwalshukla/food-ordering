import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Link, Redirect, Switch} from 'react-router-dom';
import './App.css';

/* Once the 'Authservice' and 'withAuth' componenets are created, import them into restaurantList.js */
import AuthHelperMethods from './components/auth/AuthHelperMethods';

//Our higher order component
import withAuth from './components/auth/withAuth';
import restaurantList from './components/restaurant/restaurantList';
import restaurantItemList from './components/restaurant/restaurantItemList';
import GoToRoot from "./components/auth/goToRoot";
import OrderDetail from "./components/order/orderDetail";

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
              <div className="top-section">
                <div>
                  <span>Welcome, {name}</span>
                  <button onClick={this._handleLogout}>LOGOUT</button>
                  <span>
                    <Link to='/orders'>My Orders</Link>
                  </span>
                </div>
              </div>

              <div>

              </div>

              <div className="bottom-section">
                <Switch>
                  <Route path='/restaurant/:restaurantId' component={restaurantItemList} />
                  {/*<Route exact path='/orders' component={restaurantItemList} />*/}
                  <Route path='/orders/:orderId' component={OrderDetail} />
                  <Route path='/share/order/:orderId' component={OrderDetail} />
                  <Route exact path='/' component={restaurantList} />
                  <Route component={GoToRoot} />
                </Switch>
              </div>
            </div>
          </div>
        </div>

    );
  }
}

//In order for this component to be protected, we must wrap it with what we call a 'Higher Order Component' or HOC.

export default withAuth(App);

