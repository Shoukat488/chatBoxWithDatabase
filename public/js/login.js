
    var firebaseConfig = {
        apiKey: "AIzaSyD_UChRzC0qFKDIOW4o5s0--etxlbDnmWY",
        authDomain: "chat-box-4d383.firebaseapp.com",
        databaseURL: "https://chat-box-4d383.firebaseio.com",
        projectId: "chat-box-4d383",
        storageBucket: "",
        messagingSenderId: "354463083011",
        appId: "1:354463083011:web:272ffce6179ad17e"
    };

// Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();

    function login()
    {
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;

        db.collection("login").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {

                if(doc.data().username == username && doc.data().password == password)
                {
                    localStorage.setItem("name",doc.data().name);
                    localStorage.setItem('username',doc.data().username);
                    console.log(doc.data().name, doc.data().username);

                    window.location.href = 'main.html';
                }
                else
                {
                    setTimeout(function() {
                        $('#message').css("display","block");
                    },500)
                }
        });

        });
    }

    function match(username,password)
    {
       
        return status === true;
    }

    $('#signup').click(()=>{
      
        window.location.href = "./signup.html";
    })
