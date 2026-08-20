const QUESTIONS_PER_LEVEL = 12;
const IDK_LABEL = "I don't know.";
const IDK_EMOJI = "🤷";
const IDK_TEXT = IDK_LABEL + " " + IDK_EMOJI;
const PREFERS_REDUCED_MOTION =
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const QUESTION_SELECTION_DELAY = PREFERS_REDUCED_MOTION ? 0 : 140;
const QUESTION_FADE_DURATION = PREFERS_REDUCED_MOTION ? 0 : 320;

const LEVELS = [
  {
    code: "A0",
    name: "Beginner",
    summary: "You are starting to learn your first words and short phrases.",
    detail: "Keep building confidence with practical everyday English, common actions, and useful question words.",
    writingPrompt: "Write 3 short sentences about yourself.",
    writingPromptHint: "Use simple English about your own life.",
    writingHints: [
      "What is your name?",
      "How old are you?",
      "What do you like?"
    ],
    writingPlaceholder: "Write your sentences here..."
  },
  {
    code: "A1",
    name: "Elementary",
    summary: "You can understand and use basic words and simple everyday sentences.",
    detail: "The next step is practising short conversations, daily routines, and simple grammar patterns.",
    writingPrompt: "Write about who you see and what they are doing.",
    writingPromptHint: "Look carefully at the picture before you start.",
    writingHints: [
      "Who can you see?",
      "What is the person, animal, or group doing?",
      "What can you see in the picture?"
    ],
    writingPlaceholder: "Write 4 simple sentences about the picture..."
  },
  {
    code: "A2",
    name: "Pre-Intermediate",
    summary: "You can communicate about work, home, travel, and familiar topics in a simple way.",
    detail: "Keep working on past and future forms, longer sentences, and reading for meaning.",
    writingPrompt: "Describe the people, the place, and what is happening.",
    writingPromptHint: "Use the picture to describe the full scene.",
    writingHints: [
      "Who can you see in the picture?",
      "Where are they?",
      "What is happening in the scene?"
    ],
    writingPlaceholder: "Write 5 sentences about the scene..."
  },
  {
    code: "B1",
    name: "Intermediate",
    summary: "You can understand and use English on familiar topics with growing confidence.",
    detail: "A good next step is combining ideas clearly, using a wider range of grammar, and writing longer answers.",
    writingPrompt:
      "Look at the two pictures. Write a short story or explanation about what is happening.",
    writingPromptHint:
      "Use both pictures. Describe the situation, the feelings, and why it may be happening.",
    writingHints: [
      "What is happening in each picture?",
      "How do the people feel?",
      "Why do you think this is happening?",
      "What might happen next?"
    ],
    writingPlaceholder: "Write 5 or 6 sentences about the two pictures..."
  },
  {
    code: "B2",
    name: "Upper-Intermediate",
    summary: "You can use English clearly and flexibly in more challenging professional and real-life situations.",
    detail: "Keep sharpening precision, longer reading comprehension, and more advanced sentence structures.",
    writingPrompt:
      "Look at the picture. Write about the idea or issue it shows. If there are two sides, compare them and explain your opinion.",
    writingPromptHint:
      "Interpret the message in the picture and support your opinion with clear reasons.",
    writingHints: [
      "What idea or problem does the picture show?",
      "If there are two sides, how are they different?",
      "What is your opinion?",
      "Why do you think that?"
    ],
    writingPlaceholder: "Write 6 to 8 sentences explaining your opinion..."
  }
];

const WRITING_IMAGE_POOLS = {
  A1: [
    {
      promptId: "adult-market",
      writingImageSrc: "./assets/adult-writing-market.png",
      writingImageAlt: "An adult shopper choosing vegetables at an outdoor market."
    },
    {
      promptId: "dog-running",
      writingImageSrc: "./assets/a1-writing-dog-running.jpeg",
      writingImageAlt: "A dog running on grass."
    },
    {
      promptId: "kitten-chair",
      writingImageSrc: "./assets/a1-writing-kitten-chair.jpeg",
      writingImageAlt: "A kitten sitting on a wooden chair."
    }
  ],
  A2: [
    {
      promptId: "adult-market",
      writingImageSrc: "./assets/adult-writing-market.png",
      writingImageAlt: "An adult shopper choosing vegetables at a busy outdoor market."
    },
    {
      promptId: "bus-stop",
      writingImageSrc: "./assets/a2-writing-bus-stop.jpeg",
      writingImageAlt: "Adults waiting at a bus stop while a bus arrives."
    }
  ],
  B1: [
    {
      promptId: "station-help",
      writingImageSrc: "./assets/adult-writing-station-help.png",
      writingImageAlt: "Two adult commuters meet after one helps the other pick up dropped papers at a station."
    }
  ],
  B2: [
    {
      promptId: "workstyles",
      writingImageSrc: "./assets/adult-writing-workstyles.png",
      writingImageAlt: "Adults collaborating in an office compared with an adult working independently at home."
    },
    {
      promptId: "city-countryside",
      writingImageSrc: "./assets/b2-writing-city-countryside.jpeg",
      writingImageAlt: "A busy city street compared with a quiet countryside road."
    },
    {
      promptId: "clean-polluted-river",
      writingImageSrc: "./assets/b2-writing-clean-polluted-river.jpeg",
      writingImageAlt: "A clean river in nature compared with a polluted river near factories."
    }
  ]
};

const A0_LOOK_AND_ANSWER_PROMPTS = [
  {
    id: "q1-apple",
    label: "Q1",
    prompt: "What is this?",
    imageSrc: "./assets/a0-look-answer-apple.jpeg",
    imageAlt: "A red apple.",
    placeholder: "One word or a short sentence",
    exampleAnswer: "apple",
    patterns: [/\bapple\b/]
  },
  {
    id: "q2-dog",
    label: "Q2",
    prompt: "What is this?",
    imageSrc: "./assets/a0-look-answer-dog.jpeg",
    imageAlt: "A dog sitting.",
    placeholder: "One word or a short sentence",
    exampleAnswer: "dog",
    patterns: [/\bdog\b|\bpuppy\b/]
  },
  {
    id: "q3-blue",
    label: "Q3",
    prompt: "What colour is it?",
    imageSrc: "./assets/a0-look-answer-blue-car.jpeg",
    imageAlt: "A blue car.",
    placeholder: "One word or a short sentence",
    exampleAnswer: "blue",
    patterns: [/\bblue\b/]
  },
  {
    id: "q4-shopping",
    label: "Q4",
    prompt: "What is she doing?",
    imageSrc: "./assets/adult-writing-market.png",
    imageAlt: "An adult woman shopping at a market.",
    placeholder: "One word or a short sentence",
    exampleAnswer: "She is shopping.",
    patterns: [/\bshop\b|\bshops\b|\bshopping\b|\bbuy\b|\bbuys\b|\bbuying\b|\bchoos\w*\b/]
  },
  {
    id: "q5-three-apples",
    label: "Q5",
    prompt: "How many apples?",
    imageSrc: "./assets/a0-look-answer-three-apples.jpeg",
    imageAlt: "Three red apples on a table.",
    placeholder: "One word or a short sentence",
    exampleAnswer: "three apples",
    patterns: [/\b3\b|\bthree\b/]
  },
  {
    id: "q6-waiting",
    label: "Q6",
    prompt: "What are the people doing?",
    imageSrc: "./assets/a2-writing-bus-stop.jpeg",
    imageAlt: "Adults waiting for a bus.",
    placeholder: "One word or a short sentence",
    exampleAnswer: "They are waiting for a bus.",
    patterns: [/\bwait\b|\bwaits\b|\bwaiting\b/]
  },
  {
    id: "q7-one-sentence",
    label: "Q7",
    prompt: "Write ONE sentence.",
    imageSrc: "./assets/adult-writing-workstyles.png",
    imageAlt: "Adults working together in an office and one adult working at home.",
    placeholder: "Write one sentence"
  }
];

const TEST_FLOW_STEPS = [
  {
    number: "1",
    title: "Round questions",
    text: "Each level starts with 12 grammar and vocabulary questions."
  },
  {
    number: "2",
    title: "Reading",
    text: "A short reading task checks whether the same level still feels right."
  },
  {
    number: "3",
    title: "Final placement",
    text: "When the level best fits, the writing task helps identify the most suitable adult course."
  }
];

const LEVEL_INFOGRAPHIC_DETAILS = {
  A0: {
    band: "Starter step",
    canDo: "Can recognise first words and answer with very short English.",
    focus: "names, colours, numbers, everyday words",
    accent: "#c7e0d0"
  },
  A1: {
    band: "Building basics",
    canDo: "Can understand simple everyday sentences and short picture texts.",
    focus: "routines, shopping, common questions, present simple",
    accent: "#b6ddd7"
  },
  A2: {
    band: "Everyday life and work",
    canDo: "Can share clear simple information about familiar life and plans.",
    focus: "messages, trips, times, past and future meaning",
    accent: "#b9d9de"
  },
  B1: {
    band: "Growing confidence",
    canDo: "Can explain ideas, connect answers, and read longer practical texts.",
    focus: "reasons, experiences, feelings, joined-up sentences",
    accent: "#9ec5cc"
  },
  B2: {
    band: "Working with complexity",
    canDo: "Can handle longer reading and give opinions with more control.",
    focus: "organisation, detail, precision, ideas and arguments",
    accent: "#7fb0bb"
  }
};

const READING_BANK = {
  A0: {
    title: "Reading: Everyday notices",
    instructions: "Read the notices. Choose the best answer.",
    passage: [
      "Café: Open 8:00–17:00. Coffee £2. Water £1.",
      "Meeting room: Quiet please. No food or drink.",
      "Conversation club: Tuesday at 18:30 in Room 4."
    ],
    questions: [
      {
        prompt: "Where must people be quiet?",
        choices: ["The meeting room", "The café", "Room 4", "Outside"],
        answer: 0,
        explanation: "The meeting-room notice says, \"Quiet please.\""
      },
      {
        prompt: "When is the conversation club?",
        choices: ["Monday", "Tuesday", "Friday", "Saturday"],
        answer: 1,
        explanation: "The notice says the conversation club is on Tuesday."
      },
      {
        prompt: "How much is water?",
        choices: ["1 pound", "2 pounds", "3 pounds", "4 pounds"],
        answer: 0,
        explanation: "The café notice says water is 1 pound."
      },
      {
        prompt: "What is not allowed in the meeting room?",
        choices: ["A meeting", "Quiet talking", "Food or drink", "A notebook"],
        answer: 2,
        explanation: "The meeting-room notice says no food or drink."
      }
    ]
  },
  A1: {
    title: "Reading: Daniel's morning",
    instructions: "Read the short text. Choose Yes or No, or choose the best answer.",
    passage: [
      "Daniel works at a hotel. He starts at 9:00 every weekday. He usually takes the bus, but on Fridays he walks because the roads are busy. He drinks coffee before work and has lunch with his colleagues at 12:30."
    ],
    questions: [
      {
        prompt: "Daniel works at a hotel.",
        choices: ["Yes", "No"],
        answer: 0,
        explanation: "The text says Daniel works at a hotel."
      },
      {
        prompt: "Daniel starts work at 8:00.",
        choices: ["Yes", "No"],
        answer: 1,
        explanation: "He starts work at 9:00."
      },
      {
        prompt: "How does Daniel usually travel to work?",
        choices: ["By car", "By train", "By bus", "By bicycle"],
        answer: 2,
        explanation: "He usually takes the bus."
      },
      {
        prompt: "When does Daniel have lunch?",
        choices: ["At 9:00", "At 12:30", "At 17:00", "At 18:30"],
        answer: 1,
        explanation: "He has lunch at 12:30."
      }
    ]
  },
  A2: {
    title: "Reading: A training-day message",
    instructions: "Read the message. Choose the best answer.",
    passage: [
      "Hi Sam. The customer-service training is this Friday at the city conference centre. Please bring your staff ID and a notebook. Registration opens at 8:30, and the first session begins at 9:00. Lunch is provided. Wear comfortable shoes because we will walk to the partner hotel in the afternoon. —Jo"
    ],
    questions: [
      {
        prompt: "Where is the training?",
        choices: ["A hotel", "The city conference centre", "A café", "The main office"],
        answer: 1,
        explanation: "The message says it is at the city conference centre."
      },
      {
        prompt: "What should Sam bring?",
        choices: ["Lunch and water", "A laptop and charger", "Staff ID and a notebook", "A camera and coat"],
        answer: 2,
        explanation: "Sam should bring staff ID and a notebook."
      },
      {
        prompt: "What time does registration open?",
        choices: ["8:30", "9:00", "12:30", "17:00"],
        answer: 0,
        explanation: "Registration opens at 8:30."
      },
      {
        prompt: "Why should Sam wear comfortable shoes?",
        choices: ["The room is cold", "Lunch is outdoors", "The session is informal", "There is an afternoon walk"],
        answer: 3,
        explanation: "The group will walk to a partner hotel in the afternoon."
      }
    ]
  },
  B1: {
    title: "Reading: Improving a busy reception desk",
    instructions: "Read the passage. Choose the best answer.",
    passage: [
      "Last Friday, Amir covered the reception desk at a community health centre. At first, he felt nervous because the queue was long and visitors kept asking where to go. He noticed that the directions on the wall were difficult to read, so he made a simple sign showing each department and floor.",
      "After that, the queue moved more smoothly. Amir also helped an older visitor use the electronic check-in screen and found a chair for someone who felt unwell. At the end of his shift, Amir was tired, but he felt proud because he had made the centre easier to use."
    ],
    questions: [
      {
        prompt: "Where was Amir working?",
        choices: [
          "At a hotel",
          "At a community health centre",
          "At a bank",
          "At a conference"
        ],
        answer: 1,
        explanation: "Amir was covering reception at a community health centre."
      },
      {
        prompt: "What made Amir nervous at first?",
        choices: [
          "The computer was broken.",
          "His manager was late.",
          "The queue was long and visitors needed directions.",
          "The centre was closing early."
        ],
        answer: 2,
        explanation: "The long queue and repeated questions made him nervous."
      },
      {
        prompt: "Why did Amir make a sign?",
        choices: [
          "To show departments and floors",
          "To advertise a new service",
          "To ask his manager for help",
          "To record visitors' names"
        ],
        answer: 0,
        explanation: "The sign made the directions easier to understand."
      },
      {
        prompt: "How did Amir feel at the end?",
        choices: ["Angry", "Proud", "Bored", "Embarrassed"],
        answer: 1,
        explanation: "He felt proud because he had made the centre easier to use."
      }
    ]
  },
  B2: {
    title: "Reading: A meeting-free morning",
    instructions: "Read the passage. Choose the best answer.",
    passage: [
      "Some employees at Northbridge Design want a meeting-free morning every Wednesday. During the first three hours, colleagues would avoid scheduled calls unless an urgent decision was needed. The idea began after staff noticed that frequent interruptions made it harder to complete focused work.",
      "Not everyone agrees. Some employees say short meetings help them resolve questions quickly, coordinate across time zones, or support new colleagues. Others think protected time could make the working week calmer and more productive. Management has suggested a four-week trial instead of a permanent policy.",
      "A meeting-free morning would not solve every problem, but it could help the company learn which conversations need a meeting and which can be handled asynchronously. The best policy is likely to be clear, flexible, and reviewed using staff feedback."
    ],
    questions: [
      {
        prompt: "Why did the idea for a meeting-free morning begin?",
        choices: [
          "Clients requested fewer calls.",
          "Staff noticed interruptions were affecting focused work.",
          "Employees wanted a shorter working day.",
          "Management wanted to close the office."
        ],
        answer: 1,
        explanation: "Staff noticed that frequent interruptions made focused work harder."
      },
      {
        prompt: "What does a trial mean in this passage?",
        choices: [
          "A punishment for using phones",
          "A new lesson about technology",
          "A short test before making a final decision",
          "A rule that cannot be changed"
        ],
        answer: 2,
        explanation: "The policy would be tested for four weeks before a final decision."
      },
      {
        prompt: "How is the passage balanced?",
        choices: [
          "It gives reasons for and against the idea.",
          "It says phones are always bad.",
          "It only describes what managers think.",
          "It says every employee agrees."
        ],
        answer: 0,
        explanation: "The passage includes both possible benefits and concerns."
      },
      {
        prompt: "What is the author's main purpose?",
        choices: [
          "To advertise meeting software",
          "To tell a funny workplace story",
          "To explain how offices are designed",
          "To discuss a possible workplace policy and its reasons"
        ],
        answer: 3,
        explanation: "The passage discusses a workplace policy and explains different views."
      }
    ]
  }
};

const WRITING_LEVEL_PROFILES = {
  A0: {
    analysisMode: "foundation",
    scoreMax: 7,
    showSentenceTypes: false
  },
  A1: {
    analysisMode: "foundation",
    scoreMax: 7,
    showSentenceTypes: false
  },
  A2: {
    analysisMode: "guided",
    scoreMax: 7,
    showSentenceTypes: false
  },
  B1: {
    analysisMode: "advanced",
    scoreMax: 10,
    showSentenceTypes: true
  },
  B2: {
    analysisMode: "advanced",
    scoreMax: 10,
    showSentenceTypes: true
  }
};

const WRITING_TASK_EXPECTATIONS = {
  A0: {
    sentenceMin: 2,
    sentenceMax: 4
  },
  A1: {
    sentenceMin: 2,
    sentenceMax: 4
  },
  A2: {
    sentenceMin: 4,
    sentenceMax: 6
  },
  B1: {
    sentenceMin: 4,
    sentenceMax: 7
  },
  B2: {
    sentenceMin: 5,
    sentenceMax: 9
  }
};

const QUESTION_BANK = {
  A0: [
    {
      prompt: "Mia and Leo _ best friends.",
      choices: ["is", "are", "am", "be"],
      answer: 1,
      explanation: 'We use "are" with two people.'
    },
    {
      prompt: "My coat is _ the chair.",
      choices: ["in", "between", "from", "on"],
      answer: 3,
      explanation: 'A coat can be "on" a chair.'
    },
    {
      prompt: "_ this woman next to your colleague?",
      choices: ["What's", "Where's", "Who's", "That's"],
      answer: 2,
      explanation: 'We ask about a person with "Who\'s".'
    },
    {
      prompt: "Karen enjoys _ TV after work.",
      choices: ["watching", "to watch", "watch", "watches"],
      answer: 0,
      explanation: 'After "enjoy", we use the -ing form.'
    },
    {
      prompt: "There aren't _ people at the concert.",
      choices: ["lot of", "many", "much", "very much"],
      answer: 1,
      explanation: 'We use "many" with countable nouns like "people".'
    },
    {
      prompt: "We usually meet _ 8 AM.",
      choices: ["in", "on", "for", "at"],
      answer: 3,
      explanation: 'We use "at" for clock times.'
    },
    {
      prompt: "Every day, I _ clean this board.",
      choices: ["have", "ought", "have to", "am"],
      answer: 2,
      explanation: '"Have to" shows something that is necessary.'
    },
    {
      prompt: "She _ finish the report yesterday.",
      choices: ["wasn't", "isn't", "didn't", "don't"],
      answer: 2,
      explanation: 'We use "didn\'t" for the past simple negative.'
    },
    {
      prompt: "Sarah _ dinner tonight.",
      choices: [
        "will go cooking",
        "is going cooking",
        "goes to cook",
        "is going to cook"
      ],
      answer: 3,
      explanation: '"Is going to cook" is the correct future form here.'
    },
    {
      prompt: "I laughed _ the movie was funny.",
      choices: ["because", "and", "so", "or"],
      answer: 0,
      explanation: '"Because" gives the reason.'
    },
    {
      prompt: "Tom _ a red backpack today.",
      choices: ["have", "has", "having", "are having"],
      answer: 1,
      explanation: 'We use "has" with "Tom".'
    },
    {
      prompt: "My colleague and I _ to work by bus.",
      choices: ["go", "goes", "going", "has gone"],
      answer: 0,
      explanation: 'We use "go" with "my colleague and I".'
    }
  ],
  A1: [
    {
      prompt: "This apple tastes _ the red one.",
      choices: ["more sweet", "more sweet than", "sweeter", "sweeter than"],
      answer: 3,
      explanation: '"Sweeter than" is the correct comparative form.'
    },
    {
      prompt: "The customers _ for their orders right now.",
      choices: ["wait", "waited", "are waiting", "have waited"],
      answer: 2,
      explanation: '"Right now" shows the present continuous.'
    },
    {
      prompt: "Jane and Tom _ from Malaysia.",
      choices: ["will", "are", "have", "is"],
      answer: 1,
      explanation: 'We use "are" with Jane and Tom.'
    },
    {
      prompt: "There is _ milk in the fridge, so we can make cocoa.",
      choices: ["a few", "many", "some", "much"],
      answer: 2,
      explanation: '"Some milk" is the natural choice in a positive sentence.'
    },
    {
      prompt: "Which sentence is correct?",
      choices: [
        "He don't like carrots.",
        "He doesn't likes carrots.",
        "He doesn't like carrots.",
        "He not like carrots."
      ],
      answer: 2,
      explanation: '"He doesn\'t like carrots." is the correct sentence.'
    },
    {
      prompt: "Would you like _ for coffee after work?",
      choices: ["go", "going", "to go", "goes"],
      answer: 2,
      explanation: 'After "would like", we use the infinitive: "to go".'
    },
    {
      prompt: "My dad is good _ fixing bikes.",
      choices: ["at", "on", "in", "for"],
      answer: 0,
      explanation: 'The phrase is "good at".'
    },
    {
      prompt: "I _ my grandma last weekend.",
      choices: ["visit", "visited", "visiting", "was visit"],
      answer: 1,
      explanation: '"Last weekend" tells us to use the past simple.'
    },
    {
      prompt: "There _ some apples on the table.",
      choices: ["is", "are", "was", "be"],
      answer: 1,
      explanation: 'We use "are" with plural nouns like apples.'
    },
    {
      prompt: "The blue bike is _ than the red bike.",
      choices: ["more fast", "faster", "fastest", "more faster"],
      answer: 1,
      explanation: '"Faster" is the correct comparative form.'
    },
    {
      prompt: "Can you tell me _ your bag is?",
      choices: ["where", "what", "why", "when"],
      answer: 0,
      explanation: 'We ask about location with "where".'
    },
    {
      prompt: "Mum said, 'Please tidy your room.' Which answer matches?",
      choices: [
        "She wants me to tidy my room.",
        "She wants tidy my room.",
        "She want me tidying my room.",
        "She wants that I tidy my room."
      ],
      answer: 0,
      explanation: 'The sentence means Mum wants me to tidy my room.'
    }
  ],
  A2: [
    {
      prompt: "She has _ finished her application.",
      choices: ["yet", "still", "just", "ago"],
      answer: 2,
      explanation: '"Just" means the action happened a short time ago.'
    },
    {
      prompt: "My manager asked me _ I had finished my project.",
      choices: ["if", "that", "what", "whose"],
      answer: 0,
      explanation: 'We often use "if" in reported yes/no questions.'
    },
    {
      prompt: "You _ wear a helmet when you ride your bike.",
      choices: ["should", "would", "might", "used to"],
      answer: 0,
      explanation: '"Should" gives advice.'
    },
    {
      prompt: "This is the park _ we play football on Fridays.",
      choices: ["who", "which", "where", "whose"],
      answer: 2,
      explanation: 'We use "where" for places.'
    },
    {
      prompt: "There isn't _ juice left in the bottle.",
      choices: ["many", "some", "much", "a few"],
      answer: 2,
      explanation: '"Much" goes with uncountable nouns in negatives.'
    },
    {
      prompt: "We were having dinner when the lights _ out.",
      choices: ["go", "went", "gone", "going"],
      answer: 1,
      explanation: 'The past simple "went" fits the second action.'
    },
    {
      prompt: "If I _ enough time, I will help you.",
      choices: ["have", "had", "will have", "am having"],
      answer: 0,
      explanation: 'In the first conditional, we use the present simple after "if".'
    },
    {
      prompt: "Which sentence is correct?",
      choices: [
        "I have never been to Japan.",
        "I never have been to Japan.",
        "I haven't never been to Japan.",
        "Never I have been to Japan."
      ],
      answer: 0,
      explanation: '"I have never been to Japan." is correct.'
    },
    {
      prompt: "The cake was so tasty that I had _ piece.",
      choices: ["another", "other", "the other", "others"],
      answer: 0,
      explanation: '"Another piece" means one more piece.'
    },
    {
      prompt: "You can borrow my pen _ you give it back later.",
      choices: ["because", "if", "although", "unless"],
      answer: 1,
      explanation: '"If" gives the condition.'
    },
    {
      prompt: "When I lived nearby, I _ to work every morning.",
      choices: ["walked", "walk", "am walking", "was walk"],
      answer: 0,
      explanation: '"Walked" is the correct past simple form.'
    },
    {
      prompt: "I've lived here _ 2021.",
      choices: ["since", "for", "at", "from"],
      answer: 0,
      explanation: 'We use "since" with a starting point in time.'
    }
  ],
  B1: [
    {
      prompt: "She hasn't been home _ 2019.",
      choices: ["in", "for", "since", "at"],
      answer: 2,
      explanation: '"Since" is used with a point in time.'
    },
    {
      prompt: "She asked me _.",
      choices: ["I lived where", "where I lived", "I did live where", "where did I live"],
      answer: 1,
      explanation: 'Reported questions use statement word order.'
    },
    {
      prompt: "I _ in Rome at the time.",
      choices: ["was living", "have been living", "have lived", "live"],
      answer: 0,
      explanation: '"Was living" shows an action in progress in the past.'
    },
    {
      prompt: "She _ promoted by the management team this week.",
      choices: ["is just", "has just", "has just be", "has just been"],
      answer: 3,
      explanation: '"Has just been promoted" is the correct passive form.'
    },
    {
      prompt: "How long _ English?",
      choices: [
        "was he being studied",
        "has he been studying",
        "did he studying",
        "has he study"
      ],
      answer: 1,
      explanation: '"Has he been studying" is the correct present perfect continuous form.'
    },
    {
      prompt: "If we _ harder, _ be in a better position now.",
      choices: [
        "had practised, we would",
        "had practised, we will",
        "would practise, we will",
        "practised, we would"
      ],
      answer: 0,
      explanation: 'This is a third-to-present mixed conditional pattern.'
    },
    {
      prompt: "_ Victor slipped, he still finished the race.",
      choices: ["Since", "Despite", "Even though", "Nevertheless"],
      answer: 2,
      explanation: '"Even though" introduces a full contrasting clause.'
    },
    {
      prompt: "_ the truth, I don't really like the way we arranged those flowers.",
      choices: ["Tell you", "Telling", "I tell", "To tell"],
      answer: 3,
      explanation: 'The fixed phrase is "To tell the truth".'
    },
    {
      prompt: "Choose the correct sentence.",
      choices: [
        "On second thought with your bike, we might all be able to go.",
        "On second thought, with your bike, we might all be able to go.",
        "On second, thought with your bike we might all be able to go.",
        "On second thought with your bike we might all be able to go."
      ],
      answer: 1,
      explanation: 'The commas are placed correctly in option B.'
    },
    {
      prompt: "I wish I _ the equipment yesterday.",
      choices: ["returned", "had returned", "return", "would return"],
      answer: 1,
      explanation: 'After "I wish" about a past regret, we use the past perfect.'
    },
    {
      prompt: "The invoices _ by the finance team before the deadline.",
      choices: ["were processed", "processed", "have processing", "were process"],
      answer: 0,
      explanation: '"Were processed" is the correct passive form.'
    },
    {
      prompt: "Neither my brother nor my friends _ ready yet.",
      choices: ["is", "are", "was", "be"],
      answer: 1,
      explanation: 'The verb agrees with the noun closest to it: "friends".'
    }
  ],
  B2: [
    {
      prompt: "Had I known about the extra practice, I _ my skates.",
      choices: [
        "would have brought",
        "will bring",
        "would bring",
        "had brought"
      ],
      answer: 0,
      explanation: 'This is a third conditional sentence.'
    },
    {
      prompt: "No sooner _ than the passengers rushed outside.",
      choices: [
        "did the bell ring",
        "had the bell rung",
        "the bell had rung",
        "the bell rang"
      ],
      answer: 1,
      explanation: 'After "No sooner", we use inversion with the past perfect.'
    },
    {
      prompt: "Not only _ the industry conference, but she also won an award.",
      choices: [
        "did Lea join",
        "Lea joined",
        "Lea did join",
        "has Lea joined"
      ],
      answer: 0,
      explanation: 'After "Not only" at the start, inversion is needed.'
    },
    {
      prompt: "The new rules, _ were announced on Monday, start next week.",
      choices: ["who", "which", "where", "whose"],
      answer: 1,
      explanation: '"Which" introduces a non-defining relative clause about rules.'
    },
    {
      prompt: "If only I _ my charger yesterday; my tablet is flat now.",
      choices: ["had packed", "would pack", "packed", "have packed"],
      answer: 0,
      explanation: '"If only" plus past perfect expresses a regret about the past.'
    },
    {
      prompt: "The book was so gripping that I stayed up late, _ I had work the next day.",
      choices: ["despite", "although", "because of", "so that"],
      answer: 1,
      explanation: '"Although" introduces the contrast correctly.'
    },
    {
      prompt: "She spoke so quietly that I could hardly _ what she said.",
      choices: ["make out", "get over", "turn down", "bring up"],
      answer: 0,
      explanation: '"Make out" means hear or understand with difficulty.'
    },
    {
      prompt: "All the documents _ by the legal team before the office opened.",
      choices: ["had been made", "have made", "were being make", "are made"],
      answer: 0,
      explanation: 'The past perfect passive is needed here.'
    },
    {
      prompt: "Which sentence is correct?",
      choices: [
        "Seldom we see such a creative project.",
        "Seldom do we see such a creative project.",
        "Seldom we do see such a creative project.",
        "Seldom did we have seen such a creative project."
      ],
      answer: 1,
      explanation: 'After "Seldom", inversion is used.'
    },
    {
      prompt: "By the end of this year, I _ at this company for six years.",
      choices: ["will have been", "have been", "was being", "am"],
      answer: 0,
      explanation: 'The future perfect fits the time reference.'
    },
    {
      prompt: "Little _ that the surprise party was for him.",
      choices: ["he knew", "did he know", "he did know", "knows he"],
      answer: 1,
      explanation: 'Inversion is needed after "Little" at the start.'
    },
    {
      prompt: "The coach suggested that Maya _ a short break before the final race.",
      choices: ["takes", "took", "take", "is taking"],
      answer: 2,
      explanation: 'After "suggested that", the base verb "take" is used.'
    }
  ]
};

const APP_CONFIG = window.HUNKY_DORY_CONFIG || {};
const ADULT_SITUATIONS =
  Array.isArray(APP_CONFIG.adultSituations) && APP_CONFIG.adultSituations.length
    ? APP_CONFIG.adultSituations
    : [
        "Working full time",
        "Working part time",
        "Self-employed",
        "University or college",
        "Job seeking",
        "Retired",
        "Other"
      ];
const GOOGLE_SCRIPT_URL =
  typeof APP_CONFIG.googleScriptUrl === "string"
    ? APP_CONFIG.googleScriptUrl.trim()
    : "";
const RESULTS_SUBMISSION_URLS =
  typeof window !== "undefined" && /^https?:$/i.test(window.location.protocol)
    ? ["/api/submit-results", "/api/submit-results.js"]
    : GOOGLE_SCRIPT_URL
      ? [GOOGLE_SCRIPT_URL]
      : [];
const GOOGLE_SHEET_URL =
  typeof APP_CONFIG.googleSheetUrl === "string"
    ? APP_CONFIG.googleSheetUrl.trim()
    : "";
const WRITING_TIME_LIMIT_SECONDS = 3 * 60;
const PENDING_SUBMISSIONS_KEY = "hunkyDoryPendingSubmissions";
const CONFIG_WRITING_CHECKS =
  APP_CONFIG.writingChecks && typeof APP_CONFIG.writingChecks === "object"
    ? APP_CONFIG.writingChecks
    : {};
const CONFIG_EXTRA_WRITING_WORDS = Array.isArray(CONFIG_WRITING_CHECKS.extraWords)
  ? CONFIG_WRITING_CHECKS.extraWords
      .map(function (word) {
        return String(word).trim().toLowerCase();
      })
      .filter(Boolean)
  : [];
const CONFIG_CUSTOM_WRITING_CORRECTIONS =
  CONFIG_WRITING_CHECKS.customCorrections &&
  typeof CONFIG_WRITING_CHECKS.customCorrections === "object"
    ? Object.keys(CONFIG_WRITING_CHECKS.customCorrections).reduce(function (accumulator, key) {
        const correction = String(CONFIG_WRITING_CHECKS.customCorrections[key]).trim().toLowerCase();

        if (correction) {
          accumulator[String(key).trim().toLowerCase()] = correction;
        }

        return accumulator;
      }, {})
    : {};
const BUILT_IN_WRITING_WORDS = [
  "a",
  "about",
  "after",
  "age",
  "agree",
  "all",
  "am",
  "an",
  "and",
  "animal",
  "are",
  "art",
  "at",
  "banana",
  "because",
  "best",
  "bike",
  "book",
  "break",
  "brother",
  "by",
  "can",
  "cat",
  "class",
  "office",
  "day",
  "dinner",
  "dog",
  "drawing",
  "english",
  "family",
  "favourite",
  "feel",
  "felt",
  "food",
  "football",
  "for",
  "friend",
  "friends",
  "fun",
  "good",
  "happy",
  "have",
  "help",
  "helped",
  "home",
  "application",
  "i",
  "important",
  "in",
  "is",
  "it",
  "juice",
  "kind",
  "like",
  "likes",
  "little",
  "lunch",
  "make",
  "maths",
  "me",
  "morning",
  "my",
  "name",
  "old",
  "on",
  "our",
  "park",
  "pet",
  "play",
  "played",
  "playing",
  "practice",
  "practise",
  "project",
  "read",
  "reading",
  "really",
  "rule",
  "workplace",
  "science",
  "sentence",
  "sentences",
  "short",
  "someone",
  "something",
  "sport",
  "story",
  "learner",
  "trainer",
  "that",
  "the",
  "their",
  "them",
  "there",
  "they",
  "time",
  "to",
  "today",
  "very",
  "want",
  "was",
  "we",
  "what",
  "when",
  "why",
  "with",
  "write",
  "years",
  "you",
  "year",
  "your",
  "yourself",
  "live",
  "lives",
  "bananas"
];
const LEVEL_WRITING_WORDS = {
  A0: [
    "apple",
    "banana",
    "cat",
    "dog",
    "draw",
    "football",
    "hello",
    "home",
    "ice",
    "cream",
    "jump",
    "music",
    "orange",
    "pizza",
    "read",
    "run",
    "swim"
  ],
  A1: [
    "customer",
    "market",
    "shopper",
    "shopping",
    "vegetable",
    "chair",
    "outside",
    "running"
  ],
  A2: [
    "beach",
    "bus",
    "commuter",
    "market",
    "passenger",
    "station",
    "travel",
    "work"
  ],
  B1: [
    "accident",
    "brave",
    "careful",
    "helped",
    "happened",
    "nervous",
    "someone",
    "thankful"
  ],
  B2: [
    "community",
    "important",
    "improve",
    "opinion",
    "respect",
    "responsibility",
    "rule",
    "should"
  ]
};
const BUILT_IN_WRITING_CORRECTIONS = {
  agge: "age",
  aple: "apple",
  banaan: "banana",
  becaus: "because",
  becuase: "because",
  favouite: "favourite",
  favouritee: "favourite",
  freind: "friend",
  freinds: "friends",
  hapy: "happy",
  hlep: "help",
  isu: "is",
  lik: "like",
  libe: "live",
  lkie: "like",
  nmae: "name",
  oldd: "old",
  peple: "people",
  practis: "practise",
  sentense: "sentence",
  sentenses: "sentences",
  somthing: "something",
  workplase: "workplace",
  wriet: "write",
  yaers: "years",
  yeras: "years"
};

const BUILT_IN_WRITING_SENTENCE_RULES = [
  {
    regex: /\bI\s+(\d{1,2})\s+year(?:s)?\s+old\b/gi,
    replacement: function (_, age) {
      return "I am " + age + (age === "1" ? " year old" : " years old");
    },
    message: 'Use "I am" when saying your age.',
    category: "grammar"
  },
  {
    regex: /\bI\s+am\s+(\d{1,2})\s+year\s+old\b/gi,
    replacement: function (_, age) {
      return "I am " + age + (age === "1" ? " year old" : " years old");
    },
    message: 'Use "years old" with numbers greater than 1.',
    category: "grammar"
  },
  {
    regex: /\bI\s+live\s+([A-Z][A-Za-z' -]*)(?=[.!?]|$)/g,
    replacement: "I live in $1",
    message: 'Use "live in" when talking about where you live.',
    category: "sentence structure"
  },
  {
    regex: /\bI\s+like\s+in\s+([A-Z][A-Za-z' -]*)(?=[.!?]|$)/g,
    replacement: "I live in $1",
    message: 'Use "I live in ..." to talk about where you live.',
    category: "sentence structure"
  },
  {
    regex: /\bI\s+like\s+banana(?=[.!?]|$)/gi,
    replacement: "I like bananas",
    message: 'Use the plural when talking about bananas in general.',
    category: "grammar"
  }
];

const REWRITE_COUNTABLE_NOUNS = new Set([
  "animal",
  "apple",
  "banana",
  "bird",
  "book",
  "cat",
  "dog",
  "friend",
  "game",
  "pet",
  "rabbit",
  "song",
  "story",
  "toy"
]);

function toTitleCaseWord(word) {
  if (!word) {
    return "";
  }

  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function pluralizeSimpleWord(word) {
  const lowerWord = word.toLowerCase();

  if (/(s|sh|ch|x|z)$/.test(lowerWord)) {
    return preserveWordCase(word, lowerWord + "es");
  }

  if (/[^aeiou]y$/.test(lowerWord)) {
    return preserveWordCase(word, lowerWord.slice(0, -1) + "ies");
  }

  if (/s$/.test(lowerWord)) {
    return word;
  }

  return preserveWordCase(word, lowerWord + "s");
}

function getWritingLevelProfile(levelCode) {
  return WRITING_LEVEL_PROFILES[levelCode] || WRITING_LEVEL_PROFILES.A2;
}

function splitWritingSentences(text) {
  const matches = String(text).match(/[^.!?]+[.!?]?/g) || [];

  return matches
    .map(function (sentence) {
      return sentence.trim();
    })
    .filter(Boolean);
}

function looksLikeClause(text) {
  const clause = text.trim();

  if (clause.split(/\s+/).filter(Boolean).length < 2) {
    return false;
  }

  const hasSubject =
    /\b(I|you|he|she|we|they|it|my|our|their|the|a|an|everyone|someone|people|adults|colleagues|friends|[A-Z][a-z]+|[a-z]+s)\b/.test(
      clause
    );
  const hasVerb =
    /\b(am|is|are|was|were|have|has|had|do|does|did|can|could|will|would|should|go|goes|went|like|likes|liked|live|lives|lived|play|plays|played|help|helps|helped|think|thinks|thought|feel|feels|felt|want|wants|wanted|make|makes|made|say|says|said|agree|agrees|agreed|learn|learns|learned|respect|respects|respected|study|studies|studied|use|uses|used|write|writes|wrote|read|reads|improve|improves|improved|follow|follows|followed|understand|understands|understood|work|works|worked|grow|grows|grew|enjoy|enjoys|enjoyed|need|needs|needed|keep|keeps|kept|stay|stays|stayed|become|becomes|became)\b/i.test(
      clause
    );

  return hasSubject && hasVerb;
}

function normaliseSentenceExample(sentence) {
  const trimmed = sentence.trim();

  if (!trimmed) {
    return "";
  }

  const withEnding = /[.!?]$/.test(trimmed) ? trimmed : trimmed + ".";

  return withEnding.charAt(0).toUpperCase() + withEnding.slice(1);
}

function analyzeSentenceTypes(text) {
  const sentences = splitWritingSentences(text);
  const result = {
    simple: "",
    compound: "",
    complex: "",
    comment: "Sentence variety is not clear yet."
  };

  sentences.forEach(function (sentence) {
    const cleanedSentence = sentence.replace(/[.!?]+$/, "").trim();
    const complexPattern =
      /\b(because|although|when|if|while|since|after|before|unless|though)\b/i;
    const compoundPattern = /\b(and|but|so|or|yet)\b/i;
    const startsWithComplexMarker = new RegExp(
      "^\\s*(because|although|when|if|while|since|after|before|unless|though)\\b",
      "i"
    );

    if (!cleanedSentence || !looksLikeClause(cleanedSentence)) {
      return;
    }

    let isComplex = false;

    if (complexPattern.test(cleanedSentence)) {
      if (startsWithComplexMarker.test(cleanedSentence) && cleanedSentence.includes(",")) {
        const clauseParts = cleanedSentence.split(/,\s*/).filter(Boolean);

        if (
          clauseParts.length >= 2 &&
          looksLikeClause(clauseParts[0]) &&
          looksLikeClause(clauseParts.slice(1).join(", "))
        ) {
          isComplex = true;
        }
      }

      if (!isComplex) {
        const splitParts = cleanedSentence.split(complexPattern).filter(function (part) {
          return looksLikeClause(part);
        });

        isComplex = splitParts.length >= 2;
      }
    }

    const isCompound =
      !isComplex &&
      compoundPattern.test(cleanedSentence) &&
      cleanedSentence.split(/\b(?:and|but|so|or|yet)\b/i).filter(function (part) {
        return looksLikeClause(part);
      }).length >= 2;

    if (isComplex && !result.complex) {
      result.complex = normaliseSentenceExample(sentence);
      return;
    }

    if (isCompound && !result.compound) {
      result.compound = normaliseSentenceExample(sentence);
      return;
    }

    if (!isComplex && !isCompound && !result.simple) {
      result.simple = normaliseSentenceExample(sentence);
    }
  });

  const typesUsedCount = ["simple", "compound", "complex"].filter(function (type) {
    return Boolean(result[type]);
  }).length;

  if (typesUsedCount >= 3) {
    result.comment = "You use a strong range of sentence types.";
  } else if (typesUsedCount === 2) {
    result.comment = "You use some good sentence variety. Keep mixing your sentence types.";
  } else if (result.simple) {
    result.comment = "Most of your sentences are simple. Try adding a compound or complex sentence.";
  }

  result.simple = result.simple || "Not clearly used.";
  result.compound = result.compound || "Not clearly used.";
  result.complex = result.complex || "Not clearly used.";

  return result;
}

function createEmptyStudent() {
  return {
    name: "",
    age: "",
    currentSituation: "",
    email: ""
  };
}

function createAttemptId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return "attempt-" + Date.now() + "-" + Math.random().toString(16).slice(2);
}

const state = {
  attemptId: createAttemptId(),
  student: createEmptyStudent(),
  selfRating: null,
  currentLevelIndex: 0,
  questionIndex: 0,
  selectedChoice: null,
  isQuestionTransitioning: false,
  readingSelections: {},
  readingResults: [],
  responses: [],
  roundScores: [],
  pendingAction: null,
  pendingWritingNextLevelIndex: null,
  finalLevelIndex: 0,
  finalNote: "",
  a0WritingResponses: {},
  selectedWritingPrompt: null,
  writing: null,
  writtenResponse: "",
  writingTimer: {
    remainingSeconds: WRITING_TIME_LIMIT_SECONDS,
    intervalId: null,
    expired: false
  },
  submission: {
    status: "idle",
    message: ""
  }
};

const elements = {
  screens: {
    landing: document.querySelector("#landing-screen"),
    registration: document.querySelector("#registration-screen"),
    welcome: document.querySelector("#welcome-screen"),
    transition: document.querySelector("#transition-screen"),
    reading: document.querySelector("#reading-screen"),
    question: document.querySelector("#question-screen"),
    writing: document.querySelector("#writing-screen"),
    result: document.querySelector("#result-screen"),
    completed: document.querySelector("#completed-screen")
  },
  startTestButton: document.querySelector("#start-test-button"),
  registrationForm: document.querySelector("#registration-form"),
  studentNameInput: document.querySelector("#student-name"),
  studentAgeInput: document.querySelector("#student-age"),
  currentSituationInput: document.querySelector("#current-situation"),
  currentSituationOptions: document.querySelector("#current-situation-options"),
  learnerEmailInput: document.querySelector("#learner-email"),
  sheetConfigNote: document.querySelector("#sheet-config-note"),
  registrationMessage: document.querySelector("#registration-message"),
  saveDetailsButton: document.querySelector("#save-details-button"),
  welcomeNextButton: document.querySelector("#welcome-next-button"),
  transitionStep: document.querySelector("#transition-step"),
  transitionTitle: document.querySelector("#transition-title"),
  transitionText: document.querySelector("#transition-text"),
  transitionContinueButton: document.querySelector("#transition-continue-button"),
  questionShell: document.querySelector(".question-shell"),
  levelKicker: document.querySelector("#level-kicker"),
  questionProgress: document.querySelector("#question-progress"),
  roundChip: document.querySelector("#round-chip"),
  questionPrompt: document.querySelector("#question-prompt"),
  choiceList: document.querySelector("#choice-list"),
  questionOkButton: document.querySelector("#question-ok-button"),
  readingLevelNote: document.querySelector("#reading-level-note"),
  readingTitle: document.querySelector("#reading-title"),
  readingInstructions: document.querySelector("#reading-instructions"),
  readingPassage: document.querySelector("#reading-passage"),
  readingQuestionList: document.querySelector("#reading-question-list"),
  readingMessage: document.querySelector("#reading-message"),
  readingSubmitButton: document.querySelector("#reading-submit-button"),
  writingScreenTitle: document.querySelector("#writing-screen-title"),
  writingLevelNote: document.querySelector("#writing-level-note"),
  a0WritingSection: document.querySelector("#a0-writing-section"),
  a0WritingInstructions: document.querySelector("#a0-writing-instructions"),
  a0WritingList: document.querySelector("#a0-writing-list"),
  writingStandardLayout: document.querySelector("#writing-standard-layout"),
  writingTimer: document.querySelector("#writing-timer"),
  writingImage: document.querySelector("#writing-image"),
  writingImageFallback: document.querySelector("#writing-image-fallback"),
  writingTaskSummary: document.querySelector("#writing-task-summary"),
  writingHintList: document.querySelector("#writing-hint-list"),
  writingEditorKicker: document.querySelector("#writing-editor-kicker"),
  writingPrompt: document.querySelector("#writing-prompt"),
  writingInput: document.querySelector("#writing-input"),
  writingCheckButton: document.querySelector("#writing-check-button"),
  writingResultsButton: document.querySelector("#writing-results-button"),
  writingFeedback: document.querySelector("#writing-feedback"),
  resultTitle: document.querySelector("#result-title"),
  resultSummary: document.querySelector("#result-summary"),
  resultDetail: document.querySelector("#result-detail"),
  assessmentSummary: document.querySelector("#assessment-summary"),
  studentSummary: document.querySelector("#student-summary"),
  sheetStatus: document.querySelector("#sheet-status"),
  finishTestButton: document.querySelector("#finish-test-button"),
  scoreChart: document.querySelector("#score-chart"),
  levelTrack: document.querySelector("#level-track"),
  resultInfographic: document.querySelector("#result-infographic"),
  roundSummary: document.querySelector("#round-summary"),
  writingSummary: document.querySelector("#writing-summary"),
  reviewList: document.querySelector("#review-list"),
  restartButton: document.querySelector("#restart-button")
};

function showScreen(screenName) {
  Object.keys(elements.screens).forEach(function (key) {
    if (key === screenName) {
      elements.screens[key].classList.add("active");
    } else {
      elements.screens[key].classList.remove("active");
    }
  });

  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "auto" });
  }
}

function getCurrentLevel() {
  return LEVELS[state.currentLevelIndex];
}

function getCurrentQuestions() {
  return QUESTION_BANK[getCurrentLevel().code];
}

function getCurrentReadingTask() {
  return READING_BANK[getCurrentLevel().code];
}

function getLetterForIndex(index) {
  return String.fromCharCode(97 + index);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getStudentNameWords() {
  return state.student.name
    .toLowerCase()
    .split(/[^a-z']+/)
    .filter(Boolean);
}

function getWritingDictionary(levelCode) {
  return new Set(
    BUILT_IN_WRITING_WORDS
      .concat(LEVEL_WRITING_WORDS[levelCode] || [])
      .concat(CONFIG_EXTRA_WRITING_WORDS)
      .concat(getStudentNameWords())
  );
}

function getWritingCorrectionsMap() {
  return Object.assign({}, BUILT_IN_WRITING_CORRECTIONS, CONFIG_CUSTOM_WRITING_CORRECTIONS);
}

function isLikelyNameToken(token, dictionary, studentNameWords) {
  const lowerToken = token.toLowerCase();

  if (studentNameWords.includes(lowerToken)) {
    return true;
  }

  return /^[A-Z][a-z'-]+$/.test(token) && !dictionary.has(lowerToken);
}

function levenshteinDistance(source, target) {
  const rows = source.length + 1;
  const cols = target.length + 1;
  const matrix = Array.from({ length: rows }, function (_, rowIndex) {
    return Array.from({ length: cols }, function (_, columnIndex) {
      if (rowIndex === 0) {
        return columnIndex;
      }

      if (columnIndex === 0) {
        return rowIndex;
      }

      return 0;
    });
  });

  for (let row = 1; row < rows; row += 1) {
    for (let column = 1; column < cols; column += 1) {
      const cost = source[row - 1] === target[column - 1] ? 0 : 1;

      matrix[row][column] = Math.min(
        matrix[row - 1][column] + 1,
        matrix[row][column - 1] + 1,
        matrix[row - 1][column - 1] + cost
      );
    }
  }

  return matrix[rows - 1][cols - 1];
}

function getClosestDictionaryWord(word, dictionary) {
  const lowerWord = word.toLowerCase();
  const maxDistance = lowerWord.length <= 4 ? 2 : lowerWord.length <= 7 ? 2 : 3;
  let bestWord = "";
  let bestDistance = Infinity;

  dictionary.forEach(function (candidate) {
    if (!candidate || Math.abs(candidate.length - lowerWord.length) > 2) {
      return;
    }

    if (candidate.charAt(0) !== lowerWord.charAt(0)) {
      return;
    }

    const distance = levenshteinDistance(lowerWord, candidate);

    if (distance < bestDistance && distance <= maxDistance) {
      bestWord = candidate;
      bestDistance = distance;
    }
  });

  return bestWord;
}

function preserveWordCase(sourceWord, correctedWord) {
  if (sourceWord === sourceWord.toUpperCase()) {
    return correctedWord.toUpperCase();
  }

  if (/^[A-Z]/.test(sourceWord)) {
    return correctedWord.charAt(0).toUpperCase() + correctedWord.slice(1);
  }

  return correctedWord;
}

function findSpellingCorrections(text, levelCode) {
  const correctionsMap = getWritingCorrectionsMap();
  const findings = [];
  const replacementMap = {};
  const seenFindings = new Set();
  const tokenMatches = text.match(/[A-Za-z']+/g) || [];

  tokenMatches.forEach(function (token) {
    const lowerToken = token.toLowerCase();

    const suggestion = correctionsMap[lowerToken];

    if (!suggestion || suggestion === lowerToken) {
      return;
    }

    const findingKey = lowerToken + "->" + suggestion;

    if (!seenFindings.has(findingKey)) {
      findings.push({
        original: token,
        correction: preserveWordCase(token, suggestion)
      });
      seenFindings.add(findingKey);
    }

    replacementMap[lowerToken] = suggestion;
  });

  return {
    findings: findings,
    replacementMap: replacementMap
  };
}

function applyHardWiredCorrections(text, replacementMap) {
  return text.replace(/[A-Za-z']+/g, function (token) {
    const replacement = replacementMap[token.toLowerCase()];

    if (!replacement) {
      return token;
    }

    return preserveWordCase(token, replacement);
  });
}

function pushUniqueIssue(issueItems, message, category) {
  if (
    issueItems.some(function (item) {
      return item.message === message;
    })
  ) {
    return;
  }

  issueItems.push({
    message: message,
    category: category
  });
}

function applySentencePatternCorrections(text, issueItems) {
  let updatedText = text;

  BUILT_IN_WRITING_SENTENCE_RULES.forEach(function (rule) {
    const matcher = new RegExp(rule.regex.source, rule.regex.flags);

    if (!matcher.test(updatedText)) {
      return;
    }

    pushUniqueIssue(issueItems, rule.message, rule.category || "grammar");
    updatedText = updatedText.replace(rule.regex, rule.replacement);
  });

  return updatedText;
}

function buildAssessmentText(text, levelCode) {
  const spellingCorrections = findSpellingCorrections(text, levelCode);
  let assessmentText = text.replace(/ {2,}/g, " ").trim();

  if (Object.keys(spellingCorrections.replacementMap).length) {
    assessmentText = applyHardWiredCorrections(
      assessmentText,
      spellingCorrections.replacementMap
    );
  }

  assessmentText = assessmentText
    .replace(/\bi\b/g, "I")
    .replace(/\bI\s+is\b/gi, "I am");

  return applySentencePatternCorrections(assessmentText, []);
}

function addCorrectionExample(examples, before, after) {
  const cleanBefore = String(before || "").replace(/\s+/g, " ").trim();
  const cleanAfter = String(after || "").replace(/\s+/g, " ").trim();
  const key = cleanBefore.toLowerCase() + "->" + cleanAfter.toLowerCase();

  if (!cleanBefore || !cleanAfter || cleanBefore === cleanAfter || examples.length >= 3) {
    return;
  }

  if (
    examples.some(function (example) {
      return example.key === key;
    })
  ) {
    return;
  }

  examples.push({
    key: key,
    text: cleanBefore + " → " + cleanAfter
  });
}

function buildCorrectionExamples(text, spellingFindings) {
  const examples = [];
  const lowerText = text.toLowerCase();
  const nameMatch = text.match(/\b(my|me)\s+name\s+(is|isu)\s+([A-Za-z][A-Za-z'-]*)\b/i);
  const ageBareMatch = text.match(/\bI\s+(\d{1,2})\s+year\s+old\b/i);
  const ageIsMatch = text.match(/\bI\s+is\s+(\d{1,2})\s+year\s+old\b/i);
  const ageAmMatch = text.match(/\bI\s+am\s+(\d{1,2})\s+year\s+old\b/i);
  const likeMatch = text.match(/\bI\s+like\s+([A-Za-z']+)(?=[.!?]|$)/i);

  if (
    nameMatch &&
    (nameMatch[1] !== "My" || nameMatch[2] !== "is" || /^[a-z]/.test(nameMatch[3]))
  ) {
    addCorrectionExample(
      examples,
      nameMatch[0],
      "My name is " + toTitleCaseWord(nameMatch[3]) + "."
    );
  }

  if (ageIsMatch) {
    addCorrectionExample(
      examples,
      "I is " + ageIsMatch[1] + " year old",
      "I am " + ageIsMatch[1] + " years old."
    );
  } else if (ageBareMatch) {
    addCorrectionExample(
      examples,
      "I " + ageBareMatch[1] + " year old",
      "I am " + ageBareMatch[1] + " years old."
    );
  } else if (ageAmMatch) {
    addCorrectionExample(
      examples,
      "I am " + ageAmMatch[1] + " year old",
      "I am " + ageAmMatch[1] + " years old."
    );
  }

  if (likeMatch && REWRITE_COUNTABLE_NOUNS.has(likeMatch[1].toLowerCase())) {
    addCorrectionExample(
      examples,
      "I like " + likeMatch[1],
      "I like " + pluralizeSimpleWord(likeMatch[1]) + "."
    );
  }

  if (/^(hello|hi|hey)\s+my name\b/i.test(text)) {
    addCorrectionExample(examples, "Hello My name", "Hello, my name");
  }

  if (/\bI\s+is\b/i.test(text)) {
    addCorrectionExample(examples, "I is", "I am");
  }

  if (/\bi\b/.test(text)) {
    addCorrectionExample(examples, "i", "I");
  }

  spellingFindings.forEach(function (finding) {
    addCorrectionExample(examples, finding.original, finding.correction);
  });

  if (!/[.!?]$/.test(text.trim()) && examples.length < 3) {
    addCorrectionExample(examples, "end of answer", "add a full stop.");
  }

  if (lowerText.includes("yrs")) {
    addCorrectionExample(examples, "yrs", "years");
  }

  return examples.map(function (example) {
    return example.text;
  });
}

function populateAdultSituations() {
  elements.currentSituationOptions.innerHTML = ADULT_SITUATIONS.map(function (situation) {
    return '<option value="' + escapeHtml(situation) + '"></option>';
  }).join("");
}

function updateSheetConfigNote() {
  elements.sheetConfigNote.hidden = false;
  if (GOOGLE_SCRIPT_URL) {
    elements.sheetConfigNote.textContent =
      "Google Sheets is connected. Completed tests will be sent automatically.";
    return;
  }

  if (GOOGLE_SHEET_URL) {
    elements.sheetConfigNote.textContent =
      "The results spreadsheet has been set. Add the deployed Google Apps Script web app URL in config.js to send results into it automatically.";
    return;
  }

  elements.sheetConfigNote.textContent =
    "Admin note: add your Google Sheet and Google Apps Script web app URL in config.js to send each completed test to Google Sheets.";
}

function renderRegistrationForm() {
  elements.studentNameInput.value = state.student.name;
  elements.studentAgeInput.value = state.student.age;
  elements.currentSituationInput.value = state.student.currentSituation;
  elements.learnerEmailInput.value = state.student.email;
}

function setRegistrationMessage(message) {
  elements.registrationMessage.hidden = !message;
  elements.registrationMessage.textContent = message;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateStudentDetails() {
  const rawName = elements.studentNameInput.value.trim();
  const rawAge = elements.studentAgeInput.value.trim();
  const rawSituation = elements.currentSituationInput.value.trim();
  const rawEmail = elements.learnerEmailInput.value.trim();
  const age = Number(rawAge);

  if (rawName.length < 2) {
    return {
      valid: false,
      message: "Please enter your name."
    };
  }

  if (!Number.isInteger(age) || age < 18) {
    return {
      valid: false,
      message: "This test is for adults aged 18 or over."
    };
  }

  if (!rawSituation) {
    return {
      valid: false,
      message: "Please enter your current situation."
    };
  }

  if (rawEmail && !isValidEmail(rawEmail)) {
    return {
      valid: false,
      message: "Please enter a valid email address."
    };
  }

  return {
    valid: true,
    details: {
      name: rawName,
      age: age,
      currentSituation: rawSituation,
      email: rawEmail
    }
  };
}

function setSubmissionStatus(status, message) {
  state.submission.status = status;
  state.submission.message = message;
  renderSubmissionStatus();
}

function renderSubmissionStatus() {
  elements.sheetStatus.className = "sheet-status";

  if (state.submission.status && state.submission.status !== "idle") {
    elements.sheetStatus.classList.add("status-" + state.submission.status);
  }

  elements.sheetStatus.textContent = state.submission.message;
}

function getResultsExportFilenameBase() {
  return (
    "hunky-dory-results-" +
    (state.student.name || "student")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
}

function clearPrintResultsMode(previousTitle) {
  if (typeof document === "undefined") {
    return;
  }

  document.body.classList.remove("is-printing-results");

  if (typeof previousTitle === "string") {
    document.title = previousTitle;
  }
}

function saveResultsLocally() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const previousTitle = document.title;
  const exportTitle = getResultsExportFilenameBase();
  let cleanedUp = false;

  function cleanup() {
    if (cleanedUp) {
      return;
    }

    cleanedUp = true;
    clearPrintResultsMode(previousTitle);
  }

  document.body.classList.add("is-printing-results");
  document.title = exportTitle;
  window.addEventListener("afterprint", cleanup, { once: true });

  window.setTimeout(cleanup, 2000);
  window.print();
}

function showTransition(step, title, text, action) {
  state.pendingAction = action;
  elements.transitionStep.textContent = String(step);
  elements.transitionTitle.textContent = title;
  elements.transitionText.textContent = text;
  showScreen("transition");
}

function beginFirstRoundFlow() {
  showTransition(
    3,
    "Let's start with 12 Beginner level questions.",
    'Choose the best answer each time. If you are not sure, click "I don\'t know." After 12 questions, there will be a short reading section.',
    function () {
      state.currentLevelIndex = 0;
      state.questionIndex = 0;
      state.selectedChoice = null;
      renderQuestion();
      showScreen("question");
    }
  );
}

function setReadingMessage(message) {
  elements.readingMessage.hidden = !message;
  elements.readingMessage.textContent = message;
}

function renderReadingPassage(task) {
  elements.readingPassage.innerHTML = "";

  if (task.imageSrc) {
    const image = document.createElement("img");
    image.className =
      "reading-image" +
      (task.imageVariant ? " reading-image-" + task.imageVariant : "");
    image.src = task.imageSrc;
    image.alt = task.imageAlt || task.title;
    elements.readingPassage.appendChild(image);
  }

  task.passage.forEach(function (paragraph) {
    const paragraphElement = document.createElement("p");
    paragraphElement.textContent = paragraph;
    elements.readingPassage.appendChild(paragraphElement);
  });
}

function hasReadingSelection(questionIndex) {
  return Object.prototype.hasOwnProperty.call(state.readingSelections, questionIndex);
}

function renderReadingQuestions(task) {
  elements.readingQuestionList.innerHTML = "";

  task.questions.forEach(function (question, questionIndex) {
    const item = document.createElement("article");
    item.className = "reading-question";

    const title = document.createElement("h3");
    title.textContent = questionIndex + 1 + ". " + question.prompt;

    const choiceGrid = document.createElement("div");
    choiceGrid.className = "reading-choice-grid";

    question.choices.forEach(function (choice, choiceIndex) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "reading-choice-button";
      button.innerHTML = `
        <span class="choice-letter">${String.fromCharCode(65 + choiceIndex)}</span>
        <span>${escapeHtml(choice)}</span>
      `;
      button.addEventListener("click", function () {
        if (hasReadingSelection(questionIndex)) {
          return;
        }

        state.readingSelections[questionIndex] = choiceIndex;
        Array.from(choiceGrid.children).forEach(function (child, childIndex) {
          child.classList.toggle("selected", childIndex === choiceIndex);
          child.disabled = true;
        });
        setReadingMessage("");
      });
      choiceGrid.appendChild(button);
    });

    item.appendChild(title);
    item.appendChild(choiceGrid);
    elements.readingQuestionList.appendChild(item);
  });
}

function showReadingScreen() {
  const level = getCurrentLevel();
  const task = getCurrentReadingTask();

  state.readingSelections = {};
  elements.readingLevelNote.textContent =
    level.code +
    " " +
    level.name +
    " reading. Answer these before we decide whether to continue.";
  elements.readingTitle.textContent = task.title;
  elements.readingInstructions.textContent = task.instructions;
  elements.readingSubmitButton.disabled = false;
  setReadingMessage("");
  renderReadingPassage(task);
  renderReadingQuestions(task);
  showScreen("reading");
}

function renderQuestion() {
  const level = getCurrentLevel();
  const questions = getCurrentQuestions();
  const question = questions[state.questionIndex];
  const label = getLetterForIndex(state.questionIndex);
  const roundNumber = state.currentLevelIndex + 1;

  state.selectedChoice = null;
  elements.levelKicker.textContent = level.code + " " + level.name;
  elements.questionProgress.textContent =
    label + ". Question " + (state.questionIndex + 1) + " of " + QUESTIONS_PER_LEVEL;
  elements.roundChip.textContent = "Round " + roundNumber;
  elements.questionPrompt.textContent = label + ". " + question.prompt;

  elements.choiceList.innerHTML = "";

  const options = question.choices.slice();
  options.push(IDK_TEXT);

  options.forEach(function (option, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    button.setAttribute("role", "listitem");
    const isUnknownOption = index === options.length - 1;
    const optionMarkup = isUnknownOption
      ? `
      <span class="choice-text-unknown">${escapeHtml(IDK_LABEL)}</span>
      <span class="choice-emoji" aria-hidden="true">${IDK_EMOJI}</span>
    `
      : `<span>${escapeHtml(option)}</span>`;
    button.innerHTML = `
      <span class="choice-letter">${String.fromCharCode(65 + index)}</span>
      ${optionMarkup}
    `;
    button.addEventListener("click", function () {
      if (state.isQuestionTransitioning || state.selectedChoice !== null) {
        return;
      }

      state.selectedChoice = index;
      Array.from(elements.choiceList.children).forEach(function (child, childIndex) {
        child.classList.toggle("selected", childIndex === index);
        child.disabled = true;
      });
      animateQuestionAdvance();
    });
    elements.choiceList.appendChild(button);
  });
}

function animateQuestionAdvance() {
  const advance = function () {
    elements.questionShell.classList.add("is-fading-out");

    window.setTimeout(function () {
      submitQuestion();
      elements.questionShell.classList.remove("is-fading-out");

      if (elements.screens.question.classList.contains("active")) {
        void elements.questionShell.offsetWidth;
        elements.questionShell.classList.add("is-fading-in");

        window.setTimeout(function () {
          elements.questionShell.classList.remove("is-fading-in");
          state.isQuestionTransitioning = false;
        }, QUESTION_FADE_DURATION);
        return;
      }

      state.isQuestionTransitioning = false;
    }, QUESTION_FADE_DURATION);
  };

  state.isQuestionTransitioning = true;

  window.setTimeout(advance, QUESTION_SELECTION_DELAY);
}

function submitQuestion() {
  const level = getCurrentLevel();
  const questions = getCurrentQuestions();
  const question = questions[state.questionIndex];

  if (state.selectedChoice === null) {
    return;
  }

  const isDontKnow = state.selectedChoice === question.choices.length;
  const isCorrect = !isDontKnow && state.selectedChoice === question.answer;

  state.responses.push({
    levelCode: level.code,
    levelName: level.name,
    questionNumber: state.questionIndex + 1,
    prompt: question.prompt,
    choices: question.choices.slice(),
    answer: question.answer,
    selected: state.selectedChoice,
    isDontKnow: isDontKnow,
    correct: isCorrect,
    explanation: question.explanation
  });

  if (state.questionIndex === QUESTIONS_PER_LEVEL - 1) {
    showReadingScreen();
    return;
  }

  state.questionIndex += 1;
  renderQuestion();
}

function calculatePlacementScore(grammarScore, readingResult) {
  if (!readingResult || !readingResult.total) {
    return grammarScore;
  }

  const grammarRatio = grammarScore / QUESTIONS_PER_LEVEL;
  const readingRatio = readingResult.correct / readingResult.total;
  const combinedRatio = grammarRatio * 0.75 + readingRatio * 0.25;

  return Math.round(combinedRatio * QUESTIONS_PER_LEVEL);
}

function submitReading() {
  if (elements.readingSubmitButton.disabled) {
    return;
  }

  const level = getCurrentLevel();
  const task = getCurrentReadingTask();
  const unansweredIndex = task.questions.findIndex(function (_question, questionIndex) {
    return !hasReadingSelection(questionIndex);
  });

  if (unansweredIndex !== -1) {
    setReadingMessage("Please answer all reading questions before continuing.");
    return;
  }

  elements.readingSubmitButton.disabled = true;

  const answers = task.questions.map(function (question, questionIndex) {
    const selected = state.readingSelections[questionIndex];
    const isCorrect = selected === question.answer;

    return {
      questionNumber: questionIndex + 1,
      prompt: question.prompt,
      choices: question.choices.slice(),
      selected: selected,
      selectedAnswer: question.choices[selected],
      answer: question.answer,
      correctAnswer: question.choices[question.answer],
      correct: isCorrect,
      explanation: question.explanation
    };
  });

  const readingResult = {
    levelCode: level.code,
    levelName: level.name,
    title: task.title,
    correct: answers.filter(function (answer) {
      return answer.correct;
    }).length,
    total: answers.length,
    answers: answers
  };

  state.readingResults.push(readingResult);
  finishRound(readingResult);
}

function evaluateRound(levelIndex, score) {
  const lastLevelIndex = LEVELS.length - 1;

  if (score >= 9) {
    if (levelIndex < lastLevelIndex) {
      return {
        continueToNext: true,
        nextLevelIndex: levelIndex + 1
      };
    }

    return {
      continueToNext: false,
      finalLevelIndex: levelIndex,
      finalNote: "You completed the highest round in this test."
    };
  }

  if (score >= 5) {
    return {
      continueToNext: false,
      finalLevelIndex: levelIndex,
      finalNote: "This is the level that best matches the answers in your final round."
    };
  }

  return {
    continueToNext: false,
    finalLevelIndex: Math.max(0, levelIndex - 1),
    finalNote:
      levelIndex === 0
        ? "This is the best place to start building English confidence."
        : "This round was quite hard, so the previous level is the best fit right now."
  };
}

function finishRound(readingResult) {
  const level = getCurrentLevel();
  const roundResponses = state.responses.slice(-QUESTIONS_PER_LEVEL);
  const grammarScore = roundResponses.filter(function (item) {
    return item.correct;
  }).length;
  const dontKnowCount = roundResponses.filter(function (item) {
    return item.isDontKnow;
  }).length;
  const readingCorrect = readingResult ? readingResult.correct : 0;
  const readingTotal = readingResult ? readingResult.total : 0;
  const attemptedCorrect = grammarScore + readingCorrect;
  const attemptedTotal = QUESTIONS_PER_LEVEL + readingTotal;
  const placementScore = calculatePlacementScore(grammarScore, readingResult);
  const outcome = evaluateRound(state.currentLevelIndex, placementScore);

  state.roundScores.push({
    levelCode: level.code,
    levelName: level.name,
    correct: placementScore,
    total: QUESTIONS_PER_LEVEL,
    placementScore: placementScore,
    placementTotal: QUESTIONS_PER_LEVEL,
    grammarCorrect: grammarScore,
    grammarTotal: QUESTIONS_PER_LEVEL,
    readingCorrect: readingCorrect,
    readingTotal: readingTotal,
    attemptedCorrect: attemptedCorrect,
    attemptedTotal: attemptedTotal,
    attemptedPercentage: attemptedTotal
      ? Math.round((attemptedCorrect / attemptedTotal) * 100)
      : 0,
    dontKnowCount: dontKnowCount,
    advanced: outcome.continueToNext
  });

  if (state.currentLevelIndex === 0) {
    state.finalLevelIndex = 0;
    state.finalNote =
      "Everyone completes the A0 picture-answer section before moving on to A1.";
    state.pendingWritingNextLevelIndex = 1;
    showWritingScreen();
    return;
  }

  if (outcome.continueToNext) {
    const nextLevel = LEVELS[outcome.nextLevelIndex];
    showTransition(
      state.roundScores.length + 4,
      "Great job! The next 12 are at " + nextLevel.name + " level.",
      "You got " +
        grammarScore +
        " out of 12 grammar questions and " +
        (readingResult ? readingResult.correct : 0) +
        " out of " +
        (readingResult ? readingResult.total : 0) +
        " reading questions in the " +
        level.name +
        " round. Let's keep going.",
      function () {
        state.currentLevelIndex = outcome.nextLevelIndex;
        state.questionIndex = 0;
        state.selectedChoice = null;
        renderQuestion();
        showScreen("question");
      }
    );
    return;
  }

  state.finalLevelIndex = outcome.finalLevelIndex;
  state.finalNote = outcome.finalNote;
  showWritingScreen();
}

function getRandomArrayItem(items) {
  if (!Array.isArray(items) || !items.length) {
    return null;
  }

  return items[Math.floor(Math.random() * items.length)];
}

function getWritingPromptConfig() {
  const level = LEVELS[state.finalLevelIndex];
  const pool = WRITING_IMAGE_POOLS[level.code];

  if (!pool || !pool.length) {
    return level;
  }

  if (
    !state.selectedWritingPrompt ||
    state.selectedWritingPrompt.levelCode !== level.code
  ) {
    const selectedPrompt = getRandomArrayItem(pool);
    state.selectedWritingPrompt = selectedPrompt
      ? Object.assign({ levelCode: level.code }, selectedPrompt)
      : null;
  }

  return state.selectedWritingPrompt
    ? Object.assign({}, level, state.selectedWritingPrompt)
    : level;
}

function getWritingPrompt() {
  return getWritingPromptConfig().writingPrompt;
}

function attachWritingInputGuards(field) {
  field.addEventListener("paste", blockWritingTextTransfer);
  field.addEventListener("drop", blockWritingTextTransfer);
  field.addEventListener("beforeinput", blockWritingBeforeInput);
}

function formatWritingTime(seconds) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return minutes + ":" + String(remainingSeconds).padStart(2, "0");
}

function renderWritingTimer() {
  if (!elements.writingTimer) {
    return;
  }

  elements.writingTimer.textContent =
    state.writingTimer.expired
      ? "Time finished"
      : "Time left: " + formatWritingTime(state.writingTimer.remainingSeconds);
  elements.writingTimer.classList.toggle(
    "is-warning",
    !state.writingTimer.expired && state.writingTimer.remainingSeconds <= 60
  );
  elements.writingTimer.classList.toggle("is-expired", state.writingTimer.expired);
}

function stopWritingTimer() {
  if (state.writingTimer.intervalId) {
    clearInterval(state.writingTimer.intervalId);
    state.writingTimer.intervalId = null;
  }
}

function setWritingInputsDisabled(disabled) {
  elements.writingInput.disabled = disabled;

  Array.from(elements.a0WritingList.querySelectorAll("input, textarea")).forEach(function (field) {
    field.disabled = disabled;
  });
}

function startWritingTimer() {
  stopWritingTimer();
  state.writingTimer.remainingSeconds = WRITING_TIME_LIMIT_SECONDS;
  state.writingTimer.expired = false;
  renderWritingTimer();

  state.writingTimer.intervalId = window.setInterval(function () {
    if (state.writingTimer.remainingSeconds <= 1) {
      state.writingTimer.remainingSeconds = 0;
      state.writingTimer.expired = true;
      stopWritingTimer();
      renderWritingTimer();
      if (!state.writing) {
        checkWriting(true);
      }
      return;
    }

    state.writingTimer.remainingSeconds -= 1;
    renderWritingTimer();
  }, 1000);
}

function renderA0WritingSection() {
  elements.a0WritingList.innerHTML = "";

  A0_LOOK_AND_ANSWER_PROMPTS.forEach(function (prompt) {
    const card = document.createElement("article");
    card.className = "a0-prompt-card";

    const imageWrap = document.createElement("div");
    imageWrap.className = "a0-prompt-image-wrap";

    const image = document.createElement("img");
    image.className = "a0-prompt-image";
    image.src = prompt.imageSrc;
    image.alt = prompt.imageAlt;
    imageWrap.appendChild(image);

    const panel = document.createElement("div");
    panel.className = "a0-prompt-panel";

    const kicker = document.createElement("p");
    kicker.className = "question-kicker";
    kicker.textContent = prompt.label;

    const title = document.createElement("h3");
    title.className = "a0-prompt-title";
    title.textContent = prompt.prompt;

    const field =
      prompt.id === "q7-one-sentence"
        ? document.createElement("textarea")
        : document.createElement("input");

    field.className =
      prompt.id === "q7-one-sentence"
        ? "a0-prompt-input a0-prompt-textarea"
        : "a0-prompt-input";
    field.id = "a0-writing-" + prompt.id;
    field.placeholder = prompt.placeholder;
    field.spellcheck = false;
    field.autocorrect = "off";
    field.autocapitalize = "off";
    field.autocomplete = "off";
    field.value = state.a0WritingResponses[prompt.id] || "";

    if (prompt.id === "q7-one-sentence") {
      field.rows = 3;
    } else {
      field.type = "text";
    }

    field.addEventListener("input", function () {
      state.a0WritingResponses[prompt.id] = field.value;
    });
    attachWritingInputGuards(field);

    panel.appendChild(kicker);
    panel.appendChild(title);
    panel.appendChild(field);

    card.appendChild(imageWrap);
    card.appendChild(panel);
    elements.a0WritingList.appendChild(card);
  });
}

function renderWritingHints(level) {
  elements.writingHintList.innerHTML = "";

  (level.writingHints || []).forEach(function (hint) {
    const item = document.createElement("li");
    item.textContent = hint;
    elements.writingHintList.appendChild(item);
  });
}

function showWritingScreen() {
  const writingConfig = getWritingPromptConfig();
  const isA0 = writingConfig.code === "A0";
  const hasPendingNextLevel =
    typeof state.pendingWritingNextLevelIndex === "number";

  state.writing = null;
  stopWritingTimer();
  setWritingInputsDisabled(false);
  elements.writingCheckButton.disabled = false;
  elements.writingScreenTitle.textContent = isA0 ? "Look and answer" : "Writing task";
  elements.writingCheckButton.textContent = isA0 ? "Check Answers" : "Check Writing";
  elements.writingEditorKicker.textContent = isA0
    ? "Write one sentence from the pictures"
    : "Your writing";
  elements.writingLevelNote.textContent =
    "We have placed the student at " +
    writingConfig.code +
    " " +
    writingConfig.name +
    ".";

  if (isA0) {
    elements.a0WritingSection.hidden = false;
    elements.writingStandardLayout.hidden = true;
    elements.a0WritingInstructions.textContent =
      "Look at each picture and answer. You can write one word or a short sentence.";
    renderA0WritingSection();
  } else {
    const writingIntro = writingConfig.writingImageSrc
      ? "Look at the picture and write for this level."
      : "Use the prompt and write for this level.";
    elements.writingLevelNote.textContent += " " + writingIntro;
    elements.a0WritingSection.hidden = true;
    elements.writingStandardLayout.hidden = false;
    elements.writingTaskSummary.textContent = writingConfig.writingPromptHint || "";
    renderWritingHints(writingConfig);
    elements.writingPrompt.textContent = getWritingPrompt();
    elements.writingInput.placeholder =
      writingConfig.writingPlaceholder || "Write here...";
    if (writingConfig.writingImageSrc) {
      elements.writingImage.src = writingConfig.writingImageSrc;
      elements.writingImage.alt =
        writingConfig.writingImageAlt || writingConfig.writingPrompt;
      elements.writingImage.hidden = false;
      elements.writingImageFallback.hidden = true;
      elements.writingImageFallback.textContent = "";
    } else {
      elements.writingImage.hidden = true;
      elements.writingImage.removeAttribute("src");
      elements.writingImage.alt = "";
      elements.writingImageFallback.hidden = false;
      elements.writingImageFallback.textContent =
        "Starter prompt: write about yourself using short sentences.";
    }
  }

  elements.writingFeedback.hidden = true;
  elements.writingFeedback.innerHTML = "";
  elements.writingResultsButton.hidden = true;
  elements.writingResultsButton.textContent = hasPendingNextLevel
    ? "Continue to " + LEVELS[state.pendingWritingNextLevelIndex].code
    : "Finish test";
  startWritingTimer();
  showScreen("writing");
}

function getWritingTaskExpectation(levelCode) {
  return WRITING_TASK_EXPECTATIONS[levelCode] || WRITING_TASK_EXPECTATIONS.A2;
}

function getSentenceCountStatus(levelCode, sentenceCount) {
  const expectation = getWritingTaskExpectation(levelCode);

  if (sentenceCount < expectation.sentenceMin - 1) {
    return "far-below";
  }

  if (sentenceCount < expectation.sentenceMin) {
    return "slightly-below";
  }

  if (sentenceCount > expectation.sentenceMax + 1) {
    return "far-above";
  }

  if (sentenceCount > expectation.sentenceMax) {
    return "slightly-above";
  }

  return "within-range";
}

function getSentenceTypeCount(sentenceTypeAnalysis) {
  if (!sentenceTypeAnalysis) {
    return 0;
  }

  return ["simple", "compound", "complex"].filter(function (type) {
    return sentenceTypeAnalysis[type] && sentenceTypeAnalysis[type] !== "Not clearly used.";
  }).length;
}

function matchesAnyPattern(text, patterns) {
  return patterns.some(function (pattern) {
    return pattern.test(text);
  });
}

function buildTaskResponse(status, comment, coverageScore) {
  return {
    status: status,
    comment: comment,
    coverageScore: coverageScore
  };
}

function evaluateTaskResponse(levelCode, originalText, assessmentText, sentenceCount) {
  const sourceText = (assessmentText || originalText || "").toLowerCase();
  const originalSource = (originalText || "").toLowerCase();
  const combinedText = sourceText + " " + originalSource;

  if (levelCode === "A0") {
    const hasName = /\bmy name is\b|\bi am called\b|\bi'm called\b/.test(combinedText);
    const hasAge = /\b(i am|i'm)\s+\d{1,2}\s+years?\s+old\b/.test(combinedText);
    const hasLike = /\bi like\b|\bi love\b|\bmy favourite\b/.test(combinedText);
    const coverageScore = [hasName, hasAge, hasLike].filter(Boolean).length;

    if (coverageScore >= 2) {
      return buildTaskResponse(
        "strong",
        "Task complete: personal information included.",
        coverageScore
      );
    }

    if (coverageScore === 1 || sentenceCount >= 1) {
      return buildTaskResponse(
        "partial",
        "Mostly answered: add one more personal detail.",
        Math.max(coverageScore, 1)
      );
    }

    return buildTaskResponse(
      "weak",
      "Needs task detail: include your name, age, or a like.",
      0
    );
  }

  if (levelCode === "A1") {
    const hasSubject = matchesAnyPattern(combinedText, [
      /\badult\b|\bperson\b|\bshopper\b|\bcustomer\b|\bman\b|\bwoman\b|\bdog\b|\bcat\b|\bkitten\b|\bhe\b|\bshe\b|\bthey\b/
    ]);
    const hasAction = matchesAnyPattern(combinedText, [
      /\brun\b|\bruns\b|\brunning\b/,
      /\bplay\b|\bplays\b|\bplaying\b/,
      /\bjump\b|\bjumping\b/,
      /\bsmile\b|\bsmiling\b/,
      /\bwalk\b|\bwalking\b/,
      /\beat\b|\beats\b|\beating\b/,
      /\bdrink\b|\bdrinks\b|\bdrinking\b/,
      /\bread\b|\breads\b|\breading\b/,
      /\bhold\b|\bholds\b|\bholding\b/,
      /\bride\b|\brides?\b|\briding\b|\bbike\b|\bcycle\b|\bcycles\b|\bcycling\b/,
      /\bsit\b|\bsits\b|\bsitting\b/,
      /\bshop\b|\bshops\b|\bshopping\b|\bbuy\b|\bbuying\b|\bchoose\b|\bchoosing\b/
    ]);
    const hasDetail = matchesAnyPattern(combinedText, [
      /\bmarket\b|\bstall\b|\bvegetable\b|\btomato\b|\bbag\b|\bpark\b|\bgrass\b|\boutside\b|\bchair\b/
    ]);
    const coverageScore = [hasSubject, hasAction, hasDetail].filter(Boolean).length;

    if (hasSubject && hasAction) {
      return buildTaskResponse(
        "strong",
        "Task complete: you described who you can see and what is happening.",
        coverageScore
      );
    }

    if (hasSubject || hasAction) {
      return buildTaskResponse(
        "partial",
        "Mostly answered: add who or what you can see, or what is happening.",
        Math.max(coverageScore, 1)
      );
    }

    return buildTaskResponse(
      "weak",
      "Needs task detail: say who you can see and what is happening.",
      coverageScore
    );
  }

  if (levelCode === "A2") {
    const hasPeople = matchesAnyPattern(combinedText, [
      /\bpeople\b|\badults?\b|\bman\b|\bwoman\b|\bcolleagues?\b|\bfriends?\b|\bgroup\b|\bshoppers?\b|\bpassengers?\b|\bcommuters?\b/
    ]);
    const hasPlace = matchesAnyPattern(combinedText, [
      /\bbeach\b|\bsea\b|\bocean\b|\bsand\b|\bshore\b|\bcoast\b|\bwater\b|\bumbrella\b/,
      /\bmarket\b|\bshop\b|\bshops\b|\bstall\b|\bstalls\b|\bstreet\b/,
      /\bpark\b|\blake\b|\bgrass\b/,
      /\bbus stop\b|\bbus\b|\bstation\b/,
      /\bhome\b|\bhouse\b|\bliving room\b|\btable\b|\bkitchen\b/
    ]);
    const hasAction = matchesAnyPattern(combinedText, [
      /\bswim\b|\bswimming\b/,
      /\bplay\b|\bplaying\b/,
      /\brun\b|\brunning\b/,
      /\bbuild\b|\bbuilding\b/,
      /\bsit\b|\bsitting\b/,
      /\bwalk\b|\bwalking\b/,
      /\bsail\b|\bsailing\b/,
      /\beat\b|\beating\b|\beats\b|\bhave dinner\b|\bhaving dinner\b/,
      /\btalk\b|\btalking\b|\bchat\b|\bchatting\b/,
      /\bshop\b|\bshopping\b|\bbuy\b|\bbuying\b|\bsell\b|\bselling\b/,
      /\bwait\b|\bwaiting\b|\bstand\b|\bstanding\b/,
      /\bcook\b|\bcooking\b|\bmake\b|\bmaking\b|\bprepare\b|\bpreparing\b/,
      /\bhelp\b|\bhelping\b/
    ]);
    const coverageScore = [hasPeople, hasPlace, hasAction].filter(Boolean).length;

    if (hasPeople && hasPlace && hasAction) {
      return buildTaskResponse(
        "strong",
        "Task complete: you described the people, the place, and the action.",
        coverageScore
      );
    }

    if (coverageScore >= 2) {
      return buildTaskResponse(
        "partial",
        "Mostly answered: add one more detail about the people, place, or action.",
        coverageScore
      );
    }

    return buildTaskResponse(
      "weak",
      "Needs task detail: describe the people, the place, and what is happening.",
      coverageScore
    );
  }

  if (levelCode === "B1") {
    const hasPeople = matchesAnyPattern(combinedText, [
      /\badult\b|\badults\b|\bcommuter\b|\bcommuters\b|\bcolleague\b|\bcolleagues\b|\bman\b|\bwoman\b|\bperson\b|\bpeople\b|\bhe\b|\bshe\b|\bthey\b/
    ]);
    const hasSituation = matchesAnyPattern(combinedText, [
      /\bstation\b|\bconcourse\b|\btrain\b|\bcommute\b|\bplatform\b|\bcafé\b|\bcoffee\b/
    ]);
    const hasAction = matchesAnyPattern(combinedText, [
      /\bhelp\b|\bhelping\b|\bguide\b|\bguiding\b|\bsupport\b|\bsupporting\b/,
      /\bwalk\b|\bwalking\b|\bhold\b|\bholding\b|\bpick up\b|\bgather\b|\bgathering\b/,
      /\bdrop\b|\bdropped\b|\bdropping\b|\bfall\b|\bfell\b|\bfallen\b/,
      /\btalk\b|\btalking\b|\bchat\b|\bchatting\b|\bmeet\b|\bmeeting\b/,
      /\bdrink\b|\bdrinking\b|\bcoffee\b/
    ]);
    const hasFeeling = matchesAnyPattern(combinedText, [
      /\bhappy\b|\bexcited\b|\bproud\b|\brelieved\b|\bkind\b|\bhelpful\b/,
      /\bupset\b|\bsad\b|\bworried\b|\bnervous\b|\btired\b|\blonely\b|\bangry\b|\bfrustrated\b|\bscared\b/
    ]);
    const hasExplanation = matchesAnyPattern(combinedText, [
      /\bbecause\b|\bso\b|\bso that\b/,
      /\blooks like\b|\bit looks like\b|\bseems\b|\bprobably\b|\bmaybe\b|\bperhaps\b/,
      /\bto help\b|\bto show\b|\bthis could mean\b|\bI think\b|\bin my opinion\b/,
      /\bwhy\b|\bhow\b/
    ]);
    const hasBothPictures = matchesAnyPattern(combinedText, [
      /\bboth\b|\btwo pictures\b|\btwo scenes\b/,
      /\bone picture\b|\banother picture\b|\bother picture\b|\bfirst picture\b|\bsecond picture\b/,
      /\bon the left\b|\bon the right\b|\btop picture\b|\bbottom picture\b/,
      /\balso\b|\bwhile\b|\bmeanwhile\b/
    ]);
    const coverageScore = [
      hasPeople,
      hasSituation,
      hasAction,
      hasFeeling,
      hasExplanation,
      hasBothPictures
    ].filter(Boolean).length;

    if (
      hasPeople &&
      hasSituation &&
      hasAction &&
      hasFeeling &&
      hasExplanation &&
      (hasBothPictures || sentenceCount >= 5)
    ) {
      return buildTaskResponse(
        "strong",
        "Task complete: the situations, feelings, and explanation are clear.",
        coverageScore
      );
    }

    if (
      (hasPeople && hasAction && hasFeeling) ||
      (hasSituation && hasAction && hasExplanation)
    ) {
      return buildTaskResponse(
        "partial",
        "Mostly answered: add more feeling words, explanation, or a clearer link between the two pictures.",
        Math.max(coverageScore, 3)
      );
    }

    return buildTaskResponse(
      "weak",
      "Needs task detail: write about both pictures, say how people feel, and explain what may be happening.",
      coverageScore
    );
  }

  if (levelCode === "B2") {
    const hasTheme = matchesAnyPattern(combinedText, [
      /\boffice\b|\bhome office\b|\bremote work\b|\bworking from home\b|\bworkplace\b|\bcolleague\b|\bcolleagues\b/,
      /\bcity\b|\bcrowded\b|\btraffic\b|\bbusy\b|\bcountryside\b|\bvillage\b|\brural\b|\bquiet\b/,
      /\bnature\b|\briver\b|\bpollution\b|\bpolluted\b|\bclean\b|\bdirty\b|\btrash\b|\brubbish\b|\blitter\b|\bfactory\b|\bsmoke\b|\benvironment\b/,
      /\bteam\b|\bteamwork\b|\bgroup\b|\btogether\b|\bcollaborat\b|\balone\b|\bindividual\b/,
      /\bwork\b|\bworking\b|\bmeeting\b|\bmeetings\b|\bproductivity\b|\bflexibility\b/,
      /\bexercise\b|\bexercising\b|\bpark\b|\brun\b|\brunning\b|\bactive\b|\bindoors\b|\binside\b|\bsitting\b|\btelevision\b|\btv\b/,
      /\brecycle\b|\brecycling\b|\brecycled\b|\bbin\b|\bbins\b|\bplastic\b|\bglass\b|\bpaper\b/
    ]);
    const hasInterpretation = matchesAnyPattern(combinedText, [
      /\bshows\b|\bshowing\b|\bsuggests\b|\bmeans\b|\bmessage\b|\bidea\b|\bissue\b|\bproblem\b|\bimportance\b|\beffect\b|\bresult\b/,
      /\bthis picture\b|\bthe picture\b|\bthe image\b|\bthis image\b/
    ]);
    const hasComparison = matchesAnyPattern(combinedText, [
      /\bcompare\b|\bcomparison\b|\bdifferent\b|\bdifference\b|\bsimilar\b|\bsimilarity\b|\bcontrast\b/,
      /\bwhile\b|\bwhereas\b|\bon the other hand\b|\bcompared with\b|\bcompared to\b|\bversus\b|\bvs\b|\bthan\b/,
      /\bone side\b|\bother side\b|\bleft side\b|\bright side\b|\bon the left\b|\bon the right\b/
    ]);
    const hasOpinion = /\bi think\b|\bi believe\b|\bin my opinion\b|\bi prefer\b|\bbetter\b|\bworse\b|\bimportant\b|\bshould\b|\bmust\b|\bneed to\b|\bit is best\b/.test(
      combinedText
    );
    const hasReason = matchesAnyPattern(combinedText, [
      /\bbecause\b|\bso\b|\btherefore\b|\bas a result\b|\bfor example\b|\bfor instance\b/,
      /\bthis helps\b|\bit helps\b|\bthis can\b|\bit can\b|\bthis may\b|\bit may\b|\bthis could\b|\bit could\b/,
      /\bgood for\b|\bbad for\b|\bmore healthy\b|\bhealthier\b|\bmore useful\b|\bmore effective\b|\bbetter for\b/
    ]);
    const coverageScore = [
      hasTheme,
      hasInterpretation,
      hasComparison,
      hasOpinion,
      hasReason
    ].filter(Boolean).length;

    if (hasTheme && hasOpinion && hasReason && (hasComparison || hasInterpretation)) {
      return buildTaskResponse(
        "strong",
        "Task complete: the idea is interpreted and your opinion is supported with reasons.",
        coverageScore
      );
    }

    if (hasTheme && (hasOpinion || hasReason || hasComparison || hasInterpretation)) {
      return buildTaskResponse(
        "partial",
        "Mostly answered: add a clearer opinion, comparison, or supporting reason.",
        Math.max(coverageScore, 2)
      );
    }

    return buildTaskResponse(
      "weak",
      "Needs task detail: explain the idea in the picture and give your opinion with reasons.",
      coverageScore
    );
  }

  return buildTaskResponse(
    "weak",
    "Needs task detail: explain the idea in the picture and give your opinion with reasons.",
    0
  );
}

function countWordsInText(text) {
  return (text.match(/\b[\w']+\b/g) || []).length;
}

function buildA0ResponseSummary(promptResponses) {
  return promptResponses
    .map(function (item, index) {
      return "Q" + (index + 1) + ": " + (item.answer || "[blank]");
    })
    .join(" | ");
}

function evaluateA0Prompt(prompt, answer) {
  const cleanAnswer = (answer || "").trim();

  if (!cleanAnswer) {
    return {
      status: "blank",
      score: 0
    };
  }

  const text = cleanAnswer.toLowerCase();

  if (prompt.id === "q7-one-sentence") {
    const wordCount = countWordsInText(cleanAnswer);
    const hasPeople = /\badult\b|\badults\b|\bcolleague\b|\bcolleagues\b|\bman\b|\bwoman\b|\bthey\b|\bpeople\b/.test(
      text
    );
    const hasWork = /\bwork\b|\bworking\b|\boffice\b|\bhome\b|\bmeeting\b|\btalk\b|\btalking\b|\bsit\b|\bsitting\b/.test(
      text
    );

    if ((hasPeople && hasWork) || (wordCount >= 4 && hasWork)) {
      return {
        status: "correct",
        score: 1
      };
    }

    if (wordCount >= 3 && (hasPeople || hasWork)) {
      return {
        status: "partial",
        score: 0.5
      };
    }

    return {
      status: "incorrect",
      score: 0
    };
  }

  if (matchesAnyPattern(text, prompt.patterns || [])) {
    return {
      status: "correct",
      score: 1
    };
  }

  return {
    status: "incorrect",
    score: 0
  };
}

function analyzeA0LookAndAnswer(promptResponses) {
  const answeredResponses = promptResponses.filter(function (item) {
    return item.answer;
  });
  const wordCount = answeredResponses.reduce(function (total, item) {
    return total + countWordsInText(item.answer);
  }, 0);
  const promptChecks = promptResponses.map(function (item) {
    return Object.assign({}, item, evaluateA0Prompt(item.promptData, item.answer));
  });
  const savedPromptResponses = promptChecks.map(function (item) {
    return {
      promptId: item.promptId,
      prompt: item.prompt,
      answer: item.answer,
      status: item.status,
      score: item.score,
      exampleAnswer: item.promptData.exampleAnswer || ""
    };
  });
  const correctCount = promptChecks.filter(function (item) {
    return item.status === "correct";
  }).length;
  const partialCount = promptChecks.filter(function (item) {
    return item.status === "partial";
  }).length;
  const answeredCount = answeredResponses.length;
  const coverageScore = correctCount + partialCount * 0.5;
  const score = Math.max(0, Math.min(7, Math.round(coverageScore)));

  if (!answeredCount) {
    return {
      levelCode: "A0",
      analysisMode: "foundation",
      score: 0,
      scoreMax: 7,
      wordCount: 0,
      sentenceCount: 0,
      strengths: [],
      areasToImprove: ["Please answer at least one picture before checking."],
      issues: ["Please answer at least one picture before checking."],
      levelJudgement: "Below level",
      taskResponse: buildTaskResponse(
        "weak",
        "Please answer the picture questions before checking.",
        0
      ),
      spellingFindings: [],
      correctionExamples: [],
      summary: "",
      mainWeakness: "vocabulary",
      improvementTip:
        "Use one word for things, colours, and numbers, then write one short sentence for the last picture.",
      sentenceTypes: null,
      sentenceVarietyComment: "",
      grammarIssueCount: 0,
      vocabularyIssueCount: 0,
      sentenceStructureIssueCount: 0,
      promptResponses: savedPromptResponses,
      originalText: buildA0ResponseSummary(promptResponses)
    };
  }

  const taskResponse =
    answeredCount === promptResponses.length
      ? buildTaskResponse(
          "strong",
          "Task complete: you answered all 7 picture questions.",
          coverageScore
        )
      : answeredCount >= 5
        ? buildTaskResponse(
            "partial",
            "Mostly answered: try to answer every picture.",
            coverageScore
          )
        : buildTaskResponse(
            "weak",
            "Needs more answers: try to answer each picture.",
            coverageScore
          );

  const namedThings = promptChecks.filter(function (item) {
    return (
      (item.promptData.id === "q1-apple" || item.promptData.id === "q2-dog") &&
      item.status === "correct"
    );
  }).length;
  const coloursAndNumbers = promptChecks.filter(function (item) {
    return (
      (item.promptData.id === "q3-blue" || item.promptData.id === "q5-three-apples") &&
      item.status === "correct"
    );
  }).length;
  const actionAnswers = promptChecks.filter(function (item) {
    return (
      (item.promptData.id === "q4-running" ||
        item.promptData.id === "q6-eating" ||
        item.promptData.id === "q7-one-sentence") &&
      (item.status === "correct" || item.status === "partial")
    );
  }).length;

  const strengths = [];
  if (namedThings) {
    strengths.push("You named some everyday things correctly.");
  }
  if (coloursAndNumbers) {
    strengths.push("You used colour or number words.");
  }
  if (actionAnswers) {
    strengths.push("You used action words or a short sentence.");
  }
  if (!strengths.length) {
    strengths.push("You tried to answer with English words.");
  }

  const areasToImprove = [];
  if (!namedThings) {
    areasToImprove.push("Practise naming common things like food, animals, and transport.");
  }
  if (!coloursAndNumbers) {
    areasToImprove.push("Practise colour words and number words.");
  }
  if (!actionAnswers) {
    areasToImprove.push("Practise action words like running and eating, and one short sentence.");
  }
  if (answeredCount < promptResponses.length) {
    areasToImprove.push("Try to answer every picture, even with one word.");
  }

  const correctionExamples = promptChecks
    .filter(function (item) {
      return item.status !== "correct" && item.promptData.exampleAnswer;
    })
    .slice(0, 3)
    .map(function (item) {
      return item.promptData.exampleAnswer;
    });

  const mainWeakness =
    promptChecks.find(function (item) {
      return item.promptData.id === "q7-one-sentence" && item.status !== "correct";
    }) && correctCount >= 3
      ? "sentence structure"
      : "vocabulary";

  const levelJudgement =
    score >= 6 && answeredCount === promptResponses.length
      ? "Above level"
      : score >= 3
        ? "At level"
        : "Below level";

  return {
    levelCode: "A0",
    analysisMode: "foundation",
    score: score,
    scoreMax: 7,
    wordCount: wordCount,
    sentenceCount: answeredCount,
    strengths: limitFeedbackItems(strengths, [
      "You recognised some useful English words.",
      "You tried to answer with simple English."
    ]),
    areasToImprove: limitFeedbackItems(areasToImprove, [
      "Keep practising very common words and simple actions.",
      "Try one short sentence when you can."
    ]),
    issues: areasToImprove,
    levelJudgement: levelJudgement,
    taskResponse: taskResponse,
    spellingFindings: [],
    correctionExamples: correctionExamples,
    summary: "",
    mainWeakness: mainWeakness,
    improvementTip:
      "Use one word for things, colours, and numbers, then write one short sentence for the last picture.",
    sentenceTypes: null,
    sentenceVarietyComment: "",
    grammarIssueCount: 0,
    vocabularyIssueCount: Math.max(0, promptResponses.length - correctCount),
    sentenceStructureIssueCount: mainWeakness === "sentence structure" ? 1 : 0,
    promptResponses: savedPromptResponses,
    originalText: buildA0ResponseSummary(promptResponses)
  };
}

function scoreFoundationWriting(levelCode, issueSummary, wordCount, sentenceCount, taskResponse) {
  let score = 5;
  const sentenceStatus = getSentenceCountStatus(levelCode, sentenceCount);

  if (taskResponse.status === "strong") {
    score += 1;
  } else if (taskResponse.status === "weak") {
    score -= 1;
  }

  if (wordCount >= 8) {
    score += 1;
  }

  if (sentenceCount >= 2) {
    score += 1;
  }

  if (sentenceStatus === "far-below" || sentenceStatus === "far-above") {
    score -= 1;
  }

  if (issueSummary.grammar >= 3) {
    score -= 1;
  }

  if (issueSummary.sentenceStructure >= 2) {
    score -= 1;
  }

  if (issueSummary.vocabulary >= 4) {
    score -= 1;
  }

  return Math.max(1, Math.min(7, score));
}

function scoreA2Writing(issueSummary, wordCount, sentenceCount, taskResponse) {
  let score = 5;
  const sentenceStatus = getSentenceCountStatus("A2", sentenceCount);
  const coreIssueCount = issueSummary.grammar + issueSummary.sentenceStructure;

  if (taskResponse.status === "strong") {
    score += 1;
  } else if (taskResponse.status === "weak") {
    score -= 1;
  }

  if (wordCount >= 18) {
    score += 1;
  }

  if (sentenceCount >= 4) {
    score += 1;
  }

  if (sentenceStatus === "far-below" || sentenceStatus === "far-above") {
    score -= 1;
  }

  if (coreIssueCount >= 3) {
    score -= 1;
  }

  if (coreIssueCount >= 5) {
    score -= 1;
  }

  if (issueSummary.vocabulary >= 4) {
    score -= 1;
  }

  return Math.max(1, Math.min(7, score));
}

function scoreUpperWriting(levelCode, issueSummary, wordCount, sentenceCount, sentenceTypeAnalysis, taskResponse) {
  let score = 6;
  const sentenceTypeCount = getSentenceTypeCount(sentenceTypeAnalysis);
  const sentenceStatus = getSentenceCountStatus(levelCode, sentenceCount);

  if (taskResponse.status === "strong") {
    score += 2;
  } else if (taskResponse.status === "partial") {
    score += 1;
  } else {
    score -= 2;
  }

  if (wordCount >= (levelCode === "B2" ? 40 : 30)) {
    score += 1;
  }

  if (sentenceStatus === "within-range") {
    score += 1;
  } else if (sentenceStatus === "far-below" || sentenceStatus === "far-above") {
    score -= 1;
  }

  if (sentenceCount >= 4) {
    score += 1;
  }

  if (sentenceTypeCount >= 2) {
    score += 1;
  }

  if (levelCode === "B2" && sentenceTypeCount >= 3) {
    score += 1;
  }

  if (issueSummary.sentenceStructure >= 2) {
    score -= 1;
  }

  if (issueSummary.grammar >= 3) {
    score -= 1;
  }

  if (issueSummary.vocabulary >= 4) {
    score -= 1;
  }

  return Math.max(1, Math.min(10, score));
}

function getLevelJudgement(levelCode, score, issueSummary, sentenceCount, sentenceTypeAnalysis, taskResponse) {
  const sentenceStatus = getSentenceCountStatus(levelCode, sentenceCount);
  const sentenceTypeCount = getSentenceTypeCount(sentenceTypeAnalysis);
  const coreIssueCount = issueSummary.grammar + issueSummary.sentenceStructure;

  if (
    taskResponse.status === "weak" ||
    sentenceStatus === "far-below" ||
    score <= (levelCode === "B1" || levelCode === "B2" ? 5 : 3)
  ) {
    return "Below level";
  }

  if (levelCode === "A0") {
    if (score >= 6 && taskResponse.status === "strong" && sentenceCount >= 3) {
      return "Above level";
    }

    return "At level";
  }

  if (levelCode === "A1") {
    if (score >= 6 && taskResponse.status === "strong" && coreIssueCount <= 2) {
      return "Above level";
    }

    return "At level";
  }

  if (levelCode === "A2") {
    if (score >= 6 && taskResponse.status === "strong" && sentenceCount >= 4 && coreIssueCount <= 2) {
      return "Above level";
    }

    return "At level";
  }

  if (levelCode === "B1") {
    if (score >= 8 && taskResponse.status === "strong" && sentenceTypeCount >= 2 && sentenceCount >= 4) {
      return "Above level";
    }

    return "At level";
  }

  if (score >= 8 && taskResponse.status === "strong" && sentenceTypeCount >= 2 && sentenceCount >= 5) {
    return "Above level";
  }

  return "At level";
}

function getMainWeakness(levelCode, issueSummary, sentenceTypeAnalysis, sentenceCount) {
  const weightedSummary = {
    grammar: issueSummary.grammar,
    vocabulary: issueSummary.vocabulary,
    sentenceStructure: issueSummary.sentenceStructure
  };

  if (
    (levelCode === "B1" || levelCode === "B2") &&
    sentenceTypeAnalysis &&
    sentenceCount >= 3
  ) {
    const sentenceTypeCount = ["simple", "compound", "complex"].filter(function (type) {
      return sentenceTypeAnalysis[type] && sentenceTypeAnalysis[type] !== "Not clearly used.";
    }).length;

    if (sentenceTypeCount <= 1) {
      weightedSummary.sentenceStructure += 1;
    }
  }

  if (
    (levelCode === "B1" || levelCode === "B2") &&
    weightedSummary.grammar === 0 &&
    weightedSummary.vocabulary === 0 &&
    weightedSummary.sentenceStructure === 0
  ) {
    return "sentence structure";
  }

  if (
    weightedSummary.sentenceStructure > weightedSummary.grammar &&
    weightedSummary.sentenceStructure >= weightedSummary.vocabulary
  ) {
    return "sentence structure";
  }

  if (
    weightedSummary.vocabulary > weightedSummary.grammar &&
    weightedSummary.vocabulary > weightedSummary.sentenceStructure
  ) {
    return "vocabulary";
  }

  return "grammar";
}

function buildWritingFeedbackHtml(writing, fallbackText) {
  const profile = getWritingLevelProfile(writing.levelCode);
  const scoreText =
    writing.score !== null && writing.score !== undefined && writing.scoreMax
      ? writing.score + "/" + writing.scoreMax
      : "Not scored yet";
  const strengthList = writing.strengths.length
    ? writing.strengths
    : ["Your ideas are easy to understand."];
  const areaList = writing.areasToImprove.length
    ? writing.areasToImprove
    : ["No clear changes are needed right now."];
  const taskResponseComment = writing.taskResponse
    ? writing.taskResponse.comment
    : "The task response is not clear yet.";
  const correctionExamples = writing.correctionExamples && writing.correctionExamples.length
    ? writing.correctionExamples
    : ["No clear correction examples needed."];

  return `
    <div class="feedback-block">
      <strong>Writing score</strong>
      <p>${escapeHtml(scoreText)}</p>
    </div>
    <div class="feedback-block">
      <strong>Level judgement</strong>
      <p>${escapeHtml(writing.levelJudgement || "At level")}</p>
    </div>
    <div class="feedback-block">
      <strong>Task response</strong>
      <p>${escapeHtml(taskResponseComment)}</p>
    </div>
    <div class="feedback-block">
      <strong>What went well</strong>
      <ul>${strengthList
        .map(function (item) {
          return "<li>" + escapeHtml(item) + "</li>";
        })
        .join("")}</ul>
    </div>
    <div class="feedback-block">
      <strong>Areas to improve</strong>
      <ul>${areaList
        .map(function (item) {
          return "<li>" + escapeHtml(item) + "</li>";
        })
        .join("")}</ul>
    </div>
    ${
      profile.showSentenceTypes && writing.sentenceTypes
        ? `
    <div class="feedback-block">
      <strong>Sentence types used</strong>
      <ul>
        <li>Simple: ${escapeHtml(writing.sentenceTypes.simple)}</li>
        <li>Compound: ${escapeHtml(writing.sentenceTypes.compound)}</li>
        <li>Complex: ${escapeHtml(writing.sentenceTypes.complex)}</li>
      </ul>
    </div>
    <div class="feedback-block">
      <strong>Sentence variety comment</strong>
      <p>${escapeHtml(writing.sentenceVarietyComment)}</p>
    </div>
    `
        : ""
    }
    <div class="feedback-block">
      <strong>Main weakness</strong>
      <p>${escapeHtml(writing.mainWeakness)}</p>
    </div>
    <div class="feedback-block">
      <strong>Improvement tip</strong>
      <p>${escapeHtml(writing.improvementTip)}</p>
    </div>
    <div class="feedback-block">
      <strong>Correction examples</strong>
      <ul>${correctionExamples
        .slice(0, 3)
        .map(function (item) {
          return "<li>" + escapeHtml(item) + "</li>";
        })
        .join("")}</ul>
    </div>
  `;
}

function limitFeedbackItems(items, fallbacks) {
  const mergedItems = Array.from(new Set(items.concat(fallbacks))).filter(Boolean);
  return mergedItems.slice(0, 3);
}

function analyzeWriting(text, levelCode) {
  const cleanText = text.trim();
  const profile = getWritingLevelProfile(levelCode);

  if (!cleanText) {
    return {
      levelCode: levelCode,
      analysisMode: profile.analysisMode,
      score: null,
      scoreMax: profile.scoreMax,
      wordCount: 0,
      sentenceCount: 0,
      strengths: [],
      areasToImprove: ["Please write something before checking."],
      issues: ["Please write something before checking."],
      levelJudgement: "Below level",
      taskResponse: buildTaskResponse(
        "weak",
        "Please write something before checking.",
        0
      ),
      mainWeakness: "sentence structure",
      improvementTip: "Write 2 or 3 short full sentences.",
      sentenceTypes: null,
      sentenceVarietyComment: "",
      spellingFindings: [],
      correctionExamples: [],
      grammarIssueCount: 0,
      vocabularyIssueCount: 0,
      sentenceStructureIssueCount: 1
    };
  }

  const wordMatches = cleanText.match(/\b[\w']+\b/g) || [];
  const wordCount = wordMatches.length;
  const sentenceParts = cleanText
    .split(/[.!?]+/)
    .map(function (part) {
      return part.trim();
    })
    .filter(Boolean);
  const sentenceCount = sentenceParts.length;
  const sentenceStartIssue = sentenceParts.some(function (sentence) {
    return sentence && !/^[A-Z]/.test(sentence);
  });
  let sentenceTypeSource = cleanText.replace(/\bi\b/g, "I").replace(/ {2,}/g, " ").trim();
  const exactSpellingCorrections = findSpellingCorrections(cleanText, levelCode);
  const assessmentText = buildAssessmentText(cleanText, levelCode);
  const correctionExamples = buildCorrectionExamples(
    cleanText,
    exactSpellingCorrections.findings
  );
  const issueItems = [];
  let analysisText = cleanText;

  if (sentenceTypeSource && !/[.!?]$/.test(sentenceTypeSource)) {
    sentenceTypeSource += ".";
  }

  if (/\bi\b/.test(cleanText)) {
    pushUniqueIssue(issueItems, 'Write "I" with a capital letter.', "grammar");
    analysisText = analysisText.replace(/\bi\b/g, "I");
  }

  if (/ {2,}/.test(cleanText)) {
    pushUniqueIssue(issueItems, "Remove extra spaces between words.", "sentence structure");
    analysisText = analysisText.replace(/ {2,}/g, " ");
  }

  if (sentenceStartIssue) {
    pushUniqueIssue(issueItems, "Start each sentence with a capital letter.", "grammar");
  }

  if (!/[.!?]$/.test(cleanText)) {
    pushUniqueIssue(
      issueItems,
      "Add a full stop, question mark, or exclamation mark at the end.",
      "grammar"
    );
    analysisText += ".";
  }

  const grammarPatterns = [
    { regex: /\b(He|She|It) go\b/g, message: 'Use "goes" with he, she, or it.', category: "grammar" },
    { regex: /\b(He|She|It) have\b/g, message: 'Use "has" with he, she, or it.', category: "grammar" },
    { regex: /\b(I|You|We|They) is\b/g, message: 'Use "am" or "are" instead of "is" here.', category: "grammar" },
    { regex: /\b(He|She|It) are\b/g, message: 'Use "is" with he, she, or it.', category: "grammar" },
    { regex: /\bdidn't went\b/gi, message: 'After "didn\'t", use the base verb.', category: "grammar" }
  ];

  grammarPatterns.forEach(function (pattern) {
    if (pattern.regex.test(analysisText)) {
      pushUniqueIssue(issueItems, pattern.message, pattern.category);
    }
  });

  analysisText = applySentencePatternCorrections(analysisText, issueItems);

  const sentenceTypeAnalysis = profile.showSentenceTypes
    ? analyzeSentenceTypes(sentenceTypeSource)
    : null;
  const grammarIssueCount = issueItems.filter(function (item) {
    return item.category === "grammar";
  }).length;
  const sentenceStructureIssueCount = issueItems.filter(function (item) {
    return item.category === "sentence structure";
  }).length;
  const vocabularyIssueCount = exactSpellingCorrections.findings.length;
  const issueSummary = {
    grammar: grammarIssueCount,
    vocabulary: vocabularyIssueCount,
    sentenceStructure: sentenceStructureIssueCount
  };
  const taskResponse = evaluateTaskResponse(
    levelCode,
    cleanText,
    assessmentText,
    sentenceCount
  );
  const mainWeakness = getMainWeakness(
    levelCode,
    issueSummary,
    sentenceTypeAnalysis,
    sentenceCount
  );
  const sentenceStatus = getSentenceCountStatus(levelCode, sentenceCount);
  const sentenceTypeCount = getSentenceTypeCount(sentenceTypeAnalysis);

  let strengths = [];
  let areasToImprove = [];
  let score = null;
  let improvementTip = "";

  if (profile.analysisMode === "foundation") {
    if (taskResponse.status !== "weak") {
      strengths.push("Your meaning is clear.");
    }
    if (sentenceCount >= 2) {
      strengths.push("You wrote more than one idea.");
    }
    if (wordCount >= 8) {
      strengths.push("You used enough words to show your ideas.");
    }
    if (!strengths.length) {
      strengths.push("You started to communicate in English.");
    }

    if (taskResponse.status !== "strong") {
      areasToImprove.push(taskResponse.comment);
    }
    if (grammarIssueCount > 0 || sentenceStructureIssueCount > 0) {
      areasToImprove.push("Try to write full sentences with a clear subject and verb.");
    }
    if (!/[.!?]$/.test(cleanText)) {
      areasToImprove.push("Add a full stop at the end.");
    }
    if (!areasToImprove.length) {
      areasToImprove.push("Keep practising simple sentences about familiar topics.");
    }

    improvementTip =
      levelCode === "A0"
        ? "Write short sentences like: My name is..., I am..., I like...."
        : "Say who or what you can see and add one clear action in a short sentence.";
    score = scoreFoundationWriting(levelCode, issueSummary, wordCount, sentenceCount, taskResponse);
  } else if (profile.analysisMode === "guided") {
    if (taskResponse.status === "strong") {
      strengths.push("You answered the picture task and stayed on the scene.");
    }
    if (wordCount >= 8) {
      strengths.push("You wrote enough for the app to check your ideas.");
    }
    if (
      sentenceStatus === "within-range" ||
      sentenceStatus === "slightly-below" ||
      sentenceStatus === "slightly-above"
    ) {
      strengths.push("Your answer is a reasonable length for this task.");
    }
    if (/[.!?]$/.test(cleanText)) {
      strengths.push("You used end punctuation.");
    }
    if (!strengths.length) {
      strengths.push("Your writing shows your main ideas clearly.");
    }

    if (taskResponse.status !== "strong") {
      areasToImprove.push(taskResponse.comment);
    }

    areasToImprove = areasToImprove.concat(issueItems
      .filter(function (item) {
        return item.category === "grammar" || item.category === "sentence structure";
      })
      .map(function (item) {
        return item.message;
      })
      .slice(0, 3));

    if (!areasToImprove.length && vocabularyIssueCount > 0) {
      areasToImprove.push("Check the spelling of a few key words carefully.");
    }

    if (!areasToImprove.length) {
      areasToImprove.push("Keep checking verb forms and sentence endings carefully.");
    }

    improvementTip =
      taskResponse.status !== "strong"
        ? "Describe the people, the place, and the action in separate sentences."
        : mainWeakness === "vocabulary"
          ? "Practise the spellings of key words before you write."
          : mainWeakness === "sentence structure"
            ? "Write full sentences with a clear subject and verb."
            : "Check your verbs and sentence endings before you finish.";
    score = scoreA2Writing(issueSummary, wordCount, sentenceCount, taskResponse);
  } else {
    if (taskResponse.status === "strong") {
      strengths.push("You answered the main task clearly.");
    }
    if (wordCount >= (levelCode === "B2" ? 50 : 35)) {
      strengths.push("You develop your ideas with enough detail.");
    }
    if (sentenceCount >= 3) {
      strengths.push("You organise your writing into a paragraph.");
    }
    if (
      sentenceTypeAnalysis &&
      sentenceTypeCount >= 2
    ) {
      strengths.push("You use more than one sentence type.");
    }
    if (/\b(and|because|but|so|when|if|although|while)\b/i.test(cleanText) && strengths.length < 3) {
      strengths.push("You try to connect your ideas clearly.");
    }
    if (!strengths.length) {
      strengths.push("Your main message is clear.");
    }

    if (taskResponse.status !== "strong") {
      areasToImprove.push(taskResponse.comment);
    }
    if (sentenceStructureIssueCount > 0) {
      areasToImprove.push(
        levelCode === "B2"
          ? "Organise your ideas more smoothly so the paragraph flows better."
          : "Make your ideas flow more clearly by building fuller sentences."
      );
    }
    if (grammarIssueCount > 0) {
      areasToImprove.push("Check verb forms and sentence grammar so the writing stays accurate.");
    }
    if (vocabularyIssueCount > 1) {
      areasToImprove.push("Check a few key words more carefully so your meaning stays precise.");
    }
    if (
      sentenceTypeAnalysis &&
      sentenceTypeCount <= 1 &&
      sentenceCount >= 3
    ) {
      areasToImprove.push("Try a wider mix of sentence types to make the writing more interesting.");
    }

    areasToImprove = areasToImprove.slice(0, 3);

    if (!areasToImprove.length) {
      areasToImprove.push(
        levelCode === "B2"
          ? "Keep refining organisation and detail so the writing sounds even stronger."
          : "Keep developing your ideas so the paragraph feels more complete."
      );
    }

    improvementTip =
      taskResponse.status !== "strong"
        ? levelCode === "B2"
          ? "Compare both sides clearly, then add your opinion with a reason."
          : "Describe the scene first, then explain clearly what is happening."
        : mainWeakness === "sentence structure"
          ? "Plan how each sentence links to the next so the paragraph flows clearly."
          : mainWeakness === "vocabulary"
            ? "Choose and check important words carefully so your meaning stays precise."
            : "Read the paragraph again and check each sentence for clear, accurate grammar.";
    score = scoreUpperWriting(
      levelCode,
      issueSummary,
      wordCount,
      sentenceCount,
      sentenceTypeAnalysis,
      taskResponse
    );
  }

  const levelJudgement = getLevelJudgement(
    levelCode,
    score,
    issueSummary,
    sentenceCount,
    sentenceTypeAnalysis,
    taskResponse
  );
  const finalStrengths = limitFeedbackItems(strengths, [
    "Your meaning is mostly clear.",
    "You tried to answer in your own words.",
    "You used some useful English for this level."
  ]);
  const finalAreas = limitFeedbackItems(areasToImprove, [
    "Add a little more detail to show your level.",
    "Read back your answer before finishing.",
    "Use clear linking words where helpful."
  ]);

  return {
    levelCode: levelCode,
    analysisMode: profile.analysisMode,
    score: score,
    scoreMax: profile.scoreMax,
    wordCount: wordCount,
    sentenceCount: sentenceCount,
    strengths: finalStrengths,
    areasToImprove: finalAreas,
    issues: finalAreas,
    levelJudgement: levelJudgement,
    taskResponse: taskResponse,
    spellingFindings: exactSpellingCorrections.findings,
    correctionExamples: correctionExamples,
    summary: "",
    mainWeakness: mainWeakness,
    improvementTip: improvementTip,
    sentenceTypes: sentenceTypeAnalysis,
    sentenceVarietyComment: sentenceTypeAnalysis ? sentenceTypeAnalysis.comment : "",
    grammarIssueCount: grammarIssueCount,
    vocabularyIssueCount: vocabularyIssueCount,
    sentenceStructureIssueCount: sentenceStructureIssueCount
  };
}

function checkWriting(triggeredByTimer) {
  if (state.writing) {
    return;
  }

  const writingConfig = getWritingPromptConfig();
  const levelCode = LEVELS[state.finalLevelIndex].code;
  let analysis;

  if (levelCode === "A0") {
    const promptResponses = A0_LOOK_AND_ANSWER_PROMPTS.map(function (prompt) {
      return {
        promptId: prompt.id,
        prompt: prompt.prompt,
        answer: (state.a0WritingResponses[prompt.id] || "").trim(),
        promptData: prompt
      };
    });
    analysis = analyzeA0LookAndAnswer(promptResponses);
  } else {
    analysis = analyzeWriting(elements.writingInput.value, levelCode);
  }

  state.writing = Object.assign({}, analysis, {
    originalText:
      levelCode === "A0"
        ? analysis.originalText
        : elements.writingInput.value.trim(),
    promptText:
      levelCode === "A0"
        ? "Look at each picture and answer. You can write one word or a short sentence."
        : writingConfig.writingPrompt || "",
    promptId: levelCode === "A0" ? "a0-look-and-answer" : writingConfig.promptId || "",
    promptImageSrc: levelCode === "A0" ? "" : writingConfig.writingImageSrc || "",
    promptImageAlt: levelCode === "A0" ? "" : writingConfig.writingImageAlt || ""
  });
  state.writtenResponse = state.writing.originalText || "";

  stopWritingTimer();
  if (triggeredByTimer) {
    state.writingTimer.expired = true;
  }
  renderWritingTimer();
  setWritingInputsDisabled(true);
  elements.writingCheckButton.disabled = true;
  elements.writingFeedback.hidden = true;
  elements.writingFeedback.innerHTML = "";
  elements.writingResultsButton.hidden = false;
}

function handleWritingResultsAction() {
  if (typeof state.pendingWritingNextLevelIndex === "number") {
    const nextLevelIndex = state.pendingWritingNextLevelIndex;
    state.pendingWritingNextLevelIndex = null;
    state.writing = null;
    state.currentLevelIndex = nextLevelIndex;
    state.questionIndex = 0;
    state.selectedChoice = null;
    elements.writingFeedback.hidden = true;
    elements.writingFeedback.innerHTML = "";
    elements.writingResultsButton.hidden = true;
    renderQuestion();
    showScreen("question");
    return;
  }

  showResults();
}

function blockWritingTextTransfer(event) {
  event.preventDefault();
}

function blockWritingBeforeInput(event) {
  if (event.inputType === "insertFromPaste" || event.inputType === "insertFromDrop") {
    event.preventDefault();
  }
}

function buildLevelTrack() {
  elements.levelTrack.innerHTML = "";

  LEVELS.forEach(function (level, index) {
    const card = document.createElement("article");
    card.className = "level-card" + (index === state.finalLevelIndex ? " active" : "");
    card.innerHTML = `
      <p class="level-code">${level.code}</p>
      <p class="level-name">${level.name}</p>
      <p class="level-description">${level.summary}</p>
    `;
    elements.levelTrack.appendChild(card);
  });
}

function buildResultInfographic() {
  const currentLevel = LEVELS[state.finalLevelIndex];
  const currentMeta = LEVEL_INFOGRAPHIC_DETAILS[currentLevel.code];

  const flowMarkup = TEST_FLOW_STEPS.map(function (step) {
    return `
      <article class="infographic-process-step">
        <span class="infographic-process-number">${escapeHtml(step.number)}</span>
        <h4>${escapeHtml(step.title)}</h4>
        <p>${escapeHtml(step.text)}</p>
      </article>
    `;
  }).join("");

  const levelMarkup = LEVELS.map(function (level, index) {
    const meta = LEVEL_INFOGRAPHIC_DETAILS[level.code];
    return `
      <article
        class="infographic-level-card${index === state.finalLevelIndex ? " active" : ""}"
        style="--level-accent: ${meta.accent};"
      >
        <div class="infographic-level-top">
          <span class="infographic-round-label">Round ${index + 1}</span>
          <span class="infographic-level-code">${escapeHtml(level.code)}</span>
        </div>
        <h4>${escapeHtml(level.name)}</h4>
        <p class="infographic-band">${escapeHtml(meta.band)}</p>
        <p class="infographic-copy">${escapeHtml(meta.canDo)}</p>
        <p class="infographic-focus">
          <strong>Focus:</strong> ${escapeHtml(meta.focus)}
        </p>
      </article>
    `;
  }).join("");

  elements.resultInfographic.innerHTML = `
    <div class="infographic-intro">
      <p class="question-kicker">Placement Guide</p>
      <p class="infographic-lead">
        This guide matches the way our placement test works for adult learners.
        The highlighted step shows the best-fit level from this attempt:
        <strong>${escapeHtml(currentLevel.code)} ${escapeHtml(currentLevel.name)}</strong>.
      </p>
    </div>

    <div class="infographic-process">
      ${flowMarkup}
    </div>

    <div class="infographic-current-card">
      <p class="infographic-current-label">Best-fit level from this test</p>
      <div class="infographic-current-main">
        <span
          class="infographic-current-code"
          style="--level-accent: ${currentMeta.accent};"
        >
          ${escapeHtml(currentLevel.code)}
        </span>
        <div>
          <strong>${escapeHtml(currentLevel.name)}</strong>
          <p>${escapeHtml(currentMeta.canDo)}</p>
        </div>
      </div>
    </div>

    <div class="infographic-level-grid">
      ${levelMarkup}
    </div>

    <p class="infographic-note">
      A0 is our Hunky Dory starter step before A1. This infographic explains our
      own placement test and is not a direct IELTS or Cambridge exam conversion.
    </p>
  `;
}

function buildRoundSummary() {
  const overview = getAssessmentOverview();

  elements.roundSummary.innerHTML = "";

  state.roundScores.forEach(function (round, index) {
    const attemptStats = getRoundAttemptStats(round);
    const placementScore =
      typeof round.placementScore === "number" ? round.placementScore : round.correct;
    const placementTotal =
      typeof round.placementTotal === "number" ? round.placementTotal : round.total;
    const isFailedRound =
      overview.failedRound && overview.failedRound.roundIndex === index;
    const statusClass = isFailedRound ? "status-stop" : "status-pass";
    let statusText = "Final matched level";

    if (round.advanced) {
      statusText = "Moved to the next level";
    } else if (isFailedRound) {
      statusText = "Assessment stopped here";
    }

    const item = document.createElement("article");
    item.className = "round-result";
    item.innerHTML = `
      <strong>${round.levelCode} ${round.levelName}</strong>
      <p>Score for this level: ${attemptStats.attemptedCorrect} / ${attemptStats.attemptedTotal} (${attemptStats.attemptedPercentage}%)</p>
      <p>Grammar and vocabulary: ${round.grammarCorrect} / ${round.grammarTotal}</p>
      <p>Reading: ${round.readingCorrect} / ${round.readingTotal}</p>
      <p>Placement score: ${placementScore} / ${placementTotal}</p>
      <p>${round.dontKnowCount} "I don't know" choices</p>
      <p class="${statusClass}">
        ${statusText}
      </p>
    `;
    elements.roundSummary.appendChild(item);
  });
}

function buildScoreChart(totalCorrect) {
  const readingQuestionCount = state.readingResults.reduce(function (total, readingResult) {
    return total + readingResult.total;
  }, 0);
  const totalQuestions = state.responses.length + readingQuestionCount;
  const dontKnowCount = state.responses.filter(function (response) {
    return response.isDontKnow;
  }).length;
  const incorrectCount = Math.max(0, totalQuestions - totalCorrect - dontKnowCount);
  const safeTotal = Math.max(totalQuestions, 1);
  const correctDegrees = (totalCorrect / safeTotal) * 360;
  const incorrectDegrees = (incorrectCount / safeTotal) * 360;
  const correctEnd = correctDegrees;
  const incorrectEnd = correctEnd + incorrectDegrees;
  const correctPercent = Math.round((totalCorrect / safeTotal) * 100);

  elements.scoreChart.innerHTML = `
    <div class="score-chart-layout">
      <div
        class="pie-chart"
        style="--pie-fill: conic-gradient(
          #1f6b49 0deg ${correctEnd}deg,
          #d45757 ${correctEnd}deg ${incorrectEnd}deg,
          #9aa8ae ${incorrectEnd}deg 360deg
        );"
      >
        <div class="pie-chart-center">
          <strong>${correctPercent}%</strong>
          <span>correct</span>
        </div>
      </div>
      <div class="score-legend">
        <div class="score-legend-item">
          <span class="legend-dot legend-correct"></span>
          <span>Correct answers: ${totalCorrect}</span>
        </div>
        <div class="score-legend-item">
          <span class="legend-dot legend-incorrect"></span>
          <span>Incorrect answers: ${incorrectCount}</span>
        </div>
        <div class="score-legend-item">
          <span class="legend-dot legend-dont-know"></span>
          <span>I don't know: ${dontKnowCount}</span>
        </div>
      </div>
    </div>
  `;
}

function buildWritingSummary() {
  elements.writingSummary.innerHTML = "";

  if (!state.writing) {
    elements.writingSummary.innerHTML =
      '<p class="result-detail">No writing sample was submitted.</p>';
    return;
  }
  elements.writingSummary.innerHTML = buildWritingFeedbackHtml(
    state.writing,
    state.writing.originalText
  );
}

function getLevelLabel(levelCode, levelName) {
  return levelCode + " " + levelName;
}

function getRoundAttemptStats(round) {
  const attemptedCorrect =
    typeof round.attemptedCorrect === "number"
      ? round.attemptedCorrect
      : round.grammarCorrect + round.readingCorrect;
  const attemptedTotal =
    typeof round.attemptedTotal === "number"
      ? round.attemptedTotal
      : round.grammarTotal + round.readingTotal;

  return {
    attemptedCorrect: attemptedCorrect,
    attemptedTotal: attemptedTotal,
    attemptedPercentage: attemptedTotal
      ? Math.round((attemptedCorrect / attemptedTotal) * 100)
      : 0
  };
}

function getAssessmentOverview() {
  const attemptedRounds = state.roundScores.map(function (round, index) {
    const placementScore =
      typeof round.placementScore === "number" ? round.placementScore : round.correct;
    const placementTotal =
      typeof round.placementTotal === "number" ? round.placementTotal : round.total;

    return Object.assign(
      {
        roundIndex: index,
        placementScore: placementScore,
        placementTotal: placementTotal,
        passedCurrentLevel: placementScore >= 5,
        failedCurrentLevel: placementScore < 5
      },
      round,
      getRoundAttemptStats(round)
    );
  });
  const lastAttemptedRound = attemptedRounds.length
    ? attemptedRounds[attemptedRounds.length - 1]
    : null;
  let lastPassedRound = null;
  attemptedRounds.forEach(function (round) {
    if (round.passedCurrentLevel) {
      lastPassedRound = round;
    }
  });
  const failedRound =
    lastAttemptedRound && lastAttemptedRound.failedCurrentLevel ? lastAttemptedRound : null;

  const totalCorrect = attemptedRounds.reduce(function (total, round) {
    return total + round.attemptedCorrect;
  }, 0);
  const totalAttempted = attemptedRounds.reduce(function (total, round) {
    return total + round.attemptedTotal;
  }, 0);

  return {
    attemptedRounds: attemptedRounds,
    lastPassedRound: lastPassedRound,
    failedRound: failedRound,
    totalCorrect: totalCorrect,
    totalAttempted: totalAttempted,
    cumulativePercentage: totalAttempted
      ? Math.round((totalCorrect / totalAttempted) * 100)
      : 0
  };
}

function buildAssessmentSummary() {
  const overview = getAssessmentOverview();
  const lastPassedText = overview.lastPassedRound
    ? getLevelLabel(
        overview.lastPassedRound.levelCode,
        overview.lastPassedRound.levelName
      )
    : "No level passed yet";
  const failedText = overview.failedRound
    ? getLevelLabel(overview.failedRound.levelCode, overview.failedRound.levelName)
    : "None";
  const levelScoreMarkup = overview.attemptedRounds
    .map(function (round) {
      const roundStatus = round.failedCurrentLevel ? "Failed" : "Passed";

      return `
        <li>
          <span class="assessment-level-name">
            ${escapeHtml(getLevelLabel(round.levelCode, round.levelName))} · ${roundStatus}
          </span>
          <span class="assessment-level-score">
            ${round.attemptedCorrect} / ${round.attemptedTotal} (${round.attemptedPercentage}%)
          </span>
        </li>
      `;
    })
    .join("");

  elements.assessmentSummary.innerHTML = `
    <div class="assessment-summary-grid">
      <div class="assessment-summary-item">
        <p class="assessment-summary-label">Last level passed</p>
        <p class="assessment-summary-value">${escapeHtml(lastPassedText)}</p>
      </div>
      <div class="assessment-summary-item">
        <p class="assessment-summary-label">Level failed</p>
        <p class="assessment-summary-value">${escapeHtml(failedText)}</p>
      </div>
      <div class="assessment-summary-item">
        <p class="assessment-summary-label">Cumulative percentage</p>
        <p class="assessment-summary-value">${overview.cumulativePercentage}%</p>
      </div>
    </div>
    <div class="assessment-level-list">
      <p class="assessment-summary-label">Score per level</p>
      <ul>${levelScoreMarkup}</ul>
    </div>
  `;
}

function buildReviewList() {
  elements.reviewList.innerHTML = "";

  state.responses.forEach(function (response, index) {
    const answerText = response.isDontKnow
      ? IDK_TEXT
      : response.choices[response.selected];
    const correctText = response.choices[response.answer];
    const isCorrect = response.correct;
    const statusLabel = isCorrect ? "Correct" : "Incorrect";
    const statusClass = isCorrect ? "correct" : "incorrect";
    const yourAnswerIcon = isCorrect ? "✓" : "✕";
    const item = document.createElement("article");
    item.className = "review-item review-" + statusClass;
    item.innerHTML = `
      <div class="review-header">
        <strong>Q${index + 1} · ${response.levelCode} ${response.levelName}</strong>
        <span class="review-status review-status-${statusClass}">
          <span class="review-icon review-icon-${statusClass}">${yourAnswerIcon}</span>
          ${statusLabel}
        </span>
      </div>
      <p>${escapeHtml(response.prompt)}</p>
      <ul class="review-points">
        <li class="review-line">
          <span class="review-mark review-mark-${statusClass}">${yourAnswerIcon}</span>
          <span>Your answer: ${escapeHtml(answerText)}</span>
        </li>
        <li class="review-line">
          <span class="review-mark review-mark-correct">✓</span>
          <span>Correct answer: ${escapeHtml(correctText)}</span>
        </li>
        <li class="review-note">${escapeHtml(response.explanation)}</li>
      </ul>
    `;
    elements.reviewList.appendChild(item);
  });

  state.readingResults.forEach(function (readingResult, readingIndex) {
    readingResult.answers.forEach(function (answer) {
      const statusLabel = answer.correct ? "Correct" : "Incorrect";
      const statusClass = answer.correct ? "correct" : "incorrect";
      const yourAnswerIcon = answer.correct ? "✓" : "✕";
      const item = document.createElement("article");
      item.className = "review-item review-" + statusClass;
      item.innerHTML = `
        <div class="review-header">
          <strong>Reading ${readingIndex + 1}.${answer.questionNumber} · ${readingResult.levelCode} ${readingResult.levelName}</strong>
          <span class="review-status review-status-${statusClass}">
            <span class="review-icon review-icon-${statusClass}">${yourAnswerIcon}</span>
            ${statusLabel}
          </span>
        </div>
        <p>${escapeHtml(answer.prompt)}</p>
        <ul class="review-points">
          <li class="review-line">
            <span class="review-mark review-mark-${statusClass}">${yourAnswerIcon}</span>
            <span>Your answer: ${escapeHtml(answer.selectedAnswer)}</span>
          </li>
          <li class="review-line">
            <span class="review-mark review-mark-correct">✓</span>
            <span>Correct answer: ${escapeHtml(answer.correctAnswer)}</span>
          </li>
          <li class="review-note">${escapeHtml(answer.explanation)}</li>
        </ul>
      `;
      elements.reviewList.appendChild(item);
    });
  });
}

function buildStudentSummary() {
  const emailText = state.student.email
    ? "Email: " + state.student.email
    : "Email: not provided";

  elements.studentSummary.innerHTML =
    "<strong>Learner record</strong><br />" +
    escapeHtml(state.student.name) +
    " · Age " +
    escapeHtml(state.student.age) +
    " · " +
    escapeHtml(state.student.currentSituation) +
    "<br />" +
    escapeHtml(emailText);
}

function getPendingSubmissions() {
  try {
    const raw = localStorage.getItem(PENDING_SUBMISSIONS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function savePendingSubmissions(items) {
  localStorage.setItem(PENDING_SUBMISSIONS_KEY, JSON.stringify(items));
}

function mergeSubmissionQueue(items) {
  const recordMap = new Map();

  items.forEach(function (item) {
    if (item && item.attemptId) {
      recordMap.set(item.attemptId, item);
    }
  });

  return Array.from(recordMap.values());
}

function queuePendingSubmission(payload) {
  const merged = mergeSubmissionQueue(getPendingSubmissions().concat(payload));
  savePendingSubmissions(merged);
}

function clearPendingSubmissions() {
  localStorage.removeItem(PENDING_SUBMISSIONS_KEY);
}

function getWritingForMarking() {
  const liveWritingText = elements.writingInput ? elements.writingInput.value.trim() : "";

  return (
    state.writtenResponse ||
    liveWritingText ||
    (state.writing && state.writing.originalText) ||
    ""
  );
}

function buildSubmissionPayload() {
  const level = LEVELS[state.finalLevelIndex];
  const overview = getAssessmentOverview();
  const writingForMarking = getWritingForMarking();
  const grammarCorrect = state.responses.filter(function (response) {
    return response.correct;
  }).length;
  const readingCorrect = state.readingResults.reduce(function (total, readingResult) {
    return total + readingResult.correct;
  }, 0);
  const readingQuestions = state.readingResults.reduce(function (total, readingResult) {
    return total + readingResult.total;
  }, 0);

  return {
    attemptId: state.attemptId,
    submittedAt: new Date().toISOString(),
    learnerName: state.student.name,
    learnerAge: state.student.age,
    age: state.student.age,
    currentSituation: state.student.currentSituation,
    email: state.student.email,
    selfRating: state.selfRating,
    cefrLevel: level.code,
    bestLevel: level.code,
    finalLevelCode: level.code,
    finalLevelName: level.name,
    suggestedClassLevel: level.code,
    finalLevelSummary: level.summary,
    finalLevelDetail: level.detail,
    finalNote: state.finalNote,
    totalCorrect: overview.totalCorrect,
    totalQuestions: overview.totalAttempted,
    cumulativePercentage: overview.cumulativePercentage,
    cumulativePercent: overview.cumulativePercentage + "%",
    lastLevelPassedCode: overview.lastPassedRound ? overview.lastPassedRound.levelCode : "",
    lastLevelPassedName: overview.lastPassedRound ? overview.lastPassedRound.levelName : "",
    lastPassed: overview.lastPassedRound ? overview.lastPassedRound.levelCode : "",
    failedLevelCode: overview.failedRound ? overview.failedRound.levelCode : "",
    failedLevelName: overview.failedRound ? overview.failedRound.levelName : "",
    levelFailed: overview.failedRound ? overview.failedRound.levelCode : "",
    grammarCorrect: grammarCorrect,
    grammarQuestions: state.responses.length,
    readingCorrect: readingCorrect,
    readingQuestions: readingQuestions,
    writingScore: state.writing ? state.writing.score : 0,
    writingScoreMax: state.writing ? state.writing.scoreMax : 0,
    writingForMarking: writingForMarking,
    roundsCompleted: state.roundScores.length,
    roundScores: state.roundScores.map(function (round) {
      const attemptStats = getRoundAttemptStats(round);

      return Object.assign({}, round, {
        correct: attemptStats.attemptedCorrect,
        total: attemptStats.attemptedTotal
      });
    }),
    readingResults: state.readingResults,
    answers: state.responses.map(function (response) {
      return {
        levelCode: response.levelCode,
        levelName: response.levelName,
        questionNumber: response.questionNumber,
        prompt: response.prompt,
        selectedAnswer: response.isDontKnow
          ? IDK_TEXT
          : response.choices[response.selected],
        correctAnswer: response.choices[response.answer],
        correct: response.correct,
        explanation: response.explanation
      };
    })
  };
}

async function submitResults(data) {
  const submissionUrls = RESULTS_SUBMISSION_URLS.slice();

  if (GOOGLE_SCRIPT_URL && submissionUrls.indexOf(GOOGLE_SCRIPT_URL) === -1) {
    submissionUrls.push(GOOGLE_SCRIPT_URL);
  }

  let lastError = null;

  for (let index = 0; index < submissionUrls.length; index += 1) {
    const submissionUrl = submissionUrls[index];
    const isSameOriginRelay = submissionUrl.indexOf("/") === 0;

    try {
      const response = await fetch(submissionUrl, {
        method: "POST",
        mode: isSameOriginRelay ? "same-origin" : "cors",
        redirect: "follow",
        headers: {
          "Content-Type": isSameOriginRelay
            ? "application/json"
            : "text/plain;charset=utf-8"
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error("Google Sheets returned HTTP " + response.status + ".");
      }

      const rawText = await response.text();
      let result = null;

      try {
        result = rawText ? JSON.parse(rawText) : null;
      } catch (parseError) {
        result = null;
      }

      if (!result || (result.status !== "success" && result.ok !== true)) {
        throw new Error(
          result && result.message
            ? result.message
            : "Google Sheets did not confirm that the result was saved."
        );
      }

      return result;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Submission failed.");
}

async function syncSubmissionToGoogleSheets() {
  if (state.submission.status === "pending" || state.submission.status === "sent") {
    return;
  }

  const currentPayload = buildSubmissionPayload();

  if (!GOOGLE_SCRIPT_URL) {
    queuePendingSubmission(currentPayload);
    setSubmissionStatus(
      "local",
      GOOGLE_SHEET_URL
        ? "The spreadsheet reference is saved, but the Apps Script web app URL is still missing, so this result has been saved in the browser for now."
        : "Google Sheets is not connected yet, so this result has been saved in the browser until a web app URL is added in config.js."
    );
    return;
  }

  const queue = mergeSubmissionQueue(getPendingSubmissions().concat(currentPayload));
  setSubmissionStatus("pending", "Sending this result to Google Sheets...");

  try {
    for (let index = 0; index < queue.length; index += 1) {
      await submitResults(queue[index]);
    }

    clearPendingSubmissions();
    setSubmissionStatus("sent", "Result saved to Google Sheets.");
  } catch (error) {
    savePendingSubmissions(queue);
    setSubmissionStatus(
      "failed",
      "Google Sheets did not confirm this result" +
        (error && error.message ? ": " + error.message : ".") +
        " It has been saved in the browser to send later."
    );
  }
}

function handleFinishTest() {
  stopWritingTimer();
  showScreen("completed");
}

function showResults() {
  stopWritingTimer();
  showScreen("completed");
  void syncSubmissionToGoogleSheets();
}

function resetState() {
  stopWritingTimer();
  state.attemptId = createAttemptId();
  state.student = createEmptyStudent();
  state.selfRating = null;
  state.currentLevelIndex = 0;
  state.questionIndex = 0;
  state.selectedChoice = null;
  state.isQuestionTransitioning = false;
  state.readingSelections = {};
  state.readingResults = [];
  state.responses = [];
  state.roundScores = [];
  state.pendingAction = null;
  state.pendingWritingNextLevelIndex = null;
  state.finalLevelIndex = 0;
  state.finalNote = "";
  state.a0WritingResponses = {};
  state.selectedWritingPrompt = null;
  state.writing = null;
  state.writtenResponse = "";
  state.writingTimer = {
    remainingSeconds: WRITING_TIME_LIMIT_SECONDS,
    intervalId: null,
    expired: false
  };
  state.submission = {
    status: "idle",
    message: GOOGLE_SCRIPT_URL
      ? "Completed tests will be sent to Google Sheets."
      : GOOGLE_SHEET_URL
        ? "Spreadsheet selected. Add the Apps Script web app URL to start live sending."
        : "Google Sheets is not connected yet."
  };

  elements.writingInput.value = "";
  setWritingInputsDisabled(false);
  elements.writingCheckButton.disabled = false;
  elements.writingFeedback.hidden = true;
  elements.writingFeedback.innerHTML = "";
  elements.writingResultsButton.hidden = true;
  renderWritingTimer();
  elements.readingSubmitButton.disabled = false;
  setReadingMessage("");
  elements.questionShell.classList.remove("is-fading-out", "is-fading-in");
  setRegistrationMessage("");
  renderRegistrationForm();
  renderSubmissionStatus();

}

elements.startTestButton.addEventListener("click", function () {
  renderRegistrationForm();
  setRegistrationMessage("");
  showScreen("registration");
});

elements.registrationForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const validation = validateStudentDetails();

  if (!validation.valid) {
    setRegistrationMessage(validation.message);
    return;
  }

  state.student = validation.details;
  setRegistrationMessage("");
  showScreen("welcome");
});

elements.welcomeNextButton.addEventListener("click", function () {
  beginFirstRoundFlow();
});

elements.transitionContinueButton.addEventListener("click", function () {
  if (typeof state.pendingAction === "function") {
    const action = state.pendingAction;
    state.pendingAction = null;
    action();
  }
});

elements.writingCheckButton.addEventListener("click", checkWriting);
elements.writingResultsButton.addEventListener("click", handleWritingResultsAction);
elements.writingInput.addEventListener("input", function () {
  state.writtenResponse = elements.writingInput.value.trim();
});
elements.readingSubmitButton.addEventListener("click", submitReading);
elements.finishTestButton.addEventListener("click", handleFinishTest);
attachWritingInputGuards(elements.writingInput);

updateSheetConfigNote();
populateAdultSituations();
resetState();
showScreen("landing");
