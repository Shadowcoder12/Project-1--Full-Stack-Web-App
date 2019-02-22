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


  $commentsList.on('click', '.deleteBtn', function() {
    
    $.ajax({
      method: 'DELETE',
      url: 'api/comments/'+$(this).attr('data-id'),
      success: deleteCommentSuccess,
      error: deleteCommentError
    });
  });


  $commentsList.on('click', '.edit-book-button', function() {
    console.log('clicked edit button');
    $(this).parent().find(".edit-input").show();

  });

  $commentsList.on('click', '.edit-book-submit-button', function() {
    $(this).parent().hide();
    let newComment = $(this).parent().find("input").val();
    $.ajax({
      method: "PUT",
      url: `/api/comments/${ $(this).attr('data-id') }`,
      data: { text: newComment },
      success: (comment) => {
        $(this).parent().parent().find(".comment-text").html(comment.text);
      }
    })

  })


});

function getCommentHtml(comment) {
  return `
        <div class = "commentP"

          <p>
            <b>${comment.text}</b> &nbsp
            <span class="edit-input" style="display: none">
            <input type="text" value="${comment.title}" />
            <button class="edit-book-submit-button" data-id="${comment._id}">Save</button>
          </span>
            by ${comment.author}
          </p>
          <button class="edit-book-button">Edit</button>
          <button type="button" name="button" class="deleteBtn btn btn-danger pull-right" data-id=${comment._id}>Delete</button>


          </div>`;
    
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
  console.log('newComment error!');
}

function deleteCommentSuccess(json) {
  var comment = json;
  console.log(json);
  var commentId = comment._id;
  console.log('delete book', commentId);
  // find the book with the correct ID and remove it from our allBooks array
  for(var index = 0; index < commentArray.length; index++) {
    if(commentArray[index]._id === commentId) {
      commentArray.splice(index, 1);
      break;  // we found our book - no reason to keep searching (this is why we didn't use forEach)
    }
  }
  render();
}

function deleteCommentError() {
  console.log('deleteComment error!');
}