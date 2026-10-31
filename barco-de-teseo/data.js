// Guía de lectura de «S. / El barco de Teseo» (J.J. Abrams y Doug Dorst, 2013).
// Todos los textos son resúmenes y descripciones originales, redactados en español
// para uso personal de lectura. No reproducen texto del libro.
// Numeración de páginas: edición en inglés (la del ejemplar de Ship of Theseus, 1949, ficticio).
// Nivel de certeza: "alta" = verificado en el libro o en varias fuentes; "media" = fuente de fans
// o lectura frecuente; "baja" = teoría.

export const LIBRO = {
  titulo: "S. — El barco de Teseo",
  autores: "Idea de J.J. Abrams · escrito por Doug Dorst · 2013",
  objeto:
    "Un ejemplar de biblioteca de «Ship of Theseus» (1949), novela de V.M. Straka traducida y anotada por F.X. Caldeira. En sus márgenes, dos lectores —Jen y Eric— conversan a mano mientras investigan quién fue Straka. Entre las páginas hay 22 documentos sueltos (insertos).",
  capas: [
    {
      id: "novela",
      nombre: "La novela de Straka",
      color: "#3b2f2a",
      desc: "La historia de S., un hombre sin memoria arrastrado a un barco imposible y a una lucha contra el industrial Vévoda y sus Agentes.",
    },
    {
      id: "caldeira",
      nombre: "Caldeira y Straka",
      color: "#7a5a1e",
      desc: "El prólogo y las notas al pie de la traductora F.X. Caldeira. Parecen notas académicas, pero esconden mensajes cifrados y una relación personal con Straka.",
    },
    {
      id: "margenes",
      nombre: "Jen y Eric",
      color: "#2c4a7a",
      desc: "Las notas a mano de dos estudiantes de Pollard State University. Investigan el misterio Straka, se enfrentan a peligros reales y se enamoran a través de los márgenes.",
    },
  ],
};

// Desfase verificado en el escaneo: página del PDF − 18 = página impresa.
export const CAPITULOS = [
  {
    id: "prologo",
    num: "—",
    titulo: "Nota del traductor y prólogo",
    tituloEn: "Translator's Note and Foreword",
    desde: 0,
    hasta: 2,
    paginasTexto: "pp. v–xii aprox.",
    resumen:
      "Caldeira presenta a Straka: un autor célebre y perseguido del que nadie conoce el rostro. Repasa la polémica sobre su identidad y enumera a los candidatos que se han propuesto, aunque dice que no le interesa resolverla. Cuenta que trabajó con él durante dos décadas solo por correspondencia, que la citó en un hotel de La Habana para entregarle el capítulo final y que encontró la habitación destrozada. Rescató algunas hojas y reconstruyó el capítulo 10. Advierte que la última página nunca apareció.",
    claves: [
      "Lee con lupa lo que Caldeira niega: muchas negaciones funcionan como pistas.",
      "Las notas al pie del prólogo ya tienen un tono personal, no solo académico.",
      "Aquí se presentan los candidatos a ser Straka. Jen y Eric los discuten durante todo el libro.",
    ],
  },
  {
    id: "c1",
    num: "1",
    titulo: "Lo que empieza, lo que termina",
    tituloEn: "What Begins, What Ends",
    desde: 3,
    hasta: 36,
    resumen:
      "Un hombre sin memoria vaga de noche por el barrio viejo de una ciudad portuaria. En una taberna cruza unas palabras con una joven que lee sola, y siente que la conoce. Es atacado y aparece a bordo de un barco extraño, tripulado por marineros con la boca cosida. Allí recibe el único nombre que tendrá: S.",
    claves: [
      "Primeras apariciones de Sola y del símbolo de la S.",
      "El barco cambia constantemente: es el «barco de Teseo» de la paradoja filosófica.",
      "Las primeras notas de Caldeira empiezan a dejar rastros para quien sepa leerlos.",
    ],
  },
  {
    id: "c2",
    num: "2",
    titulo: "Los gemelos a la deriva",
    tituloEn: "The Drifting Twins",
    desde: 37,
    hasta: 68,
    resumen:
      "S. aprende las reglas del barco. Maelstrom, el único marinero que habla, se burla de sus preguntas. La tripulación se comunica con silbatos y las estrellas no están donde deberían. Tras un encuentro con otra embarcación y una tormenta, S. termina en el mar, nadando hacia una costa desconocida.",
    claves: [
      "Maelstrom es la voz del barco: fíjate en lo que sabe y en lo que calla.",
      "El tiempo y el espacio a bordo no funcionan como en tierra.",
    ],
  },
  {
    id: "c3",
    num: "3",
    titulo: "La emersión",
    tituloEn: "The Emersion",
    desde: 69,
    hasta: 110,
    resumen:
      "S. llega a la ciudad de B——, donde los obreros protestan frente a la fábrica de armas de Vévoda. Conoce a un grupo de agitadores (Stenfalk, Ostrero, Pfeifer y la enigmática Corbeau) y vuelve a ver fugazmente a Sola. Los Agentes de Vévoda, de abrigo marrón, vigilan la protesta. Una explosión en el muelle convierte la manifestación en una masacre.",
    claves: [
      "Primera aparición de los Agentes de Vévoda: violencia disfrazada de orden.",
      "Los compañeros de S. funcionan como un espejo del grupo de escritores que pudo estar detrás del nombre «Straka».",
    ],
  },
  {
    id: "c4",
    num: "4",
    titulo: "Agente X",
    tituloEn: "Agent X",
    desde: 111,
    hasta: 166,
    resumen:
      "La prensa culpa del atentado a los manifestantes y el grupo tiene que huir. Cruzan bosques y montañas mientras cuentan historias junto al fuego. Stenfalk se debilita. S. duda entre su búsqueda personal y la lealtad al grupo.",
    claves: [
      "Fíjate en quién cuenta cada historia y por qué.",
      "Las notas de Caldeira mencionan cartas y anécdotas de Straka: compáralas con lo que dicen Jen y Eric.",
    ],
  },
  {
    id: "c5",
    num: "5",
    titulo: "Abajo y fuera",
    tituloEn: "Down, and Out",
    desde: 167,
    hasta: 202,
    resumen:
      "El grupo se esconde en una cueva cubierta de pinturas antiguas. Los Agentes los encuentran, y la huida por los túneles cuesta caro: Stenfalk cae en manos de los Agentes y S. pierde a Corbeau en el agua. S. vuelve a encontrarse con el barco.",
    claves: [
      "El título del capítulo y la nota de Caldeira sobre él son relevantes para los cifrados.",
      "Las pinturas de la cueva retoman temas de otras obras de Straka.",
    ],
  },
  {
    id: "c6",
    num: "6",
    titulo: "Un perro dormido",
    tituloEn: "A Sleeping Dog",
    desde: 203,
    hasta: 258,
    resumen:
      "De nuevo a bordo, S. presencia el ritual de costura de bocas, una de las escenas más perturbadoras del libro. Desembarca con un guía en una ciudad mediterránea bajo bombardeo, descubre la magnitud de la red de Vévoda y escucha leyendas sobre una mujer que recuerda a Sola.",
    claves: [
      "La escena de la costura marcó a Eric de adolescente: lo cuenta en los márgenes.",
      "Vévoda aparece como fabricante de guerras que se esconde tras empresas fachada.",
    ],
  },
  {
    id: "c7",
    num: "7",
    titulo: "La isla de obsidiana",
    tituloEn: "The Obsidian Island",
    desde: 259,
    hasta: 298,
    resumen:
      "S. estudia fotografías y expedientes de Agentes. El barco llega a una isla volcánica negra con un almacén enorme, donde S. intenta descubrir qué transporta el barco y para qué. La escritura (con qué tinta, con qué sangre, para quién) se vuelve el centro de su identidad.",
    claves: [
      "Las piezas de obsidiana con la S reaparecen en la investigación real de Jen y Eric.",
      "Aquí el tema de escribir como forma de existir se vuelve explícito.",
    ],
  },
  {
    id: "interludio",
    num: "≈",
    titulo: "Interludio: Tocata y fuga en tiempo libre",
    tituloEn: "Interlude [Toccata and Fugue in Free Time]",
    desde: 299,
    hasta: 330,
    resumen:
      "El relato se acelera y salta años. S. se convierte en un asesino de Agentes de Vévoda, envejece y sigue volviendo al barco. Hay un pasaje narrado en segunda persona desde el punto de vista de un Agente, y la violencia empieza a desgastar a S.",
    claves: [
      "Es el único tramo en segunda persona: pregúntate a quién le habla.",
      "Los números de los Agentes (#4, #9, #41…) no están puestos al azar.",
    ],
  },
  {
    id: "c8",
    num: "8",
    titulo: "El territorio",
    tituloEn: "The Territory",
    desde: 331,
    hasta: 374,
    resumen:
      "En una cuenca selvática explotada por las minas de Vévoda, S. remonta el río en canoa con dos guías locales. Llega hasta el gobernador del lugar, alguien de su pasado, y presencia la destrucción de las comunidades y de la montaña. Sola reaparece en medio del caos.",
    claves: [
      "El reencuentro con el gobernador conecta con personajes de los capítulos 3 y 4.",
      "Es el retrato más directo de la explotación colonial en la novela.",
    ],
  },
  {
    id: "c9",
    num: "9",
    titulo: "Pájaros de espacio negativo",
    tituloEn: "Birds of Negative Space",
    desde: 375,
    hasta: 414,
    resumen:
      "Ya mayor, S. vive exiliado en una ciudad helada, leyendo periódicos en busca de señales. Sola lo encuentra y le anuncia que tienen un barco. Vuelven al mar juntos, hablan del trabajo, de la escritura y del pasado, y ponen rumbo al castillo de Vévoda.",
    claves: [
      "Según Jen y Eric, este capítulo tiene una sola nota al pie, y eso ya es una pista para el cifrado.",
      "La relación S.–Sola refleja la de Straka y Caldeira… y la de Eric y Jen.",
    ],
  },
  {
    id: "c10",
    num: "10",
    titulo: "Barcos de Teseo",
    tituloEn: "Ships of Theseus",
    desde: 415,
    hasta: 456,
    resumen:
      "El barco entra en la gruta de los corsarios bajo el castillo de Vévoda, en plena fiesta de la vendimia. S. y Sola se infiltran como sirvientes para enfrentar por fin a Vévoda. Es el capítulo que Caldeira reconstruyó de las hojas rescatadas: ella misma advierte que no dirá dónde terminan las palabras de Straka y dónde empiezan las suyas.",
    claves: [
      "Lee la nota de Caldeira sobre la reconstrucción del capítulo como un mensaje, no como una aclaración técnica.",
      "La rueda Eötvös (inserto en la contratapa) sirve para el cifrado de este capítulo.",
      "El final que leíste puede no ser el final que escribió Straka.",
    ],
  },
];

// Fuente de páginas: lista comunitaria de insertos (wiki S., Fandom), cruzada con
// elbarcodestraka.wordpress.com/insertos (coinciden las 22 ubicaciones) y con los catálogos
// de biblioteca. Descripciones originales.
export const INSERTOS = [
  { pag: "vi–vii", desde: 0, hasta: 2, tipo: "Carta", titulo: "Carta de Straka a Herr Grahn (17 de agosto de 1928)", desc: "Carta atribuida a Straka. Es uno de los pocos documentos «de su puño» y sirve para discutir su estilo, su idioma y su identidad." },
  { pag: "10–11", desde: 10, hasta: 11, tipo: "Nota", titulo: "Lista de acusaciones contra Straka", desc: "Escrita en papel de Pollard State University. Repasa los crímenes y actos de sabotaje que la leyenda atribuye a Straka." },
  { pag: "20–21", desde: 20, hasta: 21, tipo: "Artículo", titulo: "Artículo de la «Toronto Review» sobre el incendio de San Tadeo de la Tejera", desc: "Texto académico sobre un incendio de 1759 que destruyó una biblioteca singular y que menciona un «Libro de S». Conecta el símbolo S con una tradición muy anterior a Straka." },
  { pag: "32–33", desde: 32, hasta: 33, tipo: "Periódico", titulo: "«The Daily Pronghorn», 8 de enero de 2012 (pp. 1 y 2)", desc: "Periódico estudiantil de la universidad. Sitúa en el presente los hechos del campus que comentan Jen y Eric." },
  { pag: "54–55", desde: 54, hasta: 55, tipo: "Telegrama", titulo: "Telegrama de Straka a Karst & Son", desc: "Straka exige a su editorial que contrate a Caldeira como traductora. Es clave para entender el vínculo entre los dos." },
  { pag: "68–69", desde: 68, hasta: 69, tipo: "Recorte", titulo: "Noticia del suicidio de Václav Straka (31 de octubre de 1910)", desc: "Un obrero llamado Václav Straka se arroja de un puente en Praga y su cuerpo no aparece. Alimenta la teoría de que el nombre «Straka» fue tomado de él." },
  { pag: "86–87", desde: 86, hasta: 87, tipo: "Nota", titulo: "Nota de Jean-Bernard Desjardins a Eric", desc: "El veterano investigador francés le habla a Eric de unos papeles que le dejó en custodia." },
  { pag: "100–101", desde: 100, hasta: 101, tipo: "Nota", titulo: "Nota de Jen a Eric: «el día que desaparecí»", desc: "Jen cuenta que desapareció cinco o seis horas y menciona su ruptura con Jacob. Abre uno de los misterios personales del libro." },
  { pag: "112–113", desde: 112, hasta: 113, tipo: "Postal", titulo: "Postal desde Lençóis, Brasil (13/04/2012), firmada «E-»", desc: "Primera de las postales que Eric envía desde Brasil siguiendo el rastro de Caldeira." },
  { pag: "130–131", desde: 130, hasta: 131, tipo: "Foto", titulo: "Fotografía de una cueva con el símbolo S", desc: "Une la cueva de la novela con lugares reales marcados con la S." },
  { pag: "178–179", desde: 178, hasta: 179, tipo: "Postal", titulo: "Postal desde Feira Nova, Brasil (15/04/2012), firmada «E-»", desc: "Eric sigue el viaje por el nordeste de Brasil." },
  { pag: "190–191", desde: 190, hasta: 191, tipo: "Postal", titulo: "Postal desde Valença, Brasil (18/04/2012), firmada «E-»", desc: "Eric se acerca a la pista de Caldeira." },
  { pag: "192–193", desde: 192, hasta: 193, tipo: "Postal", titulo: "Postal desde Ibirapitanga, Brasil (19 de abril), firmada «E-»", desc: "Más avances del viaje. Lee las postales en orden de fecha." },
  { pag: "200–201", desde: 200, hasta: 201, tipo: "Postal", titulo: "Postal desde cerca de Maraú, Brasil (matasellos 21/4/2012), firmada «E-»", desc: "Última postal del viaje." },
  { pag: "203–204", desde: 203, hasta: 204, tipo: "Carta", titulo: "Carta de Eric a Jen sobre su familia", desc: "Eric cuenta su historia familiar y su pasado: el origen de sus miedos y de su obsesión con Straka." },
  { pag: "242–243", desde: 242, hasta: 243, tipo: "Foto", titulo: "Fotografía de una mujer junto a un barco (¿Filomela Caldeira?)", desc: "Foto antigua que podría mostrar a la traductora. Es clave para la capa Caldeira." },
  { pag: "256–257", desde: 256, hasta: 257, tipo: "Tarjeta", titulo: "Tarjeta de Ermelinda Pega + obituario de F.X. Caldeira (2 piezas)", desc: "Una remitente brasileña envía el obituario de Caldeira con una nota: «para tu libro». Son dos piezas en la misma página. Pregúntate quién es Ermelinda." },
  { pag: "306–307", desde: 306, hasta: 307, tipo: "Mapa", titulo: "Servilleta con el mapa de los túneles de la universidad", desc: "Mapa dibujado a mano de los túneles bajo el campus de Pollard State. Tiene que ver con los peligros que corren Jen y Eric." },
  { pag: "360–361", desde: 360, hasta: 361, tipo: "Tarjeta", titulo: "Tarjeta con un dibujo de Desjardins y una cita de «Coriolis»", desc: "Une al investigador francés con una de las novelas de Straka." },
  { pag: "376–377", desde: 376, hasta: 377, tipo: "Carta", titulo: "Carta de Jen a Eric: la verdad de su desaparición", desc: "Jen le confiesa a Eric qué pasó realmente cuando desapareció de niña." },
  { pag: "416–417", desde: 416, hasta: 417, tipo: "Nota", titulo: "Nota de Ermelinda Pega a Jen y Eric", desc: "Un último mensaje desde Brasil, al comienzo del capítulo 10." },
  { pag: "contratapa", desde: 9999, hasta: 9999, tipo: "Rueda", titulo: "La rueda Eötvös", desc: "Disco decodificador de cartón. Se usa para descifrar el mensaje oculto del capítulo 10." },
];

// Capas de tinta. Las fuentes coinciden en el orden general; las variaciones están señaladas.
export const TINTAS = [
  { id: "lapiz", fase: 0, nombre: "Lápiz", quien: "Eric (solo)", hex: "#8a8a86", cuando: "Lo más antiguo: Eric anota el libro solo, en su época de estudiante, antes de conocer a Jen.", certeza: "alta" },
  { id: "azul", fase: 1, nombre: "Azul", quien: "Jen", hex: "#2b4fa8", cuando: "Primera conversación. Jen y Eric se conocen a través del libro, se miden y empiezan a investigar a Straka y los cifrados.", certeza: "alta" },
  { id: "negro1", fase: 1, nombre: "Negro (fase 1)", quien: "Eric", hex: "#1b1b1b", cuando: "Primera conversación: Eric responde en negro a las notas azules de Jen.", certeza: "alta" },
  { id: "naranja", fase: 2, nombre: "Naranja", quien: "Jen", hex: "#e07a1f", cuando: "Segunda conversación. Más confianza, bromas, la investigación avanza. En algunas impresiones el naranja se ve rojizo.", certeza: "media" },
  { id: "verde", fase: 2, nombre: "Verde", quien: "Eric", hex: "#2f8a4a", cuando: "Segunda conversación: Eric responde en verde.", certeza: "media" },
  { id: "morado", fase: 3, nombre: "Morado", quien: "Jen", hex: "#6a3fa0", cuando: "Tercera conversación. Crece la relación, aparecen peligros reales y se investiga a fondo a Caldeira.", certeza: "media" },
  { id: "rojo", fase: 3, nombre: "Rojo", quien: "Eric", hex: "#b3261e", cuando: "Tercera conversación: Eric en rojo.", certeza: "media" },
  { id: "negro4", fase: 4, nombre: "Negro (final)", quien: "Jen y Eric juntos", hex: "#000000", cuando: "Notas finales, escasas, escritas cuando ya están juntos. Hay que buscarlas.", certeza: "media" },
];

export const PERSONAJES = [
  { capa: "novela", nombre: "S.", desc: "Protagonista sin memoria. Busca quién es mientras el barco lo lleva de misión en misión." },
  { capa: "novela", nombre: "Sola", desc: "La mujer de la taberna. S. siente que la conoce. Aparece y desaparece a lo largo de toda la novela." },
  { capa: "novela", nombre: "Vévoda", desc: "Industrial y fabricante de armas que mueve gobiernos y guerras desde las sombras." },
  { capa: "novela", nombre: "Los Agentes", desc: "Ejecutores de Vévoda, a menudo de abrigo marrón. Algunos se identifican por número." },
  { capa: "novela", nombre: "Maelstrom", desc: "El único marinero que habla. Socarrón, guardián de las reglas del barco." },
  { capa: "novela", nombre: "Stenfalk, Ostrero, Pfeifer, Corbeau", desc: "Los agitadores que S. conoce en B——. Muchos lectores los relacionan con los escritores sospechosos de formar el grupo «S»." },
  { capa: "caldeira", nombre: "V.M. Straka", desc: "Autor de 19 novelas y figura legendaria, acusado de sabotajes y asesinatos políticos. Su identidad es el gran misterio del libro." },
  { capa: "caldeira", nombre: "F.X. Caldeira", desc: "Traductora de Straka durante más de 20 años. Firma el prólogo y las notas al pie, donde esconde mensajes." },
  { capa: "caldeira", nombre: "Karst & Son", desc: "Editorial histórica de Straka, que cerró de golpe. Caldeira tuvo que fundar su propio sello (Winged Shoes) para publicar el libro." },
  { capa: "caldeira", nombre: "Hermès Bouchard / Prix Bouchard", desc: "Industrial cuyo premio literario Straka rechazó con un gesto famoso: mandó a recogerlo a un mono capuchino." },
  { capa: "caldeira", nombre: "Los «Santorini Men»", desc: "Cadáveres sin identificar aparecidos por todo el mundo, cada uno con una página de una novela de Straka en el bolsillo." },
  { capa: "caldeira", nombre: "El grupo S", desc: "Teoría según la cual detrás de «Straka» habría un colectivo de escritores comprometidos políticamente." },
  { capa: "margenes", nombre: "Jen (Jennifer Heyward)", desc: "Estudiante de último año que trabaja en la biblioteca de Pollard State. Encuentra el libro y escribe la primera nota." },
  { capa: "margenes", nombre: "Eric Husch", desc: "Exestudiante de doctorado, expulsado tras acusar a su director de tesis, Moody, de robarle su trabajo. Lleva años obsesionado con Straka." },
  { capa: "margenes", nombre: "Profesor Moody", desc: "Académico especialista en Straka y antagonista de Eric. Quiere publicar «la» respuesta al misterio." },
  { capa: "margenes", nombre: "Ilsa", desc: "Asistente de Moody y profesora de Jen." },
  { capa: "margenes", nombre: "Jean-Bernard Desjardins", desc: "Veterano investigador francés de Straka, antiguo mentor de Moody. Le confía documentos a Eric." },
  { capa: "margenes", nombre: "Ermelinda Pega", desc: "Remitente brasileña de dos insertos. Su identidad es una de las revelaciones del libro." },
  { capa: "margenes", nombre: "Zeke", desc: "Tío marinero de Eric. Su historia explica buena parte de los miedos de Eric." },
];

// Candidatos que el libro discute. La app NUNCA da una respuesta sobre quién era Straka.
export const CANDIDATOS = [
  "Václav Straka (obrero de Praga)",
  "Torsten Ekstrom (novelista sueco)",
  "Amarante Durand (escritora francesa)",
  "Reinhold Feuerbach (escritor alemán)",
  "Tiago García Ferrara (escritor español)",
  "Guthrie MacInnes (filósofo escocés)",
  "Victor Martin Summersby (novelista inglés)",
  "Sindu Singh (escritor indio)",
  "Lewis Looper (aventurero estadounidense)",
  "Florence Stoneham-Smith (supuesta autora infantil)",
  "Un colectivo de escritores (el grupo S)",
  "La propia Caldeira",
];

// Cronología del universo del libro (resumen propio; fechas de la novela y de los insertos).
export const CRONOLOGIA = [
  { fecha: "1910", hecho: "Un obrero llamado Václav Straka se arroja de un puente en Praga y su cuerpo no aparece (inserto pp. 68–69)." },
  { fecha: "1911", hecho: "Se publica la primera novela de Straka, que lo vuelve famoso en Europa." },
  { fecha: "1912", hecho: "Straka rechaza el Premio Bouchard enviando a un mono capuchino a la ceremonia." },
  { fecha: "1924", hecho: "Por telegrama, Straka exige a Karst & Son que contrate a Caldeira como traductora (inserto pp. 54–55)." },
  { fecha: "1928", hecho: "Carta de Straka a Herr Grahn (inserto pp. vi–vii)." },
  { fecha: "1936–1951", hecho: "Primera ola de «Santorini Men»: cadáveres anónimos con páginas de Straka." },
  { fecha: "1946", hecho: "Cita en un hotel de La Habana: Caldeira encuentra la habitación destrozada y rescata hojas del capítulo 10." },
  { fecha: "1949", hecho: "Caldeira publica «Ship of Theseus» con su prólogo y sus notas." },
  { fecha: "Antes de 2012", hecho: "Eric, de adolescente, anota el libro a lápiz." },
  { fecha: "Ene. 2012", hecho: "Jen encuentra el libro en la biblioteca de Pollard State y empieza la conversación en los márgenes." },
  { fecha: "Abr. 2012", hecho: "Eric viaja a Brasil tras el rastro de Caldeira y envía postales (insertos pp. 112–201)." },
];

// Cifrados de Caldeira. Información parcial y marcada por certeza. La IA da pistas graduales.
export const CODIGOS = [
  { donde: "Notas al pie (general)", que: "Cada capítulo tiene un mensaje cifrado de Caldeira, normalmente escondido en sus notas al pie o ligado al título del capítulo.", certeza: "media" },
  { donde: "Capítulo 1", que: "Según análisis de lectores, el mensaje sale de las letras iniciales y finales de cada nota al pie.", certeza: "media" },
  { donde: "Capítulo 9", que: "Tiene una sola nota al pie. Jen y Eric se atascan con este cifrado.", certeza: "media" },
  { donde: "Capítulo 10", que: "Se descifra con la rueda Eötvös (inserto de la contratapa). Jen y Eric no lo resuelven en los márgenes. Los lectores lo resolvieron después.", certeza: "media" },
];

export function capituloDePagina(p) {
  if (p == null || isNaN(p)) return null;
  return CAPITULOS.find((c) => p >= c.desde && p <= c.hasta) || (p > 456 ? CAPITULOS[CAPITULOS.length - 1] : null);
}

export function insertosCerca(p, margen = 2) {
  if (p == null || isNaN(p)) return [];
  return INSERTOS.filter((i) => i.desde < 9999 && p >= i.desde - margen && p <= i.hasta + margen);
}

export const RECURSOS = [
  { nombre: "El Barco de Straka", url: "https://elbarcodestraka.wordpress.com", desc: "Web de fans en español: insertos, cronología, personajes, análisis por capítulo y versiones del capítulo 10." },
  { nombre: "Insertos (El Barco de Straka)", url: "https://elbarcodestraka.wordpress.com/insertos/", desc: "Lista de insertos con su página." },
  { nombre: "Wiki de S. (Fandom, en inglés)", url: "https://s.fandom.com/wiki/List_of_inserts", desc: "Lista de insertos con fotos, personajes y cronología detallada." },
  { nombre: "Who is Straka? (en inglés)", url: "https://whoisstraka.wordpress.com", desc: "Blog de lectores centrado en los cifrados y la rueda Eötvös. Contiene soluciones: úsalo con cuidado." },
];

