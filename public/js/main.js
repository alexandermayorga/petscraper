$(document).ready(function () {

    var pagination = new Pagination("petPagination");
    pagination.draw();

})


function Pagination (id) {
    this.id = id,
    this.itemsCount = $("#"+id).data('items-count'),
    this.currentPage = $("#"+id).data('current-page'),
    this.pageSize = $("#"+id).data('page-size'),
    this.maxPageSize = 7,
    this.getTotalPages = function () {
        var totalPages = Math.ceil(this.itemsCount / this.pageSize);
        return totalPages;
    },
    this.draw = function () {
        var html = "";

        html += this.getPrevHTML();
        html += this.getPagesHTML();
        html += this.getNextHTML();

        $("#" + this.id + "").html(html);
    },
    this.getPagesHTML = function (){
        var html = "";
        var start; 
        if (this.maxPageSize > this.getTotalPages()){
            //Reset maxPageSize
            this.maxPageSize = this.getTotalPages();
        }
        var range = Math.floor(this.maxPageSize/2);

        if (0 < this.currentPage - range && this.currentPage + range <= this.getTotalPages() ){
            start = this.currentPage - range;
        }
        else if (this.currentPage - range < 1){
            start = 1;
        }
        else if (this.currentPage + range >= this.getTotalPages()){
            start = (this.getTotalPages() - this.maxPageSize) + 1;
        }

        for (var i = 0; i < this.maxPageSize; i++) {
            html += '<li class="page-item ';
            html += start == this.currentPage ? "active":"";
            html +='"><a class="page-link" href="/' +
                start
                + '">' +
                start
                + '</a></li>';
            start++;
        }
        return html;
    },
    this.getPrevHTML = function () {
        var disabled = this.currentPage == 1 ? 'disabled' : '';
        var html =
            '<li class="page-item ' + disabled + '">' +
            '<a class="page-link" href="/' + (this.currentPage - 1) + '" aria-label="Previous">' +
            '<span aria-hidden="true">Prev</span>' +
            '<span class="sr-only">Previous</span>' +
            '</a>' +
            '</li>';
        return html;
    },
    this.getNextHTML = function () {
        var disabled = this.currentPage == this.getTotalPages() ? 'disabled' : '';
        var html =
            '<li class="page-item ' + disabled + '">' +
            '<a class="page-link" href="' + (this.currentPage + 1) + '" aria-label="Next">' +
            '<span aria-hidden="true">Next</span>' +
            '<span class="sr-only">Next</span>' +
            '</a>' +
            '</li> ';
        return html;
    }

}