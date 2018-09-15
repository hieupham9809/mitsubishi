var main_api_url = 'http://www.mitsubishi-motors.com.vn';
var flag_submit = false;
var config = {
  listCar: {},
  estimate: {}
};
var currentCarInfo = {};
var chiPhi = {};
var sendByEmail = false;
var isValid = false;
var model = {};
var carID = 0;
var step = 1;
var phiDangKy = phiTruocBa = baoHiem = phiDangKiem = total = discount = 0;

$(".d2-estimate").on('click', function(e) {
  e.preventDefault();

  carID = parseInt($(this).attr("data-car-id"));
  step = $(this).attr("data-step");

  $.ajax({
    url: $(this).attr("data-estimate-url"),
    method: "GET",
    dataType: "html",
    success: function(result) {
      $("div[d2-estimate-popup]").html(result);
      getEstimateJSON();
      getListCarSeries();
    }
  });
});
var checkCarSeries = checkEstimate = false;
function getListCarSeries(){
  var language = $("#language_value").val();
  $.ajax({
    url: main_api_url+'/api/getCarSeries.php?language='+language,
    method: 'GET',
    dataType: 'json',
    success: function(res) {
      config.listCar = res.data;
      checkCarSeries = true;
      renderInformation();
    }
  });
}

function getEstimateJSON(){
  $.ajax({
    url: main_api_url+'/api/getEstimate.php',
    method: 'GET',
    dataType: 'json',
    success: function(res) {
      config.estimate = res.data;
      checkEstimate = true;
      renderInformation();
    }
  });
}

function renderInformation() {
    if (!checkCarSeries) return;
    if (!checkEstimate) return;

    config.listCar.forEach(function(value, index) {
      if (value.id === carID) {
        model["id_car"] = carID;
        model["car_name"] = value.name;
        currentCarInfo = value;
        return false;
      }
    });
    config.estimate.forEach(function(value, index) {
      if (value.id === currentCarInfo.type) {
        chiPhi = value;
        return false;
      }
    });
    $('#product_estimate .list-version ul').html('');
    currentCarInfo.series.forEach(function(value, index) {
      $('#product_estimate .list-version ul').append('<li><label>' +
          '<img src="' + value.image + '" alt="' + value.name + '"/>' +
          '<input type="radio" name="phienbanxe" value="' + value.id + '" ' + (index == 0 ? 'checked="checked"': '') + ' /><span>' + value.name + '</span></label></li>');
    });
    $('#province-select').html('');
    chiPhi.value.forEach(function(value, index) {
      $('#province-select').append('<option value="' + value.id + '">' + value.name + '</option>');
    });
    $("#province-select").selecter("refresh");

    BindingEvent();
    getDealer();
    //$("input[type=radio]:checked").change();
    //$("select#province-select").change();
    $('.stepes.active').removeClass('active');
    $(".step-" + step).addClass("active");

    $("#product_estimate").fadeIn(300);
    $('html, body').addClass('ovf-hidden');
}

function getDealer(){
    $.ajax({
        url: main_api_url+'/api/getGroupDealer.php',
        method: "GET",
        dataType: "json",
        success: function (rs) {
            if(rs.result == "success"){
                var html = '';
                $.each(rs.data, function (index,value) {
                    if(value.dealer != undefined && value.dealer.length > 0){
                        html += '<optgroup label="'+value.name+'">';

                        for(var j = 0; j< value.dealer.length; j++) {
                            html += '<option value="' + value.dealer[j].id + '">' + value.dealer[j].name + '</option>';
                        }

                        html += '</optgroup>';
                    }
                });
                $("select[name='id_dealer']").append(html).selecter("refresh");
            }
        },
        complete: function () {
            $("#d2-submit").removeClass("btn-loading");
        }
    });
}

function BindingEvent() {
  Calculation();

  $('input:radio[name="phienbanxe"]').change(function() {
    // if ($.trim(currentCarInfo.tieuDeKhuyenMai) != "") {
    //   if (currentCarInfo.danhSachKhuyenMai.length > 0) {
    //     $("#d2-promotion-title").html(currentCarInfo.tieuDeKhuyenMai);
    //     $("#d2-promotion-gift").html('');
    //     $("#d2-promotion-cash").html('');
    //     var showGift = false,
    //       showCash = false;
    //     for (var i = 0; i < currentCarInfo.danhSachKhuyenMai.length; i++) {
    //       var km = currentCarInfo.danhSachKhuyenMai[i];
    //       if (km.tangTienMat == 0) {
    //         $("#d2-promotion-gift").append('<li><i class="fa fa-caret-right"></i><span>' + km.noiDungKhuyenMai + ' <b>' + (km.giaTriChu == undefined ? "" : km.giaTriChu) + '</b></span></li>');
    //         showGift = true;
    //       } else {
    //         $("#d2-promotion-cash").append('<li><i class="fa fa-caret-right"></i><span>' + km.noiDungKhuyenMai + ' <b>' + (km.giaTriChu == undefined ? "" : km.giaTriChu) + '</b></span></li>');
    //         showCash = true;
    //       }
    //     }
    //     if (showGift == false) {
    //       $("#d2-promotion-gift").closest(".row").hide();
    //     } else {
    //       $("#d2-promotion-gift").closest(".row").show();
    //     }
    //     if (showCash == false) {
    //       $("#d2-promotion-cash").closest(".row").hide();
    //     } else {
    //       $("#d2-promotion-cash").closest(".row").show();
    //     }
    //     $(".estimate-promotion").show();
    //   } else {
    //     $(".estimate-promotion").hide();
    //   }
    // } else {
    //   $(".estimate-promotion").hide();
    // }
    Calculation();
  });

  $("select#province-select").change(function() {
    model["location"] = $("select#province-select").val();
    Calculation();
  });

  //Close modal
  $('.modal-close, .btn-modal-close').unbind().bind('click', function() {
    $('html, body').removeClass('ovf-hidden');
    $("#product_estimate").fadeOut(300);
    $("#product_estimate").prop("outerHTML", "<div d2-estimate-popup></div>");
  });

  $("#send_to_email").click(function() {
    sendByEmail = true;
    GoToStepTwo();
  });

  $("#send_from_dealer").click(function() {
    sendByEmail = false;
    GoToStepTwo();
  });

  var checkEmptyInputList = $('.textfield-float-label :input');

  $.each(checkEmptyInputList, function(index) {
    checkEmptyInput(checkEmptyInputList[index]);
  });

  $('.textfield-float-label :input').on('change', function() {
    checkEmptyInput($(this));
  });

  $("form#register_form :input").each(function() {
    var input = $(this); // This is the jquery object of the input [input, select, textarea, button], do what you will
    //bind multiple events
    input.on('keyup change', function() {
      ValidateForm(input);
    });
  });



    $("#d2-submit").click(function() {
    $("form#register_form :input").each(function() {
      var input = $(this);
      ValidateForm(input);
    });

    if (isValid && $("select[id=dealer-select] option:selected").val() && !flag_submit) {
       flag_submit = true;

      $("form#register_form :input").each(function() {
        model[$(this).attr("name")] = $(this).val();
      });
      model["ViaEmail"] = sendByEmail;
      model["dealer_name"] = $("#dealer-select option:selected").text();
      model["location_name"] = $("#province-select option:selected").text();

      $("#d2-submit").addClass("btn-loading");

      $.ajax({
        url: $("#register_form").attr("data-submit-url"),
        method: "POST",
        data: model,
        dataType: 'json',
        success: function(result) {
            flag_submit = false;
          if (result.result == "fail") {
            HideAllMessages();
            $("form#register_form [d2-val-target='form']").html(result.errorMessage).show();
            // for (var i = 0; i < result.Errors.length; i++) {
            //   $("[d2-val-target='" + result.Errors[i].Key + "'][d2-val-server-msg]").html(result.Errors[i].Error).show();
            //   $("[d2-val-target-parent='" + result.Errors[i].Key + "']").addClass("invalid").removeClass("valid");
            // }
            isValid = false;
          } else {
            //Go to step 3
            $(".step-2").removeClass("active");
            $(".step-3").addClass("active");
            /* Ants Insight goal tracking function */
            adx_analytic.trackingGoal('579738200', 1, 'event');

            /* Ants Insight Form-Data tracking */
            var carName = $('#product_estimate form#register_form #d2-submit').attr('data-tracking-click-cat');
            var infoCustomTargetKey = [{
                field: 'action',
                value: 'Báo giá'
              },
              {
                field: 'dealer',
                value: $('#product_estimate form#register_form select[name="DealerID"] option[value="' + model.DealerID + '"]').text() // Chọn Đại lý
              },
              {
                field: 'dealerID',
                value: model.DealerID // Chọn Đại lý = Department
              },
              {
                field: 'department',
                value: model.DealerID // Chọn Đại lý = Department
              },
              {
                field: ' car_type',
                value: carName // Chọn dòng xe
              }
            ];

            var trackiObj = {
              name: model.Name,
              phone: model.Phone,
              email: model.Email,
              others: JSON.stringify(infoCustomTargetKey)
            };
            adx_analytic.trackingEvent('tup', trackiObj, true);
            ga('ANTS.send', {
              hitType: 'event',
              eventCategory: 'Baogia',
              eventAction: 'Click'
            });
            d2Ga.addEvent(carName, "click", "RFQ", 1);

          }
        },
        complete: function() {
          $("#d2-submit").removeClass("btn-loading");
        }
      })
    }
  });
    //$('#product_estimate select').selecter();
   $("#dealer-select").selecter();
   $("#province-select").selecter();



}

function Calculation() {
  var phienbanxe = parseInt($('input[name="phienbanxe"]:checked').val());
  model["id_series"] = phienbanxe;
  var giaXe = 0;
  var info_promotion;

  currentCarInfo.series.forEach(function(value, index){
    if (value.id === phienbanxe) {
        info_promotion = value;
        giaXe = parseInt(value.price);
      return false;
    }
  });
  var province = $("select#province-select option:selected").val();
  chiPhi.value.forEach(function(value, index) {
    if (value.id == province) {
      phiDangKy = parseInt(value.phiDangKy);
      phiTruocBa = parseInt(value.phiTruocBa);
      baoHiem = parseInt(value.baoHiem);
      phiDangKiem = parseInt(value.phiDangKiem);
    }
  });

  phiDangKy = phiDangKy == undefined ? 0 : phiDangKy;
  phiTruocBa = phiTruocBa == undefined ? 0 : phiTruocBa;

  var total = giaXe + phiDangKy + (phiTruocBa * giaXe / 100) + phiDangKiem + baoHiem;
  var discount = total;
  // if ($.trim(currentCarInfo.tieuDeKhuyenMai) != "") {
  //   if (currentCarInfo.danhSachKhuyenMai.length > 0) {
  //     for (var i = 0; i < currentCarInfo.danhSachKhuyenMai.length; i++) {
  //       discount -= parseInt(currentCarInfo.danhSachKhuyenMai[i].giaTriSo == undefined ? 0 : currentCarInfo.danhSachKhuyenMai[i].giaTriSo);
  //     }
  //   }
  // }

  MapDataToView(giaXe, total, discount, info_promotion);
}

function MapDataToView(giaXe, total, discount, info_promotion) {
    console.log(info_promotion);

    if(info_promotion.title_info_promotion != undefined && $.trim(info_promotion.title_info_promotion) != ''){
        $(".estimate-promotion").show();
        $(".promo-title p").html(info_promotion.title_info_promotion);
        $(".content-money").html(info_promotion.money_content);
        $(".content-gift").html(info_promotion.gift_content);
        discount = total - parseInt(info_promotion.price_minus_all);
    } else {
        $(".estimate-promotion").hide();
    }

  $("#d2-giaXe").html(FormatStringNumber(giaXe));
  $("#d2-phiDangKy").html(FormatStringNumber(phiDangKy));
  $("#d2-phiTruocBa").html(FormatStringNumber((phiTruocBa * giaXe / 100)));
  $("#d2-phiTruocBa-text").html("(" + phiTruocBa + "%)");
  $("#d2-soChoNgoi").html("(" + chiPhi.name + ")");
  $("#d2-baoHiem").html(FormatStringNumber(baoHiem));
  $("#d2-phiDangKiem").html(FormatStringNumber(phiDangKiem));
  $("#d2-total").html(FormatStringNumber(total));
  $("#d2-discount").html(FormatStringNumber(discount));


  //$('.estimate-detail').fadeOut(1000, function () {

  //	$('.estimate-detail').fadeIn(1000);
  //});
  //console.log(giaXe, "giaXe");
  //console.log(phiDangKy, "phiDangKy");
  //console.log(baoHiem, "baoHiem");
  //console.log(phiDangKiem, "phiDangKiem");
  //console.log(total, "total");
  //console.log(discount, "discount");
}

function FormatStringNumber(num) {
  return (num).toLocaleString($("#product_estimate").attr("data-culture"));
}

function GoToStepTwo() {
  $(".step-1").removeClass("active");
  $(".step-2").addClass("active");
  if (!sendByEmail) {
    $(".frm-title").show();
    $(".div-select").parent().show();
  } else {
    $(".frm-title").hide();
    $(".div-select").parent().hide();
  }
}

function HideAllMessages() {
  $("form#register_form [d2-val-target]").hide();
}

function ValidateForm(input) {
  isValid = true;
  var value = $.trim(input.val());
  //check if input has attribute "d2-required"
  if (input.attr('d2-val-required') !== undefined) {
    if (value == "") {
      $("form#register_form [d2-val-target='" + input.attr("name") + "'][d2-val-required-msg]").show();
      $("form#register_form [d2-val-target-parent=\"" + input.attr("name") + "\"]").addClass("invalid").removeClass("valid");
      isValid = false;
    } else {
      $("form#register_form [d2-val-target='" + input.attr("name") + "'][d2-val-required-msg]").hide();
      $("form#register_form [d2-val-target='" + input.attr("name") + "'][d2-val-server-msg]").hide();
      $("form#register_form [d2-val-target-parent='" + input.attr("name") + "']").addClass("valid").removeClass("invalid");
    }
  }

  //check if input has attribute "d2-email"
  if (input.attr('d2-val-email') !== undefined) {
    if (value != "") {
      //check input's value with RegEx
      var email_pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      if (email_pattern.test(value) == false) {
        $("form#register_form [d2-val-target='" + input.attr("name") + "'][d2-val-email-msg]").show();
        $("form#register_form [d2-val-target-parent='" + input.attr("name") + "']").addClass("invalid").removeClass("valid");
        isValid = false;
      } else {
        $("form#register_form [d2-val-target='" + input.attr("name") + "'][d2-val-email-msg]").hide();
        $("form#register_form [d2-val-target='" + input.attr("name") + "'][d2-val-server-msg]").hide();
        $("form#register_form [d2-val-target-parent='" + input.attr("name") + "']").addClass("valid").removeClass("invalid");
      }
    } else {
      $("form#register_form [d2-val-target='" + input.attr("name") + "'][d2-val-email-msg]").hide();
      $("form#register_form [d2-val-target='" + input.attr("name") + "'][d2-val-server-msg]").hide();
    }
  }

  //check if phone number is valid
  if (input.attr('d2-val-phone') !== undefined) {
    if (value != "") {
      var phone_pattern = new RegExp(/^\d{10,11}$/i);
      if (phone_pattern.test(value) == false) {
        $("form#register_form [d2-val-target='" + input.attr("name") + "'][d2-val-phone-msg]").show();
        $("form#register_form [d2-val-target-parent=\"" + input.attr("name") + "\"]").addClass("invalid").removeClass("valid");
        isValid = false;
      } else {
        $("form#register_form [d2-val-target='" + input.attr("name") + "'][d2-val-phone-msg]").hide();
        $("form#register_form [d2-val-target='" + input.attr("name") + "'][d2-val-server-msg]").hide();
        $("form#register_form [d2-val-target-parent='" + input.attr("name") + "']").addClass("valid").removeClass("invalid");
      }
    } else {
      $("form#register_form [d2-val-target='" + input.attr("name") + "'][d2-val-phone-msg]").hide();
      $("form#register_form [d2-val-target='" + input.attr("name") + "'][d2-val-server-msg]").hide();
    }
  }
}

function checkEmptyInput(el) {
  var val = $(el).val();
  if (val == "" || !val || val == null)
    $(el).removeClass('is-not-empty').addClass('is-empty');
  else
    $(el).removeClass('is-empty').addClass('is-not-empty');
}
