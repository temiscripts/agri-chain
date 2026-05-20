const PROMPTS = {
  welcome: {
    english: 'Welcome to *AgriChain* 🌱\nAI Farm Advisor for Nigerian smallholder farmers.\n\nFirst, what language do you prefer?\n\n1. English\n2. Hausa\n3. Yoruba\n4. Igbo\n\nReply with the number or language name.',
    hausa: 'Welcome to *AgriChain* 🌱\nAI Farm Advisor for Nigerian smallholder farmers.\n\nFirst, what language do you prefer?\n\n1. English\n2. Hausa\n3. Yoruba\n4. Igbo\n\nReply with the number or language name.',
    yoruba: 'Welcome to *AgriChain* 🌱\nAI Farm Advisor for Nigerian smallholder farmers.\n\nFirst, what language do you prefer?\n\n1. English\n2. Hausa\n3. Yoruba\n4. Igbo\n\nReply with the number or language name.',
    igbo: 'Welcome to *AgriChain* 🌱\nAI Farm Advisor for Nigerian smallholder farmers.\n\nFirst, what language do you prefer?\n\n1. English\n2. Hausa\n3. Yoruba\n4. Igbo\n\nReply with the number or language name.',
  },
  askCrop: {
    english: 'Great! What crop are you growing?\n\nSupported: rice, maize, cassava, yam, tomato, sorghum, millet, cowpea, beans, groundnut',
    hausa: 'To! Wane irin amfanin gona kake nomawa?\n\nDa ake samu: rice, maize, cassava, yam, tomato, sorghum, millet, cowpea, beans, groundnut',
    yoruba: 'Ó dára! Iru ọgbin wo ni o ń gbin?\n\nÀwọn tó wà: rice, maize, cassava, yam, tomato, sorghum, millet, cowpea, beans, groundnut',
    igbo: 'Ọ dị mma! Kedu ụdị ihe ọkụkụ ị na-akụ?\n\nNdị anyị nwere: rice, maize, cassava, yam, tomato, sorghum, millet, cowpea, beans, groundnut',
  },
  askState: {
    english: 'Which Nigerian state is your farm in?\n\nExample: Lagos, Kebbi, Oyo',
    hausa: 'A wace jihar Najeriya gonarka take?\n\nMisali: Lagos, Kebbi, Oyo',
    yoruba: 'Ipinle wo ni ọgba rẹ wà?\n\nÀpẹẹrẹ: Lagos, Kebbi, Oyo',
    igbo: 'Olee steeti Naịjirịa ka ugbo gị dị?\n\nỌmụmaatụ: Lagos, Kebbi, Oyo',
  },
  askSize: {
    english: 'How many hectares is your farm?\n\nExample: 2',
    hausa: 'Hekta nawa ce gonarka?\n\nMisali: 2',
    yoruba: 'Hectare mélòó ni ọgba rẹ?\n\nÀpẹẹrẹ: 2',
    igbo: 'Hectare ole ka ugbo gị buru?\n\nỌmụmaatụ: 2',
  },
  generating: {
    english: 'Got it! Generating your {crop} farm plan for {state}. This takes about 20 seconds...',
    hausa: 'Na samu! Ina shirya tsarin gonar {crop} a {state}. Yana ɗauka kusan dakika 20...',
    yoruba: 'Mo gbó! Mo ń ṣe ètò ọgbà {crop} fún {state}. Ó máa gbé nǹkan bí ìṣẹ́jú-aaya 20...',
    igbo: 'Aghọtara m! A na m emepụta atụmatụ ugbo {crop} maka {state}. Ọ na-ewe ihe dị ka sekọnd 20...',
  },
  followUp: {
    english: '\n\n💬 You can ask follow-up questions like _"what pesticide should I use?"_ or _"what if rain comes late?"_\n\nOr reply *new plan* to start a new plan.',
    hausa: '\n\n💬 Kana iya yin ƙarin tambayoyi kamar _"wane irin maganin kwari ya kamata in yi amfani da shi?"_ ko _"me ya kamata in yi idan ruwa ya makara?"_\n\nKo amsa *new plan* don fara sabon tsari.',
    yoruba: '\n\n💬 O lè bi mí àwọn ìbéérè síwájú síi bíi _"oogun kòkòrò wo ni mo lè lò?"_ tàbí _"kí ni màá ṣe tí òjò bá pẹ́?"_\n\nTàbí dáhùn *new plan* láti bẹ̀rẹ̀ ètò tuntun.',
    igbo: '\n\n💬 Ị nwere ike ịjụ ajụjụ ndị ọzọ dị ka _"kedu ọgwụ pesticide m ga-eji?"_ ma ọ bụ _"gịnị ka m ga-eme ma mmiri ozuzo ada nke ọma?"_\n\nMa ọ bụ zaa *new plan* iji malite atụmatụ ọhụrụ.',
  },
  invalidLanguage: {
    english: 'Please choose a language by replying with 1, 2, 3, 4 — or *english*, *hausa*, *yoruba*, *igbo*.',
  },
  invalidCrop: {
    english: 'Sorry, that crop is not supported. Try: rice, maize, cassava, yam, tomato, sorghum, millet, cowpea, beans, groundnut',
    hausa: 'Yi haƙuri, ba a tallafa wa wannan amfanin gona ba. Gwada: rice, maize, cassava, yam, tomato, sorghum, millet, cowpea, beans, groundnut',
    yoruba: 'Mà bínú, a kò ṣe àtìlẹyìn fún ọgbin yẹn. Gbìyànjú: rice, maize, cassava, yam, tomato, sorghum, millet, cowpea, beans, groundnut',
    igbo: 'Ndo, anyị anaghị akwado ihe ọkụkụ ahụ. Gbalịa: rice, maize, cassava, yam, tomato, sorghum, millet, cowpea, beans, groundnut',
  },
  invalidState: {
    english: 'That doesn\'t match a Nigerian state. Try: Lagos, Kebbi, Oyo, Kano, Plateau, etc.',
    hausa: 'Wannan ba ya dace da jihar Najeriya ba. Gwada: Lagos, Kebbi, Oyo, Kano, Plateau, da sauransu.',
    yoruba: 'Yẹn kò bá ipinle Naijiria mu. Gbìyànjú: Lagos, Kebbi, Oyo, Kano, Plateau, àti bẹ́ẹ̀ bẹ́ẹ̀ lọ.',
    igbo: 'Nke ahụ adabaghị na steeti Naịjirịa. Gbalịa: Lagos, Kebbi, Oyo, Kano, Plateau, wdg.',
  },
  invalidSize: {
    english: 'Please enter a valid number of hectares (e.g. 1, 2.5, 10).',
    hausa: 'Don Allah shigar da hekta mai inganci (misali 1, 2.5, 10).',
    yoruba: 'Jọ̀wọ́, tẹ̀ nọ́mbà hectare tó péye (bí 1, 2.5, 10).',
    igbo: 'Biko tinye ọnụ ọgụgụ hectare ziri ezi (dịka 1, 2.5, 10).',
  },
}

const CROPS = ['rice', 'maize', 'cassava', 'yam', 'tomato', 'sorghum', 'millet', 'cowpea', 'beans', 'groundnut']
const STATES = ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara']

function t(key, language = 'english', vars = {}) {
  const translations = PROMPTS[key] || {}
  let text = translations[language] || translations.english || ''
  for (const [k, v] of Object.entries(vars)) {
    text = text.replace(new RegExp(`{${k}}`, 'g'), v)
  }
  return text
}

function parseLanguage(input) {
  const lower = input.toLowerCase().trim()
  if (lower === '1' || lower === 'english' || lower === 'en') return 'english'
  if (lower === '2' || lower === 'hausa' || lower === 'ha') return 'hausa'
  if (lower === '3' || lower === 'yoruba' || lower === 'yo') return 'yoruba'
  if (lower === '4' || lower === 'igbo' || lower === 'ig') return 'igbo'
  return null
}

function parseCrop(input) {
  const lower = input.toLowerCase().trim()
  return CROPS.find((c) => lower.includes(c)) || null
}

function parseState(input) {
  const lower = input.toLowerCase().trim()
  return STATES.find((s) => lower.includes(s.toLowerCase())) || null
}

function parseSize(input) {
  const cleaned = input.replace(/hectares?|ha\b/gi, '').trim()
  const match = cleaned.match(/(\d+(?:\.\d+)?)/)
  if (!match) return null
  const size = parseFloat(match[1])
  if (isNaN(size) || size <= 0 || size > 500) return null
  return size
}

function isResetCommand(text) {
  const lower = text.toLowerCase().trim()
  return ['reset', 'restart', 'new plan', 'start over', 'new'].includes(lower)
}

module.exports = { t, parseLanguage, parseCrop, parseState, parseSize, isResetCommand }
