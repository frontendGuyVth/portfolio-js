// app.js
const form = document.getElementById('form');
const result = document.getElementById('result');

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const navbar = document.getElementById('navbar');
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const sections = document.querySelectorAll('section');
  const bgElements = document.querySelectorAll('.fixed > div');

  // Mobile Menu Toggle
  mobileMenuButton.addEventListener('click', () => {
    mobileMenuButton.classList.toggle('active');
    
    if (mobileMenu.classList.contains('open')) {
      mobileMenu.style.height = '0';
      mobileMenu.classList.remove('open');
    } else {
      mobileMenu.classList.add('open');
      mobileMenu.style.height = `${mobileMenu.scrollHeight}px`;
    }
  });

  // Close mobile menu when a link is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuButton.classList.remove('active');
      mobileMenu.style.height = '0';
      mobileMenu.classList.remove('open');
    });
  });

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    highlightCurrentSection();
  });

  // Smooth scroll for nav links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 70; // Adjust for navbar height
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        
        // Highlight the section briefly
        targetSection.classList.add('section-highlight');
        setTimeout(() => {
          targetSection.classList.remove('section-highlight');
        }, 1000);
      }
    });
  });

  // Highlight active section in navbar
  function highlightCurrentSection() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
    
    mobileNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  // Parallax effect for background elements
  /*
  if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    document.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      bgElements.forEach(element => {
        const speed = 20; // Adjust for more or less movement
        const xOffset = (x - 0.5) * speed;
        const yOffset = (y - 0.5) * speed;
        
        element.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
      });
    });
  }
  */

  // Scroll animations for sections
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
      }
    });
  }, { threshold: 0.1 });
  
  sections.forEach(section => {
    section.classList.add('section-hidden');
    observer.observe(section);
  });

  // Initialize active section on page load
  highlightCurrentSection();
  
  // Make header text visible with animation
  setTimeout(() => {
    const headerText = document.querySelector('.text-6xl');
    if (headerText) {
      headerText.style.opacity = 1;
      headerText.style.transform = 'translateY(0)';
    }
  }, 300);
});


form.addEventListener('submit', async function(e) {
    const formData = new FormData(form);
    console.log(formData,"form data");
    
    e.preventDefault();

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    result.innerHTML = "Please wait..."

    await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                result.innerHTML = json.message;
            } else {
                console.log(response);
                result.innerHTML = json.message;
            }
        })
        .catch(error => {
            console.log(error);
            result.innerHTML = "Something went wrong!";
        })
        .then(function() {
            form.reset();
            setTimeout(() => {
                result.style.display = "none";
            }, 3000);
        });
});