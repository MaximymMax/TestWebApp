let level = 0;
let state = null;
let HistoryOfMoves = null;
SetValues();

function SetValues(){
  fetchData()
    .then(result => {
        level = result[0];
        state = result[1];
        HistoryOfMoves = result[2]

        render();
    })
    .catch(error => {
        // Обработка ошибок
        console.error(error.message);
    });
}

// Переменная для хранения выбранной колбочки
let selectedColumn = null;

const BackButton = document.getElementById('BackButton');
BackButton.addEventListener('click', pourLiquidBack);

const ResetButton = document.getElementById('ResetLevel');
ResetButton.addEventListener('click', ResetLevel);

const lowerLiquidSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.65 28.65" style="width: 35px; height: 28px;">
  <path style="fill: red;" d="M0,0H34.65a0,0,0,0,1,0,0V12.65a16,16,0,0,1-16,16H16a16,16,0,0,1-16-16V0A0,0,0,0,1,0,0Z"/>
</svg>
`;

const liquidSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.65 28" style="width: 34px; height: 28px;">
  <rect style="fill: #ff0;" width="34.65" height="28"/>
</svg>
`;

// Основной SVG для колбочки
const svgMarkup = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 152" style="fill: none; stroke: #666; stroke-width: 2px; width: 42px; height: 152px;">
  <path d="M509.59,925.74H472.85a1.71,1.71,0,0,0-1.63,1.79v4.9a1.72,1.72,0,0,0,1.63,1.8h.69v122c0,10.77,7.92,19.51,17.68,19.51h0c9.77,0,17.68-8.74,17.68-19.51v-122h.69a1.72,1.72,0,0,0,1.63-1.8v-4.9A1.71,1.71,0,0,0,509.59,925.74Z" transform="translate(-470.22 -924.74)"/>
</svg>
`;

// Функция отрисовки игры
function render() {

  namelevel = document.getElementById("NameLevel");
  namelevel.textContent = 'Уровень ' + level;

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
      columnDiv.style.width = '42px'; // Ширина SVG
      columnDiv.style.height = '152px'; // Высота SVG
      columnDiv.style.margin = '10px'; // Расстояние между колбочками
      columnDiv.innerHTML = svgMarkup; // Вставляем SVG колбочки
      columnDiv.addEventListener('click', () => selectColumn(columnIndex));

      // Создаём контейнер для жидкостей под колбочкой
      const liquidContainer = document.createElement('div');
      liquidContainer.style.position = 'absolute';
      liquidContainer.style.bottom = '2px'; // Смещаем жидкости к низу SVG
      liquidContainer.style.left = '4px'; // Центрируем внутри SVG
      liquidContainer.style.width = '34px'; // Совпадает с шириной жидкостей

      if (selectedColumn === columnIndex) {
        const svg = columnDiv.querySelector('svg');
        if (svg) {
          svg.style.filter = 'drop-shadow(0 0 4px rgba(255, 0, 0, 3)) drop-shadow(0 0 12px rgba(255, 0, 0, 0.8))';
        }
      }
      // Добавляем жидкости в контейнер
      state[columnIndex].forEach((color, index) => {
        const liquidDiv = document.createElement('div');
        //liquidDiv.style.position = 'absolute';
        liquidDiv.style.height = '27px'; // Высота одного слоя жидкости
        const reversedIndex = state[columnIndex].length - 1 - index;
        if (index === state[columnIndex].length - 1) {
          // Если это нижняя жидкость, вставляем нижний SVG
          liquidDiv.innerHTML = lowerLiquidSvg.replace('red', getColor(state[columnIndex][reversedIndex])); // Меняем цвет на текущий
        } else {
          // Для остальных жидкостей вставляем обычный SVG
          liquidDiv.innerHTML = liquidSvg.replace('#ff0', getColor(state[columnIndex][reversedIndex])); // Меняем цвет на текущий
        }

        // Смещаем жидкость по вертикали
        liquidDiv.style.bottom = `${0}px`; // Смещаем жидкости на высоту слоя (28px)
        liquidDiv.style.zIndex = state[columnIndex].length - index; // Устанавливаем Z-индекс
        liquidContainer.appendChild(liquidDiv);
      });

      columnDiv.appendChild(liquidContainer);
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
async function selectColumn(colIndex) {
  if (selectedColumn === null) {
    if(state[colIndex].length == 0)
    return;
    selectedColumn = colIndex;
    highlightColumn(colIndex); // Подсвечиваем выбранную колбочку
  } else {
    if (selectedColumn !== colIndex) {
      if(pourLiquid(selectedColumn, colIndex)) // Переливаем жидкость, если выбрана другая колбочка
      selectedColumn = null; // Сбросить выбор

      if(LevelCompletionCheck())
      {
        unhighlightColumn(colIndex); // Убираем подсветку

        await NewLevel(level)
        SetValues();
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
  render();
}

// Функция убирает подсветку
function unhighlightColumn(colIndex) {
  render();
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

 if (!Array.isArray(HistoryOfMoves) || HistoryOfMoves.length === 0) {
    HistoryOfMoves = []; // Инициализация как массив массивов
  }
  HistoryOfMoves.push([fromIndex, toIndex]);
  
  if(fromColumn.length!=0 && toColumn.length!=5 && (toColumn.length == 0 || fromColumn[fromColumn.length-1] == toColumn[toColumn.length-1])){
    pourLiquid(fromIndex, toIndex)
    return true;
  }

  SaveData(level, state, HistoryOfMoves) 
  render(); // Обновляем отображение игры
  return true;
}

async function pourLiquidBack(){
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

  await SaveData(level, state, HistoryOfMoves) 
  await render();
}
async function ResetLevel() {
  if (level == 1) {
    await NewLevel(1);  // Ждем завершения NewLevel
  } else {
    await NewLevel(level - 1);  // Ждем завершения NewLevel
  }

  SetValues();  // Эта функция будет вызвана только после завершения NewLevel
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
