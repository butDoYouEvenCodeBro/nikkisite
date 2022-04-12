// Get the modal
var modal = document.getElementById("myModal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById("myImg");
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
img.onclick = function () {
  modal.style.display = "block";
  modalImg.src = this.src;
  captionText.innerHTML = this.alt;
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal

var client = {
  init: function () {
    var o = this;

    // this will disable dragging of all images
    $("img").mousedown(function (e) {
      e.preventDefault()
    });

    // this will disable right-click on all images
    $("body").on("contextmenu", function (e) {
      return false;
    });
  }
};

$(document).ready(function() {
  $(document).bind("contextmenu",function(e) {
    
     return false;
  });
}); 