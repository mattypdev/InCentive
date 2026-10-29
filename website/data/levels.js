// Course structure (levels -> units -> lessons). Question content lives in
// Supabase now (see src/lib/questionsApi.js) — this file only holds the
// navigation skeleton: ids, titles, icons, and cent rewards.
// Edit questions at /admin on the live site, not here.

export const levels = [
  {
    "id": "level-1",
    "number": 1,
    "title": "Money Basics",
    "subtitle": "Beginner",
    "color": "#FF6F61",
    "icon": "💰",
    "units": [
      {
        "id": "u1-1",
        "title": "What is Money?",
        "icon": "💵",
        "centsReward": 160,
        "lessons": [
          {
            "id": "u1-1-l1",
            "title": "History of Money",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-1-l2",
            "title": "Barter System",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-1-l3",
            "title": "Why Money Has Value",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-1-l4",
            "title": "Fiat Currency",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-1-l5",
            "title": "Commodity Money",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-1-l6",
            "title": "Digital Money",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-1-l7",
            "title": "Cryptocurrency Basics",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-1-l8",
            "title": "Inflation Introduction",
            "centsReward": 20,
            "questions": []
          }
        ]
      },
      {
        "id": "u1-2",
        "title": "Income",
        "icon": "💼",
        "centsReward": 160,
        "zigzag": [
          0,
          60,
          -60,
          60,
          0,
          -60,
          60,
          -60
        ],
        "lessons": [
          {
            "id": "u1-2-l1",
            "title": "What Income Is",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-2-l2",
            "title": "Gross vs Net Income",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-2-l3",
            "title": "Salary",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-2-l4",
            "title": "Hourly Wage",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-2-l5",
            "title": "Overtime",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-2-l6",
            "title": "Commission",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-2-l7",
            "title": "Bonuses & Tips",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-2-l8",
            "title": "Multiple Income Streams",
            "centsReward": 20,
            "questions": []
          }
        ]
      },
      {
        "id": "u1-3",
        "title": "Spending",
        "icon": "🛍️",
        "centsReward": 160,
        "zigzag": [
          0,
          -70,
          0,
          70,
          -70,
          0,
          70,
          0
        ],
        "lessons": [
          {
            "id": "u1-3-l1",
            "title": "Needs vs Wants",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-3-l2",
            "title": "Opportunity Cost",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-3-l3",
            "title": "Fixed Expenses",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-3-l4",
            "title": "Variable Expenses",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-3-l5",
            "title": "Recurring vs One-Time Expenses",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-3-l6",
            "title": "Impulse Buying",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-3-l7",
            "title": "Lifestyle Inflation",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-3-l8",
            "title": "Delayed Gratification",
            "centsReward": 20,
            "questions": []
          }
        ]
      },
      {
        "id": "u1-4",
        "title": "Saving",
        "icon": "🏦",
        "centsReward": 160,
        "zigzag": [
          0,
          44,
          -44,
          44,
          0,
          -44,
          44,
          0
        ],
        "lessons": [
          {
            "id": "u1-4-l1",
            "title": "Why Save",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-4-l2",
            "title": "Emergency Funds",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-4-l3",
            "title": "Savings Accounts",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-4-l4",
            "title": "Simple Interest",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-4-l5",
            "title": "Compound Interest",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-4-l6",
            "title": "Saving Goals",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-4-l7",
            "title": "Pay Yourself First",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u1-4-l8",
            "title": "Inflation vs Savings",
            "centsReward": 20,
            "questions": []
          }
        ]
      }
    ]
  },
  {
    "id": "level-2",
    "number": 2,
    "title": "Banking",
    "subtitle": "How the financial system works",
    "color": "#0D9488",
    "icon": "🏛️",
    "units": [
      {
        "id": "u2-1",
        "title": "Banks & Accounts",
        "icon": "🏦",
        "centsReward": 160,
        "zigzag": [
          0,
          -80,
          80,
          -40,
          40,
          -80,
          80,
          0
        ],
        "lessons": [
          {
            "id": "u2-1-l1",
            "title": "Checking Accounts",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u2-1-l2",
            "title": "Savings Accounts at Banks",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u2-1-l3",
            "title": "Credit Unions",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u2-1-l4",
            "title": "Online Banks",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u2-1-l5",
            "title": "How Banks Make Money",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u2-1-l6",
            "title": "FDIC Insurance",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u2-1-l7",
            "title": "Reading Bank Statements",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u2-1-l8",
            "title": "Mobile Banking",
            "centsReward": 20,
            "questions": []
          }
        ]
      },
      {
        "id": "u2-2",
        "title": "Payments",
        "icon": "💳",
        "centsReward": 160,
        "zigzag": [
          0,
          -52,
          52,
          -52,
          0,
          52,
          -52,
          52
        ],
        "lessons": [
          {
            "id": "u2-2-l1",
            "title": "Debit Cards",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u2-2-l2",
            "title": "Credit Cards as Payment",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u2-2-l3",
            "title": "Cash & Checks",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u2-2-l4",
            "title": "Wire Transfers & ACH",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u2-2-l5",
            "title": "Venmo, Cash App & Zelle",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u2-2-l6",
            "title": "Apple Pay, Google Pay & Contactless",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u2-2-l7",
            "title": "Direct Deposit",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u2-2-l8",
            "title": "Choosing the Right Payment Method",
            "centsReward": 20,
            "questions": []
          }
        ]
      },
      {
        "id": "u2-3",
        "title": "Interest",
        "icon": "📊",
        "centsReward": 140,
        "zigzag": [
          0,
          60,
          -60,
          60,
          0,
          -60,
          60,
          0
        ],
        "lessons": [
          {
            "id": "u2-3-l1",
            "title": "APR",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u2-3-l2",
            "title": "APY",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u2-3-l3",
            "title": "Compound Interest",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u2-3-l4",
            "title": "Loan Interest",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u2-3-l5",
            "title": "Mortgage Interest",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u2-3-l6",
            "title": "Student Loan Interest",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u2-3-l7",
            "title": "Credit Card Interest",
            "centsReward": 20,
            "questions": []
          }
        ]
      }
    ]
  },
  {
    "id": "level-3",
    "number": 3,
    "title": "Budgeting",
    "subtitle": "Take control of your money",
    "color": "#F59E0B",
    "icon": "📋",
    "units": [
      {
        "id": "u3-1",
        "title": "Budget Basics",
        "icon": "📝",
        "centsReward": 160,
        "zigzag": [
          0,
          -70,
          0,
          70,
          -70,
          0,
          70,
          0
        ],
        "lessons": [
          {
            "id": "u3-1-l1",
            "title": "Income & Expenses",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u3-1-l2",
            "title": "Cash Flow",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u3-1-l3",
            "title": "Budget Categories",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u3-1-l4",
            "title": "Zero-Based Budgeting",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u3-1-l5",
            "title": "50/30/20 Rule",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u3-1-l6",
            "title": "Envelope System",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u3-1-l7",
            "title": "Pay-Yourself-First Budgeting",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u3-1-l8",
            "title": "Flexible Budgeting",
            "centsReward": 20,
            "questions": []
          }
        ]
      },
      {
        "id": "u3-2",
        "title": "Tracking Money",
        "icon": "📱",
        "centsReward": 140,
        "zigzag": [
          0,
          44,
          -44,
          44,
          0,
          -44,
          44,
          0
        ],
        "lessons": [
          {
            "id": "u3-2-l1",
            "title": "Budget Apps",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u3-2-l2",
            "title": "Expense Tracking",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u3-2-l3",
            "title": "Subscriptions",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u3-2-l4",
            "title": "Finding Unnecessary Spending",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u3-2-l5",
            "title": "Cash Flow Forecasting",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u3-2-l6",
            "title": "Review & Adjust",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u3-2-l7",
            "title": "Spreadsheets for Budgeting",
            "centsReward": 20,
            "questions": []
          }
        ]
      },
      {
        "id": "u3-3",
        "title": "Financial Goals",
        "icon": "🎯",
        "centsReward": 160,
        "zigzag": [
          0,
          -80,
          80,
          -40,
          40,
          -80,
          80,
          0
        ],
        "lessons": [
          {
            "id": "u3-3-l1",
            "title": "SMART Goals",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u3-3-l2",
            "title": "Short-Term Goals",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u3-3-l3",
            "title": "Medium-Term Goals",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u3-3-l4",
            "title": "Long-Term Goals",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u3-3-l5",
            "title": "Saving for College",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u3-3-l6",
            "title": "Saving for a House",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u3-3-l7",
            "title": "Saving for Retirement - Intro",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u3-3-l8",
            "title": "Vacation Saving",
            "centsReward": 20,
            "questions": []
          }
        ]
      }
    ]
  },
  {
    "id": "level-4",
    "number": 4,
    "title": "Credit",
    "subtitle": "Build and protect your score",
    "color": "#3B82F6",
    "icon": "💳",
    "units": [
      {
        "id": "u4-1",
        "title": "Credit Scores",
        "icon": "⭐",
        "centsReward": 160,
        "zigzag": [
          0,
          -52,
          52,
          -52,
          0,
          52,
          -52,
          52
        ],
        "lessons": [
          {
            "id": "u4-1-l1",
            "title": "What is Credit",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u4-1-l2",
            "title": "FICO Score",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u4-1-l3",
            "title": "Credit Reports",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u4-1-l4",
            "title": "Credit Bureaus",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u4-1-l5",
            "title": "Hard & Soft Inquiries",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u4-1-l6",
            "title": "Building Credit",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u4-1-l7",
            "title": "Maintaining Credit",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u4-1-l8",
            "title": "VantageScore",
            "centsReward": 20,
            "questions": []
          }
        ]
      },
      {
        "id": "u4-2",
        "title": "Credit Cards",
        "icon": "💳",
        "centsReward": 160,
        "zigzag": [
          0,
          60,
          -60,
          60,
          0,
          -60,
          60,
          -60
        ],
        "lessons": [
          {
            "id": "u4-2-l1",
            "title": "The Grace Period",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u4-2-l2",
            "title": "Minimum Payments",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u4-2-l3",
            "title": "APR on Credit Cards",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u4-2-l4",
            "title": "Cash Back Rewards",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u4-2-l5",
            "title": "Travel Rewards",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u4-2-l6",
            "title": "Interest Traps",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u4-2-l7",
            "title": "Credit Utilization",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u4-2-l8",
            "title": "Balance Transfers",
            "centsReward": 20,
            "questions": []
          }
        ]
      },
      {
        "id": "u4-3",
        "title": "Loans",
        "icon": "📄",
        "centsReward": 160,
        "zigzag": [
          0,
          -65,
          65,
          0,
          -65,
          65,
          0,
          -65
        ],
        "lessons": [
          {
            "id": "u4-3-l1",
            "title": "Types of Loans",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u4-3-l2",
            "title": "Loan Amortization",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u4-3-l3",
            "title": "Student Loans",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u4-3-l4",
            "title": "Auto Loans",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u4-3-l5",
            "title": "Payday & Predatory Lending",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u4-3-l6",
            "title": "Refinancing",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u4-3-l7",
            "title": "Credit Scores & Loan Approval",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u4-3-l8",
            "title": "Managing Debt Wisely",
            "centsReward": 20,
            "questions": []
          }
        ]
      }
    ]
  },
  {
    "id": "level-5",
    "number": 5,
    "title": "Taxes",
    "subtitle": "Understand what you owe and why",
    "color": "#8B5CF6",
    "icon": "🧾",
    "units": [
      {
        "id": "u5-1",
        "title": "Tax Basics",
        "icon": "🏛️",
        "centsReward": 160,
        "zigzag": [
          45,
          -45,
          45,
          -45,
          45,
          -45,
          45,
          -45
        ],
        "lessons": [
          {
            "id": "u5-1-l1",
            "title": "What Are Taxes",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u5-1-l2",
            "title": "Income Tax Brackets",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u5-1-l3",
            "title": "Capital Gains Tax",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u5-1-l4",
            "title": "Payroll & Other Taxes",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u5-1-l5",
            "title": "Tax Deductions",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u5-1-l6",
            "title": "Tax Credits",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u5-1-l7",
            "title": "Tax-Advantaged Accounts",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u5-1-l8",
            "title": "Avoiding Tax Mistakes",
            "centsReward": 20,
            "questions": []
          }
        ]
      },
      {
        "id": "u5-2",
        "title": "Filing Taxes",
        "icon": "📋",
        "centsReward": 160,
        "zigzag": [
          0,
          30,
          60,
          80,
          60,
          30,
          0,
          -30
        ],
        "lessons": [
          {
            "id": "u5-2-l1",
            "title": "Tax Forms: W-2 & 1099",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u5-2-l2",
            "title": "Standard vs. Itemized Deductions",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u5-2-l3",
            "title": "Tax Withholding",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u5-2-l4",
            "title": "Filing Deadlines & Extensions",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u5-2-l5",
            "title": "Tax Software & Filing Options",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u5-2-l6",
            "title": "Refunds & What You Owe",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u5-2-l7",
            "title": "Self-Employment Taxes",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u5-2-l8",
            "title": "Taxes & Life Events",
            "centsReward": 20,
            "questions": []
          }
        ]
      }
    ]
  },
  {
    "id": "level-6",
    "number": 6,
    "title": "Insurance",
    "subtitle": "Protect what you've built",
    "color": "#EC4899",
    "icon": "🛡️",
    "units": [
      {
        "id": "u6-1",
        "title": "Insurance Basics",
        "icon": "🛡️",
        "centsReward": 160,
        "zigzag": [
          0,
          -40,
          -80,
          -40,
          0,
          40,
          80,
          40
        ],
        "lessons": [
          {
            "id": "u6-1-l1",
            "title": "How Insurance Works",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u6-1-l2",
            "title": "Health Insurance",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u6-1-l3",
            "title": "Auto Insurance",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u6-1-l4",
            "title": "Renters & Homeowners Insurance",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u6-1-l5",
            "title": "Life Insurance",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u6-1-l6",
            "title": "Disability & Other Insurance",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u6-1-l7",
            "title": "Choosing the Right Coverage",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u6-1-l8",
            "title": "Insurance & Building Wealth",
            "centsReward": 20,
            "questions": []
          }
        ]
      }
    ]
  },
  {
    "id": "level-7",
    "number": 7,
    "title": "Investing Basics",
    "subtitle": "Put your money to work",
    "color": "#14B8A6",
    "icon": "📈",
    "units": [
      {
        "id": "u7-1",
        "title": "Why Invest?",
        "icon": "🌱",
        "centsReward": 160,
        "zigzag": [
          0,
          55,
          -55,
          0,
          55,
          -55,
          0,
          55
        ],
        "lessons": [
          {
            "id": "u7-1-l1",
            "title": "Inflation & Purchasing Power",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-1-l2",
            "title": "Risk vs. Reward",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-1-l3",
            "title": "Compound Returns",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-1-l4",
            "title": "Asset Allocation",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-1-l5",
            "title": "Diversification",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-1-l6",
            "title": "Dollar-Cost Averaging",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-1-l7",
            "title": "Investment Accounts",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-1-l8",
            "title": "Common Investing Mistakes",
            "centsReward": 20,
            "questions": []
          }
        ]
      },
      {
        "id": "u7-2",
        "title": "Stocks",
        "icon": "📊",
        "centsReward": 160,
        "zigzag": [
          60,
          30,
          0,
          -30,
          -60,
          -30,
          0,
          30
        ],
        "lessons": [
          {
            "id": "u7-2-l1",
            "title": "What Is a Stock",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-2-l2",
            "title": "IPOs & Going Public",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-2-l3",
            "title": "Stock Valuation",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-2-l4",
            "title": "Dividends",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-2-l5",
            "title": "Growth vs. Value Stocks",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-2-l6",
            "title": "Stock Markets & Exchanges",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-2-l7",
            "title": "Reading Stock Information",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-2-l8",
            "title": "Stock Market Indices",
            "centsReward": 20,
            "questions": []
          }
        ]
      },
      {
        "id": "u7-3",
        "title": "Bonds",
        "icon": "📜",
        "centsReward": 160,
        "zigzag": [
          0,
          -70,
          70,
          -35,
          35,
          -70,
          70,
          0
        ],
        "lessons": [
          {
            "id": "u7-3-l1",
            "title": "What Is a Bond",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-3-l2",
            "title": "Types of Bonds",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-3-l3",
            "title": "Interest Rate Risk",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-3-l4",
            "title": "Credit Ratings & Default Risk",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-3-l5",
            "title": "Yield & Return",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-3-l6",
            "title": "Bonds in Your Portfolio",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-3-l7",
            "title": "Government & Municipal Bonds",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-3-l8",
            "title": "Bonds vs. Stocks",
            "centsReward": 20,
            "questions": []
          }
        ]
      },
      {
        "id": "u7-4",
        "title": "Mutual Funds",
        "icon": "🧺",
        "centsReward": 160,
        "zigzag": [
          0,
          50,
          -50,
          75,
          -75,
          50,
          -50,
          0
        ],
        "lessons": [
          {
            "id": "u7-4-l1",
            "title": "What Is a Mutual Fund",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-4-l2",
            "title": "Active vs. Passive Management",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-4-l3",
            "title": "Index Funds",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-4-l4",
            "title": "Expense Ratios & Fees",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-4-l5",
            "title": "Target-Date Funds",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-4-l6",
            "title": "Fund Categories",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-4-l7",
            "title": "How to Choose a Mutual Fund",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-4-l8",
            "title": "Building with Mutual Funds",
            "centsReward": 20,
            "questions": []
          }
        ]
      },
      {
        "id": "u7-5",
        "title": "ETFs",
        "icon": "📦",
        "centsReward": 160,
        "zigzag": [
          0,
          -55,
          55,
          -55,
          55,
          -55,
          55,
          -55
        ],
        "lessons": [
          {
            "id": "u7-5-l1",
            "title": "What Is an ETF",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-5-l2",
            "title": "ETFs vs. Mutual Funds",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-5-l3",
            "title": "Popular ETF Types",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-5-l4",
            "title": "Reading ETF Data",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-5-l5",
            "title": "Tax Efficiency of ETFs",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-5-l6",
            "title": "Building a Portfolio with ETFs",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-5-l7",
            "title": "Sector & Thematic ETFs",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u7-5-l8",
            "title": "The ETF Ecosystem",
            "centsReward": 20,
            "questions": []
          }
        ]
      }
    ]
  },
  {
    "id": "level-8",
    "number": 8,
    "title": "Retirement",
    "subtitle": "Build wealth for the long run",
    "color": "#F97316",
    "icon": "🏖️",
    "units": [
      {
        "id": "u8-1",
        "title": "Retirement Planning",
        "icon": "🏖️",
        "centsReward": 160,
        "zigzag": [
          0,
          40,
          80,
          40,
          0,
          -40,
          -80,
          -40
        ],
        "lessons": [
          {
            "id": "u8-1-l1",
            "title": "Why Plan for Retirement",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u8-1-l2",
            "title": "401(k) Basics",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u8-1-l3",
            "title": "Traditional IRA vs. Roth IRA",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u8-1-l4",
            "title": "Retirement Account Strategy",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u8-1-l5",
            "title": "Social Security",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u8-1-l6",
            "title": "Required Minimum Distributions",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u8-1-l7",
            "title": "Retirement Income Strategy",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u8-1-l8",
            "title": "Retirement Planning at Any Age",
            "centsReward": 20,
            "questions": []
          }
        ]
      }
    ]
  },
  {
    "id": "level-9",
    "number": 9,
    "title": "The Economy",
    "subtitle": "Understand the big picture",
    "color": "#06B6D4",
    "icon": "🌍",
    "units": [
      {
        "id": "u9-1",
        "title": "Macroeconomics",
        "icon": "🌍",
        "centsReward": 160,
        "zigzag": [
          0,
          -60,
          30,
          -90,
          60,
          -30,
          90,
          0
        ],
        "lessons": [
          {
            "id": "u9-1-l1",
            "title": "GDP & Economic Growth",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u9-1-l2",
            "title": "Inflation",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u9-1-l3",
            "title": "The Federal Reserve",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u9-1-l4",
            "title": "Supply & Demand",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u9-1-l5",
            "title": "Recession & Business Cycles",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u9-1-l6",
            "title": "Unemployment",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u9-1-l7",
            "title": "Trade & Globalization",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u9-1-l8",
            "title": "Economic Indicators",
            "centsReward": 20,
            "questions": []
          }
        ]
      }
    ]
  },
  {
    "id": "level-10",
    "number": 10,
    "title": "Business Finance",
    "subtitle": "How companies manage money",
    "color": "#84CC16",
    "icon": "🏢",
    "units": [
      {
        "id": "u10-1",
        "title": "Business Fundamentals",
        "icon": "🏢",
        "centsReward": 160,
        "zigzag": [
          0,
          65,
          -30,
          65,
          -65,
          30,
          -65,
          0
        ],
        "lessons": [
          {
            "id": "u10-1-l1",
            "title": "Revenue vs. Profit",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u10-1-l2",
            "title": "Income Statement",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u10-1-l3",
            "title": "Balance Sheet",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u10-1-l4",
            "title": "Cash Flow Statement",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u10-1-l5",
            "title": "Business Structures",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u10-1-l6",
            "title": "Gross Profit Margin",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u10-1-l7",
            "title": "Break-Even Analysis",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u10-1-l8",
            "title": "Business Credit & Financing",
            "centsReward": 20,
            "questions": []
          }
        ]
      }
    ]
  },
  {
    "id": "level-11",
    "number": 11,
    "title": "Advanced Investing",
    "subtitle": "Analyze companies like a pro",
    "color": "#6366F1",
    "icon": "🔬",
    "units": [
      {
        "id": "u11-1",
        "title": "Stock Analysis",
        "icon": "🔬",
        "centsReward": 160,
        "zigzag": [
          0,
          80,
          -40,
          80,
          -80,
          40,
          -80,
          0
        ],
        "lessons": [
          {
            "id": "u11-1-l1",
            "title": "P/E Ratio & Valuation",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u11-1-l2",
            "title": "Beta & Volatility",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u11-1-l3",
            "title": "DCF Analysis",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u11-1-l4",
            "title": "Dollar-Cost Averaging",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u11-1-l5",
            "title": "EPS & Earnings Reports",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u11-1-l6",
            "title": "Price-to-Book & Other Ratios",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u11-1-l7",
            "title": "Technical vs. Fundamental Analysis",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u11-1-l8",
            "title": "Building a Research Process",
            "centsReward": 20,
            "questions": []
          }
        ]
      }
    ]
  },
  {
    "id": "level-12",
    "number": 12,
    "title": "Real Estate",
    "subtitle": "The fundamentals of property",
    "color": "#D946EF",
    "icon": "🏡",
    "units": [
      {
        "id": "u12-1",
        "title": "Real Estate Basics",
        "icon": "🏡",
        "centsReward": 160,
        "zigzag": [
          0,
          -45,
          90,
          -45,
          0,
          45,
          -90,
          45
        ],
        "lessons": [
          {
            "id": "u12-1-l1",
            "title": "Buy vs. Rent",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u12-1-l2",
            "title": "Home Equity",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u12-1-l3",
            "title": "REITs",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u12-1-l4",
            "title": "Closing Costs & Buying Process",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u12-1-l5",
            "title": "Mortgage Types",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u12-1-l6",
            "title": "Rental Property Investing",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u12-1-l7",
            "title": "Real Estate Market Cycles",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u12-1-l8",
            "title": "Property Taxes & Other Costs",
            "centsReward": 20,
            "questions": []
          }
        ]
      }
    ]
  },
  {
    "id": "level-13",
    "number": 13,
    "title": "Debt Mastery",
    "subtitle": "Eliminate debt strategically",
    "color": "#EF4444",
    "icon": "⛓️",
    "units": [
      {
        "id": "u13-1",
        "title": "Getting Out of Debt",
        "icon": "🔓",
        "centsReward": 160,
        "zigzag": [
          30,
          60,
          90,
          60,
          30,
          0,
          -30,
          -60
        ],
        "lessons": [
          {
            "id": "u13-1-l1",
            "title": "Debt Snowball",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u13-1-l2",
            "title": "Debt Avalanche",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u13-1-l3",
            "title": "Debt-to-Income Ratio",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u13-1-l4",
            "title": "Debt Consolidation",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u13-1-l5",
            "title": "Bankruptcy",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u13-1-l6",
            "title": "Negotiating with Creditors",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u13-1-l7",
            "title": "Student Loan Strategies",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u13-1-l8",
            "title": "Rebuilding Credit While Paying Debt",
            "centsReward": 20,
            "questions": []
          }
        ]
      }
    ]
  },
  {
    "id": "level-14",
    "number": 14,
    "title": "Consumer Skills",
    "subtitle": "Protect yourself in the marketplace",
    "color": "#10B981",
    "icon": "🧠",
    "units": [
      {
        "id": "u14-1",
        "title": "Smart Consumer",
        "icon": "🧠",
        "centsReward": 160,
        "zigzag": [
          -60,
          -30,
          0,
          30,
          60,
          30,
          0,
          -30
        ],
        "lessons": [
          {
            "id": "u14-1-l1",
            "title": "Avoiding Scams",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u14-1-l2",
            "title": "Identity Theft Protection",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u14-1-l3",
            "title": "Reading Contracts",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u14-1-l4",
            "title": "Negotiating Purchases",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u14-1-l5",
            "title": "Consumer Rights & Protections",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u14-1-l6",
            "title": "Comparison Shopping",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u14-1-l7",
            "title": "Subscription Traps",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u14-1-l8",
            "title": "Warranties & Extended Protection",
            "centsReward": 20,
            "questions": []
          }
        ]
      }
    ]
  },
  {
    "id": "level-15",
    "number": 15,
    "title": "Entrepreneurship",
    "subtitle": "Build your own income engine",
    "color": "#CA8A04",
    "icon": "🚀",
    "units": [
      {
        "id": "u15-1",
        "title": "Starting a Business",
        "icon": "🚀",
        "centsReward": 160,
        "zigzag": [
          0,
          70,
          0,
          -70,
          0,
          70,
          0,
          -70
        ],
        "lessons": [
          {
            "id": "u15-1-l1",
            "title": "Profit Margin",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u15-1-l2",
            "title": "Cash Flow for New Businesses",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u15-1-l3",
            "title": "Business Plan",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u15-1-l4",
            "title": "Scaling Your Business",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u15-1-l5",
            "title": "Finding Your First Customers",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u15-1-l6",
            "title": "Setting Prices Strategically",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u15-1-l7",
            "title": "Managing Business Finances",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u15-1-l8",
            "title": "Side Hustle to Business",
            "centsReward": 20,
            "questions": []
          }
        ]
      }
    ]
  },
  {
    "id": "level-16",
    "number": 16,
    "title": "Advanced Economics",
    "subtitle": "Global finance and markets",
    "color": "#2563EB",
    "icon": "🌐",
    "units": [
      {
        "id": "u16-1",
        "title": "Global Markets",
        "icon": "🌐",
        "centsReward": 160,
        "zigzag": [
          50,
          0,
          -50,
          0,
          50,
          0,
          -50,
          0
        ],
        "lessons": [
          {
            "id": "u16-1-l1",
            "title": "Tariffs & Trade",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u16-1-l2",
            "title": "Exchange Rates",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u16-1-l3",
            "title": "Comparative Advantage",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u16-1-l4",
            "title": "Monopoly & Competition",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u16-1-l5",
            "title": "Emerging Markets",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u16-1-l6",
            "title": "Trade Deficits & Surpluses",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u16-1-l7",
            "title": "International Investing",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u16-1-l8",
            "title": "Central Banks & Monetary Policy",
            "centsReward": 20,
            "questions": []
          }
        ]
      }
    ]
  },
  {
    "id": "level-17",
    "number": 17,
    "title": "Alternative Investments",
    "subtitle": "Beyond stocks and bonds",
    "color": "#7C3AED",
    "icon": "💎",
    "units": [
      {
        "id": "u17-1",
        "title": "Alternative Assets",
        "icon": "💎",
        "centsReward": 160,
        "zigzag": [
          0,
          35,
          70,
          35,
          0,
          -35,
          -70,
          -35
        ],
        "lessons": [
          {
            "id": "u17-1-l1",
            "title": "Cryptocurrency",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u17-1-l2",
            "title": "Gold & Precious Metals",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u17-1-l3",
            "title": "Options Contracts",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u17-1-l4",
            "title": "Private Equity",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u17-1-l5",
            "title": "Commodities & Futures",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u17-1-l6",
            "title": "Hedge Funds",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u17-1-l7",
            "title": "Art & Collectibles as Investments",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u17-1-l8",
            "title": "Portfolio Role of Alternatives",
            "centsReward": 20,
            "questions": []
          }
        ]
      }
    ]
  },
  {
    "id": "level-18",
    "number": 18,
    "title": "Advanced Wealth",
    "subtitle": "Build generational financial security",
    "color": "#0F766E",
    "icon": "🏦",
    "units": [
      {
        "id": "u18-1",
        "title": "Wealth Building",
        "icon": "🏦",
        "centsReward": 160,
        "zigzag": [
          -80,
          -40,
          0,
          40,
          80,
          40,
          0,
          -40
        ],
        "lessons": [
          {
            "id": "u18-1-l1",
            "title": "Tax-Loss Harvesting",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u18-1-l2",
            "title": "FIRE Movement",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u18-1-l3",
            "title": "Estate Planning",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u18-1-l4",
            "title": "Asset Protection",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u18-1-l5",
            "title": "Net Worth Tracking",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u18-1-l6",
            "title": "Charitable Giving & DAFs",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u18-1-l7",
            "title": "Trusts & Wills",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u18-1-l8",
            "title": "Building Generational Wealth",
            "centsReward": 20,
            "questions": []
          }
        ]
      }
    ]
  },
  {
    "id": "level-19",
    "number": 19,
    "title": "Behavioral Finance",
    "subtitle": "Master your money psychology",
    "color": "#C2410C",
    "icon": "🧠",
    "units": [
      {
        "id": "u19-1",
        "title": "Money Psychology",
        "icon": "🧠",
        "centsReward": 160,
        "zigzag": [
          0,
          -75,
          50,
          -25,
          75,
          -50,
          25,
          0
        ],
        "lessons": [
          {
            "id": "u19-1-l1",
            "title": "Loss Aversion",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u19-1-l2",
            "title": "Herd Mentality",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u19-1-l3",
            "title": "Confirmation Bias",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u19-1-l4",
            "title": "Mental Accounting",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u19-1-l5",
            "title": "Anchoring Bias",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u19-1-l6",
            "title": "Overconfidence Bias",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u19-1-l7",
            "title": "Recency Bias",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u19-1-l8",
            "title": "Overcoming Cognitive Biases",
            "centsReward": 20,
            "questions": []
          }
        ]
      }
    ]
  },
  {
    "id": "level-20",
    "number": 20,
    "title": "Mastery",
    "subtitle": "The complete financial picture",
    "color": "#1E293B",
    "icon": "🏆",
    "units": [
      {
        "id": "u20-1",
        "title": "Capstone Challenge",
        "icon": "🏆",
        "centsReward": 300,
        "questions": []
      }
    ]
  },
  {
    "id": "level-21",
    "number": 21,
    "title": "Emotional Spending",
    "subtitle": "How emotions drive financial decisions",
    "color": "#6366F1",
    "icon": "🧠",
    "units": [
      {
        "id": "u21-1",
        "title": "Emotional Spending",
        "icon": "💭",
        "centsReward": 160,
        "zigzag": [
          25,
          -25,
          75,
          -75,
          25,
          -25,
          75,
          -75
        ],
        "lessons": [
          {
            "id": "u21-1-l1",
            "title": "Retail Therapy",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u21-1-l2",
            "title": "FOMO Spending",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u21-1-l3",
            "title": "Money & Happiness",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u21-1-l4",
            "title": "Hedonic Adaptation",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u21-1-l5",
            "title": "Stress Spending Triggers",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u21-1-l6",
            "title": "Social Media & Spending Pressure",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u21-1-l7",
            "title": "Mindful Spending Habits",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u21-1-l8",
            "title": "Needs vs. Wants",
            "centsReward": 20,
            "questions": []
          }
        ]
      }
    ]
  },
  {
    "id": "level-22",
    "number": 22,
    "title": "Money Mindset",
    "subtitle": "Beliefs and behaviors that shape wealth",
    "color": "#6366F1",
    "icon": "💡",
    "units": [
      {
        "id": "u22-1",
        "title": "Money Mindset",
        "icon": "💡",
        "centsReward": 160,
        "zigzag": [
          0,
          45,
          -90,
          45,
          0,
          -45,
          90,
          -45
        ],
        "lessons": [
          {
            "id": "u22-1-l1",
            "title": "Scarcity Mindset",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u22-1-l2",
            "title": "Money Beliefs from Childhood",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u22-1-l3",
            "title": "Lifestyle Creep",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u22-1-l4",
            "title": "Pay Yourself First",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u22-1-l5",
            "title": "Abundance Mindset",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u22-1-l6",
            "title": "Money & Relationships",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u22-1-l7",
            "title": "Overcoming Financial Avoidance",
            "centsReward": 20,
            "questions": []
          },
          {
            "id": "u22-1-l8",
            "title": "Long-Term Thinking",
            "centsReward": 20,
            "questions": []
          }
        ]
      }
    ]
  }
];

export const allUnits = levels.flatMap(l => l.units)
