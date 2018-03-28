import React, { Component } from 'react';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import ReactDOM from 'react-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Login.css';

import Footer from './Footer.js';
import redblack from '../themes/redblack';

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
      <MuiThemeProvider muiTheme={getMuiTheme(redblack)}>
          <AppBar 
            title="Register"
          />
          <div class="form-container">
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
            <p>
              Already a member? <Link to="/login"><span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Login here</Link>
          </p> 
        </div>
        </MuiThemeProvider>
    );
  }
}

const style = {
  margin: 15,
};

export default Create;
