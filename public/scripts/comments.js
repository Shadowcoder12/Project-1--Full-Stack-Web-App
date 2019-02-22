var $commentsList;
var commentArray = [];

$(document).ready(function(){

  $commentsList = $('#commentTarget');
  $.ajax({
    method: 'GET',
    url: '/api/comments',
    success: successFunc,
    error: serverError
  });

  $('#showComments').on('submit', function(e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/api/comments',
      data: $(this).serialize(),
      success: newComment,
      error: commentError
    });
  });


  $commentsList.on('click', '.delete', function() {
    
    $.ajax({
      method: 'DELETE',
      url: 'api/comments/'+$(this).attr('data-id'),
      success: deleteSuccess,
      error: deleteError
    });
  });


  //once the edit button is clicked, the edit input field will show
  $commentsList.on('click', '.edit', function() {
    $(this).parent().find(".editField").show();

  });

  //once the edit button is hit, it hides the original comment
  $commentsList.on('click', '.editSubmit', function() {
    $(this).parent().hide();
    //the new comment becomes whatver the value of the edit input field is 
    //looks for the input which is the edit field
    let newComment = $(this).parent().find("input").val();
    //replaces new comment with old comment 
    $.ajax({
      method: "PUT",
      //data id is the comment id 
      url: `/api/comments/${ $(this).attr('data-id') }`,
      data: { text: newComment },
      success: (comment) => {
        //ancestors
        $(this).parent().parent().find(".comment-text").html(comment.text);
      }
    })

  })


});

function commentTemplate(comment) {
  //save button and edit input field are hidden until edit button is hit 
  return (`
        <div class = "commentP"
          <p>
            <b>${comment.text}</b> &nbsp
            <span class="editField" style="display: none">
            <input type="text" value="${comment.title}" />
            <button class="editSubmit" data-id="${comment._id}">Save Comment</button>
          </span>
            by ${comment.author}
          </p>
          </div>
          <button class="edit">Edit Comment</button>
          <button type="button" name="button" class="delete" data-id=${comment._id}>Delete Comment</button>

          </div>`)
};

function everyComment(comments) {
  console.log(comments.map(commentTemplate).join(""))
  return comments.map(commentTemplate).join("");
}
// helper function to render all posts to view
// note: we empty and re-render the collection each time our post data changes
function render () {
  
  $commentsList.empty();

  var commentsHtml = everyComment(commentArray);
  
 
  $commentsList.append(commentsHtml);
  
};
function successFunc(json) {
    console.log(json);
    commentArray = json;
  render();
}
function serverError(e) {
  $('#commentTarget').html('Server is not working');
}
function newComment(json) {
  $('#showComments input').val('');
  commentArray.push(json);
  render();
}
function commentError() {
  alert("Couldn't post comment! :(");
}
function deleteSuccess(json) {
  var comment = json;
  console.log(json);
  var commentId = comment._id;
 
  for(var i = 0; i < commentArray.length; i++) {
    if(commentArray[i]._id === commentId) {
      commentArray.splice(i, 1);
      break; 
    }
  }
  render();
}
function deleteError() {
  alert("Couldn't delete comment! :(");
}
