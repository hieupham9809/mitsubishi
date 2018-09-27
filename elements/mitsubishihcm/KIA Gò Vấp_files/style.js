
new WOW().init();

$(document).ready(function(){
    /*$('.cover').removeClass('loading-effect');*/
    if($(window).width() > 992){
        $('.dropdown-toggle', $("#main-nav")).removeAttr('data-toggle');
    }
    $('.dropdown', $("#main-nav")).hover(function(){
        $("body").toggleClass('openmenu');
    })
    $('.title', $(".showroom.on-mobile")).click(function(){
        $(".showroom.on-mobile").toggleClass('open');
    })

    $("#sm-button").click(function(){
        $("aside").css({
            left: 0
        })
    })
    $('a[href*=#]:not([href=#])',$('.move-menu')).click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top - 70
                }, 1000);
                return false;
            }
        }
    });

    if($(window).width() > 2000){
        $(window).bind('scroll', function() {
            if ($(window).scrollTop() > 70) {
                $('#sidebar').addClass('on-bottom');
                $('aside').css({
                    paddingTop: $(window).scrollTop()
                })
            }
            else {
                $('aside').css({
                    paddingTop: 0
                })
            }
        })

    }
    /*schedule box*/
    $(window).bind('scroll', function() {
        if ($(window).scrollTop() > ($(document).height()) - $(window).height() - 30) {
            $('#sidebar').addClass('on-bottom');
            var delay = 0;
            $('#sidebar li').each(function() {
                var $li = $(this);
                setTimeout(function() {
                    $li.addClass('color-change');
                }, delay+=500); // delay 500 ms
            });
        }
        else {
            $('#sidebar').removeClass('on-bottom');
            $('#sidebar li').removeClass('color-change');
        }
    });
    $('.switch').click(function() {
        $(this).toggleClass('on').toggleClass('off');
    });
    /*fixed menu page*/

    var menuPage = $('#menu-page');

    if (menuPage.length > 0) {
        var menuPageTopPosition = menuPage.offset().top;
        $(window).on('scroll', function(){
            if($(window).scrollTop() > menuPageTopPosition ) {
                menuPage.addClass('is-fixed');
            } else {
                menuPage.removeClass('is-fixed');
            }
            $('#menu-page .main li').not(":first").each(function(){
                var t = $(this);
                var idCurrent = t.find('a[href*=#]:not([href=#])').first().attr('href');
                if(typeof idCurrent != 'undefined' && $(window).scrollTop() > $(idCurrent).offset().top ) {
                    t.addClass('active').siblings('li').removeClass('active');
                }
            })
        });
    }
    /*video modal*/
    $(document).delegate('#videosModal .close','click',function(){
        $('#videoIntro')[0].pause();
    });
    /*function product*/
    /*$("#functions .tab-menu li").on('click', function(){
     var currentTab = $("#functions .tab-pane.active");
     var currentSlider = currentTab.children(".item_wrapper");
     var next = currentSlider.find('.next_btn');
     var prev = currentSlider.find('.prev_btn')

     $(currentSlider).bxSlider({
     auto: true,
     slideSelector: '.item',
     minSlides: 1,
     maxSlides: 1,
     pager: true,
     nextText: " ",
     prevText: " ",
     nextSelector: next,
     prevSelector: prev
     });*/
    var fancy = $('.fancybox');
    if(fancy.length >0){
        $('.fancybox').fancybox();
    }


    $('.prize-list .item').each(function(){
        $(this).css({
            'height': $('.prize-list .item').first().width()
        })
    })

    if($(window).width() < 992){
        $('li.dropdown>a').on('click', function (event) {
            event.preventDefault();
            $(this).parent().toggleClass('open');
        });

        $('body').on('click', function (e) {
            if (!$('li.dropdown').is(e.target)
                && $('li.dropdown').has(e.target).length === 0
                && $('.open').has(e.target).length === 0
            ) {
                $('li.dropdown').removeClass('open');
            }
        });
    }
})/**
 * Created by Nguyen Phuong Thanh on 3/26/2016.
 */
