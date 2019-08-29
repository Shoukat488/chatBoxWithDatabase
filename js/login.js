
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
        // alert();
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
                    $('#message').css("display","block");
                }
        });

        });
    }

    function match(username,password)
    {
       

        return status === true;
    }


// <?php
//     session_start();
//     if(isset($_POST['goForSignUp']))
//     {
//         header("location: signup.php");
//     }

//     if (isset($_POST['submit']))
//     {
//          $username = $_POST['username'];
//          $password = $_POST['password'];
//          $flag = 0;
//         $loginFile = fopen('loginData.json','r') or die("File can't open");

//         if($loginFile)
//         {
//             $Data = fread($loginFile, filesize('loginData.json'));
//             $data = json_decode($Data);
//             foreach( $data as $obj ){
//                 if ( ($username == $obj->username) && ($password == $obj->password ))
//                 {
//                     $_SESSION['username'] = $username;
//                     $_SESSION['name'] = $obj->name;
//                     $_SESSION['password'] = $password;
//                     $_SESSION['status'] ='true';
//                     $flag = 1;
//                     header("location:main.php");
//                 }
// //                echo $obj->username;
//                 }
                
//         }
//         if($flag == 0)
//         {
//             $_SESSION['status'] ='false';
//             header("location:login1.php");
//         }

//     }



