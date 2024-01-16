import React, { useEffect } from "react";
import { useQuery } from 'react-query';
import { Book, Response, LIBRARY_KEY } from '../interfaces/interfaces';

export const Library = () => {
  // Redux States.
  const [availableBooks, setAvailableBooks] = React.useState<Book[]>(JSON.parse(localStorage.getItem('avBooks') || '[]') ?? []);
  const [myBooks, setMyBooks] = React.useState<Book[]>(JSON.parse(localStorage.getItem('myBooks') || '[]') ?? []);
  const [genres, setGenres] = React.useState<string[]>(['Todos']);
  const [selectedGenre, setSelectedGenre] = React.useState('Todos');

  // React Query to get available books from API.
  const {
    isLoading,
    data: library,
    isError,
    error
  } = useQuery<Response, Error>(
    LIBRARY_KEY,
    () => fetch('https://jelou-prueba-tecnica1-frontend.rsbmk.workers.dev').then(res => {
      if (!res.ok) {
        throw new Error('Network response failed')
      }
      return res.json()
    })
  )

  // Hooks to update redux states. 
  useEffect(() => {
    library?.default.library.map(book => {
      const genre = book.book.genre;
      const found = genres.find(el => {
        return el === genre;
      })
      if (!found) {
        setGenres([...genres, genre])
      }
    })
  })

  useEffect(() => {
    if (availableBooks?.length == 0) {
      setAvailableBooks(library?.default.library ?? []);
    }
  }, [library?.default.library]);

  useEffect(() => {
    localStorage.setItem('avBooks', JSON.stringify(availableBooks));
  }, [availableBooks])

  useEffect(() => {
    localStorage.setItem('myBooks', JSON.stringify(myBooks));
  }, [myBooks])

  // Handlers to add and remove books from reading list.
  const onAddEvent = (book: Book) => {
    const updatedAB = availableBooks.filter(b => b.book.ISBN !== book.book.ISBN);
    setAvailableBooks(updatedAB);
    setMyBooks([...myBooks, book]);
  }

  const onRemoveEvent = (book: Book) => {
    const updatedMB = myBooks.filter(b => b.book.ISBN !== book.book.ISBN);
    setMyBooks(updatedMB);
    setAvailableBooks([...availableBooks, book]);
  }

  // Function to display books in a array.
  const mapBookArray = (array: Book[], genre: string, divClasses: string, buttonTColor: string, buttonText: string, handler: any) => {
    return (
      <div className={`${divClasses}`}>
        {
          array.map(({ book }: Book) => (
            book.genre == genre || genre == 'Todos' ? 
            (<a key={book.ISBN + 'ab'} className="relative flex justify-center group h-80">
              <img className="absolute mx-auto object-cover h-full w-auto group-hover:opacity-50 group-active:opacity-50" src={book.cover} />
              <div className="relative">
                <div className="mt-40">
                  <div
                    className="transition-all transform translate-y-8 opacity-0 
                    group-hover:opacity-100 
                    group-hover:translate-y-0"
                  >
                    <div className="p-2">
                      <p className="text-lg text-black">
                        {book.title}
                      </p>
                      <button
                        className={`px-4 py-2 text-sm 
                        text-white ${buttonTColor}`}
                        onClick={() => {
                          handler({ book })
                        }}
                      >
                        {buttonText}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </a>) : null
          ))
        }
      </div>
    )
  }
  

  // Show a loading message while data is fetching
  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  // to handle error
  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-5">
      <div className="booksContainer md:col-span-2 bg-gray-100">
        <h1 className="m-10">Jelou Favorite Books!</h1>
        <select
          onChange={e => {
            setSelectedGenre(e.target.value);
          }}
          className="my-5"
        >
          {genres.map((genre, index) => {
            return (
              <option value={genre} key={index}>
                {genre}
              </option>
            );
          })}
        </select>
        { 
          mapBookArray(
            availableBooks,
            selectedGenre,
            'grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-column gap-5',
            'bg-green-600',
            'Añadir a la lista',
            onAddEvent
          )
        }
      </div>
      <div className="booksContainer bg-gray-300">
        <h2 className='my-10'>Mi Lista de Lectura</h2>
        {myBooks.length == 0 ? <div>No tiene libros agregados</div> : mapBookArray(
          myBooks,
          'Todos',
          'grid sm:grid-cols-1 grid-flow-column gap-5',
          'bg-red-600',
          'Remover',
          onRemoveEvent)
        }
      </div>
    </div>
  );
};

export default Library;