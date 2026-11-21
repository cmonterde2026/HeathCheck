import { HealthTipArticle, SymptomItem } from '../types/health';

export const SYMPTOM_CATALOG: SymptomItem[] = [
  {
    id: 'headache',
    name: 'Headache',
    category: 'Neurological',
    followUpQuestions: [
      'Did the headache start gradually or suddenly like a severe thunderclap?',
      'Is it accompanied by dehydration, eye strain, fever, or neck stiffness?',
    ],
    generalInfo:
      'Mild to moderate headaches are frequently linked to tension, dehydration, screen fatigue, missed meals, or disrupted sleep. Sudden, severe headaches or headaches with neurological changes require prompt medical evaluation.',
    selfCareGuidance: [
      'Drink a glass of water and rest in a quiet, dimly lit room.',
      'Apply a cool compress to your forehead or a warm compress to tight neck muscles.',
      'Take short breaks from bright screens and check whether you have eaten recently.',
    ],
    whenToSeekCare: [
      'Sudden, explosive headache reaching peak intensity within seconds or minutes.',
      'Headache accompanied by high fever, stiff neck, confusion, vision changes, or weakness.',
      'Headache following a head injury or worsening steadily over several days.',
    ],
  },
  {
    id: 'fever',
    name: 'Fever or Chills',
    category: 'General & Systemic',
    followUpQuestions: [
      'Have you measured your temperature with a thermometer, and how high is it?',
      'Are you able to keep fluids down and stay alert?',
    ],
    generalInfo:
      'A fever (typically 38.0°C / 100.4°F or higher) is a common systemic response when the body responds to routine viral or bacterial infections. Tracking temperature trends and hydration is helpful when speaking with a clinician.',
    selfCareGuidance: [
      'Stay well hydrated with water, clear broths, or oral rehydration solutions.',
      'Rest in light, breathable clothing and keep the room comfortably cool.',
      'Record temperature readings and timestamps to share with a healthcare provider if needed.',
    ],
    whenToSeekCare: [
      'Temperature of 39.4°C (103°F) or higher, or fever lasting more than 3 days.',
      'Difficulty breathing, persistent chest pain, severe headache, confusion, or stiff neck.',
      'Inability to keep fluids down or signs of severe dehydration.',
    ],
  },
  {
    id: 'sore-throat',
    name: 'Sore Throat',
    category: 'Respiratory',
    followUpQuestions: [
      'Is swallowing mildly uncomfortable, or are you having trouble swallowing liquids or saliva?',
      'Do you also have a cough, nasal congestion, or swollen glands in your neck?',
    ],
    generalInfo:
      'Throat irritation often results from dry air, vocal strain, allergies, or common upper respiratory viruses. Persistent high fever or severe pain without cough can sometimes warrant a throat swab from a clinic.',
    selfCareGuidance: [
      'Sip warm herbal tea, warm water with lemon, or clear broth to soothe the throat.',
      'Gargle gently with warm salt water (about 1/2 teaspoon salt in a glass of warm water).',
      'Use a clean humidifier or breathe gentle steam if indoor air is dry.',
    ],
    whenToSeekCare: [
      'Difficulty breathing, drooling, or severe trouble swallowing fluids.',
      'Fever above 38.5°C (101.3°F) or symptoms lasting longer than 5–7 days without improvement.',
      'Noticeable swelling on one side of the throat or muffled voice.',
    ],
  },
  {
    id: 'cough',
    name: 'Cough',
    category: 'Respiratory',
    followUpQuestions: [
      'Is the cough dry and tickly, or producing mucus?',
      'Does it interrupt your sleep or cause wheezing or shortness of breath?',
    ],
    generalInfo:
      'A cough helps clear airways of mucus, irritants, or post-nasal drip. Acute coughs often accompany mild viral colds and gradually settle over 1 to 3 weeks, whereas persistent or laboured coughing warrants clinical review.',
    selfCareGuidance: [
      'Keep fluids steady throughout the day to help thin airway secretions.',
      'Elevate your head slightly with an extra pillow while resting if post-nasal drip triggers coughing.',
      'Avoid smoke, strong chemical fumes, and dusty environments.',
    ],
    whenToSeekCare: [
      'Shortness of breath, wheezing, chest pain, or coughing up blood or pink-tinged mucus.',
      'Cough accompanied by high fever or lasting longer than 3 weeks.',
      'Bluish lips or noticeable effort required to breathe at rest.',
    ],
  },
  {
    id: 'fatigue',
    name: 'Fatigue or Low Energy',
    category: 'General & Systemic',
    followUpQuestions: [
      'How many hours of sleep have you averaged over the past few nights?',
      'Is the fatigue new alongside other symptoms, or has it lasted several weeks?',
    ],
    generalInfo:
      'Temporary fatigue commonly reflects insufficient sleep, dehydration, high stress, or recovery from a mild illness. Ongoing unexplained tiredness can involve nutritional, metabolic, or sleep-related factors best evaluated by a clinician.',
    selfCareGuidance: [
      'Prioritize consistent sleep and wake times for 7–9 hours of rest.',
      'Check daily hydration and include balanced meals with protein, complex carbohydrates, and iron-rich foods.',
      'Take brief daylight breaks and gentle walks rather than relying heavily on late-day caffeine.',
    ],
    whenToSeekCare: [
      'Unexplained fatigue lasting more than 2 weeks despite adequate rest.',
      'Fatigue accompanied by dizziness, fainting, shortness of breath, or unintentional weight change.',
      'Persistent low mood or inability to perform everyday tasks.',
    ],
  },
  {
    id: 'nausea',
    name: 'Nausea or Upset Stomach',
    category: 'Digestive',
    followUpQuestions: [
      'Are you able to sip small amounts of water without vomiting?',
      'Do you have severe localized abdominal pain or fever?',
    ],
    generalInfo:
      'Mild nausea or stomach discomfort can follow rich meals, mild stomach viruses, motion, or stress. Maintaining small, frequent sips of fluid helps prevent dehydration while the stomach settles.',
    selfCareGuidance: [
      'Take small, slow sips of water, clear broth, or an oral rehydration drink.',
      'Choose bland, easy-to-digest foods such as plain toast, rice, crackers, or bananas once ready.',
      'Avoid greasy, spicy, acidic, or heavily caffeinated items until settled.',
    ],
    whenToSeekCare: [
      'Inability to keep fluids down for 24 hours, dark urine, or dizziness when standing.',
      'Severe or sharp abdominal pain (especially in the lower right abdomen), high fever, or blood in vomit/stool.',
      'Symptoms lasting longer than 2–3 days without gradual relief.',
    ],
  },
  {
    id: 'muscle-ache',
    name: 'Muscle or Joint Ache',
    category: 'Musculoskeletal',
    followUpQuestions: [
      'Did the soreness start after physical exertion or an injury, or appear alongside chills?',
      'Is there noticeable swelling, warmth, or limited movement in a specific joint?',
    ],
    generalInfo:
      'Localized soreness often follows unaccustomed exercise, posture strain, or minor sprains, while widespread body aches frequently accompany viral illnesses and fatigue.',
    selfCareGuidance: [
      'Rest the affected area and avoid movements that provoke sharp pain.',
      'Use a cool pack during the first 24–48 hours for minor strain swelling, or gentle warmth for stiff muscles.',
      'Stay hydrated and perform only gentle, pain-free range-of-motion movement.',
    ],
    whenToSeekCare: [
      'Inability to bear weight, visible joint deformity, or sudden severe swelling.',
      'Redness, heat, or fever alongside a single painful joint.',
      'Muscle weakness, numbness, or pain that does not ease after several days of rest.',
    ],
  },
  {
    id: 'nasal-congestion',
    name: 'Nasal Congestion or Runny Nose',
    category: 'Respiratory',
    followUpQuestions: [
      'Are your symptoms accompanied by itchy eyes/sneezing or facial pressure?',
      'Have symptoms lasted longer than 10 days or worsened after initially improving?',
    ],
    generalInfo:
      'Stuffy or runny nasal passages commonly occur with viral upper respiratory infections, seasonal allergies, or dry indoor air.',
    selfCareGuidance: [
      'Try sterile saline nasal sprays or rinses to gently clear nasal passages.',
      'Breathe warm shower steam and drink warm liquids to keep mucus thin.',
      'Rest with your head slightly elevated if congestion disrupts sleep.',
    ],
    whenToSeekCare: [
      'Severe facial pain, swelling around the eyes, or high fever.',
      'Symptoms lasting longer than 10 days without improvement or worsening suddenly after day 5.',
      'Difficulty breathing or wheezing.',
    ],
  },
  {
    id: 'dizziness',
    name: 'Dizziness or Lightheadedness',
    category: 'Neurological',
    followUpQuestions: [
      'Does it happen mostly when standing up quickly, or even while lying still?',
      'Have you had enough water and food today?',
    ],
    generalInfo:
      'Brief lightheadedness can stem from dehydration, standing up rapidly, low blood sugar, or fatigue. True spinning vertigo, fainting, or neurological symptoms should always be assessed promptly.',
    selfCareGuidance: [
      'Sit or lie down right away in a safe spot until the sensation passes.',
      'Slowly hydrate with water and stand up gradually from seated or lying positions.',
      'Avoid driving or operating machinery while feeling dizzy.',
    ],
    whenToSeekCare: [
      'Dizziness paired with chest pain, shortness of breath, slurred speech, facial droop, or limb weakness.',
      'Fainting, severe headache, irregular heartbeat, or sudden hearing loss.',
      'Repeated episodes over multiple days.',
    ],
  },
  {
    id: 'skin-irritation',
    name: 'Mild Skin Rash or Irritation',
    category: 'Skin',
    followUpQuestions: [
      'Did the rash appear after contact with a new soap, plant, food, or medication?',
      'Is it spreading rapidly, blistering, or accompanied by fever or facial swelling?',
    ],
    generalInfo:
      'Localized skin redness or itching often comes from dry skin, mild contact irritation, heat, or minor allergic reactions. Rapidly spreading rashes or swelling require prompt medical attention.',
    selfCareGuidance: [
      'Gently cleanse with lukewarm water and fragrance-free mild cleanser.',
      'Avoid scratching and wear loose, breathable cotton clothing.',
      'Keep a note of any new products, foods, or exposures from the past 48 hours.',
    ],
    whenToSeekCare: [
      'Swelling of the lips, tongue, or throat, or trouble breathing (seek emergency care immediately).',
      'Rash accompanied by fever, blistering, open sores, or rapid spread.',
      'Signs of skin infection such as increasing warmth, pus, or spreading redness.',
    ],
  },
  {
    id: 'shortness-of-breath',
    name: 'Shortness of Breath',
    category: 'Respiratory',
    isRedFlag: true,
    followUpQuestions: [
      'Is breathing difficult even while sitting quietly at rest?',
      'Did this start suddenly or alongside chest tightness, wheezing, or dizziness?',
    ],
    generalInfo:
      'Unexpected or worsening shortness of breath—especially at rest—is a symptom that warrants prompt clinical evaluation rather than home monitoring alone.',
    selfCareGuidance: [
      'Stop physical exertion immediately and sit upright in a calm, supported position.',
      'If you have a prescribed rescue inhaler or asthma action plan from your doctor, follow your medical plan.',
      'Do not wait if breathing becomes harder or feels laboured.',
    ],
    whenToSeekCare: [
      'Seek urgent or emergency medical care immediately for sudden or severe difficulty breathing.',
      'Call emergency services if accompanied by chest pain, fainting, confusion, or bluish lips/nails.',
    ],
  },
  {
    id: 'chest-discomfort',
    name: 'Chest Pain or Discomfort',
    category: 'General & Systemic',
    isRedFlag: true,
    followUpQuestions: [
      'Does it feel like pressure, squeezing, fullness, or pain radiating to your arm, jaw, or back?',
      'Are you also experiencing sweating, nausea, or shortness of breath?',
    ],
    generalInfo:
      'Chest discomfort can stem from several causes, including urgent cardiovascular or respiratory conditions. Because serious causes cannot be ruled out online, chest pain requires prompt professional evaluation.',
    selfCareGuidance: [
      'Stop activity and sit or rest quietly while arranging medical evaluation.',
      'Do not drive yourself to urgent care if chest pressure is ongoing or worsening.',
    ],
    whenToSeekCare: [
      'Call emergency medical services immediately if you experience chest pressure, squeezing, shortness of breath, cold sweats, or pain radiating to the neck, jaw, shoulder, or arm.',
      'Consult a healthcare professional promptly for any new or unexplained chest discomfort.',
    ],
  },
];

export const HEALTH_TIPS_ARTICLES: HealthTipArticle[] = [
  {
    id: 'balanced-plate',
    category: 'Healthy Eating',
    title: 'Building Balanced Everyday Meals',
    summary:
      'Use simple plate proportions—vegetables, whole grains, quality protein, and healthy fats—to support steady daily energy.',
    readTime: '3 min read',
    imageUrl: '/src/assets/images/wellness_nutrition_bowl_1795245291074.jpg',
    imageAlt: 'Bowl of leafy greens, whole grains, avocado, and citrus on a white stone counter',
    keyPractices: [
      'Fill roughly half your plate with colorful non-starchy vegetables and leafy greens.',
      'Choose whole grains (oats, brown rice, quinoa, whole wheat) over refined starches for sustained fiber.',
      'Include lean or plant-based proteins such as beans, lentils, fish, poultry, eggs, or tofu.',
      'Limit heavily processed snacks and added sugars while keeping regular meal intervals.',
    ],
    guidanceDetails:
      'Consistent, minimally processed meals help stabilize blood sugar and prevent mid-afternoon energy crashes. Rather than restrictive dieting, focus on adding nutrient-dense whole foods—fiber, potassium, and unsaturated fats from olive oil, nuts, or avocado—to meals you already enjoy.',
  },
  {
    id: 'steady-hydration',
    category: 'Hydration',
    title: 'Steady Hydration Throughout the Day',
    summary:
      'Spacing water intake across waking hours supports circulation, digestion, temperature balance, and cognitive focus.',
    readTime: '2 min read',
    imageUrl: '/src/assets/images/wellness_hydration_glass_1795245292237.jpg',
    imageAlt: 'Clear glass carafe and tumbler of water with fresh mint on white marble',
    keyPractices: [
      'Keep a reusable glass or bottle nearby and sip steadily rather than catching up all at once at night.',
      'Use pale-straw urine color as a practical everyday hydration check.',
      'Increase fluid intake during warm weather, exercise, or mild fever recovery.',
      'Pair morning routines (waking up, meals, walks) with a 250 ml glass of plain water.',
    ],
    guidanceDetails:
      'Individual fluid needs vary based on climate, body size, and activity level. A common baseline reference for adults is around 2,000 ml (8 cups) of fluids daily from water and water-rich foods such as soups, cucumbers, oranges, and leafy greens. People with kidney or heart conditions should follow fluid targets set by their clinician.',
  },
  {
    id: 'daily-movement',
    category: 'Exercise',
    title: 'Sustainable Weekly Movement & Strength',
    summary:
      'Combine moderate aerobic activity with brief posture breaks and twice-weekly strength sessions for cardiovascular and joint health.',
    readTime: '3 min read',
    imageUrl: '/src/assets/images/wellness_movement_rest_1795245291683.jpg',
    imageAlt: 'Sunlit wellness space with indoor botanicals, wooden floors, and calm open space',
    keyPractices: [
      'Aim toward 150 minutes per week of moderate aerobic movement such as brisk walking, cycling, or swimming.',
      'Add two short resistance or bodyweight sessions each week to maintain muscle and bone strength.',
      'Break up prolonged desk sitting every 45–60 minutes with 3 minutes of standing or light stretching.',
      'Start gradually if returning after time off and stop if you feel sharp joint pain or dizziness.',
    ],
    guidanceDetails:
      'Regular movement does not require intense workouts to benefit health. Even three 10-minute brisk walks across the day contribute toward cardiovascular fitness, mood regulation, and better nighttime sleep quality.',
  },
  {
    id: 'restorative-sleep',
    category: 'Sleep',
    title: 'Consistent Sleep Hygiene Habits',
    summary:
      'Protecting a regular 7–9 hour sleep window and a quiet wind-down routine improves alertness, immune resilience, and recovery.',
    readTime: '3 min read',
    keyPractices: [
      'Keep wake-up and bedtime consistent within 30–45 minutes, including on weekends.',
      'Dim bright screens and overhead lighting 45–60 minutes before sleep.',
      'Keep caffeine earlier in the day (ideally at least 8 hours before bedtime) and keep the bedroom cool and dark.',
      'If unable to sleep after 20–30 minutes, step out briefly for a calm, low-light activity like reading.',
    ],
    guidanceDetails:
      'Most adults function best with 7 to 9 hours of quality sleep per night. Tracking both duration and how rested you feel in the morning helps identify patterns—such as late meals, screen glare, or irregular schedules—that may disrupt deep rest.',
  },
  {
    id: 'preventive-wellness',
    category: 'Personal Wellness',
    title: 'Stress Recovery & Preventive Checkups',
    summary:
      'Pair simple daily breathing resets and ergonomic habits with scheduled preventive visits with a healthcare provider.',
    readTime: '3 min read',
    keyPractices: [
      'Practice 3–5 minutes of slow paced breathing (inhale 4 seconds, exhale 6 seconds) during high-stress periods.',
      'Position screens near eye level to reduce neck and shoulder tension during work or study.',
      'Keep a personal log of recurring symptoms, blood pressure readings, or medications before clinic visits.',
      'Stay up to date with routine annual checkups, dental visits, and recommended vaccinations.',
    ],
    guidanceDetails:
      'Personal health monitoring works best as a complement to—never a replacement for—regular primary care. Bringing clear notes on your sleep, activity, or symptom timeline helps healthcare professionals give more accurate, personalized advice.',
  },
];
