const bookShelf = [];
const RENDER_EVENT = 'render-book'
const generatedID = () => {
    return +new Date();
}

document.addEventListener('DOMContentLoaded', function() {
    const submitBook = document.getElementById('inputBook');
    submitBook.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
    })
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
    // const textContainer = document.createElement('div')
    // textContainer.classList.add('book_item')
    // textContainer.append(bookTitle,bookAuthor,bookYear)
    // textContainer.setAttribute('id', `book-${bookObject.title}`)
    const buttonContainer = document.createElement('div')
    buttonContainer.classList.add('action')
    if(bookObject.isComplete){
        
        const deleteButton = document.createElement('button')
        deleteButton.classList.add('red')
        deleteButton.innerText='Hapus Buku'
        const uncompletedButton = document.createElement('button')
        uncompletedButton.classList.add('green')
        uncompletedButton.innerText='   Selesai'
        buttonContainer.append(deleteButton, uncompletedButton)
    }else {
        const deleteButton = document.createElement('button')
        deleteButton.classList.add('red')
        deleteButton.innerText='Hapus Buku'
        const completedButton = document.createElement('button')
        completedButton.classList.add('green')
        completedButton.innerText='Belum Selesai'
        buttonContainer.append(deleteButton, completedButton)

    }
    const articleContainer = document.createElement('article')
    articleContainer.classList.add('book_item')
    articleContainer.append(bookTitle,bookAuthor,bookYear, buttonContainer)
    articleContainer.setAttribute('id', `book-${bookObject.title}`)
    return articleContainer;
}

// const saveBook = () =>{

// }

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