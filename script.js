"use strict"

// დავასელექთოთ დივი api-info

let divWrapperPost = document.getElementById("api-info");

let overlayPost = document.getElementById("overlayPost");
let postContent = document.getElementById("postContent");
let overlayClose= document.getElementById("close");
let addIcon = document.getElementById ("add");
let overlayAdd = document.getElementById ("overlay-add");
let formAdd = document.getElementById ("form-id");

// am funqciis saSualebiT vagzavniT moTxovnas
function ajaxPosts (url, callbackFunction) {
    let requist = new XMLHttpRequest();
    requist.open("get",url); 
    requist.addEventListener ("load", function() {
// console.log(requist.responseText);

// let mosuliInfoText = requist.responseText
// let mosuliInfoJs = JSON.parse(mosuliInfoText)

// შემოკლებული ჩანაწერი
 let data = JSON.parse(requist.responseText);

 callbackFunction(data);


// console.log(mosuliInfoJs);

    });

    requist.send();
}

ajaxPosts( "https://jsonplaceholder.typicode.com/posts", function (data){

//  ელემენტი ხდება თითოეული ობიექტი

data.forEach((element) => {
    createPost(element);
     });

});

// ამ ფუნქციის საშუალებით შევქმნით დივის სტრუქტურას
// item იქნება თითოეული ობიექტი

function createPost (item) {
    // შევქმნათ დივი
    let divElement = document.createElement("div");
    // დავარქვათ კლასის სახელი
    divElement.classList.add("post");

    // pop-up

    // setAttribute მნიშვნელობის მინიჭება

    divElement.setAttribute("data-id", item.id );

    // შევქმნათ h2

    let h2PostId = document.createElement ("h2");

    // გვიანდა რომ ობიექტიდან ამოიღოს იდის მნიშვნელობა value

    h2PostId.textContent = item.id;

    // შემქმნას h3

    let h3POSTtitle = document.createElement ("h3");
    h3POSTtitle.textContent = item.title;

    // თითოეულ ელემენტს რომ ქონდეს წაშლის ღილაკი ამისათვის ვწერთ

    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "delete the post";

    // კონკტერული პოსტი რომ წაიშალოს ამისთვის უნდა დავუწეროთ

    deleteBtn.setAttribute("data-id", item.id);

    // h2 და h3 ჩავაგდოთ დივში

    divElement.appendChild(h2PostId);
    divElement.appendChild(h3POSTtitle);
    divElement.appendChild(deleteBtn);


    divElement.addEventListener("click", function (e) {
        let id = e.currentTarget.getAttribute("data-id");
        
        let urlNewLink = `https://jsonplaceholder.typicode.com/posts/${id}`;

    
        ajaxPosts(urlNewLink,function(info){
            // console.log(info);
            overlayFnc(info);

        })   
        
        console.log("data-id-value",id);

        overlayPost.classList.add("activePost");   

        // დაჭერის დროს რომ გამოჩნდეს დივი overlay-post
        // open overlay
        
    });


    // წაშლის ღილაკი

    deleteBtn.addEventListener("click", function(event){
        event.stopImmediatePropagation();
        // stopImmediatePropagation როცა დავაჭერთ ამ ღილაკს არ უნდა წავიდეს მშობელზე, უნდა წაიშოლ ის კონკრეტული პოსტი

let deleteBtnId  = event.target.getAttribute("data-id");
console.log("წაშლის ღილაკის აიდის მნიშვნელობა",deleteBtnId);

// /წაშლაზე დაჭერის დროს მთლიანი დივი რომ წაიშალოს უნდა ჩავწეროთ>>

fetch(`https://jsonplaceholder.typicode.com/posts/${deleteBtnId}`,{
    method:"DELETE",
}).then(() => divElement.remove());
    });

// htmlში არ უნდა გვქონდეს დივი არ უნდა ჩანდეს, ამიტომ დასელექტებული დივი უნდა ჩავწეროთ

divWrapperPost .appendChild(divElement);

// console.log(divElement);

}

// ფუნქციის საშუალებით დავხატოთ მოსული ინფო, ტეტალური პოსტის აღწერა

function overlayFnc (item) {
    let p = document.createElement ("p");
    p.textContent = item.body;

    postContent.appendChild(p);
}

// close ovelay

overlayClose.addEventListener("click", function() {
    overlayPost.classList.remove("activePost");

    // pop up როცა გამოჩნდება შეიდა ტექსტი რომ არ განმეორდეს უნდა დავუწეროთ

    postContent.innerHTML = " ";
})

// პოსტის დამატება

addIcon.addEventListener("click", function(){
    overlayAdd.classList.add("overlayAddActive")
});

formAdd.addEventListener("submit", function(e) {
e.preventDefault(); 
// preventDefault დავწერეთ რომ გვერდი არ დარეფრეშდეს


let postNewObj ={
    title: e.target[0].value
}
fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(postNewObj),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((x) => {
      overlayAdd.classList.remove("overlayAddActive");
      createPost(x);
    });
});
