var lastScrollTop = 0;
var didScroll;
var delta = 5;
var productMenuHeight = 0;
var imgArray = [];

var specsObj = {};
specsObj.scroll = false;
specsObj.rowTop = 0;

function productInit() {
    hasScrolled();
    $(function () {
        $('#product_specs').on('modalShow', function () {
            var row = $('#product_specs .row:eq(0)');
            specsObj.rowTop = row.position().top;
			console.log(specsObj.rowTop);
        });
		$('#product_specs').on('shown.bs.modal', function () {
            var row = $('#product_specs .row:eq(0)');
            specsObj.rowTop = row.position().top;
			console.log(specsObj.rowTop);
        });
        $('#product_specs').scroll(function () {
			if (specsObj.rowTop == 0) {
				specsObj.rowTop = $('#product_specs .row:eq(0)').position().top;
			}

            var modal = $(this);
            var row = modal.find('.row:eq(0)');

            var scrollModal = modal.scrollTop();
            var headerScroll = row.find('.steps-header');
            if (scrollModal > specsObj.rowTop) {
                specsObj.scroll = true;
                if (!headerScroll.hasClass('scroll')) headerScroll.addClass('scroll');
                TweenLite.to(headerScroll, 0, { y: scrollModal - specsObj.rowTop });
            } else {
                if (specsObj.scroll) {
                    specsObj.scroll = false;
                    if (headerScroll.hasClass('scroll')) headerScroll.removeClass('scroll');
                    TweenLite.to(headerScroll, 0, { y: 0 });
                }
            }
        })

        var product = $('.page-product');

        $('.slide-dacdiemnoibat').slick({
            infinite: false,
            slidesToShow: 3,
            arrows: false,
            speed: 300,
            useTransform: true,
            responsive: [
              {
                  breakpoint: 992,
                  settings: {
                      centerMode: true,
                      centerPadding: '100px',
                      slidesToShow: 2,
                      initialSlide: 2
                  }
              },
              {
                  breakpoint: 480,
                  settings: {
                      centerMode: true,
                      centerPadding: '60px',
                      speed: 300,
                      slidesToShow: 1
                  }
              }
            ]
        });

        var phukienItems = $('.list-phukien').find('.photo-item');
        var phukienRows = 3;
        if (phukienItems.length <= 3) {
            phukienRows = 1;
        } else if (phukienItems.length <= 6) {
            phukienRows = 2;
        } else {
            phukienRows = 3;
        }
        $('.list-phukien').slick({
            infinite: false,
            rows: phukienRows,
            slidesToShow: 3,
            arrows: false,
            speed: 300,
            responsive: [
              {
                  breakpoint: 991,
                  settings: {
                      centerMode: true,
                      centerPadding: '100px',
                      slidesToShow: 2,
                      rows: 2,
                      initialSlide: 2
                  }
              },
              {
                  breakpoint: 480,
                  settings: {
                      centerMode: true,
                      centerPadding: '80px',
                      slidesToShow: 1,
                      rows: 2,
                      initialSlide: 1
                  }
              }
            ]
        });

        // On before slide change
        $('.phienban-slide').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
            product.find('.phienban-select li.active').removeClass('active');
            product.find('.phienban-select li a[data-slide="' + nextSlide + '"]').parent().addClass('active');
        });
        $('.phienban-slide').slick({
            slideToShow: 1,
            slidesToScroll: 1,
            speed: 200,
            arrows: false,
            touchMove: false,
            draggable: false,
            fade: false,
            cssEase: 'linear',
            useCSS: false,
            useTransform: true,
            responsive: [
              {
                  breakpoint: 992,
                  settings: {
                      speed: 300,
                      touchMove: true,
                      draggable: true,
                      fade: false
                  }
              }
            ]
        });
        $('.slide-center').slick({
            infinite: false,
            fade: false,
            slidesToShow: 4,
            arrows: false,
            speed: 300,
            responsive: [
              {
                  breakpoint: 992,
                  settings: {
                      centerMode: true,
                      centerPadding: '80px',
                      slidesToShow: 2,
                      initialSlide: 2
                  }
              },
              {
                  breakpoint: 480,
                  settings: {
                      centerMode: true,
                      centerPadding: '60px',
                      slidesToShow: 1,
                      initialSlide: 1
                  }
              }
            ]
        });

        product.find('.phienban-select a').click(function () {
            var alink = $(this);
            var targetIndex = alink.attr('data-slide');

            product.find('.phienban-slide').slick('slickGoTo', targetIndex);
            return false;
        });

        product.find('.phienban-title').click(function () {
            if ($(window).width() > 991) return;

            var title = $(this);
            if (title.hasClass('no-expand')) {
                return false;
            }

            var row = title.parent();
            var slide = row.parents('.phienban-slide');

            if (!title.hasClass('expand')) {
                slide.find('.expand').removeClass('expand');
                var category = row.attr('data-specs');

                slide.find('[data-specs="' + category + '"]').each(function (index, value) {
                    $(value).find('.phienban-title').addClass('expand');
                    $(value).find('.phienban-content').addClass('expand');
                });
            } else {
                slide.find('.expand').removeClass('expand');
            }
            return false;
        })

        product.find('.option-slide .option-item a').click(function () {
            var item = $(this).parent();
            if (item.hasClass('active-show')) {
                return false;
            }

            item.parents('.option-slide').find('.option-item.active-show').removeClass('active-show');
            item.addClass('active-show');
            // if ($(window).width() < 992) {
            //   if (item.offset().top < $(window).scrollTop())
            //   //scrollTo(item);
            // }
            //renderSlide(item.parents('.option-slide'));
            return false;
        });

        initSizeOptionSlide();
        var beforeWidth = 0;
        $(window).resize(function () {
            initSizeOptionSlide();
            PhotoSlick();
            OptionSlick();
            beforeWidth = $(window).width();
            productMenuHeight = $('.pr-navigation').offset().top;
            menuScrollBottom();
        })
        function PhotoSlick() {
            var w = $(window).width();
            // thuoc tinh xac dinh co slick chua, unslick is two run >> err
            var isSlick = $('.list-photo').data('isSlick') || false;
            if (w > 991) {
                if (beforeWidth > 991) return;// ko thay doi.
                if (isSlick) $('.list-photo').slick('unslick');
                $('.list-photo').data('isSlick', false); // update isSlick
            }
            else if (w < 480) {
                if (beforeWidth > 0 && beforeWidth < 480) return;// ko thay doi.
                if (isSlick) {
                    $('.list-photo').slick('unslick');
                    // function slickSetOption ko tac dung
                    /*$('.list-photo').slick('slickSetOption', {
                      slidesToShow: 1,
                      initialSlide: 1
                    }, true);*/
                }
                // init slick with 480
                $('.list-photo').slick({
                    infinite: false,
                    rows: 2,
                    slidesToShow: 1,
                    arrows: false,
                    speed: 300,
                    centerMode: true,
                    centerPadding: '80px',
                    initialSlide: 1
                });
                $('.list-photo').data('isSlick', true); // update isSlick
            }
            else {
                if (beforeWidth > 480 && beforeWidth < 991) return;// ko thay doi.
                if (isSlick) {
                    $('.list-photo').slick('unslick');
                    // function slickSetOption ko tac dung
                    /*$('.list-photo').slick('slickSetOption', {
                      slidesToShow: 2,
                      initialSlide: 2,
                    }, true);*/
                }
                //console.log('PhotoSlick no  isSlick 991', w);
                //init slick with 991
                $('.list-photo').slick({
                    infinite: false,
                    rows: 2,
                    slidesToShow: 2,
                    centerMode: true,
                    initialSlide: 2,
                    centerPadding: '80px',
                    arrows: false,
                    speed: 300
                });
                $('.list-photo').data('isSlick', true); // update isSlick
            }
        }
        PhotoSlick();
        $('.thuvien .view-more-link a').bind('click', function () {
            $(this).fadeOut(200, function () {
                $('.thuvien .list-photo').toggleClass('extract');
            });
            return false;
        });

        function initSizeOptionSlide() {
            if ($(window).width() > 768) {
                var opheight = $('.option-slide .option-detail.show-detail img:eq(0)').height();
                if (opheight > 0) {
                    $('.option-slide').css({
                        'height': opheight
                    });
                }
            } else {
                $('.option-slide').removeAttr('style');
            }
        }

        function OptionSlick() {
            var w = $(window).width();
            var divoption = $('.option-slide .option-track');
            // thuoc tinh xac dinh co slick chua, unslick is two run >> err
            var isSlick = divoption.data('isSlick') || false;

            if (w > 991) {
                if (beforeWidth > 991) return;// ko thay doi.
                if (isSlick) divoption.slick('unslick');
                divoption.slick({
                    infinite: false,
                    slidesToShow: 6,
                    slidesToScroll: 1,
                    speed: 300,
                    adaptiveHeight: true,
                    vertical: true,
                    touchMove: false,
                    arrows: false
                    //prevArrow: '<div class="option-btn option-prev"><i class="fa fa-caret-up"></i></div>',
                    //nextArrow: '<div class="option-btn option-next"><i class="fa fa-caret-down"></i></div>'
                })
                divoption.data('isSlick', true); // update isSlick
            }
            else {
                if (beforeWidth < 991) return;// ko thay doi.
                if (isSlick) divoption.slick('unslick');
                divoption.data('isSlick', false); // update isSlick
            }
        };
        OptionSlick();
        $('.option-slide').each(function (index, value) {
            checkSlide($(value));
        });
        $('.option-slide .option-item a').click(function () {
            renderSlide($(this));
        });
        $('.option-slide .option-btn').click(function () {
            var button = $(this);
            if (button.hasClass('slick-disabled')) return;

            var slide = button.parents('.option-slide');
            var itemActive = slide.find('.option-item.active-show');

            if (button.hasClass('option-prev')) {
                renderSlide(itemActive.prev());
            }
            if (button.hasClass('option-next')) {
                renderSlide(itemActive.next());
            }
        });


        $('#header').addClass('no-scroll');

        var dacdiemnoibat = product.find('.dacdiemnoibat');
        var thongsokythuat = product.find('.thongsokythuat');
        var thietke = product.find('.thietke');
        var thuvien = product.find('.thuvien');
        var phukien = product.find('.phukien');

        var menuProduct = product.find('.pr-menu');
        var bannerProduct = product.find('.pr-banner');
        productMenuHeight = product.find('.pr-navigation').offset().top;
        menuProduct.find('.top').click(function () {
            scrollTo($('body'));
            menuProduct.removeClass('scroll');
            menuProduct.removeClass('scroll-show');
            bannerProduct.removeClass('scroll');
        });
        menuProduct.find('.dropdown .dropdown-menu a').click(function () {
            var alink = $(this);
            menuProduct.find('.dropdown .dd-text').html('');
            menuProduct.find('.dropdown .dd-text').html(alink.html());

            var target = product.find(alink.attr('data-section'));
            if (target.length > 0) {
                scrollTo(target);
            }

            menuProduct.find('.dropdown').removeClass('open');
            return false;
        });

        menuScrollBottom();
        $(window).scroll(function () {
            var wTop = $(this).scrollTop();
            if (phukien.length > 0 && wTop >= phukien.offset().top) {
                menuProduct.find('.dropdown .dd-text').html('');
                menuProduct.find('.dropdown .dd-text').html(menuProduct.find('[data-section=".phukien"]').html());
            }

            else if (thuvien.length > 0 && wTop >= thuvien.offset().top) {
                menuProduct.find('.dropdown .dd-text').html('');
                menuProduct.find('.dropdown .dd-text').html(menuProduct.find('[data-section=".thuvien"]').html());
            }
            else if (thietke.length > 0 && wTop >= thietke.offset().top) {
                menuProduct.find('.dropdown .dd-text').html('');
                menuProduct.find('.dropdown .dd-text').html(menuProduct.find('[data-section=".thietke"]').html());
            }
            else if (thongsokythuat.length > 0 && wTop >= thongsokythuat.offset().top) {
                menuProduct.find('.dropdown .dd-text').html('');
                menuProduct.find('.dropdown .dd-text').html(menuProduct.find('[data-section=".thongsokythuat"]').html());
            }
            else {
                menuProduct.find('.dropdown .dd-text').html('');
                menuProduct.find('.dropdown .dd-text').html(menuProduct.find('[data-section=".dacdiemnoibat"]').html());
            }

            didScroll = true;

            if (wTop <= productMenuHeight) {
                TweenMax.to(menuProduct, 0, { y: 0 });
                menuProduct.removeClass('scroll-show');
                menuProduct.removeClass('scroll');
                menuProduct.removeClass('scroll-bottom');
            }

            menuScrollBottom();
        });

        $(".fancybox").fancybox({
            openEffect: 'none',
            closeEffect: 'none',
            helpers: {
                title: null
            }
        });

        imgBegin = true;
        var car;
        $('[aria-controls="cl360"]').click(function () {
            if (imgBegin) {
                imgArray = JSON.parse($('#gl_360').attr('data-imgarray'));
                car = $('#gl_360 .car').ThreeSixty({
                    totalFrames: 16,
                    endFrame: 16,
                    currentFrame: 1,
                    imgList: '.threesixty_images',
                    progress: '.spinner',
                    imgArray: imgArray,
                    filePrefix: '',
                    ext: '.png',
                    height: 292,
                    width: 784,
                    navigation: false,
                    responsive: true,
                    framerate: 8,
                    //disableSpin: true,
                    onReady: function () {
                        var imgHeight = $('#gl_360 .threesixty .threesixty_images li:eq(0) img').height();
                        $('#gl_360 .threesixty').css('height', imgHeight);
                    }
                });
            }
            imgBegin = false;
        });

        $('#gl_360 .gl360-btn-prev').click(function (e) {
            if (car != null) {
                car.next();
            }
        });

        $('#gl_360 .gl360-btn-next').click(function (e) {
            if (car != null) {
                car.previous();
            }
        });
    })
};
setInterval(function () {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

function menuScrollBottom() {
    var wTop = $(window).scrollTop();
    var wHeight = $(window).height();
    var navigationProduct = $('.pr-navigation');
    var menuProduct = $('.pr-menu');

    if ((wTop + wHeight) <= (navigationProduct.offset().top + menuProduct.outerHeight())) {
        if (menuProduct.hasClass('scroll-bottom')) return;
        menuProduct.addClass('scroll-bottom');
    } else {
        menuProduct.removeClass('scroll-bottom');
    }
}

function hasScrolled() {
    var wTop = $(this).scrollTop();
    if (Math.abs(lastScrollTop - wTop) <= delta)
        return;

    var menuProduct = $('.pr-menu');
    var bannerProduct = $('.pr-banner');
    if (wTop > productMenuHeight) {
        menuProduct.removeClass('scroll-bottom');
        if (!menuProduct.hasClass('scroll')) {
            //TweenMax.to(menuProduct, 0.2, {
            //    y: -1 * menuProduct.outerHeight(), onComplete: function () {
            //        menuProduct.addClass('scroll');
            //    }
            //});
            menuProduct.addClass('scroll');
        }
    } else {
        menuScrollBottom();
    }

    if (menuProduct.hasClass('scroll')) {
        if (wTop > lastScrollTop && wTop > productMenuHeight) {
            if (menuProduct.hasClass('scroll-show')) {
                menuProduct.removeClass('scroll-show');
                //TweenMax.to(menuProduct, 0.4, { y: -1 * menuProduct.outerHeight() })
            }
            //TweenMax.to(menuProduct, 0.2, { y: -1 * menuProduct.outerHeight() })
        }
        else {
            if (wTop + $(window).height() < $(document).height()) {
                if (!menuProduct.hasClass('scroll-show')) {
                    menuProduct.addClass('scroll-show');
                    //TweenMax.to(menuProduct, 0.1, { y: 0 })
                }
            } else {
                //showMenu = false;
                //TweenMax.to(menuProduct, 0.1, { y: 0 })
            }
        }
    }

    lastScrollTop = wTop;
}
var optionSlideAction = true;
function renderSlide(link) {
    if (link.length == 0) return;
    if (link.length > 1) link = $(link[0]);

    var itemSlide = null;
    if (link.hasClass('option-item')) {
        itemSlide = link;
    } else {
        itemSlide = link.parents('.option-item');
    }

    var slide = itemSlide.parents('.option-slide');
    var slickSlide = slide.find('.option-track');
    var itemIndex = parseInt(itemSlide.attr('data-item'));

    if ($(window).width() > 991) {
        if (itemSlide.hasClass('slick-active') == false) {
            console.log(slide, itemIndex);
			var indexFirst = parseInt(slickSlide.find('.slick-active:first').attr('data-item'));
			var indexLast = parseInt(slickSlide.find('.slick-active:last').attr('data-item'));
			if (itemIndex > indexLast) {
				console.log('next', indexFirst + 2);
				slickSlide.slick('slickGoTo', indexFirst + 2);
			} else if (itemIndex < indexFirst) {
				console.log('prev', indexLast - 2);
				slickSlide.slick('slickGoTo', indexLast - 2);
			} else {
				slickSlide.slick('slickGoTo', itemIndex);
			}
        }
    }

    slide.find('.active-show').removeClass('active-show');
    itemSlide.addClass('active-show');

    slide.find('.option-list-detail .option-detail.show-detail').removeClass('show-detail');
    slide.find('.option-list-detail .option-detail[data-item="' + itemIndex + '"]').addClass('show-detail');

    if ($(window).width() <= 991) {
        var windowTop = $(window).scrollTop();
        var top = link.offset().top;

        if (top < windowTop) {
            scrollTo(link);
        }
    }
    else {
        var slickSlide = slide.find('.option-track');
        var listSlideShow = slide.find('.slick-active');

        //console.log(listSlideShow, itemIndex);
        //console.log($(listSlideShow[0]).attr('data-slick-index'), $(listSlideShow[listSlideShow.length - 1]).attr('data-slick-index'));

        if (itemIndex == listSlideShow.first().attr('data-slick-index') && itemIndex > 0) {
            optionSlideAction = false;
           slickSlide.slick('slickPrev');
        }
        if (itemIndex == listSlideShow.last().attr('data-slick-index') && itemIndex < slickSlide.find('.option-item:last').attr('data-slick-index')) {
            optionSlideAction = false;
            slickSlide.slick('slickNext');
        }
    }
    checkSlide(slide);
}
function checkSlide(slide) {
    var itemActive = slide.find('.active-show');
    slide.find('.option-btn').removeClass('slick-disabled');
    //console.log('checkSlide', slide.find('.option-item:last').attr('data-slick-index') + '-' + itemActive.attr('data-slick-index'));
    if (itemActive.attr('data-slick-index') == 0) {
        slide.find('.option-btn.option-prev').addClass('slick-disabled');
    }
    if (itemActive.attr('data-slick-index') == slide.find('.option-item:last').attr('data-slick-index')) {
        slide.find('.option-btn.option-next').addClass('slick-disabled');
    }
}
function scrollTo(element) {
    if (element == null || element.length == 0 || element == 0) {
        return;
    }
    if ($(window).height() <= element.offset().top) {
        //return;
    }
    $('html, body').animate({
        scrollTop: element.offset().top - 80
    }, 400);
};
