
// USERS

export const users = [
  { username: "ishfaq", email: "ishfaq@example.com", password: "123456" },
  { username: "john_doe", email: "john@example.com", password: "123456" },
  { username: "sara_smith", email: "sara@example.com", password: "123456" },
  { username: "gamer99", email: "gamer@example.com", password: "123456" },
  { username: "musiclover", email: "music@example.com", password: "123456" },
];


//  CHANNELS

export const channels = [
  {
    channelName: "Code with Ishfaq",
    handle: "@ishfaqdev",
    description: "Coding tutorials and dev tips 🚀",
    avatar: "https://i.pravatar.cc/150?img=5",
    channelBanner: "https://picsum.photos/1200/300?random=10",
  },
  {
    channelName: "Daily Vlogs",
    handle: "@johnvlogs",
    description: "Life, travel, and everything fun ✈️",
    avatar: "https://i.pravatar.cc/150?img=12",
    channelBanner: "https://picsum.photos/1200/300?random=11",
  },
  {
    channelName: "Foodie World",
    handle: "@saraeats",
    description: "Delicious recipes and street food 🌮🍕",
    avatar: "https://i.pravatar.cc/150?img=30",
    channelBanner: "https://picsum.photos/1200/300?random=12",
  },
  {
    channelName: "Pro Gamer",
    handle: "@gamer99",
    description: "Streaming the latest games 🎮🔥",
    avatar: "https://i.pravatar.cc/150?img=60",
    channelBanner: "https://picsum.photos/1200/300?random=13",
  },
  {
    channelName: "Music Beats",
    handle: "@musiclover",
    description: "Latest tracks, remixes & covers 🎵",
    avatar: "https://i.pravatar.cc/150?img=70",
    channelBanner: "https://picsum.photos/1200/300?random=14",
  },
];

// Helper: Random recent date
const randomDate = (daysAgo = 10) =>
  new Date(Date.now() - Math.random() * daysAgo * 24 * 60 * 60 * 1000).toISOString();


// VIDEOS

export const videos = [
  // ========== Tech ==========
  {
    title: "Learn React in 10 Minutes 🚀",
    description: "Quick crash course on React basics with live demo.",
    videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    thumbnail: "https://img.youtube.com/vi/bMknfKXIFA8/hqdefault.jpg",
    category: "Web Development",
    views: 1200,
    createdAt: randomDate(15),
    channel: channels[0],
  },
  {
    title: "JavaScript DOM Tutorial 📘",
    description: "Everything you need to know about the DOM in JS.",
    videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_2mb.mp4",
    thumbnail: "https://img.youtube.com/vi/0ik6X4DJKCc/hqdefault.jpg",
    category: "Web Development",
    views: 850,
    createdAt: randomDate(8),
    channel: channels[0],
  },
  {
    title: "CSS Animations Explained 🎨",
    description: "A full guide to CSS animations and transitions.",
    videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_3mb.mp4",
    thumbnail: "https://img.youtube.com/vi/YszONjKpgg4/hqdefault.jpg",
    category: "Web Development",
    views: 640,
    createdAt: randomDate(12),
    channel: channels[0],
  },

  // ========== Food ==========
  {
    title: "Street Food Tour 🌮🍜",
    description: "Exploring the best street food around the city.",
    videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_5mb.mp4",
    thumbnail: "https://picsum.photos/400/250?random=101",
    category: "Travel",
    views: 4000,
    createdAt: randomDate(6),
    channel: channels[2],
  },
  {
    title: "Top 5 Breakfast Recipes 🥞🍳",
    description: "Easy and healthy breakfast ideas to start your day.",
    videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_10mb.mp4",
    thumbnail: "https://picsum.photos/400/250?random=102",
    category: "Food",
    views: 2000,
    createdAt: randomDate(4),
    channel: channels[2],
  },

  // ========== Fitness ==========
  {
    title: "Morning Yoga Routine 🧘‍♂️",
    description: "Start your day with peaceful yoga stretches.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    thumbnail: "https://picsum.photos/400/250?random=103",
    category: "Lifestyle",
    views: 3200,
    createdAt: randomDate(10),
    channel: channels[1],
  },
  {
    title: "Pushups Challenge 💪",
    description: "Can you do 50 pushups in one go? Challenge accepted!",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail: "https://picsum.photos/400/250?random=104",
    category: "Lifestyle",
    views: 2100,
    createdAt: randomDate(3),
    channel: channels[1],
  },

  // ========== Travel ==========
  {
    title: "Top 10 Places to Visit in Kashmir 🏔️",
    description: "Scenic beauty and travel guide to Kashmir.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    thumbnail: "https://picsum.photos/400/250?random=105",
    category: "Travel",
    views: 8000,
    createdAt: randomDate(7),
    channel: channels[1],
  },
  {
    title: "Sunset Time-lapse 🌅",
    description: "Relax and unwind with this peaceful sunset video.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnail: "https://picsum.photos/400/250?random=106",
    category: "Travel",
    views: 1800,
    createdAt: randomDate(5),
    channel: channels[1],
  },

  // ========== Entertainment (Shorts) ==========
  {
    title: "Funny Cat Short 🐱😂",
    description: "Cats being hilarious in 20 seconds.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnail: "https://picsum.photos/400/700?random=107",
    category: "Entertainment",
    views: 9500,
    createdAt: randomDate(2),
    channel: channels[1],
    isShort: true,
  },
  {
    title: "Dance Challenge 💃🔥",
    description: "30-second viral dance challenge you must try!",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    thumbnail: "https://picsum.photos/400/700?random=108",
    category: "Entertainment",
    views: 12000,
    createdAt: randomDate(1),
    channel: channels[1],
    isShort: true,
  },

  // ========== Gaming ==========
  {
    title: "PUBG Pro Gameplay 🎮",
    description: "Insane squad match highlights!",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnail: "https://picsum.photos/400/250?random=109",
    category: "Gaming",
    views: 15000,
    createdAt: randomDate(9),
    channel: channels[3],
  },
  {
    title: "Minecraft Build Ideas ⛏️",
    description: "Creative structures and design inspiration!",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    thumbnail: "https://picsum.photos/400/250?random=110",
    category: "Gaming",
    views: 9000,
    createdAt: randomDate(11),
    channel: channels[3],
  },

  // ========== Music ==========
  {
    title: "Lo-Fi Chill Beats 🎵",
    description: "Relax and study with calm Lo-Fi background music.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    thumbnail: "https://picsum.photos/400/250?random=111",
    category: "Music",
    views: 22000,
    createdAt: randomDate(3),
    channel: channels[4],
  },
  {
    title: "Top 10 Bollywood Songs 🎶",
    description: "Enjoy the latest and trending Bollywood hits.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail: "https://picsum.photos/400/250?random=112",
    category: "Music",
    views: 30000,
    createdAt: randomDate(6),
    channel: channels[4],
  },

  // ========== Coding Meme Shorts ==========
  {
    title: "Coding Meme 😂👨‍💻",
    description: "Relatable programming meme for all devs.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    thumbnail: "https://picsum.photos/300/500?random=113",
    category: "Web Development",
    views: 5000,
    createdAt: randomDate(2),
    channel: channels[0],
    isShort: true,
  },
];
