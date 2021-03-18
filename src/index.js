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

checkUserState();

function checkUserState() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            document.querySelector('body').style.color = "white";
            document.querySelector('body').innerHTML = "Cargando...";
            window.location.href = "./main.html";
        }
    });
}

const form = document.querySelector('.access-form');
form.addEventListener('submit', access);

function access(e) {
    e.preventDefault();
    let form = e.target;
    let email = form[0].value;
    let password = form[1].value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
            
            window.location.href = "./main.html";
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            const errorElement = document.querySelector('.error-message');
            console.error(errorCode);

            if (errorCode === 'auth/user-not-found') {
                form[0].style.border = "solid 2px red";
                errorElement.innerHTML =  "&#128712; User not found";
            }
            else if (errorCode === 'auth/invalid-email') {
                form[0].style.border = "solid 2px red";
                errorElement.innerHTML =  "&#128712; Invalid email";
            }else{
                form[0].style.border = '';
                errorElement.innerHTML =  '';
            }
            if (errorCode === 'auth/wrong-password') {
                form[1].style.border = "solid 2px red";
                errorElement.innerHTML =  "&#128712; Wrong password";
            }
            else {
                form[1].style.border = '';
            }
        });

}

