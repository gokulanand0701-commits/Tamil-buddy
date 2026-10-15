export interface TopicData {
  id: string;
  name: string;
  name_tamil: string;
  emoji: string;
  starter_tamil: string;
  starter_translit: string;
  starter_english: string;
  initial_suggestions: string[];
}

export const CHAT_TOPICS: TopicData[] = [
  {
    id: 'family',
    name: 'Family',
    name_tamil: 'குடும்பம்',
    emoji: '👨‍👩‍👧‍👦',
    starter_tamil: 'வணக்கம்! உங்கள் வீட்டில் யார் யார் இருக்கிறார்கள்? அம்மா, அப்பா பற்றி சொல்லுங்கள்!',
    starter_translit: 'Vanakkam! Ungal veetil yaar yaar irukkiraargal? Amma, Appa patri sollungal!',
    starter_english: 'Hello! Who lives with you in your home? Tell me about your Amma and Appa!',
    initial_suggestions: [
      'அம்மா, அப்பா, தம்பி (Amma, Appa, Thambi)',
      'என் அம்மா அன்பானவர் (My mother is loving)',
      'எனக்கு ஒரு அக்கா உண்டு (I have an elder sister)'
    ]
  },
  {
    id: 'food',
    name: 'Food',
    name_tamil: 'உணவு',
    emoji: '🥞',
    starter_tamil: 'ஆஹா! எனக்கு தோசையும் பழங்களும் ரொம்ப பிடிக்கும்! உங்களுக்கு என்ன சாப்பிட பிடிக்கும்?',
    starter_translit: 'Aahaa! Enakku dhosaiyum pazhangalum romba pidikkum! Ungalukku enna saappida pidikkum?',
    starter_english: 'Yum! I really love dosa and sweet fruits! What is your favorite Tamil food to eat?',
    initial_suggestions: [
      'எனக்கு தோசை பிடிக்கும் (I like Dosa)',
      'நான் பால் குடிப்பேன் (I drink milk)',
      'மாம்பழம் மிகவும் இனிப்பு (Mango is very sweet)'
    ]
  },
  {
    id: 'festivals',
    name: 'Festivals',
    name_tamil: 'திருவிழாக்கள்',
    emoji: '🪔',
    starter_tamil: 'பொங்கலும் தீபாவளியும் வந்தாச்சு! நீங்கள் எப்படி கொண்டாடுவீர்கள்?',
    starter_translit: 'Pongalum Deepavaliyum vanthaachu! Neengal eppadi kondaaduveergal?',
    starter_english: 'Pongal and Deepavali celebrations! How do you celebrate holidays with your family?',
    initial_suggestions: [
      'பொங்கலோ பொங்கல்! (Pongalo Pongal!)',
      'புதிய ஆடை அணிவேன் (I wear new clothes)',
      'இனிப்பு சாப்பிடுவேன் (I eat sweets)'
    ]
  },
  {
    id: 'school',
    name: 'School',
    name_tamil: 'பள்ளி',
    emoji: '🎒',
    starter_tamil: 'உங்கள் பள்ளி எப்படி இருக்கிறது? உங்களுக்கு பிடித்த பாடம் எது?',
    starter_translit: 'Ungal palli eppadi irukkirathu? Ungalukku piditha paadam ethu?',
    starter_english: 'How is your school? What is your favorite subject to study?',
    initial_suggestions: [
      'எனக்கு ஓவியம் பிடிக்கும் (I love drawing)',
      'என் பள்ளி நண்பர்கள் நல்லவர்கள் (My school friends are nice)',
      'நான் தமிழ் படிக்கிறேன் (I am learning Tamil)'
    ]
  },
  {
    id: 'animals',
    name: 'Animals',
    name_tamil: 'விலங்குகள்',
    emoji: '🦜',
    starter_tamil: 'நான் ஒரு பச்சை கிளி! உங்களுக்கு பூனை பிடிக்குமா அல்லது நாய் பிடிக்குமா?',
    starter_translit: 'Naan oru pachai kili! Ungalukku poonai pidikkumaa allathu naai pidikkumaa?',
    starter_english: 'I am a bright green parrot! Do you like playful cats or loyal dogs?',
    initial_suggestions: [
      'எனக்கு பூனை பிடிக்கும் (I like cats)',
      'நாய் குரைக்கும் (Dog barks)',
      'யானை மிகவும் பெரியது (Elephant is very big)'
    ]
  }
];

export function getMockChatReply(userMessage: string, topicId: string) {
  const msg = userMessage.toLowerCase();

  if (topicId === 'family') {
    if (msg.includes('amma') || msg.includes('அம்மா')) {
      return {
        reply_tamil: 'அம்மா என்றால் அன்பு! உங்கள் அம்மாவுக்கு வணக்கம் சொல்லுங்கள்!',
        reply_translit: 'Amma endraal anbu! Ungal ammaavukku vanakkam sollungal!',
        reply_english: 'Amma means pure love! Send my warm greetings to your mother!',
        suggested_replies: ['சரி கிளி! (Sure Kili!)', 'அப்பா அலுவலகம் சென்றார் (Father went to office)']
      };
    }
    if (msg.includes('appa') || msg.includes('அப்பா')) {
      return {
        reply_tamil: 'அப்பா ஒரு சூப்பர் ஹீரோ! நீங்கள் இருவரும் சேர்ந்து விளையாடுவீர்களா?',
        reply_translit: 'Appa oru super hero! Neengal iruvarum sernthu vilaiyaaduveergal?',
        reply_english: 'Appa is a real superhero! Do you two play fun games together?',
        suggested_replies: ['ஆமாம், விளையாடுவோம்! (Yes, we play!)', 'தம்பியுடன் விளையாடுவேன் (I play with brother)']
      };
    }
    return {
      reply_tamil: 'உங்கள் குடும்பம் மிகவும் அழகாக இருக்கிறது! தமிழிலும் பேசி மகிழுங்கள்!',
      reply_translit: 'Ungal kudumbam migavum azhagaaga irukkirathu! Thamizhilum pesi magizhungal!',
      reply_english: 'Your family is so lovely! Keep speaking sweet Tamil with them!',
      suggested_replies: ['நன்றி கிளி! (Thank you Kili!)', 'நான் முயற்சி செய்கிறேன் (I will try!)']
    };
  }

  if (topicId === 'food') {
    if (msg.includes('dosa') || msg.includes('தோசை')) {
      return {
        reply_tamil: 'சூடான மொறுமொறு தோசையும் தேங்காய் சட்னியும் சூப்பர் காம்போ! எத்தனை தோசை சாப்பிடுவீர்கள்?',
        reply_translit: 'Soodaana morumoru dhosaiyum thengaai chutney-yum super combo! Ethanai dhosai saappiduveergal?',
        reply_english: 'Crispy hot dosa with fresh coconut chutney is delicious! How many dosas can you eat?',
        suggested_replies: ['இரண்டு தோசை! (Two dosas!)', 'எனக்கு நெய் தோசை பிடிக்கும் (I like ghee dosa)']
      };
    }
    return {
      reply_tamil: 'நல்ல சத்தான உணவை சாப்பிட்டு வலிமையாக வளருங்கள்!',
      reply_translit: 'Nalla saththaana unavai saappittu valimaiyaaga valarungal!',
      reply_english: 'Always eat healthy nutritious food to grow big and strong!',
      suggested_replies: ['பழங்கள் சாப்பிடுவேன் (I eat fruits)', 'பால் குடிப்பேன் (I drink milk)']
    };
  }

  if (topicId === 'animals') {
    if (msg.includes('poonai') || msg.includes('cat') || msg.includes('பூனை')) {
      return {
        reply_tamil: 'மியாவ்! பூனை மெதுவாக நடந்து வந்து பால் குடிக்கும்! உங்களுக்கு பூனை பிடிக்குமா?',
        reply_translit: 'Meow! Poonai methuvaaga nadanthu vanthu paal kudikkum! Ungalukku poonai pidikkumaa?',
        reply_english: 'Meow! The cat walks silently and sips warm milk! Do you like cats?',
        suggested_replies: ['பூனை மிகவும் அழகு (Cat is very cute)', 'என் வீட்டில் பூனை இல்லை (No cat at home)']
      };
    }
    return {
      reply_tamil: 'மிருகங்களை நாம் அன்போடு பாதுகாக்க வேண்டும்! யானை எனக்கு ரொம்ப பிடிக்கும்!',
      reply_translit: 'Mirugangalai naam anboadu paathukaakka vaendum! Yaanai enakku romba pidikkum!',
      reply_english: 'We should protect and care for all animals! I really love gentle elephants!',
      suggested_replies: ['யானை தும்பிக்கை பெரியது (Elephant trunk is big)', 'கிளி பேசும் (Parrot talks)']
    };
  }

  // Default friendly fallback
  return {
    reply_tamil: 'அற்புதம்! நீங்கள் நன்றாக தமிழ் பேசுகிறீர்கள்! எனக்கு கேட்க மிகவும் மகிழ்ச்சியாக உள்ளது!',
    reply_translit: 'Arputham! Neengal nandraaga Thamizh pesugireergal! Enakku ketka migavum magizhchiyaaga ullathu!',
    reply_english: 'Wonderful! You speak Tamil so nicely! It makes me feel so happy to chat with you!',
    suggested_replies: ['நன்றி கிளி! (Thank you Kili!)', 'இன்னும் பேசுவோம்! (Let us chat more!)']
  };
}
