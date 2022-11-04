import React from 'react'
import PropTypes from 'prop-types'
import './MovieList.css'
import { Alert, Spin } from 'antd'
import Movie from '../Movie'

export default class MovieList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { moviesData, loading, error } = this.props
    let display = 'block'
    if (!moviesData.length) {
      display = 'none'
    }
    let elements = []
    if (moviesData) {
      elements = moviesData.map((item) => {
        const itemData = {
          originalTitle: item.original_title,
          releaseDate: item.release_date,
          overview: item.overview,
          posterPath: item.poster_path,
          rate: item.vote_average.toFixed(1),
          movieId: item.id,
          genres: item.genre_ids ? item.genre_ids : item.genres.map((x) => x.id),
        }

        const { id } = item

        return (
          <Movie
            /* eslint-disable react/jsx-props-no-spreading */
            {...itemData}
            key={id}
          />
        )
      })
    }

    const hasData = !(loading || error)
    const errorMessage = error ? (
      <div className="movies__alert">
        <Alert
          message="Ooops, something gone wrong"
          showIcon
          description="Please refresh page or contact your administrator"
          type="error"
        />
      </div>
    ) : null
    const spinner = loading ? (
      <div className="movies__loading">
        <Spin tip="Content loading" />
      </div>
    ) : null
    const content = hasData ? <div className="movies__grid">{elements}</div> : null

    return (
      <ul
        className="movies__list"
        style={(display = { display })}
      >
        {errorMessage}
        {spinner}
        {content}
      </ul>
    )
  }
}

MovieList.defautProps = {
  moviesData: [],
  loading: true,
  error: false,
}

MovieList.propTypes = {
  moviesData: PropTypes.arrayOf(PropTypes.shape).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
}
