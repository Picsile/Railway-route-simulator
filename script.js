class Train {
    drive(time) {
        let mark; // сюда будем писать информацию о том, как успешно добрался поезд
        let late; // задержка в пути
        const variant = Math.floor(Math.random() * 3); // определяем вариант развития событий

        switch (variant) {
            case 0:
                late = Math.random() * 10 + 1; // Опоздание от 1 минуты до 10 минут
                mark = `с опозданием в ${Math.floor(late)} мин`;
                break;

            case 1:
                late = 0;
                mark = `по расписанию`;
                break;

            case 2:
                late = -Math.random() * (time / 2) + 1; // Прибытие раньше от 1 до time - 1 мин
                mark = `раньше на ${Math.floor(-late)} мин`;
                break;
        }
        time = +time + late;

        setTimeout(() => {

            this.road.currentPoint++;
            const station = Math.round(this.road.currentPoint / 2);

            this.road.historyTrevel.push(`Время от остановки ${station - 1} до остановки ${station} заняло ${Math.floor(time)} мин.`);
            console.log(`Поезд доехал до остановки ${station} ${mark}.`);

            this.road.actTrain();

        }, time / 60 * 1200);
    }

    hold(time) {

        setTimeout(() => {

            this.road.currentPoint++;
            const station = Math.round(this.road.currentPoint / 2);

            this.road.historyTrevel.push(`Поезд простоял ${time} мин на остановке ${station}.`);
            console.log(`Поезд отправляется с остановки ${station}. \n \n`);

            this.road.actTrain();

        }, time / 60 * 1200);
    }
}

class Road {
    train;
    currentPoint = 0;
    historyTrevel = [];
    timePeriods = []; /* Тут будут храниться временные промежутки, 
    где чётные елементы это длительность остановки на станциях, 
    а нечётные это длительность движения */

    constructor(train) {
        this.train = train;
        this.train.road = this; // Обратная связь с логистом
    }

    setTimeTable() {
        const quantityStops = prompt('Введите количество остановок (Если вы впервые этом сайте, то попробуйте ввести 2 для теста):');

        if (isNaN(quantityStops) || typeof quantityStops == 'object' || quantityStops == '') {
            alert('Были введено нечисловое значение!');
            this.setTimeTable();
            return;
        }

        if (quantityStops > 0) {
            this.timePeriods.push(prompt('Введите длительность пути между городом N и остановкой 1 (в мин.):'));
        } else this.timePeriods.push(prompt('Введите длительность пути между городом N и городом M (в мин.):'));

        for (let i = 0; i < quantityStops; i++) {
            if (i + 1 != quantityStops) {

                this.timePeriods.push(prompt(`Введите время стоянки на остановке ${i + 1} (в мин.):`));
                this.timePeriods.push(prompt(`Введите длительность пути между остановкой ${i + 1} и остановкой ${i + 2} (в мин.):`));

            } else {

                this.timePeriods.push(prompt(`Введите время стоянки на остановке ${i + 1} (в мин.):`));
                this.timePeriods.push(prompt(`Введите длительность пути между остановкой ${i + 1} и городом M (в мин.):`));

            }
        }

        if (this.timePeriods.filter((val) => isNaN(val) || typeof val == 'object' || val == '').length) {
            alert('Были введены нечисловые значения!');
            this.timePeriods = [];
            this.setTimeTable();
            return;
        };

        console.log('Временные промежутки:', this.timePeriods);
        this.actTrain();
    }

    actTrain() {
        if (this.currentPoint != this.timePeriods.length) {

            if (this.currentPoint % 2 == 0) {

                this.train.drive(this.timePeriods[this.currentPoint]);

            } else this.train.hold(this.timePeriods[this.currentPoint]);

        } else console.log('Маршрут закончен');

        upDate(this.currentPoint, this.timePeriods); // Визуальная часть
    }
}


const simulation = new Road(new Train);
simulation.setTimeTable();
// simulation.actTrain();


function upDate(currentPoint, timePeriods) {
    const roadDiv = document.getElementById('road');
    const timeDiv = document.getElementById('time');
    const trainDiv = document.getElementById('train');

    // Генерация поезда
    trainDiv.style.transform = `translateX(${(currentPoint + 1) * 280.5}px)`;

    // Генерация дороги
    let roadHTML = ``;
    for (let i = 0; i < (timePeriods.length / 2); i++) {

        if ((currentPoint + 1) / 2 > i) {
            roadHTML += `<div class="circle1 circle1Green"><div class="circle2"></div></div>`;
        } else if ((currentPoint + 1) / 2 == i) {
            roadHTML += `<div class="circle1 circle1Yellow"><div class="circle2"></div></div>`;
        } else roadHTML += `<div class="circle1"><div class="circle2"></div></div>`;
        
        if (currentPoint / 2 > i) {
            roadHTML += `<div class="line lineGreen"></div>`;
        } else if (currentPoint / 2 == i) {
            roadHTML += `<div class="line lineYellow"></div>`;
        } else roadHTML += `<div class="line"></div>`;
            
    }
    if (currentPoint == timePeriods.length) {
        roadHTML += `<div class="circle1 circle1Green"><div class="circle2"></div></div>`;
    } else roadHTML += `<div class="circle1"><div class="circle2"></div></div>`;
    roadDiv.innerHTML = roadHTML;

    // Отображение времени
    let timeHTML = ``;
    for (let i = 1; i < currentPoint + 1; i++) {
        if (i % 2 == 0) {
            timeHTML += `<div class = "time" style = "left: ${(Math.floor(i / 2)) * 61 + (Math.floor(i / 2)) * 500 - 19.5}px;"><h1>${timePeriods[i - 1]}</h1></div>`;
        } else timeHTML += `<div class = "time" style = "left: ${(Math.floor(i / 2) + 1) * 61 + (Math.floor(i / 2)) * 500 + 200}px;"><h1>${timePeriods[i - 1]}</h1></div>`;
    }
    timeDiv.innerHTML = timeHTML;
}