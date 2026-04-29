import { useEffect, useMemo, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import {
  Phone,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  Flame,
  Beef,
  Menu as MenuIcon,
  X,
  Camera,
  Globe,
  KeyRound,
} from 'lucide-react';

const NAV = [
  { id: 'carte', label: 'La Carte' },
  { id: 'histoire', label: 'Notre Histoire' },
  { id: 'galerie', label: 'Galerie' },
  { id: 'avis', label: 'Avis' },
  { id: 'horaires', label: 'Horaires' },
  { id: 'trouver', label: 'Nous Trouver' },
];

const REVIEWS = [
  {
    name: 'Camille R.',
    when: 'il y a 2 semaines',
    text: 'Le meilleur smash burger que j\'ai mange en France. Croustillant dehors, juteux dedans.',
  },
  {
    name: 'Karim B.',
    when: 'il y a 1 mois',
    text: 'Enfin un vrai doner comme a Kreuzberg. Le pain pide et la sauce blanche maison sont incroyables.',
  },
  {
    name: 'Sophie & Tom',
    when: 'il y a 3 semaines',
    text: 'Adresse qui merite le detour. Equipe rapide, portions genereuses et frites maison ultra nettes.',
  },
];

const HIGHLIGHTS = ['Viande fraiche du jour', 'Cuisson minute a la plancha', 'Click & collect rapide', 'Recettes signature'];
const DEFAULT_HERO_TEXT = 'La rencontre du smash burger et du doner berlinois. Viande ecrasee minute, pains chauds, sauces maison.';
const STORAGE_KEY = 'smash_berliner_site_data_v1';
const FIREBASE_KEY = 'site_data';
const ADMIN_SESSION_KEY = 'smash_admin_auth_v1';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'Smash2026!';

const firebaseConfig = {
  apiKey: 'AIzaSyAf0CIHBZ-wEQJ8CCUUWo1Wl9P7typ_ZPI',
  authDomain: 'gptcall-416910.firebaseapp.com',
  projectId: 'gptcall-416910',
  storageBucket: 'gptcall-416910.appspot.com',
  messagingSenderId: '99275526699',
  appId: '1:99275526699:web:3b623e1e2996108b52106e',
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const FULL_MENU = [
  {
    category: 'Smash',
    photo: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
    items: [
      { name: 'Original', desc: 'Double steak smashe, double cheddar, cornichons, salade, tomates, oignons, sauce smash maison.', price: '8,50 EUR' },
      { name: 'Big', desc: 'Triple steak smashe, triple cheddar, salade, tomates, cornichons, oignons rouges, sauce smash maison.', price: '9,50 EUR' },
      { name: 'Spicy', desc: 'Double steak smashe, cheddar, salade, tomates, jalapenos, oignons rouges, sauce spicy maison.', price: '8,50 EUR' },
      { name: 'Chevre-Miel', desc: 'Double steak smashe, cheddar, fromage de chevre, miel, salade, oignons rouges.', price: '9,90 EUR' },
      { name: 'Raclette', desc: 'Double steak smashe, cheddar, fromage raclette, salade, tomates, oignons frits, sauce smash maison.', price: '10,50 EUR' },
    ],
  },
  {
    category: 'Berliner',
    photo: 'https://images.unsplash.com/photo-1699728088614-7d1d4277414b?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
    items: [
      { name: 'Classique', desc: 'Viande kebab, salade, tomates, oignons rouges, sauce au choix.', price: '6,90 EUR' },
      { name: 'Berliner', desc: 'Viande kebab, salade, legumes grilles, oignons rouges, feta, sauce blanche maison.', price: '7,90 EUR' },
      { name: 'Chevre-Miel', desc: 'Viande kebab, poivrons caramelises, fromage de chevre, miel, salade, sauce blanche maison.', price: '8,90 EUR' },
      { name: 'Traditionnel', desc: 'Viande kebab, salade, tomates, oignons rouges, chou rouge, feta, sauce blanche maison.', price: '7,90 EUR' },
      { name: 'Raclette', desc: 'Viande kebab, salade, tomates, oignons rouges, fromage raclette, chou rouge, feta, sauce blanche maison.', price: '9,90 EUR' },
    ],
  },
  {
    category: 'Poutine',
    photo: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
    items: [
      { name: '1 Viande', desc: 'Base poutine maison, sauce chaude, topping viande au choix.', price: '9,00 EUR' },
      { name: '2 Viandes', desc: 'Base poutine maison, sauce chaude, double topping viande.', price: '10,00 EUR' },
      { name: '3 Viandes', desc: 'Base poutine maison, sauce chaude, triple topping viande.', price: '11,00 EUR' },
    ],
  },
  {
    category: 'Tacos',
    photo: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
    items: [
      { name: '1 Viande', desc: 'Tacos gratine, sauce fromagere, 1 viande au choix.', price: '9,00 EUR' },
      { name: '2 Viandes', desc: 'Tacos gratine, sauce fromagere, 2 viandes au choix.', price: '10,00 EUR' },
      { name: '3 Viandes', desc: 'Tacos gratine, sauce fromagere, 3 viandes au choix.', price: '11,00 EUR' },
    ],
  },
  {
    category: 'Desserts',
    photo: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
    items: [
      { name: 'Tiramisu', desc: 'Selon disponibilites.', price: '3,50 EUR' },
      { name: 'Tarte au Daim', desc: 'Selon disponibilites.', price: '2,50 EUR' },
    ],
  },
  {
    category: 'Tex-Mex',
    photo: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
    items: [
      { name: 'Tenders x4', desc: 'Poulet croustillant, sauce au choix.', price: '3,50 EUR' },
      { name: 'Nuggets x6', desc: 'Poulet pane, sauce au choix.', price: '3,50 EUR' },
      { name: 'Mozza Sticks', desc: 'Batonnets de mozzarella panes.', price: '2,50 EUR' },
    ],
  },
  {
    category: 'Boissons',
    photo: 'https://images.unsplash.com/photo-1527960471264-932f39eb5846?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
    items: [
      { name: 'Canette 33cl', desc: 'Coca, Fanta, Oasis, Sprite selon disponibilite.', price: '1,50 EUR' },
      { name: 'Frites Maison', desc: 'Portion snack, servie chaude.', price: '3,00 EUR' },
    ],
  },
  {
    category: 'Menus Etudiant',
    photo: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
    items: [
      { name: 'Kebab Classique', desc: 'Sur presentation de la carte etudiant.', price: '7,90 EUR' },
      { name: 'Classic Smash', desc: 'Sur presentation de la carte etudiant.', price: '7,90 EUR' },
    ],
  },
];

const HOURS = [
  ['Lundi', 'Ferme'],
  ['Mardi', '11h30-14h  |  18h-22h'],
  ['Mercredi', '11h30-14h  |  18h-22h'],
  ['Jeudi', '11h30-14h  |  18h-22h'],
  ['Vendredi', '11h30-14h  |  18h-23h'],
  ['Samedi', '11h30-14h  |  18h-23h'],
  ['Dimanche', '18h-22h'],
];

const GALLERY = [
  { url: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?crop=entropy&cs=srgb&fm=jpg&q=85&w=1300', span: 'md:col-span-7 md:row-span-2', alt: 'Smash burger signature', h: 'h-[260px] sm:h-[320px] md:h-full', pos: 'object-center' },
  { url: 'https://images.unsplash.com/photo-1699728088614-7d1d4277414b?crop=entropy&cs=srgb&fm=jpg&q=85&w=1100', span: 'md:col-span-5', alt: 'Doner berlinois', h: 'h-[210px] sm:h-[240px] md:h-full', pos: 'object-center' },
  { url: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?crop=entropy&cs=srgb&fm=jpg&q=85&w=1100', span: 'md:col-span-5', alt: 'Frites maison', h: 'h-[170px] sm:h-[190px] md:h-full', pos: 'object-center' },
  { url: 'https://images.unsplash.com/photo-1550317138-10000687a72b?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200', span: 'md:col-span-5', alt: 'Cheeseburger', h: 'h-[220px] sm:h-[250px] md:h-full', pos: 'object-center' },
  { url: 'https://images.pexels.com/photos/20722029/pexels-photo-20722029.jpeg?auto=compress&w=1200', span: 'md:col-span-7', alt: 'Burger XXL', h: 'h-[240px] sm:h-[280px] md:h-full', pos: 'object-top' },
];

function loadSiteData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { heroText: DEFAULT_HERO_TEXT, highlights: HIGHLIGHTS, menu: FULL_MENU };
    }
    const parsed = JSON.parse(raw);
    return {
      heroText: parsed.heroText || DEFAULT_HERO_TEXT,
      highlights: Array.isArray(parsed.highlights) && parsed.highlights.length ? parsed.highlights : HIGHLIGHTS,
      menu: Array.isArray(parsed.menu) && parsed.menu.length ? parsed.menu : FULL_MENU,
    };
  } catch {
    return { heroText: DEFAULT_HERO_TEXT, highlights: HIGHLIGHTS, menu: FULL_MENU };
  }
}

async function loadCloudData() {
  const ref = doc(db, 'smash_berliner', FIREBASE_KEY);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    heroText: data.heroText || DEFAULT_HERO_TEXT,
    highlights: Array.isArray(data.highlights) && data.highlights.length ? data.highlights : HIGHLIGHTS,
    menu: Array.isArray(data.menu) && data.menu.length ? data.menu : FULL_MENU,
  };
}

async function saveCloudData(siteData) {
  const ref = doc(db, 'smash_berliner', FIREBASE_KEY);
  await setDoc(ref, siteData, { merge: true });
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Nav() {
  const [open, setOpen] = useState(false);

  const jump = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="sticky top-0 z-50 bg-[var(--bone)]/95 backdrop-blur border-b-2 border-[var(--ink)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button onClick={() => jump('haut')} className="font-display text-2xl md:text-3xl tracking-wide">
          SMASH<span className="text-[var(--ketchup)]">.</span>BERLINER
        </button>

        <ul className="hidden md:flex items-center gap-7 text-sm font-bold uppercase tracking-wider">
          {NAV.map((item) => (
            <li key={item.id}>
              <button onClick={() => jump(item.id)} className="hover:text-[var(--ketchup)] transition-colors">
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <a href="tel:+33238479119" className="hidden md:inline-flex btn-primary !py-2 !px-4 text-sm">
          <Phone size={16} /> Commander
        </a>

        <button className="md:hidden p-2 brutal-border bg-[#1a1c20] text-white" aria-label="menu" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <MenuIcon size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t-2 border-[var(--ink)] bg-[var(--bone)]">
          <ul className="px-4 py-4 space-y-3 font-bold uppercase">
            {NAV.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => jump(item.id)}
                  className="w-full text-left py-2 border-b border-[var(--ink)]/20"
                >
                  {item.label}
                </button>
              </li>
            ))}
            <li>
              <a href="tel:+33238479119" className="btn-primary w-full justify-center !py-3">
                <Phone size={16} /> Commander
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

function Hero({ siteData }) {
  return (
    <section id="haut" className="relative overflow-hidden border-b-2 border-[var(--ink)]">
      <div className="grain" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-20 md:pb-24 grid md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7 reveal">
          <span className="tag-pill">
            <MapPin size={12} className="inline -mt-0.5 mr-1" />
            Meung-sur-Loire · 45130
          </span>
          <h1 className="font-display text-[15vw] md:text-[9.5vw] leading-[0.85] mt-4">
            SMASH.
            <br />
            <span className="text-[var(--ketchup)]">BERLINER.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg md:text-xl text-[var(--ink-2)] font-medium">{siteData.heroText}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="tel:+33238479119" className="btn-primary">
              <Phone size={18} /> Commander · 02 38 47 91 19
            </a>
            <a href="#carte" className="btn-secondary">
              Voir la carte <ChevronRight size={18} />
            </a>
          </div>
          <div className="mt-10 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-[var(--ketchup)]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <span className="font-bold">4,7/5</span>
            <span className="text-[var(--ink-2)]">· avis Google clients reguliers</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {siteData.highlights.map((item) => (
              <span key={item} className="px-3 py-1 text-xs font-bold uppercase tracking-wider brutal-border bg-white text-[#141414]">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="md:col-span-5 relative reveal">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?crop=entropy&cs=srgb&fm=jpg&q=85&w=950"
              alt="Smash burger signature"
              className="w-full h-[300px] sm:h-[360px] md:h-[440px] object-cover brutal-border brutal-shadow"
            />
            <div className="hidden md:block absolute -bottom-8 -left-10 rotate-[-6deg]">
              <img
                src="https://images.unsplash.com/photo-1699728088614-7d1d4277414b?crop=entropy&cs=srgb&fm=jpg&q=85&w=450"
                alt="Doner"
                className="w-32 h-32 lg:w-40 lg:h-40 object-cover brutal-border brutal-shadow-sm"
              />
            </div>
            <div className="absolute -top-5 -right-5 bg-[var(--mustard)] brutal-border brutal-shadow-sm px-4 py-2 rotate-[6deg] font-display text-2xl">
              100% PUR BOEUF
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MarqueeStrip() {
  const items = useMemo(
    () => ['100% PUR BOEUF', 'DONER BERLIN', 'FRITES MAISON', 'PAIN BRIOCHE', 'SAUCE BLANCHE MAISON', 'CLICK & COLLECT'],
    [],
  );

  return (
    <div className="bg-[var(--mustard)] border-b-2 border-[var(--ink)]">
      <Marquee gradient={false} speed={60} className="py-4">
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="font-display text-3xl md:text-4xl mx-8 flex items-center gap-8">
            {item}
            <Flame size={28} className="text-[var(--ketchup)]" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}

function MenuSection({ siteData }) {
  const [selected, setSelected] = useState(null);

  return (
    <section id="carte" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between flex-wrap gap-4 reveal">
          <div>
            <span className="tag-pill">La Carte</span>
            <h2 className="font-display text-5xl md:text-7xl mt-3">
              CE QU'ON SMASH<span className="text-[var(--ketchup)]">.</span>
            </h2>
          </div>
          <p className="max-w-md text-[var(--ink-2)]">
            Carte courte et exigeante. Produits frais, sauces maison, preparation minute.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-4 reveal">
          <a href="tel:+33238479119" className="btn-primary">
            <Phone size={18} /> Passer commande
          </a>
          <a href="#trouver" className="btn-secondary">
            Venir sur place <ChevronRight size={18} />
          </a>
          <span className="text-sm text-[var(--ink-2)] self-center">Allergenes disponibles sur demande.</span>
        </div>

        <div className="mt-16 reveal">
          <h3 className="font-display text-4xl md:text-5xl">MENU DETAILLE</h3>
          <p className="text-[var(--ink-2)] mt-2">Clique sur un article pour voir sa previsualisation complete.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {siteData.menu.map((group) => (
              <div key={group.category} className="bg-white text-[#141414] brutal-border p-4 reveal">
                <h4 className="font-display text-3xl mb-3">{group.category}</h4>
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <button
                      key={`${group.category}-${item.name}`}
                      onClick={() => setSelected({ ...item, category: group.category, photo: group.photo })}
                      className="w-full text-left p-3 brutal-border bg-[var(--bone)] text-[var(--ink)] hover:bg-[var(--mustard)]/40 transition-colors"
                    >
                      <div className="font-bold">{item.name}</div>
                      <div className="text-sm text-[var(--ink-2)]">{item.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[90] bg-black/70 p-4 flex items-center justify-center" onClick={() => setSelected(null)}>
          <div className="bg-white text-[#141414] brutal-border max-w-lg w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img src={selected.photo} alt={selected.name} className="w-full h-56 object-cover border-b-2 border-[var(--ink)]" />
            <div className="p-6">
              <div className="text-xs uppercase tracking-wider text-[var(--ink-2)]">{selected.category}</div>
              <h4 className="font-display text-4xl mt-1">{selected.name}</h4>
              <p className="mt-3 text-[var(--ink-2)]">{selected.desc}</p>
              <p className="mt-4 font-display text-3xl text-[var(--ketchup)]">{selected.price}</p>
              <div className="mt-6 flex gap-3">
                <a href="tel:+33238479119" className="btn-primary !py-3 !px-4">
                  <Phone size={16} /> Commander
                </a>
                <button onClick={() => setSelected(null)} className="btn-secondary !py-3 !px-4">
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function BackOffice({ siteData, setSiteData }) {
  const [status, setStatus] = useState('');

  useEffect(() => {
    let mounted = true;
    loadCloudData()
      .then((cloud) => {
        if (cloud && mounted) {
          setSiteData(cloud);
          setStatus('Donnees cloud chargees.');
        }
      })
      .catch(() => {
        if (mounted) setStatus('Cloud indisponible, mode local actif.');
      });
    return () => {
      mounted = false;
    };
  }, [setSiteData]);

  const updateHero = (value) => setSiteData((prev) => ({ ...prev, heroText: value }));
  const updateHighlights = (value) =>
    setSiteData((prev) => ({
      ...prev,
      highlights: value.split(',').map((v) => v.trim()).filter(Boolean),
    }));

  const updateItem = (gIdx, iIdx, field, value) =>
    setSiteData((prev) => {
      const menu = prev.menu.map((g, gi) =>
        gi !== gIdx
          ? g
          : {
              ...g,
              items: g.items.map((it, ii) => (ii === iIdx ? { ...it, [field]: value } : it)),
            },
      );
      return { ...prev, menu };
    });

  const uploadPhoto = (gIdx, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSiteData((prev) => {
        const menu = prev.menu.map((g, gi) => (gi === gIdx ? { ...g, photo: String(reader.result) } : g));
        return { ...prev, menu };
      });
    };
    reader.readAsDataURL(file);
  };

  const saveLocal = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
    setStatus('Sauvegarde locale effectuee.');
  };

  const saveCloud = async () => {
    try {
      await saveCloudData(siteData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
      setStatus('Sauvegarde cloud effectuee.');
    } catch {
      setStatus('Erreur de sauvegarde cloud.');
    }
  };

  const refreshCloud = async () => {
    try {
      const cloud = await loadCloudData();
      if (cloud) {
        setSiteData(cloud);
        setStatus('Donnees cloud rechargees.');
      } else {
        setStatus('Aucune donnee cloud trouvee.');
      }
    } catch {
      setStatus('Erreur de chargement cloud.');
    }
  };

  return (
    <div className="min-h-screen bg-[#111317] text-[#f4efe3] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-5xl">Back-Office Smash Berliner</h1>
        <p className="text-[#b8b1a3] mt-2">Lien d'acces: ajoute `?admin=1` a l'URL. Sauvegarde cloud Firebase active.</p>
        <p className="text-[#f2bf3a] mt-2 text-sm">{status}</p>

        <div className="mt-8 bg-[#1a1d22] brutal-border p-4 md:p-6">
          <h2 className="font-display text-3xl">Texte principal</h2>
          <label className="block mt-4 text-sm">Hero</label>
          <textarea
            value={siteData.heroText}
            onChange={(e) => updateHero(e.target.value)}
            className="w-full mt-1 p-3 bg-white text-black brutal-border"
            rows={3}
          />
          <label className="block mt-4 text-sm">Highlights (separes par virgule)</label>
          <input
            value={siteData.highlights.join(', ')}
            onChange={(e) => updateHighlights(e.target.value)}
            className="w-full mt-1 p-3 bg-white text-black brutal-border"
          />
        </div>

        <div className="mt-8 space-y-6">
          {siteData.menu.map((group, gIdx) => (
            <div key={`${group.category}-${gIdx}`} className="bg-[#1a1d22] brutal-border p-4 md:p-6">
              <h3 className="font-display text-3xl">{group.category}</h3>
              <div className="mt-3 flex items-center gap-4">
                <img src={group.photo} alt={group.category} className="w-24 h-24 object-cover brutal-border" />
                <input type="file" accept="image/*" onChange={(e) => uploadPhoto(gIdx, e.target.files?.[0])} />
              </div>
              <div className="mt-4 space-y-4">
                {group.items.map((item, iIdx) => (
                  <div key={`${item.name}-${iIdx}`} className="bg-[#101215] brutal-border p-3">
                    <div className="grid md:grid-cols-3 gap-2">
                      <input
                        value={item.name}
                        onChange={(e) => updateItem(gIdx, iIdx, 'name', e.target.value)}
                        className="p-2 bg-white text-black brutal-border"
                      />
                      <input
                        value={item.price}
                        onChange={(e) => updateItem(gIdx, iIdx, 'price', e.target.value)}
                        className="p-2 bg-white text-black brutal-border"
                      />
                      <input
                        value={item.desc}
                        onChange={(e) => updateItem(gIdx, iIdx, 'desc', e.target.value)}
                        className="p-2 bg-white text-black brutal-border md:col-span-3"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={saveCloud} className="btn-primary">Enregistrer dans le cloud</button>
          <button onClick={refreshCloud} className="btn-secondary">Charger depuis le cloud</button>
          <button onClick={saveLocal} className="btn-secondary">Sauvegarde locale</button>
        </div>
      </div>
    </div>
  );
}

function AdminLogin({ onSuccess, compact = false }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'ok');
      setErr('');
      onSuccess();
      return;
    }
    setErr('Identifiants invalides.');
  };

  return (
    <form onSubmit={submit} className={`${compact ? '' : 'max-w-md mx-auto'} bg-[#1a1d22] brutal-border p-5`}>
      <h3 className="font-display text-3xl text-[#f4efe3]">Acces Back-Office</h3>
      <p className="text-[#b8b1a3] text-sm mt-1">Connexion securisee requise.</p>
      <label className="block text-sm text-[#f4efe3] mt-4">Identifiant</label>
      <input value={user} onChange={(e) => setUser(e.target.value)} className="w-full mt-1 p-3 bg-white text-black brutal-border" />
      <label className="block text-sm text-[#f4efe3] mt-3">Mot de passe</label>
      <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="w-full mt-1 p-3 bg-white text-black brutal-border" />
      {err ? <p className="mt-2 text-sm text-[#f36b74]">{err}</p> : null}
      <button type="submit" className="btn-primary mt-4">Se connecter</button>
    </form>
  );
}

function AdminAccessButton() {
  const [open, setOpen] = useState(false);
  const goAdmin = () => {
    const u = new URL(window.location.href);
    u.searchParams.set('admin', '1');
    window.location.href = u.toString();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Acces back-office"
        className="px-3 h-10 rounded-full bg-[var(--mustard)] text-[#121212] border-2 border-[#1a1c20] inline-flex items-center justify-center gap-2 shadow-[4px_4px_0_0_#0b0c0f]"
      >
        <KeyRound size={16} />
        <span className="text-xs font-bold uppercase tracking-wider">Admin</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-[96] bg-black/70 p-4 flex items-end sm:items-center justify-center" onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md">
            <AdminLogin onSuccess={goAdmin} compact />
          </div>
        </div>
      )}
    </>
  );
}

function AboutSection() {
  return (
    <section id="histoire" className="bg-[var(--ink)] text-[var(--bone)] border-y-2 border-[var(--ink)] relative overflow-hidden">
      <div className="grain" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 grid md:grid-cols-12 gap-10 items-center relative">
        <div className="md:col-span-6 reveal">
          <span className="tag-pill !bg-[var(--ketchup)] !text-white">Notre Histoire</span>
          <h2 className="font-display text-5xl md:text-7xl mt-3 leading-[0.9]">
            DEUX RUES.
            <br />
            <span className="text-[var(--mustard)]">UNE OBSESSION.</span>
          </h2>
          <p className="mt-6 text-lg text-[var(--bone)]/80">
            On est partis d\'une question simple: pourquoi choisir entre un smash burger croustillant et un doner bien
            grille? On fait les deux, proprement, sans raccourci.
          </p>
          <p className="mt-4 text-[var(--bone)]/70">
            Cuisine ouverte, flux rapide le midi, service chaleureux le soir. Le coeur du projet: regularite et gout.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="border-2 border-[var(--bone)]/30 p-4">
              <Beef className="text-[var(--mustard)] mb-2" />
              <div className="font-display text-3xl">100%</div>
              <div className="text-xs uppercase tracking-wider text-[var(--bone)]/70">Boeuf frais</div>
            </div>
            <div className="border-2 border-[var(--bone)]/30 p-4">
              <Flame className="text-[var(--mustard)] mb-2" />
              <div className="font-display text-3xl">2x</div>
              <div className="text-xs uppercase tracking-wider text-[var(--bone)]/70">Cuisson / jour</div>
            </div>
            <div className="border-2 border-[var(--bone)]/30 p-4">
              <Clock className="text-[var(--mustard)] mb-2" />
              <div className="font-display text-3xl">0</div>
              <div className="text-xs uppercase tracking-wider text-[var(--bone)]/70">Surgeles</div>
            </div>
          </div>
        </div>

        <div className="md:col-span-6 relative reveal">
          <img
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"
            alt="Equipe en cuisine"
            className="w-full h-[320px] sm:h-[380px] md:h-[440px] object-cover brutal-border"
            style={{ borderColor: 'var(--bone)' }}
          />
          <div className="absolute -bottom-6 -left-6 bg-[var(--mustard)] text-[var(--ink)] p-5 brutal-border max-w-xs">
            <p className="font-display text-2xl leading-tight">On cuisine comme si vous etiez chez nous.</p>
            <p className="text-sm mt-2 font-bold">- L'equipe Smash Berliner</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  return (
    <section id="galerie" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-10">
          <span className="tag-pill">Galerie</span>
          <h2 className="font-display text-5xl md:text-7xl mt-3">
            CE QU'ON SERT<span className="text-[var(--ketchup)]">.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 md:auto-rows-[150px] lg:auto-rows-[180px] gap-4 md:gap-6">
          {GALLERY.map((item) => (
            <div key={item.url} className={`reveal relative overflow-hidden brutal-border ${item.span}`}>
              <img
                src={item.url}
                alt={item.alt}
                className={`w-full ${item.h} ${item.pos} md:h-full object-cover transition-transform duration-700 hover:scale-105`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewsSection() {
  return (
    <section id="avis" className="bg-[var(--bone-2)] border-y-2 border-[var(--ink)] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <span className="tag-pill">Avis Clients</span>
            <h2 className="font-display text-5xl md:text-7xl mt-3">
              ILS ONT GOUTE<span className="text-[var(--ketchup)]">.</span>
            </h2>
          </div>
          <p className="text-[var(--ink-2)] font-medium">Moyenne observee: 4,7/5</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {REVIEWS.map((review) => (
            <article key={review.name} className="reveal bg-white text-[#141414] brutal-border p-6">
              <div className="flex items-center justify-between gap-3 mb-3">
                <strong>{review.name}</strong>
                <span className="text-xs text-[#555]">{review.when}</span>
              </div>
              <div className="flex items-center gap-1 text-[var(--ketchup)] mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="text-[#222]">{review.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HoursAndLocation() {
  return (
    <>
      <section id="horaires" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 items-start">
          <div className="reveal">
            <span className="tag-pill">Horaires</span>
            <h2 className="font-display text-5xl md:text-7xl mt-3">
              ON VOUS ATTEND<span className="text-[var(--ketchup)]">.</span>
            </h2>
            <p className="mt-4 text-[var(--ink-2)]">Service rapide le midi, ambiance street-food le soir.</p>
          </div>

          <div className="reveal bg-white text-[#141414] brutal-border brutal-shadow p-6 space-y-3">
            {HOURS.map(([day, time]) => (
              <div key={day} className="flex justify-between gap-3 border-b border-[#ddd] pb-2">
                <span className="font-bold">{day}</span>
                <span className="text-[#222]">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="trouver" className="bg-[var(--ink)] text-[var(--bone)] py-20 border-y-2 border-[var(--ink)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 items-center">
          <div className="reveal">
            <span className="tag-pill !bg-[var(--mustard)] !text-[var(--ink)]">Nous Trouver</span>
            <h2 className="font-display text-5xl md:text-7xl mt-3 leading-[0.9]">
              2 RUE DE BLOIS
              <br />
              <span className="text-[var(--mustard)]">45130.</span>
            </h2>
            <p className="mt-6 inline-flex items-center gap-2">
              <MapPin size={16} /> Meung-sur-Loire
            </p>
            <p className="mt-2 inline-flex items-center gap-2">
              <Phone size={16} /> +33 2 38 47 91 19
            </p>
            <p className="mt-2 inline-flex items-center gap-2">
              <Clock size={16} /> Ouvert du mardi au dimanche
            </p>
            <a
              href="https://maps.google.com/?q=2+Rue+de+Blois+45130+Meung-sur-Loire"
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-6"
            >
              <MapPin size={18} /> Itineraire Google Maps
            </a>
          </div>

          <iframe
            className="reveal w-full h-[360px] brutal-border bg-white"
            title="Carte Smash Berliner"
            loading="lazy"
            src="https://maps.google.com/maps?q=2%20Rue%20de%20Blois%2045130%20Meung-sur-Loire&t=&z=15&ie=UTF8&iwloc=&output=embed"
          />
        </div>
      </section>
    </>
  );
}

function Footer() {
  return (
    <footer className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <p className="font-display text-3xl">
            SMASH<span className="text-[var(--ketchup)]">.</span>BERLINER
          </p>
          <p className="text-sm text-[var(--ink-2)]">2 Rue de Blois, 45130 Meung-sur-Loire</p>
        </div>
        <p className="text-sm font-bold">02 38 47 91 19</p>
        <div className="flex gap-3">
          <a aria-label="Instagram" href="https://instagram.com" target="_blank" rel="noreferrer" className="brutal-border p-2 bg-white">
            <Camera size={18} />
          </a>
          <a aria-label="Facebook" href="https://facebook.com" target="_blank" rel="noreferrer" className="brutal-border p-2 bg-white">
            <Globe size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  useReveal();
  const [siteData, setSiteData] = useState(loadSiteData);
  const isAdmin = new URLSearchParams(window.location.search).get('admin') === '1';
  const isAuthed = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'ok';

  if (isAdmin && !isAuthed) {
    return (
      <div className="min-h-screen bg-[#111317] p-4 flex items-center justify-center">
        <AdminLogin onSuccess={() => window.location.reload()} />
      </div>
    );
  }

  if (isAdmin) return <BackOffice siteData={siteData} setSiteData={setSiteData} />;

  return (
    <div>
      <Nav />
      <Hero siteData={siteData} />
      <MarqueeStrip />
      <MenuSection siteData={siteData} />
      <AboutSection />
      <GallerySection />
      <ReviewsSection />
      <HoursAndLocation />
      <Footer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 flex justify-end">
        <AdminAccessButton />
      </div>
    </div>
  );
}
