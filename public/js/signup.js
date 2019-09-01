$(document).ready(()=>{
    var firebaseConfig = {
      apiKey: "AIzaSyD_UChRzC0qFKDIOW4o5s0--etxlbDnmWY",
      authDomain: "chat-box-4d383.firebaseapp.com",
      databaseURL: "https://chat-box-4d383.firebaseio.com",
      projectId: "chat-box-4d383",
      storageBucket: "chat-box-4d383.appspot.com",
      messagingSenderId: "354463083011",
      appId: "1:354463083011:web:272ffce6179ad17e"
    };

  firebase.initializeApp(firebaseConfig);
  let storage = firebase.storage();
  var db = firebase.firestore();
  let imageFile;
  let username = '';
  setTimeout(()=>{

    inputFile.addEventListener('change',(event)=>{

      imageFile = event.target.files[0];
      $('.custom-file-label').html(imageFile.name)
    })
  },3000)
  $('#signup').click(async()=>{
      username = ''
      let name = $('#fullname').val();
      let email = $('#email').val();
      let pass1 = $('#createPass').val();
      let pass2 = $('#confirmPass').val();

      if(pass1 === pass2)
      {
        for(let i = 0 ; i < email.length ; i++)
            {
                if(email[i]=='@')
                break;
                username += email[i];
            }
            console.log(username);
            
        let obj = {
              name,
              username,
              password: pass1
            }
          
            // let result = await AlreadyRegister(obj);

            // if(result==true)
            // {
            //   $('#message').html(`user already registered with ${email}`)
            //   $('#message').css("display","block");            
            // }
            // else{

              getKeys(obj);

              setTimeout(()=>{
                addIntoLoginList(obj);
              },3000);


            // }

    
      }
      else
      $('#message').css("display","block");
      
      
    });
    // async function AlreadyRegister(obj)
    // {
    //   var result = false;
    //   const promise = await db.collection('login').get()

    //   console.log(promise)
    
    //   console.log(result);
    //   return result;
    // }
    function getKeys(obj)
    {
      console.log("0")
      var keys = [];
      db.collection("login").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if(doc.data().username !== obj.username)
          keys.push(doc.data().username);
        });

        console.log('Before register');

          registerAtFriends(keys,obj);
    
          console.log('After register');

          setTimeout(()=>{
            addFriendsIntoList(keys,obj);
            console.log("H1")
            },3000)
          setTimeout(()=>{
            addAtFriendsLiveChat(keys,obj)
            console.log("H1")
            },3000)
          setTimeout(()=>{
            addFriendsIntoLiveChat(keys,obj);
            console.log("H1")
            },3000)
          setTimeout(()=>{
            addIntoOnlineList(obj);
          },3000)
          setTimeout(() => {
            uploadImage();
            console.log("H1")
          }, 1000);
          setTimeout(() => {
          window.location.href = "login.html";            
            }, 2000);
        });
    
    }

    function registerAtFriends(keys,obj)
    {
      keys.forEach( (key)=>{
        
        db.collection('users').doc(key)
              .collection(obj.username).add({});
        console.log("register")

      })
    }

    function addFriendsIntoList(keys,obj)
    {
      keys.forEach( (key)=>{
        
        db.collection('users').doc(obj.username)
        .collection(key).add({});
        console.log("add");

      })
    }
    
    function addIntoLoginList(obj)
    {
      db.collection("login").add(obj)
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }

    function addFriendsIntoLiveChat(keys,obj)
    {
      keys.forEach( (key)=>{
        db.collection('liveChatt').doc(obj.username)
            .collection(key).add({"username":key,"live":false,"online":false});
      console.log("add");

    })

    }
    function uploadImage()
    {
      $('.progress-bar').css('display','inline');
      let storageRef = storage.ref(`profile-images/${username}/${imageFile.name}`);
      let task = storageRef.put(imageFile);
      task.on('state_changed',function progress(snapshot){
      let percentage = snapshot.bytesTransferred/ snapshot.totalBytes *100
      $('.progress-bar').css('width',`${percentage}%`)
      $('.progress-bar').html(`${percentage}%`)

      })
    }
    function addAtFriendsLiveChat(keys,obj)
    {
      keys.forEach( (key)=>{
        
         db.collection('liveChatt').doc(key)
              .collection(obj.username).add({"live":false})
        console.log("register at live chat")

      })
    }
    function addIntoOnlineList(obj)
    {
      db.collection('onlineUsers').doc(obj.username).add({"online":false});
    }
})

