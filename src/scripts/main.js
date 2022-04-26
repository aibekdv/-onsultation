$(document).ready(function () {
    $(window).scroll(function () {
        let sticky = $('.header'),
            scroll = $(window).scrollTop();

        if (scroll >= 40) {
            sticky.addClass('active');
        }
        else {
            sticky.removeClass('active');
        }
    });

    $(".mobile_menu").on('click', (e) => {
        $(".mobile_menu").toggleClass("active")
        $(".header .menu").toggleClass("active")
        $(".mobile_menu").hasClass('active')
            ? $("body").css("overflow", "hidden")
            : $("body").css("overflow", "inherit")
    })
})

// swiper
var swiper = new Swiper(".feedback", {
    cssMode: true,
    loop: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    pagination: {
        el: ".swiper-pagination",
    },
    mousewheel: true,
    keyboard: true,
});


// accordion
// Аккордеон
function accordion() {
    const items = document.querySelectorAll('.accordion__item-trigger')
    items.forEach(item => {
        item.addEventListener('click', () => {
            const parent = item.parentNode
            if (parent.classList.contains('accordion__item-active')) {
                parent.classList.remove('accordion__item-active')
            } else {
                document.querySelectorAll('.accordion__item').forEach(child => child.classList.remove('accordion__item-active'))
                parent.classList.add('accordion__item-active')
            }
        })
    })
}
accordion()

