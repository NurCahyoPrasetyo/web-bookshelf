const STORAGE_KEY = "books";
const RENDER_EVENT = "render-books";

const books = [];

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("inputBook");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    addBook();
    form.reset();
  });
  loadDataFromStorage();
});

function saveData() {
  const parsed = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsed);
}

function loadDataFromStorage() {
  const serializeData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializeData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(RENDER_EVENT, () => {
  const unCompletedListBooks = document.getElementById("uncompletedBooksList");
  unCompletedListBooks.innerHTML = "";

  const completedListBooks = document.getElementById("completedBookList");
  completedListBooks.innerHTML = "";

  const search = document.getElementById("searchBooks").value.toLowerCase();

  for (const book of books) {
    const bookTitle = book.title.toLowerCase();
    if (bookTitle.includes(search)) {
      const newBook = makeBooks(book);
      if (!book.isCompleted) {
        unCompletedListBooks.append(newBook);
      } else {
        completedListBooks.append(newBook);
      }
    }
  }
});

const btnForm = document.querySelector(".btn-hidden");

btnForm.addEventListener("click", function () {
  const toggleForm = document.getElementById("toggle-hidden");
  if (toggleForm.hidden) {
    toggleForm.removeAttribute("hidden");
  } else {
    toggleForm.setAttribute("hidden", true);
  }
});

const searchBook = document.getElementById("searchBooks");
searchBook.addEventListener("input", () => {
  document.dispatchEvent(new Event(RENDER_EVENT));
});

function addBook() {
  let id = +new Date();
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = Number(document.getElementById("inputBookYear").value);
  const isCompleted = document.getElementById("select").value;

  const convert = convertIsCompletedToBoolean(isCompleted);

  const booksObject = generateBookObject(id, title, author, year, convert);

  books.push(booksObject);
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}
function convertIsCompletedToBoolean(str) {
  if (str === "completed") return true;
  return false;
}

function convertIsCompletedToString(text) {
  if (text) return "completed";
  return "uncompleted";
}
function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

const btnClose = document.getElementById("btn-cancel");
btnClose.addEventListener("click", () => {
  document.getElementById("toggle-hidden").setAttribute("hidden", true);
});

function makeBooks(book) {
  const title = document.createElement("h2");
  title.classList.add("title-book");
  title.innerText = `${book.title}`;

  const author = document.createElement("p");
  author.innerText = `Penulis: ${book.author}`;

  const year = document.createElement("p");
  year.innerText = `Tahun: ${book.year}`;

  const deletedButton = document.createElement("button");
  deletedButton.classList.add("btn-card", "danger-btn");
  deletedButton.innerText = "Hapus";

  deletedButton.addEventListener("click", () => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // console.log("test", willDelete);
        removeBook(book.id);
        swal("Poof! Your imaginary file has been deleted!", {
          icon: "success",
        });
      } else {
        swal("Your imaginary file is safe!");
      }
    });
  });

  const div = document.createElement("div");
  div.classList.add("btn-status");

  if (book.isCompleted) {
    const btnStatus = document.createElement("button");
    btnStatus.classList.add("btn-card", "success-btn");
    btnStatus.setAttribute("type", "button");
    btnStatus.innerText = "Belum selesai dibaca";
    btnStatus.addEventListener("click", () => {
      statusUncompleted(book.id);
    });

    div.append(btnStatus, deletedButton);
  } else {
    const btnCancel = document.createElement("button");
    btnCancel.classList.add("btn-card", "success-btn");
    btnCancel.setAttribute("type", "button");
    btnCancel.innerText = "Selesai dibaca";
    btnCancel.addEventListener("click", () => {
      statusCompleted(book.id);
    });

    div.append(btnCancel, deletedButton);
  }

  const article = document.createElement("article");
  article.classList.add("book-item");
  article.append(title, author, year, div);
  document.getElementById("toggle-hidden").setAttribute("hidden", true);
  return article;
}

function findBookId(id) {
  const bookIndex = books.find((book) => book.id === id);
  if (bookIndex === null) return null;
  return bookIndex;
}

function statusCompleted(id) {
  const bookIndex = findBookId(id);
  if (bookIndex === null) return null;
  bookIndex.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function statusUncompleted(id) {
  const bookIndex = findBookId(id);
  if (bookIndex === null) return;
  bookIndex.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(id) {
  const bookTarget = findBookId(id);
  console.log("hyyy");

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();

  return true;
}

function notificationAdd() {
  swal({
    title: "Berhasil menambahkan buku!",
    icon: "success",
  });
}
