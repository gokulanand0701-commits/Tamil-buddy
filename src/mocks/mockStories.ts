import { Story } from '../types';

export const MOCK_STORIES: Story[] = [
  // ================= 1. MOTIVATIONAL: The Thirsty Crow =================
  {
    id: 'story-1',
    title_tamil: 'தாகமுள்ள காகம்',
    title_translit: 'Thaagamulla Kaagam',
    title_english: 'The Thirsty Crow',
    level: 'Beginner (எளிது)',
    genre: 'motivational',
    genre_label: 'Motivational (விடாமுயற்சி)',
    genre_emoji: '🦅',
    cover_image: '🐦‍⬛🏺💧',
    moral: 'Where there is a will, there is a way! (முயற்சி திருவினையாக்கும்)',
    sentences: [
      {
        sentence_tamil: 'ஒரு நாள் ஒரு காகம் மிகவும் தாகமாக இருந்தது.',
        sentence_translit: 'Oru naal oru kaagam migavum thaagamaaga irunthathu.',
        sentence_english: 'One hot day, a crow was feeling very thirsty.',
        scene_illustration: 'crow_thirsty',
        words: [
          { tamil: 'ஒரு', translit: 'Oru', meaning: 'One / A' },
          { tamil: 'நாள்', translit: 'Naal', meaning: 'Day' },
          { tamil: 'காகம்', translit: 'Kaagam', meaning: 'Crow' },
          { tamil: 'மிகவும்', translit: 'Migavum', meaning: 'Very' },
          { tamil: 'தாகமாக', translit: 'Thaagamaaga', meaning: 'Thirsty' },
          { tamil: 'இருந்தது', translit: 'Irunthathu', meaning: 'Was' },
        ],
      },
      {
        sentence_tamil: 'அது தண்ணீர் தேடி வானில் இங்குமங்கும் பறந்தது.',
        sentence_translit: 'Athu thanneer thedi vaanil ingumangum paranthathu.',
        sentence_english: 'It flew here and there across the sky searching for water.',
        scene_illustration: 'crow_flying',
        words: [
          { tamil: 'அது', translit: 'Athu', meaning: 'It' },
          { tamil: 'தண்ணீர்', translit: 'Thanneer', meaning: 'Water' },
          { tamil: 'தேடி', translit: 'Thedi', meaning: 'Searching' },
          { tamil: 'வானில்', translit: 'Vaanil', meaning: 'In the sky' },
          { tamil: 'இங்குமங்கும்', translit: 'Ingumangum', meaning: 'Here and there' },
          { tamil: 'பறந்தது', translit: 'Paranthathu', meaning: 'Flew' },
        ],
      },
      {
        sentence_tamil: 'தோட்டத்தில் ஒரு சிறிய மண்பானையைக் கண்டது.',
        sentence_translit: 'Thoattathil oru siriya manpaanaiyai kandathu.',
        sentence_english: 'In a green garden, it spotted a small clay pot.',
        scene_illustration: 'crow_spots_pot',
        words: [
          { tamil: 'தோட்டத்தில்', translit: 'Thoattathil', meaning: 'In the garden' },
          { tamil: 'சிறிய', translit: 'Siriya', meaning: 'Small' },
          { tamil: 'மண்பானையை', translit: 'Manpaanaiyai', meaning: 'Clay pot' },
          { tamil: 'கண்டது', translit: 'Kandathu', meaning: 'Spotted / Saw' },
        ],
      },
      {
        sentence_tamil: 'பானையில் அடியில் கொஞ்சமே தண்ணீர் இருந்தது; காகத்தின் அலகு எட்டவில்லை.',
        sentence_translit: 'Paanaiyil adiyil konjamae thanneer irunthathu; kaagathin alagu ettavillai.',
        sentence_english: 'There was only a little water at the bottom; the crow could not reach it.',
        scene_illustration: 'crow_cant_reach',
        words: [
          { tamil: 'அடியில்', translit: 'Adiyil', meaning: 'At the bottom' },
          { tamil: 'கொஞ்சமே', translit: 'Konjamae', meaning: 'Only a little' },
          { tamil: 'தண்ணீர்', translit: 'Thanneer', meaning: 'Water' },
          { tamil: 'அலகு', translit: 'Alagu', meaning: 'Beak' },
          { tamil: 'எட்டவில்லை', translit: 'Ettavillai', meaning: 'Could not reach' },
        ],
      },
      {
        sentence_tamil: 'காகம் சிறிய கூழாங்கற்களை ஒவ்வொன்றாக எடுத்து பானையில் போட்டது.',
        sentence_translit: 'Kaagam siriya koozhaankarkalai ovvondraaga eduthu paanaiyil poattathu.',
        sentence_english: 'Clever crow picked up pebbles one by one and dropped them into the pot.',
        scene_illustration: 'crow_dropping_pebbles',
        words: [
          { tamil: 'கூழாங்கற்களை', translit: 'Koozhaankarkalai', meaning: 'Pebbles' },
          { tamil: 'ஒவ்வொன்றாக', translit: 'Ovvondraaga', meaning: 'One by one' },
          { tamil: 'எடுத்து', translit: 'Eduthu', meaning: 'Picking up' },
          { tamil: 'போட்டது', translit: 'Poattathu', meaning: 'Dropped' },
        ],
      },
      {
        sentence_tamil: 'தண்ணீர் மேலே உயர்ந்தது; காகம் வயிறாரக் குடித்து மகிழ்ச்சியுடன் பறந்தது!',
        sentence_translit: 'Thanneer maelae uyarnthathu; kaagam vayiraarak kudithu magizhchiyudan paranthathu!',
        sentence_english: 'The water rose to the top; the crow drank happily and flew away!',
        scene_illustration: 'crow_drinks_happy',
        words: [
          { tamil: 'மேலே', translit: 'Maelae', meaning: 'To the top' },
          { tamil: 'உயர்ந்தது', translit: 'Uyarnthathu', meaning: 'Rose up' },
          { tamil: 'குடித்து', translit: 'Kudithu', meaning: 'Drank' },
          { tamil: 'மகிழ்ச்சியுடன்', translit: 'Magizhchiyudan', meaning: 'With happiness' },
        ],
      },
    ],
  },

  // ================= 2. FUNNY: The Capseller & The Monkeys =================
  {
    id: 'story-2',
    title_tamil: 'தொப்பி வியாபாரியும் குரங்குகளும்',
    title_translit: 'Thoppi Viyabaariyum Kurangugalum',
    title_english: 'The Capseller & The Monkeys',
    level: 'Beginner (எளிது)',
    genre: 'funny',
    genre_label: 'Funny & Comical (நகைச்சுவை)',
    genre_emoji: '😄',
    cover_image: '👨‍🌾🧢🐒🌳',
    moral: 'Think smartly when facing tricky situations! (சமயோசித புத்தி நலம் தரும்)',
    sentences: [
      {
        sentence_tamil: 'ஒரு தொப்பி வியாபாரி களைத்துப்போய் பெரிய ஆலமரத்தடியில் தூங்கினான்.',
        sentence_translit: 'Oru thoppi viyabaari kalaithuppoi periya aalamarathadiyil thoonginaan.',
        sentence_english: 'Tired from walking, a capseller fell asleep under a big banyan tree.',
        scene_illustration: 'capseller_sleeping',
        words: [
          { tamil: 'தொப்பி', translit: 'Thoppi', meaning: 'Cap' },
          { tamil: 'வியாபாரி', translit: 'Viyabaari', meaning: 'Merchant / Seller' },
          { tamil: 'ஆலமரத்தடியில்', translit: 'Aalamarathadiyil', meaning: 'Under banyan tree' },
          { tamil: 'தூங்கினான்', translit: 'Thoonginaan', meaning: 'Slept' },
        ],
      },
      {
        sentence_tamil: 'மரத்திலிருந்த குறும்புக்கார குரங்குகள் தொப்பிக் கூடையைத் திறந்து அணிந்தன.',
        sentence_translit: 'Marathiliruntha kurumbukkaara kurangugal thoppik koodaiyai thiranthu aninthana.',
        sentence_english: 'Mischievous monkeys in the tree opened his basket and wore colorful caps.',
        scene_illustration: 'monkeys_wear_caps',
        words: [
          { tamil: 'குறும்புக்கார', translit: 'Kurumbukkaara', meaning: 'Naughty / Mischievous' },
          { tamil: 'குரங்குகள்', translit: 'Kurangugal', meaning: 'Monkeys' },
          { tamil: 'கூடை', translit: 'Koodai', meaning: 'Basket' },
          { tamil: 'அணிந்தன', translit: 'Aninthana', meaning: 'Wore' },
        ],
      },
      {
        sentence_tamil: 'வியாபாரி விழித்துப் பார்த்து தன் தலையிலடித்தபடி கைகளை ஆட்டினான்.',
        sentence_translit: 'Viyabaari vizhithup paarthu than thalaiyiladithapadi kaigalai aattinaan.',
        sentence_english: 'The capseller woke up, hit his forehead, and waved his arms in disbelief.',
        scene_illustration: 'capseller_waving_arms',
        words: [
          { tamil: 'விழித்து', translit: 'Vizhithu', meaning: 'Waking up' },
          { tamil: 'பார்த்து', translit: 'Paarthu', meaning: 'Looking' },
          { tamil: 'கைகளை', translit: 'Kaigalai', meaning: 'Hands / Arms' },
          { tamil: 'ஆட்டினான்', translit: 'Aattinaan', meaning: 'Waved' },
        ],
      },
      {
        sentence_tamil: 'குரங்குகளும் அவனைப் போலவே கைகளை ஆட்டிப் பற்களைக் காட்டிச் சிரித்தன!',
        sentence_translit: 'Kurangugalum avanaip polavae kaigalai aattip parkalaik kaattich sirithana!',
        sentence_english: 'The silly monkeys imitated him, waving their arms and grinning playfully!',
        scene_illustration: 'monkeys_imitating',
        words: [
          { tamil: 'அவனைப் போலவே', translit: 'Avanaip polavae', meaning: 'Just like him' },
          { tamil: 'சிரித்தன', translit: 'Sirithana', meaning: 'Laughed' },
        ],
      },
      {
        sentence_tamil: 'வியாபாரி தன் தலையிலிருந்த தொப்பியைக் கழற்றி ஆவேசமாகத் தரையில் எறிந்தான்.',
        sentence_translit: 'Viyabaari than thalaiyiliruntha thoppiyaik kazhatri aavesamaagath tharaiyil erinthaan.',
        sentence_english: 'The clever seller removed his own cap and tossed it dramatically to the ground.',
        scene_illustration: 'capseller_throws_cap',
        words: [
          { tamil: 'கழற்றி', translit: 'Kazhatri', meaning: 'Removing' },
          { tamil: 'தரையில்', translit: 'Tharaiyil', meaning: 'On the ground' },
          { tamil: 'எறிந்தான்', translit: 'Erinthaan', meaning: 'Threw' },
        ],
      },
      {
        sentence_tamil: 'அதைக்கண்ட குரங்குகளும் தங்கள் தொப்பிகளைத் தரையில் வீச, அவன் அள்ளிக்கொண்டு ஓடினான்!',
        sentence_translit: 'Athaikkanda kurangugalum thangal thoppigalait tharaiyil veesa, avan allikkonddu odinaan!',
        sentence_english: 'Seeing this, all monkeys threw their caps down, and the seller gathered them all and smiled!',
        scene_illustration: 'capseller_wins',
        words: [
          { tamil: 'வீச', translit: 'Veesa', meaning: 'Throwing' },
          { tamil: 'அள்ளிக்கொண்டு', translit: 'Allikkonddu', meaning: 'Gathering up' },
          { tamil: 'ஓடினான்', translit: 'Odinaan', meaning: 'Ran / Escaped' },
        ],
      },
    ],
  },

  // ================= 3. SARCASTIC: The Fox & Sour Grapes =================
  {
    id: 'story-3',
    title_tamil: 'நரியும் புளித்த திராட்சையும்',
    title_translit: 'Nariyum Pulitha Thiraatchaiyum',
    title_english: 'The Fox and Sour Grapes',
    level: 'Intermediate (நடுத்தரம்)',
    genre: 'sarcastic',
    genre_label: 'Sarcastic & Witty (கிண்டல் & சமார்த்தியம்)',
    genre_emoji: '🦊',
    cover_image: '🦊🍇🤤🙄',
    moral: 'It is foolish to dislike what you cannot have! (கிடைக்காததை இகழக் கூடாது)',
    sentences: [
      {
        sentence_tamil: 'பசியுள்ள ஒரு தந்திர நரி அழகான திராட்சைத் தோட்டத்திற்குள் நுழைந்தது.',
        sentence_translit: 'Pasiyulla oru thanthira nari azhagaana thiraatchaith thoattathirkul nuzhainthathu.',
        sentence_english: 'A hungry and cunning fox wandered into a lovely vineyard.',
        scene_illustration: 'fox_enters_vineyard',
        words: [
          { tamil: 'பசியுள்ள', translit: 'Pasiyulla', meaning: 'Hungry' },
          { tamil: 'தந்திர', translit: 'Thanthira', meaning: 'Cunning' },
          { tamil: 'நரி', translit: 'Nari', meaning: 'Fox' },
          { tamil: 'தோட்டத்திற்குள்', translit: 'Thoattathirkul', meaning: 'Into the garden' },
        ],
      },
      {
        sentence_tamil: 'கொடியில் கொத்துக் கொத்தாகப் பழுத்த ஊதா திராட்சைப் பழங்கள் தொங்கின.',
        sentence_translit: 'Kodiyil kothuk kothaagap pazhutha oothaa thiraatchaip pazhangal thongina.',
        sentence_english: 'Juicy, ripe purple grapes were hanging in big bunches high on the vines.',
        scene_illustration: 'fox_looks_at_grapes',
        words: [
          { tamil: 'கொடியில்', translit: 'Kodiyil', meaning: 'On the creeper' },
          { tamil: 'பழுத்த', translit: 'Pazhutha', meaning: 'Ripe' },
          { tamil: 'திராட்சை', translit: 'Thiraatchai', meaning: 'Grapes' },
        ],
      },
      {
        sentence_tamil: 'நரியின் வாயில் எச்சில் ஊறியது; திராட்சையைப் பறிக்க மேலே துள்ளிக் குதித்தது.',
        sentence_translit: 'Nariyin vaayil echil ooriyathu; thiraatchaiyaip parikka maelae thullik kuthithathu.',
        sentence_english: 'The fox’s mouth watered, and it leaped high into the air to pluck the fruit.',
        scene_illustration: 'fox_jumping_high',
        words: [
          { tamil: 'வாயில்', translit: 'Vaayil', meaning: 'In the mouth' },
          { tamil: 'பறிக்க', translit: 'Parikka', meaning: 'To pluck' },
          { tamil: 'குதித்தது', translit: 'Kuthithathu', meaning: 'Jumped' },
        ],
      },
      {
        sentence_tamil: 'திராட்சைக் கொத்து மிக உயரத்தில் இருந்ததால் நரியால் தொடக்கூட முடியவில்லை.',
        sentence_translit: 'Thiraatchaik kothu miga uyarathil irunthathaal nariyaal thodakkooda mudiyavillai.',
        sentence_english: 'Because the grapes were so high, the fox could not even touch them.',
        scene_illustration: 'fox_misses_grapes',
        words: [
          { tamil: 'உயரத்தில்', translit: 'Uyarathil', meaning: 'At a height' },
          { tamil: 'தொடக்கூட', translit: 'Thodakkooda', meaning: 'Even to touch' },
          { tamil: 'முடியவில்லை', translit: 'Mudiyavillai', meaning: 'Could not' },
        ],
      },
      {
        sentence_tamil: 'மீண்டும் மீண்டும் பலமுறை குதித்துப் பார்த்து நரி மூச்சிரைத்துக் களைத்தது.',
        sentence_translit: 'Meendum meendum paladmurai kuthithup paarthu nari moochiraithuk kalaithathu.',
        sentence_english: 'Jumping again and again, the exhausted fox collapsed on the grass.',
        scene_illustration: 'fox_exhausted',
        words: [
          { tamil: 'மீண்டும்', translit: 'Meendum', meaning: 'Again' },
          { tamil: 'களைத்தது', translit: 'Kalaithathu', meaning: 'Became tired' },
        ],
      },
      {
        sentence_tamil: 'முடிவில் நரி மூக்கைச் சுளித்து, "சீச்சீ! இந்தத் திராட்சை மிகவும் புளிக்கும்!" என்று கூறிச் சென்றது.',
        sentence_translit: 'Mudivil nari mookkaich sulithu, "Seechchee! Inthath thiraatchai migavum pulikkum!" endru koorich sendrathu.',
        sentence_english: 'Finally wrinkling its nose sarcastically, the fox muttered, "Bah! These grapes are sour anyway!"',
        scene_illustration: 'fox_sarcastic_walk',
        words: [
          { tamil: 'மூக்கைச் சுளித்து', translit: 'Mookkaich sulithu', meaning: 'Wrinkling nose' },
          { tamil: 'புளிக்கும்', translit: 'Pulikkum', meaning: 'Is sour' },
          { tamil: 'கூறிச் சென்றது', translit: 'Koorich sendrathu', meaning: 'Said and walked away' },
        ],
      },
    ],
  },

  // ================= 4. COMPASSION: The Lion & The Mouse =================
  {
    id: 'story-4',
    title_tamil: 'சிங்கமும் சுண்டெலியும்',
    title_translit: 'Singamum Sundeliyum',
    title_english: 'The Lion & The Mouse',
    level: 'Beginner (எளிது)',
    genre: 'compassion',
    genre_label: 'Compassion & Loyalty (கருணை & நன்றி)',
    genre_emoji: '🦁',
    cover_image: '🦁🐭🤝🌳',
    moral: 'Kindness is never wasted; even small friends can help big ones! (சிறிய உதவியும் பெருமை தரும்)',
    sentences: [
      {
        sentence_tamil: 'காட்டின் அரசனான பலசாலி சிங்கம் குகையின் முன் நிம்மதியாகத் தூங்கியது.',
        sentence_translit: 'Kaattin arasanaana balasali singam kugaiyin mun nimmathiyaagath thoongiyathu.',
        sentence_english: 'The mighty king of the jungle, the lion, was sleeping peacefully outside his cave.',
        scene_illustration: 'lion_sleeping',
        words: [
          { tamil: 'காட்டின் அரசன்', translit: 'Kaattin arasan', meaning: 'King of jungle' },
          { tamil: 'சிங்கம்', translit: 'Singam', meaning: 'Lion' },
          { tamil: 'தூங்கியது', translit: 'Thoongiyathu', meaning: 'Slept' },
        ],
      },
      {
        sentence_tamil: 'அப்போது ஒரு சிறிய சுண்டெலி சிங்கத்தின் பிடரி மயிரில் ஏறி விளையாடியது.',
        sentence_translit: 'Appothu oru siriya sundeli singathin pidari mayiril aeri vilaiyaadiyathu.',
        sentence_english: 'Just then, a tiny mouse ran playfully over the lion’s majestic mane.',
        scene_illustration: 'mouse_playing_on_lion',
        words: [
          { tamil: 'சுண்டெலி', translit: 'Sundeli', meaning: 'Little mouse' },
          { tamil: 'விளையாடியது', translit: 'Vilaiyaadiyathu', meaning: 'Played' },
        ],
      },
      {
        sentence_tamil: 'விழித்த சிங்கம் கோபத்துடன் எலியைப் பிடித்தது; "என்னை விட்டுவிடுங்கள், ஒருநாள் உதவுவேன்!" என எலி கெஞ்சியது.',
        sentence_translit: 'Vizhitha singam kobathudan eliyaip pidithathu; "Ennai vittuvidungal, orunaal uthavuvaen!" ena eli kenjiyathu.',
        sentence_english: 'Waking up, the lion caught the mouse; "Please spare me, I might help you someday!" squeaked the mouse.',
        scene_illustration: 'lion_catches_mouse',
        words: [
          { tamil: 'கோபத்துடன்', translit: 'Kobathudan', meaning: 'With anger' },
          { tamil: 'உதவுவேன்', translit: 'Uthavuvaen', meaning: 'I will help' },
        ],
      },
      {
        sentence_tamil: 'சுண்டெலியின் பேச்சைக் கேட்டுச் சிரித்த சிங்கம் இரக்கம் கொண்டு அதை விடுவித்தது.',
        sentence_translit: 'Sundeliyin paechaik kaettuch siritha singam irakkam kondu athai viduvithathu.',
        sentence_english: 'Amused by the tiny mouse’s courage, the kind lion chuckled and set it free.',
        scene_illustration: 'lion_spares_mouse',
        words: [
          { tamil: 'இரக்கம்', translit: 'Irakkam', meaning: 'Pity / Compassion' },
          { tamil: 'விடுவித்தது', translit: 'Viduvithathu', meaning: 'Released / Set free' },
        ],
      },
      {
        sentence_tamil: 'சில நாட்கள் கழித்து, சிங்கம் வேடனின் பலமான கயிறு வலையில் மாட்டிக்கொண்டு கர்ஜித்தது.',
        sentence_translit: 'Sila naatkal kazhithu, singam vaedanin balamaana kayiru valaiyil maattikkondu karjithathu.',
        sentence_english: 'A few days later, the lion was caught in a hunter’s strong net and roared in distress.',
        scene_illustration: 'lion_trapped_net',
        words: [
          { tamil: 'வேடன்', translit: 'Vaedan', meaning: 'Hunter' },
          { tamil: 'வலையில்', translit: 'Valaiyil', meaning: 'In the net' },
          { tamil: 'கர்ஜித்தது', translit: 'Karjithathu', meaning: 'Roared' },
        ],
      },
      {
        sentence_tamil: 'கர்ஜனை கேட்டு ஓடிவந்த சுண்டெலி, தன் கூரிய பற்களால் வலையைக் கடித்து சிங்கத்தைக் காப்பாற்றியது!',
        sentence_translit: 'Karjanai kaettu odivantha sundeli, than kooriya parkalaal valaiyaik kadithu singathaik kaappaatriyathu!',
        sentence_english: 'Hearing the roar, the loyal mouse rushed over, chewed the ropes with sharp teeth, and saved the lion!',
        scene_illustration: 'mouse_saves_lion',
        words: [
          { tamil: 'கூரிய பற்களால்', translit: 'Kooriya parkalaal', meaning: 'With sharp teeth' },
          { tamil: 'காப்பாற்றியது', translit: 'Kaappaatriyathu', meaning: 'Rescued / Saved' },
        ],
      },
    ],
  },

  // ================= 5. PATIENCE: The Tortoise & The Hare =================
  {
    id: 'story-5',
    title_tamil: 'ஆமையும் முயலும்',
    title_translit: 'Aamayum Muyalum',
    title_english: 'The Tortoise & The Hare',
    level: 'Beginner (எளிது)',
    genre: 'patience',
    genre_label: 'Patience & Focus (பொறுமை & விடாமுயற்சி)',
    genre_emoji: '🐢',
    cover_image: '🐢🐇🏁🏆',
    moral: 'Slow and steady wins the race! (பொறுமையும் தொடர் முயற்சியும் வெற்றியைத் தரும்)',
    sentences: [
      {
        sentence_tamil: 'வேகமாக ஓடும் கர்வம் கொண்ட முயல் மெதுவாக நடக்கும் ஆமையைப் பார்த்துப் பரிகாசம் செய்தது.',
        sentence_translit: 'Vaegamaaga odum garvam konda muyal methuvaaga nadakkum aamayaip paarthup parikaasam seithathu.',
        sentence_english: 'A proud, speedy rabbit teased a gentle tortoise for his slow walking pace.',
        scene_illustration: 'rabbit_teasing_tortoise',
        words: [
          { tamil: 'முயல்', translit: 'Muyal', meaning: 'Rabbit / Hare' },
          { tamil: 'ஆமை', translit: 'Aamai', meaning: 'Tortoise' },
          { tamil: 'பரிகாசம்', translit: 'Parikaasam', meaning: 'Mockery / Teasing' },
        ],
      },
      {
        sentence_tamil: 'அமைதியான ஆமை புன்னகைத்து, முயலை ஒரு ஓட்டப் பந்தயத்திற்கு அழைத்தது.',
        sentence_translit: 'Amaithiyaana aamai punnagaithu, muyalai oru oattap panthayathirku azhaithathu.',
        sentence_english: 'The calm tortoise smiled and challenged the boastful hare to a running race.',
        scene_illustration: 'tortoise_challenges_race',
        words: [
          { tamil: 'புன்னகைத்து', translit: 'Punnagaithu', meaning: 'Smiling' },
          { tamil: 'பந்தயம்', translit: 'Panthayam', meaning: 'Race' },
        ],
      },
      {
        sentence_tamil: 'பந்தயம் தொடங்கியது; முயல் புயல் வேகத்தில் ஓடி வெகுதூரம் முன்னே சென்றது.',
        sentence_translit: 'Panthayam thodangiyathu; muyal puyal vaegathil odi veguthooram munnae sendrathu.',
        sentence_english: 'The race began; the hare shot forward like a storm, leaving the tortoise far behind.',
        scene_illustration: 'hare_running_fast',
        words: [
          { tamil: 'தொடங்கியது', translit: 'Thodangiyathu', meaning: 'Began' },
          { tamil: 'முன்னே', translit: 'Munnae', meaning: 'Ahead' },
        ],
      },
      {
        sentence_tamil: '"ஆமை வர வெகுநேரம் ஆகும்" என எண்ணிய முயல் மரத்தடி நிழலில் படுத்து உறங்கியது.',
        sentence_translit: '"Aamai vara vegunaeram aagum" ena enniya muyal marathadi nizhalil paduthu urangiyathu.',
        sentence_english: 'Thinking the tortoise was miles away, the overconfident hare lay down for a nap.',
        scene_illustration: 'hare_sleeping_tree',
        words: [
          { tamil: 'நிழலில்', translit: 'Nizhalil', meaning: 'In the shade' },
          { tamil: 'உறங்கியது', translit: 'Urangiyathu', meaning: 'Fell asleep' },
        ],
      },
      {
        sentence_tamil: 'ஆமை சற்றும் சோர்வடையாமல் ஒரே சீரான வேகத்தில் நடந்து முயலைக் கடந்தது.',
        sentence_translit: 'Aamai satrum soorvadaaiyaamal orae seeraana vaegathil nadanthu muyalaik kadanthathu.',
        sentence_english: 'Without stopping or losing focus, the steady tortoise marched quietly past the sleeping hare.',
        scene_illustration: 'tortoise_passing_hare',
        words: [
          { tamil: 'சீரான', translit: 'Seeraana', meaning: 'Steady / Constant' },
          { tamil: 'கடந்தது', translit: 'Kadanthathu', meaning: 'Crossed / Passed' },
        ],
      },
      {
        sentence_tamil: 'முயல் விழித்தபோது ஆமை வெற்றிக் கோட்டைத் தொட்டுவிட்டது; முயல் தலைகுனிந்தது!',
        sentence_translit: 'Muyal vizhithapothu aamai vettrik koattaith thottuvittathu; muyal thalaiguninthathu!',
        sentence_english: 'When the hare woke, the tortoise had crossed the finish line to joyful cheers!',
        scene_illustration: 'tortoise_wins_trophy',
        words: [
          { tamil: 'வெற்றிக் கோடு', translit: 'Vettrik koodu', meaning: 'Finish line' },
          { tamil: 'தொட்டுவிட்டது', translit: 'Thottuvittathu', meaning: 'Touched / Crossed' },
        ],
      },
    ],
  },

  // ================= 6. FRIENDSHIP: The Elephant & The Tailor =================
  {
    id: 'story-6',
    title_tamil: 'யானையும் தையல்காரனும்',
    title_translit: 'Yaanaiyum Thaiyalkaranum',
    title_english: 'The Elephant & The Tailor',
    level: 'Intermediate (நடுத்தரம்)',
    genre: 'friendship',
    genre_label: 'Friendship & Empathy (நட்பும் மன்னிப்பும்)',
    genre_emoji: '🐘',
    cover_image: '🐘✂️🍌💦',
    moral: 'Treat everyone with kindness; pain given returns! (தீதும் நன்றும் பிறர்தர வாரா)',
    sentences: [
      {
        sentence_tamil: 'ஒரு ஊரில் அழகான கோவில் யானை தினமும் ஆற்றுக்குக் குளிக்கச் செல்லும்.',
        sentence_translit: 'Oru ooril azhagaana kovil yaanai thinamum aatrukuk kulikkach sellum.',
        sentence_english: 'In a peaceful town, a gentle temple elephant walked to the river every day for a bath.',
        scene_illustration: 'elephant_walking_village',
        words: [
          { tamil: 'யானை', translit: 'Yaanai', meaning: 'Elephant' },
          { tamil: 'ஆற்றுக்கு', translit: 'Aatruku', meaning: 'To the river' },
        ],
      },
      {
        sentence_tamil: 'வழியில் ஒரு தையல்காரர் கடை இருந்தது; அவர் யானைக்கு இனிய வாழைப்பழங்களைக் கொடுப்பார்.',
        sentence_translit: 'Vazhiyil oru thaiyalkaarar kadai irunthathu; avar yaanaiku iniya vaazhaipazhangalaik koduppaar.',
        sentence_english: 'On the way stood a tailor’s shop; the kind tailor always shared ripe bananas with the elephant.',
        scene_illustration: 'tailor_gives_banana',
        words: [
          { tamil: 'தையல்காரர்', translit: 'Thaiyalkaarar', meaning: 'Tailor' },
          { tamil: 'வாழைப்பழம்', translit: 'Vaazhaipazham', meaning: 'Banana' },
        ],
      },
      {
        sentence_tamil: 'யானையும் தையல்காரரும் பல ஆண்டுகளாக இணைபிரியா நண்பர்களாகப் பழகினர்.',
        sentence_translit: 'Yaanaiyum thaiyalkaararum pala aandukalaaga inaipiriyaa nanbarkalaagap pazhaginar.',
        sentence_english: 'Over the years, the elephant and the tailor grew into inseparable friends.',
        scene_illustration: 'elephant_tailor_friends',
        words: [
          { tamil: 'நண்பர்கள்', translit: 'Nanbarkal', meaning: 'Friends' },
        ],
      },
      {
        sentence_tamil: 'ஒரு நாள் தையல்காரர் கெட்ட கோபத்தில் இருந்தார்; யானையின் தும்பிக்கையில் ஊசியால் குத்தினார்!',
        sentence_translit: 'Oru naal thaiyalkaarar ketta kobathil irunthaar; yaanaiyin thumbikkaiyil oosiyaal kuthinaar!',
        sentence_english: 'One day in bad temper, the tailor foolishly pricked the elephant’s trunk with a sewing needle!',
        scene_illustration: 'tailor_pricks_needle',
        words: [
          { tamil: 'தும்பிக்கை', translit: 'Thumbikkai', meaning: 'Trunk' },
          { tamil: 'ஊசியால்', translit: 'Oosiyaal', meaning: 'With needle' },
        ],
      },
      {
        sentence_tamil: 'யானை அமைதியாக ஆற்றுக்குச் சென்று தன் தும்பிக்கை நிறைய சேற்றுத் தண்ணீரை உறிஞ்சியது.',
        sentence_translit: 'Yaanai amaithiyaaga aatrukuch sendru than thumbikkai niraiya saetruth thanneerai urinjiyathu.',
        sentence_english: 'The pained elephant walked quietly to the river and filled its trunk with muddy water.',
        scene_illustration: 'elephant_muddy_water',
        words: [
          { tamil: 'சேற்றுத் தண்ணீர்', translit: 'Saetruth thanneer', meaning: 'Muddy water' },
        ],
      },
      {
        sentence_tamil: 'கடைக்குத் திரும்பிய யானை சேற்றுத் தண்ணீரைத் தெளித்தது; தையல்காரர் தன் தவறை உணர்ந்து மன்னிப்புக் கேட்டார்!',
        sentence_translit: 'Kadaikuth thirumbiya yaanai saetruth thanneeraith thelithathu; thaiyalkaarar than thavarai unarnthu mannippuk kaettaar!',
        sentence_english: 'Returning to the shop, the elephant showered the muddy water; the tailor apologized with fresh fruits and learned kindness!',
        scene_illustration: 'elephant_splashes_tailor',
        words: [
          { tamil: 'தெளித்தது', translit: 'Thelithathu', meaning: 'Splashed / Sprinkled' },
          { tamil: 'மன்னிப்பு', translit: 'Mannippu', meaning: 'Apology / Forgiveness' },
        ],
      },
    ],
  },
];
