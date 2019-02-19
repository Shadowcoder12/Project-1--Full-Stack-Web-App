
const handleResponse =  (json) =>  { 
    // storing the json to a variable
let musicData = json;
for (var i =0 ;  i < musicData.length; i++) {
let category= musicData[i].category;
let title = musicData[i].title;
let imageSrc = musicData[i].image;
let date = musicData[i].date;
let text = musicData[i].text;
// appending different categories to certain parts of the page
if (category === "Music") {
$('.Music').append(`<li class="header"> ${title}</li> <li> ${date} </li> <li> <img src= '${imageSrc}'> </li><li>
${text} </li>`); }
};
}

const handleError = (xhr, status, errorThrown) => console.log('Error!');


$(document).ready(function(){
    $.ajax({
    method: 'GET',
    url: '/categories/',
    success: handleResponse,
    error: handleError
});
})