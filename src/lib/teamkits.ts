// Team kit (bulk) data transcribed from /custom-football-jerseys-bulk/ and /custom-cricket-shirts-bulk/.
const IK = "https://ik.imagekit.io/gduf8ygq0/products/";

export const swatches = [
  { name: "Black", hex: "#141414" },
  { name: "White", hex: "#f4f4f2" },
  { name: "Purple", hex: "#6d28d9" },
  { name: "Royal Blue", hex: "#1d4ed8" },
  { name: "Sky Blue", hex: "#38bdf8" },
  { name: "Navy", hex: "#1b2545" },
  { name: "Red", hex: "#d62828" },
  { name: "Maroon", hex: "#7a1b2a" },
  { name: "Green", hex: "#16a34a" },
  { name: "Pakistan Green", hex: "#01411c" },
  { name: "Yellow", hex: "#facc15" },
  { name: "Orange", hex: "#f97316" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Gold", hex: "#e2b04a" },
  { name: "Silver", hex: "#c3c7cf" },
];
export const patterns = ["Fade", "Solid", "Stripes", "Sash"] as const;
export type Pattern = (typeof patterns)[number];

export const MIN_QTY = 10;
export const TEAM_RATE_QTY = 12;
export const SMALL_SQUAD_EXTRA = 100;
export const FULL_SLEEVE_EXTRA = 100;

export const gallery = [
  { src: "/team-kits/shaheen-fc-custom-eagle-team-jersey.webp", title: "Shaheen FC eagle kit", text: "Custom sublimation with club crest, team logo and SFC on the chest" },
  { src: "/team-kits/purple-fade-custom-team-jersey-back-name-number.webp", title: "Arqam 07", text: "Player name, number and sponsor printed in gold" },
  { src: "/team-kits/custom-team-football-shorts-with-number.webp", title: "Matching team shorts", text: "Player number on the leg and club badge on the side" },
  { src: "/team-kits/purple-fade-custom-team-jersey-front.webp", title: "Purple fade, front", text: "Fade print with crest and sponsor logo in gold" },
  { src: "/team-kits/brazil-palm-custom-name-number-jersey-back.webp", title: "Brazil palm style", text: "Name and number with a contrast outline" },
  { src: "/team-kits/custom-team-shorts-sublimation-print-closeup.webp", title: "Print up close", text: "Sharp, bright colours printed right into the fabric" },
];

type Kit = { id: string; name: string; text: string; standard: number; best: number; popular?: boolean };

export type SportConfig = {
  sport: "football" | "cricket";
  path: string;
  seoTitle: string;
  seoDescription: string;
  noun: string; // jersey / shirt
  h1: string;
  h1Accent: string;
  heroText: string;
  heroAlt: string;
  pricingTitle: string;
  pricingText: string;
  kits: Kit[];
  quality: { standard: string; best: string };
  builderTitle: string;
  builderText: string;
  defaults: { kit: string; sleeves: "Half" | "Full"; main: string; accent: string; text: string; name: string; number: string; team: string };
  designsTitle: string;
  designsText: string;
  designs: { title: string; image: string; real?: boolean }[];
  galleryTitle: string;
  galleryText: string;
  clientTitle: string;
  clientText: string[];
  included: { t: string; d: string }[];
  stepsTitle: string;
  steps: { t: string; d: string }[];
  whoTitle: string;
  who: string[];
  faqs: { q: string; a: string }[];
  guideTitle: string;
  guide: string[];
  guideLinks: { href: string; label: string }[];
  guideLinkIntro: [string, string];
  otherSport: { href: string; label: string };
};

const realDesigns = [
  { title: "Eagle Strike Style", image: "/team-kits/shaheen-fc-custom-eagle-team-jersey.webp", real: true },
  { title: "Purple Fade Style", image: "/team-kits/purple-fade-custom-team-jersey-front.webp", real: true },
  { title: "Brazil Palm Style", image: "/team-kits/brazil-palm-custom-jersey-front.webp", real: true },
  { title: "Black Custom Print", image: IK + "custom-printed-black-football-jersey-in-pakistan-1.webp" },
];

export const football: SportConfig = {
  sport: "football",
  path: "/custom-football-jerseys-bulk/",
  seoTitle: "Buy Customized Football Team Jerseys at Lowest Price in Pakistan",
  seoDescription: "Buy customized football team jerseys at the lowest price in Pakistan, just Rs 1,000 each with free names, numbers and logo. Min 12 pieces. Free mockup.",
  noun: "jersey",
  h1: "Custom Football Jerseys in Pakistan,",
  h1Accent: "Printed for Your Whole Team",
  heroText: "Your colours, your logo, every player's name and number on the back. Tell us how you want your squad to look and we print every jersey to match, starting at Rs 1,000 a piece for 12 or more.",
  heroAlt: "Custom printed team jerseys with player names and numbers, a real bulk order in Pakistan",
  pricingTitle: "Football Kit Printing Price in Pakistan, Per Piece",
  pricingText: "Same price whether it's a name on the back or a sponsor on the front. Order 12 or more and these team rates apply. Only 10 or 11 players? No problem, it's just Rs 100 more per piece.",
  kits: [
    { id: "jersey", name: "Jersey Only", text: "Just the shirt. Great for futsal nights, office leagues and fan clubs.", standard: 1000, best: 1300 },
    { id: "shorts", name: "Jersey + Shorts", text: "The full match day kit with matching shorts in your team colours.", standard: 1600, best: 2000, popular: true },
    { id: "trouser", name: "Jersey + Trouser", text: "Jersey with full length trousers for training, winter games and warm ups.", standard: 1900, best: 2300 },
  ],
  quality: {
    standard: "Light, breathable sports fabric with a bold, bright print. Perfect for weekly matches, school teams and tournaments.",
    best: "Premium fabric that feels softer and sits better on the body, with richer colours and a proper pro look. Pick this if your team plays all season.",
  },
  builderTitle: "Design Your Team's Football Kit and See the Price Live",
  builderText: "Play with colours, add a name and number, choose your kit. Your quote updates as you go. Send it to us on WhatsApp and we turn it into a proper mockup for free.",
  defaults: { kit: "shorts", sleeves: "Half", main: "Black", accent: "Purple", text: "Gold", name: "ZAIN", number: "10", team: "YOUR TEAM" },
  designsTitle: "Pick a Jersey Design, We'll Customize It for Your Team",
  designsText: "Every jersey in our store can be printed for your squad with your own team name, player names, numbers and colours. Tap a design and we'll start your mockup.",
  designs: [
    ...realDesigns,
    { title: "Barcelona Black Style", image: IK + "barcelona-black-football-jersey-price-in-pakistan-1.webp" },
    { title: "Inter Miami Black Style", image: IK + "inter-miami-black-football-jersey-price-in-pakistan-1.webp" },
    { title: "Argentina Blue Style", image: IK + "argentina-away-blue-football-jersey-price-in-pakistan-1.webp" },
    { title: "Sky Blue Home Style", image: IK + "manchester-city-home-blue-football-jersey-price-in-pakistan-1.webp" },
    { title: "Classic Red Home Style", image: IK + "liverpool-home-red-football-jersey-price-in-pakistan-1.webp" },
    { title: "Pink Statement Style", image: IK + "real-madrid-pink-football-jersey-price-in-pakistan-1.webp" },
    { title: "Emerald Green Style", image: IK + "real-madrid-away-green-football-jersey-price-in-pakistan-1.webp" },
    { title: "Navy Night Style", image: IK + "psg-men-football-jersey-price-in-pakistan-1.webp" },
    { title: "Yellow Samba Style", image: IK + "brazil-football-jersey-price-in-pakistan-1.webp" },
    { title: "Blue Away 2026 Style", image: IK + "manchester-united-away-blue-2026-football-jersey-price-in-pakistan-1.webp" },
    { title: "Third Kit 2026 Style", image: IK + "fc-barcelona-third-kit-2026-football-jersey-price-in-pakistan-1.webp" },
  ],
  galleryTitle: "Fresh From Our Studio: Real Team Football Kits We Printed",
  galleryText: "No stock photos here. These are real jerseys and shorts we printed for teams, photographed in our studio before delivery.",
  clientTitle: "A Squad That Trusted Us With Their Football Kit",
  clientText: [
    "This black and purple fade kit was made for a real team. Every name and every number you see belongs to an actual player, printed in gold so it pops under floodlights.",
    "They shared their idea on WhatsApp, approved the mockup, sent their player list, and this is what landed on their pitch. Your team can be next.",
  ],
  included: [
    { t: "Player names", d: "A different name on the back of every jersey, at no extra cost." },
    { t: "Shirt numbers", d: "Big, clean numbers on the back. Front numbers too if you like." },
    { t: "Team logo or crest", d: "Send your logo, or we can tidy up a rough one for you." },
    { t: "Sponsor branding", d: "Your sponsor, school or company name across the chest." },
    { t: "Any colours, any style", d: "Fades, stripes, sashes or plain. Match your club colours exactly." },
    { t: "Free mockup", d: "See your kit before anything is printed. Change it until it's right." },
  ],
  stepsTitle: "How to Order Custom Football Jerseys in Bulk",
  steps: [
    { t: "Send Your Idea on WhatsApp", d: "Share your colours, logo, a reference picture, or just describe the look. Rough ideas are completely fine." },
    { t: "Get a Free Mockup", d: "Our designer sends a digital preview of your kit. Ask for changes until it looks exactly right." },
    { t: "Share Names, Numbers and Sizes", d: "Send your player list with sizes, then pay a 50% advance to confirm your order and we start printing." },
    { t: "Printed and Delivered", d: "We print, check every single piece, and ship the full set to your door anywhere in Pakistan." },
  ],
  whoTitle: "Made for Every Kind of Football Team in Pakistan",
  who: ["School and college teams", "University sports societies", "Office and corporate leagues", "Futsal and 5 a side groups", "Football academies and clubs", "Tournament organizers", "Friends who play every weekend", "Fan clubs and watch parties"],
  faqs: [
    { q: "What is the minimum order for custom football jerseys?", a: "Our team rate starts at 12 pieces. If your squad is a little smaller, we can still print 10 or 11 pieces at Rs 100 extra per piece." },
    { q: "How much does a custom football kit cost in Pakistan?", a: "For 12 or more pieces, a custom jersey is Rs 1,000 (Rs 1,300 in Best Quality). Jersey with shorts is Rs 1,600 (Rs 2,000 Best Quality), and jersey with full trousers is Rs 1,900 (Rs 2,300 Best Quality). Full sleeves are Rs 100 extra per piece." },
    { q: "Is name and number printing free?", a: "Yes. Every jersey can carry its own player name and number at no extra charge, and your team logo and sponsor are included too." },
    { q: "Can I see the design before you print?", a: "Always. We send you a free digital mockup first and only start printing once you are happy with it." },
    { q: "How much advance do I pay for a bulk jersey order?", a: "Getting a mockup and a quote is completely free. Once you approve the design, a 50% advance confirms your order and we start printing. The remaining 50% is paid when your jerseys are ready." },
    { q: "What is the difference between Standard and Best Quality?", a: "Standard is a light, breathable sports fabric that works great for regular matches. Best Quality uses a premium fabric that feels softer, holds colour better and gives a more professional look, ideal if your team plays all season." },
    { q: "Can I mix sizes in one order?", a: "Yes. Send us a size next to each player's name and we print every jersey in the right size, kids and adults in the same order." },
    { q: "How long does a bulk jersey order take?", a: "It depends on the quantity and how quickly the mockup is approved. We confirm a clear delivery date along with your mockup, so tell us your match or tournament date when you message." },
    { q: "Do you deliver team jerseys outside Lahore?", a: "Yes, we deliver team kits all over Pakistan, including Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Hyderabad and smaller cities too." },
    { q: "Can you make a kit inspired by a club or country style?", a: "Of course. Pick any colours, fades or stripes you like from our designs and we build your team's own version with your name and logo on it." },
  ],
  guideTitle: "Custom Football Jerseys in Pakistan: A Quick Guide for Team Captains",
  guide: [
    "Getting matching football jerseys for a whole team used to mean running around markets, haggling over every piece and hoping the names came out spelled right. With UM Gift Collection you do it all on WhatsApp. Share your team colours and logo, get a free mockup, send the player list and your custom football kits arrive ready to wear.",
    "Most teams in Pakistan go for the jersey and shorts combo because it gives a proper match day look. If you play in winter or need something for training, the jersey with trousers is a great choice, and full sleeves are only Rs 100 more. Futsal groups and office leagues often keep it simple with just the jersey.",
    "Not sure between Standard and Best Quality? If your team plays a few friendlies or a single tournament, Standard is plenty. If you play every week, travel for matches, or want the kit to look sharp in photos for a long time, Best Quality is worth the extra.",
  ],
  guideLinkIntro: ["Playing cricket too? Get your squad matching with our", "Shopping for just one? Browse our"],
  guideLinks: [
    { href: "/category/custom-football-shirts/", label: "custom printed football shirts" },
    { href: "/category/football-jerseys-price-in-pakistan/", label: "football jerseys price in Pakistan" },
    { href: "/category/mens-football-jersey-price-in-pakistan/", label: "mens football jerseys online" },
    { href: "/category/girls-football-jersey-price-in-pakistan/", label: "girls football jerseys in Pakistan" },
  ],
  otherSport: { href: "/custom-cricket-shirts-bulk/", label: "custom cricket shirts in bulk" },
};

export const cricket: SportConfig = {
  sport: "cricket",
  path: "/custom-cricket-shirts-bulk/",
  seoTitle: "Buy Customized Cricket Team Jerseys at Lowest Price in Pakistan",
  seoDescription: "Buy customized cricket team jerseys at the lowest price in Pakistan, just Rs 1,000 each with free names, numbers and logo. Add trousers. Min 12 pieces.",
  noun: "shirt",
  h1: "Custom Cricket Shirts in Pakistan,",
  h1Accent: "Made for Your Whole Team",
  heroText: "From tape ball Sundays to Ramzan night tournaments, walk out in matching cricket shirts with every player's name and number. Team rates start at Rs 1,000 a piece for 12 or more.",
  heroAlt: "Custom printed team shirts with player names and numbers, a real bulk order in Pakistan",
  pricingTitle: "Cricket Kit Printing Price in Pakistan, Per Piece",
  pricingText: "One clear price per player, with names, numbers and logo included. Order 12 or more for the team rate. A squad of 10 or 11? Still welcome, at just Rs 100 more per piece.",
  kits: [
    { id: "shirt", name: "Cricket Shirt Only", text: "Your team shirt on its own. Ideal for tape ball and softball cricket.", standard: 1000, best: 1300 },
    { id: "shorts", name: "Shirt + Shorts", text: "Light and cool for summer matches, indoor and night cricket.", standard: 1600, best: 2000 },
    { id: "trouser", name: "Shirt + Trouser", text: "The proper cricket look. Shirt with matching full length trousers.", standard: 1900, best: 2300, popular: true },
  ],
  quality: {
    standard: "Breathable, lightweight fabric that keeps you cool through long innings. Great for tape ball leagues and weekend matches.",
    best: "Premium fabric with a softer feel, deeper colours and a clean professional finish. Perfect for hard ball clubs and big tournaments.",
  },
  builderTitle: "Design Your Team's Cricket Kit and Get an Instant Quote",
  builderText: "Pick your colours, add a player name and number, choose shirt only or the full kit. Your price updates live, then send it on WhatsApp for a free mockup.",
  defaults: { kit: "trouser", sleeves: "Full", main: "Pakistan Green", accent: "Green", text: "White", name: "BABAR", number: "56", team: "YOUR XI" },
  designsTitle: "Pick a Print Style, We'll Turn It Into Your Cricket Shirt",
  designsText: "Love a pattern from our jersey collection? We can print it as a cricket shirt with full sleeves and your team name across the chest. Minimum 12 pieces.",
  designs: [
    ...realDesigns,
    { title: "Emerald Green Style", image: IK + "real-madrid-away-green-football-jersey-price-in-pakistan-1.webp" },
    { title: "Navy Night Style", image: IK + "psg-men-football-jersey-price-in-pakistan-1.webp" },
    { title: "Sky Blue Style", image: IK + "manchester-city-home-blue-football-jersey-price-in-pakistan-1.webp" },
    { title: "Black and Pink Style", image: IK + "inter-miami-black-football-jersey-price-in-pakistan-1.webp" },
    { title: "Classic White Style", image: IK + "germany-home-football-jersey-price-in-pakistan-1.webp" },
    { title: "Yellow Samba Style", image: IK + "brazil-football-jersey-price-in-pakistan-1.webp" },
    { title: "Bold Red Style", image: IK + "bayern-munich-red-football-jersey-price-in-pakistan-1.webp" },
  ],
  galleryTitle: "Real Team Kits Printed in Our Studio",
  galleryText: "Every photo here is a real kit we printed for a real team. Your cricket shirts come off the same machines, with the same sharp colours and clean names.",
  clientTitle: "See the Kind of Team Kit We Print Every Week",
  clientText: [
    "This black and purple kit was printed for a real squad, every name and number belonging to an actual player. Your cricket shirts are printed in the same studio, with the same care for spelling, colour and finish.",
    "Send your idea, approve a free mockup, share the player list, and we handle the rest. All you need to bring is the bat.",
  ],
  included: [
    { t: "Player names", d: "Every player gets their own name on the back, free." },
    { t: "Shirt numbers", d: "Bold numbers on the back, just like the pros wear them." },
    { t: "Team logo", d: "Your club logo on the chest. No logo yet? We can help." },
    { t: "Sponsor branding", d: "Show off your sponsor, company or tournament name." },
    { t: "Your colours", d: "Pakistan green, navy, black or anything your team wants." },
    { t: "Free mockup", d: "Approve your design before a single shirt is printed." },
  ],
  stepsTitle: "How to Order Custom Cricket Shirts in Bulk",
  steps: [
    { t: "Message Us Your Idea", d: "Tell us your team colours, share your logo or a picture you like. A rough idea is enough to start." },
    { t: "Approve Your Free Mockup", d: "We design your cricket kit and send a preview. Tweak it as many times as you need." },
    { t: "Send Names, Numbers and Sizes", d: "Share the squad list with sizes, pay a 50% advance to lock in your order, and printing begins." },
    { t: "Delivered Before Match Day", d: "Every shirt is checked and packed, then delivered to your door anywhere in Pakistan." },
  ],
  whoTitle: "Made for Every Kind of Cricket Team in Pakistan",
  who: ["Tape ball teams", "Ramzan night tournaments", "Office cricket leagues", "School and college XIs", "Hard ball clubs and academies", "Softball and indoor cricket", "Mohalla and street teams", "Corporate family galas"],
  faqs: [
    { q: "What is the minimum order for custom cricket shirts?", a: "Team rates start at 12 pieces. If your squad has 10 or 11 players, we can still print your shirts at Rs 100 extra per piece." },
    { q: "What is the price of a custom cricket kit in Pakistan?", a: "For 12 or more pieces, a custom cricket shirt is Rs 1,000 (Rs 1,300 Best Quality). Shirt with trousers is Rs 1,900 (Rs 2,300 Best Quality), and shirt with shorts is Rs 1,600 (Rs 2,000 Best Quality)." },
    { q: "Do you make full sleeve cricket shirts?", a: "Yes. Full sleeves are just Rs 100 extra per piece and are a popular choice for hard ball cricket and winter matches." },
    { q: "Are player names and numbers included in the price?", a: "Yes. Every shirt can have its own name and number, plus your team logo and sponsor, all included in the per piece price." },
    { q: "Can we get matching cricket trousers?", a: "Yes. Choose the Shirt + Trouser kit and we print trousers in matching colours, so the whole team looks complete." },
    { q: "Will I see the design before printing?", a: "Yes. You get a free digital mockup first, and we only print once you approve it." },
    { q: "Is there an advance payment for team cricket kits?", a: "Yes. Your mockup and quote are free, and after you approve the design a 50% advance confirms the order. The other half is due once your shirts are ready." },
    { q: "Can you deliver before our Ramzan tournament?", a: "Tell us your first match date when you message. We confirm a delivery date with your mockup, so ordering a little early before big events is always a good idea." },
    { q: "Do you deliver cricket kits all over Pakistan?", a: "Yes, we deliver to Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, Hyderabad and everywhere in between." },
  ],
  guideTitle: "Custom Cricket Shirts in Pakistan: What Every Team Captain Should Know",
  guide: [
    "Cricket in Pakistan is played everywhere, from proper grounds to the street outside your house, and nothing makes a team feel more serious than matching shirts with names and numbers. Whether you are kitting out a tape ball side for a Ramzan night tournament or a hard ball club for the season, UM Gift Collection prints your custom cricket shirts in bulk and delivers them across Pakistan.",
    "The most popular choice is the shirt and trouser kit, because it gives that clean, complete cricket look. Full sleeves cost only Rs 100 more and are great for winter matches or bowlers who like the extra cover. For summer and indoor games, shirt with shorts keeps players cool.",
    "If your team plays occasional matches, Standard Quality gives you great value. For clubs, academies and teams that play every week, Best Quality fabric feels better, keeps its colour longer and looks sharper in team photos.",
  ],
  guideLinkIntro: ["Also play football? Get your squad matching with our", "Shopping for just one? Browse our"],
  guideLinks: [
    { href: "/category/men-sports-jersey-price-in-pakistan/", label: "men sports jerseys in Pakistan" },
    { href: "/category/custom-football-shirts/", label: "custom printed sports shirts" },
    { href: "/category/girls-sports-jersey-price-in-pakistan/", label: "girls sports jerseys online" },
  ],
  otherSport: { href: "/custom-football-jerseys-bulk/", label: "custom football jerseys in bulk" },
};
