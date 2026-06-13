const BUILTIN_TEMPLATES = [
  {
    name: '🏫 Plantilla vacía',
    description: 'Grupo sin alumnos',
    students: [],
  },
  {
    name: '👶 1º Primaria A',
    description: '15 alumnos · 6-7 años',
    students: [
      'Ada López', 'Bruno Vila', 'Clara Solé', 'Dídac Roca',
      'Elia Puig', 'Ferran Coll', 'Gina Bosch', 'Hugo Plans',
      'Ivet Pons', 'Jan Tejedor', 'Laia Buch', 'Marc Farre',
      'Nil Cerdà', 'Ona Rovira', 'Pol Ventura',
    ],
  },
  {
    name: '🧒 2º Primaria A',
    description: '22 alumnos · 7-8 años',
    students: [
      'Ana Martínez', 'Bruno García', 'Carla López', 'Daniel Sánchez',
      'Elena Fernández', 'Francisco Pérez', 'Gloria Ruiz', 'Hugo Jiménez',
      'Irene Díaz', 'Javier Moreno', 'Lucas Álvarez', 'Marina Romero',
      'Nicolás Gil', 'Olivia Navas', 'Pablo Serrano', 'Raquel Molina',
      'Santiago Ortiz', 'Teresa Rubio', 'Valeria Campos', 'Yago Núñez',
      'Iván Sotelo', 'Lara Paredes',
    ],
  },
  {
    name: '🧪 Grupo reducido',
    description: '8 alumnos · para pruebas rápidas',
    students: [
      'Álex Mora', 'Blanca Riu', 'Carlos Seco', 'Diana Vall',
      'Eric Pla', 'Fiona Coll', 'Gerard Manyà', 'Helena Tor',
    ],
  },
  {
    name: '👦 4º Primaria B',
    description: '24 alumnos · 9-10 años',
    students: [
      'Adrián Vázquez', 'Beatriz Castro', 'Carlos Medina', 'Diana Herrera',
      'Enrique Flores', 'Fátima Ramírez', 'Gonzalo Torres', 'Helena Delgado',
      'Ismael Guzmán', 'Julia Mendoza', 'Lara Paredes', 'Mario Vega',
      'Natalia Cruz', 'Óscar León', 'Paula Ferrer', 'Rafael Moya',
      'Sandra Peña', 'Tomás Cabrera', 'Vicente Lorenzo', 'Yolanda Blasco',
      'Zoe Campos', 'Alexandre Paz', 'Candela Roldán', 'Hugo Garrido',
    ],
  },
  {
    name: '📚 1º ESO A',
    description: '26 alumnos · 12-13 años',
    students: [
      'Alba Castilla', 'Borja Santana', 'Celia Benítez', 'David Aguilar',
      'Eva Carvajal', 'Fernando Cuesta', 'Gemma Expósito', 'Héctor Herrero',
      'Inés Bueno', 'Joel Vargas', 'Laura Cortés', 'Manuel Lozano',
      'Noelia Palacios', 'Patricia Domínguez', 'Ruth Gallego', 'Samuel Aranda',
      'Tania Salas', 'Unai Pascual', 'Vanesa Haro', 'Xiana Barrios',
      'Yeray Rosales', 'Zara Cordero', 'Martín Almansa', 'Nerea Palomo',
      'Rubén Gimeno', 'Sara Anguita',
    ],
  },
  {
    name: '📖 3º ESO B',
    description: '28 alumnos · 14-15 años',
    students: [
      'Alejandro Lario', 'Bárbara Villar', 'César Ibáñez', 'Claudia Cano',
      'Diego Robles', 'Elsa Montes', 'Esteban Piña', 'Fabiola Roca',
      'Félix Andreu', 'Greta Alarcón', 'Iker Pujol', 'Jana Ferrández',
      'Jorge Ballesteros', 'Laia Cardona', 'Leo Pizarro', 'Lydia Toledano',
      'Marcos Solera', 'Mireia Bautista', 'Nahia Barroso', 'Oriol Pineda',
      'Rocío Manzanares', 'Saúl Melero', 'Selene Ceballos', 'Víctor Lamas',
      'Xiomara Vilanova', 'Yago Murillo', 'África Bohórquez', 'Izan Benavente',
    ],
  },
  {
    name: '🎓 4º ESO A',
    description: '26 alumnos · 15-16 años',
    students: [
      'Ángel Montero', 'Aroa Cisneros', 'Asier Valverde', 'Azahara Dueñas',
      'Cristian Suárez', 'Elsa Olmos', 'Erik Bartolomé', 'Gabriela Bermejo',
      'Guillermo Haro', 'Iria Salvador', 'Jesús Soria', 'Lidia Esteban',
      'Martín Almansa', 'Nerea Palomo', 'Pau Ferrándiz', 'Reyes Martos',
      'Rubén Gimeno', 'Sara Anguita', 'Sergi Bazán', 'Silvia Capitán',
      'Valentín Luna', 'Vega Dorado', 'Adriana Jerez', 'Mar Galindo',
      'Carlota Gavilán', 'Dani Mateo',
    ],
  },
  {
    name: '🧪 1º Bachillerato Ciencias',
    description: '24 alumnos · 16-17 años',
    students: [
      'Alberto Márquez', 'Alicia Huertas', 'Andrés Millán', 'Ariadna Raya',
      'Bernat Ribas', 'Blanca Colomer', 'Darío Escudero', 'Elena Santamaría',
      'Eduardo Ferrándiz', 'Irene Quesada', 'Jordi Alcaraz', 'Leyre Espinosa',
      'Marcos Verdugo', 'Marta Cazorla', 'Mateo Baró', 'Naiara Valdés',
      'Pol Guinart', 'Raquel Mayoral', 'Ricardo Zafra', 'Tania Sotelo',
      'Xavi López', 'Helena Roselló', 'Joan Palau', 'Laia Valls',
    ],
  },
  {
    name: '💼 2º Bachillerato Sociales',
    description: '22 alumnos · 17-18 años',
    students: [
      'Aina Soler', 'Aitor Pascual', 'Aurora Villalba', 'Carlota Gavilán',
      'Dani Mateo', 'Ester Macías', 'Francesc Cubells', 'Gael Tejedor',
      'Iciar Nogués', 'Júlia Canet', 'Lluís Gras', 'Mariona Colom',
      'Miquel Barceló', 'Noa Capdevila', 'Pilar Fuster', 'Pol Camps',
      'Queralt Pujol', 'Rosa Artigas', 'Txema Casals', 'Bernat Roura',
      'Carla Pagès', 'Sònia Guasch',
    ],
  },
  {
    name: '📋 FP GM Gestión Administrativa',
    description: '20 alumnos',
    students: [
      'Aarón Bustos', 'Ainhoa Cerdán', 'Aleix Pulido', 'Amanda Vilanova',
      'Carmen Jarque', 'Cristian Mateu', 'Daniela Rius', 'Darío Borja',
      'Esther Sisternes', 'Fermín Bustamante', 'Gisela Viaplana', 'Josep Torrents',
      'Judit Grau', 'Laia Casanova', 'Marçal Pagès', 'Núria Boladeras',
      'Roc Vilanova', 'Salvador Boada', 'Toni Vallès', 'Vanessa Puig',
    ],
  },
  {
    name: '🛠️ FP Básica Electricidad',
    description: '16 alumnos',
    students: [
      'Alejandro Chacón', 'Bryan Monroy', 'David Aldea', 'Edu López',
      'Fran Cabañas', 'Gonzalo Herranz', 'Iván Dueñas', 'Jesús Borrego',
      'Kevin Aranda', 'Luis Ferrero', 'Mohamed Alí', 'Pablo Villena',
      'Rafa Espinar', 'Samuel Bejarano', 'Vicente Izquierdo', 'Youssef Aarab',
    ],
  },
]

const FIRST_NAMES = {
  boys: ['Alejandro','Bruno','Carlos','Daniel','David','Diego','Eduardo','Enrique','Félix','Fernando','Francisco','Gonzalo','Guillermo','Héctor','Hugo','Iker','Ismael','Iván','Javier','Jesús','Jorge','José','Juan','Leo','Luis','Manuel','Marcos','Martín','Miguel','Nicolás','Óscar','Pablo','Pedro','Rafael','Ricardo','Roberto','Rubén','Samuel','Santiago','Sergio','Tomás','Vicente','Víctor','Yago','Álvaro','Ángel'],
  girls: ['Alba','Ana','Andrea','Beatriz','Carla','Carmen','Celia','Claudia','Cristina','Diana','Elena','Elsa','Eva','Fátima','Gabriela','Gemma','Helena','Inés','Irene','Jana','Julia','Laia','Laura','Leyre','Lydia','María','Marina','Marta','Natalia','Nerea','Noelia','Olivia','Paula','Raquel','Rocío','Sandra','Sara','Silvia','Sofía','Tania','Valeria','Vega','Zoe'],
}
const SURNAMES = ['García','López','Martínez','Sánchez','Fernández','Pérez','Ruiz','Jiménez','Moreno','Muñoz','Álvarez','Romero','Gil','Navas','Serrano','Molina','Ortiz','Rubio','Marín','Campos','Núñez','Vázquez','Castro','Medina','Herrera','Flores','Ramírez','Torres','Delgado','Guzmán','Mendoza','Rivas','Paredes','Vega','Cruz','León','Ferrer','Moya','Peña','Cabrera','Calvo','Lorenzo','Blasco','Paz','Domínguez','Santos','Palacios','Cortés','Lozano','Gallego','Salas','Pascual','Barrios','Rosales','Cordero','Villar','Montes','Piña','Roca','Alarcón','Pujol','Cardona','Pizarro','Solera','Bautista','Pineda','Manzanares','Melero','Ceballos','Lamas','Murillo','Roldán','Garrido']

function generateRandomStudents(count) {
  const used = new Set()
  const students = []
  for (let i = 0; i < count; i++) {
    let name
    do {
      const gender = Math.random() > 0.5 ? 'boys' : 'girls'
      const first = FIRST_NAMES[gender][Math.floor(Math.random() * FIRST_NAMES[gender].length)]
      const last = SURNAMES[Math.floor(Math.random() * SURNAMES.length)]
      name = `${first} ${last}`
    } while (used.has(name))
    used.add(name)
    students.push({ id: generateId(), name })
  }
  return students
}

function generateRealisticResponses(students, activeQuestions) {
  const responses = {}
  if (!activeQuestions.length) return responses

  for (const respondent of students) {
    const others = students.filter(s => s.id !== respondent.id)
    const answer = {}

    for (let qi = 0; qi < activeQuestions.length; qi++) {
      const q = activeQuestions[qi]
      const max = Math.min(q.maxChoices || 3, others.length)
      const isRejection = (q.type || '').includes('Rechazo')
      const isPerception = (q.type || '').includes('Percepción')
      let chosen = []

      if (isRejection) {
        const shuffled = [...others].sort(() => Math.random() - 0.5)
        chosen = shuffled.slice(0, Math.min(1 + Math.floor(Math.random() * 2), max))
      } else if (isPerception) {
        chosen = [[...others].sort(() => Math.random() - 0.5).slice(0, 1)]
      } else {
        const bias = others.slice(0, Math.ceil(others.length * 0.35))
        const pool = Math.random() > 0.25 ? bias : others
        const shuffled = [...pool].sort(() => Math.random() - 0.5)
        const n = Math.min(max, Math.max(1, 2 + Math.floor(Math.random() * 2)))
        chosen = shuffled.slice(0, n)
      }
      answer[qi] = chosen.map(s => s.id)
    }
    responses[respondent.id] = answer
  }
  return responses
}

async function generateTestData() {
  const pool = BUILTIN_TEMPLATES.filter(t => t.students.length > 0)
  const pick = [pool[5], pool[3], pool[2]] // 4º ESO, 1º ESO, 4º Primaria
  const groups = []
  const allResponses = {}

  for (const tmpl of pick) {
    const group = {
      id: generateId(),
      name: `${tmpl.name.replace(/^[^\s]+\s/, '')} · DATOS PRUEBA`,
      students: tmpl.students.map(s => ({ id: generateId(), name: s })),
      createdAt: new Date().toISOString(),
    }
    groups.push(group)

    const baseQs = [
      { text: '¿A quién elegirías para un trabajo?', type: 'Elección positiva', maxChoices: 3, active: true },
      { text: '¿A quién NO querrías en tu equipo?', type: 'Rechazo', maxChoices: 2, active: true },
      { text: '¿Quién es más popular?', type: 'Percepción positiva', maxChoices: 1, active: true },
    ]
    allResponses[group.id] = generateRealisticResponses(group.students, baseQs)
  }

  const existing = await loadGroups()
  await saveGroups([...existing, ...groups])
  for (const [gid, r] of Object.entries(allResponses)) await saveResponses(gid, r)
  return groups
}