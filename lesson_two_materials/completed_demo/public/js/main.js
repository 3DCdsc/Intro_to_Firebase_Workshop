// PART 3: SETTING UP FIREBASE
// set up the firebase objects here so we can use it later
const app = firebase.app();
const db = app.firestore();


// PART 4: INTERACTING WITH FIREBASE
// set up the following utility functions to interact with firestore:
// - firebaseGetTodos gets all todo items in the firestore collection
// - firebaseCreateTodo creates a todo item in the firestore collection
// - firebaseUpdateTodo updates a todo item in the firestore collection
// - firebaseDeleteTodo deletes a todo item in the firestore collection

const firebaseGetTodos = async (db, userID) => {
    const todosRef = db.collection('todo-items');

    // // FOR PART 4
    // const todosSnapshot = await todosRef.get();

    // FOR PART 8
    const todosSnapshot = await todosRef.where("userID", "==", userID).get();

    const todos = [];
    todosSnapshot.forEach((doc) => {
        todos.push({
            id: doc.id,
            ...doc.data()
        })
    });

    return todos;
};

const firebaseCreateTodo = async (db, todo) => {
    const todosRef = db.collection('todo-items');
    const todoRef = await todosRef.add(todo);
    const doc = await todoRef.get();

    const res = {
        ...doc.data(),
        id: doc.id,
    }

    return res;
};

const firebaseUpdateTodo = async (db, todo) => {
    const todoRef = db.collection('todo-items').doc(todo.id);

    const update = { ...todo };
    delete update.id;

    await todoRef.update(todo);
};

const firebaseDeleteTodo = async (db, todo) => {
    const todoRef = db.collection('todo-items').doc(todo.id);

    await todoRef.delete();
};


// PART 6: ADDING FIREBASE TO THE EVENT HANDLERS
// Go back to the event handlers we set up in part 2.2
// We now want to pull the todo items from firestore when the app loads
// We also want to create / update the documents on firestore when we interact with the client


// PART 7: DEALING WITH AUTHENTICATION
// We want to redirect the user back to /index.html when the user is not logged in with firebase
// We also want to allow the user to sign out when the sign-out button is clicked
// We also want to add our userID to the todo object when we create a new todo
const auth = app.auth();
console.log(auth);

auth.onAuthStateChanged(async (user) => {
    if (!user) {
        window.location = '/';
    }

    const t = await firebaseGetTodos(db, user.uid);
    t.forEach(todo => { todos.push(todo) });

    todos.forEach((todo) => {
        docAddTodo(todo);
    })
});


document.querySelector('#sign-out').addEventListener('click', async (e) => {
    await auth.signOut();
})

// PART 1: SETTING UP YOUR DATA MODEL (or, you should use a framework)
// set up an array to hold the todo objects, yea thats it
const todos = [
];


// PART 2.1: INTERACTING WITH THE DOM
// set up the following utility functions to manipulate the DOM
const docAddTodo = (todo) => {
    const todoItems = document.querySelector('#todo-items');

    const el = document.createElement("div");
    todoItems.appendChild(el);
    el.outerHTML =
        `<div id="todo-item-${todo.id}" class="todo-item">
            <p>${todo.description}</p>
            <input type="checkbox" class="checkbox"/>
        </div>`;

    const checkbox = todoItems.querySelector(`#todo-item-${todo.id} input`)
    checkbox.checked = todo.done;
};

const docUpdateTodo = (todo) => {
    const todoItems = document.querySelector('#todo-items');
    const todoItem = todoItems.querySelector(`#todo-item-${todo.id}`);

    const todoItemDesc = todoItem.querySelector('p');

    if (todo.done) {
        todoItemDesc.style = "text-decoration: line-through";
    }
    else {
        todoItemDesc.style = "";
    }
};

const docDeleteTodo = (todo) => {
    const todoItems = document.querySelector('#todo-items');
    const todoItem = todoItems.querySelector(`#todo-item-${todo.id}`);
    todoItem.remove();
}



// PART 2.2 SETTING UP EVENT HANDLERS 
// set up callback to append todo-item elements into the DOM when document loads
// set up callback to add todo-item element when add-item button is pressed

// The load event is fired when the whole page has loaded, including all dependent resources
// We could also (more correctly) listen for DOMContentLoaded
// We can remove this handler from PART 7 onwards
// window.addEventListener("load", async (e) => {
//     // FOR PART 6
//     const t = await firebaseGetTodos(db);
//     t.forEach(todo => { todos.push(todo) });

//     // FOR PART 2.2
//     todos.forEach((todo) => {
//         docAddTodo(todo);
//     })
// });

document.querySelector('#add-item button').addEventListener("click", async (e) => {
    // FOR PART 2.2
    const description = document.querySelector('#add-item input').value;
    if (description === "") {
        return
    }

    // You could probably create a utilty functions for this
    const currentTime = Math.round(new Date().getTime() / 1000);

    // Remove this from PART 6 onwards
    // const id = Math.random().toString(36).substring(7);

    const todo = {
        userID: auth.currentUser.uid, // should be empty in PART 2.2, has value in PART 7
        description,
        done: false,
        createdAt: currentTime,
        updatedAt: currentTime,
    };

    // FOR PART 6
    const res = await firebaseCreateTodo(db, todo);
    todo.id = res.id;

    // update data model and DOM
    todos.push(todo);
    docAddTodo(todo);

    // cleanup DOM
    document.querySelector('#add-item input').value = "";
})

document.querySelector('#todo-items').addEventListener('change', async (e) => {
    const target = e.target;
    const el = target.parentNode;

    const r = /^todo-item-(.*)/;
    const match = el.id.match(r);

    const currentTime = Math.round(new Date().getTime() / 1000);

    const id = match[1];
    const todo = todos.find((t) => t.id == id);
    console.log(todo);

    // update data model and DOM
    todo.done = target.checked;
    todo.updatedAt = currentTime;
    docUpdateTodo(todo);

    // FOR PART 6
    const res = await firebaseUpdateTodo(db, todo);
})
