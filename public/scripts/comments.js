var $commentsList;
var commentArray = [];

$(document).ready(function(){

  $commentsList = $('#commentArea');
  
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
          </span> by ${comment.author}
          </p>
          </div>
          <button class="edit">Edit Comment</button>
          <button type="button" name="button" class="delete" data-id=${comment._id}>Delete Comment</button>

          </div>`)
};

//comments = commentArray 

function everyComment(comments) {
  //taking comment array and passing it through the comment template 
  //returns new array that has the comments joined 
  return comments.map(commentTemplate).join("");
}
//renders the posts 
function render () {
  
  $commentsList.empty();
  //calling the everyComment function
  var commentsHtml = everyComment(commentArray);
  
 //the html gets appended to the comment area
  $commentsList.append(commentsHtml);
  
};
function successFunc(json) {
  //posts comment array to the commentArea
    commentArray = json;
    //renders posts if successfull 
  render();
}

function serverError(e) {
  $('#commentArea').html('Nothing in server :(');
}

//gets value (text) of input and pushes it into the array 
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
  var commentId = comment._id;
 //changing the contents of the array 
  for(var i = 0; i < commentArray.length; i++) {
    if(commentArray[i]._id === commentId) {
      commentArray.splice(i, 1);
      break; 
    }
  }
  //rendering newly spliced array 
  render();
}
function deleteError() {
  alert("Couldn't delete comment! :(");
}
