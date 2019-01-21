$('.collapsible').collapsible();
    
$('.deleteArticle').on('click',()=>{
    
    var thisId = event.target.getAttribute('data-id');

    $.ajax({
        url: '/delete/'+thisId,
        method:'GET'
    })
    .then(()=>{
        window.location.replace('/');
    })
})

$('.viewNotes').on('click',()=>{

    if($('.forNotes').css('display')!='none'){
        $('.forNotes').hide();
    }else{
        $('.forNotes').show();
    }
})

$('.addNote').on('click',()=>{
    if($('.forAddingNote').css('display')!='none'){
        $('.forAddingNote').hide();
    }else{
        $('.forAddingNote').show();
    }
})

$('.addNewNote').on('click',()=>{
    console.log('adding new one');
    
    let noteListItem=$(event.target).siblings()[0];
    let newNote = $(noteListItem).find('input').val();
    let articleId= $(event.target).attr('data-id');
    // console.log(noteListItem)
    console.log(newNote)
    console.log(articleId)

    $.ajax({
        url:'/addnote/'+articleId+'/'+newNote,
        method:"GET"
    })
    .then(()=>{
        window.location.replace('/');
    })



})

$('.deleteThisNote').on('click',()=>{
    console.log('deleting this');
    var noteListItem = $(event.target).parents()[3];
    let note = $(noteListItem).find('.collapsible-header').text();
    let parentItem= $(event.target).parents()[8];
    let articleId= $(parentItem).attr('id');
    console.log(note);
    console.log(articleId)

    $.ajax({
        url:'/deletenote/'+articleId+'/'+note,
        method:"GET"
    })
    .then(()=>{
        window.location.replace('/');
    })
    
})
