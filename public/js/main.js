$(document).ready(function(){
	$('.delete-article').on('click', function(e){//when this class is clicked we are going to run this functioin
		$target = $(e.target);
		// console.log($target.attr('data-id'));
		const id = $target.attr('data-id'); //a.btn.btn-danger.delete-article(href='#', data-id=article._id) here we gave it an attribute of data-id
		$.ajax({
			type:'DELETE',//this is the type of request we are sending, this is a delete request,
			url: '/articles/'+id, //we are going to need to create this route, in the app.js
			success: function(response){
				alert('Deleting Article');//if it is successfule, we redirect to the home page
				window.location.href='/';
			},
			error: function(err){//if there is an error we want to run this function
				console.log('Error deleting Article'+ err);
			}
		});
	});
});