import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';

import axios from 'axios';
import { Link } from 'react-router-dom';

const IMG_SIZE_SMALL = 'w154/';

class SuggestionModal extends Component {

    constructor(ss) {
      super();
      this.state = {
          selectedSuggestion: ss,
          open: false,
      };
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };
  
    render() {
      return (
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
            <div>
                <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                >
                <DialogTitle id="form-dialog-title">Selected Suggestion Info</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <ul style={{listStyle: 'none'}}>
                            <img src={this.state.selectedSuggestion.poster_path == null ? null: URL_IMG+IMG_SIZE_SMALL+this.state.selectedSuggestion.poster_path}/>
                            <li>Original Name: {this.state.selectedSuggestion.original_name}</li>
                            <li>Title: {this.state.selectedSuggestion.title}</li>
                            <li>Vote Average: {this.state.selectedSuggestion.vote_average}</li>
                            <li>First Air Date: {this.state.selectedSuggestion.first_air_date}</li>
                            <li>Popularity: {this.state.selectedSuggestion.popularity}</li>
                            <li>Description: {this.state.selectedSuggestion.description}</li>
                        </ul>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                    Cancel
                    </Button>
                    <Button onClick={this.handleClose} color="primary">
                    Save
                    </Button>
                </DialogActions>
                </Dialog>
            </div>
        </MuiThemeProvider>      
      );
    }
  }
  
  const style = {
    margin: 15,
   };
  export default SuggestionModal;
  