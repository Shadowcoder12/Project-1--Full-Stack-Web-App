
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

$(document).ready(function(){
    $.ajax({
    method: 'GET',
    url: `/api/categories/${postId}`,
    success: handleResponse,
    error: handleError
});

})


//comments

var $commentsList;
var commentArray = [];

$(document).ready(function(){

  $commentsList = $('#commentTarget');
  $.ajax({
    method: 'GET',
    url: '/api/books',
    success: handleSuccess,
    error: handleError
  });

  $('#commentForm').on('submit', function(e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/api/books',
      data: $(this).serialize(),
      success: newCommentSuccess,
      error: newCommentError
    });
  });


});

function getCommentHtml(comment) {
  return `<hr>
          <p>
            <b>${comment.text}</b>
            by ${comment.author}
            <button type="button" name="button" class="deleteBtn btn btn-danger pull-right" data-id=${comment._id}>Delete</button>
          </p>`;
}

function getAllCommentsHtml(comments) {
  return comments.map(getCommentHtml).join("");
}

// helper function to render all posts to view
// note: we empty and re-render the collection each time our post data changes
function render () {
  // empty existing posts from view
  $commentsList.empty();

  // pass `allBooks` into the template function
  var commentsHtml = getAllCommentsHtml(commentArray);

  // append html to the view
  $commentsList.append(commentsHtml);
};

function handleSuccess(json) {
  commentArray = json;
  render();
}

function handleError(e) {
  console.log('uh oh');
  $('#commentTarget').text('Failed to load books, is the server working?');
}

function newCommentSuccess(json) {
  $('#commentForm input').val('');
  commentArray.push(json);
  render();
}

function newCommentError() {
  console.log('newbook error!');
}
