import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import ReactDOM from 'react-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Login.css';

import Footer from './Footer.js';

class Create extends Component {

  constructor() {
    super();
    this.state = {
      username: '',
      email: '',
      password: ''
    };
  }
  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { username, email, password } = this.state;

    axios.post('/api/auth/register', { username, email, password })
      .then((result) => {
        this.props.history.push("/login")
      });
  }

  render() {
    return (
      <MuiThemeProvider>
        <div class="container">
          <AppBar title="Register"/>
            <TextField
              hintText="Enter your Username"
              floatingLabelText="Username"
              onChange = {(event,newValue) => this.setState({username:newValue})}
              />
            <br/>
            <TextField
              hintText="Enter your Email"
              type="email"
              floatingLabelText="Email"
              onChange = {(event,newValue) => this.setState({email:newValue})}
              />
            <br/>
            <TextField
              type = "password"
              hintText="Enter your Password"
              floatingLabelText="Password"
              onChange = {(event,newValue) => this.setState({password:newValue})}
              />
            <br/>
            <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.onSubmit(event)}/>   
          <Footer />
        </div>
        </MuiThemeProvider>
    );
  }
}

const style = {
  margin: 15,
};

export default Create;
