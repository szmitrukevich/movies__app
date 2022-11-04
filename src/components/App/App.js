import React from 'react'
import { Pagination, Input, Tabs, Alert } from 'antd'
import 'antd/dist/antd.css'
import './App.css'
import { Offline, Online } from 'react-detect-offline'
import _ from 'lodash'
import MovieDataContext from '../MovieDataContext'
import MovieList from '../MovieList'
import MovieDBService from '../../services/MovieDBService'

class App extends React.Component {
  movieDBService = new MovieDBService()

  constructor(props) {
    super(props)
    this.state = {
      moviesData: [],
      loading: true,
      error: false,
      totalResults: 20,
      searchPhrase: 'return',
      currentPage: 1,
      foundNothing: false,
      globalError: false,
      ratedMovies: [],
      genres: [],
    }
  }

  componentDidMount() {
    const { searchPhrase, currentPage } = this.state
    this.updateState(currentPage, searchPhrase)
    this.getRatedFilms(1)
    this.movieDBService.getGenres().then((res) => this.setState({ genres: res }))
  }

  componentDidCatch() {
    this.setState({ globalError: true })
  }

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    })
  }

  changePage = (page) => {
    const { searchPhrase } = this.state
    this.setState({ loading: true })

    this.updateState(page, searchPhrase)

    this.setState({ currentPage: page })
  }

  searchFilms = (e) => {
    const { value } = e.target
    this.setState({ loading: true })
    if (value) {
      this.updateState(1, value)
      this.setState({
        searchPhrase: value,
        currentPage: 1,
      })
    } else {
      this.setState({
        moviesData: [],
        loading: false,
        totalResults: 20,
      })
    }
  }

  getRatedFilms = (page) => {
    const keys = []
    for (let i = 20 * (page - 1); i < page * 20; i += 1) {
      if (localStorage.key(i)) {
        keys.push(localStorage.key(i))
      }
    }
    Promise.all(keys.map((key) => this.movieDBService.getMovie(key))).then((res) => this.setState({ ratedMovies: res }))
  }

  changePageRated = (page) => {
    this.getRatedFilms(page)
  }

  onChange = (num, id) => {
    localStorage.setItem(id, num)
    this.getRatedFilms(1)
  }

  updateState(page, phrase) {
    this.movieDBService
      .searchFilms(page, phrase)
      .then((res) => {
        if (res.results.length) {
          this.setState({
            totalResults: res.total_results,
            foundNothing: false,
          })
          return res.results
        }
        this.setState({
          foundNothing: true,
          totalResults: 0,
          moviesData: [],
        })
        return []
      })
      .then((res) => {
        this.setState({
          moviesData: res,
          loading: false,
        })
      })
      .catch(this.onError)
  }

  render() {
    const { moviesData, loading, error, totalResults, currentPage, foundNothing, globalError, ratedMovies, genres } =
      this.state
    if (globalError) {
      return (
        <div className="movies__alert">
          <Alert
            message="Ooops, something gone wrong"
            showIcon
            description="Please refresh page or contact your administrator"
            type="error"
          />
        </div>
      )
    }

    const content = foundNothing ? (
      <Alert
        message="Ooops, nothing found"
        type="warning"
        showIcon
      />
    ) : (
      <MovieList
        moviesData={moviesData}
        loading={loading}
        error={error}
      />
    )
    const emptyData = !moviesData.length ? (
      <Alert
        message="Start a new keyword search"
        type="info"
      />
    ) : null

    const search = (
      <>
        <div className="movies__search">
          <Input
            placeholder="Type to search..."
            onChange={_.debounce(this.searchFilms, 300)}
          />
        </div>
        {content}
        {emptyData}
        <div className="movies__pagination">
          <Pagination
            current={currentPage}
            total={totalResults}
            pageSize={20}
            onChange={this.changePage}
            showSizeChanger={false}
            hideOnSinglePage
          />
        </div>
      </>
    )

    const rated = (
      <>
        <MovieList
          moviesData={ratedMovies}
          loading={false}
          error={false}
        />
        <div className="movies__pagination">
          <Pagination
            defaultCurrent={1}
            total={localStorage.length}
            pageSize={20}
            onChange={this.changePageRated}
            showSizeChanger={false}
            hideOnSinglePage
          />
        </div>
      </>
    )

    const items = [
      {
        label: 'Search',
        key: '1',
        children: search,
      },
      {
        label: 'Rated',
        key: '2',
        children: rated,
      },
    ]

    const onChangeRated = this.onChange
    return (
      <div className="movies">
        <MovieDataContext.Provider
          // eslint-disable-next-line react/jsx-no-constructed-context-values
          value={{
            genres,
            onChangeRated,
          }}
        >
          <Online>
            <div className="movies__container">
              <div className="movies__tabs">
                <Tabs
                  defaultActiveKey="1"
                  items={items}
                  destroyInactiveTabPane
                />
              </div>
            </div>
          </Online>
        </MovieDataContext.Provider>
        <Offline>
          <div className="movies__offline">Oops, you are offline. Check your internet connection</div>
        </Offline>
      </div>
    )
  }
}

export default App
