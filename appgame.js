
info = UserInfo();
level = info[0];
state = info[1];
HistoryOfMoves = info[2]

function SetValues(){
  info = UserInfo();
  level = info[0];
  state = info[1];
  HistoryOfMoves = info[2]
}

// Переменная для хранения выбранной колбочки
let selectedColumn = null;

const BackButton = document.getElementById('BackButton');
BackButton.addEventListener('click', pourLiquidBack);

// Функция отрисовки игры
function render() {

  namelevel = document.getElementById("NameLevel");
  namelevel.textContent = 'Уровень ' + window.Telegram.WebApp.version;
  
  const gameContainer = document.getElementById('SectionGame');
  gameContainer.innerHTML = ''; // Очистить контейнер

  // Определяем, сколько рядов нужно для колбочек
  const columnsPerRow = 5;
  const rows = Math.ceil(state.length / columnsPerRow);

  // Отрисовываем каждый ряд
  for (let row = 0; row < rows; row++) {
    const rowDiv = document.createElement('div');
    rowDiv.style.display = 'flex'; // Используем flexbox для размещения колбочек в ряд
    rowDiv.style.justifyContent = 'center'; // Центрируем колбочки по горизонтали

    // Отрисовываем колбочки в текущем ряду
    for (let col = 0; col < columnsPerRow; col++) {
      const columnIndex = row * columnsPerRow + col;
      if (columnIndex >= state.length) break; // Если колбочек меньше, чем место в ряду

      const columnDiv = document.createElement('div');
      columnDiv.classList.add('column');
      columnDiv.addEventListener('click', () => selectColumn(columnIndex));

      // Для каждой колбочки рисуем "жидкость"
      state[columnIndex].forEach((color, index) => {
        const liquidHeight = 140 / 5; // Высота каждой жидкости (200px высота колбочки, 4 слоя)
        const liquidDiv = document.createElement('div');
        liquidDiv.classList.add('liquid');
        liquidDiv.style.backgroundColor = getColor(color);
        liquidDiv.style.height = `${liquidHeight}px`; // Устанавливаем высоту слоя
        liquidDiv.style.position = 'absolute'; // Абсолютное позиционирование
        liquidDiv.style.bottom = `${index * liquidHeight}px`; // Смещаем слой вверх на высоту предыдущих
        columnDiv.appendChild(liquidDiv);
      });

      rowDiv.appendChild(columnDiv);
    }

    gameContainer.appendChild(rowDiv);
  }
}

// Функция получения цвета по индексу
function getColor(colorId) {
  // Возвращаем цвет по ID
  const colors = ['#fff', '#ff0000', '#ffff00', '#0000ff', '#800080', '#a52a2a']; // 1 - красный, 2 - желтый, 3 - синий, 4 - фиолетовый, 5 - коричневый
  return colors[colorId];
}

// Функция выбора колбочки
function selectColumn(colIndex) {
  if (selectedColumn === null) {
    if(state[colIndex].length == 0)
    return;
    selectedColumn = colIndex;
    highlightColumn(colIndex); // Подсвечиваем выбранную колбочку
  } else {
    if (selectedColumn !== colIndex) {
      if(pourLiquid(selectedColumn, colIndex)) // Переливаем жидкость, если выбрана другая колбочка
      selectedColumn = null; // Сбросить выбор

      SaveInfo("ListOfFlasks", state);
      SaveInfo("ListOfSolutions", HistoryOfMoves);

      if(LevelCompletionCheck())
      {
        unhighlightColumn(colIndex); // Убираем подсветку

        level++;
        if(level == 4)
        level = 1;

        namelevel = document.getElementById("NameLevel")
        namelevel.textContent = 'Уровень ' + level;
        NewLevel(level);
        SetValues();
        render();
        return;
      }
    }
    else{
      selectedColumn = null;
    }
    unhighlightColumn(colIndex); // Убираем подсветку
  }
}

// Функция подсветки колбочки
function highlightColumn(colIndex) {
  const columns = document.querySelectorAll('.column');
  columns[colIndex].classList.add('selected'); // Добавляем класс для подсветки
}

// Функция убирает подсветку
function unhighlightColumn(colIndex) {
  const columns = document.querySelectorAll('.column');
  columns[colIndex].classList.remove('selected'); // Убираем класс подсветки
}

// Функция переливания жидкости из одной колбочки в другую
function pourLiquid(fromIndex, toIndex) {
  const fromColumn = state[fromIndex];
  const toColumn = state[toIndex];

  // Проверяем, можно ли перелить
  // 1. Целевая колбочка не должна быть полной (макс 5 жидкости)
  // 2. Цвет жидкости должен быть одинаковым
  if (toColumn.length === 5 || (toColumn.length != 0 && fromColumn[fromColumn.length - 1] !== toColumn[toColumn.length - 1])) {
    alert('Переливание невозможно'); // Если одно из условий не выполнено, выводим сообщение
    return false;
  }

  // Переливаем жидкость
  const liquid = fromColumn.pop(); // Убираем жидкость с исходной колбочки
  toColumn.push(liquid); // Добавляем жидкость в целевую колбочку

  HistoryOfMoves.push([fromIndex, toIndex])
 
  if(fromColumn.length!=0 && toColumn.length!=5 && (toColumn.length == 0 || fromColumn[fromColumn.length-1] == toColumn[toColumn.length-1])){
    pourLiquid(fromIndex, toIndex)
    return true;
  }


  render(); // Обновляем отображение игры
  return true;
}

function pourLiquidBack(){
  const move = HistoryOfMoves[HistoryOfMoves.length-1];
  const toColumn = state[move[0]];
  const fromColumn = state[move[1]];

  const liquid = fromColumn.pop();
  toColumn.push(liquid);

  HistoryOfMoves.pop();
  if(selectedColumn != null){
    unhighlightColumn(selectedColumn)
    selectedColumn = null;
  }

  if(HistoryOfMoves.length!=0 && HistoryOfMoves[HistoryOfMoves.length-1][0] == move[0] && HistoryOfMoves[HistoryOfMoves.length-1][1] == move[1])
  {
    pourLiquidBack();
    return;
  }

  SaveInfo("ListOfFlasks", state);
  SaveInfo("ListOfSolutions", HistoryOfMoves);

  render();
}

function LevelCompletionCheck()
{
  const colorCount = {};

  // Проходим по каждой колбочке
  for (let column of state) {
    if (column.length > 0) {
      // Проверяем, что в колбочке все элементы одинаковые
      const firstColor = column[0];
      if (column.some(color => color !== firstColor)) {
        return false; // Если в колбочке есть разные цвета, сразу возвращаем false
      }

      // Подсчитываем количество вхождений этого цвета
      if (colorCount[firstColor]) {
        return false; // Если этот цвет уже встречался в другой колбочке, возвращаем false
      }
      colorCount[firstColor] = 1;
    }
  }

  return true; // Если все проверки пройдены, возвращаем true
}

// Вызов функции отрисовки
render();
