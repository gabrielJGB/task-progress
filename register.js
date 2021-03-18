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
document.querySelector('.register-button').addEventListener('click', registerUser);

function registerUser(e) {
    e.preventDefault();
    const form = document.querySelector('.register-form');

    firebase.auth().createUserWithEmailAndPassword(form[0].value,form[1].value)
        .then((user) => {
            
            form.innerHTML = `
                <div>Registered</div>
                <button class="register-button">Go to main page</button>`;
            document.querySelector('.register-button').addEventListener('click', (el) => {
                el.preventDefault();
                window.location.href = "./main.html";
            });
        })
        .catch((error) => {
            var errorCode = error.code;
            console.log(errorCode);
            const errorElement = document.querySelector('.error-message');
            if (errorCode === 'auth/invalid-email') {
                form[0].style.border = "solid 2px red";
                errorElement.innerHTML =  "&#128712; Invalid email";
            }
            else {
                form[0].style.border = '';
            }
            if (errorCode === 'auth/weak-password') {
                form[1].style.border = "solid 2px red";
                errorElement.innerHTML =  "&#128712; Weak password";
            }
            else {
                form[1].style.border = '';
            }
        });
}