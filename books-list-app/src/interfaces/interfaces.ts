export const LIBRARY_KEY = 'library';

export interface Response {
  default: {
    library: Book[]
  }
}

export interface Book {
  book: {
    title: string,
    pages: number,
    genre: string,
    cover: string,
    synopsis: string,
    year: number,
    ISBN: string,
    author: Author
  }
}

export interface Author {
  name: string,
  otherBooks: string[]
}