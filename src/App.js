import React, {Component} from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import './App.css';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import redblack from './themes/redblack';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {error} from 'util';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn,} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

var createReactClass = require('create-react-class');

const API_KEY = "https://api.themoviedb.org/3/search/tv?api_key=5f9a2ab08c36a2b6a3f27847719a4b8a&language=en-US&query=";
const URL_IMG = 'https://image.tmdb.org/t/p/';
const IMG_SIZE_XSMALL = 'w45/';
const IMG_SIZE_SMALL = 'w154/';

const DETAIL_REQ = 'https://api.themoviedb.org/3/tv/'
const KEY_REQ = '?api_key=5f9a2ab08c36a2b6a3f27847719a4b8a&language=en-US';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            movies: [],
            searchText: '',
            searchSuggestions: [],
            selectedSuggestion: {},
            open: false,
            value: "Watching",
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

    // SEARCH BAR IMPLEMENTATION

    searchRequest = () => {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        axios.get('/api/movie/search', {
            params: {title: this.state.searchText}
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
            <img className="searchResult-image"
                 src={suggestion.poster_path == null ? null : URL_IMG + IMG_SIZE_XSMALL + suggestion.poster_path}/>
            <div className="searchResult-text">
                <div className="searchResult-name">
                    {suggestion.title}
                </div>
                {suggestion.year}
            </div>
        </a>
    );

    onChange = (event, {newValue}) => {
        this.setState({
            searchText: newValue
        });
    };

    handleSearchSubmit = (event) => {
        event.preventDefault();
        this.searchRequest;
    };

    onSuggestionsFetchRequested = ({value}) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        if (inputLength > 0) {
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
                        searchSuggestions: results.slice(0, 10)
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
        return this.state.selectedSuggestion.id == null ? true : false;
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
        const saveStatus = this.state.value;

        axios.post('/api/movie/',
            {
                original_name: selected.original_name,
                _id: selected.id,
                title: selected.title,
                poster_path: selected.poster_path,
                episodes_watched: 0,
                episodes_total: this.state.episodes, // limit by # of total episodes
                status: saveStatus, //4 status' (watching, dropped, completed, plan to watch)
                rating: 0 // 1 - 10 scale
            });
        this.componentDidMount();
        this.handleClose();
    };

    removeFromList = (e) => {
        e.preventDefault();

        const selected = this.state.selectedSuggestion;

        axios.post('/api/movie/remove/' + selected.id);
        this.componentDidMount();
        this.handleClose();
    }

    updateToList = (e) => {
        e.preventDefault();

        const selected = this.state.selectedSuggestion;
        const updateStatus = this.state.value;

        axios.post('/api/movie/update/' + selected.id, {
            episodes_watched: 14, // limit by # of total episodes
            status: updateStatus, //4 status' (watching, dropped, completed, plan to watch)
            rating: 2 // 1 - 10 scale
        });
        this.componentDidMount();
        this.handleClose();
    }

    onSuggestionSelected = (event, {suggestion}) => {
        this.state.selectedSuggestion = suggestion;
        this.handleOpen()
    };

    handleOpen = () => {
        console.log("open")
        this.setState({open: true});
        this.suggestionQuery();
    }

    handleClose = () => {
        this.setState({open: false});
    }

    suggestionQuery = () => {
        const selected = this.state.selectedSuggestion;
        let urlQuery = DETAIL_REQ + selected.id + KEY_REQ;
        fetch(urlQuery).then((res) => res.json()).then((data) => {
            this.setState({
                backdrop: data.backdrop_path,
                runtime: data.runtime,
                poster: data.poster_path,
                release: data.release_date,
                genre: data.genres,
                homepage: data.homepage,
                movieID: data.id,
                original_title: data.original_title,
                episodes: data.number_of_episodes
            })
            console.log('Details:' + '--Episodes' + this.state.episodes);
        })
    }

    handleChange = (event, index, value) => {
        this.setState({value});
        console.log("Value of drop menu:" + this.state.value)
    }


    render() {
        const value = this.state.searchText;
        const suggestions = this.state.searchSuggestions;
        const inputProps = {
            placeholder: 'Type a movie title',
            value,
            onChange: this.onChange
        };

        const actions = [
            <FlatButton
                label="Remove"
                primary={false}
                onClick={(event) => this.removeFromList(event)}
            />,
            <FlatButton
                label="Update"
                primary={false}
                keyboardFocused={true}
                onClick={(event) => this.updateToList(event)}
            />,
            <FlatButton
                label="Save"
                primary={true}
                keyboardFocused={true}
                onClick={(event) => this.saveToList(event)}
            />,
            <DropDownMenu value={this.state.value} onChange={this.handleChange}>
                <MenuItem value={"Completed"} primaryText="Completed"/>
                <MenuItem value={"Watching"} primaryText="Watching"/>
                <MenuItem value={"Plan to watch"} primaryText="Plan to watch"/>
                <MenuItem value={"Dropped"} primaryText="Dropped"/>
            </DropDownMenu>,
        ];

        return (
            <MuiThemeProvider muiTheme={getMuiTheme(redblack)}>
                <div className="Header2">
                    <Navigation/>
                    <UserButton/>
                </div>
                <div class="container">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h3 class="panel-title TVHeader">
                                Your TV Show List &nbsp;
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
                        <div class="panel-quickview Modal">
                            <div>
                                <Dialog
                                    title={this.state.selectedSuggestion.title}
                                    actions={actions}
                                    modal={false}
                                    open={this.state.open}
                                    onRequestClose={this.handleClose}
                                >
                                    <img
                                        src={this.state.selectedSuggestion.poster_path == null ? null : URL_IMG + IMG_SIZE_SMALL + this.state.selectedSuggestion.poster_path}/>
                                    <ul style={{listStyle: 'none', color: 'white'}}>
                                        <li>Vote Average: {this.state.selectedSuggestion.vote_average}</li>
                                        <li>First Air Date: {this.state.selectedSuggestion.first_air_date}</li>
                                        <li>Popularity: {this.state.selectedSuggestion.popularity}</li>
                                        <li>Description: {this.state.selectedSuggestion.description}</li>
                                        <li>Episodes: {this.state.episodes}</li>
                                    </ul>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </div>
                <UserTable/>
            </MuiThemeProvider>
        );
    }
}

class Navigation extends Component {
    render() {
        return (
            <div id="navigation" className="Navigation ">
                <nav>
                    <ul>
                        <li><a href="/">My list</a></li>
                        <li><a href="/landing">Discover</a></li>
                    </ul>
                </nav>
            </div>
        );
    }
}

class UserButton extends Component {
    logout = () => {
        localStorage.removeItem('jwtToken');
        window.location.reload();
    };

    render() {
        return (
            <div className="UserProfile">
                <div className="User">
                    <div className="LogoutButton">
                        {localStorage.getItem('jwtToken') &&
                        <button class="btn btn-primary" onClick={this.logout}>Logout</button>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

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

class UserTable extends Component {
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
        super(props);
        this.state = {
            movies: [],
        };
    }

    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
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

    componentWillReceiveProps(nextProps) {
        axios.get('/user')
            .then(res => {
                console.log(res.data);
                this.setState({movies: res.data}, () => {
                    //console.log("state updated", this.state.value)
                });
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    this.props.history.push("/login");
                }
            });
    }

    render() {
        return (
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
            onMouseDown={() => {
                alert('Click event on row')
            }}>
            {props.children}
        </TableRow>
    )
};

// Testing


const stylesDrop = {
    customWidth: {
        width: 200,
    },
};

class DropDown extends Component {

    constructor(props) {
        super(props);
        this.state = {value: "Watching"};
    }

    render() {
        return (
            <div>
                <DropDownMenu value={this.state.value} onChange={this.handleChange}>
                    <MenuItem value={"Completed"} primaryText="Completed"/>
                    <MenuItem value={"Watching"} primaryText="Watching"/>
                    <MenuItem value={"Plan to watch"} primaryText="Plan to watch"/>
                    <MenuItem value={"Dropped"} primaryText="Dropped"/>
                </DropDownMenu>
            </div>
        );
    }
}


export default App;
