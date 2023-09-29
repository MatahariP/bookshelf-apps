const bookShelf = [];
let selectedBooks=[-1];
const RENDER_EVENT = 'render-book'
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';
const generatedID = () => {
    return +new Date();
}

document.addEventListener('DOMContentLoaded', function() {
    const submitBook = document.getElementById('inputBook');
    const submitSearch = document.getElementById('searchBook')
    submitBook.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
    })
    submitSearch.addEventListener('keyup', function(event){
        event.preventDefault()
        findBook();
    })
    if(isStorageExist()){
        loadDataFromStorage();
    }
})
const addBook = () =>{
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = parseInt(document.getElementById("inputBookYear").value);
    const bookIsComplete = document.getElementById("inputBookIsComplete").checked;
    const id = generatedID();
    const bookObject = makeObject(id, bookTitle, bookAuthor, bookYear, bookIsComplete)
    bookShelf.push(bookObject)
    alert(`Buku ${bookTitle} berhasil dibuat!!`)
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveBook();

} 

const makeObject = (id, title, author, year, isComplete) =>{
    return {
        id, 
        title, 
        author, 
        year, 
        isComplete
    }
    
}

const showBook = (bookObject) =>{
    const bookTitle = document.createElement('h3')
    bookTitle.innerText = bookObject.title;
    const bookAuthor = document.createElement('p')
    bookAuthor.innerText = `Penulis\t = ${bookObject.author}`;
    const bookYear = document.createElement('p')
    bookYear.innerText =`Tahun\t = ${ bookObject.year}`;
   
    const buttonContainer = document.createElement('div')
    buttonContainer.classList.add('action')
    const deleteButton = document.createElement('button')
    deleteButton.classList.add('red')
    deleteButton.innerText='Hapus Buku'
    deleteButton.addEventListener('click', function(){
       let konfirmasi = confirm(`Apakah anda yakin ingin Menghapus buku ${bookObject.title}`)
       if (konfirmasi) {
           deleteBook(bookObject.id)
       } 
    })
    if(bookObject.isComplete){
        const uncompletedButton = document.createElement('button')
        uncompletedButton.classList.add('green')
        uncompletedButton.innerText='Belum Selesai'
        uncompletedButton.addEventListener('click', function(){
            unfinishedBook(bookObject.id)
        })
        buttonContainer.append(deleteButton, uncompletedButton)
    }else {

        const completedButton = document.createElement('button')
        completedButton.classList.add('green')
        completedButton.innerText='Selesai'
        completedButton.addEventListener('click', function(){
            finishedBook(bookObject.id)
        })
        buttonContainer.append(deleteButton, completedButton)

    }
    const articleContainer = document.createElement('article')
    articleContainer.classList.add('book_item')
    articleContainer.append(bookTitle,bookAuthor,bookYear, buttonContainer)
    articleContainer.setAttribute('id', `book-${bookObject.title}`)
    return articleContainer;
}


const isStorageExist = () =>{
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
      }
    return true;
}

const saveBook = () =>{
    if(isStorageExist()){
        const parsed = JSON.stringify(bookShelf);
        localStorage.setItem(STORAGE_KEY, parsed)
        document.dispatchEvent(new Event(SAVED_EVENT))
    }
    }

const loadDataFromStorage = () =>{
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if (data !== null) {
      for (const book of data) {
        book.year = parseInt(book.year, 10);
        bookShelf.push(book);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  const deleteBook = (id) =>{
    const selectedBook = findBookIndex(id)
    
    if(selectedBook ===-1) return alert("Tidak ada Buku Tersebut")

    bookShelf.splice(selectedBook,1)
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveBook();
  }

  const finishedBook = (id) => {
    const selectedBook = findBookIndex(id)
    if(selectedBook === null) return alert("Tidak ada Buku Tersebut")
    bookShelf[selectedBook].isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveBook();
  }

  const unfinishedBook = (id) => {
    const selectedBook = findBookIndex(id)
    if(selectedBook === null) return alert("Tidak ada Buku Tersebut")
    bookShelf[selectedBook].isComplete= false;
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveBook();
  }
  const findBookIndex=(selectedId) =>{
    for(const index in bookShelf){
        if(bookShelf[index].id === selectedId){
            return index
        }
    } 
  }

  const findBook = () => {
    selectedBooks.length = 0;
    const searchTittle = document.getElementById('searchBookTitle').value.toLowerCase()
        for(const book in bookShelf){
            if(bookShelf[book].title.toLowerCase().includes(searchTittle)){
                selectedBooks.push(bookShelf[book])
            }
        }
       
    document.dispatchEvent(new Event(RENDER_EVENT))
    }
    

document.addEventListener(RENDER_EVENT, function(){
    const incomplete = document.getElementById('incompleteBookshelfList')
    const complete = document.getElementById('completeBookshelfList')
    let books = bookShelf;
    incomplete.innerHTML ='';
    complete.innerHTML ='';
    if(selectedBooks[0] != -1){
        books = selectedBooks
    }
    for(const book of books){
        const bookElement = showBook(book)
        if(book.isComplete){
            complete.append(bookElement);
        }else{
            incomplete.append(bookElement)
        }
    }
})

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });
  