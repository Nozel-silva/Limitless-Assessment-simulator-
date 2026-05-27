const QUESTION_BANK = [

  // ── MATHEMATICS (15) ──
  {
    id: 1,
    question: "A train travels 240km in 3 hours. What is its average speed?",
    options: ["60 km/h", "80 km/h", "90 km/h", "100 km/h"],
    answer: 1
  },
  {
    id: 2,
    question: "If 4x + 8 = 32, what is x?",
    options: ["4", "5", "6", "7"],
    answer: 2
  },
  {
    id: 3,
    question: "What is 35% of 400?",
    options: ["120", "130", "140", "150"],
    answer: 2
  },
  {
    id: 4,
    question: "A rectangle has a length of 12cm and width of 7cm. What is its perimeter?",
    options: ["36cm", "38cm", "40cm", "42cm"],
    answer: 1
  },
  {
    id: 5,
    question: "What comes next in the sequence: 3, 6, 12, 24, ___?",
    options: ["36", "42", "48", "54"],
    answer: 2
  },
  {
    id: 6,
    question: "A worker earns ₦18,000 per week. How much does he earn in 4 weeks?",
    options: ["₦62,000", "₦68,000", "₦72,000", "₦76,000"],
    answer: 2
  },
  {
    id: 7,
    question: "Simplify: 5/6 + 1/3",
    options: ["6/9", "7/6", "1/2", "9/6"],
    answer: 1
  },
  {
    id: 8,
    question: "What is the square root of 225?",
    options: ["13", "14", "15", "16"],
    answer: 2
  },
  {
    id: 9,
    question: "If 5 bags of rice cost ₦12,500, how much do 8 bags cost?",
    options: ["₦18,000", "₦19,000", "₦20,000", "₦21,000"],
    answer: 2
  },
  {
    id: 10,
    question: "A tank is 40% full. After adding 300 litres it is 70% full. What is the tank's total capacity?",
    options: ["800L", "900L", "1000L", "1100L"],
    answer: 2
  },
  {
    id: 11,
    question: "What is the LCM of 6, 8 and 12?",
    options: ["18", "20", "24", "36"],
    answer: 2
  },
  {
    id: 12,
    question: "Evaluate: 6 + 4 × 3 - 10 ÷ 2",
    options: ["11", "13", "15", "17"],
    answer: 1
  },
  {
    id: 13,
    question: "The ratio of men to women in an office is 3:5. If there are 40 staff in total, how many are women?",
    options: ["15", "20", "25", "30"],
    answer: 2
  },
  {
    id: 14,
    question: "Simple interest on ₦50,000 at 8% per annum for 3 years is?",
    options: ["₦10,000", "₦11,000", "₦12,000", "₦13,000"],
    answer: 2
  },
  {
    id: 15,
    question: "If f(x) = 3x² - 2x + 1, what is f(3)?",
    options: ["20", "22", "24", "26"],
    answer: 1
  },

  // ── FILL IN THE GAP — ENGLISH (10) ──
  {
    id: 16,
    question: "The manager was ___ about the new policy and refused to comment publicly.",
    options: ["verbose", "evasive", "candid", "articulate"],
    answer: 1
  },
  {
    id: 17,
    question: "Despite the challenges, the team remained ___ and delivered the project on time.",
    options: ["reluctant", "indifferent", "resilient", "hesitant"],
    answer: 2
  },
  {
    id: 18,
    question: "The new employee showed great ___ by arriving early and staying late every day.",
    options: ["arrogance", "initiative", "complacency", "negligence"],
    answer: 1
  },
  {
    id: 19,
    question: "His ___ behaviour in meetings made it difficult for others to share their ideas.",
    options: ["passive", "supportive", "domineering", "courteous"],
    answer: 2
  },
  {
    id: 20,
    question: "The report was ___ and covered every aspect of the project in great detail.",
    options: ["vague", "brief", "comprehensive", "ambiguous"],
    answer: 2
  },
  {
    id: 21,
    question: "She was known for her ___ communication style, always saying exactly what she meant.",
    options: ["indirect", "direct", "confusing", "passive"],
    answer: 1
  },
  {
    id: 22,
    question: "The board made a ___ decision after reviewing all available evidence.",
    options: ["hasty", "reckless", "deliberate", "careless"],
    answer: 2
  },
  {
    id: 23,
    question: "The CEO's ___ vision for the company inspired every member of the team.",
    options: ["blurry", "compelling", "irrelevant", "outdated"],
    answer: 1
  },
  {
    id: 24,
    question: "Employees are expected to ___ to the company's code of conduct at all times.",
    options: ["object", "adhere", "oppose", "ignore"],
    answer: 1
  },
  {
    id: 25,
    question: "The team leader ___ responsibilities evenly among all members of the group.",
    options: ["hoarded", "avoided", "distributed", "concealed"],
    answer: 2
  },

  // ── OPPOSITE IN MEANING (2) ──
  {
    id: 26,
    question: "Choose the word most OPPOSITE in meaning to: DILIGENT",
    options: ["Hardworking", "Careful", "Lazy", "Focused"],
    answer: 2
  },
  {
    id: 27,
    question: "Choose the word most OPPOSITE in meaning to: TRANSPARENT",
    options: ["Clear", "Open", "Secretive", "Honest"],
    answer: 2
  },

  // ── NEAREST IN MEANING (3) ──
  {
    id: 28,
    question: "Choose the word closest in meaning to: METICULOUS",
    options: ["Careless", "Thorough", "Rushed", "Vague"],
    answer: 1
  },
  {
    id: 29,
    question: "Choose the word closest in meaning to: CANDID",
    options: ["Dishonest", "Secretive", "Frank", "Reserved"],
    answer: 2
  },
  {
    id: 30,
    question: "Choose the word closest in meaning to: TENACIOUS",
    options: ["Weak", "Persistent", "Indifferent", "Fragile"],
    answer: 1
  },

  // ── DEDUCTIVE REASONING / COMPREHENSION (10) ──
  {
    id: 31,
    question: "Read the following: 'All managers at Zenith Bank must complete a compliance training every quarter. James is a manager at Zenith Bank.' What can be logically concluded?",
    options: [
      "James may or may not complete the training",
      "James must complete the compliance training every quarter",
      "James only completes training once a year",
      "James is exempt from training"
    ],
    answer: 1
  },
  {
    id: 32,
    question: "Read the following: 'No employee who has been on probation in the last 6 months is eligible for promotion. Sandra was on probation 4 months ago.' What is true?",
    options: [
      "Sandra is eligible for promotion",
      "Sandra may be considered for promotion",
      "Sandra is not eligible for promotion",
      "Sandra's eligibility depends on her manager"
    ],
    answer: 2
  },
  {
    id: 33,
    question: "A company policy states: 'Employees who exceed their sales target by 20% or more receive a bonus.' Tunde exceeded his target by 25%. What follows?",
    options: [
      "Tunde does not qualify for a bonus",
      "Tunde qualifies for a bonus",
      "Tunde may qualify depending on his manager",
      "Tunde qualifies only if approved by HR"
    ],
    answer: 1
  },
  {
    id: 34,
    question: "Read this: 'Only staff with Level 3 clearance can access the server room. Bola does not have Level 3 clearance.' What can be concluded?",
    options: [
      "Bola can access the server room with permission",
      "Bola can access the server room on weekends",
      "Bola cannot access the server room",
      "Bola's access depends on her department"
    ],
    answer: 2
  },
  {
    id: 35,
    question: "Passage: 'Customer satisfaction scores dropped by 18% in Q3. Analysis shows that response time to complaints increased from 24 hours to 72 hours during the same period.' What is the most logical conclusion?",
    options: [
      "The drop in satisfaction is unrelated to response time",
      "Slower complaint response likely contributed to lower satisfaction scores",
      "Customers became more demanding in Q3",
      "The company's products worsened in Q3"
    ],
    answer: 1
  },
  {
    id: 36,
    question: "Read this: 'All projects submitted after the deadline will be disqualified. Chidi submitted his project two days before the deadline.' What is true?",
    options: [
      "Chidi's project will be disqualified",
      "Chidi's project will not be disqualified",
      "Chidi's project may be reviewed at the panel's discretion",
      "Chidi needs to resubmit his project"
    ],
    answer: 1
  },
  {
    id: 37,
    question: "Passage: 'A bank noticed that branches with more than 5 tellers had shorter customer wait times. Branch A has 3 tellers and Branch B has 7 tellers.' What can be inferred?",
    options: [
      "Branch A likely has shorter wait times than Branch B",
      "Branch B likely has shorter wait times than Branch A",
      "Both branches have equal wait times",
      "The number of tellers has no effect on wait time"
    ],
    answer: 1
  },
  {
    id: 38,
    question: "Read this: 'Employees who arrive late three times in a month receive a warning. Kemi arrived late on the 5th, 12th and 20th of this month.' What follows?",
    options: [
      "Kemi will receive a bonus",
      "Kemi will receive a warning",
      "Kemi will be dismissed",
      "Nothing will happen to Kemi"
    ],
    answer: 1
  },
  {
    id: 39,
    question: "Passage: 'Studies show that teams that hold weekly review meetings are 30% more productive than those that do not. Company X does not hold weekly review meetings.' What is a reasonable conclusion?",
    options: [
      "Company X is definitely unproductive",
      "Company X may be missing an opportunity to improve productivity",
      "Company X's productivity is unaffected",
      "Company X will close down soon"
    ],
    answer: 1
  },
  {
    id: 40,
    question: "Read this: 'The finance department requires two signatories for any payment above ₦500,000. A payment of ₦750,000 was processed with only one signatory.' What is true?",
    options: [
      "The payment was processed correctly",
      "The payment violated the finance department's policy",
      "The payment is valid since it was approved",
      "The payment requires no further review"
    ],
    answer: 1
  },

  // ── INDUSTRY VALUES / WORKPLACE SCENARIOS (10) ──
  {
    id: 41,
    question: "You discover that a colleague has been falsifying expense reports. What is the most appropriate action?",
    options: [
      "Ignore it — it's not your business",
      "Confront your colleague aggressively in front of others",
      "Report it through the appropriate internal channel such as your line manager or compliance team",
      "Tell other colleagues about it informally"
    ],
    answer: 2
  },
  {
    id: 42,
    question: "A client offers you a personal gift worth ₦50,000 after a successful deal. Your company has a no-gift policy. What do you do?",
    options: [
      "Accept it since you personally earned it",
      "Accept it and tell no one",
      "Politely decline and explain your company's policy",
      "Accept it and declare it later"
    ],
    answer: 2
  },
  {
    id: 43,
    question: "You are given a deadline you genuinely cannot meet due to workload. What is the best approach?",
    options: [
      "Say nothing and deliver poor quality work on time",
      "Miss the deadline without informing anyone",
      "Communicate early with your manager about the constraint and propose a realistic timeline",
      "Ask a colleague to do the work for you without telling your manager"
    ],
    answer: 2
  },
  {
    id: 44,
    question: "During a team meeting your idea is dismissed without discussion. How should you respond?",
    options: [
      "Storm out of the meeting in protest",
      "Calmly request an opportunity to elaborate on your idea",
      "Refuse to contribute to future meetings",
      "Complain to HR immediately"
    ],
    answer: 1
  },
  {
    id: 45,
    question: "You notice a process in your department that is inefficient and wasting time. What should you do?",
    options: [
      "Complain to your colleagues but take no action",
      "Ignore it since it is not officially your responsibility",
      "Document the issue and propose an improvement to your manager",
      "Change the process yourself without informing anyone"
    ],
    answer: 2
  },
  {
    id: 46,
    question: "A customer is verbally abusive toward you during a service interaction. What is the best response?",
    options: [
      "Respond with equal aggression",
      "Hang up or walk away without explanation",
      "Remain calm, acknowledge the customer's frustration, and attempt to resolve the issue professionally",
      "Transfer the call immediately without explanation"
    ],
    answer: 2
  },
  {
    id: 47,
    question: "You are asked to sign off on a report you have not fully reviewed. What should you do?",
    options: [
      "Sign it to avoid holding up the process",
      "Sign it and review it afterward",
      "Request adequate time to review the report before signing",
      "Ask a junior colleague to review it for you"
    ],
    answer: 2
  },
  {
    id: 48,
    question: "Your manager gives you feedback that you disagree with. What is the most professional response?",
    options: [
      "Dismiss the feedback and continue as before",
      "Argue with your manager in front of the team",
      "Listen carefully, acknowledge the feedback, and respectfully share your perspective in private",
      "Complain about your manager to other colleagues"
    ],
    answer: 2
  },
  {
    id: 49,
    question: "You are working on a confidential client project and a friend asks you about the details. What do you do?",
    options: [
      "Share the details since your friend is trustworthy",
      "Share general information but not specifics",
      "Decline to share any information and explain that it is confidential",
      "Share the details only if your friend promises not to tell anyone"
    ],
    answer: 2
  },
  {
    id: 50,
    question: "You make a significant error that affects a client's account. What is the right course of action?",
    options: [
      "Hope the error goes unnoticed",
      "Fix it quietly without telling anyone",
      "Immediately inform your supervisor, take responsibility, and work to resolve the impact",
      "Blame the error on a system fault"
    ],
    answer: 2
  }

];
