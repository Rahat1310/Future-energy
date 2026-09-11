export type Branch = {
  id: string;
  name: string;
  location: string;
  phone: string;
  phoneRaw: string;
};

export const BRANCHES: Branch[] = [
  {
    id: "dhamoirhat",
    name: "ধামইরহাট ব্যাটারি হাউস",
    location: "আমাইতারা , জনতা ব্যাংকের নিচে, ধামইরহাট , নওগাঁ ।",
    phone: "01318323392",
    phoneRaw: "+8801318323392",
  },
  {
    id: "badalgachhi",
    name: "আকিজ লিথিয়াম ব্যাটারি ঘর",
    location: "মাতাজী রোড, কেন্দ্রীয় মসজিদ সংলগ্ন, বদলগাছি, নওগাঁ",
    phone: "01353-842124",
    phoneRaw: "+8801353842124",
  },
  {
    id: "patnitala",
    name: "আজিজ ব্যাটারি ও আইপিএস স্টোর",
    location: "মাতাজী রোড, নজিপুর বাসস্ট্যান্ড, পত্নীতলা",
    phone: "01354-581214",
    phoneRaw: "+8801354581214",
  },
  {
    id: "naogaon-sadar",
    name: "নওগাঁ সদর",
    location: "নওগাঁ সদর",
    phone: "01712-982527",
    phoneRaw: "+8801712982527",
  },
];
