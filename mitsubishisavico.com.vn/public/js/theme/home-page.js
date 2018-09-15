$(function () {
   var isMobile = false;
   if ((/Mobile|Android|webOS|iP(hone|ad|od)|BlackBerry|IEMobile|Opera M(ob|in)i|Windows Phone/i.test(navigator.userAgent)))
      isMobile = true;

   if (!isMobile) {
      $('.home-about-block .detail').enscroll();
   }
   
   $('.slick-single-item').slick({
      dots: true,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      autoplay: true,
      autoplaySpeed: 4000
   });
});
