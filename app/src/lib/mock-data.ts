export const mockIntroduction = {
  name: "Mara",
  age: 37,
  location: "bed-stuy",
  distance: "4 miles",
  photoCount: 3,
  pronouns: "she",
  explanation:
    "You both ranked candor first and independence second. Neither of you flagged a dealbreaker the other holds. Her answer about what a good life looks like and yours both describe small households and long friendships.",
  floor: 0.74,
  score: 0.81,
  expiresIn: "5 days",
  lifeAnswers: [
    {
      prompt: "the kind of people i'm drawn to",
      answer:
        "People who are still curious about something they've been doing for twenty years. My father repaired clocks his whole life and never once got bored of it — I think that's the quality I keep looking for in everyone.",
    },
    {
      prompt: "what a good life looks like to me",
      answer:
        "Four people I can call without planning it. Work that ends at a reasonable hour. A kitchen that gets used on weeknights.",
    },
  ],
  photos: [
    { title: "my living space", src: null },
    { title: "my bookshelf", src: null },
    { title: "my favorite hobby", src: null },
  ],
};

export const mockConversations = {
  open: 2,
  max: 3,
  threads: [
    {
      name: "Mara",
      status: "introduced today",
      isNew: true,
      preview:
        "Both of us said clocks, apparently. I want to hear about your father.",
      avatarSrc: null,
    },
    {
      name: "Daniel",
      status: "waiting 3 days · your turn",
      isNew: false,
      preview:
        "Saturday works. There's a place on Franklin that does the thing you described almost exactly.",
      avatarSrc: null,
    },
  ],
  closed: [
    {
      name: "Ines",
      closedDate: "12 august",
      note: "It was good talking to you. I hope the move goes easily.",
      hasGoodbyeNote: true,
    },
  ],
};

export const mockDrought = {
  bar: "5 values · 4 qualities",
  dealbreakers: 3,
  radius: "15 miles",
  poolSize: 214,
};

export const mockBilling = {
  droughtDays: 21,
};

export const mockRanking = {
  step: 5,
  totalSteps: 9,
  privacy: "private matching input",
  ranked: ["candor", "independence", "curiosity", "patience"],
  unranked: ["ambition", "humour", "steadiness", "generosity"],
};

export const mockDealbreaker = {
  step: 4,
  totalSteps: 9,
  privacy: "private",
  question: "kids",
  options: ["i have kids", "i want kids", "i don't want kids"],
  selected: "i want kids",
  isHardLine: true,
  excludePct: 38,
  poolSize: 214,
};
