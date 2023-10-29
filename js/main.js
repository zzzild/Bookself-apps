const book = [];
const RENDER_EVENT = 'render-book';

document.addEventListener('DOMContentLoaded',function(){
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function(e){
        e.preventDefault();
        addBook()
    })

    if (isStorageExist()){
        loadDataFromStorage();
    }
});

function addBook(){
    const generatedID = generateid();
    const titleBook = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const yearInput = document.getElementById('date').value;
    const year = parseInt(yearInput)
    
    const bookObject = generateBookObject(generatedID, titleBook, author, year, false);

    book.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


function generateid(){
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete){
 return{
    id,
    title,
    author,
    year,
    isComplete
 }   
}

document.addEventListener(RENDER_EVENT, function() {
    const uncompletedBOOKList = document.getElementById('incompleteBook');
    uncompletedBOOKList.innerHTML = '';

    const completedBOOKList =document.getElementById('completedBook');
    completedBOOKList.innerHTML = '';

    for (const bookItem of book) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isComplete)
            uncompletedBOOKList.append(bookElement)
        else 
            completedBOOKList.append(bookElement)
    }
});

function makeBook(bookObject){
    const textTitle = document.createElement('h2')
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('h5')
    textAuthor.innerText = bookObject.author;

    const textYear = document.createElement('p')
    textYear.innerText = bookObject.year

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle,textAuthor,textYear);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `id`,`book-${bookObject.id}`);

    if (bookObject.isComplete){
        const undoButton = document.createElement('button');
        const undoButtonLog = document.createElement('i');
        undoButtonLog.classList.add('bi-recycle')
        undoButton.classList.add('undo-button');

        undoButton.appendChild(undoButtonLog)

        undoButton.addEventListener('click', function(){
            undoTaskFromCompleted(bookObject.id);
        })

        const trashButton = document.createElement('button');  
        const trashButtonLog = document.createElement('i');
        trashButtonLog.classList.add('bi-trash');
        trashButton.classList.add('trash-button');

        trashButton.appendChild(trashButtonLog);

        trashButton.addEventListener('click', function(){
            removeTaskFromCompleted(bookObject.id);
        })

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        const checkButtonLog = document.createElement('i');
        checkButtonLog.classList.add('bi-check2-circle')
        checkButton.classList.add('check-button');
        
        checkButton.appendChild(checkButtonLog)

        checkButton.addEventListener('click', function(){
            addTaskToCompleted(bookObject.id);
        })

        const trashButton = document.createElement('button');  
        const trashButtonLog = document.createElement('i');
        trashButtonLog.classList.add('bi-trash');
        trashButton.classList.add('trash-button');

        trashButton.appendChild(trashButtonLog);

        trashButton.addEventListener('click', function(){
            removeTaskFromCompleted(bookObject.id);
        })
    
        container.append(checkButton);
        container.append(trashButton);
        
    }
    
        return container;
};

function addTaskToCompleted (bookId){
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId){
    for (const bookItem of book) {
        if (bookItem.id === bookId){
            return bookItem;
        }
    }
    return null;
}

function removeTaskFromCompleted(bookId){
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    book.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoTaskFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId){
    for (const index in book){
        if(book[index].id === bookId){
            return index;
        }
    }
    return -1;
}

function saveData(){
    if(isStorageExist()){
        const parsed = JSON.stringify(book);
        localStorage.setItem(STORAGE_KEY, parsed)
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function isStorageExist(){
    if ((typeof (Storage) === undefined)) {
        alert('Bowser tidak mendukung')
        return false
    }
    return true
}

function loadDataFromStorage() {
    const serialiazedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serialiazedData);

    if (data !== null) {
        for (const books of data) {
            book.push(books);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
};

document.addEventListener(SAVED_EVENT, function(){
  const notif = document.getElementById('notif');
  notif.style.visibility = 'visible';
  setTimeout(function(){
    notif.style.visibility = 'hidden';
  }, 400)
})































































































