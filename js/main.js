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
    Box,
    Button,
    Grid,
    CardActionArea,
    Card,
    CardContent,
    Hidden,
    CardMedia,
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
            default: '#000000',
        },
    },
});

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
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
    card: {
        display: 'flex',
        minHeight: '60vh',
        marginTop: '50px',
    },
    cardDetails: {
        flex: 1,
    },
    cardMedia: {
        width: 300,
    },
    netflixButton: {
        background: '#E50914'
    }
}));

function Title() {
    return (
        <Box color="#E50914" m="auto">
            <Typography variant="h2" component="h1" gutterBottom>
                Flixx
            </Typography>
        </Box>        
    );
}

function SuggestionButton(props) {
    return (
        <Button variant="contained" color="primary" onClick={ props.getSuggestion } >Sugerir um filme!</Button>
    );
}

function SuggestionResult(props) {
    const classes = useStyles();
    
    if (props.movie.title !== '') {
        return (
            <Grid item xs={12}>
                <CardActionArea component="a" href="#">
                    <Card className={classes.card}>
                        <Hidden xsDown>
                            <CardMedia className={classes.cardMedia} image={ props.movie.poster } title="imageTitle" />
                        </Hidden>
                        <div className={classes.cardDetails}>
                            <CardContent>
                                <Typography component="h2" variant="h5">
                                    { props.movie.title }
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Nome Original: { props.movie.original_title }
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Lançamento: { props.movie.release_year }
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Nota média: { props.movie.vote_average }
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Gêneros: { props.movie.genres }
                                </Typography>
                                <Typography variant="subtitle1" paragraph>
                                    { props.movie.overview }
                                </Typography>

                                { props.movie.netflix_button ? 
                                    <Button variant="contained" className={classes.netflixButton} href={ props.movie.homepage } target="_blank" >Ver na Netflix</Button>
                                    : <span></span>
                                }                                
                            </CardContent>
                        </div>                    
                    </Card>
                </CardActionArea>
            </Grid>
        );
    } else {
        return (<Grid item xs={12}></Grid>);
    }
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
    const [suggestedMovie, updateSuggestedMovie] = React.useState({ title: '' });
    const minYear = 1900;
    const maxYear = 2020;
    const discoverUrl = 'https://api.themoviedb.org/3/discover/movie';
    const movieDetailsUrl = 'https://api.themoviedb.org/3/movie';

    const getMovieDetails = function(id) {
        let params = {
            api_key: API_KEY,
            language: 'pt-BR'
        };

        let url = movieDetailsUrl + '/' + id + '?' + new URLSearchParams(params).toString();

        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    let newSuggestedMovie = result;

                    newSuggestedMovie.release_year = newSuggestedMovie.release_date.split('-', 1);
                    newSuggestedMovie.genres = newSuggestedMovie.genres.map(function(elem) {
                        return elem.name;
                    }).join(', ');

                    newSuggestedMovie.poster = 'https://placehold.it/300x700&text=Sem%20imagem';
                    if (newSuggestedMovie.poster_path) {
                        newSuggestedMovie.poster = "https://image.tmdb.org/t/p/w300/" + newSuggestedMovie.poster_path
                    }

                    if (newSuggestedMovie.homepage.includes("https://www.netflix.com/title")) {
                        newSuggestedMovie.netflix_button = true;
                    }

                    updateSuggestedMovie(newSuggestedMovie);
                },
                (error) => {
                    console.log(error)
                }
            )
    }

    const getSuggestion = function() {
        let randomYear = getRandomNumber(minYear, maxYear);
        let page = getRandomNumber(1, 5);

        let params = {
            api_key: API_KEY,
            language: 'pt-BR',
            sort_by: 'popularity.desc',
            include_adult: false,
            include_video: false,
            page: page,
            year: randomYear,
        };

        let url = discoverUrl + '?' + new URLSearchParams(params).toString();

        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    let listOfMovies = result.results;
                    let itemSelected = listOfMovies[Math.floor(Math.random() * listOfMovies.length)];
                    let movieId = itemSelected.id;

                    getMovieDetails(movieId);
                },
                (error) => {
                    console.log(error)
                }
            )
    }

    return (
        <div className={ classes.root }>
            <CssBaseline />
            <Container component="main" className={ classes.main } maxWidth="md" >
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