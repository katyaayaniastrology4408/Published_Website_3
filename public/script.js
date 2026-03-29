// Loading Screen
window.addEventListener('load', function() {
    setTimeout(function() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 800);
});

// Star Field Generation
function createStarField() {
    const starField = document.querySelector('.star-field');
    if (!starField) return;
    
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${Math.random() * 2 + 1}px`;
        star.style.height = star.style.width;
        star.style.animationDelay = `${Math.random() * 3}s`;
        starField.appendChild(star);
    }
}

createStarField();

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
    body.classList.remove('dark');
    if (sunIcon) sunIcon.classList.add('hidden');
    if (moonIcon) moonIcon.classList.remove('hidden');
}

if (themeToggle) {
    themeToggle.addEventListener('click', function() {
        const isDark = body.classList.contains('dark');
        if (isDark) {
            body.classList.remove('dark');
            if (sunIcon) sunIcon.classList.add('hidden');
            if (moonIcon) moonIcon.classList.remove('hidden');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.add('dark');
            if (sunIcon) sunIcon.classList.remove('hidden');
            if (moonIcon) moonIcon.classList.add('hidden');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });
}

// Panchang / Sunrise-Sunset Fetch
function fetchPanchangData() {
    const sunriseEl = document.getElementById('sunrise-time');
    const sunsetEl = document.getElementById('sunset-time');
    const hinduMonthEl = document.getElementById('hindu-month');
    const hinduTithiEl = document.getElementById('hindu-tithi');
    const hinduPakshaEl = document.getElementById('hindu-paksha');
    const hinduVaaraEl = document.getElementById('hindu-vaara');

    if (!sunriseEl) return;

    const today = new Date().toISOString().split('T')[0];

    fetch('/api/panchang?t=' + today, { cache: 'no-store' })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (data.success && data.data) {
                var d = data.data;
                function to12h(time24) {
                    var parts = time24.split(':');
                    var h = parseInt(parts[0]);
                    var m = parts[1];
                    var period = h >= 12 ? 'PM' : 'AM';
                    if (h > 12) h -= 12;
                    if (h === 0) h = 12;
                    return h + ':' + m + ' ' + period;
                }
                if (sunriseEl) sunriseEl.textContent = to12h(d.sunrise);
                if (sunsetEl) sunsetEl.textContent = to12h(d.sunset);
                if (hinduMonthEl && d.hinduMonth) hinduMonthEl.textContent = d.hinduMonth.hindi || d.hinduMonth.english;
                if (hinduTithiEl && d.tithi) hinduTithiEl.textContent = d.tithi.hindi || d.tithi.english;
                if (hinduPakshaEl && d.paksha) hinduPakshaEl.textContent = d.paksha.hindi || d.paksha.english;
                if (hinduVaaraEl && d.vaara) hinduVaaraEl.textContent = d.vaara.hindi || d.vaara.english;
            }
        })
        .catch(function(err) {
            console.error('Error fetching panchang:', err);
        });
}

fetchPanchangData();
setInterval(fetchPanchangData, 30 * 60 * 1000);

// Area Distance Checker
var areasWithin6_5km = [
    "Vastral", "Ramrajya Nagar", "Mahadev Nagar", "Nirant Cross Road", "Odhav",
    "Nikol", "Singarwa", "Amraiwadi", "CTM", "Hatkeshwar", "Rabari Vasahat",
    "Khokhra", "Gomtipur", "Rakhiyal", "Bapunagar", "Thakkarbapa Nagar",
    "Karai", "Vinzol", "Arbudanagar", "Jivanwadi", "Pranami Nagar", "Ratanpura"
];

function checkArea(areaName) {
    var resultEl = document.getElementById('area-result');
    if (!resultEl) return;

    var isWithin = areasWithin6_5km.some(function(a) {
        return a.toLowerCase() === areaName.toLowerCase();
    });

    resultEl.style.display = 'flex';
    resultEl.className = isWithin ? 'within' : 'outside';

    if (isWithin) {
        resultEl.innerHTML = '<svg style="width:24px;height:24px;stroke:currentColor;flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg><span>आप 6.5 किमी के भीतर हैं! शुल्क: ₹1,101</span>';
    } else {
        resultEl.innerHTML = '<svg style="width:24px;height:24px;stroke:currentColor;flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg><span>आप 6.5 किमी के बाहर हैं। शुल्क: ₹2,101</span>';
    }
}

var checkAreaBtn = document.getElementById('check-area-btn');
var areaInput = document.getElementById('area-input');

if (checkAreaBtn && areaInput) {
    checkAreaBtn.addEventListener('click', function() {
        if (areaInput.value.trim()) checkArea(areaInput.value.trim());
    });
    areaInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (areaInput.value.trim()) checkArea(areaInput.value.trim());
        }
    });
}

document.querySelectorAll('.area-tag').forEach(function(tag) {
    tag.addEventListener('click', function() {
        var area = this.getAttribute('data-area');
        if (areaInput) areaInput.value = area;
        checkArea(area);
    });
});

// Booking Form Multi-Step Logic
var currentStep = 1;
var selectedTime = '';

function showStep(stepNum) {
    for (var i = 1; i <= 4; i++) {
        var stepEl = document.getElementById('booking-step-' + i);
        if (stepEl) stepEl.style.display = i === stepNum ? 'block' : 'none';

        var indEl = document.getElementById('step-ind-' + i);
        if (indEl) {
            if (i <= stepNum) {
                indEl.classList.add('active');
            } else {
                indEl.classList.remove('active');
            }
        }
    }
    currentStep = stepNum;
}

// Step 1 next
var step1Next = document.getElementById('step1-next');
var cityInput = document.getElementById('city');
var serviceTypeSelect = document.getElementById('service-type');

function checkStep1() {
    if (step1Next && cityInput && serviceTypeSelect) {
        step1Next.disabled = !(cityInput.value.trim() && serviceTypeSelect.value);
    }
}

if (cityInput) cityInput.addEventListener('input', checkStep1);
if (serviceTypeSelect) {
    serviceTypeSelect.addEventListener('change', function() {
        checkStep1();
        // Show/hide address field based on home consultation
        var addressGroup = document.getElementById('address-group');
        if (addressGroup) {
            addressGroup.style.display = serviceTypeSelect.value.startsWith('home') ? 'block' : 'none';
        }
    });
}

if (step1Next) {
    step1Next.addEventListener('click', function() { showStep(2); });
}

// Step 2 navigation
var step2Back = document.getElementById('step2-back');
var step2Next = document.getElementById('step2-next');

if (step2Back) step2Back.addEventListener('click', function() { showStep(1); });
if (step2Next) step2Next.addEventListener('click', function() { showStep(3); });

// Step 3 navigation
var step3Back = document.getElementById('step3-back');
if (step3Back) step3Back.addEventListener('click', function() { showStep(2); });

// Time slot selection
document.querySelectorAll('.time-slot-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.time-slot-btn').forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        selectedTime = this.getAttribute('data-time');
        var hiddenInput = document.getElementById('selected-time');
        if (hiddenInput) hiddenInput.value = selectedTime;
    });
});

// Booking Form Submit
var bookingForm = document.getElementById('booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var submitBtn = document.getElementById('step3-submit');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'सबमिट हो रहा है...';
        }

        var formData = {
            city: cityInput ? cityInput.value : '',
            serviceType: serviceTypeSelect ? serviceTypeSelect.value : '',
            name: document.getElementById('name') ? document.getElementById('name').value : '',
            email: document.getElementById('email') ? document.getElementById('email').value : '',
            phone: document.getElementById('phone') ? document.getElementById('phone').value : '',
            address: document.getElementById('address') ? document.getElementById('address').value : '',
            birthDate: document.getElementById('birth-date') ? document.getElementById('birth-date').value : '',
            birthTime: document.getElementById('birth-time') ? document.getElementById('birth-time').value : '',
            birthPlace: document.getElementById('birth-place') ? document.getElementById('birth-place').value : '',
            concerns: document.getElementById('concerns') ? document.getElementById('concerns').value : '',
            preferredDate: document.getElementById('preferred-date') ? document.getElementById('preferred-date').value : '',
            preferredTime: selectedTime
        };

        fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                full_name: formData.name,
                email: formData.email,
                phone: formData.phone,
                city: formData.city,
                address: formData.address,
                date_of_birth: formData.birthDate,
                time_of_birth: formData.birthTime || '00:00',
                place_of_birth: formData.birthPlace || 'Not specified',
                service_type: formData.serviceType,
                booking_date: formData.preferredDate,
                booking_time: formData.preferredTime,
                special_requests: formData.concerns,
                payment_status: 'pending',
                amount: formData.serviceType === 'home-outside' ? 2101 : formData.serviceType === 'home-within' ? 1101 : 501,
                status: 'pending'
            })
        })
        .then(function(res) { return res.json(); })
        .then(function(result) {
            if (result.success) {
                showStep(4);
            } else {
                var errMsg = document.getElementById('error-message');
                if (errMsg) errMsg.style.display = 'block';
            }
        })
        .catch(function(error) {
            console.error('Booking error:', error);
            var errMsg = document.getElementById('error-message');
            if (errMsg) errMsg.style.display = 'block';
        })
        .finally(function() {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'अभी बुक करें';
            }
        });
    });
}

// Feedback Form Logic
var feedbackForm = document.getElementById('feedback-form');
var feedbackSuccessMsg = document.getElementById('success-message');
var feedbackErrorMsg = document.getElementById('error-message');
var ratingStars = document.querySelectorAll('.rating-star');
var ratingInput = document.getElementById('rating');
var ratingText = document.getElementById('rating-text');
var selectedRating = 0;

var ratingLabels = {
    1: 'सुधार आवश्यक',
    2: 'ठीक',
    3: 'अच्छा',
    4: 'बहुत अच्छा',
    5: 'उत्कृष्ट'
};

ratingStars.forEach(function(star) {
    star.addEventListener('click', function() {
        selectedRating = parseInt(this.getAttribute('data-value'));
        if (ratingInput) ratingInput.value = selectedRating;
        if (ratingText) ratingText.textContent = ratingLabels[selectedRating] || '';

        ratingStars.forEach(function(s) {
            var starValue = parseInt(s.getAttribute('data-value'));
            if (starValue <= selectedRating) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    });

    star.addEventListener('mouseenter', function() {
        var hoverVal = parseInt(this.getAttribute('data-value'));
        ratingStars.forEach(function(s) {
            var starValue = parseInt(s.getAttribute('data-value'));
            if (starValue <= hoverVal) {
                s.style.color = 'var(--primary)';
                s.style.transform = 'scale(1.1)';
            } else {
                s.style.color = 'rgba(255, 107, 53, 0.3)';
                s.style.transform = 'scale(1)';
            }
        });
    });

    star.addEventListener('mouseleave', function() {
        ratingStars.forEach(function(s) {
            var starValue = parseInt(s.getAttribute('data-value'));
            if (starValue <= selectedRating) {
                s.style.color = 'var(--primary)';
                s.style.transform = 'scale(1.1)';
            } else {
                s.style.color = 'rgba(255, 107, 53, 0.3)';
                s.style.transform = 'scale(1)';
            }
        });
    });
});

// Recommend buttons
document.querySelectorAll('.recommend-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.recommend-btn').forEach(function(b) { b.classList.remove('active'); });
        this.classList.add('active');
        var wouldRecommend = document.getElementById('would-recommend');
        if (wouldRecommend) wouldRecommend.value = this.getAttribute('data-value');
    });
});

if (feedbackForm) {
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var submitBtn = feedbackForm.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'सबमिट हो रहा है...';
        }

        var formData = {
            name: document.getElementById('feedback-name') ? document.getElementById('feedback-name').value : '',
            email: document.getElementById('feedback-email') ? document.getElementById('feedback-email').value : '',
            rating: selectedRating,
            consultation_type: document.getElementById('consultation-type') ? document.getElementById('consultation-type').value : '',
            astrologer: document.getElementById('astrologer') ? document.getElementById('astrologer').value : '',
            comment: document.getElementById('feedback-text') ? document.getElementById('feedback-text').value : '',
            would_recommend: document.getElementById('would-recommend') ? document.getElementById('would-recommend').value : ''
        };

        fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(function(res) {
            if (res.ok) {
                if (feedbackSuccessMsg) {
                    feedbackSuccessMsg.style.display = 'block';
                    feedbackForm.style.display = 'none';
                }
                if (feedbackErrorMsg) feedbackErrorMsg.style.display = 'none';
            } else {
                throw new Error('Submission failed');
            }
        })
        .catch(function(error) {
            if (feedbackErrorMsg) feedbackErrorMsg.style.display = 'block';
            if (feedbackSuccessMsg) feedbackSuccessMsg.style.display = 'none';
            console.error('Error:', error);
        })
        .finally(function() {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<svg style="width:20px;height:20px;stroke:currentColor;vertical-align:middle;margin-right:0.5rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>प्रतिक्रिया सबमिट करें';
            }
        });
    });
}

// Enquiry Form
var enquiryForm = document.getElementById('enquiry-form');
if (enquiryForm) {
    enquiryForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var submitBtn = enquiryForm.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'भेज रहे हैं...';
        }

        var formData = {
            name: document.getElementById('enquiry-name') ? document.getElementById('enquiry-name').value : '',
            email: document.getElementById('enquiry-email') ? document.getElementById('enquiry-email').value : '',
            phone: document.getElementById('enquiry-phone') ? document.getElementById('enquiry-phone').value : '',
            message: document.getElementById('enquiry-message') ? document.getElementById('enquiry-message').value : ''
        };

        fetch('/api/enquiry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(function(res) {
            if (res.ok) {
                alert('आपकी पूछताछ सफलतापूर्वक भेजी गई! हम जल्द ही आपसे संपर्क करेंगे।');
                enquiryForm.reset();
            } else {
                throw new Error('Failed');
            }
        })
        .catch(function(error) {
            alert('कुछ गलत हो गया। कृपया पुनः प्रयास करें।');
            console.error('Error:', error);
        })
        .finally(function() {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'भेजें';
            }
        });
    });
}

// Scroll-based animations
var observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .testimonial-card, .stat-card, .value-card').forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Navbar scroll effect
var navbar = document.querySelector('.navbar');
window.addEventListener('scroll', function() {
    if (window.pageYOffset > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// Newsletter form
var newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var emailInput = newsletterForm.querySelector('.newsletter-input');
        if (emailInput && emailInput.value) {
            fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInput.value })
            })
            .then(function() {
                alert('सदस्यता सफल! धन्यवाद।');
                emailInput.value = '';
            })
            .catch(function() {
                alert('कुछ गलत हो गया।');
            });
        }
    });
}

// Loading progress
var loadProgress = 0;
var loadingScreen = document.getElementById('loading-screen');

function updateProgress() {
    loadProgress += Math.random() * 30;
    if (loadProgress >= 100) {
        loadProgress = 100;
        setTimeout(function() {
            if (loadingScreen) loadingScreen.classList.add('hidden');
        }, 300);
    } else {
        setTimeout(updateProgress, 100);
    }
}

updateProgress();

// Ripple effect
function createRipple(event) {
    var button = event.currentTarget;
    var ripple = document.createElement('span');
    var rect = button.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height);
    var x = event.clientX - rect.left - size / 2;
    var y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    button.appendChild(ripple);
    setTimeout(function() { ripple.remove(); }, 600);
}

var rippleStyle = document.createElement('style');
rippleStyle.textContent = '.btn-primary,.service-btn,.cta-btn,.submit-btn{position:relative;overflow:hidden;}.ripple{position:absolute;border-radius:50%;background:rgba(255,255,255,0.5);transform:scale(0);animation:ripple-anim 0.6s ease-out;pointer-events:none;}@keyframes ripple-anim{to{transform:scale(4);opacity:0;}}';
document.head.appendChild(rippleStyle);

document.querySelectorAll('.btn-primary,.service-btn,.cta-btn,.submit-btn').forEach(function(button) {
    button.addEventListener('click', createRipple);
});
