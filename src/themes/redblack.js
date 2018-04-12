import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

const muiTheme = {
    "palette": {
        "primary1Color": "#d32f2f",
        "primary2Color": "#b71c1c",
        "accent1Color": "#424242",
        "alternateTextColor": "#000000",
        "secondaryTextColor": "#ffffff",
        "accent3Color": "#ffffff",
        "canvasColor": "#212121",
        "borderColor": "#f44336"
    },
    "appBar": {
        "textColor": "#ffffff"
    }
};

const theme = getMuiTheme(darkBaseTheme, muiTheme)

export default theme;