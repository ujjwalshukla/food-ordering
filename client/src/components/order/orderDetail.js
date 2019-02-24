import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import './orderDetail.css';
import AuthHelperMethods from './../auth/AuthHelperMethods';
import socketIOClient from "socket.io-client";

const ORDER_API = '/api/orders';


class OrderDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      restaurantId: undefined,
      list: [],
      totalCost: 0,
      orderDetail: {},
      orderId: undefined,
      endpoint: "http://localhost:3000"
    };
    this.authHelperMethods = new AuthHelperMethods();
    this.subscribeToSocket = this.subscribeToSocket.bind(this);
  }

  componentWillMount = async () => {
    let orderId = this.props.match.params.orderId;
    try {
      this.authHelperMethods.fetch(ORDER_API + '/' + orderId)
        .then(data => {
          this.setState({
            orderId: orderId,
            restaurantId: data.restaurantId,
            list: data.itemDetail
          });
          this.subscribeToSocket(this.state.orderId);
          this.calculateTotalCost();
        });
    } catch (e) {

    }
  };

  calculateTotalCost() {
    let { list } = this.state;
    this.setState({
      totalCost: list.reduce(( cost, order ) => {
        return cost + order.quantity*order.cost;
      }, 0)
    })
  }

  subscribeToSocket(orderId) {
    console.log(this.state);
    let { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on('connect', () => {
      console.log('connected');
      socket.emit('subscribe', orderId);
      socket.on("changed", (data) => {
        console.log(data);
        let { list } = this.state;
        let changeItemId = data.itemId;
        let toChangeList = list.filter((order) => order.id === changeItemId);
        console.log(list);
        if(toChangeList.length > 0) {
          list = list.map((order)=> {
            if(order.id === changeItemId) {
              order.quantity = data.quantity;
            }
            return order
          });
          console.log(toChangeList)
        } else {
          list.push({
            cost: data.item.cost,
            id: data.itemId,
            name: data.item.name,
            quantity: data.quantity
          })
        }
        this.setState({list});
        this.calculateTotalCost();
      });
    });
  }

  completeOrder() {
    this.authHelperMethods.fetch(ORDER_API + '/' + this.state.orderId + '/complete' )
  }

  render() {
    console.log(this.props.match.params);
    const { list } = this.state;
    let viewOrder = '';

    return (
      <div>
        <div>
          restaurant Item list {this.props.match.params.restaurantId}
        </div>
        <div><Link to={'/restaurant/'+this.state.restaurantId}>Go to Restaurant</Link></div>
        <div>
          <table style={{'width': '100%'}}>
             <thead>
               <tr>
                <th>Name</th>
                <th>Cost</th>
                <th>Quantity</th>
               </tr>
            </thead>
            <tbody>
              {list.map(order =>
                <tr key={order.id}>
                  <td>
                    <span>{order.name}</span>
                  </td>
                  <td>
                    {order.cost}
                  </td>
                  <td>
                    <span>{order.quantity || 0}</span>
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
        <div>Total Cost: {this.state.totalCost}</div>
        <div>
          <button onClick={this.completeOrder}>Complete Order</button>
        </div>
      </div>
    );
  }
}

//In order for this component to be protected, we must wrap it with what we call a 'Higher Order Component' or HOC.

export default OrderDetail;

