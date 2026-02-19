// ============================================================
// ISLAMIC ADHKAR DATA - Hisn Al-Muslim (حصن المسلم)
// Structured JSON matching Phase 1 Python scraper output schema
// Fields: id, category, arabic_text, translation, audio_url, target_count
// ============================================================

export interface Dhikr {
  id: number;
  category: string;
  category_id: string;
  arabic_text: string;
  translation: string;
  source?: string;
  audio_url?: string;
  target_count: number;
  benefit?: string;
}

export interface AdhkarCategory {
  id: string;
  name: string;
  icon: string;
  adhkar: Dhikr[];
}

export const adhkarCategories: AdhkarCategory[] = [
  {
    id: "morning",
    name: "أذكار الصباح",
    icon: "🌅",
    adhkar: [
      {
        id: 1,
        category: "أذكار الصباح",
        category_id: "morning",
        arabic_text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.",
        translation: "We have reached the morning, and the whole kingdom belongs to Allah. Praise be to Allah. None has the right to be worshipped except Allah, alone, without any partner; to Him belongs all sovereignty and praise, and He is over all things omnipotent. My Lord, I ask You for the good of this day and the good of what follows it, and I seek refuge in You from the evil of this day and the evil of what follows it. My Lord, I seek refuge in You from laziness and the misery of old age. My Lord, I seek refuge in You from punishment in the Fire and punishment in the grave.",
        source: "صحيح مسلم",
        target_count: 1,
      },
      {
        id: 2,
        category: "أذكار الصباح",
        category_id: "morning",
        arabic_text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ.",
        translation: "O Allah, by Your leave we have reached the morning, and by Your leave we have reached the evening, by Your leave we live and die, and unto You is our resurrection.",
        source: "سنن الترمذي",
        target_count: 1,
      },
      {
        id: 3,
        category: "أذكار الصباح",
        category_id: "morning",
        arabic_text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.",
        translation: "O Allah, You are my Lord. None has the right to be worshipped except You. You created me and I am Your servant, and I abide to Your covenant and promise as best I can. I seek refuge in You from the evil of which I have committed. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me, for verily none can forgive sin except You.",
        source: "صحيح البخاري",
        benefit: "سيد الاستغفار - من قالها موقناً بها فمات من يومه دخل الجنة",
        target_count: 1,
      },
      {
        id: 4,
        category: "أذكار الصباح",
        category_id: "morning",
        arabic_text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.",
        translation: "Glory is to Allah and praise is to Him.",
        source: "صحيح مسلم",
        benefit: "من قالها مائة مرة حُطَّت عنه خطاياه وإن كانت مثل زبد البحر",
        target_count: 100,
      },
      {
        id: 5,
        category: "أذكار الصباح",
        category_id: "morning",
        arabic_text: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ.",
        translation: "O Allah, I have reached the morning and call on You, the bearers of Your Throne, Your angels, and all Your creation to witness that You are Allah, none has the right to be worshipped except You, alone, without any partner, and that Muhammad is Your servant and messenger.",
        source: "سنن أبي داود",
        benefit: "أعتق الله ربعه من النار",
        target_count: 4,
      },
      {
        id: 6,
        category: "أذكار الصباح",
        category_id: "morning",
        arabic_text: "اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ.",
        translation: "O Allah, what blessing I or any of Your creation have risen upon, is from You alone, without partner, so for You is all praise and unto You all thanks.",
        source: "سنن أبي داود",
        benefit: "من قالها أدّى شكر يومه",
        target_count: 1,
      },
      {
        id: 7,
        category: "أذكار الصباح",
        category_id: "morning",
        arabic_text: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.",
        translation: "Allah is sufficient for me. None has the right to be worshipped except Him. I have placed my trust in Him, and He is the Lord of the Magnificent Throne.",
        source: "سنن أبي داود",
        benefit: "كفاه الله ما أهمه",
        target_count: 7,
      },
      {
        id: 8,
        category: "أذكار الصباح",
        category_id: "morning",
        arabic_text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.",
        translation: "In the name of Allah with Whose name nothing is harmful on earth or in the heavens, and He is the All-Hearing, All-Knowing.",
        source: "سنن الترمذي",
        benefit: "لم يضره شيء",
        target_count: 3,
      },
      {
        id: 9,
        category: "أذكار الصباح",
        category_id: "morning",
        arabic_text: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالإِسْلاَمِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا.",
        translation: "I am pleased with Allah as a Lord, with Islam as a religion, and with Muhammad (peace be upon him) as a prophet.",
        source: "سنن الترمذي",
        benefit: "حق على الله أن يرضيه يوم القيامة",
        target_count: 3,
      },
      {
        id: 10,
        category: "أذكار الصباح",
        category_id: "morning",
        arabic_text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ.",
        translation: "O Ever Living One, O Self-Subsisting and Supporter of all, by Your mercy I seek assistance. Rectify all of my affairs and do not leave me to myself, even for the blink of an eye.",
        source: "المستدرك للحاكم",
        target_count: 1,
      },
    ],
  },
  {
    id: "evening",
    name: "أذكار المساء",
    icon: "🌙",
    adhkar: [
      {
        id: 101,
        category: "أذكار المساء",
        category_id: "evening",
        arabic_text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا.",
        translation: "We have reached the evening and the whole kingdom belongs to Allah. Praise be to Allah. None has the right to be worshipped except Allah, alone, without any partner. My Lord, I ask You for the good of this night and the good of what follows it, and I seek refuge in You from the evil of this night and the evil of what follows it.",
        source: "صحيح مسلم",
        target_count: 1,
      },
      {
        id: 102,
        category: "أذكار المساء",
        category_id: "evening",
        arabic_text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ.",
        translation: "O Allah, by Your leave we have reached the evening, and by Your leave we have reached the morning, by Your leave we live and die, and unto You is our return.",
        source: "سنن الترمذي",
        target_count: 1,
      },
      {
        id: 103,
        category: "أذكار المساء",
        category_id: "evening",
        arabic_text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.",
        translation: "O Allah, You are my Lord. None has the right to be worshipped except You. You created me and I am Your servant, and I abide to Your covenant and promise as best I can. I seek refuge in You from the evil of which I have committed. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me, for verily none can forgive sin except You.",
        source: "صحيح البخاري",
        benefit: "سيد الاستغفار",
        target_count: 1,
      },
      {
        id: 104,
        category: "أذكار المساء",
        category_id: "evening",
        arabic_text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.",
        translation: "Glory is to Allah and praise is to Him.",
        source: "صحيح مسلم",
        target_count: 100,
      },
      {
        id: 105,
        category: "أذكار المساء",
        category_id: "evening",
        arabic_text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.",
        translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
        source: "صحيح مسلم",
        benefit: "لم يضره لدغة في تلك الليلة",
        target_count: 3,
      },
      {
        id: 106,
        category: "أذكار المساء",
        category_id: "evening",
        arabic_text: "اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَّا إِلَهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ.",
        translation: "O Allah, Knower of the unseen and the manifest, Creator of the heavens and the earth, Lord and Sovereign of all things, I bear witness that none has the right to be worshipped except You. I seek refuge in You from the evil of my soul and from the evil and trap of Satan.",
        source: "سنن الترمذي",
        target_count: 1,
      },
    ],
  },
  {
    id: "sleep",
    name: "أذكار النوم",
    icon: "✨",
    adhkar: [
      {
        id: 201,
        category: "أذكار النوم",
        category_id: "sleep",
        arabic_text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا.",
        translation: "In Your name O Allah, I die and I live.",
        source: "صحيح البخاري",
        target_count: 1,
      },
      {
        id: 202,
        category: "أذكار النوم",
        category_id: "sleep",
        arabic_text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ.",
        translation: "O Allah, protect me from Your punishment on the Day that You resurrect Your servants.",
        source: "سنن أبي داود",
        target_count: 3,
      },
      {
        id: 203,
        category: "أذكار النوم",
        category_id: "sleep",
        arabic_text: "اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا.",
        translation: "O Allah, in Your name I die and I live.",
        source: "صحيح البخاري",
        target_count: 1,
      },
      {
        id: 204,
        category: "أذكار النوم",
        category_id: "sleep",
        arabic_text: "سُبْحَانَ اللَّهِ.",
        translation: "Glory is to Allah.",
        source: "صحيح البخاري",
        benefit: "خير لك من أن تخدمي خادماً",
        target_count: 33,
      },
      {
        id: 205,
        category: "أذكار النوم",
        category_id: "sleep",
        arabic_text: "الْحَمْدُ لِلَّهِ.",
        translation: "All praise is for Allah.",
        source: "صحيح البخاري",
        target_count: 33,
      },
      {
        id: 206,
        category: "أذكار النوم",
        category_id: "sleep",
        arabic_text: "اللَّهُ أَكْبَرُ.",
        translation: "Allah is the greatest.",
        source: "صحيح البخاري",
        target_count: 34,
      },
    ],
  },
  {
    id: "prayer",
    name: "أذكار الصلاة",
    icon: "🕌",
    adhkar: [
      {
        id: 301,
        category: "أذكار الصلاة",
        category_id: "prayer",
        arabic_text: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ.",
        translation: "How perfect You are O Allah, and I praise You. Blessed be Your name, and exalted be Your majesty. None has the right to be worshipped except You.",
        source: "سنن الترمذي",
        benefit: "دعاء الاستفتاح",
        target_count: 1,
      },
      {
        id: 302,
        category: "أذكار الصلاة",
        category_id: "prayer",
        arabic_text: "رَبَّنَا لَكَ الْحَمْدُ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ.",
        translation: "Our Lord, to You belongs all praise, an abundant, beautiful, blessed praise.",
        source: "صحيح البخاري",
        target_count: 1,
      },
      {
        id: 303,
        category: "أذكار الصلاة",
        category_id: "prayer",
        arabic_text: "سُبْحَانَ رَبِّيَ الْعَظِيمِ.",
        translation: "How perfect is my Lord, the Supreme.",
        source: "سنن أبي داود",
        target_count: 3,
      },
      {
        id: 304,
        category: "أذكار الصلاة",
        category_id: "prayer",
        arabic_text: "سُبْحَانَ رَبِّيَ الْأَعْلَى.",
        translation: "How perfect is my Lord, the Most High.",
        source: "سنن أبي داود",
        target_count: 3,
      },
      {
        id: 305,
        category: "أذكار الصلاة",
        category_id: "prayer",
        arabic_text: "رَبِّ اغْفِرْ لِي.",
        translation: "O Lord, forgive me.",
        source: "سنن ابن ماجه",
        target_count: 3,
      },
    ],
  },
  {
    id: "tasbih",
    name: "التسبيح والتهليل",
    icon: "📿",
    adhkar: [
      {
        id: 401,
        category: "التسبيح والتهليل",
        category_id: "tasbih",
        arabic_text: "سُبْحَانَ اللَّهِ.",
        translation: "Glory is to Allah.",
        source: "متفق عليه",
        target_count: 33,
      },
      {
        id: 402,
        category: "التسبيح والتهليل",
        category_id: "tasbih",
        arabic_text: "الْحَمْدُ لِلَّهِ.",
        translation: "All praise is for Allah.",
        source: "متفق عليه",
        target_count: 33,
      },
      {
        id: 403,
        category: "التسبيح والتهليل",
        category_id: "tasbih",
        arabic_text: "اللَّهُ أَكْبَرُ.",
        translation: "Allah is the greatest.",
        source: "متفق عليه",
        target_count: 34,
      },
      {
        id: 404,
        category: "التسبيح والتهليل",
        category_id: "tasbih",
        arabic_text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
        translation: "None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and all praise, and He is over all things omnipotent.",
        source: "صحيح البخاري",
        benefit: "من قالها مائة مرة كانت له عدل عشر رقاب",
        target_count: 100,
      },
      {
        id: 405,
        category: "التسبيح والتهليل",
        category_id: "tasbih",
        arabic_text: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ.",
        translation: "There is no power and no strength except with Allah.",
        source: "متفق عليه",
        benefit: "كنز من كنوز الجنة",
        target_count: 100,
      },
      {
        id: 406,
        category: "التسبيح والتهليل",
        category_id: "tasbih",
        arabic_text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ.",
        translation: "Glory is to Allah and praise is to Him. Glory is to Allah, the Supreme.",
        source: "صحيح البخاري",
        benefit: "كلمتان خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن",
        target_count: 100,
      },
    ],
  },
];

export const getAllCategories = () => adhkarCategories;

export const getCategoryById = (id: string) =>
  adhkarCategories.find((c) => c.id === id);

export const getDefaultCategory = () => adhkarCategories[0];
