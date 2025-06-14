
const animateOnScroll = () => {
  const elements = document.querySelectorAll('.verse-box, header, footer');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');

          if (entry.target.classList.contains('verse-box')) {
            const index = Array.from(document.querySelectorAll('.verse-box')).indexOf(entry.target);
            entry.target.style.transitionDelay = `${index * 0.1}s`;
          }

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
};



const scrollProgress = () => {
  const progressBar = document.querySelector('.scroll-progress');
  const totalHeight = document.body.scrollHeight - window.innerHeight;

  window.addEventListener('scroll', () => {
    const progress = (window.pageYOffset / totalHeight) * 100;
    progressBar.style.width = progress + '%';
    const hue = 160 + progress * 0.4;
    progressBar.style.background = `linear-gradient(90deg, var(--accent), hsl(${hue}, 70%, 50%))`;
  });
};



const backToTop = () => {
  const backToTopBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
};

const verseHighlight = () => {
      const highlight = document.querySelector('.verse-highlight');
      const verseBoxes = document.querySelectorAll('.verse-box');
      const offset = 15;
      const minMargin = 10;

      verseBoxes.forEach((box) => {
        box.addEventListener('mousemove', (e) => {
          const arabic = box.querySelector('.arabic').textContent;
          const translation = box.querySelector('.translation').textContent;
          highlight.querySelector('.arabic').textContent = arabic;
          highlight.querySelector('.translation').textContent = translation;
          highlight.style.display = 'block';
          highlight.classList.add('visible');
          const hlRect = highlight.getBoundingClientRect();
          const hlWidth = hlRect.width;
          const hlHeight = hlRect.height;
          const cursorX = e.clientX;
          const cursorY = e.clientY;
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          const positions = [
            { // Top-right
              left: cursorX + offset,
              top: cursorY - hlHeight - offset,
              valid: true
            },
            { // Bottom-right
              left: cursorX + offset,
              top: cursorY + offset,
              valid: true
            },
            { // Top-left
              left: cursorX - hlWidth - offset,
              top: cursorY - hlHeight - offset,
              valid: true
            },
            { // Bottom-left
              left: cursorX - hlWidth - offset,
              top: cursorY + offset,
              valid: true
            }
          ];
          
          
          positions.forEach(pos => {
            pos.valid = 
              pos.left >= minMargin &&
              pos.left + hlWidth <= viewportWidth - minMargin &&
              pos.top >= minMargin &&
              pos.top + hlHeight <= viewportHeight - minMargin;
          });
          
      
      
          const validPosition = positions.find(p => p.valid) || 
            { 
              left: Math.min(cursorX, viewportWidth - hlWidth - minMargin),
              top: Math.min(cursorY, viewportHeight - hlHeight - minMargin)
            };
          
      
      
          highlight.style.left = `${validPosition.left}px`;
          highlight.style.top = `${validPosition.top}px`;
        });

        box.addEventListener('mouseleave', () => {
          highlight.classList.remove('visible');
          highlight.style.display = 'none';
        });
      });
      


      window.addEventListener('resize', () => {
        const visibleHighlight = document.querySelector('.verse-highlight.visible');
        if (visibleHighlight) {
          visibleHighlight.style.display = 'none';
          visibleHighlight.classList.remove('visible');
        }
      });
    };



    document.addEventListener('DOMContentLoaded', () => {
      animateOnScroll();
      scrollProgress();
      backToTop();
      verseHighlight(); 
      parallaxEffect();
      copyVerse();
      shareVerse();
      setTimeout(() => {
        document.querySelector('header').classList.add('animate');
      }, 100);
    });


const parallaxEffect = () => {
  const decoration = document.querySelector('.header-decoration');

  window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    decoration.style.transform = `translateX(-50%) translateY(${scrollPosition * 0.2}px)`;
  });
};


const copyVerse = () => {
  document.querySelectorAll('.copy-btn').forEach((button) => {
    button.addEventListener('click', function () {
      const verseBox = this.closest('.verse-box');
      const arabic = verseBox.querySelector('.arabic').textContent;
      const translation = verseBox.querySelector('.translation').textContent;
      const reference = verseBox.querySelector('.verse-number').textContent;

      const textToCopy = `${arabic}\n\n${translation}\n\n— Qur'an ${reference}`;
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      textarea.style.position = 'fixed';
      textarea.style.opacity = 0;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> Copied!';
        this.style.background = '#4CAF50';
        const bubble = document.createElement('div');
        bubble.textContent = 'Verse copied!';
        bubble.style.position = 'absolute';
        bubble.style.bottom = '100%';
        bubble.style.left = '50%';
        bubble.style.transform = 'translateX(-50%)';
        bubble.style.background = '#4CAF50';
        bubble.style.color = 'white';
        bubble.style.padding = '5px 10px';
        bubble.style.borderRadius = '20px';
        bubble.style.fontSize = '12px';
        bubble.style.marginBottom = '10px';
        bubble.style.whiteSpace = 'nowrap';
        bubble.style.opacity = '0';
        bubble.style.transition = 'all 0.3s ease';
        this.appendChild(bubble);

        setTimeout(() => {
          bubble.style.opacity = '1';
          bubble.style.transform = 'translateX(-50%) translateY(-10px)';
        }, 10);

        setTimeout(() => {
          bubble.style.opacity = '0';
          bubble.style.transform = 'translateX(-50%) translateY(-20px)';
        }, 2000);

        setTimeout(() => {
          this.innerHTML = originalText;
          this.style.background = '';
          bubble.remove();
        }, 2500);
      } catch (err) {
        console.error('Unable to copy text: ', err);
      }

      document.body.removeChild(textarea);
    });
  });
};


const shareVerse = () => {
  document.querySelectorAll('.share-btn').forEach((button) => {
    button.addEventListener('click', function () {
      const verseBox = this.closest('.verse-box');
      const arabic = verseBox.querySelector('.arabic').textContent;
      const translation = verseBox.querySelector('.translation').textContent;
      const reference = verseBox.querySelector('.verse-number').textContent;
      const shareText = `Qur'an ${reference}:\n\n${arabic}\n\n"${translation}"\n\n────────────\nShared from Trust in Allah Verses\nDesigned by Tusar\nhttps://mrtusarrx.github.io/About-html/content.html`;

      if (navigator.share) {
        navigator.share({
          title: `Qur'an ${reference}`,
          text: shareText,
        }).catch((err) => {
          console.log('Error sharing:', err);
        });
      } else {
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        window.open(shareUrl, '_blank');
      }
    });
  });
};




document.addEventListener('DOMContentLoaded', () => {
  animateOnScroll();
  scrollProgress();
  backToTop();
  verseHighlight();
  parallaxEffect();
  copyVerse();
  shareVerse();
  setTimeout(() => {
    document.querySelector('header').classList.add('animate');
  }, 100);
});
