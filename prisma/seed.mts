// seed.ts
// @ts-nocheck
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { faker } from '@faker-js/faker';
import { PrismaClient as PrivatePrisma } from '@dreampipcom/db-private/prisma-client';
import { PrismaClient as PublicPrisma } from '@dreampipcom/db-public/prisma-client';

import { createMockUser, mockUser, mockUser2, mockUser3 } from './mock/user.mts';
import { createMockCommunity, mockCommunity, mockCommunity2, mockCommunity3 } from './mock/communities.mts';
import { createMockListing } from './mock/listings.mts';
import { createMockAudience } from './mock/audiences.mts';
import { createMockTerm } from './mock/taxonomies.mts';
import { createMockMessage } from './mock/messages.mts';
import { createMockRole } from './mock/roles.mts';
import { createMockPubListing } from './mock/public.mts';
import { createMockAbility } from './mock/abilities.mts';
import { createMockFeature } from './mock/features.mts';
import { createMockService } from './mock/services.mts';
import _ from 'lodash';

export const cleanupDatabase = () => {
  const propertyNames = Object.getOwnPropertyNames(pvtPrisma);
  const modelNames = propertyNames.filter((propertyName) => !propertyName.startsWith('_'));

  return Promise.all(modelNames.map((model) => pvtPrisma[model].deleteMany()));
};

const seedType = process.argv[2];

let func;

if (seedType === 'private') {
  console.log('~ SEEDING PRIVATE DB ~');

  const pvtPrisma = new PrivatePrisma({
    datasourceUrl: process.env.PRISMA_PRIVATE_URI,
  });

  const main = async () => {
    try {
      // user0
      const user0 = await pvtPrisma.user.create({
        data: createMockUser({
          name: 'DreamPip',
          firstName: 'DreamPip',
          lastName: 'Superuser',
          email: process.env.NEXUS_EMAIL,
        }),
      });

      // community0
      const community0 = await pvtPrisma.communities.create({
        data: createMockCommunity({
          name: 'DreamPip',
          description: 'Fintech for compassion.',
          urls: ['https://www.dreampip.com'],
          user: user0.id,
          refUsers: [{ id: user0.id }],
        }),
      });

      // roles
      const role1name = {
        en: 'Superuser',
        it: 'Superutente',
        pt: 'Superusuário',
        es: 'Superusuario',
        de: 'Superbenutzer',
        fr: 'Superutilisateur',
        ro: 'Superutilizator',
        cz: 'Superuživatel',
        pl: 'Superużytkownik',
        et: 'Superkasutaja',
        sv: 'Superanvändare',
        ja: 'スーパーユーザー',
        ru: 'Суперпользователь',
        ar: 'المستخدم الخارق',
        he: 'משתמש מרשים',
        zh: '超级用户',
        nl: 'Supergebruiker',
        da: 'Superbruger',
        hu: 'Szuperfelhasználó',
        ca: 'Superusuari',
        eu: 'Supererabiltzaile',
        gl: 'Superusuario',
        sw: 'Mtumiaji Mkuu',
        hi: 'सुपरउपयोगकर्ता',
        ms: 'Superpengguna',
        bn: 'সুপার ব্যবহারকারী',
        pa: 'ਸੁਪਰਯੂਜ਼ਰ',
        tr: 'Süper Kullanıcı',
        fi: 'Superkäyttäjä',
        el: 'Σούπερχρήστης',
        uk: 'Суперкористувач',
      };

      const role2name = {
        en: 'Admin',
        it: 'Amministratore',
        pt: 'Admin',
        es: 'Administrador',
        de: 'Administrator',
        fr: 'Administrateur',
        ro: 'Administrator',
        cz: 'Správce',
        pl: 'Administrator',
        et: 'Administraator',
        sv: 'Administratör',
        ja: '管理者',
        ru: 'Администратор',
        ar: 'مدير',
        he: 'מנהל',
        zh: '管理员',
        nl: 'Beheerder',
        da: 'Administrator',
        hu: 'Adminisztrátor',
        ca: 'Administrador',
        eu: 'Administratzaile',
        gl: 'Administrador',
        sw: 'Msimamizi',
        hi: 'प्रशासक',
        ms: 'Pentadbir',
        bn: 'প্রশাসক',
        pa: 'ਐਡਮਿਨ',
        tr: 'Yönetici',
        fi: 'Ylläpitäjä',
        el: 'Διαχειριστής',
        uk: 'Адміністратор',
      };

      const role3name = {
        en: 'Manager',
        it: 'Manager',
        pt: 'Gerente',
        es: 'Gerente',
        de: 'Manager',
        fr: 'Manager',
        ro: 'Manager',
        cz: 'Manažer',
        pl: 'Menedżer',
        et: 'Juht',
        sv: 'Chef',
        ja: 'マネージャー',
        ru: 'Менеджер',
        ar: 'مدير',
        he: 'מנהל',
        zh: '经理',
        nl: 'Manager',
        da: 'Manager',
        hu: 'Menedzser',
        ca: 'Gerent',
        eu: 'Kudeatzaile',
        gl: 'Xestor',
        sw: 'Meneja',
        hi: 'प्रबंधक',
        ms: 'Pengurus',
        bn: 'ম্যানেজার',
        pa: 'ਮੈਨੇਜਰ',
        tr: 'Yönetici',
        fi: 'Johtaja',
        el: 'Διευθυντής',
        uk: 'Менеджер',
      };

      const role4name = {
        en: 'User',
        it: 'Utente',
        pt: 'Usuário',
        es: 'Usuario',
        de: 'Benutzer',
        fr: 'Utilisateur',
        ro: 'Utilizator',
        cz: 'Uživatel',
        pl: 'Użytkownik',
        et: 'Kasutaja',
        sv: 'Användare',
        ja: 'ユーザー',
        ru: 'Пользователь',
        ar: 'مستخدم',
        he: 'משתמש',
        zh: '用户',
        nl: 'Gebruiker',
        da: 'Bruger',
        hu: 'Felhasználó',
        ca: 'Usuari',
        eu: 'Erabiltzaile',
        gl: 'Usuario',
        sw: 'Mtumiaji',
        hi: 'उपयोगकर्ता',
        ms: 'Pengguna',
        bn: 'ব্যবহারকারী',
        pa: 'ਵਰਤੋਂਕਾਰ',
        tr: 'Kullanıcı',
        fi: 'Käyttäjä',
        el: 'Χρήστης',
        uk: 'Користувач',
      };

      const role1 = await pvtPrisma.roles.create({
        data: createMockRole({
          name: role1name,
          slug: 'role-su',
          user: user0.id,
          community: community0.id,
          refUsers: [{ id: user0.id }],
          refCommunities: [],
        }),
      });

      const role2 = await pvtPrisma.roles.create({
        data: createMockRole({
          name: role2name,
          slug: 'role-admin',
          user: user0.id,
          community: community0.id,
          refUsers: [],
          refCommunities: [],
        }),
      });

      const role3 = await pvtPrisma.roles.create({
        data: createMockRole({
          name: role3name,
          slug: 'role-manager',
          user: user0.id,
          community: community0.id,
          refUsers: [],
          refCommunities: [],
        }),
      });

      const role4 = await pvtPrisma.roles.create({
        data: createMockRole({
          name: role4name,
          slug: 'role-user',
          user: user0.id,
          community: community0.id,
          refUsers: [],
          refCommunities: [],
        }),
      });

      // abilities
      const ability1name = {
        en: 'Favorite Listings',
        it: 'Aggiungi ai Preferiti',
        pt: 'Favoritar Listagens',
        es: 'Marcar como Favorito',
        de: 'Anzeigen favorisieren',
        fr: 'Mettre en Favori',
        ro: 'Favoritează liste',
        cz: 'Oblíbené inzeráty',
        pl: 'Dodaj do Ulubionych',
        et: 'Lisa lemmikutesse',
        sv: 'Gör till Favoriter',
        ja: 'お気に入りにする',
        ru: 'Добавить в Избранное',
        ar: 'القوائم المفضلة',
        he: 'הוסף למועדפים',
        zh: '收藏清单',
        nl: 'Favoriete vermeldingen',
        da: 'Favoritlister',
        hu: 'Kedvenc hirdetések',
        ca: 'Afegir a Preferits',
        eu: 'Gehitu Gogokoenetara',
        gl: 'Engadir a Favoritos',
        sw: 'Orodhesha Pendwa',
        hi: 'पसंदीदा सूची',
        ms: 'Senarai Kegemaran',
        bn: 'পছন্দের তালিকা',
        pa: 'ਪਸੰਦੀਦਾ ਸੂਚੀਆਂ',
        tr: 'Favori İlanlar',
        fi: 'Suosikkiluettelot',
        el: 'Αγαπημένες καταχωρήσεις',
        uk: 'Обрані оголошення',
      };

      const ability2name = {
        en: 'View Listings',
        it: 'Visualizza inserzioni',
        pt: 'Ver listagens',
        es: 'Ver listados',
        de: 'Anzeigen anzeigen',
        fr: 'Voir les annonces',
        ro: 'Vizualizare liste',
        cz: 'Zobrazit inzeráty',
        pl: 'Wyświetl oferty',
        et: 'Vaata kuulutusi',
        sv: 'Visa listor',
        ja: 'リストを表示する',
        ru: 'Просмотр объявлений',
        ar: 'عرض القوائم',
        he: 'הצג רשימות',
        zh: '查看列表',
        nl: 'Bekijk aanbiedingen',
        da: 'Se lister',
        hu: 'Listázások megtekintése',
        ca: 'Veure llistats',
        eu: 'Eman ikuspegiak',
        gl: 'Ver listados',
        sw: 'Tazama Orodha',
        hi: 'लिस्टिंग देखें',
        ms: 'Lihat Senarai',
        bn: 'লিস্টিং দেখুন',
        pa: 'ਲਿਸਟਿੰਗ ਵੇਖੋ',
        tr: 'İlanları Görüntüle',
        fi: 'Näytä ilmoitukset',
        el: 'Προβολή καταχωρήσεων',
        uk: 'Переглянути оголошення',
      };

      const ability1 = await pvtPrisma.abilities.create({
        data: createMockAbility({
          name: ability2name,
          user: user0.id,
          slug: 'abil-view-rm',
          community: community0.id,
          type: 'R',
          action: 'view-listings',
          nature: 'COMMON',
          target: 'rickmorty',
          roles: [{ id: role1.id }, { id: role2.id }],
          refUsers: [{ id: user0.id }],
          refCommunities: [{ id: community0.id }],
        }),
      });

      const ability2 = await pvtPrisma.abilities.create({
        data: createMockAbility({
          name: ability2name,
          user: user0.id,
          slug: 'abil-view-vm',
          type: 'R',
          action: 'view-listings',
          nature: 'PRIVILEGE',
          target: 'dpcp-vibemodulator',
          community: community0.id,
          roles: [{ id: role1.id }],
          refUsers: [{ id: user0.id }],
          refCommunities: [{ id: community0.id }],
        }),
      });

      const ability3 = await pvtPrisma.abilities.create({
        data: createMockAbility({
          name: ability1name,
          user: user0.id,
          slug: 'abil-favorite-rm',
          type: 'U',
          action: 'favorite',
          nature: 'COMMON',
          target: 'rickmorty',
          community: community0.id,
          roles: [{ id: role1.id }],
          refUsers: [{ id: user0.id }],
          refCommunities: [{ id: community0.id }],
        }),
      });

      // // features
      const feature1name = {
        en: 'Favoriting of entries',
        it: 'Aggiunta ai preferiti delle voci',
        pt: 'Favoritar entradas',
        es: 'Marcar entradas como favoritas',
        de: 'Einträge favorisieren',
        fr: 'Mise en favori des entrées',
        ro: 'Adăugarea la favorite a intrărilor',
        cz: 'Přidání záznamů do oblíbených',
        pl: 'Dodawanie wpisów do ulubionych',
        et: 'Kirjete lemmikuks märkimine',
        sv: 'Favoritmarkera poster',
        ja: 'エントリーのお気に入り登録',
        ru: 'Добавление в избранное записей',
        ar: 'تحديد الإدخالات كمفضلة',
        he: 'הוספת כתבות למועדפים',
        zh: '添加收藏条目',
        nl: 'Toevoegen van items aan favorieten',
        da: 'Tilføjelse af emner til favoritter',
        hu: 'Bejegyzések kedvencekké nyilvánítása',
        ca: 'Afavorir entrades',
        eu: 'Sarrera gehitzea gogokoak direla',
        gl: 'Engadido de entradas a favoritos',
        sw: 'Kupendezesha vya kuingia',
        hi: 'प्रविष्टियों को पसंदीदा बनाना',
        ms: 'Menanda buku entri',
        bn: 'এন্ট্রিগুলিকে পছন্দমূলক করা',
        pa: 'ਇੰਟਰੀਆਂ ਨੂੰ ਪਸੰਦੀਦਾ ਬਣਾਉਣਾ',
        tr: 'Girişleri favorilere ekleme',
        fi: 'Merkintöjen suosiminen',
        el: 'Προτίμηση καταχωρήσεων',
        uk: 'Додавання записів до обраного',
      };

      const feature1 = await pvtPrisma.features.create({
        data: createMockFeature({
          name: feature1name,
          slug: 'feat-favorite-entries',
          user: user0.id,
          community: community0.id,
          abilities: [{ id: ability1.id }],
          refUsers: [{ id: user0.id }],
          refCommunities: [{ id: community0.id }],
        }),
      });

      // // services
      const service1name = {
        en: 'The Rick Morty Experience',
        it: "L'esperienza di Rick Morty",
        pt: 'A Experiência Rick Morty',
        es: 'La Experiencia Rick Morty',
        de: 'Das Rick Morty Erlebnis',
        fr: "L'expérience Rick Morty",
        ro: 'Experiența Rick Morty',
        cz: 'Rick Morty Zážitek',
        pl: 'Doświadczenie Rick Morty',
        et: 'Rick Morty Kogemus',
        sv: 'Rick Morty-upplevelsen',
        ja: 'リック・モーティ体験',
        ru: 'Опыт Рика и Морти',
        ar: 'تجربة ريك مورتي',
        he: 'חוויית ריק מורטי',
        zh: '瑞克莫蒂体验',
        nl: 'De Rick Morty-ervaring',
        da: 'Rick Morty Oplevelsen',
        hu: 'A Rick és Morty Élménye',
        ca: "L'experiència Rick Morty",
        eu: 'The Rick Morty Esperientzia',
        gl: 'A Experiencia Rick Morty',
        sw: 'Uzoefu wa Rick Morty',
        hi: 'रिक मोर्टी अनुभव',
        ms: 'Pengalaman Rick Morty',
        bn: 'রিক এবং মর্টি অভিজ্ঞতা',
        pa: 'ਰਿਕ ਮੋਰਟੀ ਦਾ ਅਨੁਭਵ',
        tr: 'Rick Morty Deneyimi',
        fi: 'Rick Morty Kokemus',
        el: 'Η Εμπειρία Rick Morty',
        uk: 'Досвід Ріка і Морті',
      };

      const service2name = {
        en: 'The Vibe Modulator',
        it: 'Il Modulatore di Vibrazioni',
        pt: 'O Modulador de Vibração',
        es: 'El Modulador de Vibra',
        de: 'Der Vibe-Modulator',
        fr: 'Le Modulateur de Vibration',
        ro: 'Modulatorul de Vibrații',
        cz: 'Vibrační Modulátor',
        pl: 'Modulator Nastroju',
        et: 'Vibe Modulaator',
        sv: 'Vibe-modulatorn',
        ja: 'バイブモジュレーター',
        ru: 'Вибромодулятор',
        ar: 'معدل الجو',
        he: 'מייסד הוייב',
        zh: '振动调制器',
        nl: 'De Vibe Modulator',
        da: 'Vibe-modulatoren',
        hu: 'Vibe modulátor',
        ca: 'El Modulador de Vibra',
        eu: 'The Vibe Modulator',
        gl: 'O Modulador de Vibration',
        sw: 'Mbadala wa Vibe',
        hi: 'द वाइब मॉड्यूलेटर',
        ms: 'Modulator Getaran',
        bn: 'দ্য ভাইব মড্যুলেটর',
        pa: 'ਵਾਇਬ ਮੋਡੂਲੇਟਰ',
        tr: 'Vibe Modülatör',
        fi: 'Vibe-modulaattori',
        el: 'Ο Μετατροπέας Δόνησης',
        uk: 'Вібромодулятор',
      };

      const service1 = await pvtPrisma.services.create({
        data: createMockService({
          name: service1name,
          slug: 'rickmorty',
          user: user0.id,
          community: community0.id,
          features: [{ id: feature1.id }],
          refUsers: [{ id: user0.id }],
          refCommunities: [{ id: community0.id }],
        }),
      });

      const service2 = await pvtPrisma.services.create({
        data: createMockService({
          name: service2name,
          slug: 'dpcp-vibemodulator',
          user: user0.id,
          community: community0.id,
          refUsers: [{ id: user0.id }],
          refCommunities: [{ id: community0.id }],
        }),
      });

      console.log(`Private Database has been seeded. 🌱`);
    } catch (error) {
      throw error;
    }
  };
  func = main;
} else if (seedType === 'public') {
  console.log('~ SEEDING PUBLIC DB ~');

  const pvtPrisma = new PrivatePrisma({
    datasourceUrl: process.env.PRISMA_PRIVATE_URI,
  });

  const pubPrisma = new PublicPrisma({
    datasourceUrl: process.env.PRISMA_PUBLIC_URI,
  });

  const main = async () => {
    try {
      const facadeEntry = (fields: string[], facades: Record<string, any>) => (entry: any) => {
        const facader = fields.reduce((fac, field, index) => {
          let content = entry[field];
          if (facades && facades[field]) {
            content = facades[field](content);
          }
          fac[field] = content;
          return fac;
        }, {});

        return facader;
      };

      console.log(`Public Database has been seeded. 🌱`);
    } catch (error) {
      throw error;
    }
  };
  func = main;
} else if (seedType === 'mock') {
  console.log('~ SEEDIND DBS WITH MOCK DATA ~');
  console.log('~ SEEDING PRIVATE DB WITH MOCK DATA ~');

  const pvtPrisma = new PrivatePrisma({
    datasourceUrl: process.env.PRISMA_PRIVATE_URI,
  });

  const main = async () => {
    try {
      const user1 = await pvtPrisma.user.create({ data: mockUser });
      const user2 = await pvtPrisma.user.create({ data: mockUser2 });
      const user3 = await pvtPrisma.user.create({ data: mockUser3 });

      // communities
      const community1 = await pvtPrisma.communities.create({ data: mockCommunity });
      const community2 = await pvtPrisma.communities.create({ data: mockCommunity2 });
      const community3 = await pvtPrisma.communities.create({ data: mockCommunity3 });

      // // roles
      const role1 = await pvtPrisma.roles.create({
        data: createMockRole({
          user: user1.id,
          community: community1.id,
          refUsers: [{ id: user1.id }],
          refCommunities: [{ id: community1.id }],
        }),
      });
      const role2 = await pvtPrisma.roles.create({
        data: createMockRole({
          user: user1.id,
          community: community1.id,
          refUsers: [{ id: user2.id }, { id: user3.id }],
          refCommunities: [{ id: community2.id }, { id: community3.id }],
        }),
      });

      // // abilities

      const ability1name = {
        en: 'Favorite Listings (mock)',
        it: 'Aggiungi ai Preferiti (mock)',
        pt: 'Favoritar Listagens (mock)',
        es: 'Marcar como Favorito (mock)',
        de: 'Anzeigen favorisieren (mock)',
        fr: 'Mettre en Favori (mock)',
        ro: 'Favoritează liste (mock)',
        cz: 'Oblíbené inzeráty (mock)',
        pl: 'Dodaj do Ulubionych (mock)',
        et: 'Lisa lemmikutesse (mock)',
        sv: 'Gör till Favoriter (mock)',
        ja: 'お気に入りにする (mock)',
        ru: 'Добавить в Избранное (mock)',
      };

      const ability2name = {
        en: 'View Listings (mock)',
        it: 'Visualizza inserzioni (mock)',
        pt: 'Ver listagens (mock)',
        es: 'Ver listados (mock)',
        de: 'Anzeigen anzeigen (mock)',
        fr: 'Voir les annonces (mock)',
        ro: 'Vizualizare liste (mock)',
        cz: 'Zobrazit inzeráty (mock)',
        pl: 'Wyświetl oferty (mock)',
        et: 'Vaata kuulutusi (mock)',
        sv: 'Visa listor (mock)',
        ja: 'リストを表示する (mock)',
        ru: 'Просмотр объявлений (mock)',
      };

      const ability1 = await pvtPrisma.abilities.create({
        data: createMockAbility({
          name: ability2name,
          user: user1.id,
          community: community1.id,
          type: 'R',
          action: 'view-listings-mock',
          nature: 'COMMON',
          target: 'rickmorty',
          roles: [{ id: role1.id }, { id: role2.id }],
          refUsers: [{ id: user1.id }],
          refCommunities: [{ id: community1.id }],
        }),
      });

      const ability2 = await pvtPrisma.abilities.create({
        data: createMockAbility({
          name: ability2name,
          user: user1.id,
          type: 'R',
          action: 'view-listings-mock',
          nature: 'PRIVILEGE',
          target: 'dpcp-vibemodulator',
          community: community1.id,
          roles: [{ id: role1.id }, { id: role2.id }],
          refUsers: [{ id: user1.id }, { id: user2.id }, { id: user3.id }],
          refCommunities: [{ id: community2.id }, { id: community3.id }],
        }),
      });

      const ability3 = await pvtPrisma.abilities.create({
        data: createMockAbility({
          name: ability1name,
          user: user1.id,
          type: 'U',
          action: 'favorite-mock',
          nature: 'COMMON',
          target: 'rickmorty',
          community: community1.id,
          roles: [{ id: role1.id }, { id: role2.id }],
          refUsers: [{ id: user1.id }, { id: user2.id }, { id: user3.id }],
          refCommunities: [{ id: community2.id }, { id: community3.id }],
        }),
      });

      // // features
      const feature1 = await pvtPrisma.features.create({
        data: createMockFeature({
          user: user1.id,
          community: community1.id,
          abilities: [{ id: ability1.id }],
          refUsers: [{ id: user1.id }],
          refCommunities: [{ id: community1.id }],
        }),
      });
      const feature2 = await pvtPrisma.features.create({
        data: createMockFeature({
          user: user1.id,
          community: community1.id,
          abilities: [{ id: ability2.id }],
          refUsers: [{ id: user2.id }, { id: user3.id }],
          refCommunities: [{ id: community2.id }, { id: community3.id }],
        }),
      });

      // // services
      const service1name = {
        en: 'The Rick Morty Experience (mock)',
        it: "L'esperienza di Rick Morty",
        pt: 'A Experiência Rick Morty (mock)',
        es: 'La Experiencia Rick Morty (mock)',
        de: 'Das Rick Morty Erlebnis (mock)',
        fr: "L'expérience Rick Morty",
        ro: 'Experiența Rick Morty (mock)',
        cz: 'Rick Morty Zážitek (mock)',
        pl: 'Doświadczenie Rick Morty (mock)',
        et: 'Rick Morty Kogemus (mock)',
        sv: 'Rick Morty-upplevelsen (mock)',
        ja: 'リック・モーティ体験 (mock)',
        ru: 'Опыт Рика и Морти (mock)',
      };

      const service2name = {
        en: 'The Vibe Modulator (mock)',
        it: 'Il Modulatore di Vibrazioni (mock)',
        pt: 'O Modulador de Vibração (mock)',
        es: 'El Modulador de Vibra (mock)',
        de: 'Der Vibe-Modulator (mock)',
        fr: 'Le Modulateur de Vibration (mock)',
        ro: 'Modulatorul de Vibrații (mock)',
        cz: 'Vibrační Modulátor (mock)',
        pl: 'Modulator Nastroju (mock)',
        et: 'Vibe Modulaator (mock)',
        sv: 'Vibe-modulatorn (mock)',
        ja: 'バイブモジュレーター (mock)',
        ru: 'Вибромодулятор (mock)',
      };

      const service1 = await pvtPrisma.services.create({
        data: createMockService({
          name: service1name,
          slug: 'rickmorty-mock',
          user: user1.id,
          community: community1.id,
          features: [{ id: feature1.id }, { id: feature2.id }],
          refUsers: [{ id: user1.id }],
          refCommunities: [{ id: community1.id }],
        }),
      });

      const service2 = await pvtPrisma.services.create({
        data: createMockService({
          name: service2name,
          slug: 'dpcp-vibemodulator-mock',
          user: user1.id,
          community: community1.id,
          refUsers: [{ id: user2.id }, { id: user3.id }],
          refCommunities: [{ id: community2.id }, { id: community3.id }],
        }),
      });

      // // listings
      const listing1 = await pvtPrisma.listings.create({
        data: createMockListing({
          favorited: [{ id: user2.id }, { id: user3.id }],
          user: user1.id,
          community: community1.id,
          communityFavorited: [{ id: community2.id }, { id: community3.id }],
        }),
      });

      const listing2 = await pvtPrisma.listings.create({
        data: createMockListing({
          favorited: [{ id: user2.id }, { id: user3.id }],
          user: user1.id,
          community: community1.id,
          communityFavorited: [{ id: community2.id }, { id: community3.id }],
        }),
      });

      // // taxonomies
      const term1 = await pvtPrisma.taxonomies.create({
        data: createMockTerm({
          community: community3.id,
          user: user2.id,
          listings: [{ id: listing1.id }],
          targetCommunities: [{ id: community2.id }],
          targetUser: [{ id: user2.id }],
        }),
      });

      const term2 = await pvtPrisma.taxonomies.create({
        data: createMockTerm({
          community: community3.id,
          user: user2.id,
          listings: [{ id: listing2.id }],
          targetCommunities: [{ id: community3.id }],
          targetUser: [{ id: user3.id }],
        }),
      });

      // messages
      const message1 = await pvtPrisma.messages.create({
        data: createMockMessage({
          community: community3.id,
          user: user2.id,
          fromUser: { id: user3.id },
          toUser: [{ id: user1.id }, { id: user2.id }],
          toCommunities: [],
          toListings: [],
        }),
      });

      const message2 = await pvtPrisma.messages.create({
        data: createMockMessage({
          community: community3.id,
          user: user2.id,
          fromUser: { id: user2.id },
          toUser: [],
          toCommunities: [{ id: community2.id }, { id: community3.id }],
          toListings: [{ id: listing1.id }, { id: listing2.id }],
        }),
      });

      const message3 = await pvtPrisma.messages.create({
        data: createMockMessage({
          community: community3.id,
          user: user2.id,
          fromCommunity: { id: community3.id },
          toUser: [],
          toCommunities: [],
          toListings: [],
        }),
      });

      console.log(`Private Database has been seeded with mock data. 🌱`);
    } catch (error) {
      throw error;
    }
    try {
      console.log('~ SEEDING PUBLIC DB WITH MOCK DATA ~');

      const pubPrisma = new PublicPrisma({
        datasourceUrl: process.env.PRISMA_PUBLIC_URI,
      });

      const facadeEntry = (fields: string[], facades: Record<string, any>) => (entry: any) => {
        const facader = fields.reduce((fac, field, index) => {
          let content = entry[field];
          if (facades && facades[field]) {
            content = facades[field](content);
          }
          fac[field] = content;
          return fac;
        }, {});

        return facader;
      };

      const facadeTaxonomy = facadeEntry(['id', 'name', 'description', 'status', 'type', 'nature', 'audiencesIds']);

      const facadeMessage = facadeEntry([
        'id',
        'name',
        'description',
        'status',
        'type',
        'nature',
        'title',
        'body',
        'queuedOn',
        'scheduledOn',
        'sentOn',
      ]);

      const facadeUser = facadeEntry(['id', 'image', 'firstName']);

      const facadeCommunity = facadeEntry(['id', 'image', 'name', 'urls', 'status']);

      const getSeedData = () => {
        try {
          const data = JSON.parse(fs.readFileSync('stub.json'));
          return data;
        } catch (e) {
          execSync('npm run schema:seed:getseeds');
          return { retry: true };
        }
      };

      let data = getSeedData();

      if (data?.retry) {
        data = getSeedData();
      }

      const { community, user, model, term } = data;

      const pubListing1 = await pubPrisma.publicListings.create({
        data: createMockPubListing({
          community: facadeCommunity(community),
          user: facadeUser(user),
          taxonomies: [facadeTaxonomy(term)],
        }),
      });

      const pubListing2 = await pubPrisma.publicListings.create({
        data: createMockPubListing({
          community: facadeCommunity(community),
          user: facadeUser(user),
          taxonomies: [facadeTaxonomy(term)],
        }),
      });

      const pubListing3 = await pubPrisma.publicListings.create({
        data: createMockPubListing({
          community: facadeCommunity(community),
          user: facadeUser(user),
          taxonomies: [facadeTaxonomy(term)],
        }),
      });

      _.times(100, async () => {
        await pubPrisma.publicListings.create({
          data: createMockPubListing({
            community: facadeCommunity(community),
            user: facadeUser(user),
            taxonomies: [facadeTaxonomy(term)],
          }),
        });
      });

      console.log(`Public Database has been seeded with mock data. 🌱`);
    } catch (error) {
      throw error;
    }
  };

  func = main;
}

func().catch((err) => {
  console.warn('Error While generating Seed: \n', err);
});
