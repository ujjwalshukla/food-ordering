import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import './restaurantList.css';

/* Once the 'Authservice' and 'withAuth' componenets are created, import them into restaurantList.jsrantList.js */
import AuthHelperMethods from './../auth/AuthHelperMethods';

//Our higher order component
import withAuth from './../auth/withAuth';

const API = "/api/restaurant"
class RestaurantList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
    this.authHelperMethods = new AuthHelperMethods();
  }


  componentWillMount = async () => {
    try {
      this.authHelperMethods.fetch(API)
        .then(data => this.setState({ list: data }));
    } catch (e) {

    }
  };

  render() {
    const { list } = this.state;
    return (
        <div>
          <div>
            restaurant list
          </div>
          <ul>
            {list.map(restaurant =>
              <li key={restaurant.id}>
                <a href={'restaurant/' + restaurant.id}>{restaurant.name}</a>
              </li>
            )}
          </ul>
        </div>

    );
  }
}

//In order for this component to be protected, we must wrap it with what we call a 'Higher Order Component' or HOC.

export default RestaurantList;

