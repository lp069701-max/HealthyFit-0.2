/* HEALTHYFIT · robi.js — chat de Robi (respuestas por tema) */
const log = document.getElementById('log');
const form = document.getElementById('form');
const input = document.getElementById('input');
const robot = document.getElementById('robot');

const bank = {
  cardio: [
    "Para cardio, 150 minutos a la semana de intensidad moderada (caminar rápido, bici, nadar) son un buen punto de partida, divididos en sesiones de 20 a 30 minutos.",
    "El cardio no tiene que ser aburrido: baile, saltar la cuerda o subir escaleras cuentan. Lo importante es que suba tu ritmo cardíaco de forma sostenida.",
    "Si vas empezando con cardio, sube el tiempo poco a poco cada semana en lugar de forzar desde el día uno."
  ],
  fuerza: [
    "Para fuerza, 2 a 3 sesiones semanales que trabajen los grandes grupos musculares (piernas, espalda, pecho, core) suelen bastar para empezar.",
    "No necesitas pesas pesadas al inicio: sentadillas, flexiones y planchas con tu propio peso ya construyen fuerza real.",
    "Deja al menos un día de descanso entre sesiones del mismo grupo muscular para que el cuerpo se recupere y crezca más fuerte."
  ],
  estiramiento: [
    "Estirar después de entrenar, con el músculo caliente, ayuda más que hacerlo en frío. Mantén cada estiramiento entre 20 y 30 segundos.",
    "El yoga o la movilidad articular son excelentes para mejorar flexibilidad y prevenir lesiones a largo plazo.",
    "Un buen estiramiento se siente como tensión suave, nunca como dolor agudo."
  ],
  frecuencia: [
    "Para la mayoría de las personas, moverse entre 3 y 5 días a la semana es un buen equilibrio entre progreso y descanso.",
    "Más importante que la frecuencia perfecta es la constancia: mejor 3 veces por semana durante meses que 6 veces solo una semana.",
    "Si sientes fatiga acumulada, un día extra de descanso no es un retroceso, es parte del progreso."
  ],
  motivacion: [
    "Empieza pequeño: una meta de 10 minutos diarios es más sostenible que prometerte una hora que abandonarás en dos semanas.",
    "Encuentra una actividad que disfrutes de verdad. El mejor ejercicio es el que sí vas a hacer.",
    "Llevar un registro simple de tus sesiones ayuda a ver el progreso, y ver progreso es el combustible más fuerte para seguir."
  ],
  proteina: [
    "Incluir una fuente de proteína en cada comida (huevo, legumbres, pollo, pescado, tofu) ayuda a mantener la masa muscular y da más saciedad.",
    "No hace falta contar gramos exactos si estás empezando: basta con que la proteína ocupe una porción visible de tu plato, del tamaño de tu palma.",
    "Las legumbres (lentejas, garbanzos, frijoles) son una fuente de proteína económica y rica en fibra."
  ],
  frutas_verduras: [
    "Intenta que la mitad de tu plato en las comidas principales sean frutas y verduras: aportan fibra, vitaminas y te ayudan a sentirte satisfecho.",
    "Variar los colores en el plato (verde, rojo, naranja, morado) es una forma simple de asegurar distintos nutrientes.",
    "Las frutas y verduras congeladas conservan la mayoría de sus nutrientes y son una alternativa práctica y económica."
  ],
  hidratacion: [
    "Como referencia general, unos 6 a 8 vasos de agua al día son un buen objetivo, ajustando según tu actividad y el clima.",
    "Si haces ejercicio o hace calor, necesitarás más agua de lo habitual. Una señal simple es que tu orina se vea de color claro.",
    "El agua es la mejor opción para hidratarte; las bebidas azucaradas suman calorías extra sin darte la misma saciedad."
  ],
  azucar: [
    "No se trata de eliminar el azúcar por completo, sino de que no sea la base de tu dieta diaria. Revisa etiquetas: muchos productos procesados llevan azúcar oculta.",
    "Cambiar bebidas azucaradas por agua o infusiones sin azúcar es uno de los cambios con mayor impacto y más fácil de sostener.",
    "La fruta entera es una mejor opción que el jugo: tiene fibra que hace más lenta la absorción del azúcar."
  ],
  planificacion: [
    "Planificar tus comidas de la semana con anticipación reduce la tentación de recurrir a opciones rápidas poco saludables.",
    "Cocinar en lote (batch cooking) uno o dos días a la semana te ahorra tiempo y facilita comer balanceado el resto de la semana.",
    "Tener snacks saludables a la mano (frutos secos, fruta, yogur) evita que el hambre te lleve a la opción menos saludable disponible."
  ],
  general: [
    "Cuéntame más: ¿te interesa hablar de ejercicio (cardio, fuerza, motivación) o de alimentación (proteínas, frutas y verduras, hidratación, azúcar)?",
    "Puedo ayudarte con rutina de ejercicio o con hábitos de alimentación balanceada. ¿Sobre cuál quieres que profundicemos?",
    "Un buen hábito de salud combina moverte con regularidad y comer variado. ¿Por cuál de los dos quieres empezar?"
  ]
};

function pick(topic){
  const arr = bank[topic] || bank.general;
  return arr[Math.floor(Math.random()*arr.length)];
}

function detectTopic(text){
  const t = text.toLowerCase();
  if(/cardio|correr|trotar|bici|nadar|aer[oó]bic/.test(t)) return 'cardio';
  if(/fuerza|pesas|musculo|músculo|gym|gimnasio|levantar/.test(t)) return 'fuerza';
  if(/estir|flexibil|yoga|movilidad/.test(t)) return 'estiramiento';
  if(/cu[aá]ntas veces|frecuencia|d[ií]as a la semana|cada cu[aá]nto entren/.test(t)) return 'frecuencia';
  if(/motiva|animo|ánimo|pereza|constancia|habito|hábito/.test(t)) return 'motivacion';
  if(/proteina|proteína|carne|huevo|legumbre|pollo/.test(t)) return 'proteina';
  if(/fruta|verdura|vegetal/.test(t)) return 'frutas_verduras';
  if(/agua|hidrat|tomar liquido|líquido/.test(t)) return 'hidratacion';
  if(/azucar|azúcar|dulce|refresco|gaseosa/.test(t)) return 'azucar';
  if(/planif|menu|menú|organizar comida|batch/.test(t)) return 'planificacion';
  if(/aliment|comer|comida|dieta|nutrici/.test(t)) return 'planificacion';
  return 'general';
}

function addBubble(text, who){
  const b = document.createElement('div');
  b.className = 'bubble ' + who;
  b.textContent = text;
  log.appendChild(b);
  log.scrollTop = log.scrollHeight;
}

function respondTo(val){
  addBubble(val, 'user');
  robot.classList.add('wave','talk');
  setTimeout(()=>{
    addBubble(pick(detectTopic(val)), 'bot');
    robot.classList.remove('wave','talk');
  }, 650);
}

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const val = input.value.trim();
  if(!val) return;
  input.value = '';
  respondTo(val);
});

document.querySelectorAll('.chip').forEach(chip=>{
  chip.addEventListener('click', ()=> respondTo(chip.dataset.q));
});
