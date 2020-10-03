const {
    Container,
    makeStyles,
    createMuiTheme,
    colors,
    CssBaseline,
    ThemeProvider,
    Typography,
} = MaterialUI;

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#556cd6',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            main: colors.red.A400,
        },
        background: {
            default: '#fff',
        },
    },
});

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    main: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(2),
    },
    footer: {
        padding: theme.spacing(3, 2),
        marginTop: 'auto',
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
    },
}));

function Title() {
    return (
        <Typography variant="h2" component="h1" gutterBottom>
            Flixx
        </Typography>
    );
}

function SuggestionButton(props) {
    return (
        <button type="button" onClick={ props.getSuggestion } >Suggest a movie!</button>
    );
}

function SuggestionResult(props) {
    return (
        <div>
            <p>{ props.movie.name }</p>
        </div>
    );
}

function Footer() {
    return (
        <Container maxWidth="sm">
            <Typography variant="body1">Made with ❤ by <a href="https://valdirnp.dev" target="_blank" title="Valdir Pereira">Valdir Pereira</a> using ⚛ and <a href="https://www.themoviedb.org/" target="_blank" title="The Movie Database">The Movie Database</a>.</Typography>
        </Container>
    );
}

function App() {
    const classes = useStyles();
    const [suggestedMovie, updateSuggestedMovie] = React.useState({ name: '' });

    const getSuggestion = function() {
        let listOfMovies = [
            {
                'name': 'Enola Holmes',
                'year': '2020'
            },
            {
                'name': 'Spider-Man: Into the Spider-Verse',
                'year': '2018'
            },
            {
                'name': 'El laberinto del fauno',
                'year': '2006'
            },
            {
                'name': 'The Babysitter',
                'year': '2017'
            },
        ];
        let newSuggestedMovie = listOfMovies[Math.floor(Math.random() * listOfMovies.length)];
        updateSuggestedMovie(newSuggestedMovie);
    }

    return (
        <div className={ classes.root }>
            <CssBaseline />
            <Container component="main" className={ classes.main } maxWidth="sm">
                <Title />
                <SuggestionButton getSuggestion={ getSuggestion } />
                <SuggestionResult movie={ suggestedMovie } />
            </Container>
            <footer className={ classes.footer }>
                <Footer />
            </footer>
        </div>
    );
}
    
ReactDOM.render(
    <App />,
    document.getElementById('app')
);