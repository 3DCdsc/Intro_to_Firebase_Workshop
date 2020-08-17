const app = firebase.app();
const db = app.firestore();
const auth = app.auth();

auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location = '/';
    }
});

async function firebaseGetTodos() {
    const todosRef = db.collection('todo-items');
    const snapshot = await todosRef.where('userID', '==', auth.currentUser.uid).get();
    const todos = [];

    if (snapshot.empty) {
        return todos;
    }

    snapshot.forEach(doc => {
        todos.push({ id: doc.id, ...doc.data() });
    });

    return todos;
}

async function firebaseAddTodo(description) {
    const res = await db.collection('todo-items').add({
        userID: auth.currentUser.uid,
        description,
        done: false,
        createdAt: Math.round(new Date().getTime() / 1000),
        updatedAt: Math.round(new Date().getTime() / 1000),
    })

    return res.id;
}

async function firebaseUpdateTodo(id, done) {
    const res = await db.collection('todo-items').doc(id).set({
        done,
        updatedAt: Math.round(new Date().getTime() / 1000),
    }, { merge: true });

    return res.id;
}

const todoItems = document.getElementById("todo-items");

async function addTodo({ id, description, done }) {
    const el = document.createElement("div");
    todoItems.appendChild(el);
    el.outerHTML =
        `<div id="todo-item-${id}" class="todo-item">
            <p>${description}</p>
            <input id="todo-item-checkbox-${id}" type="checkbox" class="checkbox" 
            ${done ? "checked" : null}/>
        </div>`;
}

async function updateTodo({ id, done }) {
    const el = document.getElementById(`todo-item-${id}`);
    const p = el.querySelector('p');
    const checkbox = el.querySelector('input');
    if (done) {
        p.style = "text-decoration: line-through";
        checkbox.checked = true;
    }
    else {
        p.style = "";
        checkbox.checked = false;
    }
}

firebaseGetTodos().then((todos) => {
    todos.forEach(todo => { addTodo(todo) });
})


todoItems.addEventListener('change', (e) => {
    const target = e.target;

    const r = /^todo-item-checkbox-(.*)/;
    const match = target.id.match(r);

    if (!match) {
        return;
    }

    const id = match[1];
    const done = target.checked;

    console.log(`Item ID: ${id} Checked: ${checked}`);
});

const addItemText = document.getElementById("add-item-text");
const addItemBtn = document.getElementById("add-item-btn");

addItemBtn.addEventListener("click", (e) => {
    const inputText = addItemText.value;
    console.log(inputText);
    addItemText.value = '';
});
