// ============================================================
// ISLAMIC ADHKAR DATA — Hisn Al-Muslim (حصن المسلم)
// Complete dataset matching the book structure
// Fields: id, category, arabic_text, translation, source, audio_url, target_count, benefit
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
  description?: string;
  adhkar: Dhikr[];
}

export const adhkarCategories: AdhkarCategory[] = [
  // ─────────────────────────────────────────────
  //  1. أذكار الصباح
  // ─────────────────────────────────────────────
  {
    id: "morning",
    name: "أذكار الصباح",
    icon: "🌅",
    description: "تُقال من الفجر حتى الضحى",
    adhkar: [
      {
        id: 1,
        category: "أذكار الصباح",
        category_id: "morning",
        arabic_text: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ\n\nاللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ.",
        translation: "Ayat Al-Kursi — Allah! There is no god but He, the Ever-Living, the One Who sustains and protects all that exists. Neither slumber, nor sleep overtakes Him...",
        source: "البقرة: 255",
        benefit: "من قرأها حين يصبح أُجير من الجن حتى يمسي",
        target_count: 1,
      },
      {
        id: 2,
        category: "أذكار الصباح",
        category_id: "morning",
        arabic_text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.",
        translation: "We have reached the morning and the whole kingdom belongs to Allah. Praise be to Allah. None has the right to be worshipped except Allah, alone, without any partner; to Him belongs all sovereignty and praise, and He is over all things omnipotent. My Lord, I ask You for the good of this day and the good of what follows it, and I seek refuge in You from the evil of this day and the evil of what follows it. My Lord, I seek refuge in You from laziness and the misery of old age. My Lord, I seek refuge in You from punishment in the Fire and punishment in the grave.",
        source: "صحيح مسلم",
        target_count: 1,
      },
      {
        id: 3,
        category: "أذكار الصباح",
        category_id: "morning",
        arabic_text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ.",
        translation: "O Allah, by Your leave we have reached the morning, and by Your leave we have reached the evening, by Your leave we live and die, and unto You is our resurrection.",
        source: "سنن الترمذي",
        target_count: 1,
      },
      {
        id: 4,
        category: "أذكار الصباح",
        category_id: "morning",
        arabic_text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.",
        translation: "O Allah, You are my Lord. None has the right to be worshipped except You. You created me and I am Your servant, and I abide to Your covenant and promise as best I can. I seek refuge in You from the evil of which I have committed. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me, for verily none can forgive sin except You.",
        source: "صحيح البخاري",
        benefit: "سيد الاستغفار — من قالها موقناً بها فمات من يومه دخل الجنة",
        target_count: 1,
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
        benefit: "كفاه الله ما أهمه من أمر الدنيا والآخرة",
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
      {
        id: 11,
        category: "أذكار الصباح",
        category_id: "morning",
        arabic_text: "أَصْبَحْنَا عَلَى فِطْرَةِ الإِسْلاَمِ، وَعَلَى كَلِمَةِ الإِخْلاَصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ.",
        translation: "We have reached the morning upon the natural religion of Islam, the word of sincere devotion, the religion of our Prophet Muhammad (ﷺ), and the religion of our father Ibrahim, who was a Muslim and was not of the polytheists.",
        source: "مسند الإمام أحمد",
        target_count: 1,
      },
      {
        id: 12,
        category: "أذكار الصباح",
        category_id: "morning",
        arabic_text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.",
        translation: "Glory is to Allah and praise is to Him.",
        source: "صحيح مسلم",
        benefit: "من قالها مائة مرة حُطَّت عنه خطاياه وإن كانت مثل زبد البحر",
        target_count: 100,
      },
      {
        id: 13,
        category: "أذكار الصباح",
        category_id: "morning",
        arabic_text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
        translation: "None has the right to be worshipped except Allah, alone, without any partner; to Him belongs all sovereignty and praise, and He is over all things omnipotent.",
        source: "صحيح البخاري ومسلم",
        benefit: "كانت له عدل عشر رقاب",
        target_count: 10,
      },
      {
        id: 14,
        category: "أذكار الصباح",
        category_id: "morning",
        arabic_text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي، وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِن بَيْنِ يَدَيَّ، وَمِنْ خَلْفِي، وَعَنْ يَمِينِي، وَعَنْ شِمَالِي، وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي.",
        translation: "O Allah, I ask You for pardon and well-being in this life and the next. O Allah, I ask You for pardon and well-being in my religious and worldly affairs, and my family and my wealth. O Allah, veil my weaknesses and set at ease my dismay. O Allah, preserve me from the front and from behind, and over my right and my left, and from above, and I take refuge with You lest I be swallowed up by the earth.",
        source: "سنن أبي داود",
        target_count: 1,
      },
    ],
  },

  // ─────────────────────────────────────────────
  //  2. أذكار المساء
  // ─────────────────────────────────────────────
  {
    id: "evening",
    name: "أذكار المساء",
    icon: "🌙",
    description: "تُقال من العصر حتى المغرب",
    adhkar: [
      {
        id: 101,
        category: "أذكار المساء",
        category_id: "evening",
        arabic_text: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ\n\nاللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ.",
        translation: "Ayat Al-Kursi — Allah! There is no god but He, the Ever-Living, the One Who sustains and protects all that exists...",
        source: "البقرة: 255",
        benefit: "من قرأها حين يمسي أُجير من الجن حتى يصبح",
        target_count: 1,
      },
      {
        id: 102,
        category: "أذكار المساء",
        category_id: "evening",
        arabic_text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.",
        translation: "We have reached the evening and the whole kingdom belongs to Allah. Praise be to Allah. None has the right to be worshipped except Allah, alone, without any partner. My Lord, I ask You for the good of this night and the good of what follows it, and I seek refuge in You from the evil of this night and the evil of what follows it. My Lord, I seek refuge in You from laziness and the misery of old age. My Lord, I seek refuge in You from punishment in the Fire and punishment in the grave.",
        source: "صحيح مسلم",
        target_count: 1,
      },
      {
        id: 103,
        category: "أذكار المساء",
        category_id: "evening",
        arabic_text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ.",
        translation: "O Allah, by Your leave we have reached the evening, and by Your leave we have reached the morning, by Your leave we live and die, and unto You is our return.",
        source: "سنن الترمذي",
        target_count: 1,
      },
      {
        id: 104,
        category: "أذكار المساء",
        category_id: "evening",
        arabic_text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.",
        translation: "O Allah, You are my Lord. None has the right to be worshipped except You. You created me and I am Your servant, and I abide to Your covenant and promise as best I can. I seek refuge in You from the evil of which I have committed. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me, for verily none can forgive sin except You.",
        source: "صحيح البخاري",
        benefit: "سيد الاستغفار",
        target_count: 1,
      },
      {
        id: 105,
        category: "أذكار المساء",
        category_id: "evening",
        arabic_text: "اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ.",
        translation: "O Allah, what blessing I or any of Your creation have reached the evening upon, is from You alone, without partner, so for You is all praise and unto You all thanks.",
        source: "سنن أبي داود",
        benefit: "من قالها أدّى شكر ليلته",
        target_count: 1,
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
      {
        id: 107,
        category: "أذكار المساء",
        category_id: "evening",
        arabic_text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.",
        translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
        source: "صحيح مسلم",
        benefit: "لم تضره حُمَة في تلك الليلة",
        target_count: 3,
      },
      {
        id: 108,
        category: "أذكار المساء",
        category_id: "evening",
        arabic_text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.",
        translation: "In the name of Allah with Whose name nothing is harmful on earth or in the heavens, and He is the All-Hearing, All-Knowing.",
        source: "سنن الترمذي",
        benefit: "لم يضره شيء",
        target_count: 3,
      },
      {
        id: 109,
        category: "أذكار المساء",
        category_id: "evening",
        arabic_text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ.",
        translation: "Glory is to Allah and praise is to Him.",
        source: "صحيح مسلم",
        benefit: "من قالها مائة مرة حُطَّت عنه خطاياه وإن كانت مثل زبد البحر",
        target_count: 100,
      },
    ],
  },

  // ─────────────────────────────────────────────
  //  3. أذكار النوم
  // ─────────────────────────────────────────────
  {
    id: "sleep",
    name: "أذكار النوم",
    icon: "🌛",
    description: "تُقال عند الأوي إلى الفراش",
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
        arabic_text: "سُبْحَانَ اللَّهِ.",
        translation: "Glory is to Allah.",
        source: "صحيح البخاري",
        benefit: "خير لك من أن تخدمي خادماً",
        target_count: 33,
      },
      {
        id: 204,
        category: "أذكار النوم",
        category_id: "sleep",
        arabic_text: "الْحَمْدُ لِلَّهِ.",
        translation: "All praise is for Allah.",
        source: "صحيح البخاري",
        target_count: 33,
      },
      {
        id: 205,
        category: "أذكار النوم",
        category_id: "sleep",
        arabic_text: "اللَّهُ أَكْبَرُ.",
        translation: "Allah is the greatest.",
        source: "صحيح البخاري",
        target_count: 34,
      },
      {
        id: 206,
        category: "أذكار النوم",
        category_id: "sleep",
        arabic_text: "اللَّهُمَّ رَبَّ السَّمَاوَاتِ وَرَبَّ الأَرْضِ وَرَبَّ الْعَرْشِ الْعَظِيمِ، رَبَّنَا وَرَبَّ كُلِّ شَيْءٍ، فَالِقَ الْحَبِّ وَالنَّوَى، وَمُنْزِلَ التَّوْرَاةِ وَالإِنْجِيلِ وَالْفُرْقَانِ، أَعُوذُ بِكَ مِنْ شَرِّ كُلِّ شَيْءٍ أَنْتَ آخِذٌ بِنَاصِيَتِهِ، اللَّهُمَّ أَنْتَ الأَوَّلُ فَلَيْسَ قَبْلَكَ شَيْءٌ، وَأَنْتَ الآخِرُ فَلَيْسَ بَعْدَكَ شَيْءٌ، وَأَنْتَ الظَّاهِرُ فَلَيْسَ فَوْقَكَ شَيْءٌ، وَأَنْتَ الْبَاطِنُ فَلَيْسَ دُونَكَ شَيْءٌ، اقْضِ عَنَّا الدَّيْنَ وَأَغْنِنَا مِنَ الْفَقْرِ.",
        translation: "O Allah, Lord of the heavens, Lord of the earth, and Lord of the Magnificent Throne. Our Lord and Lord of all things, Splitter of the grain and the date-stone, Revealer of the Tawrah, the Injeel and the Furqan, I seek refuge in You from the evil of all things You shall seize by the forelock. O Allah, You are Al-Awwal, so there is nothing before You; and You are Al-Akhir, so there is nothing after You; and You are Az-Zahir, so there is nothing above You; and You are Al-Batin, so there is nothing closer than You. Settle our debt for us and spare us from poverty.",
        source: "صحيح مسلم",
        target_count: 1,
      },
      {
        id: 207,
        category: "أذكار النوم",
        category_id: "sleep",
        arabic_text: "اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَنَبِيِّكَ الَّذِي أَرْسَلْتَ.",
        translation: "O Allah, I submit myself to You, entrust my affairs to You, turn my face to You, and lay myself down depending upon You, in hope and fear of You. Verily there is no refuge nor safe haven from You except with You. I believe in Your Book that You revealed, and the Prophet You sent.",
        source: "صحيح البخاري",
        benefit: "إن مات في ليلته مات على الفطرة",
        target_count: 1,
      },
    ],
  },

  // ─────────────────────────────────────────────
  //  4. أذكار الاستيقاظ
  // ─────────────────────────────────────────────
  {
    id: "waking",
    name: "أذكار الاستيقاظ",
    icon: "☀️",
    description: "تُقال عند الاستيقاظ من النوم",
    adhkar: [
      {
        id: 301,
        category: "أذكار الاستيقاظ",
        category_id: "waking",
        arabic_text: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ.",
        translation: "All praise is for Allah who gave us life after having taken it from us and unto Him is the Resurrection.",
        source: "صحيح البخاري",
        target_count: 1,
      },
      {
        id: 302,
        category: "أذكار الاستيقاظ",
        category_id: "waking",
        arabic_text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ.",
        translation: "None has the right to be worshipped except Allah, alone, without any partner; to Him belongs all sovereignty and all praise, and He is over all things omnipotent. How perfect Allah is, and all praise is for Allah, and none has the right to be worshipped except Allah, and Allah is the greatest, and there is no power and no might except with Allah, The Most High, The Most Great.",
        source: "صحيح البخاري",
        benefit: "غُفر له وإن كانت ذنوبه مثل زبد البحر",
        target_count: 1,
      },
      {
        id: 303,
        category: "أذكار الاستيقاظ",
        category_id: "waking",
        arabic_text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا الْيَوْمِ فَتْحَهُ وَنَصْرَهُ وَنُورَهُ وَبَرَكَتَهُ وَهُدَاهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهِ وَشَرِّ مَا بَعْدَهُ.",
        translation: "O Allah, I ask You for the goodness, victory, light, blessing and guidance of this day, and I seek refuge in You from the evil of it and the evil of what comes after it.",
        source: "سنن أبي داود",
        target_count: 1,
      },
    ],
  },

  // ─────────────────────────────────────────────
  //  5. أذكار بعد الصلاة
  // ─────────────────────────────────────────────
  {
    id: "after-prayer",
    name: "أذكار بعد الصلاة",
    icon: "🕌",
    description: "تُقال عقب الصلوات المكتوبة",
    adhkar: [
      {
        id: 401,
        category: "أذكار بعد الصلاة",
        category_id: "after-prayer",
        arabic_text: "أَسْتَغْفِرُ اللَّهَ.",
        translation: "I seek forgiveness from Allah.",
        source: "صحيح مسلم",
        target_count: 3,
      },
      {
        id: 402,
        category: "أذكار بعد الصلاة",
        category_id: "after-prayer",
        arabic_text: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ ذَا الْجَلَالِ وَالإِكْرَامِ.",
        translation: "O Allah, You are As-Salaam and from You is all peace, blessed are You O Possessor of majesty and honour.",
        source: "صحيح مسلم",
        target_count: 1,
      },
      {
        id: 403,
        category: "أذكار بعد الصلاة",
        category_id: "after-prayer",
        arabic_text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ.",
        translation: "None has the right to be worshipped except Allah, alone, without any partner; to Him belongs all sovereignty and praise and He is over all things omnipotent. O Allah, none can withhold what You give, and none can give what You withhold, and no wealth or majesty can benefit anyone, as from You is all wealth and majesty.",
        source: "صحيح البخاري ومسلم",
        target_count: 1,
      },
      {
        id: 404,
        category: "أذكار بعد الصلاة",
        category_id: "after-prayer",
        arabic_text: "سُبْحَانَ اللَّهِ.",
        translation: "How perfect Allah is.",
        source: "صحيح مسلم",
        target_count: 33,
      },
      {
        id: 405,
        category: "أذكار بعد الصلاة",
        category_id: "after-prayer",
        arabic_text: "الْحَمْدُ لِلَّهِ.",
        translation: "All praise is for Allah.",
        source: "صحيح مسلم",
        target_count: 33,
      },
      {
        id: 406,
        category: "أذكار بعد الصلاة",
        category_id: "after-prayer",
        arabic_text: "اللَّهُ أَكْبَرُ.",
        translation: "Allah is the greatest.",
        source: "صحيح مسلم",
        target_count: 34,
      },
      {
        id: 407,
        category: "أذكار بعد الصلاة",
        category_id: "after-prayer",
        arabic_text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
        translation: "None has the right to be worshipped except Allah, alone, without any partner; to Him belongs all sovereignty and praise and He is over all things omnipotent.",
        source: "صحيح مسلم",
        benefit: "غُفرت له خطاياه وإن كانت مثل زبد البحر",
        target_count: 10,
      },
      {
        id: 408,
        category: "أذكار بعد الصلاة",
        category_id: "after-prayer",
        arabic_text: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ.",
        translation: "O Allah, help me to remember You, to give thanks to You, and to worship You well.",
        source: "سنن أبي داود",
        target_count: 1,
      },
      {
        id: 409,
        category: "أذكار بعد الصلاة",
        category_id: "after-prayer",
        arabic_text: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْجُبْنِ، وَأَعُوذُ بِكَ مِنَ الْبُخْلِ، وَأَعُوذُ بِكَ مِنْ أَنْ أُرَدَّ إِلَى أَرْذَلِ الْعُمُرِ، وَأَعُوذُ بِكَ مِنْ فِتْنَةِ الدُّنْيَا وَعَذَابِ الْقَبْرِ.",
        translation: "O Allah, I seek refuge in You from cowardice, and I seek refuge in You from miserliness, and I seek refuge in You from being returned to the most decrepit age, and I seek refuge in You from the trials of this world and the punishment of the grave.",
        source: "صحيح البخاري",
        target_count: 1,
      },
      {
        id: 410,
        category: "أذكار بعد الصلاة",
        category_id: "after-prayer",
        arabic_text: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ.",
        translation: "Ayat Al-Kursi — Allah! There is no god but He, the Ever-Living, the One Who sustains and protects all that exists...",
        source: "البقرة: 255",
        benefit: "لم يمنعه من دخول الجنة إلا الموت",
        target_count: 1,
      },
    ],
  },

  // ─────────────────────────────────────────────
  //  6. أذكار الطعام
  // ─────────────────────────────────────────────
  {
    id: "eating",
    name: "أذكار الطعام",
    icon: "🍽️",
    description: "أذكار قبل الطعام وبعده",
    adhkar: [
      {
        id: 501,
        category: "أذكار الطعام",
        category_id: "eating",
        arabic_text: "بِسْمِ اللَّهِ.",
        translation: "In the name of Allah.",
        source: "سنن أبي داود",
        benefit: "من نسي فليقل: بِسْمِ اللَّهِ فِي أَوَّلِهِ وَآخِرِهِ",
        target_count: 1,
      },
      {
        id: 502,
        category: "أذكار الطعام",
        category_id: "eating",
        arabic_text: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ.",
        translation: "All praise is for Allah who fed me this and provided it for me without any might nor power from myself.",
        source: "سنن الترمذي",
        benefit: "غُفر له ما تقدم من ذنبه وما تأخر",
        target_count: 1,
      },
      {
        id: 503,
        category: "أذكار الطعام",
        category_id: "eating",
        arabic_text: "اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَأَطْعِمْنَا خَيْرًا مِنْهُ.",
        translation: "O Allah, bless us in it and provide us with better than it.",
        source: "سنن الترمذي",
        target_count: 1,
      },
      {
        id: 504,
        category: "أذكار الطعام",
        category_id: "eating",
        arabic_text: "اللَّهُمَّ أَطْعِمْ مَنْ أَطْعَمَنِي، وَاسْقِ مَنْ سَقَانِي.",
        translation: "O Allah, feed the one who fed me, and give drink to the one who gave me drink.",
        source: "صحيح مسلم",
        target_count: 1,
      },
    ],
  },

  // ─────────────────────────────────────────────
  //  7. أذكار المسجد
  // ─────────────────────────────────────────────
  {
    id: "mosque",
    name: "أذكار المسجد",
    icon: "🕋",
    description: "عند دخول المسجد والخروج منه",
    adhkar: [
      {
        id: 601,
        category: "أذكار المسجد",
        category_id: "mosque",
        arabic_text: "أَعُوذُ بِاللَّهِ الْعَظِيمِ، وَبِوَجْهِهِ الْكَرِيمِ، وَسُلْطَانِهِ الْقَدِيمِ، مِنَ الشَّيْطَانِ الرَّجِيمِ.",
        translation: "I seek refuge in Allah the Magnificent, and in His Noble Countenance, and His eternal Power, from Satan the accursed.",
        source: "سنن أبي داود",
        benefit: "قيل له: قد عُذت، كفيت ووُقيت، وتنحى عنه الشيطان",
        target_count: 1,
      },
      {
        id: 602,
        category: "أذكار المسجد",
        category_id: "mosque",
        arabic_text: "بِسْمِ اللَّهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ.",
        translation: "In the name of Allah, and prayers and peace be upon the Messenger of Allah. O Allah, open the gates of Your mercy for me.",
        source: "صحيح مسلم",
        target_count: 1,
      },
      {
        id: 603,
        category: "أذكار المسجد",
        category_id: "mosque",
        arabic_text: "بِسْمِ اللَّهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ.",
        translation: "In the name of Allah, and prayers and peace be upon the Messenger of Allah. O Allah, I ask You from Your bounty.",
        source: "صحيح مسلم",
        benefit: "يُقال عند الخروج من المسجد",
        target_count: 1,
      },
    ],
  },

  // ─────────────────────────────────────────────
  //  8. أذكار السفر
  // ─────────────────────────────────────────────
  {
    id: "travel",
    name: "أذكار السفر",
    icon: "✈️",
    description: "دعاء الخروج والسفر والعودة",
    adhkar: [
      {
        id: 701,
        category: "أذكار السفر",
        category_id: "travel",
        arabic_text: "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ.",
        translation: "In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.",
        source: "سنن الترمذي",
        benefit: "يُقال له: كُفيت ووُقيت وهُديت، وتتنحى عنه الشياطين",
        target_count: 1,
      },
      {
        id: 702,
        category: "أذكار السفر",
        category_id: "travel",
        arabic_text: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ.",
        translation: "How perfect He is, the One Who has placed this (transport) at our service, and we ourselves would not have been capable of that, and to our Lord is our final destiny.",
        source: "الزخرف: 13-14",
        target_count: 1,
      },
      {
        id: 703,
        category: "أذكار السفر",
        category_id: "travel",
        arabic_text: "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ، اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ، وَالْخَلِيفَةُ فِي الأَهْلِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ وَعْثَاءِ السَّفَرِ وَكَآبَةِ الْمَنْظَرِ وَسُوءِ الْمُنْقَلَبِ فِي الْمَالِ وَالأَهْلِ.",
        translation: "O Allah, we ask You on this our journey for goodness and piety, and for works that are pleasing to You. O Allah, lighten this journey for us and make its distance easy for us. O Allah, You are our Companion on the road and the Successor over our families. O Allah, I seek refuge in You from the difficulties of travel, from having a change of heart and from being in a bad predicament with wealth or family.",
        source: "صحيح مسلم",
        target_count: 1,
      },
    ],
  },

  // ─────────────────────────────────────────────
  //  9. الاستغفار والتوبة
  // ─────────────────────────────────────────────
  {
    id: "istighfar",
    name: "الاستغفار والتوبة",
    icon: "💧",
    description: "طلب المغفرة والتوبة إلى الله",
    adhkar: [
      {
        id: 801,
        category: "الاستغفار والتوبة",
        category_id: "istighfar",
        arabic_text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ.",
        translation: "I seek the forgiveness of Allah and repent to Him.",
        source: "صحيح البخاري ومسلم",
        benefit: "كان النبي ﷺ يقولها في اليوم مائة مرة",
        target_count: 100,
      },
      {
        id: 802,
        category: "الاستغفار والتوبة",
        category_id: "istighfar",
        arabic_text: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ.",
        translation: "I seek the forgiveness of Allah the Almighty, other than Whom there is no god, the Ever-Living, the One Who sustains and protects all that exists, and I repent to Him.",
        source: "سنن الترمذي",
        benefit: "غَفَر الله له وإن كان قد فرَّ من الزحف",
        target_count: 1,
      },
      {
        id: 803,
        category: "الاستغفار والتوبة",
        category_id: "istighfar",
        arabic_text: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ.",
        translation: "My Lord, forgive me and accept my repentance. Verily You are the Oft-Forgiving, the Most Merciful.",
        source: "سنن الترمذي",
        target_count: 100,
      },
    ],
  },

  // ─────────────────────────────────────────────
  //  10. الصلاة على النبي ﷺ
  // ─────────────────────────────────────────────
  {
    id: "salawat",
    name: "الصلاة على النبي",
    icon: "☪️",
    description: "الصلاة والسلام على النبي محمد ﷺ",
    adhkar: [
      {
        id: 901,
        category: "الصلاة على النبي",
        category_id: "salawat",
        arabic_text: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ.",
        translation: "O Allah, send prayers upon Muhammad and the family of Muhammad, just as You sent prayers upon Ibrahim and the family of Ibrahim. Verily You are full of praise and majesty. O Allah, send blessings upon Muhammad and upon the family of Muhammad, just as You sent blessings upon Ibrahim and the family of Ibrahim. Verily, You are full of praise and majesty.",
        source: "صحيح البخاري",
        benefit: "الصلاة الإبراهيمية — تُقال في التشهد الأخير",
        target_count: 1,
      },
      {
        id: 902,
        category: "الصلاة على النبي",
        category_id: "salawat",
        arabic_text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ.",
        translation: "O Allah, send prayers and peace upon our Prophet Muhammad.",
        source: "السنة النبوية",
        benefit: "من صلى علي واحدة صلى الله عليه عشراً",
        target_count: 10,
      },
    ],
  },

  // ─────────────────────────────────────────────
  //  11. التسبيح والتهليل
  // ─────────────────────────────────────────────
  {
    id: "tasbih",
    name: "التسبيح والتهليل",
    icon: "📿",
    description: "ذكر الله بالتسبيح والتهليل والتحميد",
    adhkar: [
      {
        id: 1001,
        category: "التسبيح والتهليل",
        category_id: "tasbih",
        arabic_text: "سُبْحَانَ اللَّهِ.",
        translation: "Glory is to Allah.",
        source: "متفق عليه",
        target_count: 33,
      },
      {
        id: 1002,
        category: "التسبيح والتهليل",
        category_id: "tasbih",
        arabic_text: "الْحَمْدُ لِلَّهِ.",
        translation: "All praise is for Allah.",
        source: "متفق عليه",
        target_count: 33,
      },
      {
        id: 1003,
        category: "التسبيح والتهليل",
        category_id: "tasbih",
        arabic_text: "اللَّهُ أَكْبَرُ.",
        translation: "Allah is the greatest.",
        source: "متفق عليه",
        target_count: 34,
      },
      {
        id: 1004,
        category: "التسبيح والتهليل",
        category_id: "tasbih",
        arabic_text: "لَا إِلَهَ إِلَّا اللَّهُ.",
        translation: "None has the right to be worshipped except Allah.",
        source: "متفق عليه",
        benefit: "أفضل الذكر",
        target_count: 100,
      },
      {
        id: 1005,
        category: "التسبيح والتهليل",
        category_id: "tasbih",
        arabic_text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
        translation: "None has the right to be worshipped except Allah, alone, without any partner; to Him belongs all sovereignty and all praise, and He is over all things omnipotent.",
        source: "صحيح البخاري ومسلم",
        benefit: "كانت له عدل عشر رقاب وكُتبت له مائة حسنة",
        target_count: 10,
      },
      {
        id: 1006,
        category: "التسبيح والتهليل",
        category_id: "tasbih",
        arabic_text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ.",
        translation: "How perfect Allah is and I praise Him. How perfect Allah is, the Supreme.",
        source: "صحيح البخاري",
        benefit: "كلمتان خفيفتان على اللسان ثقيلتان في الميزان حبيبتان إلى الرحمن",
        target_count: 100,
      },
      {
        id: 1007,
        category: "التسبيح والتهليل",
        category_id: "tasbih",
        arabic_text: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ.",
        translation: "There is no might nor power except with Allah.",
        source: "صحيح البخاري",
        benefit: "كنز من كنوز الجنة",
        target_count: 100,
      },
    ],
  },

  // ─────────────────────────────────────────────
  //  12. أدعية متنوعة
  // ─────────────────────────────────────────────
  {
    id: "general-duas",
    name: "أدعية متنوعة",
    icon: "🤲",
    description: "أدعية جامعة من السنة النبوية",
    adhkar: [
      {
        id: 1101,
        category: "أدعية متنوعة",
        category_id: "general-duas",
        arabic_text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى.",
        translation: "O Allah, I ask You for guidance, piety, chastity and self-sufficiency.",
        source: "صحيح مسلم",
        target_count: 1,
      },
      {
        id: 1102,
        category: "أدعية متنوعة",
        category_id: "general-duas",
        arabic_text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ.",
        translation: "O Allah, I ask You for wellness in this world and the Hereafter.",
        source: "سنن أبي داود",
        target_count: 1,
      },
      {
        id: 1103,
        category: "أدعية متنوعة",
        category_id: "general-duas",
        arabic_text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ.",
        translation: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
        source: "البقرة: 201",
        benefit: "أكثر دعاء النبي ﷺ",
        target_count: 3,
      },
      {
        id: 1104,
        category: "أدعية متنوعة",
        category_id: "general-duas",
        arabic_text: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ.",
        translation: "O Allah, I seek refuge in You from anxiety and grief, and I seek refuge in You from incapacity and laziness, and I seek refuge in You from cowardice and miserliness, and I seek refuge in You from being overcome by debt and from the oppression of men.",
        source: "صحيح البخاري",
        target_count: 1,
      },
      {
        id: 1105,
        category: "أدعية متنوعة",
        category_id: "general-duas",
        arabic_text: "اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَعَافِنِي وَارْزُقْنِي.",
        translation: "O Allah, forgive me, have mercy on me, guide me, grant me wellness, and provide for me.",
        source: "صحيح مسلم",
        target_count: 1,
      },
      {
        id: 1106,
        category: "أدعية متنوعة",
        category_id: "general-duas",
        arabic_text: "اللَّهُمَّ أَصْلِحْ لِي دِينِيَ الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي، وَاجْعَلِ الْحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ، وَاجْعَلِ الْمَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ.",
        translation: "O Allah, set right for me my religion which is the safeguard of my affairs. And set right for me the affairs of my world wherein is my living. And set right for me my Hereafter on which depends my after-life. And make the life for me a means of abundance for every good and make my death a source of comfort for me protecting me against every evil.",
        source: "صحيح مسلم",
        target_count: 1,
      },
    ],
  },
];
