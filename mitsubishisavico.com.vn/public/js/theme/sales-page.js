$(function() {
   // Thay đổi tab trang Mua xe Trả góp
   $('.customer-list li').click(function() {
   	var btn = $(this),
          tabID = btn.attr('data-tab');
   	changeTab(btn, tabID);
   });

   function changeTab(button, tabID) {
   	var currentTab = $('.editor .content-wrap.active'),
   			nextTab = $('#'+ tabID);

   	// For buttons
   	$('.customer-list li').removeClass('active');
   	button.addClass('active');
   	// For tabs
   	currentTab.addClass('animated-out');
   	setTimeout(function() {
   		currentTab.removeClass('animated-in animated-out active');
   		nextTab.addClass('animated-in');
   	}, 300);
   	setTimeout(function() {
   		nextTab.addClass('active');
   	}, 300)
   }
});