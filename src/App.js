import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import './App.css';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import { error } from 'util';

const API_KEY = "https://api.themoviedb.org/3/search/tv?api_key=5f9a2ab08c36a2b6a3f27847719a4b8a&language=en-US&query=";
const URL_IMG = 'https://image.tmdb.org/t/p/';
const IMG_SIZE_XSMALL = 'w45/';
const IMG_SIZE_SMALL = 'w154/';


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
            searchSuggestions: [],
            selectedSuggestion: {}
        };
    }

    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        axios.get('/api/movie')
            .then(res => {
                console.log(res.data.toString());
                this.setState({movies: res.data});
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    this.props.history.push("/login");
                }
            });
    }

    // SEARCH BAR IMPLEMENTATION

    searchRequest = () => {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        axios.get('/api/movie/search',{params: {title: this.state.searchText}
            })
            .then(res => {
                this.setState({movies: res.data});
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    this.props.history.push("/login");
                }
            });
    }

    getSuggestionValue = suggestion => suggestion.title;

    renderSuggestion = suggestion => (
        <a>
            <img className="searchResult-image" src={suggestion.poster_path == null ? null: URL_IMG+IMG_SIZE_XSMALL+suggestion.poster_path } />
            <div className="searchResult-text">
                <div className="searchResult-name">
                    {suggestion.title}
                </div>
                {suggestion.year}
            </div>
        </a>
    );

    onChange = (event, { newValue }) => {
        this.setState({
            searchText: newValue
        });
    };

    handleSearchSubmit = (event) => {
        event.preventDefault();
        this.searchRequest;
    };

    onSuggestionsFetchRequested = ({ value }) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        if(inputLength > 0){
            let url = API_KEY + inputValue;

            fetch(url)
                .then(response => response.json())
                .then(json => json.results)
                .then(data => {
                    const results = data.map(movie => {
                        let temp = {}
                        temp.original_name = movie.original_name
                        temp.id = movie.id
                        temp.title = movie.name
                        temp.vote_average = movie.vote_average
                        temp.poster_path = movie.poster_path
                        temp.description = movie.overview
                        temp.first_air_date = movie.first_air_date
                        temp.popularity = movie.popularity
                        temp.year = (movie.first_air_date == "") ? "0000" : movie.first_air_date.substring(0, 4)
                        return temp;
                    });
                    this.setState({
                        searchSuggestions: results.slice(0,10)
                    });
                });
        } else {
            this.setState({
                searchSuggestions: []
            });
        }
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            searchSuggestions: []
        });
    };

    // SEARCH BAR IMPLEMENTATION -- END

    // Save button implementation
    isSuggestionEmpty = () => {
      return this.state.selectedSuggestion.id == null ? true: false;
    };

    isAlreadySaved = () => {
      /*
      const selected_id = this.state.selectedSuggestion.id;
      axios.get('/api/movie/GETBYID', { selected_id })
        .then(res => {
        });
        */
    };

    saveToList = (e) => {
      e.preventDefault();

      const selected = this.state.selectedSuggestion;

      axios.post('/api/movie/',
        {
          original_name: selected.original_name,
          id: selected.id,
          title: selected.title,
          poster_path: selected.poster_path,
          episodes_watched: 10, // limit by # of total episodes
          status: "watching", //4 status' (watching, dropped, completed, plan to watch)
          rating: 5 // 1 - 10 scale
          });
      this.componentDidMount();
    };

    onSuggestionSelected = (event, {suggestion}) => {
      this.state.selectedSuggestion = suggestion;
    };

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
        <Navigation />
          <div class="container">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">
                        Movie Collection &nbsp;
                        {localStorage.getItem('jwtToken') &&
                        <button class="btn btn-primary" onClick={this.logout}>Logout</button>
                        }
                    </h3>
                    <div class="searchBar">
                        <form onSubmit={this.handleSearchSubmit}>
                            <Autosuggest
                                suggestions={suggestions}
                                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                getSuggestionValue={this.getSuggestionValue}
                                renderSuggestion={this.renderSuggestion}
                                inputProps={inputProps}
                                onSuggestionSelected={this.onSuggestionSelected}
                            />
                        </form>
                    </div>
                </div>
                <div class="panel-quickview">
                  <ul style={{listStyle: 'none', color: 'white'}}>
                    <img src={this.state.selectedSuggestion.poster_path == null ? null: URL_IMG+IMG_SIZE_SMALL+this.state.selectedSuggestion.poster_path}/>
                    <li>Original Name: {this.state.selectedSuggestion.original_name}</li>
                    <li>Title: {this.state.selectedSuggestion.title}</li>
                    <li>Vote Average: {this.state.selectedSuggestion.vote_average}</li>
                    <li>First Air Date: {this.state.selectedSuggestion.first_air_date}</li>
                    <li>Popularity: {this.state.selectedSuggestion.popularity}</li>
                    <li>Description: {this.state.selectedSuggestion.description}</li>
                  </ul>
                  <RaisedButton label="Save!" primary={true} disabled={this.isSuggestionEmpty() || this.isAlreadySaved()} onClick={(event) => this.saveToList(event)}/>
                </div>
                <div class="panel-body">
                    <table class="table table-stripe" id="movie-list">
                        <thead>
                        <tr>
                            {/* <th>Poster</th> */}
                            <th>Title</th>
                            <th>Rating</th>
                            <th>Episodes Watched</th>
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

class Navigation extends Component {
    render () {
        return(
            <header className="Header">
                <div id="navigation" className="Navigation">
                <nav>
                    <ul>
                        <li><a href="/">My list</a></li>
                        <li><a href="/">Discover</a></li>
                    </ul>
                </nav>
                </div>
          </header>
        );
    }
}


export default App;


