import React from 'react'
import PropTypes from 'prop-types'
import './Movie.css'
import { Rate } from 'antd'
import { format } from 'date-fns'
import MovieDataContext from '../MovieDataContext'

export default class Movie extends React.Component {
  static changeBorderColor = (num) => {
    let border
    if (num < 3) {
      border = '2px solid #E90000'
    }
    if (num >= 3 && num < 5) {
      border = '2px solid #E97E00'
    }
    if (num >= 5 && num < 7) {
      border = '2px solid #E9D100'
    }
    if (num >= 7) {
      border = '2px solid #66E900'
    }
    return border
  }

  static cutOverview = (text, maxSymbols) => {
    if (text.length < maxSymbols) {
      return text
    }

    const shortText = `${text.substring(0, text.lastIndexOf(' ', maxSymbols))}...`
    return shortText
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  onChange = (num) => {
    const { movieId } = this.props
    const { onChangeRated } = this.context
    onChangeRated(num, movieId)
  }

  render() {
    const { originalTitle, releaseDate, overview, posterPath, rate, movieId, genres } = this.props
    // eslint-disable-next-line react/destructuring-assignment
    const { genres: genresList } = this.context.genres
    const titleStyle = { fontSize: '20px' }

    let convertOverview = Movie.cutOverview(overview, 225)

    if (originalTitle.length > 34) {
      titleStyle.fontSize = '16px'
    }

    if (originalTitle.length > 20) {
      convertOverview = Movie.cutOverview(overview, 190)
    }

    const src = posterPath ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2/${posterPath}` : '../no-image.png'
    const convertTime = releaseDate ? format(new Date(releaseDate), 'MMMM d, yyyy') : null

    let border = Movie.changeBorderColor(rate)
    const elements = genresList
      ? genres.map((id) => {
          const filterById = (item) => {
            if (id === item.id) {
              return true
            }
            return false
          }
          const result = genresList.filter(filterById)[0].name
          return (
            <span
              className="movies__genre"
              key={id}
            >
              {result}
            </span>
          )
        })
      : []

    return (
      <li className="movies__item">
        <div className="movies__wrapper">
          <div className="movies__img">
            <img
              src={src}
              alt="logo"
            />
          </div>
          <div className="movies__info">
            <div
              className="movies__title"
              style={titleStyle}
            >
              {originalTitle}
            </div>
            {/* <div className="movies__genres">{genres}</div> */}
            <div className="movies__date">{convertTime}</div>
            <div
              className="movies__score"
              style={(border = { border })}
            >
              {rate}
            </div>
            <div className="movies__genres">{elements}</div>
            <div className="movies__article">{convertOverview}</div>
            <div className="movies__rate">
              <Rate
                count={10}
                allowClear={false}
                allowHalf
                defaultValue={+localStorage.getItem(movieId)}
                onChange={this.onChange}
                style={{ fontSize: 14 }}
              />
            </div>
          </div>
        </div>
      </li>
    )
  }
}

Movie.contextType = MovieDataContext

Movie.defautProps = {
  movieId: 1,
  originalTitle: '',
  releaseDate: '',
  overview: '',
  posterPath: '',
  rate: '0',
  genres: [],
}

Movie.propTypes = {
  movieId: PropTypes.number.isRequired,
  originalTitle: PropTypes.string.isRequired,
  releaseDate: PropTypes.string.isRequired,
  overview: PropTypes.string.isRequired,
  posterPath: PropTypes.string.isRequired,
  rate: PropTypes.string.isRequired,
  genres: PropTypes.arrayOf(PropTypes.number).isRequired,
}
