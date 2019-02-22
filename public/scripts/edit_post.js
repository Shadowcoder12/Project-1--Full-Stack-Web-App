//set the browsers url to this variable.. split it into an array at the /'s
let urlLocation = window.location.pathname.split("/");
console.log(urlLocation);
//split it into string and point at the last index (will be music or sports etc.)
let postId = urlLocation[urlLocation.length - 2].toString();
//if the url contained an extra '/' at the end of the url, postId will be 'edit'
if(postId == "edit") {
    //if thats the case then go one extra index over to get the id
    postId = urlLocation[urlLocation.length - 3].toString();
}

let getString = `/api/categories/${postId}`;

//first, get the previous posts data and inject it into the form
$.get(getString, function(data){
    $('input[name="title"]').val(data.title);
    $('input[name="category"]').val(data.category);
    $('input[name="image"]').val(data.image);
    $('#postText').val(data.text);
});

//below is the string we will post to
let putString = `/categories/${postId}`;

//dynamically change the 'back to post' link based on id
$('a').attr('href', putString);

function submitEditPost(e){
        let data = {
        title: $('input[name="title"]').val(),
        category: $('input[name="category"]').val(),
        image: $('input[name="image"]').val(),
        text: $('#postText').val()
    }
    $.ajax({
        method: 'PUT',
        url: putString,
        data: data,
        success: ()=>{
            console.log(data);
        }
    });
}