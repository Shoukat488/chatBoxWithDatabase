
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
    let  friend_name = 'm_awatif';

    var chatBox={

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

            });
            $('#chatBox').html(string);

            });

            setTimeout(()=>{
                chatBox.loadMyData();
            },1000);
                      
    

        },
        postData: (dataForMe,dataForYou)=>
        {
            db.collection("users").doc(username)
                .collection(friend_name).add(dataForMe);
            
            db.collection("users").doc(friend_name)
                .collection(username).add(dataForYou);
        },
        getTime: ()=> {
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
            db.collection("login").get()
            .then((data)=>{
                data.forEach(async(doc)=>{
                    if(doc.data().username!=username)
                    {
                        let load = await storage.child(`profile-images/${doc.data().username}`).listAll()
                        .then(async(result)=>{
                             result.items.forEach(async(image)=>{
                                image.getDownloadURL().then(async(url)=>{

                                    db.collection('onlineUsers').get()
                                    .then(async(querySnapshot)=>{
                                        querySnapshot.forEach((Doc)=>{
                                            if(doc.data().username == Doc.id)
                                            {
                                            if(Doc.data().online == true)
                                            people_list = `<a href='#' style="text-decoration:none" class ='${doc.data().username}' name='${doc.data().username}'  ><div name ='${doc.data().username}' class="available-friends friend-box ">
                                            <span name ='${doc.data().username}' class="profile-photo "><img  name ='${doc.data().username}'  class='images' src="${url}"> </span>
                                            <span  name ='${doc.data().username}'  class='friend-name ${doc.data().username}' id =${doc.data().username}'>${doc.data().name}</span>
                                            <span name ='${doc.data().username}' class="onlineStatus" ><img stlye="margin-left:20px" src="../images/circle-16.png"></span>
                                            </div></a> `;
                                            else
                                            people_list = `<a href='#' style="text-decoration:none" class ='${doc.data().username}' name='${doc.data().username}'  ><div name ='${doc.data().username}' class="available-friends friend-box ">
                                            <span name ='${doc.data().username}' class="profile-photo "><img  name ='${doc.data().username}'  class='images' src="${url}"> </span>
                                            <span  name ='${doc.data().username}'  class='friend-name ${doc.data().username}' id =${doc.data().username}'>${doc.data().name}</span>
                                            </div></a> `;

                                            $('.friend-list').html(people_list);                
                                            $('.friend-list').html(people_list);    
                                            }
                                        })
                                    })
                                    
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
        appendHTML: ()=>{

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
            db.collection('onlineUsers').doc(username).update({"online":true});
        },
        makeMeOffline:()=>{
            db.collection('onlineUsers').doc(username).update({"online":false});
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
    });
    chatBox.hideBox();
    chatBox.makeMeOnline();
    chatBox.loadFriends();
    chatBox.loadMyData();
    chatBox.changeLiveStatus();
    $('.chat-form').delegate('.send','click',()=>{
        chatBox.submit();
        makeStatusFalse();
        console.log("sent");
    })
    
    chatBox.makeStatusFalse();
    
    $('.friend-list').delegate('.available-friends','click',(event)=>
    {
        chatBox.showBox();
        $('#comment').focus();
        friend_name = $(event.target).attr('name');
         let chat_name =  $('a.'+friend_name).find($('span.'+friend_name)).html();
         let imageURL =  $('a.'+friend_name).find($('img')).attr('src');

        $('.chat-photo').find($('img')).attr('src',imageURL);
        $('.chat-name').html(chat_name);

    })
    $('#signOut').click(()=>{
        localStorage.clear();
        chatBox.makeMeOffline();
        window.location.href = 'login.html';
    })

});;