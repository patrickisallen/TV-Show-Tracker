import React, {Component} from 'react';
import Toggle from 'material-ui/Toggle';
import {MuiThemeProvider} from 'material-ui/styles/MuiThemeProvider';

import './Login.css';
import './Footer.css'

class Footer extends Component {

  onToggle = (e) => {
    alert("Pretend it is light theme for now");
  }

  render() {
    return (
      <footer>
        <div class="footer-container">
          <div class="dark-mode-container">
            <Toggle
            label="Light Mode"
            labelPosition="left"
            onToggle={this.onToggle}
            />
          </div>
        </div>
      </footer>
      
    );
  }
}

export default Footer;