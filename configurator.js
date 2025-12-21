// configurator.js

// База данных моторов для БПЛА
const motorManufacturers = {
    actro: [
        { id: "actro_25_xxl", name: "Actro 25-XXL", kv: 850, maxCurrent: 35, maxPower: 450, weight: 68, resistance: 0.06, io: 1.1 },
        { id: "actro_32_l", name: "Actro 32-L", kv: 760, maxCurrent: 45, maxPower: 600, weight: 85, resistance: 0.05, io: 1.2 },
        { id: "actro_40_xl", name: "Actro 40-XL", kv: 530, maxCurrent: 60, maxPower: 800, weight: 112, resistance: 0.04, io: 1.5 },
        { id: "actro_45_pro", name: "Actro 45-PRO", kv: 420, maxCurrent: 70, maxPower: 1000, weight: 145, resistance: 0.035, io: 1.8 }
    ],
    
    aerob: [
        { id: "aerob_2216", name: "AeroB 2216", kv: 950, maxCurrent: 30, maxPower: 320, weight: 58, resistance: 0.068, io: 0.9 },
        { id: "aerob_2814", name: "AeroB 2814", kv: 800, maxCurrent: 45, maxPower: 500, weight: 78, resistance: 0.055, io: 1.2 },
        { id: "aerob_3515", name: "AeroB 3515", kv: 650, maxCurrent: 55, maxPower: 700, weight: 98, resistance: 0.045, io: 1.4 },
        { id: "aerob_4120", name: "AeroB 4120", kv: 500, maxCurrent: 65, maxPower: 900, weight: 128, resistance: 0.038, io: 1.6 }
    ],
    
    dronex: [
        { id: "dronex_2208", name: "DroneX 2208", kv: 1100, maxCurrent: 28, maxPower: 300, weight: 52, resistance: 0.072, io: 0.85 },
        { id: "dronex_2810", name: "DroneX 2810", kv: 900, maxCurrent: 40, maxPower: 480, weight: 70, resistance: 0.058, io: 1.1 },
        { id: "dronex_3510", name: "DroneX 3510", kv: 720, maxCurrent: 50, maxPower: 650, weight: 90, resistance: 0.048, io: 1.3 },
        { id: "dronex_4012", name: "DroneX 4012", kv: 560, maxCurrent: 60, maxPower: 850, weight: 115, resistance: 0.040, io: 1.5 }
    ]
};

// База данных регуляторов
const escDatabase = {
    'hobbywing_skywalker_30a': {
        continuousCurrent: 30,
        maxCurrent: 45,
        weight: 28,
        length: 35,
        resistance: 0.0065,
        wireLength: 15
    },
    'hobbywing_skywalker_40a': {
        continuousCurrent: 40,
        maxCurrent: 60,
        weight: 32,
        length: 38,
        resistance: 0.0055,
        wireLength: 15
    },
    'hobbywing_skywalker_50a': {
        continuousCurrent: 50,
        maxCurrent: 75,
        weight: 40,
        length: 45,
        resistance: 0.0045,
        wireLength: 18
    },
    'hobbywing_skywalker_60a': {
        continuousCurrent: 60,
        maxCurrent: 90,
        weight: 45,
        length: 48,
        resistance: 0.0040,
        wireLength: 18
    }
};

// База данных пропеллеров
const propellerDatabase = {
    'generic_thin': {
        name: 'Generic - thin',
        diameter: 9,
        pitch: 5,
        blades: 2,
        twistAngle: '+7.0°',
        efficiency: 0.72,
        weight: 12,
        material: 'plastic'
    },
    'generic_normal': {
        name: 'Generic - normal',
        diameter: 10,
        pitch: 5.5,
        blades: 2,
        twistAngle: '+6.0°',
        efficiency: 0.75,
        weight: 14,
        material: 'plastic'
    },
    'generic_wide': {
        name: 'Generic - wide',
        diameter: 11,
        pitch: 6,
        blades: 3,
        twistAngle: '+5.0°',
        efficiency: 0.78,
        weight: 16,
        material: 'nylon'
    },
    'aeronaut_camcarbon': {
        name: 'Aeronaut CamCarbon',
        diameter: 12,
        pitch: 6.5,
        blades: 2,
        twistAngle: '+3.5°',
        efficiency: 0.82,
        weight: 18,
        material: 'carbon'
    }
};

// База данных параметров аккумуляторов
const batteryDatabase = {
    "lipo150_80_120": {
        s: 3,
        p: 1,
        capacity: 150,
        currentC: 80,
        resistance: 0.0867,
        voltage: 3.7,
        currentMax: 120,
        weight: 5
    },
    "lipo1600_80_120": {
        capacity: 1600,
        currentC: 85,
        currentMax: 120,
        resistance: 0.081,
        voltage: 3.7,
        weight: 46,
        s: 3,
        p: 1
    },
    "lipo3000_80_120": {
        capacity: 3000,
        currentC: 80,
        currentMax: 120,
        resistance: 0.043,
        voltage: 3.7,
        weight: 86,
        s: 3,
        p: 1
    },
    "lipo4500_80_120": {
        s: 3,
        p: 1,
        capacity: 4500,
        currentC: 85,
        resistance: 0.0029,
        voltage: 3.7,
        currentMax: 120,
        weight: 128
    }
};

// Константы для расчетов
const PHYSICS = {
    AIR_DENSITY_SEA_LEVEL: 1.225,
    GRAVITY: 9.80665,
    STANDARD_PRESSURE: 101325,
    STANDARD_TEMPERATURE: 288.15,
    GAS_CONSTANT: 287.058,
    TEMP_LAPSE_RATE: 0.0065,
    MOTOR_CONSTANT: 0.0008,
    PROP_CONSTANT: 1.11,
    EFFICIENCY_OPTIMAL: 0.85,
    EFFICIENCY_MAX: 0.80,
    DISCHARGE_SAFETY: 0.8,
    ESC_EFFICIENCY: 0.97
};

// Глобальные переменные для диаграмм
let efficiencyRadarChart, powerChart;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('АэроКалькулятор инициализирован');
    
    // Инициализация выбора компонентов
    initMotorSelection();
    initPropellerSelection();
    
    // Инициализация обработчиков событий
    initializeEventListeners();
    
    // Инициализация диаграмм
    initializeCharts();
    
    // Инициализация параметров по умолчанию
    setTimeout(() => {
        // Устанавливаем значения по умолчанию
        updateMotorParameters(motorManufacturers.actro[1]);
        updateBatteryParams();
        updateEscParams();
        updatePropellerParams();
        
        // Запускаем первоначальный расчет
        calculateAll();
    }, 100);
});

// Инициализация выбора производителя и типа мотора
function initMotorSelection() {
    const manufacturerSelect = document.getElementById('motorManufacturer');
    const typeSelect = document.getElementById('motorType');
    
    if (!manufacturerSelect || !typeSelect) {
        console.error('Элементы для выбора мотора не найдены');
        return;
    }
    
    // Заполняем производителей
    Object.keys(motorManufacturers).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = formatManufacturerName(key);
        manufacturerSelect.appendChild(option);
    });
    
    // Устанавливаем Actro по умолчанию
    manufacturerSelect.value = 'actro';
    updateMotorTypes('actro');
    
    // Обработчик изменения производителя
    manufacturerSelect.addEventListener('change', function() {
        const selectedManufacturer = this.value;
        updateMotorTypes(selectedManufacturer);
    });
    
    // Обработчик изменения типа мотора
    typeSelect.addEventListener('change', function() {
        const manufacturer = document.getElementById('motorManufacturer').value;
        const motorId = this.value;
        
        if (manufacturer && motorId !== 'default' && motorManufacturers[manufacturer]) {
            const selectedMotor = motorManufacturers[manufacturer].find(m => m.id === motorId);
            if (selectedMotor) {
                updateMotorParameters(selectedMotor);
            }
        }
    });
}

// Форматирование имени производителя
function formatManufacturerName(key) {
    const names = {
        'actro': 'Actro',
        'aerob': 'AeroB',
        'dronex': 'DroneX'
    };
    return names[key] || key;
}

// Обновление списка типов моторов
function updateMotorTypes(manufacturer) {
    const typeSelect = document.getElementById('motorType');
    if (!typeSelect) return;
    
    typeSelect.innerHTML = '<option value="default">Выберите тип мотора</option>';
    
    if (manufacturer && motorManufacturers[manufacturer]) {
        typeSelect.disabled = false;
        
        motorManufacturers[manufacturer].forEach(motor => {
            const option = document.createElement('option');
            option.value = motor.id;
            option.textContent = `${motor.name} (KV: ${motor.kv}, ${motor.maxPower}Вт, ${motor.weight}г)`;
            typeSelect.appendChild(option);
        });
        
        // Устанавливаем первый мотор по умолчанию
        typeSelect.value = motorManufacturers[manufacturer][1].id;
    } else {
        typeSelect.disabled = true;
    }
}

// Обновление параметров мотора при выборе типа
function updateMotorParameters(motor) {
    if (!motor) return;
    
    console.log('Обновление параметров мотора:', motor.name);
    
    // Обновляем основные поля мотора
    setFieldValue('motorKv', motor.kv);
    setFieldValue('motorMaxCurrent', motor.maxCurrent);
    setFieldValue('motorMaxPower', motor.maxPower);
    setFieldValue('motorWeight', motor.weight);
    setFieldValue('motorResistance', motor.resistance);
    
    // Автоматический расчет тока без нагрузки
    const noLoadCurrent = (motor.kv * 3.7 * 0.001).toFixed(2);
    setFieldValue('motorNoLoadCurrent', noLoadCurrent);
    
    // Запускаем расчет
    setTimeout(calculateAll, 100);
}

// Инициализация выбора пропеллера
function initPropellerSelection() {
    const propTypeSelect = document.getElementById('propType');
    if (!propTypeSelect) {
        console.error('Элемент для выбора пропеллера не найден');
        return;
    }
    
    // Очищаем и заполняем список пропеллеров
    propTypeSelect.innerHTML = '';
    
    Object.keys(propellerDatabase).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = propellerDatabase[key].name;
        propTypeSelect.appendChild(option);
    });
    
    // Устанавливаем пропеллер по умолчанию
    propTypeSelect.value = 'generic_wide';
    
    // Добавляем обработчик события
    propTypeSelect.addEventListener('change', updatePropellerParams);
}

// Обновление параметров пропеллера при выборе
function updatePropellerParams() {
    const propType = document.getElementById('propType').value;
    
    if (propellerDatabase[propType]) {
        const prop = propellerDatabase[propType];
        
        console.log('Обновление параметров пропеллера:', prop.name);
        
        // Обновляем основные поля пропеллера
        setFieldValue('propDiameter', prop.diameter);
        setFieldValue('propPitch', prop.pitch);
        setFieldValue('propBlades', prop.blades);
        
        // Запускаем расчет
        setTimeout(calculateAll, 100);
    }
}

// Обновление параметров регулятора при выборе
function updateEscParams() {
    const escType = document.getElementById('escModel').value;
    
    if (escDatabase[escType]) {
        const esc = escDatabase[escType];
        
        console.log('Обновление параметров регулятора:', escType);
        
        // Обновляем все поля ввода регулятора
        setFieldValue('escCurrentContinuous', esc.continuousCurrent);
        setFieldValue('escCurrentMax', esc.maxCurrent);
        setFieldValue('escWeight', esc.weight);
        setFieldValue('escLength', esc.length);
        setFieldValue('escResistance', esc.resistance);
        setFieldValue('escWireLength', esc.wireLength);
        
        // Запускаем расчет
        setTimeout(calculateAll, 100);
    }
}

// Обновление параметров аккумулятора при выборе
function updateBatteryParams() {
    const batteryType = document.getElementById('batteryType').value;
    
    if (batteryDatabase[batteryType]) {
        const battery = batteryDatabase[batteryType];
        
        console.log('Обновление параметров аккумулятора:', batteryType);
        
        setFieldValue('batteryCapacity', battery.capacity);
        setFieldValue('batteryVoltage', (battery.voltage * battery.s).toFixed(1));
        setFieldValue('batteryWeight', battery.weight);
        setFieldValue('batteryCurrentC', battery.currentC);
        setFieldValue('batteryCurrentMax', battery.currentMax);
        setFieldValue('batteryResistance', battery.resistance);
        setFieldValue('batteryCells', battery.s);
        
        // Запускаем расчет
        setTimeout(calculateAll, 100);
    }
}

// Вспомогательная функция для установки значения поля
function setFieldValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.value = value;
        
        // Добавляем класс для подсветки
        element.classList.add('field-changed');
        setTimeout(() => {
            element.classList.remove('field-changed');
        }, 1000);
    }
}

// Основная функция расчета
function calculateAll() {
    console.log('Выполнение расчетов...');
    
    try {
        // Получаем параметры
        const params = getInputParameters();
        
        // Рассчитываем плотность воздуха
        const airDensity = calculateAirDensity(params.altitude, params.temperature);
        
        // Выполняем расчеты
        const results = performCalculations(params, airDensity);
        
        // Обновляем результаты
        updateResults(results);
        
        // Обновляем диаграммы
        updateCharts(results);
        
        // Обновляем сводку
        updateSummary(results);
        
        console.log('Расчеты завершены успешно');
        
    } catch (error) {
        console.error('Ошибка при расчетах:', error);
    }
}

// Расчет плотности воздуха
function calculateAirDensity(altitude, temperature) {
    const temperatureK = temperature + 273.15;
    const pressure = PHYSICS.STANDARD_PRESSURE * Math.pow(1 - 0.0065 * altitude / 288.15, 5.25588);
    const density = pressure / (PHYSICS.GAS_CONSTANT * temperatureK);
    return Math.max(density, 0.5);
}

// Функция безопасного получения значений из input-полей
function safeGetValue(id, defaultValue) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Элемент с id "${id}" не найден`);
        return defaultValue;
    }
    const value = element.value.trim();
    if (value === '' || value === 'undefined' || value === 'null') {
        return defaultValue;
    }
    
    const numValue = parseFloat(value);
    return isNaN(numValue) ? defaultValue : numValue;
}

function getInputParameters() {
    // Безопасное получение всех параметров с значениями по умолчанию
    return {
        flightWeight: Math.max(safeGetValue('flightWeight', 1500), 0),
        motorCount: Math.max(safeGetValue('motorCount', 1), 1),
        wingArea: Math.max(safeGetValue('wingArea', 32), 0.1),
        wingSpan: safeGetValue('wingSpan', 1200),
        dragCoefficient: Math.max(safeGetValue('dragCoefficient', 0.03), 0.01),
        flightSpeed: Math.max(safeGetValue('flightSpeed', 80), 0),
        targetSpeed: Math.max(safeGetValue('targetSpeed', 120), 0),
        altitude: safeGetValue('altitude', 500),
        temperature: safeGetValue('temperature', 20),
        airPressure: safeGetValue('airPressure', 1013),
        
        battery: {
            capacity: Math.max(safeGetValue('batteryCapacity', 3000), 0),
            voltage: Math.max(safeGetValue('batteryVoltage', 11.1), 0),
            currentC: Math.max(safeGetValue('batteryCurrentC', 80), 0),
            currentMax: Math.max(safeGetValue('batteryCurrentMax', 120), 0),
            resistance: Math.max(safeGetValue('batteryResistance', 0.025), 0),
            weight: Math.max(safeGetValue('batteryWeight', 180), 0),
            s: Math.max(safeGetValue('batteryCells', 3), 1)
        },
        
        motor: {
            kv: Math.max(safeGetValue('motorKv', 760), 0),
            resistance: Math.max(safeGetValue('motorResistance', 0.05), 0),
            maxCurrent: Math.max(safeGetValue('motorMaxCurrent', 45), 0),
            maxPower: Math.max(safeGetValue('motorMaxPower', 600), 0),
            weight: Math.max(safeGetValue('motorWeight', 85), 0),
            noLoadCurrent: Math.max(safeGetValue('motorNoLoadCurrent', 1.5), 0)
        },
        
        propeller: {
            diameter: Math.max(safeGetValue('propDiameter', 10), 1),
            pitch: Math.max(safeGetValue('propPitch', 6), 1),
            blades: Math.max(safeGetValue('propBlades', 3), 2),
            type: document.getElementById('propType') ? document.getElementById('propType').value : 'generic_wide'
        },
        
        esc: {
            currentContinuous: Math.max(safeGetValue('escCurrentContinuous', 40), 0),
            currentMax: Math.max(safeGetValue('escCurrentMax', 60), 0),
            resistance: Math.max(safeGetValue('escResistance', 0.005), 0),
            weight: Math.max(safeGetValue('escWeight', 35), 0),
            length: Math.max(safeGetValue('escLength', 40), 0),
            wireLength: Math.max(safeGetValue('escWireLength', 15), 5)
        }
    };
}

// Основные расчеты
function performCalculations(params, airDensity) {
    const results = {};
    results.params = params;
    
    // 1. Основные аэродинамические параметры
    const wingAreaM2 = Math.max(params.wingArea / 10000, 0.001);
    const weightKg = Math.max(params.flightWeight / 1000, 0.001);
    
    results.wingLoading = weightKg / wingAreaM2;
    results.wingLoadingGdm2 = params.flightWeight / params.wingArea;
    
    // Скорость сваливания
    const clMax = 1.2;
    results.stallSpeed = Math.sqrt((2 * weightKg * PHYSICS.GRAVITY) / (airDensity * wingAreaM2 * clMax)) * 3.6;
    
    // 2. Аккумуляторные расчеты
    const capacityAh = params.battery.capacity / 1000;
    results.batteryEnergy = capacityAh * params.battery.voltage;
    const maxBatteryCurrent = capacityAh * params.battery.currentC;
    
    // Номинальное напряжение батареи
    const batteryVoltagePerCell = 3.7;
    const nominalBatteryVoltage = batteryVoltagePerCell * params.battery.s;
    results.nominalVoltage = nominalBatteryVoltage;
    
    // 3. Расчет моторов (оптимальный режим)
    const optimalCurrentPerMotor = Math.max(params.motor.maxCurrent * 0.7, 0);
    const totalOptimalCurrent = optimalCurrentPerMotor * params.motorCount;
    
    // Падение напряжения на батарее при оптимальном режиме
    const totalBatteryResistance = Math.max(params.battery.resistance * params.battery.s, 0);
    const batteryVoltageDropOptimal = totalOptimalCurrent * totalBatteryResistance;
    
    // Напряжение под нагрузкой не может быть меньше 70% от номинального
    results.batteryVoltageUnderLoad = Math.max(
        nominalBatteryVoltage - batteryVoltageDropOptimal, 
        nominalBatteryVoltage * 0.7
    );
    
    // Падение напряжения на ESC рассчитываем на один мотор
    const escVoltageDropPerMotor = optimalCurrentPerMotor * params.esc.resistance;
    const motorVoltageOptimal = Math.max(results.batteryVoltageUnderLoad - escVoltageDropPerMotor, 0);
    
    results.motorCurrentOptimal = optimalCurrentPerMotor;
    results.motorVoltageOptimal = motorVoltageOptimal;
    results.motorRpmOptimal = Math.max(params.motor.kv * motorVoltageOptimal, 0);
    results.electricalPowerOptimal = optimalCurrentPerMotor * motorVoltageOptimal;
    results.mechanicalPowerOptimal = results.electricalPowerOptimal * PHYSICS.EFFICIENCY_OPTIMAL;
    results.motorEfficiencyOptimal = PHYSICS.EFFICIENCY_OPTIMAL * 100;
    
    // 4. Расчет для максимального режима
    results.motorCurrentMax = Math.max(
        Math.min(
            params.motor.maxCurrent,
            maxBatteryCurrent / Math.max(params.motorCount, 1),
            params.esc.currentMax / Math.max(params.motorCount, 1)
        ), 
        0
    );
    
    // Для максимального режима пересчитываем напряжение с учетом максимального тока
    const totalCurrentMax = results.motorCurrentMax * params.motorCount;
    const batteryVoltageDropMax = totalCurrentMax * totalBatteryResistance;
    const batteryVoltageUnderLoadMax = Math.max(
        nominalBatteryVoltage - batteryVoltageDropMax, 
        nominalBatteryVoltage * 0.6
    );
    
    const escVoltageDropMax = results.motorCurrentMax * params.esc.resistance;
    results.motorVoltageMax = Math.max(batteryVoltageUnderLoadMax - escVoltageDropMax, 0);
    results.motorRpmMax = Math.max(params.motor.kv * results.motorVoltageMax, 0);
    results.electricalPowerMax = results.motorCurrentMax * results.motorVoltageMax;
    results.mechanicalPowerMax = results.electricalPowerMax * PHYSICS.EFFICIENCY_MAX;
    results.motorEfficiencyMax = PHYSICS.EFFICIENCY_MAX * 100;
    
    // 5. Расчет пропеллера
    const propDiameterM = Math.max(params.propeller.diameter * 0.0254, 0.001);
    const propPitchM = Math.max(params.propeller.pitch * 0.0254, 0.001);
    
    results.staticThrust = calculateStaticThrust(
        propDiameterM,
        propPitchM,
        Math.max(results.motorRpmOptimal, 1000),
        airDensity,
        params.propeller.blades
    );
    
    results.propRpm = Math.max(results.motorRpmOptimal * 0.92, 0);
    results.zeroSpeedThrust = results.staticThrust;
    results.stallThrust = Math.max(results.staticThrust * 0.85, 0);
    results.flowSpeed = (results.propRpm * propPitchM * 60 / 1000) * 3.6;
    
    // 6. Расчет производительности системы
    const totalStaticThrust = Math.max(results.staticThrust * params.motorCount, 0);
    results.thrustToWeight = totalStaticThrust / Math.max(params.flightWeight, 0.001);
    results.powerLoading = (results.electricalPowerOptimal * params.motorCount) / Math.max(weightKg, 0.001);
    
    // 7. Расчет времени полета
    const usableCapacity = Math.max(capacityAh * PHYSICS.DISCHARGE_SAFETY, 0);
    const averageCurrent = Math.max(results.motorCurrentOptimal * params.motorCount * 0.6, 0);
    results.minFlightTime = averageCurrent > 0 ? (usableCapacity / averageCurrent) * 60 : 0;
    results.mixedFlightTime = Math.max(results.minFlightTime * 1.3, 0);
    
    // 8. Дополнительные расчеты
    results.totalCapacityWh = Math.max(results.batteryEnergy, 0);
    results.usedCapacity = Math.max(usableCapacity * 1000, 0);
    results.theoreticalMaxSpeed = Math.max(results.flowSpeed * 1.15, 0);
    results.propulsionWeight = Math.max((params.motor.weight + params.esc.weight) * params.motorCount, 0);
    
    // Маржи по току
    results.currentMarginESC = params.esc.currentContinuous - results.motorCurrentOptimal;
    results.currentMarginBattery = maxBatteryCurrent - (results.motorCurrentOptimal * params.motorCount);
    
    return results;
}

// Расчет статической тяги
function calculateStaticThrust(diameter, pitch, rpm, airDensity, blades) {
    diameter = Math.max(diameter, 0.001);
    pitch = Math.max(pitch, 0.001);
    rpm = Math.max(rpm, 0);
    airDensity = Math.max(airDensity, 0);
    blades = Math.max(blades, 2);
    
    const area = Math.PI * Math.pow(diameter / 2, 2);
    const tipSpeed = (rpm / 60) * Math.PI * diameter;
    
    let bladeFactor = 1.0;
    if (blades === 3) bladeFactor = 0.85;
    if (blades === 4) bladeFactor = 0.75;
    
    const thrust = airDensity * area * Math.pow(tipSpeed, 2) * PHYSICS.PROP_CONSTANT * bladeFactor * 0.25;
    return Math.max(thrust / 0.00980665, 0);
}

// Обновление результатов на странице
function updateResults(results) {
    const params = results.params;
    
    function safeUpdateElement(id, text) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    }
    
    function formatValue(value, decimals, unit = '') {
        if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
            return '0' + unit;
        }
        return value.toFixed(decimals) + unit;
    }
    
    // Аккумулятор
    safeUpdateElement('resultWingLoading', formatValue(results.wingLoadingGdm2, 1, ' г/дм²'));
    safeUpdateElement('resultVoltageUnderLoad', formatValue(results.batteryVoltageUnderLoad, 2, ' В'));
    safeUpdateElement('resultNominalVoltage', formatValue(results.nominalVoltage, 1, ' В'));
    safeUpdateElement('resultEnergy', formatValue(results.batteryEnergy, 2, ' Вт·ч'));
    safeUpdateElement('resultTotalCapacity', formatValue(results.totalCapacityWh, 2, ' Вт·ч'));
    safeUpdateElement('resultUsedCapacity', formatValue(results.usedCapacity, 0, ' мАч'));
    safeUpdateElement('resultMinFlightTime', formatValue(results.minFlightTime, 1, ' мин'));
    safeUpdateElement('resultMixedFlightTime', formatValue(results.mixedFlightTime, 1, ' мин'));
    safeUpdateElement('resultBatteryWeight', formatValue(params.battery.weight, 0, ' г'));
    
    // Мотор оптимальный
    safeUpdateElement('resultMotorCurrent', formatValue(results.motorCurrentOptimal, 1, ' А'));
    safeUpdateElement('resultMotorVoltage', formatValue(results.motorVoltageOptimal, 2, ' В'));
    safeUpdateElement('resultMotorRpm', formatValue(results.motorRpmOptimal, 0, ' об/мин'));
    safeUpdateElement('resultElectricalPower', formatValue(results.electricalPowerOptimal, 0, ' Вт'));
    safeUpdateElement('resultMechanicalPower', formatValue(results.mechanicalPowerOptimal, 0, ' Вт'));
    safeUpdateElement('resultMotorEfficiency', formatValue(results.motorEfficiencyOptimal, 1, '%'));
    
    // Мотор максимальный
    safeUpdateElement('resultMotorCurrentMax', formatValue(results.motorCurrentMax, 1, ' А'));
    safeUpdateElement('resultMotorVoltageMax', formatValue(results.motorVoltageMax, 2, ' В'));
    safeUpdateElement('resultMotorRpmMax', formatValue(results.motorRpmMax, 0, ' об/мин'));
    safeUpdateElement('resultElectricalPowerMax', formatValue(results.electricalPowerMax, 0, ' Вт'));
    safeUpdateElement('resultMechanicalPowerMax', formatValue(results.mechanicalPowerMax, 0, ' Вт'));
    safeUpdateElement('resultMotorEfficiencyMax', formatValue(results.motorEfficiencyMax, 1, '%'));
    
    // Пропеллер
    safeUpdateElement('resultStaticThrust', formatValue(results.staticThrust, 0, ' г'));
    safeUpdateElement('resultPropRpm', formatValue(results.propRpm, 0, ' об/мин'));
    safeUpdateElement('resultStallThrust', formatValue(results.stallThrust, 0, ' г'));
    safeUpdateElement('resultZeroSpeedThrust', formatValue(results.zeroSpeedThrust, 0, ' г'));
    safeUpdateElement('resultFlowSpeed', formatValue(results.flowSpeed, 1, ' км/ч'));
    
    // Параметры ВМГ
    safeUpdateElement('resultPropulsionWeight', formatValue(results.propulsionWeight, 0, ' г'));
    safeUpdateElement('resultPowerLoading', formatValue(results.powerLoading, 0, ' Вт/кг'));
    safeUpdateElement('resultThrustToWeight', formatValue(results.thrustToWeight, 2, ':1'));
    safeUpdateElement('resultCurrentMax', formatValue(results.motorCurrentMax, 1, ' А'));
    safeUpdateElement('resultInputPowerMax', formatValue(results.electricalPowerMax, 0, ' Вт'));
    
    // Маржи по току
    safeUpdateElement('resultCurrentMarginESC', formatValue(results.currentMarginESC, 1, ' А'));
    safeUpdateElement('resultCurrentMarginBattery', formatValue(results.currentMarginBattery, 1, ' А'));
}

// Инициализация диаграмм
function initializeCharts() {
    const radarCanvas = document.getElementById('efficiencyRadarChart');
    const powerCanvas = document.getElementById('powerChart');
    
    if (!radarCanvas || !powerCanvas) {
        console.error('Canvas элементы для диаграмм не найдены');
        return;
    }
    
    // Радар эффективности
    const radarCtx = radarCanvas.getContext('2d');
    efficiencyRadarChart = new Chart(radarCtx, {
        type: 'radar',
        data: {
            labels: ['Тяговооруженность', 'Запас по ESC', 'Запас по батарее', 'Время полета', 'Эффективность', 'Скорость'],
            datasets: [{
                label: 'Текущая система',
                data: [50, 70, 65, 50, 75, 60],
                backgroundColor: 'rgba(56, 189, 248, 0.2)',
                borderColor: 'rgba(56, 189, 248, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(56, 189, 248, 1)'
            }, {
                label: 'Оптимальные значения',
                data: [80, 80, 80, 80, 80, 80],
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderColor: 'rgba(16, 185, 129, 0.5)',
                borderWidth: 1,
                borderDash: [5, 5],
                pointBackgroundColor: 'rgba(16, 185, 129, 0.5)'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: { 
                        color: '#f1f5f9', 
                        font: { 
                            size: 11
                        }
                    },
                    ticks: { 
                        display: false,
                        max: 100,
                        min: 0
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            },
            plugins: {
                legend: { 
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#f1f5f9',
                        font: { size: 11 }
                    }
                }
            }
        }
    });
    
    // Диаграмма распределения мощности
    const powerCtx = powerCanvas.getContext('2d');
    powerChart = new Chart(powerCtx, {
        type: 'doughnut',
        data: {
            labels: ['Полезная мощность', 'Потери в моторе', 'Потери в ESC', 'Потери в батарее'],
            datasets: [{
                data: [70, 15, 8, 7],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(59, 130, 246, 0.8)'
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(59, 130, 246, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#f1f5f9',
                        font: { size: 11 }
                    }
                }
            }
        }
    });
}

function updateCharts(results) {
    if (!efficiencyRadarChart || !powerChart) return;
    
    try {
        // Обновляем радарную диаграмму
        const thrustScore = Math.min(100, Math.max(20, results.thrustToWeight * 40));
        const escMarginScore = results.params.esc.currentContinuous > 0 ? 
            Math.min(100, Math.max(0, (results.currentMarginESC / results.params.esc.currentContinuous) * 100)) : 50;
        
        const batteryCapacityAh = results.params.battery.capacity / 1000;
        const maxBatteryCurrent = batteryCapacityAh * results.params.battery.currentC;
        const batteryMarginScore = maxBatteryCurrent > 0 ? 
            Math.min(100, Math.max(0, (results.currentMarginBattery / maxBatteryCurrent) * 100)) : 50;
        
        const timeScore = Math.min(100, Math.max(0, results.mixedFlightTime * 6));
        const efficiencyScore = Math.min(100, results.motorEfficiencyOptimal);
        const speedScore = results.params.targetSpeed > 0 ? 
            Math.min(100, Math.max(0, (results.theoreticalMaxSpeed / results.params.targetSpeed) * 100)) : 50;
        
        efficiencyRadarChart.data.datasets[0].data = [
            thrustScore,
            escMarginScore,
            batteryMarginScore,
            timeScore,
            efficiencyScore,
            speedScore
        ];
        efficiencyRadarChart.update();
        
        // Обновляем диаграмму распределения мощности
        const usefulPower = results.motorEfficiencyOptimal;
        const motorLoss = 100 - results.motorEfficiencyOptimal;
        const escLoss = 3;
        const batteryLoss = 2;
        
        powerChart.data.datasets[0].data = [
            usefulPower,
            motorLoss,
            escLoss,
            batteryLoss
        ];
        powerChart.update();
    } catch (error) {
        console.error('Ошибка при обновлении диаграмм:', error);
    }
}

function updateSummary(results) {
    const params = results.params;
    const summaryElement = document.getElementById('systemSummary');
    
    if (!summaryElement) {
        console.error('Элемент для сводки не найден');
        return;
    }
    
    let performanceClass = '';
    let performanceColor = 'critical';
    let recommendations = [];
    let issues = [];
    let warnings = [];
    
    const twr = results.thrustToWeight;
    
    // Анализ тяговооруженности
    if (twr >= 1.3) {
        performanceClass = 'Акробатический';
        performanceColor = 'excellent';
        recommendations.push('Отличная тяговооруженность для 3D и акробатики');
    } else if (twr >= 1.0) {
        performanceClass = 'Спортивный';
        performanceColor = 'good';
        recommendations.push('Хорошая производительность для спортивных полетов');
    } else if (twr >= 0.7) {
        performanceClass = 'Крейсерский';
        performanceColor = 'warning';
        recommendations.push('Достаточно для крейсерских полетов');
        warnings.push('Тяговооруженность на нижней границе для уверенного взлета');
    } else if (twr >= 0.5) {
        performanceClass = 'Тренировочный';
        performanceColor = 'warning';
        issues.push('Низкая тяговооруженность');
        warnings.push('Требуется длинная взлетная полоса');
    } else {
        performanceClass = 'Недостаточная';
        performanceColor = 'critical';
        issues.push('Критически низкая тяговооруженность');
        issues.push('Взлет может быть невозможен');
    }
    
    // Проверка запасов по току ESC
    if (results.currentMarginESC < 5) {
        if (results.currentMarginESC < 0) {
            issues.push(`ESC перегружен! Превышение: ${Math.abs(results.currentMarginESC).toFixed(1)}А`);
            performanceColor = 'critical';
        } else {
            warnings.push(`Маленький запас по ESC: ${results.currentMarginESC.toFixed(1)}А`);
        }
    } else {
        recommendations.push(`Хороший запас по ESC: ${results.currentMarginESC.toFixed(1)}А`);
    }
    
    // Проверка запасов по току батареи
    if (results.currentMarginBattery < 10) {
        if (results.currentMarginBattery < 0) {
            issues.push(`Батарея перегружена! Превышение: ${Math.abs(results.currentMarginBattery).toFixed(1)}А`);
            performanceColor = 'critical';
        } else {
            warnings.push(`Маленький запас по батарее: ${results.currentMarginBattery.toFixed(1)}А`);
        }
    } else {
        recommendations.push(`Достаточный запас по батарее: ${results.currentMarginBattery.toFixed(1)}А`);
    }
    
    // Формируем HTML сводки
    let summaryHTML = `<div class="summary-status ${performanceColor}">`;
    summaryHTML += `<div class="summary-header"><strong>Класс производительности: ${performanceClass}</strong></div>`;
    summaryHTML += `<div class="summary-metrics">`;
    summaryHTML += `<div><strong>Тяговооруженность:</strong> ${twr.toFixed(2)}:1</div>`;
    summaryHTML += `<div><strong>Нагрузка на крыло:</strong> ${results.wingLoading.toFixed(1)} кг/м² (${results.wingLoadingGdm2.toFixed(1)} г/дм²)</div>`;
    summaryHTML += `<div><strong>Удельная мощность:</strong> ${results.powerLoading.toFixed(0)} Вт/кг</div>`;
    summaryHTML += `<div><strong>Время полета:</strong> ${results.mixedFlightTime.toFixed(1)} мин</div>`;
    summaryHTML += `<div><strong>Макс. скорость:</strong> ${results.theoreticalMaxSpeed.toFixed(1)} км/ч</div>`;
    summaryHTML += `<div><strong>Скорость сваливания:</strong> ${results.stallSpeed.toFixed(1)} км/ч</div>`;
    summaryHTML += `</div>`;
    
    if (recommendations.length > 0) {
        summaryHTML += '<div class="summary-section"><strong>✅ Сильные стороны:</strong><ul>';
        recommendations.forEach(rec => {
            summaryHTML += `<li>${rec}</li>`;
        });
        summaryHTML += '</ul></div>';
    }
    
    if (warnings.length > 0) {
        summaryHTML += '<div class="summary-section warning"><strong>⚠️ Внимание:</strong><ul>';
        warnings.forEach(warn => {
            summaryHTML += `<li>${warn}</li>`;
        });
        summaryHTML += '</ul></div>';
    }
    
    if (issues.length > 0) {
        summaryHTML += '<div class="summary-section critical"><strong>❌ Критические проблемы:</strong><ul>';
        issues.forEach(issue => {
            summaryHTML += `<li>${issue}</li>`;
        });
        summaryHTML += '</ul></div>';
    }
    
    summaryHTML += '</div>';
    
    summaryElement.innerHTML = summaryHTML;
}

// Инициализация обработчиков событий
function initializeEventListeners() {
    // Кнопка расчета
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateAll);
    }
    
    // Кнопка сохранения
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveConfiguration);
    }
    
    // Кнопка сброса
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAll);
    }
    
    // Обработчики для выбора аккумулятора
    const batteryType = document.getElementById('batteryType');
    if (batteryType) {
        batteryType.addEventListener('change', updateBatteryParams);
    }
    
    // Обработчики для выбора ESC
    const escModel = document.getElementById('escModel');
    if (escModel) {
        escModel.addEventListener('change', updateEscParams);
    }
    
    // Настраиваем авто-расчет при изменении значений
    const inputFields = document.querySelectorAll('.input-field, .select-field');
    inputFields.forEach(field => {
        field.addEventListener('input', function() {
            clearTimeout(window.calculationTimeout);
            window.calculationTimeout = setTimeout(calculateAll, 500);
        });
        
        field.addEventListener('change', function() {
            calculateAll();
        });
    });
}

// Сохранение конфигурации
function saveConfiguration() {
    try {
        const params = getInputParameters();
        const airDensity = calculateAirDensity(params.altitude, params.temperature);
        const results = performCalculations(params, airDensity);
        
        const config = {
            timestamp: new Date().toISOString(),
            version: 'АэроКалькулятор 1.0',
            parameters: params,
            results: results
        };
        
        const configJSON = JSON.stringify(config, null, 2);
        
        // Создаем и скачиваем файл
        const blob = new Blob([configJSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `uav-config-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Показываем уведомление
        showNotification('Конфигурация сохранена!', 'success');
        
    } catch (error) {
        console.error('Ошибка при сохранении конфигурации:', error);
        showNotification('Ошибка при сохранении', 'error');
    }
}

// Сброс конфигурации
function resetAll() {
    if (confirm('Вы уверены, что хотите сбросить все параметры к значениям по умолчанию?')) {
        // Сброс к значениям по умолчанию
        const elementsToReset = {
            'flightWeight': '1500',
            'motorCount': '1',
            'wingArea': '32',
            'wingSpan': '1200',
            'dragCoefficient': '0.03',
            'targetSpeed': '120',
            'altitude': '500',
            'airPressure': '1013',
            'temperature': '20',
            'batteryType': 'lipo3000_80_120',
            'motorManufacturer': 'actro',
            'propType': 'generic_wide',
            'propDiameter': '10',
            'propPitch': '6',
            'propBlades': '3',
            'flightSpeed': '80',
            'escModel': 'hobbywing_skywalker_40a'
        };
        
        // Устанавливаем значения
        Object.keys(elementsToReset).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.value = elementsToReset[id];
            }
        });
        
        // Обновляем параметры компонентов
        updateBatteryParams();
        updateEscParams();
        updatePropellerParams();
        
        // Обновляем список моторов
        updateMotorTypes('actro');
        
        // Устанавливаем мотор по умолчанию с небольшой задержкой
        setTimeout(() => {
            const typeSelect = document.getElementById('motorType');
            if (typeSelect && motorManufacturers.actro && motorManufacturers.actro.length > 1) {
                typeSelect.value = motorManufacturers.actro[1].id;
                const selectedMotor = motorManufacturers.actro.find(m => m.id === motorManufacturers.actro[1].id);
                if (selectedMotor) {
                    updateMotorParameters(selectedMotor);
                }
            }
            
            // Запускаем расчет
            setTimeout(calculateAll, 200);
        }, 100);
        
        // Показываем уведомление
        showNotification('Параметры сброшены к значениям по умолчанию', 'info');
    }
}

// Функция для показа уведомлений
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    // Цвета в зависимости от типа
    if (type === 'success') {
        notification.style.backgroundColor = '#10b981';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#ef4444';
    } else if (type === 'info') {
        notification.style.backgroundColor = '#3b82f6';
    }
    
    // Добавляем в DOM
    document.body.appendChild(notification);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Добавляем стили для анимации уведомлений
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

console.log('Configurator script loaded successfully');