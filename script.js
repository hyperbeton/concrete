document.addEventListener('DOMContentLoaded', function() {
    // Прелоадер
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 500);
    }

    // Инициализация AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-in-out',
            disable: function() {
                return window.innerWidth < 576;
            }
        });
    }

    // Мобильное меню
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.innerHTML = `
            <div class="mobile-links">
                <a href="#products">Продукция</a>
                <a href="#advantages">Преимущества</a>
                <a href="#projects">Проекты</a>
                <a href="#contacts">Контакты</a>
            </div>
            <div class="mobile-contacts">
                <a href="tel:+998977396164" class="btn btn-primary">
                    <i class="fas fa-phone-alt"></i>
                    <span>+998 97 739 61 64</span>
                </a>
                <a href="https://t.me/alimov_jasur?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21%20%D0%A5%D0%BE%D1%87%D1%83%20%D0%B7%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D1%82%D1%8C%20%D0%B1%D0%B5%D1%82%D0%BE%D0%BD" target="_blank" class="btn btn-secondary" id="mobileOrderBtn">
                    <span>Заказать бетон</span>
                    <i class="fab fa-telegram"></i>
                </a>
            </div>
        `;
        document.body.appendChild(mobileMenu);

        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Фиксация шапки
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Кнопка "Заказать" в шапке — открывает Telegram с готовым текстом
    const navOrderBtn = document.getElementById('navOrderBtn');
    if (navOrderBtn) {
        navOrderBtn.addEventListener('click', function() {
            const message = encodeURIComponent('Здравствуйте! Хочу заказать бетон.');
            window.open(`https://t.me/alimov_jasur?text=${message}`, '_blank');
        });
    }

    // Кнопки "Заказать" в карточках товаров
    document.querySelectorAll('.btn-order').forEach(btn => {
        btn.addEventListener('click', function() {
            const grade = this.getAttribute('data-grade') || '';
            let message = `Здравствуйте! Хочу заказать бетон марки ${grade}.`;
            const encoded = encodeURIComponent(message);
            window.open(`https://t.me/alimov_jasur?text=${encoded}`, '_blank');
        });
    });

    // Плавный скролл для кнопки "Наша продукция" на главной
    document.querySelectorAll('.hero-btns .btn-outline').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector('#products');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});