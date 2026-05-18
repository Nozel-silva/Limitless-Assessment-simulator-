const QUESTION_BANK = [
  {
    id: 1,
    question: "A train travels 120km in 2 hours. What is its average speed?",
    options: ["40 km/h", "60 km/h", "80 km/h", "100 km/h"],
    answer: 1
  },
  {
    id: 2,
    question: "If 5x + 3 = 28, what is x?",
    options: ["4", "5", "6", "7"],
    answer: 1
  },
  {
    id: 3,
    question: "What is 15% of 200?",
    options: ["25", "30", "35", "40"],
    answer: 1
  },
  {
    id: 4,
    question: "A rectangle has length 8cm and width 5cm. What is its area?",
    options: ["30 cm²", "35 cm²", "40 cm²", "45 cm²"],
    answer: 2
  },
  {
    id: 5,
    question: "Which number comes next in the sequence: 2, 6, 18, 54, ___?",
    options: ["108", "162", "216", "270"],
    answer: 1
  },
  {
    id: 6,
    question: "If a shirt costs ₦4,500 and is discounted by 20%, what is the new price?",
    options: ["₦3,200", "₦3,500", "₦3,600", "₦3,800"],
    answer: 2
  },
  {
    id: 7,
    question: "How many minutes are in 3.5 hours?",
    options: ["180", "200", "210", "230"],
    answer: 2
  },
  {
    id: 8,
    question: "Simplify: 3/4 + 1/2",
    options: ["4/6", "5/4", "7/4", "1/4"],
    answer: 1
  },
  {
    id: 9,
    question: "What is the square root of 144?",
    options: ["11", "12", "13", "14"],
    answer: 1
  },
  {
    id: 10,
    question: "A worker earns ₦12,000 per week. How much does he earn in a month (4 weeks)?",
    options: ["₦36,000", "₦48,000", "₦60,000", "₦72,000"],
    answer: 1
  },
  {
    id: 11,
    question: "If 3 pens cost ₦750, how much do 7 pens cost?",
    options: ["₦1,500", "₦1,650", "₦1,750", "₦1,800"],
    answer: 2
  },
  {
    id: 12,
    question: "What is 2³ × 3²?",
    options: ["54", "62", "72", "84"],
    answer: 2
  },
  {
    id: 13,
    question: "A car uses 5 litres of fuel per 40km. How many litres for 200km?",
    options: ["20", "22", "25", "30"],
    answer: 2
  },
  {
    id: 14,
    question: "Which is the largest fraction? 2/3, 3/4, 5/8, 7/12",
    options: ["2/3", "3/4", "5/8", "7/12"],
    answer: 1
  },
  {
    id: 15,
    question: "If today is Wednesday, what day will it be in 10 days?",
    options: ["Friday", "Saturday", "Sunday", "Monday"],
    answer: 1
  },
  {
    id: 16,
    question: "A bag contains 5 red, 3 blue, and 2 green balls. What is the probability of picking a blue ball?",
    options: ["1/5", "3/10", "2/5", "1/2"],
    answer: 1
  },
  {
    id: 17,
    question: "What is 45% of 80?",
    options: ["32", "34", "36", "38"],
    answer: 2
  },
  {
    id: 18,
    question: "Solve: 2(x - 3) = 10",
    options: ["5", "6", "7", "8"],
    answer: 3
  },
  {
    id: 19,
    question: "What is the perimeter of a square with side 7cm?",
    options: ["21cm", "28cm", "35cm", "49cm"],
    answer: 1
  },
  {
    id: 20,
    question: "A shop sold 200 items. 30% were returned. How many were kept?",
    options: ["120", "130", "140", "150"],
    answer: 2
  },
  {
    id: 21,
    question: "Convert 0.75 to a fraction in lowest terms.",
    options: ["3/5", "3/4", "7/10", "4/5"],
    answer: 1
  },
  {
    id: 22,
    question: "If 8 workers complete a job in 6 days, how many days will 4 workers take?",
    options: ["10", "12", "14", "16"],
    answer: 1
  },
  {
    id: 23,
    question: "What is the LCM of 4, 6, and 8?",
    options: ["12", "16", "24", "48"],
    answer: 2
  },
  {
    id: 24,
    question: "What is 1,250 ÷ 25?",
    options: ["40", "45", "50", "55"],
    answer: 2
  },
  {
    id: 25,
    question: "The ratio of boys to girls in a class is 3:2. If there are 30 students, how many are girls?",
    options: ["10", "12", "14", "18"],
    answer: 1
  },
  {
    id: 26,
    question: "What is the next prime number after 13?",
    options: ["14", "15", "17", "19"],
    answer: 2
  },
  {
    id: 27,
    question: "A clock shows 3:45. What is the angle between the hour and minute hands?",
    options: ["142.5°", "157.5°", "172.5°", "187.5°"],
    answer: 1
  },
  {
    id: 28,
    question: "If y = 2x + 5 and x = 3, what is y?",
    options: ["9", "10", "11", "12"],
    answer: 2
  },
  {
    id: 29,
    question: "What is 20% of 20% of 500?",
    options: ["10", "15", "20", "25"],
    answer: 2
  },
  {
    id: 30,
    question: "A pipe fills a tank in 4 hours. Another drains it in 6 hours. How long to fill if both are open?",
    options: ["10 hours", "12 hours", "14 hours", "16 hours"],
    answer: 1
  },
  {
    id: 31,
    question: "What is 7! (7 factorial)?",
    options: ["2,520", "5,040", "720", "40,320"],
    answer: 1
  },
  {
    id: 32,
    question: "Simplify: (x² - 4) ÷ (x - 2)",
    options: ["x - 2", "x + 2", "x² + 2", "2x"],
    answer: 1
  },
  {
    id: 33,
    question: "Find the mean of: 12, 15, 18, 21, 24",
    options: ["16", "17", "18", "19"],
    answer: 2
  },
  {
    id: 34,
    question: "If a = 3 and b = -2, what is a² - b²?",
    options: ["1", "3", "5", "7"],
    answer: 2
  },
  {
    id: 35,
    question: "A 12-metre pole casts a 8-metre shadow. How tall is an object casting a 6-metre shadow?",
    options: ["7m", "8m", "9m", "10m"],
    answer: 2
  },
  {
    id: 36,
    question: "What is the HCF of 24 and 36?",
    options: ["6", "8", "12", "18"],
    answer: 2
  },
  {
    id: 37,
    question: "Evaluate: 5 + 3 × 2 - 4 ÷ 2",
    options: ["7", "8", "9", "10"],
    answer: 2
  },
  {
    id: 38,
    question: "What percentage is 45 of 180?",
    options: ["20%", "25%", "30%", "35%"],
    answer: 1
  },
  {
    id: 39,
    question: "Which of these is NOT a factor of 60?",
    options: ["8", "10", "12", "15"],
    answer: 0
  },
  {
    id: 40,
    question: "If a = 4, b = 3, what is √(a² + b²)?",
    options: ["4", "5", "6", "7"],
    answer: 1
  },
  {
    id: 41,
    question: "A phone costs ₦85,000. After 15% VAT, what is the total price?",
    options: ["₦95,500", "₦97,750", "₦98,250", "₦100,000"],
    answer: 1
  },
  {
    id: 42,
    question: "Solve for x: x/3 + 4 = 9",
    options: ["12", "13", "14", "15"],
    answer: 3
  },
  {
    id: 43,
    question: "Two numbers add up to 50. One is 18 more than the other. What is the smaller number?",
    options: ["14", "16", "18", "20"],
    answer: 1
  },
  {
    id: 44,
    question: "What is the volume of a cube with side 4cm?",
    options: ["48 cm³", "56 cm³", "64 cm³", "72 cm³"],
    answer: 2
  },
  {
    id: 45,
    question: "If interest is 10% per annum simple interest on ₦20,000, how much interest after 3 years?",
    options: ["₦4,000", "₦5,000", "₦6,000", "₦7,000"],
    answer: 2
  },
  {
    id: 46,
    question: "Complete the series: 1, 4, 9, 16, 25, ___",
    options: ["30", "34", "36", "40"],
    answer: 2
  },
  {
    id: 47,
    question: "What is 3/8 expressed as a decimal?",
    options: ["0.325", "0.365", "0.375", "0.385"],
    answer: 2
  },
  {
    id: 48,
    question: "A tank is 60% full. After adding 300 litres it is 90% full. What is the tank's capacity?",
    options: ["800L", "900L", "1000L", "1100L"],
    answer: 2
  },
  {
    id: 49,
    question: "What is the median of: 3, 7, 2, 9, 5, 1, 8?",
    options: ["4", "5", "6", "7"],
    answer: 1
  },
  {
    id: 50,
    question: "If f(x) = x² + 2x - 3, what is f(2)?",
    options: ["3", "4", "5", "6"],
    answer: 2
  }
];
