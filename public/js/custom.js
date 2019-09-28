
$(document).ready(function () {

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
    
    var storage = firebase.storage().ref();
    var db = firebase.firestore();

    let username = localStorage.getItem('username');
    let name = localStorage.getItem('name');
    let  friend_name = 'shoukatali488';

    var chatBox={
        alreadyMarkedFriends :[],
        loadMyData: ()=>{

            let string= '';

            db.collection("users").doc(username)
                .collection(friend_name).get().then((querySnapshot) => {
             querySnapshot.forEach((doc) => {
                 

            if(doc.data().name =='You')
            string += `<div class=" chat self"> <span class="name" >You</span><br>`;
            else
            string += `<div class=" chat friend"> <span class="name" >${doc.data().name}</span><br>`;


            string += `<span class="time ">${doc.data().time} </span>`;
            string += `<br><span class="comment">${doc.data().comment} </span></div>`;
            
            // unsortedData.push({ time:  doc.data().createdAt , htmlTag:  string}) ;


            });

            // sortedData = chatBox.sortConversation(unsortedData); 
            $('#chatBox').html(string);

            });

            setTimeout(()=>{
                chatBox.loadMyData();
            },1000);
                      
    

        },

        sortConversation: function(unsortedData) {
            // let tempData = [];
            
            // for( let i = 0 ; i < unsortedData.length ; i ++)
            // {

            //     for( let j = 1 ; j < unsortedData.length - 1 ; j ++)
            //     {

            //         let obj1 = unsortedData[i].createdAt;
            //         let obj2 = unsortedData[j].createdAt;

            //         if(obj1 > obj2)

            //     }

            // }
        },

        postData: (dataForMe,dataForYou)=>
        {
            db.collection("users").doc(username)
                .collection(friend_name).add(dataForMe)
                .then( () =>{
                    console.log("2")
                })
            db.collection("users").doc(friend_name)
                .collection(username).add(dataForYou)
                .then( () =>{
                    console.log("3")
                })
        },

        getTime: ()=> {
            let DateAndTime = new Date();
            let month = DateAndTime.getMonth();
            let day = DateAndTime.getDate();
            let hrs = DateAndTime.getHours();
            let year= DateAndTime.getFullYear();
            let type;
            if(hrs>12)
                type  ="pm";
            else
                type = "am"
            if(hrs==0)
                hrs = 12;
            else if (hrs>12)
            hrs -= 12;

            let  mint = DateAndTime.getMinutes();

            if((hrs<10 && hrs >=0 ) && (mint<10 && mint >=0))
            return(`0${hrs}:0${mint} ${type} | ${day}-${month}-${year}`);
            else if(hrs<10 && hrs >=0)
            return(`0${hrs}:${mint} ${type} | ${day}-${month}-${year}`);            
            else if(mint<10 && mint >=0)
            return(`${hrs}:0${mint} ${type} | ${day}-${month}-${year}`); 
                                 
        },
         loadFriends: async ()=>{
            let loadLoggers = await db.collection("login").get()
            .then(async (data)=>{
                data.forEach(async(doc)=>{
                    if(doc.data().username!=username)
                    {
                        // console.log(doc.data().username)
                        let loadImage = await storage.child(`profile-images/${doc.data().username}`).listAll()
                        .then(async(result)=>{
                             result.items.forEach(async(image)=>{
                                image.getDownloadURL().then(async(url)=>{
                                     
                                    chatBox.appendHTML(doc,url)
                            })   
                             
                        })

                    })
                }
            })
             
            })
            setTimeout(()=>{
                chatBox.loadFriends();
            },1000)
        },
        appendHTML: async (doc,url) =>{
            let people_list = '';
            let onlineUsers = await  db.collection('onlineUsers').get()
            .then(async(querySnapshot)=>{
                querySnapshot.forEach((Doc)=>{

                    if(doc.data().username === Doc.data().username && chatBox.alreadyMarkedFriends.indexOf(doc.data().username)==-1)
                    {

                    chatBox.alreadyMarkedFriends.push(Doc.data().username) 
                    if(Doc.data().online == true)
                    people_list = `<a href='#' style="text-decoration:none" class ='${doc.data().username}' name='${doc.data().username}'  ><div name ='${doc.data().username}' class="available-friends friend-box ">
                    <span name ='${doc.data().username}' class="profile-photo "><img  name ='${doc.data().username}'  class='images' src="${url}"> </span>
                    <span  name ='${doc.data().username}'  class='friend-name ${doc.data().username}' id =${doc.data().username}'>${doc.data().name}</span>
                    <span name ='${doc.data().username}' class="onlineStatus" ><img stlye="margin-left:20px" src="../images/circle-16.png"></span>
                    </div></a> `;
                    else
                    {
                    people_list = `<a href='#' style="text-decoration:none" class ='${doc.data().username}' name='${doc.data().username}'  ><div name ='${doc.data().username}' class="available-friends friend-box ">
                    <span name ='${doc.data().username}' class="profile-photo "><img  name ='${doc.data().username}'  class='images' src="${url}"> </span>
                    <span  name ='${doc.data().username}'  class='friend-name ${doc.data().username}' id =${doc.data().username}'>${doc.data().name}</span>
                    <span name ='${doc.data().username}' class="onlineStatus" style=""display: none ><img stlye="margin-left:20px" src="../images/circle-16.png"></span>
                    </div></a> `;
                    }
                    $('.friend-list').append(people_list);                
                    }

                    if(doc.data().username === Doc.data().username && chatBox.alreadyMarkedFriends.indexOf(doc.data().username)!=-1)
                    {
                        if(Doc.data().online == true)
                        $('a.'+doc.data().username).find($('.onlineStatus')).css("display","inline");

                        if(Doc.data().online == false)
                        $('a.'+doc.data().username).find($('.onlineStatus')).css("display","none");                        
                    }

                })
            })
        },
        submit: ()=>
        {

                let comment = $('#comment').val();
                let time = chatBox.getTime();
                var dataForMe = { name: 'You' , time: time , comment: comment ,createdAt: firebase.firestore.FieldValue.serverTimestamp()};
                var dataForYou = { name: name , time: time , comment: comment ,createdAt: firebase.firestore.FieldValue.serverTimestamp()};
                console.log("1");
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
                         })
                         .catch((error)=>{
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
                         })
                         .catch((error)=>{
                         })
                })
            })
        },
        changeLiveStatus:()=>{

            db.collection('liveChatt').doc(username)
                         .collection(friend_name).get()
                         .then((querySnapshot)=>{
                             querySnapshot.forEach((doc)=>{
                                 if(doc.data().live == true)
                                 {
                                    $("#liveStatus").html("typing...");
                                 }
                                 else
                                     $("#liveStatus").html("");
                             })
                         })

                         setTimeout(()=>{
                            chatBox.changeLiveStatus();
                        },1000)
        },
        makeMeOnline:()=>{
            db.collection('onlineUsers').get()
            .then( (querySnapshot)=>{
                querySnapshot.forEach( (doc) =>{

                    if( doc.data().username === username )
                    {
                        db.collection('onlineUsers').doc(doc.id).update({"online":true});
                    }
                })
            })
        },
        makeMeOffline:()=>{
            db.collection('onlineUsers').get()
            .then( (querySnapshot)=>{
                querySnapshot.forEach( (doc) =>{

                    if( doc.data().username === username )
                    {
                        db.collection('onlineUsers').doc(doc.id).update({"online":false});
                    }
                })
            })
        },
        hideBox:()=>{
            $('.chat-container').css("display","none");            
        },
        showBox:()=>{

            $('.chat-container').css("display","inline");
            $('.initalMessage').css("display","none");
        }
    };

    $('#comment').keydown(function(Key){
        
            if($('#comment').val()==""|| (Key.keyCode==8 && $('#comment').val().length==1))    
            {
                chatBox.makeStatusFalse();            
            }
    
            if(Key.keyCode>=32 && Key.keyCode <=126 || Key.keyCode==13) 
            {
                chatBox.makeStatusTrue();
            }

            if($('#comment').val()!=="" && Key.keyCode==13)
            {
                chatBox.submit();
            }
    });


    chatBox.hideBox();
    chatBox.makeMeOnline();
    chatBox.loadFriends();
    chatBox.loadMyData();
    chatBox.changeLiveStatus();


    $('.chat-form').delegate('#send','click',()=>{
       
        chatBox.submit();
        alert()
        makeStatusFalse();
        console.log("sent");
    })
    
    chatBox.makeStatusFalse();
    
    $('.friend-list').delegate('.available-friends','click',(event)=>
    {

        $('#comment').focus();
        friend_name = $(event.target).attr('name');
         let chat_name =  $('a.'+friend_name).find($('span.'+friend_name)).html();
         let imageURL =  $('a.'+friend_name).find($('img')).attr('src');

        $('.chat-photo').find($('img')).attr('src',imageURL);
        $('.chat-name').html(chat_name);
        chatBox.showBox();

    })
    $('#signOut').click(()=>{
        localStorage.clear();
        chatBox.makeMeOffline();
        window.location.href = 'login.html';
    })

});;