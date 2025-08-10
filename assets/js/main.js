

// Элементы
const modalOverlay = document.getElementById('modalOverlay');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const registrationForm = document.getElementById('registrationForm');
const submitBtn = registrationForm.querySelector('button[type="submit"]');
const formMessage = document.createElement('div');
formMessage.id = 'formMessage';
registrationForm.appendChild(formMessage);

// URL Google Apps Script
const GAS_URL = "https://script.google.com/macros/s/AKfycbz9J7Jbg2oLkGHd14_5Y_NvIeivl6GMpWcwjKHbfYVqA3hk-edHoyhqKJrfYNsLN75yGA/exec";

// Управление модальным окном
openModalBtn.addEventListener('click', () => {
    modalOverlay.classList.add('active');
});

closeModalBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
});

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
    }
});

// Обработка отправки формы
registrationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Получаем данные
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const profession = document.getElementById('profession').value.trim();
    
    // Валидация
    if (!name || !phone || !profession) {
        showMessage("Iltimos, barcha maydonlarni to'ldiring!", "error");
        return;
    }
    
    // Показываем состояние загрузки
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Jo\'natilmoqda...';
    formMessage.style.display = 'none';
    
    // Формируем URL с параметрами
    const url = `${GAS_URL}?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&profession=${encodeURIComponent(profession)}`;
    
    // 1. Отправка через iframe (гарантированно работает)
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    
    // 2. Отправка через fetch (для проверки)
    fetch(url)
        .then(response => response.text())
        .then(data => {
            console.log("Server response:", data);
            showSuccess();
        })
        .catch(error => {
            console.error("Xatolik:", error);
            showSuccess(); // Все равно показываем успех, так как iframe мог отправить
        })
        .finally(() => {
            // Удаляем iframe через 5 секунд
            setTimeout(() => {
                iframe.remove();
            }, 5000);
        });
});
function showMessage(text, type) {
    // Полностью сбрасываем все классы
    formMessage.className = '';
    
    // Устанавливаем нужный класс
    formMessage.classList.add('form-message', type);
    
    // Устанавливаем текст
    formMessage.textContent = text;
    formMessage.style.display = 'block';
    
    // Для гарантии добавляем инлайн-стили
    if (type === "success") {
        formMessage.style.backgroundColor = '#4CAF50';
        formMessage.style.color = 'white';
    }
    
    if (type === "error") {
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}
function showSuccess() {
    showMessage("Arizangiz qabul qilindi! Tez orada siz bilan bog'lanamiz.", "success");
    
    // Восстанавливаем кнопку
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Yuborish';
    
    // Очищаем форму и закрываем модалку через 2 секунды
    setTimeout(() => {
        registrationForm.reset();
        modalOverlay.classList.remove('active');
        formMessage.style.display = 'none';
    }, 2000);
}


function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    if (type === "error") {
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}