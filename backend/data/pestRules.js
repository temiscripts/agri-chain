module.exports = {
  rice: [
    {
      name: 'Blast Disease',
      trigger: (w) => w.avgHumidity > 80 && w.totalRainfall > 5,
      risk: 'high',
      action: 'Apply tricyclazole fungicide before the next rain event. Avoid excessive nitrogen fertiliser.',
    },
    {
      name: 'Brown Planthopper',
      trigger: (w) => w.avgTemp > 28 && w.avgHumidity > 75,
      risk: 'medium',
      action: 'Scout field edges at dawn. Apply imidacloprid only if infestation is confirmed.',
    },
    {
      name: 'Bacterial Leaf Blight',
      trigger: (w) => w.avgHumidity > 85,
      risk: 'medium',
      action: 'Ensure proper field drainage. Avoid overhead irrigation.',
    },
  ],
  maize: [
    {
      name: 'Fall Armyworm',
      trigger: (w) => w.avgTemp > 20,
      risk: 'high',
      action: 'Inspect whorl leaves daily. Apply emamectin benzoate at the first sign of damage.',
    },
    {
      name: 'Stem Borer',
      trigger: (w) => w.avgHumidity > 65,
      risk: 'medium',
      action: 'Apply carbofuran granules into the maize whorl at 2–3 weeks after emergence.',
    },
    {
      name: 'Maize Streak Virus',
      trigger: (w) => w.avgTemp > 25 && w.avgHumidity > 60,
      risk: 'medium',
      action: 'Control leafhopper vector with neem oil spray. Use resistant varieties next season.',
    },
  ],
  tomato: [
    {
      name: 'Tomato Leafminer (Tuta absoluta)',
      trigger: (w) => w.avgTemp > 22,
      risk: 'high',
      action: 'Use pheromone traps. Apply spinosad or abamectin. Remove and destroy infested leaves.',
    },
    {
      name: 'Early Blight',
      trigger: (w) => w.avgHumidity > 75 && w.totalRainfall > 3,
      risk: 'high',
      action: 'Apply mancozeb or chlorothalonil fungicide. Improve plant spacing for airflow.',
    },
    {
      name: 'Bacterial Wilt',
      trigger: (w) => w.avgTemp > 28 && w.avgHumidity > 80,
      risk: 'medium',
      action: 'Remove wilted plants immediately. Avoid waterlogging. Rotate crops next season.',
    },
  ],
  cassava: [
    {
      name: 'Cassava Mosaic Disease',
      trigger: (w) => w.avgTemp > 20,
      risk: 'medium',
      action: 'Use certified disease-free stems. Remove and burn infected plants.',
    },
    {
      name: 'Cassava Green Mite',
      trigger: (w) => w.avgTemp > 28 && w.avgHumidity < 60,
      risk: 'high',
      action: 'Apply acaricide or use predatory mites. Keep fields well-watered during dry season.',
    },
  ],
  yam: [
    {
      name: 'Yam Tuber Rot',
      trigger: (w) => w.avgHumidity > 85 && w.totalRainfall > 10,
      risk: 'high',
      action: 'Improve drainage. Treat seed yams with wood ash before planting. Avoid waterlogged plots.',
    },
    {
      name: 'Yam Mosaic Virus',
      trigger: (w) => w.avgTemp > 20,
      risk: 'medium',
      action: 'Use virus-free seed yams. Control aphid vectors with neem oil spray.',
    },
  ],
  sorghum: [
    {
      name: 'Striga (Witchweed)',
      trigger: (w) => w.avgTemp > 25,
      risk: 'high',
      action: 'Use Striga-resistant varieties. Apply imazapyr-coated seeds. Hand-pull Striga before it flowers.',
    },
    {
      name: 'Sorghum Stem Borer',
      trigger: (w) => w.avgHumidity > 60,
      risk: 'medium',
      action: 'Apply carbofuran granules at 2–3 weeks. Intercrop with cowpea as a trap crop.',
    },
  ],
  millet: [
    {
      name: 'Downy Mildew',
      trigger: (w) => w.avgHumidity > 80,
      risk: 'high',
      action: 'Use resistant varieties. Apply metalaxyl seed treatment. Rogue out infected seedlings early.',
    },
    {
      name: 'Striga',
      trigger: (w) => w.avgTemp > 25,
      risk: 'high',
      action: 'Use Striga-resistant varieties. Hand-weed before Striga flowers.',
    },
  ],
  cowpea: [
    {
      name: 'Pod Borer (Maruca vitrata)',
      trigger: (w) => w.avgTemp > 24,
      risk: 'high',
      action: 'Apply Bt (Bacillus thuringiensis) or spinosad during flowering. Harvest early to reduce losses.',
    },
    {
      name: 'Cowpea Aphid',
      trigger: (w) => w.avgTemp > 25 && w.avgHumidity < 60,
      risk: 'high',
      action: 'Apply neem oil spray. Use reflective mulch to deter aphids.',
    },
  ],
  beans: [
    {
      name: 'Bean Fly',
      trigger: (w) => w.avgTemp > 22 && w.avgHumidity > 70,
      risk: 'high',
      action: 'Apply imidacloprid seed treatment. Spray seedlings at 7 and 14 days after emergence.',
    },
    {
      name: 'Angular Leaf Spot',
      trigger: (w) => w.avgHumidity > 80 && w.totalRainfall > 5,
      risk: 'medium',
      action: 'Apply mancozeb at first sign. Improve plant spacing for airflow.',
    },
  ],
  groundnut: [
    {
      name: 'Early Leaf Spot',
      trigger: (w) => w.avgHumidity > 75 && w.totalRainfall > 5,
      risk: 'high',
      action: 'Apply chlorothalonil or mancozeb every 14 days during the wet season.',
    },
    {
      name: 'Rosette Virus',
      trigger: (w) => w.avgTemp > 20,
      risk: 'medium',
      action: 'Control aphid vectors with imidacloprid seed dressing. Plant early in the season.',
    },
  ],
}
