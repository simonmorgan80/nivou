/*
 * Module: carousel
 */
 
(function () {
    'use strict';
    /* global window, document*/

    var nivou = window.nivou || {};

    nivou.carousel = {
        
        init: function () {
            
            var flkty = new Flickity( '.js-carousel', {
                imagesLoaded: true
            });


            var deviceContainer = document.querySelector('.device').parentNode;

            var dots = document.querySelector('.flickity-page-dots');

            var buttons = document.querySelectorAll('.flickity-prev-next-button');



            buttons.forEach(function (n) {
                deviceContainer.append(n);
            });


            deviceContainer.append(dots);

        }
    };

    document.addEventListener('DOMContentLoaded', function() {
        nivou.carousel.init();
    });

}());