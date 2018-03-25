import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import './App.css';

const API_KEY = "https://api.themoviedb.org/3/search/tv?api_key=5f9a2ab08c36a2b6a3f27847719a4b8a&language=en-US&query=";
const URL_IMG = 'https://image.tmdb.org/t/p/';
const IMG_SIZE_XSMALL = 'w45/';

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

    searchRequest = () => {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        axios.get('/api/movie/search',{params: {title: this.state.searchText}
            })
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

    getSuggestionValue = suggestion => suggestion.title;

    renderSuggestion = suggestion => (
        <a>
            <img className="searchResult-image" src= {suggestion.img == null ? null: URL_IMG+IMG_SIZE_XSMALL+suggestion.img } />
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
        console.log(this.state.searchText);
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
                        temp.isbn = movie.id
                        temp.title = movie.name
                        temp.img = movie.poster_path
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

    render(){
        const value = this.state.searchText;
        const suggestions = this.state.searchSuggestions;
        const inputProps = {
            placeholder: 'Type a movie title',
            value,
            onChange: this.onChange
        };

        return <div class="container">
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
                            />
                        </form>
                    </div>
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
    }
}


export default App;