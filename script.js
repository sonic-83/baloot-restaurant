document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // تعریف متغیرهای اصلی
    const menuScrollNav = document.querySelector('.menu-scroll-nav');
    const backToTopBtn = document.getElementById('back-to-top');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuSections = document.querySelectorAll('.section');
    const menuItems = document.querySelectorAll('.menu-item');
    const outOfStockItems = document.querySelectorAll('.out-of-stock');
    const todaySpecialContainer = document.getElementById('today-special');

    // نام روزهای هفته به فارسی و انگلیسی
    const daysMapping = {
        sunday: { name: 'یکشنبه', order: 0 },
        monday: { name: 'دوشنبه', order: 1 },
        tuesday: { name: 'سه‌شنبه', order: 2 },
        wednesday: { name: 'چهارشنبه', order: 3 },
        thursday: { name: 'پنجشنبه', order: 4 },
        friday: { name: 'جمعه', order: 5 },
        saturday: { name: 'شنبه', order: 6 }
    };

    // تابع چسبندگی نوار منو
    function handleStickyNav() {
        if (window.scrollY > 100) {
            menuScrollNav.classList.add('sticky');
        } else {
            menuScrollNav.classList.remove('sticky');
        }
    }

    // 3. تابع نمایش/مخفی کردن دکمه بازگشت به بالا - بدون تغییر
    function handleBackToTop() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }

    // 4. تابع اسکرول نرم - نسخه قبلی شما
    function setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });

                    // آپدیت وضعیت فعال برای دکمه‌های دسته‌بندی
                    if (this.classList.contains('category-btn')) {
                        updateActiveCategory(this);
                    }
                }
            });
        });
    }

    // 5. تابع به‌روزرسانی دسته‌بندی فعال - نسخه قبلی شما
    function updateActiveCategory(activeBtn) {
        categoryBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    // 6. تابع هایلایت بخش فعال - نسخه قبلی شما
    function highlightActiveSection() {
        let current = '';
        
        menuSections.forEach(section => {
            const sectionTop = section.offsetTop;
            
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        categoryBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('href') === `#${current}`) {
                btn.classList.add('active');
            }
        });
    }

    // 7. تابع انیمیشن آیتم‌های منو - نسخه قبلی شما
    function animateMenuItems() {
        menuItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (itemTop < windowHeight - 100) {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }
        });
    }

    // 8. تابع تنظیم اولیه انیمیشن‌ها - نسخه قبلی شما
    function setupInitialAnimations() {
        menuItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
    }

    // 9. تابع مدیریت آیتم‌های ناموجود - نسخه قبلی شما
    function setupOutOfStockItems() {
        outOfStockItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                alert('این آیتم در حال حاضر موجود نمی‌باشد. لطفاً گزینه دیگری انتخاب کنید.');
            });
        });
    }

    // 10. تابع دکمه بازگشت به بالا - بدون تغییر
    function setupBackToTop() {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    

    // 11. توابع مدیریت پیشنهاد ویژه روز - بدون تغییر
     // توابع مدیریت پیشنهاد ویژه روز - متناسب با ساختار JSON شما
     function manageDailySpecials() {
        const specialData = JSON.parse(document.getElementById('special-items-data').textContent);
        const specialItems = specialData.items;
        
        // دریافت روز فعلی هفته (0 یکشنبه، 1 دوشنبه، ..., 6 شنبه)
        const dayOfWeek = new Date().getDay();
        
        // پیدا کردن کلید روز جاری بر اساس مقدار عددی
        const currentDayKey = Object.keys(daysMapping).find(key => 
            daysMapping[key].order === dayOfWeek
        );
        
        if (currentDayKey && specialItems[currentDayKey]) {
            const todaySpecial = specialItems[currentDayKey];
            const todayName = daysMapping[currentDayKey].name;
            
            updateSpecialHighlight(todaySpecial, todayName);
            markDailySpecialInMenu(todaySpecial.id);
        }
    }

    function updateSpecialHighlight(item, dayName) {
        const highlightHTML = `
            <div class="highlight-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="highlight-details">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <p class="day-indicator">پیشنهاد ویژه ${dayName}</p>
                <span class="price">${item.price}</span>
            </div>
        `;
        
        todaySpecialContainer.innerHTML = highlightHTML;
    }

    function markDailySpecialInMenu(itemId) {
        document.querySelectorAll('.daily-special').forEach(item => {
            item.classList.remove('daily-special');
            const label = item.querySelector('.daily-special-label');
            if (label) label.remove();
        });
        
        const targetItem = document.getElementById(itemId);
        if (targetItem) {
            targetItem.classList.add('daily-special');
            const label = document.createElement('span');
            label.className = 'daily-special-label';
            label.innerHTML = '<i class="fas fa-crown"></i> پیشنهاد روز';
            targetItem.prepend(label);
        }
    }

    // مقداردهی اولیه و تنظیم رویدادها
    function init() {
        setupInitialAnimations();
        setupSmoothScrolling();
        setupOutOfStockItems();
        setupBackToTop();
        
        // بررسی پیشنهاد روز
        const lastDate = localStorage.getItem('dailySpecialDate');
        const today = new Date().toISOString().split('T')[0];
        
        if (!lastDate || lastDate !== today) {
            manageDailySpecials();
            localStorage.setItem('dailySpecialDate', today);
        } else {
            manageDailySpecials(); // برای نمایش پیشنهاد امروز حتی اگر تاریخ تغییر نکرده باشد
        }

        // رویدادهای اسکرول
        window.addEventListener('scroll', function() {
            handleStickyNav();
            handleBackToTop();
            highlightActiveSection();
            animateMenuItems();
        });

        // اجرای اولیه انیمیشن
        animateMenuItems();
    }

    // اجرای اولیه
    init();
});