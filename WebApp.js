const tg = window.Telegram?.WebApp;

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
  

function UserInfo() {

    // Проверяем, существует ли tg
    if (!tg) {
        return [1, stateLevel1, []];  // Если tg нет, сразу возвращаем массив с null
    }

    tg.cloudStorage.setItem("penis", "penis_info");  // Устанавливаем уровень 1

    tg.CloudStorage.getItem("penis", (err, levelInfo) => {  alert(tg.CloudStorage.getItem("levelInfo")); })
    
    // Проверяем наличие ключа "LevelInfo"
    tg.cloudStorage.getItem("LevelInfo", (err, levelInfo) => {
        let level = null;
        if (err || !levelInfo || isNaN(Number(levelInfo))) {
            // Если LevelInfo пустое или ошибка, создаем нового пользователя
            createNewUser();
            level = 1; // Устанавливаем уровень по умолчанию
        } else {
            level = Number(levelInfo);
        }
                alert(tg.version);
        // Получаем массив массивов по ключу "ListOfFlasks"
        tg.cloudStorage.getItem("ListOfFlasks", (err, listOfFlasks) => {
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
            tg.cloudStorage.getItem("ListOfSolutions", (err, listOfSolutions) => {
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

window.UserInfo = UserInfo;

function createNewUser() {

    if (tg) {
        tg.cloudStorage.setItem("LevelInfo", "1");  // Устанавливаем уровень 1
        tg.cloudStorage.setItem("ListOfFlasks", JSON.stringify(stateLevel1));  // Пустой массив массивов для флаконов
        tg.cloudStorage.setItem("ListOfSolutions", JSON.stringify([[], []]));  // Пустой массив массивов для решений
    }
}

window.createNewUser = createNewUser;

function SaveInfo(Name, Value){
    if(tg){
        if(Name == "LevelInfo")
            tg.cloudStorage.setItem(Name, Value);
        else if(Name == "ListOfFlasks" || Name == "ListOfSolutions")
            tg.cloudStorage.setItem(Name, JSON.stringify(Value));
    }
}

window.SaveInfo = SaveInfo;

function NewLevel(level){

    if(!tg)
    {
        if(level == 1){
            tg.cloudStorage.setItem("LevelInfo", "1");
            tg.cloudStorage.setItem("ListOfFlasks", JSON.stringify(stateLevel1)); 
        }
        else if(level == 2){
            tg.cloudStorage.setItem("LevelInfo", "2");
            tg.cloudStorage.setItem("ListOfFlasks", JSON.stringify(stateLevel2)); 
        }
        else if(level == 3){
            tg.cloudStorage.setItem("LevelInfo", "3");
            tg.cloudStorage.setItem("ListOfFlasks", JSON.stringify(stateLevel3)); 
        }
        tg.cloudStorage.setItem("ListOfSolutions", JSON.stringify([]));
    }

}

window.NewLevel = NewLevel;
