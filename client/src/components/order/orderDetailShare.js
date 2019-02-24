import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import AuthHelperMethods from './../auth/AuthHelperMethods';
import socketIOClient from "socket.io-client";

const ORDER_API = '/api/share/orders/';

class orderDetailShare extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      orderDetailForUser: {},
      orderId: undefined,
      endpoint: "http://localhost:3000",
      active: false,
      orderStatus: false
    };
    this.toggleClass = this.toggleClass.bind(this);
    this.authHelperMethods = new AuthHelperMethods();
    this.subscribeToSocket = this.subscribeToSocket.bind(this);
  }

  componentWillMount = async () => {
    let orderId = this.props.match.params.orderId;
    console.log(orderId);
    try {
      this.authHelperMethods.fetch(ORDER_API + orderId)
        .then(data => {
          console.log(data);
          this.setState({ orderId, list: data.items, orderDetailForUser: data.orderDetailForUser, orderStatus: data.orderStatus });
          this.subscribeToSocket();
        });
    } catch (e) {

    }
  };

  subscribeToSocket() {
    console.log(this.state);

    let { endpoint, orderId } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on('connect', () => {
      console.log('connected');
      let userId = this.authHelperMethods.getUser();
      socket.emit('subscribe_share', {orderId, userId});
      socket.on("changed_item", (data) => {
        let orderDetailForUser = this.state.orderDetailForUser;
        orderDetailForUser[data.itemId] = data.quantity;
        this.setState({
          orderDetailForUser
        })
      });
      socket.on("order_completed", (data) => {
        this.setState({orderStatus: data.orderStatus})
      });
    });
  }


  addItem = async (id) => {
    console.log(id + this.state.restaurantId);
    try {
      const response = await this.authHelperMethods.fetch(ORDER_API, {
        method: 'POST',
        body: JSON.stringify({
          itemId: id,
          orderId: this.state.orderId
        })
      });
      console.log(response);
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
    return (
      <div>
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
              {list.map(item =>
                <tr key={item.id}>
                  <td>
                    <span>{item.name}</span>
                  </td>
                  <td>
                    <span>{item.cost}</span>
                  </td>
                  <td>
                    <button className={this.state.orderStatus?'hide':'show'} onClick={this.addItem.bind(this, item.id)}>add</button>
                  </td>
                  <td>
                    <span>{this.state.orderDetailForUser[item.id] || 0}</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

//In order for this component to be protected, we must wrap it with what we call a 'Higher Order Component' or HOC.

export default orderDetailShare;

