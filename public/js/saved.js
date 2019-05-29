$(document).ready(function () {

    // Responsive hamburger menu
    $(".navbar-burger").on("click", function () {
        $(".navbar-burger").toggleClass("is-active");
        $(".dropdown").toggle();
        $(".dropdown").toggleClass("is-open");
    });

    // Display saved articles on page load
    $.getJSON("/articles", function (data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
            // if article has been marked as saved
            if (data[i].saved === true) {
                // Display the information on the page
                $("#saved-results").append("<div class='saved-div'><p class='saved-text'>" + data[i].title + "<br>" + data[i].description +
                    "</p><a class='unsave-button button is-danger is-medium' data-id='" +
                    data[i]._id + "'>Remove</a><a class='comments-button button info medium' data-id='" + data[i]._id +
                    "'><span class='icon'><i class='fa fa-comments'></i></span>Comments</a></div>");
            }
        }
    });

    // Modal X button closes modal and removes comments
    $(document).on("click", ".delete", function () {
        $(".modal").toggleClass("is-active");
        $("#comments-list").html("<p>Write the first comment for this article.</p>");
    });

    // Removing Saved Articles
    $(document).on("click", ".unsave-button", function () {
        // Get article id
        var articleID = $(this).attr("data-id");
        console.log(articleID);
        // Run a POST request to update the article to be saved
        $.ajax({
            method: "POST",
            url: "/unsave/" + articleID,
            data: {
                saved: false
            }
        });
    });

});