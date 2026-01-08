
import { Manhua, SubscriptionType } from './types';

export const MOCK_MANHUAS: Manhua[] = [
  {
    id: '1',
    title: 'تەختی ئاسمان (Heavenly Throne)',
    description: 'چیرۆکێکی سەرنجڕاکێش دەربارەی جەنگاوەرێک کە دەیەوێت لوتکەی ئاسمان بەدەست بهێنێت.',
    coverImage: 'https://picsum.photos/seed/manhua1/600/800',
    category: 'ئاکشن / سەرکێشی',
    rating: 4.8,
    // Fix: Added missing required properties views and favorites
    views: 0,
    favorites: 0,
    chapters: [
      { id: 'c1', number: 1, title: 'دەستپێکی گەشتەکە', isPremium: false, pages: ['https://picsum.photos/seed/p1/800/1200', 'https://picsum.photos/seed/p2/800/1200'] },
      { id: 'c2', number: 2, title: 'هێزی نادیار', isPremium: true, pages: ['https://picsum.photos/seed/p3/800/1200', 'https://picsum.photos/seed/p4/800/1200'] },
    ]
  },
  {
    id: '2',
    title: 'سیستەمی خودایی',
    description: 'گەنجێک دوای مردنی لە جیهانێکی تر زیندوو دەبێتەوە لەگەڵ سیستەمێکی تایبەت.',
    coverImage: 'https://picsum.photos/seed/manhua2/600/800',
    category: 'خەیاڵی / سیستەم',
    rating: 4.5,
    // Fix: Added missing required properties views and favorites
    views: 0,
    favorites: 0,
    chapters: [
      { id: 'c3', number: 1, title: 'ژیانی دووەم', isPremium: false, pages: ['https://picsum.photos/seed/p5/800/1200'] },
      { id: 'c4', number: 2, title: 'یەکەم ئەرک', isPremium: true, pages: ['https://picsum.photos/seed/p6/800/1200'] },
    ]
  },
  {
    id: '3',
    title: 'کیمیای هەورەکان',
    description: 'گەڕان بەدوای دەرمانی نەمری لە نێوان هەورەکاندا.',
    coverImage: 'https://picsum.photos/seed/manhua3/600/800',
    category: 'دراما / مێژوویی',
    rating: 4.2,
    // Fix: Added missing required properties views and favorites
    views: 0,
    favorites: 0,
    chapters: [
      { id: 'c5', number: 1, title: 'نهێنی کیمیا', isPremium: false, pages: ['https://picsum.photos/seed/p7/800/1200'] },
    ]
  }
];

export const SUBSCRIPTION_OPTIONS = [
  { type: SubscriptionType.ONE_MONTH, label: '١ مانگ', price: '١٠,٠٠٠ دینار' },
  { type: SubscriptionType.TWO_MONTHS, label: '٢ مانگ', price: '١٨,٠٠٠ دینار' },
  { type: SubscriptionType.THREE_MONTHS, label: '٣ مانگ', price: '٢٥,٠٠٠ دینار' },
  { type: SubscriptionType.SIX_MONTHS, label: '٦ مانگ', price: '٤٥,٠٠٠ دینار' },
  { type: SubscriptionType.ONE_YEAR, label: '١ ساڵ', price: '٨٠,٠٠٠ دینار' },
];
