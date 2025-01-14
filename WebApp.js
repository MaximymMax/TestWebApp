const tg = window.Telegram?.WebApp;
let UserID = 6161616161619;
if(tg!=null && window.Telegram.WebApp.initDataUnsafe.user?.id!=null)
    UserID = window.Telegram.WebApp.initDataUnsafe.user.id;

const url = "https://kolbochkigameazure20250106140617.azurewebsites.net/api/Function1?code=r_DK3hIZOZ7nRm187lNvB8q5r_3Q1Uzx06vua4JVaCM4AzFuQH74Uw%3D%3D";

// Инициализация начального состояния игры
const stateLevel1 = [
    [1, 1, 1, 2],   // Колбочка 1 (красный)
    [2, 2, 2, 1],   // Колбочка 2 (желтый)
    []              // Пустая колбочка
  ];
  
  const stateLevel2 = [
    [1, 1, 1, 1],   // Колбочка 1 (красный)
    [2, 2, 3, 3],   // Колбочка 2 (желтый)
    [3, 3, 4, 4],   // Колбочка 3 (синий)
    [4, 4, 2, 2],   // Колбочка 4 (фиолетовый)
    [],             // Пустая колбочка
    []              // Пустая колбочка
  ];
  
  const stateLevel3 = [
    [1, 1, 1, 5],   // Колбочка 1 (красный)
    [2, 2, 2, 4],   // Колбочка 2 (желтый)
    [3, 3, 3, 3],   // Колбочка 3 (синий)
    [4, 4, 4, 2],   // Колбочка 4 (фиолетовый)
    [5, 5, 5, 1],   // Колбочка 5 (коричневый)
    [],             // Пустая колбочка
    [],             // Пустая колбочка
    [],             // Пустая колбочка
    [],             // Пустая колбочка
    [],             
    [], 
    []              
  ];


  async function fetchData() {
    const url = 'https://kolbochkigameazure20250106140617.azurewebsites.net/api/Function1?code=KEtqDwni_nnIIe0t3gw4IeqTeyeTudX4n4WxLetw9eprAzFuGucYWw%3D%3D'; // replace with your actual URL

    const requestData = {
        requestName: "UserInfo", // Название запроса
        UserID: UserID
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Проверяем структуру данных
            //alert("Успех "+ JSON.stringify(data));
            console.log('Успех', data);
            return [data.Lvl, JSON.parse(data.State), data.History ? JSON.parse(data.History) : null]; // History может быть null
    } catch (error) {
        //alert(`Error: ${error.message}`);
        console.error('Error during fetch or processing:', error);
    }
}

async function SaveData(Level, State, History) {
    const url = 'https://kolbochkigameazure20250106140617.azurewebsites.net/api/Function1?code=KEtqDwni_nnIIe0t3gw4IeqTeyeTudX4n4WxLetw9eprAzFuGucYWw%3D%3D'; // replace with your actual URL

    console.log('Данные'+JSON.stringify(Level)+' '+JSON.stringify(State)+' '+JSON.stringify(History), Level);
    const requestData = {
        requestName: "SaveUserInfo", // Название запроса
        UserID: UserID,
        Lvl: JSON.stringify(Level),
        State: JSON.stringify(State),
        History: JSON.stringify(History)
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

    } catch (error) {
        //alert(`Error: ${error.message}`);
        console.error('Error during fetch or processing:', error);
    }
}

async function NewLevel(Level){
    const requestData = {
        requestName: "NewLevel", // Название запроса
        UserID: UserID,
        Lvl: JSON.stringify(Level),
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });
        console.log('Новый уровень '+Level);

    } catch (error) {
        //alert(`Error: ${error.message}`);
        console.error('Error during fetch or processing:', error);
    }

}

function UserInfo1() {

    // Проверяем наличие ключа "LevelInfo"
    tg.CloudStorage.getItem("LevelInfo", (err, levelInfo) => {
        let level = null;
        if (err || !levelInfo || isNaN(Number(levelInfo))) {
            // Если LevelInfo пустое или ошибка, создаем нового пользователя
            alert(tg.version);
            createNewUser();
            level = 1; // Устанавливаем уровень по умолчанию
        } else {
            level = Number(levelInfo);
        }

        // Получаем массив массивов по ключу "ListOfFlasks"
        tg.CloudStorage.getItem("ListOfFlasks", (err, listOfFlasks) => {
            let flasks = null;
            if (!(err || !listOfFlasks)) {
                try {
                    flasks = JSON.parse(listOfFlasks);
                    if (!Array.isArray(flasks)) {
                        flasks = null; // Если данные не массив, вставляем null
                    }
                } catch (parseError) {
                    flasks = null; // Ошибка парсинга, вставляем null
                }
            }

            // Получаем второй массив массивов по ключу "ListOfSolutions"
            tg.CloudStorage.getItem("ListOfSolutions", (err, listOfSolutions) => {
                let solutions = null;
                if (err || !listOfSolutions) {
                    solutions = null; // Если ошибка или данных нет, вставляем null
                } else {
                    try {
                        solutions = JSON.parse(listOfSolutions);
                        if (!Array.isArray(solutions)) {
                            solutions = null; // Если данные не массив, вставляем null
                        }
                    } catch (parseError) {
                        solutions = null; // Ошибка парсинга, вставляем null
                    }
                }

                // Возвращаем результат как массив: [уровень, массивы, массивы]
                return([level, flasks, solutions]);
            });
        });
    });
}

window.fetchData = fetchData;

function createNewUser() {

    if (tg) {
        tg.cloudStorage.setItem("LevelInfo", "1");  // Устанавливаем уровень 1
        tg.cloudStorage.setItem("ListOfFlasks", JSON.stringify(stateLevel1));  // Пустой массив массивов для флаконов
        tg.cloudStorage.setItem("ListOfSolutions", JSON.stringify([[], []]));  // Пустой массив массивов для решений
    }
}
