const handleResponse =  (json) =>  { 
    // storing the json to a variable
let categoryData = json;
for (var i =0 ;  i < categoryData.length; i++) {
let category= categoryData[i].category;
let title = categoryData[i].title;
// appending different categories to certain parts of the page
if (category === "Music" ) {
$('.Music').append(`<li> ${title}</li>`); }
if (category === "Sports") {
$('#Sports').append(`<li> ${title}</li>`); }
};
}

const handleError = (xhr, status, errorThrown) => console.log('uh oh');

$(document).ready(function(){

    $.ajax({
    method: 'GET',
    url: '/categories',
    success: handleResponse,
    error: handleError
});
})