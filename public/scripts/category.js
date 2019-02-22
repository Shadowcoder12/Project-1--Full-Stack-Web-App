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
        let author = json[i].author;
        // let text = json[i].text;
        let postId = json[i]._id;

        let convertedDate = new Date(Number(date));

        // appending different categories to certain parts of the page

        if (category === pageCategory) {
            $('.posts-list').append(`
                <div class="col sm12 m4">
                    <div class="card cyan darken-3 hoverable">
                        <div class="card-image">
                            <img src='${imageSrc}'>
                            <span class="card-title">${title}</span>
                        </div>
                        <div class="card-content">
                            <h5>Created By: ${author}</h5>
                            <h6>Created On: ${convertedDate}</h6> 
                        </div>
                        <div class="card-action">
                            <a href="/categories/${postId}">View Post</a>
                        </div>
                    </div>
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