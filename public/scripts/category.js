//get the browsers url
let urlLocation = window.location.pathname.split("/");

//split it into string and point at the last index (will be music or sports etc.)
let pageCategory = urlLocation[urlLocation.length -1].toString();
// go in and capitalize first letter of the category for the h1
let firstLetterUppercase = pageCategory.charAt(0).toUpperCase() + pageCategory.slice(1);

// $('.category-header').innerText('text')
$('.category-header').text(`${firstLetterUppercase} Posts`)

const handleResponse =  (json) =>  { 
    // storing the json to a variable
// let musicData = json;


console.log(json)
    for (var i =0 ;  i < json.length; i++) {
        let category= json[i].category.toLowerCase();
        let title = json[i].title;
        let imageSrc = json[i].image;
        let date = json[i].date;
        let text = json[i].text;
        let postId = json[i]._id;
        // appending different categories to certain parts of the page

        // will need to add an Author string to the model
        if (category === pageCategory) {
            $('.posts-list').append(`
                <div class="post-preview">
                    <h2 class="header">${title}</h2>
                    <h3>Created By: Author</h3>
                    <p>${date}</p> 
                    <img src= '${imageSrc}'>
                    <a href="/categories/${postId}">View Post</a>
                </div>`); 
        }


    }
}




const handleError = (xhr, status, errorThrown) => console.log('Error!');

$(document).ready(function(){
    $.ajax({
    method: 'GET',
    url: '/api/categories/',
    success: handleResponse,
    error: handleError
});
})