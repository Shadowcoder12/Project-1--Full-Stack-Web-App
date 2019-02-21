var $commentsList;
var commentArray = [];

$(document).ready(function(){

  $commentsList = $('#commentTarget');
  $.ajax({
    method: 'GET',
    url: '/api/comments',
    success: handlesSuccess,
    error: handlesError
  });

  $('#commentForm').on('submit', function(e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/api/comments',
      data: $(this).serialize(),
      success: newCommentSuccess,
      error: newCommentError
    });
  });


});

function getCommentHtml(comment) {
  return `
        <div class = "commentP"
          <p>
            <b>${comment.text}</b> &nbsp
            by ${comment.author}
          </p></div>`;
    
}



// line 82 
//             <button type="button" name="button" class="deleteBtn btn btn-danger pull-right" data-id=${comment._id}>Delete</button>



function getAllCommentsHtml(comments) {
  console.log(comments.map(getCommentHtml).join(""))
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

function handlesSuccess(json) {
    alert("handlesSuccess");
    console.log(json);
    commentArray = json;
  render();
}

function handlesError(e) {
  $('#commentTarget').html('Server is not working');
}

function newCommentSuccess(json) {
  $('#commentForm input').val('');
  commentArray.push(json);
  render();
}

function newCommentError() {
  console.log('newbook error!');
}