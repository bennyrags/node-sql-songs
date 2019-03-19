$(document).ready(readyFunction);

function readyFunction() {
    console.log('jQ and jS workin');
    getAllSongs();
    $("#submitSong").on('click', addSong);

}

function addSong(event) {
event.preventDefault();
let newSong = {
  track: $("#in-track").val(),
  artist: $("#in-artist").val(),
    rank: $("#in-rank").val(),
    published: $("#in-published").val()
}
console.log('heres new song obj in addsong click', newSong);

$.ajax({
    method: 'POST',
    url: '/songs',
    data: newSong
})
.then(function(response){

getAllSongs();
$("#in-track").val(''),
$("#in-artist").val(''),
$("#in-rank").val(''),
                $("#in-published").val('')
})
.catch(function(error){
    alert('Unable to add song, here is the error,', error);
})

}

function getAllSongs () {
    $.ajax({
        method:'GET',
        url: '/songs'
    }).then(function(response) {
        let songs = response;
        console.log('heres the response', response);
        renderSongs(songs);
    }).catch(function(error){
        console.log('Could\'t Get Songs, here\'s the error,', error );
        alert('Couldn\'t Get Songs, Heres the Error:', error);

    })
    
}

function renderSongs(songs) {
    let el = $("#tbl-songs");
    el.empty();
    for (song of songs) {
        let publishedDate = new Date(song.published);
        let $tr = `<tr>
        <td>${song.track}</td>
        <td>${song.artist}</td>
        <td>${song.rank}</td>
        <td>${publishedDate.toLocaleDateString()}</td>
        </tr>`;
    el.append($tr);
    }    
    
}