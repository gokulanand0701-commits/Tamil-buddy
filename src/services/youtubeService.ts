import axios from 'axios';

export interface YouTubeVideoItem {
  id: string; // YouTube Video ID
  title: string;
  title_tamil: string;
  description: string;
  category: 'vowels' | 'consonants' | 'words' | 'sentences' | 'stories';
  thumbnailUrl: string;
  duration?: string;
}

// Curated high quality Tamil learning reference videos for children
export const CURATED_TAMIL_VIDEOS: YouTubeVideoItem[] = [
  {
    id: 'kX_T-m9K2gA',
    title: 'Tamil Uyir Ezhuthukkal Song (உயிர் எழுத்துக்கள்)',
    title_tamil: 'அ முதல் ஔ வரை உயிர் எழுத்துக்கள் பாடல்',
    description: 'Catchy and colorful animated song teaching all 12 Tamil vowels with pronunciations and picture examples.',
    category: 'vowels',
    thumbnailUrl: 'https://img.youtube.com/vi/kX_T-m9K2gA/hqdefault.jpg',
    duration: '3:45',
  },
  {
    id: 'k0V4E6L8oZ8',
    title: 'Tamil Mei Ezhuthukkal (மெய் எழுத்துக்கள் 18)',
    title_tamil: 'க் முதல் ன் வரை மெய் எழுத்துக்கள் பாடல்',
    description: 'Fun animated guide to the 18 dotted consonants with pulli and clear phonetic voiceovers.',
    category: 'consonants',
    thumbnailUrl: 'https://img.youtube.com/vi/k0V4E6L8oZ8/hqdefault.jpg',
    duration: '4:10',
  },
  {
    id: 'mG_1lV_X4mQ',
    title: 'Learn Daily Tamil Words & Sentences for Kids',
    title_tamil: 'குழந்தைகளுக்கான எளிய தமிழ்ச் சொற்கள்',
    description: 'Essential everyday vocabulary: Family (அம்மா, அப்பா), Food (சோறு, பால்), Animals and Colors.',
    category: 'words',
    thumbnailUrl: 'https://img.youtube.com/vi/mG_1lV_X4mQ/hqdefault.jpg',
    duration: '5:20',
  },
  {
    id: 'p7K3o8J2vBc',
    title: 'Easy Tamil Sentences for Beginners (எளிய வாக்கியங்கள்)',
    title_tamil: '2 மற்றும் 3 சொல் எளிய தமிழ் வாக்கியங்கள்',
    description: 'Step-by-step pronunciation guide for speaking simple conversational sentences at home.',
    category: 'sentences',
    thumbnailUrl: 'https://img.youtube.com/vi/p7K3o8J2vBc/hqdefault.jpg',
    duration: '6:15',
  },
  {
    id: 'x8Q9s1R5dFg',
    title: 'The Thirsty Crow - Tamil Moral Story (தாகமுள்ள காகம்)',
    title_tamil: 'தாகமுள்ள காகம் - அனிமேஷன் தமிழ்க்கதை',
    description: 'Panchatantra fable with clear Tamil narration, subtitled for easy understanding.',
    category: 'stories',
    thumbnailUrl: 'https://img.youtube.com/vi/x8Q9s1R5dFg/hqdefault.jpg',
    duration: '4:30',
  },
];

export const youtubeService = {
  getApiKey(): string {
    const customKey = localStorage.getItem('tamil_buddy_youtube_key');
    if (customKey && customKey.trim()) return customKey.trim();
    return import.meta.env.VITE_YOUTUBE_API_KEY || '';
  },

  setApiKey(key: string) {
    if (key.trim()) {
      localStorage.setItem('tamil_buddy_youtube_key', key.trim());
    } else {
      localStorage.removeItem('tamil_buddy_youtube_key');
    }
  },

  async searchTamilVideos(query: string = 'tamil learning kids'): Promise<YouTubeVideoItem[]> {
    const apiKey = this.getApiKey();

    // If API key is available, fetch live videos from YouTube Data API v3
    if (apiKey) {
      try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=6&q=${encodeURIComponent(
          query
        )}&key=${apiKey}`;
        const res = await axios.get(url);

        if (res.data && res.data.items) {
          return res.data.items.map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            title_tamil: 'தமிழ் கற்றல் பாடம்',
            description: item.snippet.description,
            category: 'words',
            thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
          }));
        }
      } catch (err) {
        console.warn('YouTube API call failed or quota exceeded, using curated videos fallback', err);
      }
    }

    // Default fallback to curated offline-ready list
    return CURATED_TAMIL_VIDEOS;
  },
};
