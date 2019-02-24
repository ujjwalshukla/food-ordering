import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import withAuth from "./withAuth";

const NoMatch = ({ location }) => (
  <Redirect to='/' />
);

export default NoMatch;