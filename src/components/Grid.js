import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { Grid}  from 'material-ui/Grid';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

function CenteredGrid(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>xs=12</Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>xs=6</Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>xs=6</Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>xs=3</Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>xs=3</Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>xs=3</Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={classes.paper}>xs=3</Paper>
        </Grid>
      </Grid>
    </div>
  );
}

CenteredGrid.propTypes = {
  classes: PropTypes.object.isRequired,
};


class Navigation extends Component {    
    render () {
        return(
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

export default withStyles(styles)(FullWidthGrid);