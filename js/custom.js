$(document).ready(function () {

    var firebaseConfig = {
        apiKey: "AIzaSyD_UChRzC0qFKDIOW4o5s0--etxlbDnmWY",
        authDomain: "chat-box-4d383.firebaseapp.com",
        databaseURL: "https://chat-box-4d383.firebaseio.com",
        projectId: "chat-box-4d383",
        storageBucket: "gs://chat-box-4d383.appspot.com/profile-images",
        messagingSenderId: "354463083011",
        appId: "1:354463083011:web:272ffce6179ad17e"
    };
    var config = {
        apiKey: "AIzaSyD_UChRzC0qFKDIOW4o5s0--etxlbDnmWY",
        authDomain: "chat-box-4d383.firebaseapp.com",
        databaseURL: "https://chat-box-4d383.firebaseio.com",
        storageBucket: "gs://chat-box-4d383.appspot.com/profile-images",
      };
    // firebase.initializeApp(config);
    
    firebase.initializeApp(firebaseConfig);
    
    // var storage = firebase.storage();
    var db = firebase.firestore();

    let username = localStorage.getItem('username');
    let name = localStorage.getItem('name');
    let  friend_name = 'm_awatif';
    var chatBox={

        loadMyData: function(){

            let string= '';

            db.collection("users").doc(username)
                .collection(friend_name).get().then((querySnapshot) => {
             querySnapshot.forEach((doc) => {
                 
            // console.log(doc.id ,'=>',doc.data() )

            if(doc.data().name =='You')
            string += `<div class=" chat self"> <span class="name" >You</span><br>`;
            else
            string += `<div class=" chat friend"> <span class="name" >${doc.data().name}</span><br>`;

            string += `<span class="time ">${doc.data().time} </span>`;
            string += `<br><span class="comment">${doc.data().comment} </span></div>`;

            });
            $('#chatBox').html(string);

            });

            setTimeout(()=>{
                chatBox.loadMyData();
            },1000);
                      
    

        },
        postData: function(dataForMe,dataForYou)
        {
            db.collection("users").doc(username)
                .collection(friend_name).add(dataForMe);
            
            db.collection("users").doc(friend_name)
                .collection(username).add(dataForYou);
        },
        getTime: function() {
            let DateAndTime = new Date();
            let month = DateAndTime.getMonth();
            let day = DateAndTime.getDate();
            let time = DateAndTime.getHours();
            let year= DateAndTime.getFullYear();
            let type;
            if(time>12)
                type  ="pm";
            else
                type = "am"
            if(time==0)
                time = 12;
            else if (time>12)

            time -= 12;
            let  mint = DateAndTime.getMinutes();

            return(time+":"+mint + " "+type +" "+day+"-"+month+"-"+year);
        },
         loadFriends: async ()=>{
            let people_list = '';
            let image =[]
            image.push('../images/IMG_0172.JPG');
            image.push('../images/IMG_9913.JPG');
            let i = 0;
            db.collection("login").get()
            .then((data)=>{
                data.forEach((doc)=>{
                    if(doc.data().username!=username)
                  people_list += `<a href='#' style="text-decoration:none" class ='${doc.data().username}' name='${doc.data().username}'  ><div name ='${doc.data().username}' class="available-friends friend-box ">
                        <span name ='${doc.data().username}' class="profile-photo "><img  name ='${doc.data().username}'  class='images' src="${image[i]}"> </span>
                        <span  name ='${doc.data().username}'  class='friend-name ${doc.data().username}' id =${doc.data().username}'>${doc.data().name}</span>
                        <span name ='${doc.data().username}' class="onlineStatus" ><img stlye="margin-left:20px" src="../images/circle-16.png"></span>
                        </div></a> `

                        i++;
                        if(i==2)
                        i= 0;
                })

                $('.friend-list').append(people_list);
            })
        },
        changeFriend : (event)=>
        {
            console.log(event);
        },
        submit: ()=>
        {

                let comment = $('#comment').val();

                let time = chatBox.getTime();
                var dataForMe = { name: 'You' , time: time , comment: comment ,createdAt: firebase.firestore.FieldValue.serverTimestamp()};
                var dataForYou = { name: name , time: time , comment: comment ,createdAt: firebase.firestore.FieldValue.serverTimestamp()};
                chatBox.postData(dataForMe,dataForYou);

                $('#comment').val('');
        }
        ,
        makeStatusFalse:()=>{

            db.collection('liveChatt').doc(friend_name)
            .collection(username).get().then((querySnapshot)=>{

                querySnapshot.forEach((doc)=>{
                    db.collection('liveChatt').doc(friend_name)
                         .collection(username).doc(doc.id).update({"username":username,"live":false,"online":false})
                         .then((data)=>{
                            console.log("Updated")
                         })
                         .catch((error)=>{
                             console.log(`Not Updated `,error)
                         })
                })
            })

           
        },
        makeStatusTrue:()=>{

            db.collection('liveChatt').doc(friend_name)
            .collection(username).get().then((querySnapshot)=>{

                querySnapshot.forEach((doc)=>{
                    db.collection('liveChatt').doc(friend_name)
                         .collection(username).doc(doc.id).update({"username":username,"live":true,"online":false})
                         .then((data)=>{
                            console.log("Updated")
                         })
                         .catch((error)=>{
                             console.log(`Not Updated `,error)
                         })
                })
            })
        },
        changeLiveStatus:()=>{

            db.collection('liveChatt').doc(username)
                         .collection(friend_name).get()
                         .then((querySnapshot)=>{
                             querySnapshot.forEach((doc)=>{
                                console.log("getting status")
                                console.log(doc.data().live)
                                 if(doc.data().live == true)
                                 {
                                     console.log("Check")
                                    $("#liveStatus").html("typing...");
                                 }
                                 else
                                     $("#liveStatus").html("");
                             })
                         })

                         setTimeout(()=>{
                            chatBox.changeLiveStatus();
                        },1000)
        }
    };

    $('#comment').keydown(function(Key){
        
            if($('#comment').val()==""|| (Key.keyCode==8 && $('#comment').val().length==1))    
            {
                chatBox.makeStatusFalse();            
            }
    
            if(Key.keyCode>=32 && Key.keyCode <=126 || Key.keyCode==13) 
            {
                console.log("Key is pressed");
                chatBox.makeStatusTrue();
            }
    });

    chatBox.loadFriends();
    chatBox.loadMyData();
    chatBox.changeLiveStatus(); 
    console.log(username);
    $('#send').click(function(){
        chatBox.submit();
        makeStatusFalse();
    });

    $('#comment').focus();
    chatBox.makeStatusFalse();
    
    $('.friend-list').delegate('.available-friends','click',(event)=>
    {
        friend_name = $(event.target).attr('name');
        console.log(username);
         let chat_name =  $('a.'+friend_name).find($('span.'+friend_name)).html();
         let imageURL =  $('a.'+friend_name).find($('img')).attr('src');
        console.log(chat_name,imageURL);

        $('.chat-photo').find($('img')).attr('src',imageURL);
        $('.chat-name').html(chat_name);
    })

    $('#signOut').click(()=>{
        localStorage.clear();
        window.location.href = 'login.html';
    })

});;