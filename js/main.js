console.log('проверка подключения');
// функция - инициализации начальных условий 
function initializingСonditions(mapWith, mapHeight, fieldSize, map, sword, healthPotion, opponentCount, enemies, x, y, health, attack) {
    let mapInitial = {
        // Создаем карту - 
        mapWith: mapWith,
        mapHeight: mapHeight,
        // подбираем размер клетки, еще уменьшил поле в CSS, что точно совпало
        fieldSize: fieldSize,
        // массив для карты
        map: map,
    };
    // создаем объект: мечи и бутылки
    let items = {
        sword: sword,
        healthPotion: healthPotion,
    };
    // объект для врагов: количество врагов и массив
    let opponentInit = {
        opponentCount: opponentCount,
        enemies: enemies,
    }
    // объект для героя
    let heroInit = {
        x: x,
        y: y,
        health: health,
        attack: attack
    };


    return {
        mapInitial,
        items,
        opponentInit,
        heroInit
    };
}
// функция - создания стен - матрица
function create2DArray(x, y, width, height, initialValue, arr) {
    // let arr = [];
    for (let i = y; i < y + height; i++) {
        if (arr.length < height) {
            arr[i] = [];
        }
        for (let j = x; j < x + width; j++) {
            arr[i][j] = initialValue;
        }
    }
    return arr;
}
//функция - создания комнат
function rectangularRoom(mapWith, mapHeight, map) {
    for (let index = 0; index < (Math.floor(Math.random() * (10 - 5 + 1)) + 5); index++) {
        let rWidth = Math.floor(Math.random() * 6) + 3;
        let rHeight = Math.floor(Math.random() * 6) + 3;
        let x = Math.floor(Math.random() * (mapWith - rWidth - 1)) + 1;
        let y = Math.floor(Math.random() * (mapHeight - rHeight - 1)) + 1;
        create2DArray(x, y, rWidth, rHeight, 'tile', map);
    }
}
// функция - создания корридоров
function createCorridors(mapWith, mapHeight, map) {
    // вертикаль
    for (let i = 0; i < Math.floor(Math.random() * 3) + 3; i++) {
        let X = Math.floor(Math.random() * (mapWith - 2)) + 1;
        for (let y = 1; y < mapHeight - 1; y++) {
            map[y][X] = 'tile';
        }
    }
    // горизонталь
    for (let i = 0; i < Math.floor(Math.random() * 3) + 3; i++) {
        let Y = Math.floor(Math.random() * (mapHeight - 2)) + 1; //
        for (let x = 1; x < mapWith - 1; x++) {
            map[Y][x] = 'tile'; //
        }
    }
}
// функция - здоровья
function potion(mapWith, mapHeight, items, map) {
    for (let index = 0; index < items; index++) {
        let x = 0;
        let y = 0;
        while (map[y][x] !== 'tile') {
            x = Math.floor(Math.random() * mapWith);
            y = Math.floor(Math.random() * mapHeight);
        }
        if (x != 0 && y != 0) {
            map[y][x] = 'tileHP';
        }
    }
}
// функция -  мечи
function saber(mapWith, mapHeight, items, map) {
    for (let index = 0; index < items; index++) {
        let x = 0;
        let y = 0;
        while (map[y][x] !== 'tile') {
            x = Math.floor(Math.random() * mapWith);
            y = Math.floor(Math.random() * mapHeight);
        }
        if (x != 0 && y != 0) {
            map[y][x] = 'tileSW';
        }
    }
}
// функция - свободные места
function availableSeats(mapWith, mapHeight, map, x, y) {
    let emptyTiles = [];
    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWith; x++) {
            if (map[y][x] === 'tile') {
                emptyTiles.push({
                    x: x,
                    y: y
                });
            }
        }
    }
    return emptyTiles;
}
// функция - враги
function rival(emptyTiles, map, opponentCount, enemies) {
    for (let index = 0; index < opponentCount; index++) {
        let randomIndex = Math.floor(Math.random() * emptyTiles.length);
        let randomTile = emptyTiles[randomIndex];
        let {
            x,
            y
        } = randomTile;
        enemies.push({
            x: x,
            y: y,
            health: 70,
            attack: 5
        });
        map[y][x] = 'tileE';
        emptyTiles.splice(randomIndex, 1);
    }

    return emptyTiles;
}
// функция - герой
function geroy(mapWith, mapHeight, map, heroX, heroY) {
    do {
        heroX = Math.floor(Math.random() * mapWith);
        heroY = Math.floor(Math.random() * mapHeight);
    } while (map[heroY][heroX] !== 'tile');
    map[heroY][heroX] = 'tileP';
    return {
        heroX,
        heroY
    };
}
// функция - обновление карты
function updateMap(mapWith, mapHeight, map, fieldSize, heroH, heroA, enemies) {
    // Функция $() возвращает объект jQuery, содержащий массив элементов DOM — так называемый обернутый набор,
    // соответствующих указанному селектору.
    // Большинство методов возвращает по завершении действий первоначальный набор элементов.
    let field = $('.field');
    // Удаляет содержимое всех элементов набора, удаляя все содержимое,
    // а также все дочерние элементы, находящиеся внутри него.
    field.empty();

    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWith; x++) {
            // новый элемент на карте через jQuery, т.е. на divах 
            let tile = $('<div>').addClass('tile').addClass(map[y][x]);
            tile.css({
                left: x * fieldSize + 'px',
                top: y * fieldSize + 'px',
                width: fieldSize + 'px',
                height: fieldSize + 'px',
            });
            // Добавляем полоску здоровья герою, если он находится на клетке 'tileP' и у него есть здоровье
            if (map[y][x] === 'tileP' && heroH) {
                tile.append(createHealthBar(heroH));
                // содержимое1 — в качестве содержимого добавляется HTML-элемент, массив, строка или объект jQuery.
            }

            // Добавляем полоску здоровья противнику, если он находится на клетке 'tileE' и у него есть здоровье
            if (map[y][x] === 'tileE' && enemies.length > 0) {
                let enemy = enemies.find((enemy) => enemy.x === x && enemy.y === y);
                if (enemy && enemy.health) {
                    tile.append(createHealthBar(enemy.health));
                    // содержимое1 — в качестве содержимого добавляется HTML-элемент, массив, строка или объект jQuery.
                }
            }

            // Атака противников на героя
            if (map[y][x] === 'tileE' && heroH && isPlayerAdjacent(x, y, map, mapWith, mapHeight)) {
                heroH -= 5; // Уменьшаем здоровье героя на 5
                if (heroH == 0) {
                    location.reload();
                }
            }
            $('.hp').html(`ХП: ${heroH} %`);
            // изменит содержимое всех элементов с классом .hp 
            $('.attack').html(`Урон: ${heroA}`);
            // Добавляем плитку на поле
            field.append(tile);
        }
    }
}
// функция - длина здоровья
function createHealthBar(health) {
    return $('<div>')
        .addClass('health')
        .css({
            width: health + '%',
        });
}
// функция - проверки наличия игрока в соседней клетке
function isPlayerAdjacent(x, y, map, mapWith, mapHeight) {
    return (
        (x > 0 && map[y][x - 1] === 'tileP') || // Слева
        (x < mapWith - 1 && map[y][x + 1] === 'tileP') || // Справа
        (y > 0 && map[y - 1][x] === 'tileP') || // Сверху
        (y < mapHeight - 1 && map[y + 1][x] === 'tileP') // Снизу
    );
}
// функция - проверки координат противника
function isEnemyAt(x, y, map) {
    return map[y][x] === 'tileE';
}
//функция - cтены
function canMoveTo(x, y, map, mapWith, mapHeight) {
    let tile = map[y][x];
    return (
        x >= 0 &&
        x < mapWith &&
        y >= 0 &&
        y < mapHeight &&
        (tile !== 'tileW' || tile === 'tileSW' || tile === 'tileHP')
    );
}
//функция - перемещени
function moveHeroTo(x, y, map, hero) {
    map[hero.y][hero.x] = 'tile';
    hero.x = x;
    hero.y = y;
    map[y][x] = 'tileP';
}
// функция - атака героем
function attackEnemies(enemies, hero, map) {
    for (let enemy of enemies) {
        if (Math.abs(hero.x - enemy.x) + Math.abs(hero.y - enemy.y) === 1) {
            // урон
            enemy.health -= hero.attack;
            // мертвый противник
            if (enemy.health <= 0) {
                let index = enemies.indexOf(enemy);
                enemies.splice(index, 1);
                map[enemy.y][enemy.x] = 'tile';
            }
            break;
        }
    }
}
// функция - движение врагов
function moveEnemies(enemies, hero, map, mapWith, mapHeight) {
    for (let enemy of enemies) {
        //противник рядом с героем?
        if ((Math.abs(hero.x - enemy.x) === 1 && hero.y === enemy.y) || (Math.abs(hero.y - enemy.y) === 1 && hero.x === enemy.x)) {
            // пропуск хода противником
            continue;
        }
        let newX, newY;
        do {
            newX = enemy.x;
            newY = enemy.y;
            // случайное направление движения
            let direction = Math.floor(Math.random() * 4);
            // обновляем координаты противника 
            switch (direction) {
                case 0:
                    newY -= 1;
                    break;
                case 1:
                    newY += 1;
                    break;
                case 2:
                    newX -= 1;
                    break;
                case 3:
                    newX += 1;
                    break;
            }
        } while (!canMoveTo(newX, newY, map, mapWith, mapHeight) || (map[newY][newX] === 'tileSW' || map[newY][newX] === 'tileHP'));
        map[enemy.y][enemy.x] = 'tile'; 
        enemy.x = newX;
        enemy.y = newY;
        map[newY][newX] = 'tileE'; 
    }
}
// *********************начало программы********************************************
window.onload = function () {
    // начальные условия
    let initial = initializingСonditions(40, 25, 25, [], 2, 10, 10, [], 0, 0, 100, 30);
    // разворачиваем в переменные
    let {
        mapWith,
        mapHeight,
        fieldSize,
        map
    } = initial.mapInitial;
    let items = {
        sword,
        healthPotion,
    } = initial.items;
    let {
        opponentCount,
        enemies
    } = initial.opponentInit;
    let hero = {
        x,
        y,
        health,
        attack
    } = initial.heroInit;
    // заполняем стеной
    map = create2DArray(x, y, mapWith, mapHeight, 'tileW', map)
    // заполняем конатами
    rectangularRoom(mapWith, mapHeight, map);
    // заполняем корридорами
    createCorridors(mapWith, mapHeight, map);
    // заполняем здоровьем
    potion(mapWith, mapHeight, items.healthPotion, map);
    // заполняем мечи
    saber(mapWith, mapHeight, items.sword, map);
    // инициализируем пустые места
    let emptyTiles = availableSeats(mapWith, mapHeight, map, x, y);
    // инициализируем врага
    emptyTiles = rival(emptyTiles, map, opponentCount, enemies);
    // инициализируем героя
    let schwarzenegger = geroy(mapWith, mapHeight, map, hero.x, hero.y);
    // console.log(geroy(mapWith, mapHeight, map, hero.x, hero.y));
    hero.x = schwarzenegger.heroX;
    hero.y = schwarzenegger.heroY;
    // Обработчик событий клавиш для передвижения героя
    let clickHandler = function (event) {
        let key = event.which;
        let newX = hero.x;
        let newY = hero.y;
        let moveMap = {
            87: {
                x: 0,
                y: -1
            }, // W
            65: {
                x: -1,
                y: 0
            }, // A
            83: {
                x: 0,
                y: 1
            }, // S
            68: {
                x: 1,
                y: 0
            }, // D
        };

        if (moveMap.hasOwnProperty(key)) {
            let move = moveMap[key];
            newX += move.x;
            newY += move.y;
        } else if (key === 32) {
            // Space
            attackEnemies(enemies, hero, map);
            updateMap(mapWith, mapHeight, map, fieldSize, hero.health, hero.attack, enemies, health);
            return;
        } else {
            return;
        }
        // Проверяем, если герой находится на клетке с мечом, то увеличиваем его урон
        if (map[newY][newX] === 'tileSW') {
            hero.attack += 35;
            map[newY][newX] = 'tile'; // Убираем меч с карты
        }
        if (canMoveTo(newX, newY, map, mapWith, mapHeight) && !isEnemyAt(newX, newY, map)) {
            if (map[newY][newX] === 'tileHP') {
                // Проверяем, есть ли на клетке зелье здоровья
                let healthToAdd = Math.min(100 - hero.health, 50); // Определяем количество здоровья, которое можно добавить
                hero.health = Math.min(hero.health + healthToAdd, 100); // Увеличиваем здоровье героя, не превышая максимальное значение

                if (hero.health === 100) {
                    map[newY][newX] = 'tile'; // Убираем зелье здоровья с карты только если здоровье героя достигло 100
                }
            }
            moveHeroTo(newX, newY, map, hero)
            updateMap(mapWith, mapHeight, map, fieldSize, hero.health, hero.attack, enemies, health);
        }
    }
    $(document).keydown(clickHandler
        // В jQuery keydown() это встроенный метод,
        //  который используется для запуска события нажатия клавиши всякий раз,
        //   когда пользователь нажимает клавишу на клавиатуре.
    );
     setInterval(function () {
        moveEnemies(enemies, hero, map, mapWith, mapHeight);
        // инициализация - обновление карты
        updateMap(mapWith, mapHeight, map, fieldSize, hero.health, hero.attack, enemies, health);
    }, 3000); // Обновление 
};