/**
 * Exam content — sections and questions.
 *
 * NOTE: This file is a temporary static source of truth. A Supabase-backed
 * data layer will replace the imports from this module; keep the exported
 * shapes (`Section`, `Question`) stable so components only need the data
 * source swapped.
 */

export type Section = {
  code: string;
  name: string;
  color: string;
  count: number;
};

export type Option = {
  t: string;
  c: boolean;
  r: string;
};

export type Question = {
  section: string;
  q: string;
  hint: string;
  passage?: string;
  options: Option[];
};

export const SECTIONS: Section[] = [
  { code: "A", name: "Pure Sciences", color: "#10B981", count: 8 },
  { code: "B", name: "Mathematics", color: "#F59E0B", count: 8 },
  { code: "C", name: "Language", color: "#2563EB", count: 8 },
  { code: "D", name: "Institutional (OOU)", color: "#A855F7", count: 8 },
  { code: "E", name: "Current Affairs", color: "#EF4444", count: 9 },
  { code: "F", name: "Technical Background", color: "#06B6D4", count: 9 },
];

export const QUESTIONS: Question[] = [
  // ---------------- SECTION A: PURE SCIENCES (1-8) ----------------
  {
    section: "A",
    q: "Which of the following particles has a negative electrical charge?",
    hint: "Think about the three main subatomic particles.",
    options: [
      { t: "Electron", c: true, r: "An electron carries a negative charge." },
      { t: "Proton", c: false, r: "A proton carries a positive charge." },
      { t: "Neutron", c: false, r: "A neutron has no net electrical charge." },
      {
        t: "Nucleus",
        c: false,
        r: "The nucleus is positively charged overall because it contains protons.",
      },
    ],
  },
  {
    section: "A",
    q: "What is the pH of a neutral solution at approximately 25°C?",
    hint: "The pH scale commonly runs from 0 to 14.",
    options: [
      { t: "0", c: false, r: "A pH of 0 represents a very strongly acidic solution." },
      { t: "7", c: true, r: "A neutral solution has a pH of approximately 7 at 25°C." },
      { t: "10", c: false, r: "A pH of 10 indicates an alkaline solution." },
      { t: "14", c: false, r: "A pH of 14 represents a very strongly alkaline solution." },
    ],
  },
  {
    section: "A",
    q: "Which organelle is primarily responsible for producing ATP in eukaryotic cells?",
    hint: 'It is often called the "powerhouse" of the cell.',
    options: [
      { t: "Ribosome", c: false, r: "Ribosomes are mainly responsible for protein synthesis." },
      {
        t: "Mitochondrion",
        c: true,
        r: "Mitochondria generate most cellular ATP through cellular respiration.",
      },
      { t: "Nucleus", c: false, r: "The nucleus stores genetic material and controls gene expression." },
      {
        t: "Golgi apparatus",
        c: false,
        r: "The Golgi apparatus modifies, sorts, and packages proteins and lipids.",
      },
    ],
  },
  {
    section: "A",
    q: "Which process allows green plants to manufacture glucose using light energy?",
    hint: "The process requires chlorophyll and sunlight.",
    options: [
      {
        t: "Respiration",
        c: false,
        r: "Respiration releases energy from food rather than producing glucose from carbon dioxide.",
      },
      {
        t: "Photosynthesis",
        c: true,
        r: "Photosynthesis uses light energy to convert carbon dioxide and water into glucose and oxygen.",
      },
      { t: "Transpiration", c: false, r: "Transpiration is the loss of water vapour from plant surfaces." },
      { t: "Diffusion", c: false, r: "Diffusion is the movement of particles from higher to lower concentration." },
    ],
  },
  {
    section: "A",
    q: "A car accelerates from rest at 2 m/s² for 5 seconds. What is its final velocity?",
    hint: "Use v = u + at.",
    options: [
      { t: "5 m/s", c: false, r: "This would correspond to an acceleration of only 1 m/s² over 5 seconds." },
      { t: "10 m/s", c: true, r: "Using v = u + at, v = 0 + (2)(5) = 10 m/s." },
      { t: "12 m/s", c: false, r: "This does not follow from the given acceleration and time." },
      { t: "15 m/s", c: false, r: "This would require a greater acceleration or longer time." },
    ],
  },
  {
    section: "A",
    q: "Which law states that the pressure of a fixed mass of gas is inversely proportional to its volume at constant temperature?",
    hint: "Think about the relationship between gas pressure and volume.",
    options: [
      { t: "Boyle's law", c: true, r: "Boyle's law states that P×V remains constant at constant temperature." },
      { t: "Charles's law", c: false, r: "Charles's law relates volume and absolute temperature at constant pressure." },
      { t: "Ohm's law", c: false, r: "Ohm's law relates voltage, current, and resistance." },
      { t: "Newton's law", c: false, r: "Newton's laws describe motion and forces." },
    ],
  },
  {
    section: "A",
    q: "Which type of blood vessel carries blood away from the heart?",
    hint: "Remember the direction rather than whether the blood is oxygenated.",
    options: [
      { t: "Artery", c: true, r: "Arteries carry blood away from the heart." },
      { t: "Vein", c: false, r: "Veins generally carry blood toward the heart." },
      { t: "Capillary", c: false, r: "Capillaries are tiny vessels where exchange of substances occurs." },
      { t: "Venule", c: false, r: "Venules collect blood from capillaries and lead toward veins." },
    ],
  },
  {
    section: "A",
    q: "What is the SI unit of electrical resistance?",
    hint: "Ohm's law is V = IR.",
    options: [
      { t: "Volt", c: false, r: "The volt measures potential difference." },
      { t: "Ampere", c: false, r: "The ampere measures electric current." },
      { t: "Ohm", c: true, r: "The ohm (Ω) is the SI unit of electrical resistance." },
      { t: "Watt", c: false, r: "The watt measures power." },
    ],
  },

  // ---------------- SECTION B: MATHEMATICS (9-16) ----------------
  {
    section: "B",
    q: "Solve for x: 3x + 7 = 22.",
    hint: "Subtract 7 first.",
    options: [
      { t: "3", c: false, r: "3(3) + 7 = 16, not 22." },
      { t: "5", c: true, r: "3x = 15, so x = 5." },
      { t: "7", c: false, r: "3(7) + 7 = 28." },
      { t: "9", c: false, r: "3(9) + 7 = 34." },
    ],
  },
  {
    section: "B",
    q: "If x² − 9 = 0, what are the possible values of x?",
    hint: "Take the square root of both sides, remembering ±.",
    options: [
      { t: "3 only", c: false, r: "x = −3 also satisfies the equation." },
      { t: "3 and −3", c: true, r: "x² = 9, so x = ±3." },
      { t: "9 and −9", c: false, r: "Squaring 9 gives 81, not 9." },
      { t: "0 and 9", c: false, r: "Neither value gives the required pair of roots." },
    ],
  },
  {
    section: "B",
    q: "What is d/dx (x³)?",
    hint: "Use the power rule.",
    options: [
      { t: "x²", c: false, r: "The coefficient 3 is missing." },
      { t: "3x²", c: true, r: "By the power rule, d/dx(xⁿ) = n·xⁿ⁻¹." },
      { t: "3x", c: false, r: "The exponent should decrease from 3 to 2." },
      { t: "x⁴/4", c: false, r: "This is an antiderivative of x³, not its derivative." },
    ],
  },
  {
    section: "B",
    q: "Evaluate ∫ 2x dx.",
    hint: "Integration reverses differentiation.",
    options: [
      { t: "x² + C", c: true, r: "The derivative of x² is 2x." },
      { t: "2x² + C", c: false, r: "Its derivative is 4x." },
      { t: "x + C", c: false, r: "Its derivative is 1." },
      { t: "2 + C", c: false, r: "This has derivative 0." },
    ],
  },
  {
    section: "B",
    q: "The mean of 4, 6, 8 and 12 is:",
    hint: "Add all values and divide by the number of values.",
    options: [
      { t: "6", c: false, r: "The sum divided by four is greater than 6." },
      { t: "7.5", c: true, r: "(4+6+8+12)/4 = 30/4 = 7.5." },
      { t: "8", c: false, r: "8 is the median, not the mean." },
      { t: "10", c: false, r: "The total is only 30, so the mean cannot be 10." },
    ],
  },
  {
    section: "B",
    q: "What is the probability of obtaining a head when a fair coin is tossed once?",
    hint: "Count the favourable outcomes and total outcomes.",
    options: [
      { t: "0", c: false, r: "A head is a possible outcome." },
      { t: "1/2", c: true, r: "A fair coin has two equally likely outcomes." },
      { t: "1/3", c: false, r: "There are not three equally likely outcomes." },
      { t: "1", c: false, r: "A head is not guaranteed." },
    ],
  },
  {
    section: "B",
    q: "If y = 2x + 1, what is y when x = 4?",
    hint: "Substitute 4 for x.",
    options: [
      { t: "7", c: false, r: "2(4) + 1 = 9, not 7." },
      { t: "8", c: false, r: "The constant 1 has not been properly added." },
      { t: "9", c: true, r: "y = 2(4) + 1 = 9." },
      { t: "10", c: false, r: "The expression evaluates to 9." },
    ],
  },
  {
    section: "B",
    q: "What is the median of the data set 2, 5, 7, 9, 12?",
    hint: "The median is the middle observation when the data are ordered.",
    options: [
      { t: "5", c: false, r: "5 is the second value, not the middle value." },
      { t: "7", c: true, r: "7 is the third and middle value in the ordered five-number set." },
      { t: "9", c: false, r: "9 is the fourth value." },
      { t: "12", c: false, r: "12 is the largest value." },
    ],
  },

  // ---------------- SECTION C: LANGUAGE (17-24) ----------------
  {
    section: "C",
    q: "Choose the grammatically correct sentence.",
    hint: "Check subject-verb agreement.",
    options: [
      { t: "She don't like mathematics.", c: false, r: '"She" requires "doesn\'t," not "don\'t."' },
      { t: "She doesn't like mathematics.", c: true, r: 'The singular subject "she" correctly takes "doesn\'t."' },
      {
        t: "She doesn't likes mathematics.",
        c: false,
        r: 'After "doesn\'t," the main verb should be in its base form.',
      },
      { t: "She not like mathematics.", c: false, r: "The sentence lacks the required auxiliary verb." },
    ],
  },
  {
    section: "C",
    q: 'Choose the word closest in meaning to "abundant."',
    hint: "Think of having more than enough.",
    options: [
      { t: "Plentiful", c: true, r: '"Abundant" means existing in large quantities.' },
      { t: "Scarce", c: false, r: '"Scarce" means insufficient or difficult to find.' },
      { t: "Rare", c: false, r: '"Rare" suggests something is uncommon.' },
      { t: "Limited", c: false, r: '"Limited" means restricted in amount.' },
    ],
  },
  {
    section: "C",
    q: 'Choose the word opposite in meaning to "expand."',
    hint: "What happens when something becomes smaller?",
    options: [
      { t: "Increase", c: false, r: "Increase is similar in meaning to expand." },
      { t: "Enlarge", c: false, r: "Enlarge is a synonym of expand." },
      { t: "Contract", c: true, r: "Contract means to become smaller or reduce in size." },
      { t: "Extend", c: false, r: "Extend can mean to increase or expand." },
    ],
  },
  {
    section: "C",
    q: 'Complete the sentence: "If I ___ enough money, I would buy a new laptop."',
    hint: "This is a hypothetical situation.",
    options: [
      { t: "have", c: false, r: 'Standard second conditional construction uses "had."' },
      { t: "had", c: true, r: '"If I had..., I would..." is the standard second conditional structure.' },
      { t: "will have", c: false, r: "This does not fit the second conditional construction." },
      { t: "having", c: false, r: '"Having" cannot function correctly in this conditional structure.' },
    ],
  },
  {
    section: "C",
    q: 'What does the expression "break the ice" mean?',
    hint: "Think about what someone might do when meeting strangers.",
    options: [
      { t: "Destroy something frozen", c: false, r: "This is the literal interpretation, not the idiomatic meaning." },
      {
        t: "Start a friendly conversation",
        c: true,
        r: "The idiom refers to making people feel more comfortable in a social situation.",
      },
      { t: "End a friendship", c: false, r: "The expression does not mean ending a relationship." },
      { t: "Cause an argument", c: false, r: "It generally describes reducing social awkwardness, not creating conflict." },
    ],
  },
  {
    section: "C",
    q: "Choose the correctly punctuated sentence.",
    hint: "Look at the introductory phrase.",
    options: [
      {
        t: "After the exam, we went home.",
        c: true,
        r: "A comma appropriately separates the introductory phrase from the main clause.",
      },
      { t: "After the exam we, went home.", c: false, r: "The comma incorrectly separates the subject from the verb." },
      { t: "After, the exam we went home.", c: false, r: "The comma is incorrectly placed inside the introductory phrase." },
      { t: "After the exam we went, home.", c: false, r: "The comma incorrectly separates the verb from its complement." },
    ],
  },
  {
    section: "C",
    q: 'Passage: "Ade arrived at the library early because he wanted to complete his research before the afternoon lecture. He found several useful books and took notes from each one." — Why did Ade arrive early?',
    passage:
      "Ade arrived at the library early because he wanted to complete his research before the afternoon lecture. He found several useful books and took notes from each one.",
    hint: "Look for the sentence explaining his purpose.",
    options: [
      {
        t: "To complete his research before the lecture",
        c: true,
        r: "The passage explicitly states that this was his reason for arriving early.",
      },
      { t: "To attend a sports event", c: false, r: "No sports event is mentioned." },
      { t: "To meet his lecturer", c: false, r: "The passage does not say he came to meet the lecturer." },
      { t: "To borrow a laptop", c: false, r: "The passage says he found books and took notes." },
    ],
  },
  {
    section: "C",
    q: "In the same passage, what did Ade do after finding useful books?",
    passage:
      "Ade arrived at the library early because he wanted to complete his research before the afternoon lecture. He found several useful books and took notes from each one.",
    hint: "Pay attention to the second sentence.",
    options: [
      { t: "He returned home immediately.", c: false, r: "The passage says he took notes from the books." },
      { t: "He took notes from them.", c: true, r: "This is directly stated in the passage." },
      { t: "He sold the books.", c: false, r: "Nothing indicates that he sold them." },
      {
        t: "He attended the afternoon lecture immediately.",
        c: false,
        r: "The lecture was the deadline for his research, not the action described after finding the books.",
      },
    ],
  },

  // ---------------- SECTION D: INSTITUTIONAL — OOU (25-32) ----------------
  {
    section: "D",
    q: "What was Olabisi Onabanjo University originally called when it was founded?",
    hint: "The university's present name came later.",
    options: [
      { t: "Ogun State University", c: true, r: "OOU was founded as Ogun State University in 1982." },
      { t: "Ogun State Polytechnic", c: false, r: "This was not the university's original name." },
      { t: "Ogun Federal University", c: false, r: "The institution was established by the Ogun State Government." },
      { t: "Olabisi State University", c: false, r: "This was not its original name." },
    ],
  },
  {
    section: "D",
    q: "In which year was Ogun State University renamed Olabisi Onabanjo University?",
    hint: "It happened about 19 years after the university was founded.",
    options: [
      { t: "1982", c: false, r: "1982 was the year the university was founded." },
      { t: "1991", c: false, r: "This was not the renaming year." },
      {
        t: "2001",
        c: true,
        r: "The institution was renamed Olabisi Onabanjo University on May 29, 2001.",
      },
      { t: "2010", c: false, r: "The renaming had occurred years earlier." },
    ],
  },
  {
    section: "D",
    q: "Where is OOU's Main Campus, commonly known as the Permanent Site, located?",
    hint: "It is the university's principal campus.",
    options: [
      { t: "Ago-Iwoye", c: true, r: "OOU's Main/Permanent Site is in Ago-Iwoye, Ogun State." },
      { t: "Sagamu", c: false, r: "Sagamu hosts the Obafemi Awolowo College of Health Sciences." },
      { t: "Ibogun", c: false, r: "Ibogun is associated with engineering and environmental studies." },
      { t: "Ayetoro", c: false, r: "Ayetoro is associated with agricultural sciences." },
    ],
  },
  {
    section: "D",
    q: "Which OOU campus is associated with the College of Engineering and Environmental Studies?",
    hint: "Think of the campus dedicated to technological and applied sciences.",
    options: [
      { t: "Sagamu", c: false, r: "Sagamu is primarily associated with health sciences." },
      {
        t: "Ibogun",
        c: true,
        r: "OOU identifies Ibogun as the home of the College of Engineering and Environmental Studies.",
      },
      { t: "Ayetoro", c: false, r: "Ayetoro is associated with the College of Agricultural Sciences." },
      { t: "Mini Campus", c: false, r: "The Mini Campus is associated with continuing education." },
    ],
  },
  {
    section: "D",
    q: "Which OOU campus is home to the Obafemi Awolowo College of Health Sciences?",
    hint: "Think of OOU's medical campus.",
    options: [
      { t: "Ibogun", c: false, r: "Ibogun hosts engineering and environmental studies." },
      {
        t: "Sagamu",
        c: true,
        r: "The Sagamu Campus hosts the Obafemi Awolowo College of Health Sciences.",
      },
      { t: "Ayetoro", c: false, r: "Ayetoro focuses on agricultural sciences." },
      { t: "Mini Campus", c: false, r: "The Mini Campus focuses on continuing education and related programmes." },
    ],
  },
  {
    section: "D",
    q: "Which college is principally associated with OOU's Ayetoro Campus?",
    hint: "Ayetoro is situated in an important agricultural area of Ogun State.",
    options: [
      {
        t: "College of Engineering and Environmental Studies",
        c: false,
        r: "That college is associated with Ibogun.",
      },
      {
        t: "College of Agricultural Sciences",
        c: true,
        r: "Ayetoro is home to the College of Agricultural Sciences.",
      },
      { t: "Obafemi Awolowo College of Health Sciences", c: false, r: "This is located at Sagamu." },
      { t: "College of Law", c: false, r: "Law is not the defining college of the Ayetoro Campus." },
    ],
  },
  {
    section: "D",
    q: "According to OOU's official 2026 announcement, how many First Class graduates were listed for the 35th Convocation?",
    hint: "The figure was reported in OOU's January 2026 convocation announcement.",
    options: [
      { t: "114", c: false, r: "114 was the First Class figure reported for the 34th Convocation in 2025." },
      { t: "147", c: true, r: "OOU announced 147 First Class graduands for its 35th Convocation." },
      { t: "200", c: false, r: "This was not the reported number." },
      { t: "86", c: false, r: "86 was not the First Class figure." },
    ],
  },
  {
    section: "D",
    q: "What recent OOU development was announced in May 2026 to support graduate employability?",
    hint: "Think about skills and employability.",
    options: [
      { t: "50 compulsory postgraduate programmes", c: false, r: "This was not the announcement." },
      {
        t: "50 free short courses",
        c: true,
        r: "OOU announced the introduction of 50 free short courses aimed at boosting graduate employability.",
      },
      { t: "50 new undergraduate faculties", c: false, r: "OOU did not announce 50 new faculties." },
      { t: "50 new campuses", c: false, r: "The announcement concerned short courses, not campuses." },
    ],
  },

  // ---------------- SECTION E: CURRENT AFFAIRS (33-41) ----------------
  {
    section: "E",
    q: "Who is the current President of Nigeria as of August 2026?",
    hint: "He was inaugurated on May 29, 2023.",
    options: [
      { t: "Bola Ahmed Tinubu", c: true, r: "Bola Ahmed Tinubu is Nigeria's President." },
      { t: "Kashim Shettima", c: false, r: "Kashim Shettima is the Vice President." },
      { t: "Atiku Abubakar", c: false, r: "He was a presidential candidate in the 2023 election, not the current president." },
      { t: "Peter Obi", c: false, r: "He was also a 2023 presidential candidate, not the current president." },
    ],
  },
  {
    section: "E",
    q: "In August 2026, President Tinubu approved a substantial salary increase for which group?",
    hint: "The policy was linked to troop welfare and security challenges.",
    options: [
      { t: "Teachers", c: false, r: "The specific announcement concerned the armed forces." },
      {
        t: "Nigerian Armed Forces",
        c: true,
        r: "Tinubu approved military salary increases of up to 80%, effective September 1, 2026.",
      },
      { t: "University lecturers only", c: false, r: "The announcement was not specifically for university lecturers." },
      { t: "Civil servants in all ministries", c: false, r: "The announcement specifically addressed military personnel." },
    ],
  },
  {
    section: "E",
    q: "What major regulatory area was addressed by a Presidential Executive Order signed in July 2026?",
    hint: "Think cryptocurrency, blockchain and financial regulation.",
    options: [
      { t: "Agricultural exports only", c: false, r: "Agriculture was not the principal subject of this executive order." },
      {
        t: "Virtual assets",
        c: true,
        r: "The 2026 Executive Order on Virtual Assets Coordination was designed to harmonise regulation of virtual assets.",
      },
      { t: "University admissions", c: false, r: "University admissions were not the subject of the order." },
      { t: "Road traffic enforcement", c: false, r: "Road traffic enforcement was not the purpose of the order." },
    ],
  },
  {
    section: "E",
    q: "Who was the former Nigerian president whose death was commemorated with a first-anniversary event in July 2026?",
    hint: "He served as both a military ruler and later a civilian president.",
    options: [
      { t: "Olusegun Obasanjo", c: false, r: "Obasanjo is alive and was not the former president referenced." },
      {
        t: "Muhammadu Buhari",
        c: true,
        r: "July 2026 marked one year since the death of former President Muhammadu Buhari.",
      },
      { t: "Goodluck Jonathan", c: false, r: "Jonathan is not the former president referenced in the event." },
      { t: "Shehu Shagari", c: false, r: "Shagari died decades earlier." },
    ],
  },
  {
    section: "E",
    q: "Which major global conflict in 2026 has significantly affected energy supplies and shipping around the Strait of Hormuz?",
    hint: "The Strait of Hormuz is a critical route for global oil shipments.",
    options: [
      { t: "The Falklands conflict", c: false, r: "The Falklands conflict occurred in 1982." },
      {
        t: "The Iran–United States conflict",
        c: true,
        r: "The ongoing conflict has disrupted oil infrastructure and shipping routes, including the Strait of Hormuz.",
      },
      { t: "The Gulf War of 1991", c: false, r: "That conflict occurred decades earlier." },
      { t: "The Crimean War", c: false, r: "The Crimean War occurred in the 19th century." },
    ],
  },
  {
    section: "E",
    q: "Which country hosted the 2026 FIFA World Cup jointly with Canada and Mexico?",
    hint: "It was a three-country North American hosting arrangement.",
    options: [
      { t: "Brazil", c: false, r: "Brazil did not host the 2026 World Cup." },
      {
        t: "United States",
        c: true,
        r: "The 2026 FIFA World Cup was jointly hosted by the United States, Canada and Mexico.",
      },
      { t: "Argentina", c: false, r: "Argentina was not one of the host countries." },
      { t: "Spain", c: false, r: "Spain was not one of the 2026 host nations." },
    ],
  },
  {
    section: "E",
    q: "Which major global event took place in Paris in 2024?",
    hint: "It was one of the world's largest sporting events.",
    options: [
      { t: "FIFA World Cup", c: false, r: "The 2024 FIFA World Cup did not take place in Paris." },
      { t: "Summer Olympic Games", c: true, r: "Paris hosted the 2024 Summer Olympics." },
      { t: "Commonwealth Games", c: false, r: "Paris did not host the Commonwealth Games." },
      { t: "Winter Olympics", c: false, r: "The Winter Olympics were not held in Paris in 2024." },
    ],
  },
  {
    section: "E",
    q: "Which political event occurred in the United States in November 2024?",
    hint: "Think of the election held every four years.",
    options: [
      { t: "The U.S. Supreme Court presidential election", c: false, r: "The Supreme Court does not conduct presidential elections." },
      {
        t: "The U.S. presidential election",
        c: true,
        r: "Americans voted in the 2024 presidential election in November.",
      },
      { t: "A national parliamentary election", c: false, r: "The United States does not have a parliamentary system." },
      { t: "A constitutional referendum replacing the presidency", c: false, r: "No such referendum replaced the presidential system." },
    ],
  },
  {
    section: "E",
    q: "Which international organisation maintains a major global calendar of international observances, including International Youth Day?",
    hint: "Think of the organisation headquartered in New York that coordinates international cooperation.",
    options: [
      { t: "OPEC", c: false, r: "OPEC is primarily concerned with petroleum-producing countries and oil policy." },
      {
        t: "United Nations",
        c: true,
        r: "The United Nations maintains and promotes numerous international observances, including International Youth Day.",
      },
      { t: "FIFA", c: false, r: "FIFA governs international football rather than international observance days." },
      { t: "INTERPOL", c: false, r: "INTERPOL facilitates international police cooperation." },
    ],
  },

  // ---------------- SECTION F: TECHNICAL BACKGROUND (42-50) ----------------
  {
    section: "F",
    q: "What is the output of an AND gate when both inputs are 1?",
    hint: "AND means all required conditions must be true.",
    options: [
      { t: "0", c: false, r: "An AND gate outputs 1 when all inputs are 1." },
      { t: "1", c: true, r: "With both inputs HIGH/1, the AND gate produces HIGH/1." },
      { t: "Undefined", c: false, r: "The output is clearly defined by Boolean logic." },
      { t: "High impedance", c: false, r: "High impedance is not the normal output condition of an AND gate." },
    ],
  },
  {
    section: "F",
    q: "Which logic gate produces the opposite of its input?",
    hint: "Its name is associated with negation.",
    options: [
      { t: "AND", c: false, r: "AND combines multiple inputs according to conjunction logic." },
      { t: "OR", c: false, r: "OR produces 1 when at least one input is 1." },
      { t: "NOT", c: true, r: "A NOT gate inverts its input: 0 becomes 1 and 1 becomes 0." },
      { t: "XOR", c: false, r: "XOR compares two or more inputs rather than simply inverting one input." },
    ],
  },
  {
    section: "F",
    q: "Which component is generally regarded as the main processing unit of a computer?",
    hint: "CPU stands for Central Processing Unit.",
    options: [
      { t: "CPU", c: true, r: "The Central Processing Unit executes instructions and performs processing operations." },
      { t: "Monitor", c: false, r: "A monitor is an output device." },
      { t: "Keyboard", c: false, r: "A keyboard is an input device." },
      { t: "Power supply", c: false, r: "The power supply provides electrical power but does not execute program instructions." },
    ],
  },
  {
    section: "F",
    q: "Which memory is volatile and normally loses its contents when power is removed?",
    hint: "Think of the memory used for programs currently running.",
    options: [
      { t: "ROM", c: false, r: "ROM is designed to retain information without continuous power." },
      { t: "RAM", c: true, r: "RAM is volatile main memory and normally loses its contents when power is removed." },
      { t: "Flash memory", c: false, r: "Flash memory is non-volatile." },
      { t: "SSD", c: false, r: "An SSD is non-volatile storage." },
    ],
  },
  {
    section: "F",
    q: "Which programming construct is primarily used to repeat a block of instructions?",
    hint: "Examples include for and while.",
    options: [
      { t: "Variable", c: false, r: "A variable stores a value; it does not inherently repeat instructions." },
      {
        t: "Loop",
        c: true,
        r: "Loops execute a block of instructions repeatedly based on a condition or iteration count.",
      },
      { t: "Comment", c: false, r: "Comments provide explanations and are not normally executed." },
      { t: "Constant", c: false, r: "A constant stores a value that is not intended to change." },
    ],
  },
  {
    section: "F",
    q: "Which device forwards data packets between different networks?",
    hint: "It is commonly found between a local network and the Internet.",
    options: [
      { t: "Hub", c: false, r: "A hub broadcasts incoming data to connected ports rather than intelligently routing between networks." },
      { t: "Keyboard", c: false, r: "A keyboard is an input device." },
      { t: "Router", c: true, r: "A router forwards packets between networks using network-layer addressing." },
      { t: "Monitor", c: false, r: "A monitor displays visual output." },
    ],
  },
  {
    section: "F",
    q: "Which addressing system is primarily used to identify devices on an IP network?",
    hint: "IPv4 and IPv6 are examples.",
    options: [
      { t: "HTML", c: false, r: "HTML is a markup language used for structuring web content." },
      {
        t: "IP address",
        c: true,
        r: "An IP address identifies a network interface/device for communication at the Internet Protocol layer.",
      },
      { t: "CPU register", c: false, r: "A CPU register is an internal processor storage location." },
      { t: "ASCII code", c: false, r: "ASCII represents characters rather than identifying network devices." },
    ],
  },
  {
    section: "F",
    q: "In binary, what is the decimal value of 1010₂?",
    hint: "The place values are 8, 4, 2 and 1.",
    options: [
      { t: "8", c: false, r: "1000₂ equals 8." },
      { t: "10", c: true, r: "1010₂ = (1×8)+(0×4)+(1×2)+(0×1) = 10." },
      { t: "12", c: false, r: "12 in binary is 1100₂." },
      { t: "14", c: false, r: "14 in binary is 1110₂." },
    ],
  },
  {
    section: "F",
    q: "Which component temporarily stores data and instructions that the CPU is actively using?",
    hint: "It is volatile memory and works closely with the CPU.",
    options: [
      { t: "Hard disk only", c: false, r: "A hard disk provides long-term storage rather than the CPU's primary working memory." },
      {
        t: "RAM",
        c: true,
        r: "RAM provides fast, temporary storage for data and instructions currently needed by running programs.",
      },
      { t: "Monitor", c: false, r: "A monitor displays information but does not serve as working memory." },
      { t: "Network cable", c: false, r: "A network cable transmits signals between network devices." },
    ],
  },
];
