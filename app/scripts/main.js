$(function () {
  if( $('#map').length ) {
    GMapInitialize();
  }

  handleIndexAccordion();
  initErrorInput();
  initAccordion();
  initFancybox();
  handleMobileMenu();
  toggleLang();
  toggleTeamblock();
  togglePracticeblock();
  initPopup();
  initSelect();
  initDot();
  initSlick();
});

function GMapInitialize() {
    var mapOptions = {
      center: new google.maps.LatLng(1.278689, 103.847076),
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: false,
      disableDefaultUI: true,
      styles: [
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#d3d3d3"
                    }
                ]
            },
            {
                "featureType": "transit",
                "stylers": [
                    {
                        "color": "#808080"
                    },
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#b3b3b3"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#ffffff"
                    },
                    {
                        "weight": 1.8
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#d7d7d7"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#ebebeb"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#a7a7a7"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#efefef"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#696969"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#737373"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#d6d6d6"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {},
            {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#dadada"
                    }
                ]
            }
        ]
    };
    var map = new google.maps.Map(document.getElementById("map"),
        mapOptions);
    var myLatLng = new google.maps.LatLng(1.275689, 103.847076);
    var customMarker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: 'images/marker.png'
    });
    google.maps.event.addListener(customMarker, 'click', function() {
      window.open(customMarker.url, '_blank');
    });
}

function handleIndexAccordion() {
  $('.accordion ul').on('mouseover', 'li', function () {
    var index = $(this).index();

    $(this).parent().removeClass('a-0 a-1 a-2').addClass('a-' + index);
  });

  $('.accordion ul').on('mouseout', function () {
    $(this).removeClass('a-0 a-1 a-2');
  });

  $('body').on('mouseover', '.accordion__newstab', function () {
    if( $('.pagewrap').width() >= 740 ) {
      $('.newsBlockWrapper').addClass('active');
    }
  }).on('mouseleave', '.accordion__newstab', function (e) {
    if( !$(e.relatedTarget).closest('.newsBlockWrapper').length ) {
      $('.newsBlockWrapper').removeClass('active');
    }
  });

  $('.newsBlockWrapper').mouseover(function () {
    if( $('.pagewrap').width() >= 740 ) {
      $('.accordion ul').addClass('a-1 hover');
      $('.allnewsbtn').addClass('hover');
    }
  }).mouseleave(function () {
    $(this).removeClass('active');
    $('.accordion ul').removeClass('a-1 hover');
    $('.allnewsbtn').removeClass('hover');
  });

  $('.accordion__tabHolder--news .accordion__inner').click(function () {
    var newsLink = 'http://google.com';

    if( $('.pagewrap').width() < 740 ) {
      window.location = newsLink;
    }
  });
}

function initErrorInput() {
  $('.error__text').click(function () {
    $(this).closest('.formline').find('.formfield').focus();

    return false;
  });
}

function initAccordion() {
  $('.tplaccordion__head').click(function () {
    var $item = $(this).closest('.tplaccordion__item');

    if ( $item.hasClass('active') ) {
      $item.removeClass('active');
    } else {
      $('.tplaccordion__item').removeClass('active');
      $item.addClass('active');
    }

    return false;
  });
}

function initFancybox() {
  $('.fancybox').fancybox({
    padding: 0,
    helpers: {
      overlay: {
        locked: false
      }
    }
  });
}

function handleMobileMenu() {
  $('.menubtn, .mainnav__hide').click(function () {
    $('.mainnav').toggleClass('active');

    return false;
  });
}

function toggleLang() {
  $('.mobileLang__current').click(function () {
    $('.mobileLang__options').toggle();

    return false;
  });
}

function togglePracticeblock() {

}

function toggleTeamblock() {
  var addRowNum;
  var $elem, $infoBlock, $clone;

  if( $('body').find('.teamMember').length ) {
    $elem = $('.teamMember');
    $infoBlock = $('.teamInfoblock');
    $clone = $infoBlock.clone(true, true);
  }
  //  else if ( $('body').find('.practiceBlock').length ) {
  //   $elem = $('.practiceBlock');
  //   $infoBlock = $('.practiceInfoblock');
  //   $clone = $infoBlock.clone(true, true);
  // }

  if( $elem ) {
    $(window).load(function () {
      setOffset($elem);
    });    
    closeBlock($elem, $clone);
    handleClick($elem, $clone);

    $(window).resize(function () {
      setOffset($elem);
    }).on('orientationchange', function () {
      setOffset($elem);
    });
  }

  function setOffset($elem) {
    var offsetTop;

    $elem.each(function () {
      offsetTop = $(this).offset().top;

      $(this).data('top', offsetTop);
    })
  }

  function closeBlock($elem, $clone) {
    $('body').on('click', '[data-close]', function () {
      $elem.removeClass('active');
      $clone.removeClass('active').delay(300).remove();
    });

    $('body').click(function (e) {
      if( !$(e.target).closest('[data-center]').length ) {
        $elem.removeClass('active');
        $clone.removeClass('active').delay(300).remove();
      }
    });
  }

  function handleClick($elem, $clone) {
    $elem.click(function () {
      if ( !$(this).hasClass('active') ) {
        $elem.removeClass('active');
        $(this).addClass('active');
        $clone.removeClass('active').remove();
      }

      if( $(this).closest('.teamCenter').length ) {
        if( $('.teamCenter').width() > 450 ) {
          addRowNum = 3;
        } else if ( $('.teamCenter').width() <= 450 && $('.teamCenter').width() > 305 ) {
          addRowNum = 2;
        } else {
          addRowNum = 1;
        }
      } else {
        if( $('.center').width() > 970 ) {
          addRowNum = 2;
        } else {
          addRowNum = 1;
        }
      }

      var row = Math.ceil(($(this).data('index') + 1) / addRowNum);

      row *= addRowNum;

      insertTeamInfoblock(row, $elem, $clone);

      var $t = $(this);

      setTimeout(function () {
        $('html, body').animate({
          scrollTop: $t.data('top') - 20
        })
      }, 300);
    });
  }


  function insertTeamInfoblock(row, $elem, $clone) {
    if ( $elem.eq(row-1).length ) {
      $clone.insertAfter($elem.eq(row-1));
    } else {
      $clone.insertAfter($elem.last()).delay(1300).addClass('active');
    }

    setTimeout(function () {
      $clone.addClass('active');
    }, 50);
  }
}

function initPopup() {
  var popupOptions = {
    closeClass: 'popup__close',
    opacity: 0.55
  }

  $('.feedback form').submit(function () {
    $('.popup--formsent').bPopup(popupOptions);

    return false;
  });
}

function initSelect() {
  $('.customselect').chosen({
    disable_search: true,
    width: '100%'
  });
}

function initDot() {
  $('.author__description').dotdotdot({
    after: "a.author__more"
  });

  $('.practiceBlock__text').dotdotdot();

  $('.practiceBlock').click(function () {
    if( !$(this).hasClass('active') ) {
      $('.practiceBlock').removeClass('active');
      $(this).addClass('active');
      $(this).find('.practiceBlock__text').trigger("originalContent", function( content ) {
    		$(this).next().append( content );
    	});
    } else {
      $(this).removeClass('active');
    }
  });
}

function initSlick() {
  $('.principleSlider ul').slick({
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4500,
    fade: true,
    speed: 4500
  });
}
