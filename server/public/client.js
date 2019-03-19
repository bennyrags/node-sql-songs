$(document).ready(readyFunction);

function readyFunction() {
    console.log('jQ and jS workin');
    getAllSongs();
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
        let $tr = `<tr>
        <td>${song.track}</td>
        <td>${song.artist}</td>
        <td>${song.rank}</td>
        <td>${song.published}</td>
        </tr>`;
    el.append($tr);
    }    
    
}