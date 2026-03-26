export interface Highlight {
  timestamp: string;
  text: string;
}

export interface Podcast {
  id: string;
  title: string;
  host: string;
  description: string;
  coverColor: string;
  textColor: string;
  tags: string[];
}

export const podcasts: Podcast[] = [
  {
    id: "wtf-podcast",
    title: "The WTF Podcast",
    host: "Nikhil Kamath",
    description: "Deep, unscripted explorations with founders, builders, and visionaries shaping the future.",
    coverColor: "bg-wtf-orange",
    textColor: "text-wtf-black",
    tags: ["Startups & VC", "Economics", "Society & Law", "Tech & AI"]
  },
  {
    id: "figuring-out",
    title: "Figuring Out",
    host: "Raj Shamani",
    description: "An authoritative guide to business, relationships, politics, and health — figuring out how to grow daily to live and love better.",
    coverColor: "bg-[#3B82F6]",
    textColor: "text-wtf-white",
    tags: ["Startups & VC", "Creators", "Health & Mind", "Society & Law"]
  },
  {
    id: "builders-log",
    title: "The Builder's Log",
    host: "Echoes Core",
    description: "Raw technical dialogues dissecting application architecture, zero-to-one product building, and engineering culture.",
    coverColor: "bg-[#22C55E]",
    textColor: "text-white",
    tags: ["Tech & AI", "Creators", "Startups & VC"]
  },
  {
    id: "mind-matter",
    title: "Mind & Matter",
    host: "Dr. Aryan Sharma",
    description: "Deconstructing the human condition through synthetic biology, cognitive science, and performance models.",
    coverColor: "bg-[#8B5CF6]",
    textColor: "text-white",
    tags: ["Health & Mind", "Science", "Society & Law"]
  },
  {
    id: "creator-capital",
    title: "Creator Capital",
    host: "Network Archives",
    description: "Analyzing the modern business of audience building, media empires, and the vast decentralization of attention.",
    coverColor: "bg-[#EAB308]",
    textColor: "text-black",
    tags: ["Creators", "Economics"]
  },
  {
    id: "the-opponents",
    title: "The Opponents",
    host: "Podcast Host",
    description: "Inspiring comeback stories, sports resilience, and examining the ultimate competitive mindset.",
    coverColor: "bg-[#00E5FF]",
    textColor: "text-wtf-black",
    tags: ["Sports", "Health & Mind", "Resilience"]
  }
];

export interface TheOpponentsEpisode {
  id: string;
  number: string;
  isNew?: boolean;
  date: string;
  duration: string;
  title: string;
  guest: string;
  description: string;
  tags: string[];
}

export const theOpponentsEpisodes: TheOpponentsEpisode[] = [
  {
    id: "op-01",
    number: "01",
    isNew: true,
    date: "Aug 2024",
    duration: "1 hr 10 min",
    title: "A Devastating Cycling Accident & Extraordinary Comeback Mission",
    guest: "Vic Williamson",
    description: "Olympic track cyclist Vic Williamson recounts the catastrophic crash that left her millimeters from paralysis, and her grueling 'zero to hero' rehab journey.",
    tags: ["SPORTS", "RESILIENCE", "HEALTH & MIND"]
  }
];

export interface FiguringOutEpisode {
  id: string;
  number: string;
  isNew?: boolean;
  date: string;
  duration: string;
  title: string;
  guest: string;
  description: string;
  tags: string[];
}

export const figuringOutEpisodes: FiguringOutEpisode[] = [
  {
    id: "fo-484",
    number: "484",
    isNew: true,
    date: "Jul 2025",
    duration: "1 hr 45 min",
    title: "The Invisible Nuclear Bomb — Strait of Hormuz & Global Economy",
    guest: "Lt Col Narender",
    description: "A deep geopolitical breakdown of how one narrow waterway controls the world's energy supply and can trigger economic catastrophe overnight.",
    tags: ["GEOPOLITICS", "ECONOMICS"]
  },
  {
    id: "fo-483",
    number: "483",
    date: "Jul 2025",
    duration: "2 hr 10 min",
    title: "Inside Dawood's Empire: Fake Currency, Drug Routes & Bar Mafia",
    guest: "Vivek Agrawal",
    description: "A chilling investigation into the financial and criminal networks that sustain one of the world's most notorious crime syndicates.",
    tags: ["SOCIETY", "CRIME"]
  },
  {
    id: "fo-482",
    number: "482",
    date: "Jul 2025",
    duration: "1 hr 58 min",
    title: "World War 3, Iran-Israel War, Trump, UAE Conflict & PM Modi",
    guest: "Major Sudeep",
    description: "Military-grade analysis of escalating global tensions, nuclear brinkmanship, and India's strategic positioning in the new world order.",
    tags: ["GEOPOLITICS", "DEFENSE"]
  },
  {
    id: "fo-476",
    number: "476",
    date: "Jun 2025",
    duration: "1 hr 32 min",
    title: "India's Future, Trust Crisis, Gen Z Burnout, Anxiety & AI Friends",
    guest: "Simon Sinek",
    description: "The legendary leadership thinker addresses an anxious generation, the erosion of institutional trust, and why AI companions won't solve loneliness.",
    tags: ["LEADERSHIP", "MENTAL HEALTH"]
  },
  {
    id: "fo-477",
    number: "477",
    date: "Jun 2025",
    duration: "1 hr 48 min",
    title: "Bollywood's Reality, Father's Death, Career & Value of a Home",
    guest: "Suniel Shetty",
    description: "A vulnerable, unfiltered conversation about grief, the brutality of the film industry, and what truly matters when the cameras stop rolling.",
    tags: ["ENTERTAINMENT", "LIFE LESSONS"]
  },
  {
    id: "fo-mallya",
    number: "Special",
    date: "Jun 2025",
    duration: "4 hr 18 min",
    title: "The Vijay Mallya Interview — The Untold Story",
    guest: "Vijay Mallya",
    description: "A historic 4-hour interview with one of India's most controversial business figures, exploring his empire's rise, collapse, and exile. 20M+ views in 4 days.",
    tags: ["BUSINESS", "CONTROVERSY"]
  },
  {
    id: "fo-macron",
    number: "470",
    date: "May 2025",
    duration: "1 hr 15 min",
    title: "The Future of Europe, India-France Relations & Global Order",
    guest: "Emmanuel Macron",
    description: "An unprecedented sit-down with the President of France discussing Indo-European trade corridors, nuclear energy, and the shifting power balance.",
    tags: ["GEOPOLITICS", "LEADERSHIP"]
  },
  {
    id: "fo-gates",
    number: "465",
    date: "Apr 2025",
    duration: "1 hr 22 min",
    title: "AI, Global Health, India's Potential & Giving Away Billions",
    guest: "Bill Gates",
    description: "The philanthropist and tech legend on why India will lead the next decade, the future of global health infrastructure, and why giving away money is harder than making it.",
    tags: ["TECHNOLOGY & AI", "PHILANTHROPY"]
  },
  {
    id: "fo-kjo",
    number: "460",
    date: "Mar 2025",
    duration: "1 hr 55 min",
    title: "Bollywood Politics, Nepotism Debate, Mental Health & Reinvention",
    guest: "Karan Johar",
    description: "A brutally honest conversation about creative reinvention, dealing with public hate, therapy stigma, and the changing economics of Hindi cinema.",
    tags: ["ENTERTAINMENT", "MENTAL HEALTH"]
  },
  {
    id: "fo-narcissism",
    number: "455",
    date: "Dec 2024",
    duration: "1 hr 37 min",
    title: "Narcissism, Toxic Relationships, Manipulation & Elon Musk",
    guest: "Havovi Hyderabadwalla",
    description: "A clinical psychologist decodes the science of narcissism, emotional manipulation tactics, and the psychology behind the world's most polarizing figures.",
    tags: ["PSYCHOLOGY", "RELATIONSHIPS"]
  },
  {
    id: "fo-shiprocket",
    number: "450",
    date: "Nov 2024",
    duration: "1 hr 00 min",
    title: "How To Start A Business With ₹25K? Ideas, Plan & Marketing",
    guest: "Saahil Goel (Shiprocket)",
    description: "The founder of India's largest e-commerce shipping platform shares a step-by-step blueprint for starting a business with almost no capital.",
    tags: ["STARTUPS", "BUSINESS"]
  },
  {
    id: "fo-parenting",
    number: "445",
    date: "Oct 2024",
    duration: "1 hr 54 min",
    title: "Parenting Mistakes, Raising A Child & Psychology",
    guest: "Schweta Gandhi",
    description: "A child psychology expert exposes the most common parenting failures and provides evidence-based frameworks for raising emotionally resilient children.",
    tags: ["PARENTING", "PSYCHOLOGY"]
  },
  {
    id: "fo-smriti",
    number: "440",
    date: "Sep 2024",
    duration: "1 hr 40 min",
    title: "Politics, Women in Power, Media Trials & Personal Resilience",
    guest: "Smriti Irani",
    description: "A no-holds-barred conversation about navigating Indian politics as a woman, media scrutiny, and rebuilding yourself after public setbacks.",
    tags: ["POLITICS", "LEADERSHIP"]
  },
  {
    id: "fo-discipline",
    number: "435",
    date: "Aug 2024",
    duration: "1 hr 28 min",
    title: "Talent Doesn't Get You Anywhere — Discipline Does",
    guest: "Raj Shamani (Solo)",
    description: "A powerful solo episode breaking down why raw talent is meaningless without obsessive discipline, and the daily systems that compound into extraordinary results.",
    tags: ["PRODUCTIVITY", "SELF-IMPROVEMENT"]
  },
  {
    id: "fo-gaming",
    number: "430",
    date: "Jul 2024",
    duration: "1 hr 12 min",
    title: "Gaming Is The Future: Why Brands Are Investing Billions",
    guest: "Industry Panel",
    description: "Why the gaming industry will surpass every other entertainment vertical, and the massive brand opportunities hiding inside virtual worlds.",
    tags: ["TECHNOLOGY", "BUSINESS"]
  }
];

export interface TranscriptLine {
  speaker: string;
  timestamp: string;
  content: string;
}

export interface MindmapNodeData {
  id: string;
  label: string;
  category: 'core' | 'tech' | 'phil' | 'biz' | 'example';
  children?: string[];
}

export interface Episode {
  id: string;
  number: string;
  podcastId?: string;
  series?: string;
  isNew?: boolean;
  date: string;
  duration: string;
  title: string;
  guest: string;
  description: string;
  tags: string[];
  invisibleTags?: string[];
  transcript?: string;
  parsedTranscript?: TranscriptLine[];
  summary: string;
  mindmapUrl?: string;
  mindmapNodes?: MindmapNodeData[];
  highlights?: string[];
  keyLessons?: string[];
  audioSrc?: string;
}

const defaultMindmap = "https://lh3.googleusercontent.com/aida-public/AB6AXuBY4EHthYSZRBk_WFtdxTp97tahAseh3BmODBJNkD8DBSJtn2IhSskmdR-r1T_nI-pgLt6bA-bRYqf38up9QR4C7-kdyNCLXedpSvEqJbIeRM3AJvtM1YIJoOVOO5K_BCS4t7kmf8GKX0L2Hjy1AcG-JQVjzgeipq90z1FkYgloirizWTht86PqbkpFeF6cI34_MkpzFcwupSjskTSkVlLCIa6RIC3qGz4-GydQo1NRRrTrHhteHC6ALE84KhDS9VdvoYkLEwgjAUs";

export const episodes: Episode[] = [
  {
    id: "op-01",
    number: "01",
    series: "The Opponents",
    isNew: true,
    date: "Aug 2024",
    duration: "1 hr 10 min",
    title: "A Devastating Cycling Accident & Extraordinary Comeback Mission - Vic Williamson",
    guest: "Vic Williamson",
    description: "Olympic track cyclist Vic Williamson recounts the catastrophic crash that left her millimeters from paralysis, and her grueling 'zero to hero' rehab journey.",
    tags: ["SPORTS", "RESILIENCE"],
    summary: "Olympic cyclist Vic Williamson recounts her miraculous survival of a velodrome crash that left her with a broken neck, back, and pelvis — and the 752-day mission to return to elite competition.",
    highlights: ["2mm from paralysis", "Project Silverback", "752 days to return"],
  },
  {
    id: "ep-21",
    number: "21",
    series: "People by WTF",
    isNew: true,
    date: "Nov 28, 2024",
    duration: "1 hr 45 min",
    title: "WTF is Really A.I.?",
    guest: "Yann LeCun",
    description: "The AI 'Founding Father' and Turing Award winner debunks common myths about artificial intelligence. AI as a force multiplier for human intelligence, India's unique AI opportunity, ethical challenges, and the future beyond LLMs.",
    tags: ["TECHNOLOGY & AI"],
    invisibleTags: ["AI", "DeepLearning", "Meta", "TuringAward", "MachineLearning", "YannLeCun"],
    transcript: "Yann, you are considered one of the founding fathers of deep learning...",
    audioSrc: "/audio/ep-00.mp3",
    mindmapNodes: [
      { id: "ai-amplifier", label: "AI as Intelligence Amplifier", category: "core", children: ["ex-climate", "ex-health"] },
      { id: "llm-limits", label: "LLM Limitations", category: "tech", children: ["ex-cat"] },
      { id: "jepa", label: "JEPA Architecture", category: "tech" },
      { id: "open-source", label: "Open Source AI", category: "biz" },
      { id: "ethics", label: "Ethical AI", category: "phil" },
      { id: "india-ai", label: "India's AI Opportunity", category: "biz", children: ["ex-agri"] },
      { id: "world-models", label: "World Models", category: "phil" },
      { id: "ex-climate", label: "Climate Solutions", category: "example" },
      { id: "ex-health", label: "Affordable Healthcare", category: "example" },
      { id: "ex-cat", label: "Cat vs LLM Analogy", category: "example" },
      { id: "ex-agri", label: "Agriculture AI", category: "example" },
    ],
    keyLessons: [
      "AI is not a replacement for human intelligence — it is a force multiplier that amplifies our ability to solve problems.",
      "Current LLMs do not truly understand the world. A cat has more real-world understanding than GPT-4.",
      "Self-supervised learning through architectures like JEPA is the path to machines that actually comprehend reality.",
      "Open-source AI isn't just philosophy — it's a strategy. Whoever defines the open platform defines the standards.",
      "India has a once-in-a-generation opportunity to become a global AI hub, especially in agriculture and healthcare.",
      "Fear of AI destroying humanity is a massive misallocation of anxiety. Focus on real, present dangers like bias and misuse.",
    ],
    parsedTranscript: [
      {
        speaker: "Nikhil Kamath",
        timestamp: "00:00",
        content: "Yann, it is an absolute honor to have you here in India. You are considered one of the founding fathers of modern AI, someone who pioneered [tech: Convolutional Neural Networks]. For the average person listening right now, how do you even begin to explain what happens inside these massive models?"
      },
      {
        speaker: "Yann LeCun",
        timestamp: "00:45",
        content: "Thank you for having me. When we talk about these massive models, people immediately jump to the idea of [phil: human-like consciousness] or terminator scenarios. But fundamentally, we are talking about [tech: Auto-Regressive Large Language Models]. They do not possess a world model. They predict the next word in a sequence based on statistical probabilities."
      },
      {
        speaker: "Nikhil Kamath",
        timestamp: "02:10",
        content: "But they feel so incredibly smart. If they are just predicting the next word, how do they pass the bar exam or write code that a junior engineer would struggle with?"
      },
      {
        speaker: "Yann LeCun",
        timestamp: "02:35",
        content: "Because human language is incredibly structured. Language is a low-bandwidth projection of human thought. The models have read essentially all public text ever produced. But that does not mean they understand physical reality. A cat understands more about the physical world than the most advanced [tech: LLM]. A cat knows that if you push a glass off a table, it will fall and shatter. An [tech: LLM] only knows that the word 'shatter' often follows the words 'glass falling'. That is a profound [phil: epistemological difference]."
      },
      {
        speaker: "Nikhil Kamath",
        timestamp: "04:15",
        content: "So you are saying we are nowhere near [tech: Artificial General Intelligence]?"
      },
      {
        speaker: "Yann LeCun",
        timestamp: "04:22",
        content: "Exactly. To reach human-level AI, we have to abandon the paradigm of just training on more text. We need models that learn from video, from sensors. We need [tech: Joint Embedding Predictive Architectures], what I call JEPA. We need machines that learn [phil: world models] the way a baby does — by observing, predicting, and adjusting. Until we achieve that, the fears of AI destroying humanity are largely a massive [biz: misallocation of anxiety]."
      },
      {
        speaker: "Nikhil Kamath",
        timestamp: "06:05",
        content: "Let us talk about open source. Meta has been championing [tech: Llama], making these powerful models freely available, while your competitors build massive walled gardens. Is open source a philosophical stance or a business strategy?"
      },
      {
        speaker: "Yann LeCun",
        timestamp: "06:25",
        content: "Both. From a scientific perspective, secrecy stifles innovation. The entire history of deep learning was built on the open exchange of ideas. But from a strategic view, an open platform becomes the [biz: foundational layer of the ecosystem]. If everyone builds on your architecture, you define the standards."
      },
      {
        speaker: "Nikhil Kamath",
        timestamp: "08:30",
        content: "You described AI as a force multiplier for human intelligence. Can you elaborate on what that means practically?"
      },
      {
        speaker: "Yann LeCun",
        timestamp: "08:55",
        content: "Think of it this way. A calculator did not replace mathematicians — it made every accountant faster. AI is doing the same thing, but for [phil: cognition itself]. It is not replacing doctors — it is giving a rural health worker in Bihar the diagnostic power of a specialist in Mumbai. It is not replacing farmers — it is giving a smallholder in Madhya Pradesh access to [tech: precision agriculture] data that was previously only available to massive agribusinesses. [biz: AI is the great equalizer]."
      },
      {
        speaker: "Nikhil Kamath",
        timestamp: "11:20",
        content: "You mentioned India specifically. Why do you think India has a unique position in the AI landscape?"
      },
      {
        speaker: "Yann LeCun",
        timestamp: "11:45",
        content: "India has three things that most countries do not have simultaneously: an extraordinary pool of engineering talent, a massive and diverse set of real-world problems to solve, and a young population that is [biz: digitally native]. The problems India faces — [biz: multilingual natural language processing], affordable healthcare, agricultural optimization — these are not just local problems. They are global problems. If Indian engineers solve them, they solve them for the entire developing world."
      },
      {
        speaker: "Nikhil Kamath",
        timestamp: "14:00",
        content: "What about climate change? Can AI actually move the needle there, or is that just tech hype?"
      },
      {
        speaker: "Yann LeCun",
        timestamp: "14:15",
        content: "It is not hype. Climate change involves [tech: extraordinarily complex datasets] — atmospheric simulations, ocean current models, energy grid optimization. These are problems that overwhelm human cognitive capacity. AI can analyze these datasets, simulate outcomes across thousands of scenarios, and identify solutions that no human team could find in a reasonable timeframe. It is also critical for [biz: carbon footprint tracking] in supply chains — something that will become mandatory regulation within the decade."
      },
      {
        speaker: "Nikhil Kamath",
        timestamp: "17:30",
        content: "Now, the elephant in the room. Everybody is terrified. Elon Musk says AI is an [phil: existential risk]. What is your honest take?"
      },
      {
        speaker: "Yann LeCun",
        timestamp: "17:50",
        content: "I respect Elon, but I fundamentally disagree on this point. Current AI systems are not dangerous in the existential sense. They are tools. A hammer can be used to build a house or to hurt someone — we do not ban hammers. The real dangers of AI are mundane, present, and solvable: bias in hiring algorithms, [phil: deepfake misinformation], surveillance overreach by governments. These are [phil: ethical engineering challenges], not science fiction."
      },
      {
        speaker: "Nikhil Kamath",
        timestamp: "20:15",
        content: "How do we solve those? Is regulation the answer?"
      },
      {
        speaker: "Yann LeCun",
        timestamp: "20:30",
        content: "Regulation has a role but it must be smart regulation. You cannot regulate what you do not understand. That is why I believe [phil: scientists must step outside the lab] and engage in public discourse. The worst possible outcome is regulation written by people who have never trained a model, who do not understand what [tech: gradient descent] does, who think AI is magic instead of math. Transparency, open research, and public engagement are the strongest safeguards."
      },
      {
        speaker: "Nikhil Kamath",
        timestamp: "23:00",
        content: "If you had to give one piece of advice to a young engineer in India listening to this right now, aspiring to work in AI — what would it be?"
      },
      {
        speaker: "Yann LeCun",
        timestamp: "23:20",
        content: "Do not just follow the hype cycle. Everyone is building chatbots and [tech: fine-tuning LLMs] right now. That is important, but the real frontier is elsewhere. Learn about [tech: self-supervised learning], study [tech: energy-based models], look at [tech: video understanding]. The next major breakthrough in AI will not come from making current systems bigger. It will come from a fundamentally new architecture — and the person who builds it could very well be sitting in Bangalore or Hyderabad right now."
      },
      {
        speaker: "Nikhil Kamath",
        timestamp: "25:40",
        content: "And on the difference between an engineer and a scientist — where do you see yourself?"
      },
      {
        speaker: "Yann LeCun",
        timestamp: "25:55",
        content: "An engineer creates new things. A scientist tries to understand the world. The best people in AI are a bit of both. I build systems, yes, but what drives me is [phil: understanding intelligence itself]. Why does a two-year-old learn faster from five examples than a trillion-parameter model learns from five trillion tokens? That is the question that has consumed my entire career, and we still do not have the answer."
      }
    ],
    summary: "A masterclass in AI fundamentals from the man who helped invent convolutional neural networks. Yann LeCun debunks AGI fears, explains why LLMs cannot truly understand the world, advocates for open-source AI, and issues a call to action for India's young AI engineers.",
    mindmapUrl: defaultMindmap,
    highlights: ["AI is a force multiplier for human intelligence, not a replacement.", "Current LLMs do not understand physical reality — a cat has more real-world intelligence.", "Self-supervised learning and JEPA are the path to truly intelligent machines.", "India is uniquely positioned to become a global AI hub.", "The real AI dangers are bias, deepfakes, and surveillance — not sci-fi apocalypse.", "Open-source AI defines the standards of the ecosystem."]
  },
  {
    id: "ep-16",
    number: "16",
    series: "WTF is",
    isNew: true,
    date: "Mar 2024",
    duration: "2 hr +",
    title: "What character 'flaws' make the best entrepreneurs?",
    guest: "Ritesh Agarwal, Ghazal Alagh, Manish Poddar",
    description: "Nikhil Kamath discusses risk-taking, spotting opportunities, dealing with failure, and the 'flaws' that make great entrepreneurs with Ritesh Agarwal (OYO), Ghazal Alagh (Mamaearth), and Manish Poddar (Rare Rabbit).",
    tags: ["STARTUPS & VC", "BUSINESS & ECONOMICS"],
    invisibleTags: ["Entrepreneurship", "RiteshAgarwal", "GHazalAlagh", "ManishPoddar", "OYO", "Mamaearth", "RareRabbit", "NikhilKamath", "WTF"],
    transcript: "Welcome to this episode where we talk about the flaws that make great founders...",
    summary: "A breakdown of the entrepreneurial mindset with founders of OYO, Mamaearth, and Rare Rabbit, exploring risk, failure, and unlearning.",
    mindmapUrl: defaultMindmap,
    highlights: ["Embracing character flaws as strengths.", "Dealing with intense, public failures.", "Spotting opportunities in chaos."],
    parsedTranscript: [
      {
        speaker: "Nikhil Kamath",
        timestamp: "00:00",
        content: "Welcome to another episode of WTF. Today we are exploring a very specific counter-intuitive idea: What character 'flaws' make the best entrepreneurs? With me are three people who have built massive companies: Ritesh from OYO, Ghazal from Mamaearth, and Manish from Rare Rabbit. Ritesh, let's start with you. What's a flaw you have that actually helped you build OYO?"
      },
      {
        speaker: "Ritesh Agarwal",
        timestamp: "01:15",
        content: "I think my biggest [phil: flaw] early on was sheer, unadulterated [biz: stubbornness] and maybe naive optimism. When I started travelling and staying in these budget hotels, everyone in the hospitality industry told me that standardizing unbranded, fragmented hotels was a fool's errand. They said it was a structurally broken market."
      },
      {
        speaker: "Nikhil Kamath",
        timestamp: "02:30",
        content: "So you just refused to listen to the experts?"
      },
      {
        speaker: "Ritesh Agarwal",
        timestamp: "02:45",
        content: "Exactly. If you are a completely rational, balanced person who listens to industry veterans, you will never attempt to build something completely disruptive. You have to be slightly delusional to look at a chaotic market and say, 'I can fix this.' That stubbornness was a flaw in school, but it was a superpower in business."
      },
      {
        speaker: "Ghazal Alagh",
        timestamp: "05:10",
        content: "I resonate with that heavily. For me, it wasn't just stubbornness, it was this intense, almost obsessive [phil: paranoia]. When we started Mamaearth, the D2C space was incredibly crowded. My flaw was that I couldn't stop worrying about everything that could go wrong with a product formulation."
      },
      {
        speaker: "Nikhil Kamath",
        timestamp: "06:20",
        content: "Paranoia usually paralyzes people. How did it help you build a brand that reached a $1B valuation?"
      },
      {
        speaker: "Ghazal Alagh",
        timestamp: "06:35",
        content: "Because in the maternal and baby care market, paranoia translates to [biz: extreme quality control]. I didn't trust any chemical, any standard industry certification. I wanted our own checks, our own standards. My paranoia became our brand's core value proposition: 100% toxin-free. If I was a deeply relaxed person, we would have just launched another average shampoo."
      },
      {
        speaker: "Manish Poddar",
        timestamp: "09:50",
        content: "I'll add another one. [biz: Micro-management]. Every business book tells you that a good leader delegates. They tell you to step back and let experts handle things. But in the fashion and retail business, especially when you are building a pure play brand like Rare Rabbit, the aesthetic is everything."
      },
      {
        speaker: "Nikhil Kamath",
        timestamp: "11:05",
        content: "So you refused to delegate?"
      },
      {
        speaker: "Manish Poddar",
        timestamp: "11:15",
        content: "I delegated operations, sure. But the creative vision? The exact shade of a fabric or the lighting in a store? I micro-managed it to death. Board members told me it was a flaw, that it wouldn't scale. But that [phil: intense creative control] is the only reason the brand DNA remained intact as we expanded from 1 store to 100."
      },
      {
        speaker: "Nikhil Kamath",
        timestamp: "14:00",
        content: "This is fascinating. All three of you took traits that society actively tries to train out of us—stubbornness, paranoia, micromanagement—and weaponized them. Ghazal, what about dealing with public failure? Does paranoia make that harder?"
      },
      {
        speaker: "Ghazal Alagh",
        timestamp: "14:35",
        content: "Actually, it builds an impenetrable skin. When you are deeply paranoid about the product, you know the truth of what you've built. When public backlash happens, and it always does in the D2C world, a founder who lacks the 'flaw' of being dangerously unaffected by outside noise usually fails early. It reads as arrogance to the outside world, but it's a necessary shield."
      },
      {
        speaker: "Ritesh Agarwal",
        timestamp: "17:20",
        content: "To add to Ghazal's point, dealing with intense public scrutiny requires you to compartmentalize. Another 'flaw' of mine is that I can be completely emotionally detached when analyzing a business failure. We had massive pushback in certain markets. If I took it personally, I would have burned out at 22. Instead, you look at it purely as data."
      },
      {
        speaker: "Nikhil Kamath",
        timestamp: "20:05",
        content: "So if someone is listening to this, and they have always been told they are completely unreasonable or obsessed with details, your advice would be...?"
      },
      {
        speaker: "Manish Poddar",
        timestamp: "20:25",
        content: "Don't fix it. Channel it. Find an industry where your specific neurosis is a competitive advantage. The world is built by unreasonable people."
      }
    ]
  },
  {
    id: "ep-20",
    number: "20",
    series: "WTF is",
    date: "Jan 28, 2026",
    duration: "1 hr 24 min",
    title: "WTFund Cohort 3 (17 Young Founders)",
    guest: "17 Young Founders",
    description: "A deep dive into the minds and ideas of young founders from the 3rd WTFund cohort who received non-dilutive grants — including Prava, Astraeus Innovus, Turocrates AI, and AntiMattr.",
    tags: ["STARTUPS & VC"],
    invisibleTags: ["Startups", "Entrepreneurship", "Grants", "Youth", "WTFund"],
    transcript: "Welcome to this episode where we meet 17 incredible young founders... [Transcript preview]",
    summary: "An exploration of the visionary ideas and resilience demonstrated by the latest WTFund cohort, highlighting the future of Indian entrepreneurship.",
    mindmapUrl: defaultMindmap,
    highlights: ["Age is no barrier to building massive companies.", "Non-dilutive grants are changing the early-stage landscape."]
  },
  {
    id: "ep-19",
    number: "19",
    series: "People by WTF",
    date: "Jan 10, 2026",
    duration: "1 hr 42 min",
    title: "H.E. Omar Sultan Al Olama (The Case for Youth in Politics)",
    guest: "Omar Sultan Al Olama",
    description: "A conversation with the UAE's youngest and the world's first AI Minister about AI governance, taxes, and youth in politics.",
    tags: ["SOCIETY & GOVERNANCE", "TECHNOLOGY & AI"],
    invisibleTags: ["ArtificialIntelligence", "Governance", "Geopolitics", "Leadership", "UAE"],
    transcript: "Today we are joined by His Excellency Omar Sultan Al Olama... [Transcript preview]",
    summary: "The UAE's AI Minister shares his unique perspective on integrating artificial intelligence into national governance and the critical need for youth representation in politics.",
    mindmapUrl: defaultMindmap,
    highlights: ["AI governance requires proactive, not reactive, legislation.", "Youth in politics breaks legacy thinking."]
  },
  {
    id: "ep-18",
    number: "18",
    series: "People by WTF",
    date: "Mar 02, 2026",
    duration: "1 hr 30 min",
    title: "Pain, Power & The Game Nobody Wins",
    guest: "Chamath Palihapitiya",
    description: "An exploration of Chamath's childhood, his investment frameworks, making and losing billions, and his thoughts on pain as a prerequisite for scale.",
    tags: ["BUSINESS & ECONOMICS", "STARTUPS & VC"],
    invisibleTags: ["Investing", "Psychology", "VentureCapital", "Tech", "Chamath"],
    transcript: "Chamath, it is great to have you... [Transcript preview]",
    summary: "A raw conversation about the psychological drivers of extreme success, the realities of venture capital, and the shifting landscape of global tech power.",
    mindmapUrl: defaultMindmap,
    highlights: ["Success often stems from deep-seated childhood pain.", "Sovereign AI will be the new nuclear deterrent."]
  },
  {
    id: "ep-17",
    number: "17",
    series: "People by WTF",
    date: "Feb 24, 2026",
    duration: "1 hr 02 min",
    title: "The AI Tsunami is Here & Society Isn't Ready",
    guest: "Dario Amodei",
    description: "Anthropic's CEO discusses the AI revolution, the potential for AI consciousness, scaling laws, the future of coding, and the economic and geopolitical implications of AGI.",
    tags: ["TECHNOLOGY & AI"],
    invisibleTags: ["AI", "FutureOfWork", "Technology", "Ethics", "Anthropic", "DarioAmodei"],
    transcript: "Dario, the scale at which AI is moving is terrifying to some... [Transcript preview]",
    summary: "An inside look at the frontier of artificial intelligence, scaling laws, and the ethical imperatives required to safely deploy superintelligent systems.",
    mindmapUrl: defaultMindmap,
    highlights: ["Scaling laws are ruthlessly predictable.", "We are physically unprepared for the cognitive revolution taking place."]
  },
  {
    id: "ep-15",
    number: "15",
    series: "WTF is",
    date: "Dec 20, 2025",
    duration: "1 hr 05 min",
    title: "WTF Is Wealth? Ray Dalio Breaks It Down",
    guest: "Ray Dalio",
    description: "The legendary hedge fund manager breaks down what money really is, why asset bubbles form, portfolio construction strategies, and the forces driving global economies.",
    tags: ["BUSINESS & ECONOMICS"],
    invisibleTags: ["Finance", "Economics", "WealthManagement", "Macro", "RayDalio"],
    transcript: "What is wealth, really? Ray Dalio explains... [Transcript preview]",
    summary: "Ray Dalio decodes the macroeconomic machine, explaining how historical cycles predict modern financial outcomes and the true definition of wealth.",
    mindmapUrl: defaultMindmap,
    highlights: ["Cash is not a safe investment.", "Understand the macro cycles to survive the micro volatility."]
  },
  // ep-06 ("WTF is Beauty? Tira...") removed — consolidated into the richer ep-06 entry below ("WTF is Fueling India's Beauty & Skincare Revolution?")
  {
    id: "ep-14",
    number: "14",
    series: "People by WTF",
    date: "Aug 23, 2025",
    duration: "1 hr 29 min",
    title: "From Iran to Uber CEO",
    guest: "Dara Khosrowshahi",
    description: "The Uber CEO shares lessons on competition, quick commerce, EVs, and turning the ride-hailing giant into a super app.",
    tags: ["BUSINESS & ECONOMICS", "TECHNOLOGY & AI"],
    invisibleTags: ["Mobility", "Leadership", "TechGiant", "BusinessStrategy", "Uber"],
    transcript: "Dara, leading Uber through its wildest times... [Transcript preview]",
    summary: "Dara Khosrowshahi discusses his immigrant journey, the turnaround of Uber's culture, and the strategic push towards electric vehicles and super-app dominance.",
    mindmapUrl: defaultMindmap,
    highlights: ["Culture eats strategy for breakfast, but execution eats both.", "The future of mobility is shared and electric."]
  },
  {
    id: "ep-13",
    number: "13",
    series: "People by WTF",
    date: "Aug 14, 2025",
    duration: "1 hr 23 min",
    title: "How to Win When AI Changes Everything",
    guest: "Sam Altman",
    description: "A conversation with OpenAI's CEO regarding the sweeping changes AI will bring to society and how to adapt to them.",
    tags: ["TECHNOLOGY & AI", "SOCIETY & GOVERNANCE"],
    invisibleTags: ["OpenAI", "ArtificialIntelligence", "FutureTech", "Society", "SamAltman"],
    transcript: "Sam, the speed of ChatGPT's adoption broke every record... [Transcript preview]",
    summary: "OpenAI's CEO shares his vision for AGI, its implications on the global workforce, and the necessity for global regulatory frameworks.",
    mindmapUrl: defaultMindmap,
    highlights: ["AI is a tool to amplify human intent.", "We must democratize access to intelligence."]
  },
  {
    id: "ep-12",
    number: "12",
    series: "People by WTF",
    date: "Aug 01, 2025",
    duration: "1 hr 21 min",
    title: "College Degrees Are Becoming Useless",
    guest: "Vinod Khosla",
    description: "The billionaire investor predicts the post-AI world, discussing free education, healthcare, and why passion matters more than ever.",
    tags: ["SOCIETY & GOVERNANCE", "BUSINESS & ECONOMICS"],
    invisibleTags: ["Education", "Investing", "Healthcare", "FutureOfWork", "VinodKhosla"],
    transcript: "Vinod, you've made some bold predictions about doctors and teachers... [Transcript preview]",
    summary: "Vinod Khosla argues that AI will commoditize expertise in law, medicine, and engineering, making passion and adaptability the only future-proof skills.",
    mindmapUrl: defaultMindmap,
    highlights: ["AI will provide free, world-class healthcare to everyone.", "Reinvent your skill sets every five years."]
  },
  {
    id: "ep-11",
    number: "11",
    series: "People by WTF",
    date: "Jun 07, 2025",
    duration: "1 hr 51 min",
    title: "The Future of Storytelling & Streaming Wars",
    guest: "Ted Sarandos",
    description: "Netflix's Co-CEO dives into the streaming wars, the future of the theatre business, and adapting to India's unique market dynamics.",
    tags: ["CREATORS & MEDIA", "BUSINESS & ECONOMICS"],
    invisibleTags: ["Entertainment", "Streaming", "Media", "Business", "Netflix", "TedSarandos"],
    transcript: "Welcome Ted. Let's talk about the attention economy... [Transcript preview]",
    summary: "A deep dive into Netflix's content strategy, the fiercely competitive Indian OTT landscape, and why storytelling transcends geographical borders.",
    mindmapUrl: defaultMindmap,
    highlights: ["Great stories can come from anywhere and be loved everywhere.", "Data informs our decisions, but gut instinct creates hits."]
  },
  {
    id: "ep-10",
    number: "10",
    series: "WTF is",
    date: "May 13, 2025",
    duration: "1 hr 30 min",
    title: "WTF is Traffic? Bengaluru's AI-Powered Future",
    guest: "Bengaluru's Top Cops",
    description: "A deep dive into Bengaluru's notorious traffic woes with the city's senior-most police officers discussing AI traffic signals, urban planning and public transport.",
    tags: ["SOCIETY & GOVERNANCE"],
    invisibleTags: ["UrbanPlanning", "CivicIssues", "Governance", "Infrastructure", "Bengaluru"],
    transcript: "Traffic is the great equalizer in this city... [Transcript preview]",
    summary: "An unfiltered discussion on the infrastructural bottlenecks of India's Silicon Valley and the technological interventions being deployed to manage urban chaos.",
    mindmapUrl: defaultMindmap,
    highlights: ["Traffic is a symptom of poor urban planning, not just too many cars.", "Smart signals using AI are reducing wait times significantly."]
  },
  {
    id: "ep-09",
    number: "09",
    series: "WTF is",
    date: "Mar 20, 2025",
    duration: "1 hr 13 min",
    title: "WTFund Cohort 2 Founders",
    guest: "9 Young Founders",
    description: "Nine startups from the second WTFund cohort share their unfiltered realities of building from the ground up and leveraging AI.",
    tags: ["STARTUPS & VC"],
    invisibleTags: ["Founders", "Entrepreneurship", "Innovation", "WTFund"],
    transcript: "Let's hear directly from the builders... [Transcript preview]",
    summary: "A raw look at early-stage company building, pivoting, finding product-market fit, and competing globally from India.",
    mindmapUrl: defaultMindmap,
    highlights: ["Failure is just data gathering.", "Building globally from Day 1 is no longer optional."]
  },
  {
    id: "ep-08",
    number: "08",
    series: "WTF is",
    date: "Mar 02, 2025",
    duration: "2 hr 10 min",
    title: "WTF are Craft Beverages? Blue Tokai & More",
    guest: "Blue Tokai Founders & Panel",
    description: "Beverage pioneers discuss India's growing appetite for specialty coffee, kombucha, and premium mixers, and the challenges of scaling.",
    tags: ["STARTUPS & VC", "BUSINESS & ECONOMICS"],
    invisibleTags: ["FoodAndBeverage", "D2C", "Scaling", "BlueTokai"],
    transcript: "Indians are finally waking up and spelling their coffee... [Transcript preview]",
    summary: "Exploring the evolution of the Indian palate, the logistics of cold chains, and scaling premium FMCG brands in a price-sensitive market.",
    mindmapUrl: defaultMindmap,
    highlights: ["Premiumization is real across all Indian tier-1 cities.", "Building a supply chain for fresh products is infinitely harder than software."]
  },
  {
    id: "ep-07",
    number: "07",
    series: "WTF is",
    date: "Feb 01, 2025",
    duration: "2 hr 15 min",
    title: "WTF is Longevity?",
    guest: "Bryan Johnson, Nithin Kamath & Panel",
    description: "A panel exploring the future of health, wellness, precision medicine, and anti-aging technologies. Featuring biohacking pioneer Bryan Johnson and Nithin Kamath.",
    tags: ["HEALTH & WELLNESS"],
    invisibleTags: ["Health", "Longevity", "Biohacking", "Wellness", "BryanJohnson", "NithinKamath"],
    transcript: "Can we live forever? Bryan Johnson thinks so... [Transcript preview]",
    summary: "A fascinating debate on biohacking, the ethical implications of radical life extension, and practical wellness habits for the modern entrepreneur.",
    mindmapUrl: defaultMindmap,
    highlights: ["Sleep is the ultimate biohack.", "We must shift medicine from reactive to predictive."]
  },
  {
    id: "ep-06",
    number: "06",
    series: "WTF is",
    date: "Jun 16, 2024",
    duration: "2 hr 10 min",
    title: "WTF is Fueling India's Beauty & Skincare Revolution?",
    guest: "Bhakti Mehta, Shantanu Deshpande, Diipa Büller-Khosla",
    description: "An extensive discussion delving into the Indian beauty and personal care market, entrepreneurship journeys, consumer behaviour, and the $21 billion opportunity in skincare, haircare, and fragrance.",
    tags: ["STARTUPS & VC", "BUSINESS & ECONOMICS"],
    invisibleTags: ["Beauty", "Skincare", "Cosmetics", "Tira", "BombayShavingCompany", "IndeWild"],
    transcript: "Welcome to another episode... [Transcript preview]",
    summary: "A deep dive into the $21 billion Indian beauty market, exploring scaling strategies from founders of Tira, Bombay Shaving Company, and Inde Wild.",
    mindmapUrl: defaultMindmap,
    highlights: ["The Indian beauty market is $21 billion today.", "Hair care is ~55% hair oils.", "Fragrance is the fastest growing segment at 15%.", "Gen Z wants salon-quality at home.", "Bombay Shaving Co captures 15% trimmer market share."],
    parsedTranscript: []
  },
  {
    id: "ep-05",
    number: "05",
    series: "People by WTF",
    date: "Dec 19, 2024",
    duration: "2 hr 05 min",
    title: "Leading a Legacy Conglomerate",
    guest: "Kumar Mangalam Birla",
    description: "The Chairman of the Aditya Birla Group shares insights on leading a legacy, his early days, the meaning of authenticity, and transitioning leadership across generations.",
    tags: ["BUSINESS & ECONOMICS"],
    invisibleTags: ["LegacyBusiness", "Leadership", "Manufacturing", "Conglomerate", "AdityaBirla"],
    transcript: "Leading a conglomerate of this size... [Transcript preview]",
    summary: "Insights into managing massive legacy businesses, transitioning leadership across generations, and maintaining agility in a fast-paced economy.",
    mindmapUrl: defaultMindmap,
    highlights: ["Legacy is built on anticipating the future, not resting on the past.", "Empower managers to act like owners."]
  },
  {
    id: "ep-04",
    number: "04",
    series: "People by WTF",
    date: "Feb 13, 2026",
    duration: "1 hr 24 min",
    title: "Stories, Power & Why Truth Doesn't Matter",
    guest: "Yuval Noah Harari",
    description: "The renowned historian discusses Christianity's core story, religion as fiction, real estate, geopolitical shifts, and why truth often takes a backseat to narrative.",
    tags: ["SOCIETY & GOVERNANCE"],
    invisibleTags: ["History", "Philosophy", "Geopolitics", "YuvalNoahHarari"],
    transcript: "Yuval, we are living in unprecedented times... [Transcript preview]",
    summary: "A philosophical journey examining how shared myths govern human cooperation, the dangers of AI creating new myths, and the fragile state of global truth.",
    mindmapUrl: defaultMindmap,
    highlights: ["Humans control the world because we can cooperate flexibly in large numbers.", "AI is the first technology that can create original myths."]
  },
  {
    id: "ep-03",
    number: "03",
    series: "WTF is",
    date: "Nov 19, 2023",
    duration: "2 hr 30 min",
    title: "WTF does it take to Build Influence Today?",
    guest: "Tanmay Bhat, Prajakta Koli, Ranveer Allahbadia, Nuseir Yassin",
    description: "India's biggest content creators join Nikhil Kamath to decode the creator economy — from algorithmic dependency and platform classism to building a personal brand, monetisation, and why 'influencer' is a dirty word.",
    tags: ["CREATORS & MEDIA"],
    invisibleTags: ["CreatorEconomy", "SocialMedia", "Podcasting", "Influence", "TanmayBhat", "PrajaktaKoli", "RanveerAllahbadia", "NasDaily", "NuseirYassin", "BeerBiceps", "MostlySane", "YouTube"],
    transcript: "The creator economy is maturing rapidly... [Transcript preview]",
    summary: "India's top digital voices share the realities of algorithmic dependency, community building, platform classism, and monetising influence beyond brand deals.",
    mindmapUrl: defaultMindmap,
    highlights: ["Attention is the new oil.", "Consistency beats virality.", "Distribution is the only true moat.", "'Influencer' is a dirty word — it's content creation.", "The bigger the screen, the higher the status."],
    parsedTranscript: []
  },
  {
    id: "ep-02",
    number: "02",
    series: "WTF is",
    date: "Sep 01, 2023",
    duration: "2 hr 29 min",
    title: "WTF is Venture Capital?",
    guest: "Rajan Anandan",
    description: "A comprehensive breakdown of angel investing, venture capital, fund cycles, term sheets, and what VCs look for in founders.",
    tags: ["STARTUPS & VC"],
    invisibleTags: ["VentureCapital", "AngelInvesting", "Finance", "RajanAnandan"],
    transcript: "What happens behind the closed doors of a VC firm? [Transcript preview]",
    summary: "Demystifying the venture capital ecosystem, explaining term sheets, fund economics, and the traits of highly backable founders.",
    mindmapUrl: defaultMindmap,
    highlights: ["We don't invest in ideas; we invest in execution capability.", "A giant market forgives a lot of operational mistakes."]
  },
  {
    id: "ep-01",
    number: "01",
    series: "People by WTF",
    date: "Nov 30, 2025",
    duration: "2 hr 10 min",
    title: "First Principles, Mars & The Future of Humanity",
    guest: "Elon Musk",
    description: "A landmark conversation touching upon first-principles thinking, making life multi-planetary, the existential risk of misaligned AGI, and Tesla's vision for sustainable energy.",
    tags: ["TECHNOLOGY & AI", "BUSINESS & ECONOMICS"],
    invisibleTags: ["Space", "EVs", "Future", "ElonMusk", "Tesla", "SpaceX"],
    transcript: "Elon, humanity's multi-planetary future... [Transcript preview]",
    summary: "An exploration of first-principles thinking, the imperative of making life multi-planetary, and the existential risk of misaligned AGI.",
    mindmapUrl: defaultMindmap,
    highlights: ["Overcome the impossible by breaking it down to physics.", "Earth is the cradle of humanity, but you cannot stay in the cradle forever."]
  },
  {
    id: "ep-08b",
    number: "08",
    series: "People by WTF",
    date: "Apr 10, 2025",
    duration: "1 hr 35 min",
    title: "AI, Curiosity & Giving Away Billions (Part 2)",
    guest: "Bill Gates",
    description: "Bill Gates returns for a second conversation, discussing his relentless drive, childhood curiosity, why giving away money is harder than making it, and how AI could reshape capitalism itself.",
    tags: ["TECHNOLOGY & AI", "SOCIETY & GOVERNANCE"],
    invisibleTags: ["BillGates", "Philanthropy", "AI", "Capitalism", "GatesFoundation"],
    transcript: "Bill, welcome back. Last time we spoke about global health... [Transcript preview]",
    summary: "The philanthropist and tech legend on why India will lead the next decade, the future of global health, and why giving away money is harder than making it.",
    mindmapUrl: defaultMindmap,
    highlights: ["AI will be the most transformative technology since electricity.", "Giving money away effectively requires more rigor than earning it."]
  },
  {
    id: "ep-special",
    number: "Special",
    series: "WTF is",
    date: "Aug 28, 2025",
    duration: "1 hr 48 min",
    title: "WTF is Venture Capital? — 2025 Edition",
    guest: "Deedy Das, Nikunj Kothari, Niko Bonatsos",
    description: "A roundtable with top VCs breaking down the current state of venture capital, emerging sectors, and the impact of AI on startup valuations and deal-making in 2025.",
    tags: ["STARTUPS & VC", "BUSINESS & ECONOMICS"],
    invisibleTags: ["VentureCapital", "Startups", "AI", "Investing"],
    transcript: "The VC landscape has changed dramatically since our first edition... [Transcript preview]",
    summary: "An updated deep-dive into the venture capital ecosystem, AI's impact on startup valuations, and where the smartest money is flowing in 2025.",
    mindmapUrl: defaultMindmap,
    highlights: ["AI-native startups are the new default.", "The best VCs bet on markets, not just teams."]
  },
  {
    id: 'bl-01',
    series: 'Builder\'s Log',
    number: '1',
    podcastId: 'builders-log',
    date: 'March 18, 2026',
    duration: '1 hr 15 min',
    title: 'Architecting for the Unknown',
    guest: 'Sarah Mei',
    description: 'A deep dive into building systems that can bend without breaking. How early technical decisions compound over time.',
    tags: ['Tech & AI', 'Startups & VC'],
    summary: 'We discuss the philosophy of agile architecture, the myth of the "rewrite", and how to design software that embraces changing requirements.',
  },
  {
    id: 'mm-01',
    series: 'Mind & Matter',
    number: '1',
    podcastId: 'mind-matter',
    date: 'March 12, 2026',
    duration: '2 hr 5 min',
    title: 'The Neuroscience of Focus',
    guest: 'Dr. Andrew Huberman',
    description: 'Understanding the biological mechanisms behind sustained attention, dopamine regulation, and flow states.',
    tags: ['Health & Mind', 'Science'],
    summary: 'A masterclass on optimizing the physical brain for deep work, covering light exposure, sleep protocols, and cognitive endurance.',
  },
  {
    id: 'cc-01',
    series: 'Creator Capital',
    number: '1',
    podcastId: 'creator-capital',
    date: 'March 05, 2026',
    duration: '58 min',
    title: 'Leverage and Audience',
    guest: 'Naval Ravikant',
    description: 'Why audience building is the ultimate form of modern leverage, and how content scales infinitely.',
    tags: ['Creators', 'Economics'],
    summary: 'We explore the economics of infinite leverage where code and media allow a single creator to reach millions with zero marginal cost of reproduction.',
  }
];

