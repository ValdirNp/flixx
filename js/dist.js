const {
  Container,
  makeStyles,
  createMuiTheme,
  colors,
  CssBaseline,
  ThemeProvider,
  Typography
} = MaterialUI;
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#556cd6'
    },
    secondary: {
      main: '#19857b'
    },
    error: {
      main: colors.red.A400
    },
    background: {
      default: '#fff'
    }
  }
});
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2)
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800]
  }
}));

function Title() {
  return /*#__PURE__*/React.createElement(Typography, {
    variant: "h2",
    component: "h1",
    gutterBottom: true
  }, "Flixx");
}

function SuggestionButton(props) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: props.getSuggestion
  }, "Suggest a movie!");
}

function SuggestionResult(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, props.movie.name));
}

function Footer() {
  return /*#__PURE__*/React.createElement(Container, {
    maxWidth: "sm"
  }, /*#__PURE__*/React.createElement(Typography, {
    variant: "body1"
  }, "Made with \u2764 by ", /*#__PURE__*/React.createElement("a", {
    href: "https://valdirnp.dev",
    target: "_blank",
    title: "Valdir Pereira"
  }, "Valdir Pereira"), " using \u269B and ", /*#__PURE__*/React.createElement("a", {
    href: "https://www.themoviedb.org/",
    target: "_blank",
    title: "The Movie Database"
  }, "The Movie Database"), "."));
}

function App() {
  const classes = useStyles();
  const [suggestedMovie, updateSuggestedMovie] = React.useState({
    name: ''
  });

  const getSuggestion = function () {
    let listOfMovies = [{
      'name': 'Enola Holmes',
      'year': '2020'
    }, {
      'name': 'Spider-Man: Into the Spider-Verse',
      'year': '2018'
    }, {
      'name': 'El laberinto del fauno',
      'year': '2006'
    }, {
      'name': 'The Babysitter',
      'year': '2017'
    }];
    let newSuggestedMovie = listOfMovies[Math.floor(Math.random() * listOfMovies.length)];
    updateSuggestedMovie(newSuggestedMovie);
  };

  return /*#__PURE__*/React.createElement("div", {
    className: classes.root
  }, /*#__PURE__*/React.createElement(CssBaseline, null), /*#__PURE__*/React.createElement(Container, {
    component: "main",
    className: classes.main,
    maxWidth: "sm"
  }, /*#__PURE__*/React.createElement(Title, null), /*#__PURE__*/React.createElement(SuggestionButton, {
    getSuggestion: getSuggestion
  }), /*#__PURE__*/React.createElement(SuggestionResult, {
    movie: suggestedMovie
  })), /*#__PURE__*/React.createElement("footer", {
    className: classes.footer
  }, /*#__PURE__*/React.createElement(Footer, null)));
}

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('app'));
