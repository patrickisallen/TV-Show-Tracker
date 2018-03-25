import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class App extends Component {


    logout = () => {
        localStorage.removeItem('jwtToken');
        window.location.reload();
    };

    constructor(props) {
        super(props);
        this.state = {
            movies: [],
            searchText: '',
            searchSuggestions: []
        };
    }

    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        axios.get('/api/movie')
            .then(res => {
                this.setState({movies: res.data});
                console.log(this.state.movies);
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    this.props.history.push("/login");
                }
            });
    }

    // SEARCH BAR IMPLEMENTATION

    getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : this.state.movies.filter(movie =>
            movie.title.toLowerCase().slice(0, inputLength) === inputValue
        );
    };

    getSuggestionValue = suggestion => suggestion.name;

    renderSuggestion = suggestion => (
        <span>
            {suggestion.title}
        </span>
    );

    renderSectionTitle(section) {
        return (
            <strong>{section.isbn}</strong>
        );
    }

    onChange = (event, { newValue }) => {
        this.setState({
            searchText: newValue
        });
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            searchSuggestions: this.getSuggestions(value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            searchSuggestions: []
        });
    };

    // SEARCH BAR IMPLEMENTATION -- END

    render(){
        const value = this.state.searchText;
        const suggestions = this.state.searchSuggestions;
        const inputProps = {
            placeholder: 'Type a movie title',
            value,
            onChange: this.onChange
        };

        return (
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <div class="container">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">
                        Movie Collection &nbsp;
                        {localStorage.getItem('jwtToken') &&
                        <button class="btn btn-primary" onClick={this.logout}>Logout</button>
                        }
                        <Autosuggest
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                            getSuggestionValue={this.getSuggestionValue}
                            renderSuggestion={this.renderSuggestion}
                            inputProps={inputProps}
                        />
                    </h3>
                </div>
                <div class="panel-body">
                    <table class="table table-stripe" id="movie-list">
                        <thead>
                        <tr>
                            <th>ISBN</th>
                            <th>Title</th>
                            <th>Author</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.movies.map(movie =>
                            <tr>
                                <td><Link to={`/show/${movie._id}`}>{movie.isbn}</Link></td>
                                <td>{movie.title}</td>
                                <td>{movie.author}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>;
        </MuiThemeProvider>
        );
    }
}


export default App;