export default class MovieDBService {
  /* eslint no-underscore-dangle: 0 */
  _apiBase = 'https://api.themoviedb.org/3/'

  _apiKey = '499e7a0f1b3eb74a676b4eaeac0c2ac3'

  async getResource(url) {
    const res = await fetch(`${this._apiBase}${url}`)

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`)
    }

    return res.json()
  }

  async getGenres() {
    const genres = await this.getResource(`genre/movie/list?api_key=${this._apiKey}&language=en-US&`)
    return genres
  }

  async getMovie(id) {
    const movie = await this.getResource(`movie/${id}?api_key=${this._apiKey}&language=en-US`)
    return movie
  }

  async searchFilms(page, keyword) {
    const res = await this.getResource(
      `search/movie?api_key=${this._apiKey}&language=en-US&page=${page}&&query=${keyword}`
    )
    return res
  }
}
