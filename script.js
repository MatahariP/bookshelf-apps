const bookShelf = [];
const RENDER_EVENT = 'render-book'
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';
const generatedID = () => {
    return +new Date();
}

document.addEventListener('DOMContentLoaded', function() {
    const submitBook = document.getElementById('inputBook');
    submitBook.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
    })
    if(isStorageExist()){
        loadDataFromStorage();
    }
})
const addBook = () =>{
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const bookIsComplete = document.getElementById("inputBookIsComplete").checked;
    const id = generatedID();
    const bookObject = makeObject(id, bookTitle, bookAuthor, bookYear, bookIsComplete)
    bookShelf.push(bookObject)
    console.log(bookObject)

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
    console.log("TTES")
    const bookTitle = document.createElement('h3')
    bookTitle.innerText = bookObject.title;
    const bookAuthor = document.createElement('p')
    bookAuthor.innerText = bookObject.author;
    const bookYear = document.createElement('p')
    bookYear.innerText = bookObject.year;
   
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
    console.log( selectedBook)
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

  
document.addEventListener(RENDER_EVENT, function(){
    const incomplete = document.getElementById('incompleteBookshelfList')
    const complete = document.getElementById('completeBookshelfList')
    incomplete.innerHTML ='';
    complete.innerHTML ='';
    console.log(bookShelf)
    for(const book of bookShelf){
        console.log("loop")
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
    // alert(JSON.stringify(todos[0].task))
  });
  