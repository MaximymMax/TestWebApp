

 // Проверяем доступность Telegram.WebApp
if (window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
  
    // Сообщаем Telegram, что приложение готово
    tg.ready();
  
    // Получение информации о пользователе
    const user = tg.initDataUnsafe?.user;
    const userInfoDiv = document.getElementById("user-info");
    if (user) {
      userInfoDiv.innerHTML = `<p>Привет, <strong>${user.first_name} ${user.last_name || ""}</strong>!</p>`;
    } else {
      userInfoDiv.innerHTML = `<p>Информация о пользователе недоступна.</p>`;
    }
  
    // Настройка цветовой темы
    const theme = tg.themeParams;
    const themeInfoDiv = document.getElementById("theme-info");
    document.body.style.backgroundColor = theme.bg_color || "#ffffff";
    document.body.style.color = theme.text_color || "#000000";
    themeInfoDiv.innerHTML = `
      <p><strong>Цветовая тема:</strong></p>
      <ul>
        <li>Фон: ${theme.bg_color || "по умолчанию"}</li>
        <li>Текст: ${theme.text_color || "по умолчанию"}</li>
        <li>Ссылка: ${theme.link_color || "по умолчанию"}</li>
      </ul>
    `;
  
    // Работа с MainButton
    tg.MainButton.setText("Нажми меня!");
    tg.MainButton.onClick(() => {
      alert("Кнопка MainButton была нажата!");
      tg.MainButton.setText("Нажата!");
    });
    tg.MainButton.show();
  
    // Отправка данных
    const sendDataBtn = document.getElementById("send-data-btn");
    sendDataBtn.addEventListener("click", () => {
      tg.sendData("Пример данных из WebApp");
      alert("Данные отправлены!");
    });

    // Флаг для отслеживания состояния (видимы/скрыты)
    let controlsVisible = true;
    const toggleButton = document.getElementById("hide-button");
    // Обработчик нажатия на кнопку
    toggleButton.addEventListener('click', () => {
        if (controlsVisible) {
            // Скрыть кнопки управления
            Telegram.WebApp.hideHeader();  // Скрывает верхнюю панель
            Telegram.WebApp.MainButton.hide();  // Скрывает основную кнопку
            alert("Кнопки скрыты");
        } else {
            // Показать кнопки управления
            Telegram.WebApp.showHeader();  // Показывает верхнюю панель
            Telegram.WebApp.MainButton.show();  // Показывает основную кнопку
            alert("Кнопки показаны");
        }
        
        // Переключаем состояние
        controlsVisible = !controlsVisible;
    });
  
    // Закрытие приложения
    const closeAppBtn = document.getElementById("close-app-btn");
    closeAppBtn.addEventListener("click", () => {
      tg.close();
    });
  
    // Работа с HapticFeedback
    tg.HapticFeedback.impactOccurred("medium");
  } else {
    console.error("Telegram WebApp API недоступен.");
  }
