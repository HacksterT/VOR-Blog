// "Am I Saved" survey content.
//
// Source of truth for this content is tasks/prd-am-i-saved-survey.md.
// A parallel copy of the assessment lives in the Ezra backend at
// ezra-assistant/src/ezra/cron/templates/survey_email.py for the email send.
// Keep all three in sync when copy changes.

export interface SurveyQuestion {
  step: number;
  heading: string;
  body: string;
}

export interface AssessmentSection {
  heading: string;
  paragraphs: string[];
}

export const surveyQuestions: SurveyQuestion[] = [
  {
    step: 1,
    heading: "The Mirror in Private",
    body: "When you are alone with yourself and nobody is watching — not your spouse, not your coworkers, not the people at church — what does the real version of you look like? The one who shows up in your private thoughts, your browsing history, your reaction when someone cuts you off in traffic, your quiet resentments. Would you be proud of that person?",
  },
  {
    step: 2,
    heading: "The Standard You Already Hold",
    body: "Picture the highest human being you can imagine. Selfless love. Unfailing patience. Complete honesty. Genuine care for strangers. Real self-discipline. You already know that standard exists because you measure other people by it all the time. How close are you to it on your best day? How close on your worst?",
  },
  {
    step: 3,
    heading: "The Scoreboard",
    body: "If every thought, word, and action of your life were weighed, the good on one side and the wrong on the other, which side do you think would drop? And if the scale tipped the wrong way, what exactly would make it right again? What do you owe, and how do you plan to pay it?",
  },
  {
    step: 4,
    heading: "The Exit",
    body: "If you died tonight in your sleep, what do you believe would happen? Not what you hope. Not what sounds polite at a funeral. What do you actually believe, in the place nobody else can see? And where does that belief come from — evidence, instinct, or something somebody told you once?",
  },
  {
    step: 5,
    heading: "The Self-Rescue Problem",
    body: "Have you ever genuinely tried to become a better person? Made a resolution, started a discipline, promised yourself you would change? How long did it last? What does that tell you about whether effort alone can fix what is actually wrong inside you?",
  },
  {
    step: 6,
    heading: "The Offer You Did Not Earn",
    body: "Imagine someone who never did anything wrong willingly stood in for everything you have ever done. Not because you earned it. Not because you deserved it. Because he decided, before you were even born, that your debt was his to pay. What would you do with an offer like that?",
  },
  {
    step: 7,
    heading: "The Turn",
    body: "Suppose that offer is real. Suppose the one who made it is standing in front of you right now, holding his hand out. Accepting it is not a prayer you recite or a box you check. It is a turning — walking away from who you have been and toward who he says you can become. Are you willing to turn?",
  },
  {
    step: 8,
    heading: "The First Words",
    body: "If the answer to the last question is yes — or even closer to yes than you have been before — what is stopping you, right now, from telling him so? Not a stranger. Not a minister. Him. Would you say it out loud, in your own words, and mean it?",
  },
];

// The assessment. `intro` is the opening before the first ### section.
// Each AssessmentSection becomes an <h3> with its paragraphs below.
// Paragraphs accept a tiny subset of markdown: **bold** and *italic* are
// rendered by the page's formatter. Do not use other markdown here.

export const surveyAssessment: {
  title: string;
  intro: string[];
  sections: AssessmentSection[];
} = {
  title: "The Assessment",
  intro: [
    "If you worked through those eight questions, you probably did what most people do. **You started scoring.**",
    "You looked at the questions and measured yourself, maybe honestly, maybe generously, maybe harshly. You weighed how much good you have done against how much wrong. You landed somewhere on the scale. Not as bad as some. Not as holy as others. Clinging, probably, to the hope that the balance would come out okay in the end.",
    "Here is the first hard truth. **The scale was never the measurement.**",
    "Before anyone reads a single verse of scripture, most of us walk around with a private ledger in our heads. Good on one side. Bad on the other. We spend our lives hoping the good column wins. Every religion ever invented runs on some version of that logic. Do enough right. Avoid enough wrong. Hope it counts.",
    "Christianity is the one faith on earth that says the ledger does not work that way. Not because the ledger is rigged. Because **the scale has already tipped, for every single person, without exception.** The Bible says it plainly: *\"all have sinned and fall short of the glory of God\"* (Romans 3:23). Not some. Not the worst of us. All of us. The best day of your life was not good enough. Neither was mine. The standard is not *better than the people around you*. The standard is *perfect*. And if you are honest for three minutes, you know you are not that.",
    "The second hard truth is what that gap costs. *\"The wages of sin is death\"* (Romans 6:23). This is not a threat. It is an accounting statement. Sin earns a paycheck, and the paycheck is separation from God, forever. No amount of extra credit in the good column pays it down. The books do not work that way.",
  ],
  sections: [
    {
      heading: "What you did not earn",
      paragraphs: [
        "Here is where the story turns, and it is the reason the whole book was written.",
        "*\"God demonstrates his own love for us in this: While we were still sinners, Christ died for us\"* (Romans 5:8).",
        "Read that carefully. **Christ did not wait for you to clean up.** He did not wait for the good column to get respectable. He paid the bill while the ink in the bad column was still wet. Your score was never going to be the thing that saved you. Someone else's score was.",
        "This is the part most people miss. You are not being asked to balance your own books. You are being asked to let Someone else pay them and walk away from the ledger entirely. That is not how human systems work. It is not how employment works, or court works, or credit works. It is not how the religion most of us grew up with works either. But it is how God works, and if you try to translate it into a transaction you can control, you will never understand it.",
      ],
    },
    {
      heading: "What about timing",
      paragraphs: [
        "There is a scene in the Bible that answers the question every late-in-life person eventually asks. *\"Is it too late?\"*",
        "Jesus was crucified with two criminals, one on each side of Him. Both were dying. Both had run out of runway. One mocked Him. The other called out, *\"Jesus, remember me when you come into your kingdom.\"* That was it. No baptism. No resolution to do better. No good column to point to. Just a man at the final hour of his life, turning his head and calling. Jesus answered him: *\"Today you will be with me in paradise.\"*",
        "That is the entire story, compressed. The criminal had no time to walk it out. No time to attend church, read his Bible, or repair his relationships. He had one turn and one call, and that was enough, because the payment had already been made by the One hanging next to him.",
        "**Timing is not the point. The call is the point.** Whether you are twenty-two or sixty-eight or taking your last breath in a hospital bed, the door is open if you will turn and call.",
      ],
    },
    {
      heading: "But the call is not optional",
      paragraphs: [
        "Here is where many modern Christians get soft, and I will not.",
        "The Bible does not say everyone is saved. It does not say a general respect for Jesus is enough. It does not say you can go on living exactly as you were, unchanged, and collect the gift at the end. *\"If you declare with your mouth, 'Jesus is Lord,' and believe in your heart that God raised him from the dead, you will be saved\"* (Romans 10:9). And: *\"Everyone who calls on the name of the Lord will be saved\"* (Romans 10:13).",
        "**You must call.** Calling is not ambient appreciation. It is not cultural Christianity. It is not checking a box you were raised inside. Calling is turning. It is the conscious choice to stop running your life by your own ledger and start following the One who paid it. That is what the whole Bible means by the word *repentance*. Turning.",
        "And then you walk with Him. Not as a performance. Not as another round of good-column scoring. As the ordinary daily life of someone who has been bought with a price and is no longer his own.",
      ],
    },
    {
      heading: "Where that leaves you",
      paragraphs: [
        "If you worked through those eight questions and realized your ledger is never going to balance, **that is the point.** The questions were not asking you to score yourself. They were asking you to admit that you cannot.",
        "The next move is simple and not easy. It is not a prayer someone else writes for you. It is not a decision you hand to a minister. It is a turn, in your own words, toward the One who already paid. If the criminal on the cross could do it with three sentences as he died, you can do it right now, in the chair you are sitting in, with whatever words you actually have.",
        "Say them to Him. Mean them. Then start walking.",
      ],
    },
  ],
};
