import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import './index.css';
import App from './App';
import Login from './login';
import Signup from './signup';
import registerServiceWorker from './registerServiceWorker';

/* Here we will create our routes right off the bat in order to
prevent the user from getting very far in our app without authentication. */
ReactDOM.render(
    <Router>
        <div>
            <Switch>
                <Route exact path="/login" component={Login} />
                <Route exact path="/signup" component={Signup} />
                <Route path="/" component={App} />
            </Switch>
        </div>
    </Router>, document.getElementById('root'));
registerServiceWorker();
