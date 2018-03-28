import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import TDivider from 'material-ui/Divider';

import axios from 'axios';
import { Link } from 'react-router-dom';
import './Login.css';

import Footer from './Footer.js';
import { Divider } from 'material-ui/Divider';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import redblack from '../themes/redblack';


class Login extends Component {

  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      message: ''
    };
  }
  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { username, password } = this.state;

    axios.post('/api/auth/login', { username, password })
      .then((result) => {
        localStorage.setItem('jwtToken', result.data.token);
        this.setState({ message: '' });
        this.props.history.push('/landing')
      })
      .catch((error) => {
        if(error.response.status === 401) {
          this.setState({ message: 'Login failed. Username or password not match' });
        }
      });
  }

  render() {
    const { username, password, message } = this.state;
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(redblack)}>
        <AppBar
          titleStyle={{
            color: '#ffffff',
            background: '#d32f2f',
          }}
          style = {{background: '#d32f2f'}}
          showMenuIconButton = 'false'
          title="Login"
        />
        <div class="form-container">
          {message !== '' &&
            <div class="alert alert-warning alert-dismissible" role="alert">
              { message }
            </div>
          }
            <TextField
              hintText="Enter your Username"
              floatingLabelText="Username"
              onChange = {(event,newValue) => this.setState({username:newValue})}
            />
            <br/>
            <TextField
              type="password"
              hintText="Enter your Password"
              floatingLabelText="Password"
              onChange = {(event,newValue) => this.setState({password:newValue})}
            />
          <br/>
          <RaisedButton label="Submit" primary={true} style={{background: '#d32f2f'}} onClick={(event) => this.onSubmit(event)}/>
          <p>
            Not a member? <Link to="/register"><span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Register here</Link>
          </p>
        </div>
      </MuiThemeProvider>      
    );
  }
}

const style = {
  margin: 15,
 };
export default Login;
