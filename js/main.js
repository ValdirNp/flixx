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
    Divider,
    TextField,
    FormControl,
    InputLabel,
    Input,
    Select,
    MenuItem,
    Slider,
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
        minHeight: '60vh'
    },
    cardDetails: {
        flex: 1,
    },
    cardMedia: {
        width: 300,
    },
    netflixButton: {
        background: '#E50914'
    },
    imdbButton: {
        background: '#C3A00D'
    },
    divider: {
        marginTop: '25px',
        marginBottom: '25px',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 350,
        maxWidth: 700,
    },
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

function Filters(props) {
    const classes = useStyles();

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    selectGenre = props.selectGenre;
    setYears = props.setYears;

    const handleGenreChange = (event) => {
        selectGenre(event.target.value);
    };

    const handleYearsChange = (event, newValue) => {
        setYears(newValue);
      };

    const getStyles = (name, genres, theme) => {
        return {
            fontWeight:
                genres.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
        };
    };

    const genres = [
          {
            "id": 28,
            "name": "Ação"
          },
          {
            "id": 12,
            "name": "Aventura"
          },
          {
            "id": 16,
            "name": "Animação"
          },
          {
            "id": 35,
            "name": "Comédia"
          },
          {
            "id": 80,
            "name": "Crime"
          },
          {
            "id": 99,
            "name": "Documentário"
          },
          {
            "id": 18,
            "name": "Drama"
          },
          {
            "id": 10751,
            "name": "Família"
          },
          {
            "id": 14,
            "name": "Fantasia"
          },
          {
            "id": 36,
            "name": "História"
          },
          {
            "id": 27,
            "name": "Terror"
          },
          {
            "id": 10402,
            "name": "Música"
          },
          {
            "id": 9648,
            "name": "Mistério"
          },
          {
            "id": 10749,
            "name": "Romance"
          },
          {
            "id": 878,
            "name": "Ficção científica"
          },
          {
            "id": 10770,
            "name": "Cinema TV"
          },
          {
            "id": 53,
            "name": "Thriller"
          },
          {
            "id": 10752,
            "name": "Guerra"
          },
          {
            "id": 37,
            "name": "Faroeste"
          }
        ];

    return (
        <div>
            <FormControl className={classes.formControl}>
                <Typography id="gender-label" gutterBottom>Gêneros</Typography>
                <Select
                    id="gender"
                    multiple
                    value={props.selectedGenres}
                    onChange={handleGenreChange}
                    input={<Input />}
                    MenuProps={MenuProps}
                >
                    {genres.map((genre) => (
                        <MenuItem key={genre.id} value={genre.id} style={getStyles(genre.name, props.selectedGenres, theme)}>
                            {genre.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
                <Typography id="years-label" gutterBottom>Entre os anos</Typography>
                <Slider
                    value={props.years}
                    onChange={handleYearsChange}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    min={1900}
                    step={1}
                    max={2020}
                />
            </FormControl>
        </div>
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

                                { props.movie.imdb_id ? 
                                    <Button variant="contained" className={classes.imdbButton} href={ "https://www.imdb.com/title/" + props.movie.imdb_id } target="_blank" >Página do IMDb</Button>
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
            <Typography variant="body1">Made with ❤ by <a href="#" target="_blank" title="Valdir Pereira">Valdir Pereira</a> using ⚛ and <a href="https://www.themoviedb.org/" target="_blank" title="The Movie Database">The Movie Database</a>. © 2020</Typography>
        </Container>
    );
}

function getRandomNumber(bottom, top) {
    return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
}

function App() {
    const classes = useStyles();
    const [suggestedMovie, updateSuggestedMovie] = React.useState({ title: '' });
    const [selectedGenres, selectGenre] = React.useState([]);
    const [years, setYears] = React.useState([1900, 2020]);
    
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

                    if (newSuggestedMovie.homepage && newSuggestedMovie.homepage.includes("https://www.netflix.com/title")) {
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
        let minYear = 1900;
        let maxYear = 2020;

        if (years.length === 2) {
            minYear = years[0];
            maxYear = years[1];
        }

        let randomYear = getRandomNumber(minYear, maxYear);
        let page = getRandomNumber(1, 1);

        let params = {
            api_key: API_KEY,
            language: 'pt-BR',
            sort_by: 'popularity.desc',
            include_adult: false,
            include_video: false,
            page: page,
            year: randomYear,
        };

        if (selectedGenres.length > 0) {
            params.with_genres = selectedGenres.join(',');
        }

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
                <Filters selectedGenres={selectedGenres} selectGenre={selectGenre} years={years} setYears={setYears} />
                <SuggestionButton getSuggestion={ getSuggestion } />
                <Divider className={classes.divider} />
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