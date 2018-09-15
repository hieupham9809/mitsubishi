function height() {
   var width = $(window).width();
   $('[data-same-height]').each(function () {
      var element = $(this).data('same-height');
      $(this).find(element).each(function () {
         $(this).css({
            height: 'auto'
         });
      });
   });

   if (width > 767) {
      $('[data-same-height]').each(function () {
         var maxHeight = 1;
         var endHeight = 0;
         var element = $(this).data('same-height');
         $(this).find(element).each(function () {
            var h = $(this).height();
            if (maxHeight < h)
               maxHeight = h;
         });
         $(this).find(element).each(function () {
            $(this).height(maxHeight);
         });
      });
   }
}
$(document).ready(height);
$(window).resize(function () {
   height();
});