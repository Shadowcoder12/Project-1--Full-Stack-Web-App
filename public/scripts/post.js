
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
}







//this is the ajax error function... if theres a problem itll remove all the html and put in a p tag saying to try again
const handleError = (xhr, status, errorThrown) => {
    $('body').html('<p>Something went wrong... go back and try again.</p><p><a href="/categories">Go to categories</a></p>')
}


var $commentList;
var commentArray = [];

function handlesSuccess(json) {
    commentArray = json;
    render();
  }
  
  function handlesError(e) {
    console.log('uh oh');
    $('#userComment').html('Failed to load books, is the server working?');
  }
  
  function newCommentSuccess(json) {
    $('#commentForm input').val('');
    commentArray.push(json);
    render();
  }
  
  function newCommentError() {
    console.log('newbook error!');
  }
  
  
  function getCommentsHtml(comment) {
    return `<hr>
            <p>
              <b>${comment.text}</b>
              by ${comment.author}
            </p>`;
  }
  
  
  function getAllCommentsHtml(comments) {
    return comments.map(getCommentsHtml).join("");
  }
  
  
  function render () {
    $commentList.empty();
  }
  
  
  var commentsHtml = getAllCommentsHtml(commentArray);
 
$(document).ready(function(){
    $.ajax({
    method: 'GET',
    url: `/api/categories/${postId}`,
    success: handleResponse,
    error: handleError
});

//comments


  $commentList = $('.userComment');
  $.ajax({
    method: 'GET',
    url: '/api/categories/:id',
    success: handlesSuccess,
    error: handlesError
  });

  $('#commentForm').on('submit', function(e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/api/categories/:id',
      data: $(this).serialize(),
      success: newCommentSuccess,
      error: newCommentError
    });
  });





$commentList.append(commentsHtml);

/////




})