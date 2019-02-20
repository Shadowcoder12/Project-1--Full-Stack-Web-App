//set the browsers url to this variable.. split it into an array at the /'s
let urlLocation = window.location.pathname.split("/");
console.log(urlLocation);
//split it into string and point at the last index (will be music or sports etc.)
let postId = urlLocation[urlLocation.length -1].toString();
if(postId == "") {
    postId = urlLocation[urlLocation.length -2].toString();
}
console.log(postId);

//dynamically set href of delete link based on psot id
$('#deleteLink').attr('href', `/api/categories/${postId}/delete`);
$('#editLink').attr('href', `/categories/${postId}/edit`)
//This will return a single json object
const handleResponse = (json) =>  {
//set title h1     
$('h1').text(`${json.title}`)
//set image
$('#post-image').attr('src', `${json.image}`)
//set paragraph text
$('#body-text').text(`${json.text}`)
//set comments 
$('.userComment').text(`${json.commentArray}`)
console.log(json);
}

//this is the ajax error function... if theres a problem itll remove all the html and put in a p tag saying to try again
const handleError = (xhr, status, errorThrown) => {
    $('body').html('<p>Something went wrong... go back and try again.</p><p><a href="/categories">Go to categories</a></p>')
}

$(document).ready(function(){
    $.ajax({
    method: 'GET',
    url: `/api/categories/${postId}`,
    success: handleResponse,
    error: handleError
});
})