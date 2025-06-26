document.addEventListener('DOMContentLoaded', function() {
    // Прелоадер
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });

    // Инициализация AOS
    AOS.init({
        duration: 800,
        once: true,
        easing: 'ease-in-out'
    });

    // Мобильное меню
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.innerHTML = `
        <div class="mobile-links">
            <a href="#calculator">Калькулятор</a>
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
            <button class="btn btn-secondary" id="mobileOrderBtn">
                <span>Заказать бетон</span>
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;
    document.body.appendChild(mobileMenu);

    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    // Закрытие меню при клике на ссылку
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Фиксация шапки при скролле
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Модальное окно
    const modal = document.getElementById('orderModal');
    const modalClose = document.getElementById('modalClose');
    const openModalButtons = [
        document.getElementById('navOrderBtn'),
        document.getElementById('heroOrderBtn'),
        document.getElementById('ctaOrderBtn'),
        document.getElementById('mobileOrderBtn'),
        ...document.querySelectorAll('.btn-order')
    ];

    function openModal() {
        document.body.classList.add('no-scroll');
        modal.classList.add('active');
    }

    function closeModal() {
        document.body.classList.remove('no-scroll');
        modal.classList.remove('active');
    }

    openModalButtons.forEach(btn => {
        if (btn) btn.addEventListener('click', openModal);
    });

    modalClose.addEventListener('click', closeModal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Данные для калькулятора
    const concreteData = {
        grades: {
            'M100': { price: 500000, name: 'M100 (B7.5)', type: 'standard' },
            'M150': { price: 505000, name: 'M150 (B10)', type: 'standard' },
            'M200': { price: 530000, name: 'M200 (B15)', type: 'standard' },
            'M250': { price: 560000, name: 'M250 (B20)', type: 'standard' },
            'M300': { price: 590000, name: 'M300 (B22.5)', type: 'standard' },
            'M350': { price: 598000, name: 'M350 (B25)', type: 'standard' },
            'M400': { price: 632000, name: 'M400 (B30)', type: 'standard' },
            'M450': { price: 655000, name: 'M450 (B35)', type: 'standard' },
            'M550': { price: 705000, name: 'M550 (B40)', type: 'standard' },
            'M600': { price: 735000, name: 'M600 (B45)', type: 'standard' },
            'M100-fine': { price: 540000, name: 'M100 (B7.5) мелкозернистый', type: 'fine' },
            'M150-fine': { price: 552000, name: 'M150 (B10) мелкозернистый', type: 'fine' },
            'M200-fine': { price: 570000, name: 'M200 (B15) мелкозернистый', type: 'fine' },
            'M250-fine': { price: 605000, name: 'M250 (B20) мелкозернистый', type: 'fine' },
            'M300-fine': { price: 635000, name: 'M300 (B22.5) мелкозернистый', type: 'fine' },
            'M350-fine': { price: 645000, name: 'M350 (B25) мелкозернистый', type: 'fine' }
        },
        delivery: {
            basePrice: 0,
            distancePrices: {
                '10': 0,
                '20': 50000,
                '30': 100000,
                '40': 150000
            }
        }
    };

    // Текущие значения калькулятора
    let calculatorState = {
        grade: 'M200',
        volume: 5,
        deliveryAddress: '',
        deliveryDate: '',
        deliveryTime: '8:00-12:00',
        name: '',
        phone: '',
        email: '',
        notes: ''
    };

    // Форматирование чисел
    function formatNumber(number) {
        return new Intl.NumberFormat('ru-RU').format(number);
    }

    // Валидация телефона
    function validatePhone(phone) {
        const regex = /^\+998\d{9}$/;
        return regex.test(phone);
    }

    // Маска для телефона
    document.getElementById('modalPhone').addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        if (value.startsWith('998')) {
            value = '+' + value;
        } else if (!value.startsWith('+998') && value.length > 0) {
            value = '+998' + value;
        }
        this.value = value.substring(0, 13);
    });

    // Обновление итоговой суммы
    function updateTotal() {
        const gradePrice = concreteData.grades[calculatorState.grade].price;
        const total = gradePrice * calculatorState.volume;
        
        document.getElementById('summaryGrade').textContent = concreteData.grades[calculatorState.grade].name;
        document.getElementById('summaryVolume').textContent = `${calculatorState.volume} м³`;
        document.getElementById('summaryDelivery').textContent = 
            `${calculatorState.deliveryAddress || 'Не указано'}, ${calculatorState.deliveryDate || 'Не указано'}, ${calculatorState.deliveryTime}`;
        document.getElementById('summaryTotal').textContent = `${formatNumber(total)} сум`;
    }

    // Кнопки заказа в карточках продукции
    document.querySelectorAll('.btn-order').forEach(btn => {
        btn.addEventListener('click', function() {
            const grade = this.getAttribute('data-grade');
            if (grade) {
                document.getElementById('modalGrade').value = grade;
            }
            
            // Если объем был указан в калькуляторе, переносим его в модальное окно
            if (calculatorState.volume && calculatorState.volume > 0) {
                document.getElementById('modalVolume').value = calculatorState.volume;
            }
        });
    });

    // Обработчик отправки формы
    document.getElementById('orderForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Получаем значения из формы
        const name = document.getElementById('modalName').value;
        const phone = document.getElementById('modalPhone').value;
        const email = document.getElementById('modalEmail').value;
        const grade = document.getElementById('modalGrade').value;
        const volume = parseFloat(document.getElementById('modalVolume').value);
        const address = document.getElementById('modalAddress').value;
        const comment = document.getElementById('modalComment').value;
        
        // Проверка обязательных полей
        if (!phone) {
            showNotification('Пожалуйста, укажите ваш телефон', 'error');
            return;
        }
        
        // Проверка формата телефона
        if (!validatePhone(phone)) {
            showNotification('Пожалуйста, укажите телефон в формате +998XXXXXXXXX', 'error');
            return;
        }
        
        if (!grade || grade === '') {
            showNotification('Пожалуйста, выберите марку бетона', 'error');
            return;
        }
        
        if (!volume || volume < 1) {
            showNotification('Пожалуйста, укажите объем не менее 1 м³', 'error');
            return;
        }
        
        // Если все проверки пройдены, формируем сообщение
        const totalPrice = concreteData.grades[grade].price * volume;
        
        const message = `🚀 *Новая заявка на бетон* 🚀

▫️ *Имя*: ${name || 'Не указано'}
▫️ *Телефон*: \`${phone}\`
${email ? `▫️ *Email*: ${email}\n` : ''}
▫️ *Марка бетона*: ${concreteData.grades[grade].name}
▫️ *Объем*: ${volume} м³
${address ? `▫️ *Адрес доставки*: ${address}\n` : ''}
💰 *Сумма*: ${formatNumber(totalPrice)} сум
${comment ? `\n📝 *Комментарий*: ${comment}` : ''}

#заявка`;
        
        // Здесь должен быть ваш токен бота и chat_id
        const botToken = '7931791308:AAGxczmuOyORYT4MdYinHBuThStRWB8deiM';
        const chatId = '-1002334913768';
        
        // Отправка в Telegram
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        })
        .then(response => {
            if (!response.ok) throw new Error('Ошибка отправки');
            return response.json();
        })
        .then(data => {
            showNotification('✅ Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
            closeModal();
            this.reset();
        })
        .catch(error => {
            console.error('Ошибка:', error);
            showNotification('❌ Ошибка отправки. Пожалуйста, позвоните нам напрямую.', 'error');
        });
    });

    // Уведомление
    function showNotification(text, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                ${type === 'success' ? '<i class="fas fa-check"></i>' : '<i class="fas fa-exclamation"></i>'}
            </div>
            <div class="notification-text">
                <p>${text}</p>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // Работа калькулятора
    const calcSteps = document.querySelectorAll('.calc-step');
    const calcPages = document.querySelectorAll('.calc-page');
    
    // Переключение шагов калькулятора
    calcSteps.forEach(step => {
        step.addEventListener('click', function() {
            const stepNumber = this.getAttribute('data-step');
            setActiveStep(stepNumber);
        });
    });
    
    // Кнопки "Далее" и "Назад"
    document.querySelectorAll('[data-next]').forEach(btn => {
        btn.addEventListener('click', function() {
            const nextStep = this.getAttribute('data-next');
            setActiveStep(nextStep);
        });
    });
    
    document.querySelectorAll('[data-prev]').forEach(btn => {
        btn.addEventListener('click', function() {
            const prevStep = this.getAttribute('data-prev');
            setActiveStep(prevStep);
        });
    });
    
    function setActiveStep(stepNumber) {
        // Обновляем активный шаг в сайдбаре
        calcSteps.forEach(step => {
            step.classList.remove('active');
            if (step.getAttribute('data-step') === stepNumber) {
                step.classList.add('active');
            }
        });
        
        // Показываем соответствующую страницу
        calcPages.forEach(page => {
            page.classList.remove('active');
            if (page.getAttribute('data-page') === stepNumber) {
                page.classList.add('active');
            }
        });
    }
    
    // Выбор марки бетона
    document.querySelectorAll('.grade-option').forEach(option => {
        option.addEventListener('click', function() {
            const grade = this.getAttribute('data-grade');
            calculatorState.grade = grade;
            updateTotal();
            setActiveStep('2');
        });
    });
    
    // Слайдер объема
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');
    
    volumeSlider.addEventListener('input', function() {
        const value = this.value;
        volumeValue.textContent = value;
        calculatorState.volume = parseFloat(value);
        updateTotal();
    });
    
    // Кнопки быстрого выбора объема
    document.querySelectorAll('[data-volume]').forEach(btn => {
        btn.addEventListener('click', function() {
            const volume = this.getAttribute('data-volume');
            volumeSlider.value = volume;
            volumeValue.textContent = volume;
            calculatorState.volume = parseFloat(volume);
            updateTotal();
        });
    });
    
    // Сохранение данных доставки
    document.getElementById('deliveryAddress').addEventListener('change', function() {
        calculatorState.deliveryAddress = this.value;
        updateTotal();
    });
    
    document.getElementById('deliveryDate').addEventListener('change', function() {
        calculatorState.deliveryDate = this.value;
        updateTotal();
    });
    
    document.getElementById('deliveryTime').addEventListener('change', function() {
        calculatorState.deliveryTime = this.value;
        updateTotal();
    });
    
    // Сохранение контактных данных
    document.getElementById('clientName').addEventListener('change', function() {
        calculatorState.name = this.value;
    });
    
    document.getElementById('clientPhone').addEventListener('change', function() {
        calculatorState.phone = this.value;
    });
    
    document.getElementById('clientEmail').addEventListener('change', function() {
        calculatorState.email = this.value;
    });
    
    document.getElementById('clientNotes').addEventListener('change', function() {
        calculatorState.notes = this.value;
    });
    
    // Отправка формы калькулятора
    document.getElementById('submitOrder').addEventListener('click', function() {
        const name = document.getElementById('clientName').value;
        const phone = document.getElementById('clientPhone').value;
        
        if (!phone) {
            showNotification('Пожалуйста, укажите ваш телефон', 'error');
            return;
        }
        
        if (!validatePhone(phone)) {
            showNotification('Пожалуйста, укажите телефон в формате +998XXXXXXXXX', 'error');
            return;
        }
        
        // Если все проверки пройдены, открываем модальное окно с заполненными данными
        document.getElementById('modalName').value = name;
        document.getElementById('modalPhone').value = phone;
        document.getElementById('modalEmail').value = document.getElementById('clientEmail').value;
        document.getElementById('modalGrade').value = calculatorState.grade;
        document.getElementById('modalVolume').value = calculatorState.volume;
        document.getElementById('modalAddress').value = calculatorState.deliveryAddress;
        document.getElementById('modalComment').value = document.getElementById('clientNotes').value;
        
        openModal();
    });

    // Инициализация калькулятора
    updateTotal();
});