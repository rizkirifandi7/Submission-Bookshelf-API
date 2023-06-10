/* eslint-disable max-len */
const {nanoid} = require('nanoid');
const books = require('./books');

// proses menambahkan buku
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku, mohon isi nama buku terlebih dahulu',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku, readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  } else {
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };

    books.push(newBook);

    const isSuccess = books.filter((note) => note.id === id).length > 0;

    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }
  }

  const response = h.response({
    status: 'error',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// menampilkan seluruh buku
const getAllBooksHandler = (request, h) => {
  const {name, reading, finished} = request.query;

  if (name !== undefined) {
    const BooksName = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    const response = h
        .response({
          status: 'success',
          data: {
            books: BooksName.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
        });
    response.code(200);
    return response;
  } else if (reading !== undefined) {
    const BooksReading = books.filter(
        (book) => Number(book.reading) === Number(reading),
    );

    const response = h
        .response({
          status: 'success',
          data: {
            books: BooksReading.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
        });
    response.code(200);
    return response;
  } else if (finished !== undefined) {
    const BooksFinished = books.filter(
        (book) => book.finished == finished,
    );

    const response = h
        .response({
          status: 'success',
          data: {
            books: BooksFinished.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
        });
    response.code(200);
    return response;
  } else {
    const response = h.response( {
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    } );
    response.code(200);
    return response;
  }
};

// menampilkan buku berdasarkan id
const getBookByIdHandler = (request, h) => {
  const {id} = request.params;
  const book = books.filter((b) => b.id === id)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak dapat ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const {id} = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal update buku, isi nama buku terlebih dahulu',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal update buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  } else if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku telah berhasil diupdate',
    });
    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Gagal update buku, karena Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
};

// proses menghapus buku
const deleteBookByIdHandler = (request, h) => {
  const {id} = request.params;
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku telah berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus, karena id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
