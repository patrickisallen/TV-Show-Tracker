import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import { error } from 'util';
import ReactDOM from 'react-dom';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

import Modal from './Modal';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Tabs, {Tab} from 'material-ui/Tabs';

const styles = {
    propContainer: {
      width: 1000,
      overflow: 'hidden',
      margin: '20px auto 0',
    },
    propToggleHeader: {
      margin: '20px auto 10px',
    },
  };


class User extends Component {
    state = {
        fixedHeader: true,
        fixedFooter: true,
        stripedRows: true,
        showRowHover: true,
        selectable: true,
        multiSelectable: false,
        enableSelectAll: false,
        deselectOnClickaway: true,
        showCheckboxes: true,
        displaySelectAll: false,
        adjustForCheckbox: false,
        height: '1000px',
      };
    
      handleToggle = (event, toggled) => {
        this.setState({
          [event.target.name]: toggled,
        });
      };
    
      handleChange = (event) => {
        this.setState({height: event.target.value});
      };

      constructor(props) {
        console.log(props);
        console.log(props.match.params.uid);
        super(props);
        this.state = {
            user: props.match.params.uid,
            movies: []
        };
    }

    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        axios.get('/user/' + this.state.user)
            .then(res => {
                console.log(res.data);
                this.setState({movies: res.data});
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    this.props.history.push("/login");
                }
                else if (error.response.status === 403) {
                    const element = (
                      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                        <div class="container">
                          <h1>User not found</h1>
                        </div>
                      </MuiThemeProvider>
                    );
                    ReactDOM.render(element, document.getElementById('container'));
                }
            });
    }

    componentWillReceiveProps(nextProps) {
        axios.get('/user')
        .then(res => {
            console.log(res.data);
            this.setState({movies: res.data}, () => {
                console.log("state updated", this.state)
            });
        })
        .catch((error) => {
            if (error.response.status === 401) {
                this.props.history.push("/login");
            }
        });
    }
    render () {
        return(
            <div style={styles.propContainer}>
                <Table>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn>Title</TableHeaderColumn>
                        <TableHeaderColumn>Rating</TableHeaderColumn>
                        <TableHeaderColumn>Progress</TableHeaderColumn>
                        <TableHeaderColumn>Status</TableHeaderColumn>
                    </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                    {this.state.movies.map(movie =>
                        <ClickableRow>
                            <TableRowColumn>{movie.title}</TableRowColumn>
                            <TableRowColumn>{movie.rating}</TableRowColumn>
                            <TableRowColumn>{movie.episodes_watched} / {movie.episodes_total}</TableRowColumn>
                            <TableRowColumn>{movie.status}</TableRowColumn>
                        </ClickableRow>
                    )}
                    </TableBody>
                </Table>
            </div>
        )
    }
}

export const ClickableRow = (props) => {
    // Destructure props to keep the expected MUI TableRow props
    // while having access to the rowData prop
    const {rowData, ...restProps} = props;
    return (
      <TableRow
        {...restProps}
        onMouseDown={()=> {alert('Click event on row')}}>
        {props.children}
      </TableRow>
    )
  };

export default User;
