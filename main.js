if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
}

const firebaseConfig = {
    apiKey: "AIzaSyAPZ2YkLz-dbZ-3MNv6XMX5hBaYsIEahXM",
    authDomain: "task-app-114b4.firebaseapp.com",
    projectId: "task-app-114b4",
    storageBucket: "task-app-114b4.appspot.com",
    messagingSenderId: "77928853485",
    appId: "1:77928853485:web:f15dcefddb1dcfc7b541e4"
};

firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
let currentUser = '';

document.querySelector('.log-out-button').addEventListener('click', logOut);

checkUserState();

function checkUserState() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            currentUser = user.uid;
            getItemsFromDatabase();
        } else {
            window.location.href = "./index.html";
        }
    });
}

function logOut() {
    firebase.auth().signOut().then(() => {
        window.location.href = "./index.html";

    }).catch((error) => {
        console.log(error);
    })
}

function saveItemInDatabase(title, maxValue, currentValue, item) {

    if (title === '' || maxValue === 0) {
        alert("Error");
        
    }
    else {
        db.collection(currentUser).add({
            title: title,
            maxValue: maxValue,
            currentValue: currentValue
        }).then((doc) => {

            item.setAttribute('data-id', doc.id);
        }).catch((error) => {
            console.error("Error adding document: ", error);
        });
    }
}

function getItemsFromDatabase() {
    const container = document.querySelector('.container');
    container.innerHTML = '';

    db.collection(currentUser)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let item = createItem(doc.data().title, doc.data().maxValue, doc.data().currentValue);
                let barWidth = (doc.data().currentValue * 100) / doc.data().maxValue;
                item.children[1].children[1].style.width = `${barWidth}%`;
                item.children[1].children[0].textContent = `${Math.round(barWidth)}%`;
                item.setAttribute('data-id', doc.id);
                container.appendChild(item);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

function updateItemInDatabase(id, currentValue) {

    var row = db.collection(currentUser).doc(id);
    return row.update({
        currentValue: currentValue
    })
        .then(() => {
            console.log("Edit ok")
        })
        .catch((error) => {
            console.error("Error updating document: ", error);
        });
}

// - - - - - - - - - - - -- - - - - -- - - - - -- - - - - -- - - - - -- - - - - -- - - - - -- - - - - -


function showItemOptions(e) {
    let options = this.children[2];

    if (e.target.className === 'increase-button') {
        increaseProgress(this);
    }
    else if (e.target.className === 'decrease-button') {
        decreaseProgress(this);
    }
    else if (e.target.className === 'delete-button') {
        deleteItem(this)
    }
    else if (e.target.className === 'edit-button') {
        editItem(this);
    }
    else {
        options.classList.toggle('item-options-show');
    }
}

function increaseProgress(item) {

    let currentValueElement = item.children[0].children[1].children[0]
    let currentValue = parseInt(currentValueElement.textContent);
    let maxValue = parseInt(item.children[0].children[1].children[1].textContent);

    currentValue += 1;
    if (currentValue > maxValue) {
        
        currentValueElement.textContent = maxValue;
    } else {
        currentValueElement.textContent = currentValue;
        
    }
    currentValueElement = item.children[0].children[1].children[0].textContent;

    updateBarStatus(item, currentValueElement, parseInt(maxValue));
    updateItemInDatabase(item.attributes[1].value, parseInt(item.children[0].children[1].children[0].textContent));
}

function decreaseProgress(item) {
    let currentValueElement = item.children[0].children[1].children[0];
    let currentValue = parseInt(currentValueElement.textContent);
    let maxValue = parseInt(item.children[0].children[1].children[1].textContent);

    currentValue -= 1;
    if (currentValue < 0) {
        currentValueElement.textContent = 0;
    } else {
        currentValueElement.textContent = currentValue;
        
    }

    currentValueElement = item.children[0].children[1].children[0].textContent;
    updateBarStatus(item, currentValueElement, parseInt(maxValue));
    updateItemInDatabase(item.attributes[1].value, parseInt(item.children[0].children[1].children[0].textContent));
}

function updateBarStatus(item, currentValue, maxValue) {
    let barWidth = (currentValue * 100) / maxValue;
    item.children[1].children[1].style.width = `${barWidth}%`;
    item.children[1].children[0].textContent = `${Math.round(barWidth)}%`;
}


function deleteItem(item) {

    if (confirm("Delete?")) {
        let id = item.attributes[1].value;

        db.collection(currentUser).doc(id).delete().then(() => {
            item.remove();
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
    else {
        return;
    }
}

function editItem(item) {
    let id = item.attributes[1].value;
    let newTitle = prompt("New title: ");
    if (newTitle != null) {
        item.children[0].children[0].textContent = newTitle;
        var row = db.collection(currentUser).doc(id);
        return row.update({
            title: newTitle
        })
            .then(() => {
                console.log("Edit title ok");
            })
            .catch((error) => {
                console.error("Error updating document: ", error);
            });
    }
    else {
        return
    }

}

const modal = document.querySelector('.modal');
const addItemButton = document.querySelector('.add-item-button');
const acceptButton = document.querySelector('.accept-button');
const cancelButton = document.querySelector('.cancel-button');

acceptButton.addEventListener('click', addItem);
cancelButton.addEventListener('click', hideModalWindow);
addItemButton.addEventListener('click', showModalWindow);

function hideModalWindow() {
    modal.style.display = "none";
}

function showModalWindow() {
    const modal = document.querySelector('.modal');
    modal.style.display = "flex";
}

function addItem() {
    let title = document.querySelector('#title');
    let maxValue = document.querySelector('#max-value');
    let container = document.querySelector('.container');
    let item = createItem(title.value, maxValue.value, 0);
    saveItemInDatabase(title.value, maxValue.value, 0, item);
    container.appendChild(item);
    title.value = '';
    maxValue.value = '';
    modal.style.display = "none";
}

function createItem(title, maxValue, currentValue) {
    let item = document.createElement('DIV');

    item.className = "item";
    item.addEventListener('click', showItemOptions);
    item.innerHTML = `<div class="item-header">
                    <div class="item-title">${title}</div>
                    <div class="counter"><span class="current-value">${currentValue}</span>/<span class="max-value">${maxValue}</span></div>
                </div>
                <div class="bar">
                    <div class="percentage">0%</div>
                    <div class="progress"></div>
                </div>
                <div class="item-options">
                    <button class="edit-button">&#9998</button>
                    <div class="buttons">
                        <button class="increase-button">+</button>
                        <button class="decrease-button">-</button>
                    </div>
                    <button class="delete-button">&#128465;</button>
                </div>`;

    return item;
}