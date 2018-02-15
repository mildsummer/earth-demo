import $ from 'jquery';
import 'jquery-mousewheel';
import '../sass/style.sass';

const $window = $(window);
const $header = $('.header');
const $mainHeader = $('.main-header');
const $sectionWrapper = $('.section-wrapper');
const $sections = $('.section').css({
  position: 'absolute',
  top: 0,
  display: 'none'
});
$sections.eq(0).css({
  display: ''
});
$window.scrollTop(0);

const $nav = $('.nav');
const $navCurrent = $('.nav__current').css({
  top: 0,
  height: `${100 / $sections.length}%`
});

const $movieThumbnailImage = $('.movie__thumbnail img');

class Manager {
  constructor() {
    this.onMouseWheel = this.onMouseWheel.bind(this);
    this.bindMouseWheel = this.bindMouseWheel.bind(this);
    this.index = 0;
    this.firstSectionTop = $sections.eq(0).offset().top;
    this.footerHeight = $('.footer').outerHeight();
    this.windowHeight = $window.height();
    this.bindMouseWheel();
  }

  bindMouseWheel() {
    $window.on('mousewheel', this.onMouseWheel);
  }

  unbindMouseWheel() {
    $window.off('mousewheel', this.onMouseWheel);
  }

  onMouseWheel(e) {
    if (e.deltaY > 0 && this.index > 0) {
      this.slide(-1);
    } else if (e.deltaY < 0 && this.index <= $sections.length) {
      this.slide(1);
    }
  }

  slide(direction) {
    const prevIndex = this.index;
    const easingDuration = 800;
    this.index += direction;
    let duration = 1000;
    const easing = 'cubic-bezier(0.645, 0.045, 0.355, 1)';
    if (this.index === 1) {
      $nav.css({
        opacity: 1
      });
      $movieThumbnailImage.css({
        transform: 'translate3d(0, 0, 0)',
        transition: `transform 1000ms ${easing}`
      });
      $navCurrent.css({
        top: `${((this.index - 1) * 100) / $sections.length}%`
      });
      $sectionWrapper.css({
        transform: `translate3d(0, ${-this.firstSectionTop}px, 0)`,
        transition: `transform 1000ms ${easing}`
      });
      $header.addClass('header--small');
      $mainHeader.addClass('main-header--hidden');
      if (prevIndex === 2) {
        $sections.eq(prevIndex - 1).addClass('leave').css({
          display: ''
        });
        window.setTimeout(() => {
          $sections.eq(prevIndex - 1).addClass('leave-active');
          window.setTimeout(() => {
            $sections.eq(prevIndex - 1).removeClass('leave leave-active').hide();
            $sections.eq(this.index - 1).addClass('enter').css({
              display: ''
            });
            window.setTimeout(() => {
              $sections.eq(this.index - 1).addClass('enter-active');
              window.setTimeout(() => {
                $sections.eq(this.index - 1).removeClass('enter enter-active');
              }, easingDuration);
            }, 50);
          }, easingDuration);
        }, 10);
        duration = (easingDuration * 2) + 100;
      }
      $('.footer').css({
        transform: `translate3d(0, ${-this.firstSectionTop}px, 0)`,
        transition: `transform 1000ms ${easing}`
      });
    } else if (this.index === 0) {
      $nav.css({
        opacity: 0
      });
      $movieThumbnailImage.css({
        transform: 'translate3d(0, -200px, 0)',
        transition: `transform 1000ms ${easing}`
      });
      $sectionWrapper.css({
        transform: 'translate3d(0, 0, 0)',
        transition: `transform 1000ms ${easing}`
      });
      $header.removeClass('header--small');
      $mainHeader.removeClass('main-header--hidden');
      $('.footer').css({
        transform: `translate3d(0, ${-this.firstSectionTop}px, 0)`,
        transition: `transform 1000ms ${easing}`
      });
    } else if (this.index === $sections.length + 1) {
      $nav.css({
        opacity: 0
      });
      $sectionWrapper.css({
        transform:
          `translate3d(0, ${-this.firstSectionTop - this.footerHeight}px, 0)`,
        transition: `transform 1000ms ${easing}`
      });
      $('.footer').css({
        transform: `translate3d(0, ${-this.footerHeight - this.firstSectionTop}px, 0)`,
        transition: `transform 1000ms ${easing}`
      });
    } else {
      $nav.css({
        opacity: 1
      });
      $navCurrent.css({
        top: `${((this.index - 1) * 100) / $sections.length}%`
      });
      $sectionWrapper.css({
        transform: `translate3d(0, ${-this.firstSectionTop}px, 0)`,
        transition: `transform 1000ms ${easing}`
      });
      $header.addClass('header--small');
      $mainHeader.addClass('main-header--hidden');
      if (prevIndex !== $sections.length + 1) {
        $sections.eq(prevIndex - 1).addClass('leave').css({
          display: ''
        });
        window.setTimeout(() => {
          $sections.eq(prevIndex - 1).addClass('leave-active');
          window.setTimeout(() => {
            $sections.eq(prevIndex - 1).removeClass('leave leave-active').hide();
            $sections.eq(this.index - 1).addClass('enter').css({
              display: ''
            });
            window.setTimeout(() => {
              $sections.eq(this.index - 1).addClass('enter-active');
              window.setTimeout(() => {
                $sections.eq(this.index - 1).removeClass('enter enter-active');
              }, easingDuration);
            }, 50);
          }, easingDuration);
        }, 10);
        duration = (easingDuration * 2) + 100;
      }
      $('.footer').css({
        transform: `translate3d(0, ${-this.firstSectionTop}px, 0)`,
        transition: `transform 1000ms ${easing}`
      });
    }
    this.unbindMouseWheel();
    window.setTimeout(this.bindMouseWheel, duration + 100);
  }

  resize() {
    this.windowHeight = $window.height();
    this.firstSectionTop = $sections.eq(0).offset().top;
  }
}

window.manager = new Manager();
window.onload = () => {
  $('.loading').addClass('loading--loaded');
  window.setTimeout(() => {
    $('.loading').hide();
  }, 1500);
};
