import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import './restaurantItemList.css';
import AuthHelperMethods from './../auth/AuthHelperMethods';
import socketIOClient from "socket.io-client";

const API = '/api/restaurant/';
const ORDER_API = '/api/orders';

class RestaurantItemList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      restaurantId: undefined,
      list: [],
      orderDetail: {},
      orderId: undefined,
      endpoint: "http://localhost:3000",
      active: false
    };
    this.toggleClass = this.toggleClass.bind(this);
    this.authHelperMethods = new AuthHelperMethods();
    this.subscribeToSocket = this.subscribeToSocket.bind(this);
  }

  componentWillMount = async () => {
    let restaurantId = this.props.match.params.restaurantId;
    try {
      this.authHelperMethods.fetch(API + restaurantId)
        .then(data => this.setState({ restaurantId, list: data }));
      this.authHelperMethods.fetch(API + restaurantId + '/order')
        .then(data => {
          if(data.orderId) {
            this.setState({ orderId: data.orderId, orderDetail: data.orderDetail});
            this.subscribeToSocket(data.orderId);
          }
        });
    } catch (e) {

    }
  };

  subscribeToSocket(orderId) {
    console.log(this.state);
    // if(this.state.orderId) {
      const { endpoint } = this.state;
      const socket = socketIOClient(endpoint);
      socket.on('connect', () => {
        console.log('connected');
        socket.emit('subscribe', orderId);
        socket.on("changed", (data) => {
          console.log(data);
          let orderDetail = this.state.orderDetail;
          orderDetail[data.itemId] = data.quantity;
          this.setState({
            orderDetail
          })
        });
      });
    // }
  }


  addItem = async (id) => {
    console.log(id + this.state.restaurantId);
    try {
      const response = await this.authHelperMethods.fetch(ORDER_API, {
        method: 'POST',
        body: JSON.stringify({
          itemId: id,
          restaurantId: this.state.restaurantId
        })
      });
      console.log(response);
      if(!this.state.currentOrderId) {
        let newState = {
          orderId: response.orderId,
          orderDetail: {
            ...this.state.orderDetail
          }
        };
        newState.orderDetail[response.itemId] = response.quantity;
        if(!this.state.orderId) {
          this.subscribeToSocket(response.orderId);
        }
        this.setState(newState);
      }
    } catch(e) {
      console.log(e);
    }
  };

  toggleClass() {
      const currentState = this.state.active;
      this.setState({ active: !currentState });
  };
  render() {
    console.log(this.props.match.params);
    const { list, orderId } = this.state;
    let viewOrder = '';
    let shareOrder = '';
    if(orderId) {
      viewOrder = <div>
        <a href={'/orders/' + orderId}>View Order Detail</a>
      </div>;
      shareOrder = <div className='share-order'>
        <button onClick={this.toggleClass}>Share Order List</button>
      </div>;
    }

    return (
      <div>
        <div>
          <div className='go-to-restaurant'>
            <Link to='/restaurant'>Go to Restaurants</Link>
          </div>
          {shareOrder}
        </div>

        <div className='new-line'>
          <div
              className={this.state.active ? 'show' : 'hide'}
          >
            <p>{this.state.endpoint}/share/order/{this.state.orderId}</p>
          </div>
        </div>

        <div className='new-line'>
          restaurant Item list {this.props.match.params.restaurantId}
        </div>
        <div>
          <table style={{"width": "100%"}}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Cost</th>
                <th>Action</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {list.map(restaurant =>
                <tr key={restaurant.id}>
                  <td>
                    <span>{restaurant.name}</span>
                  </td>
                  <td>
                    <span>{restaurant.cost}</span>
                  </td>
                  <td>
                    <button onClick={this.addItem.bind(this, restaurant.id)}>add</button>
                  </td>
                  <td>
                    <span>{this.state.orderDetail[restaurant.id] || 0}</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {viewOrder}
      </div>
    );
  }
}

//In order for this component to be protected, we must wrap it with what we call a 'Higher Order Component' or HOC.

export default RestaurantItemList;

