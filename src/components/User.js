import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import { error } from 'util';

class User extends Component {

    constructor(props) {
        console.log(props);
        console.log(props.match.params.uid);
        super(props);
        this.state = {
            movies: []
        };
    }

    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        axios.get('/user')
            .then(res => {
                console.log(res.data);
                this.setState({movies: res.data});
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    this.props.history.push("/login");
                }
            });
    }

    render(){
        return (
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <div class="container">
            <div class="panel panel-default">
                <div class="panel-body">
                    <table class="table table-stripe" id="movie-list">
                        <thead>
                        <tr>
                            {/* <th>Poster</th> */}
                            <th>Title</th>
                            <th>Rating</th>
                            <th>Progress</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.movies.map(movie =>
                            <tr>
                                {/* <td>
                                   <img src={movie.poster_path == null ? null: URL_IMG+IMG_SIZE_SMALL+movie.poster_path}/>
                                 </td>*/}
                                <td>{movie.title}</td>
                                <td>{movie.rating}</td>
                                <td>{movie.episodes_watched}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </MuiThemeProvider>
        );
    }
}

export default User;
