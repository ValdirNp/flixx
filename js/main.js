const {
    API_KEY,
} = process.env;

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
            <p>{ props.movie.original_title }</p>
            <p>{ props.movie.overview }</p>
        </div>
    );
}

function Footer() {
    return (
        <Container maxWidth="sm">
            <Typography variant="body1">Made with ❤ by <a href="https://valdirnp.dev" target="_blank" title="Valdir Pereira">Valdir Pereira</a> using ⚛ and <a href="https://www.themoviedb.org/" target="_blank" title="The Movie Database">The Movie Database</a>. © 2020</Typography>
        </Container>
    );
}

function getRandomNumber(bottom, top) {
    return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
}

function App() {
    const classes = useStyles();
    const [suggestedMovie, updateSuggestedMovie] = React.useState({ name: '' });
    const minYear = 1900;
    const maxYear = 2020;
    const apiUrl = 'https://api.themoviedb.org/3/discover/movie';

    const getSuggestion = function() {
        let randomYear = getRandomNumber(minYear, maxYear);
        let page = getRandomNumber(1, 5);

        let params = {
            api_key: API_KEY,
            language: 'en-US',
            sort_by: 'popularity.desc',
            include_adult: false,
            include_video: false,
            page: page,
            year: randomYear,
        };

        let url = apiUrl + '?' + new URLSearchParams(params).toString();

        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    let listOfMovies = result.results;
                    let newSuggestedMovie = listOfMovies[Math.floor(Math.random() * listOfMovies.length)];
                    updateSuggestedMovie(newSuggestedMovie);
                },
                (error) => {
                    console.log(error)
                }
            )
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