import axios from 'axios';
import {
    AnimatePresence,
    motion,
    useMotionTemplate,
    useMotionValue,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from 'framer-motion';
import React, { useEffect, useMemo, useRef, useState } from 'react';

function useMenuData() {
    const [menu, setMenu] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        (async () => {
            try {
                const response = await axios.get('api/menu');
                if (!active) return;
                setMenu(response.data);
            } catch (e) {
                try {
                    const fallbackResponse = await axios.get('menu.json');
                    if (!active) return;
                    setMenu(fallbackResponse.data);
                } catch (fallbackError) {
                    if (!active) return;
                    setError(fallbackError);
                }
            } finally {
                if (!active) return;
                setLoading(false);
            }
        })();

        return () => {
            active = false;
        };
    }, []);

    return { menu, error, loading };
}

function Reveal({ children, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
        >
            {children}
        </motion.div>
    );
}

function SmartImage({ src, alt, className, fallbackSrc = 'assets/logo.png', ...rest }) {
    const [failed, setFailed] = useState(false);

    const finalSrc = useMemo(() => {
        if (!src) return fallbackSrc;
        if (failed) return fallbackSrc;
        return src;
    }, [failed, fallbackSrc, src]);

    return (
        <img
            src={finalSrc}
            alt={alt}
            className={className}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={failed ? undefined : () => setFailed(true)}
            {...rest}
        />
    );
}

function TopSlider({ slides, reduceMotion }) {
    const [active, setActive] = useState(0);
    const isHoveringRef = useRef(false);

    const safeSlides = useMemo(() => slides ?? [], [slides]);
    const count = safeSlides.length;

    useEffect(() => {
        if (reduceMotion) return;
        if (count <= 1) return;

        const id = window.setInterval(() => {
            if (isHoveringRef.current) return;
            setActive((prev) => (prev + 1) % count);
        }, 5500);

        return () => window.clearInterval(id);
    }, [count, reduceMotion]);

    const goTo = (next) => {
        if (!count) return;
        const normalized = ((next % count) + count) % count;
        setActive(normalized);
    };

    const current = safeSlides[active];

    return (
        <div
            className="relative rounded-3xl overflow-hidden border border-outline-variant/40 shadow-sm bg-surface-container-lowest"
            onMouseEnter={() => {
                isHoveringRef.current = true;
            }}
            onMouseLeave={() => {
                isHoveringRef.current = false;
            }}
        >
            <div className="relative w-full aspect-[16/6] sm:aspect-[16/5] lg:aspect-[16/4]">
                <AnimatePresence mode="wait">
                    {current ? (
                        <motion.img
                            key={current.src}
                            src={current.src}
                            alt={current.alt}
                            className="absolute inset-0 w-full h-full object-cover"
                            initial={{ opacity: 0, scale: 1.02 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.01 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            loading="eager"
                            decoding="async"
                        />
                    ) : null}
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-black/0 to-black/0 pointer-events-none" />

                {count > 1 ? (
                    <>
                        <button
                            type="button"
                            aria-label="Previous slide"
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full glass-chip border border-outline-variant/50 text-on-surface hover:bg-white/80 transition-colors hidden sm:inline-flex items-center justify-center"
                            onClick={() => goTo(active - 1)}
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <button
                            type="button"
                            aria-label="Next slide"
                            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full glass-chip border border-outline-variant/50 text-on-surface hover:bg-white/80 transition-colors hidden sm:inline-flex items-center justify-center"
                            onClick={() => goTo(active + 1)}
                        >
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </>
                ) : null}
            </div>

            {count > 1 ? (
                <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
                    {safeSlides.map((s, idx) => (
                        <button
                            key={s.src}
                            type="button"
                            aria-label={`Go to slide ${idx + 1}`}
                            className={[
                                'h-2.5 rounded-full transition-all border border-outline-variant/50',
                                idx === active ? 'w-8 bg-primary' : 'w-2.5 bg-white/70 hover:bg-white/90',
                            ].join(' ')}
                            onClick={() => goTo(idx)}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    );
}

function Tilt({
    children,
    className = '',
    tilt = 10,
    perspective = 900,
    glare = true,
    glareSize = 280,
}) {
    const reduceMotion = useReducedMotion();
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [tilt, -tilt]), { stiffness: 240, damping: 28 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-tilt, tilt]), { stiffness: 240, damping: 28 });

    const glareX = useTransform(x, [-0.5, 0.5], ['30%', '70%']);
    const glareY = useTransform(y, [-0.5, 0.5], ['30%', '70%']);
    const glareOpacity = useSpring(useTransform(x, [-0.5, 0.5], [0.16, 0.16]), { stiffness: 240, damping: 28 });

    const glareBg = useMotionTemplate`radial-gradient(${glareSize}px circle at ${glareX} ${glareY}, rgba(255,255,255,${glareOpacity}), transparent 60%)`;

    function onPointerMove(e) {
        if (reduceMotion) return;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(px);
        y.set(py);
    }

    function onPointerLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div
            ref={ref}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            style={
                reduceMotion
                    ? undefined
                    : {
                          rotateX,
                          rotateY,
                          transformPerspective: perspective,
                      }
            }
            className={['relative will-change-transform', className].join(' ')}
        >
            {children}
            {glare && !reduceMotion ? (
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-screen"
                    style={{ background: glareBg }}
                />
            ) : null}
        </motion.div>
    );
}

function PillLink({ href, active, children, onClick }) {
    return (
        <a
            href={href}
            onClick={onClick}
            className={[
                'whitespace-nowrap px-6 py-2 rounded-full font-label-sm text-label-sm transition-colors border',
                active
                    ? 'bg-primary text-on-primary border-primary'
                    : 'glass-chip text-on-surface-variant hover:bg-white/70 border-outline-variant/50',
            ].join(' ')}
        >
            {children}
        </a>
    );
}

function MenuRow({ item }) {
    return (
        <Tilt className="rounded-2xl">
            <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="flex items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-2xl glass-chip glass-liquid transition-all group"
            >
                {item.imageUrl ? (
                    <SmartImage
                        className="w-12 h-12 object-cover rounded-xl shadow-sm border border-outline-variant/40"
                        src={item.imageUrl}
                        alt={item.name}
                        width={160}
                        height={160}
                    />
                ) : (
                    <div className="w-12 h-12 bg-tertiary-container/10 flex items-center justify-center rounded-xl border border-outline-variant/30">
                        <span className="material-symbols-outlined text-primary text-[26px]">coffee</span>
                    </div>
                )}

                <div className="min-w-0 flex-1">
                    <div className="flex items-start sm:items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <h4 className="min-w-0 font-bold text-on-surface break-words sm:truncate">
                                {item.name}
                            </h4>
                            {item.description ? (
                                <div className="mt-1 text-sm text-on-surface-variant leading-snug">{item.description}</div>
                            ) : null}
                        </div>
                        <div className="shrink-0 text-right">
                            <span className="font-bold text-primary tabular-nums">{item.price}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Tilt>
    );
}

function BakeryCard({ item }) {
    return (
        <Tilt className="rounded-2xl overflow-hidden" tilt={12} glareSize={320}>
            <motion.div
                whileHover={{ y: -4, rotate: 0.15 }}
                transition={{ type: 'spring', stiffness: 360, damping: 26 }}
                className="rounded-2xl overflow-hidden glass glass-liquid"
            >
            <div className="relative">
                {item.imageUrl ? (
                    <SmartImage
                        className="w-full h-48 object-cover transition-transform duration-700 hover:scale-[1.04]"
                        src={item.imageUrl}
                        alt={item.name}
                        width={1200}
                        height={720}
                    />
                ) : (
                    <div className="w-full h-48 bg-surface-container-high" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
            <div className="p-4">
                <div className="flex justify-between mb-2">
                    <h4 className="font-bold text-on-surface">{item.name}</h4>
                    <span className="text-primary font-bold bg-primary/5 border border-primary/20 px-3 py-1 rounded-full text-sm">
                        {item.price}
                    </span>
                </div>
                <p className="text-sm text-on-surface-variant">{item.description}</p>
            </div>
            </motion.div>
        </Tilt>
    );
}

function EateryCard({ item }) {
    return (
        <Tilt className="rounded-2xl" tilt={10} glareSize={360}>
            <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 360, damping: 26 }}>
            <div className="group cursor-pointer">
                <div className="relative rounded-2xl overflow-hidden h-64 mb-4 glass glass-liquid">
                    {item.imageUrl ? (
                        <SmartImage
                            className="w-full h-full object-cover transition-transform group-hover:scale-[1.06] duration-700"
                            src={item.imageUrl}
                            alt={item.name}
                            width={1400}
                            height={900}
                        />
                    ) : (
                        <div className="w-full h-full bg-surface-container-high" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />
                    {item.badge ? (
                        <div className="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-bold">
                            {item.badge}
                        </div>
                    ) : null}
                </div>
                <div className="flex justify-between mb-1">
                    <h4 className="font-bold text-lg text-on-surface">{item.name}</h4>
                    <span className="text-primary font-bold bg-primary/5 border border-primary/20 px-3 py-1 rounded-full text-sm">
                        {item.price}
                    </span>
                </div>
                <p className="text-sm text-on-surface-variant">{item.description}</p>
            </div>
            </motion.div>
        </Tilt>
    );
}

export default function MainApp() {
    const { menu, error, loading } = useMenuData();
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('menu');
    const [activeCategory, setActiveCategory] = useState('coffee');
    const [searchQuery, setSearchQuery] = useState('');
    const reduceMotion = useReducedMotion();
    const { scrollY, scrollYProgress } = useScroll();
    const heroBgY = useTransform(scrollY, [0, 900], [0, 70]);
    const heroBgScale = useTransform(scrollY, [0, 900], [1.03, 1.08]);
    const heroGlowY = useTransform(scrollY, [0, 900], [0, -40]);
    const heroGlow2Y = useTransform(scrollY, [0, 900], [0, 34]);
    const scrollProgressX = useSpring(scrollYProgress, { stiffness: 220, damping: 34, mass: 0.5 });

    useEffect(() => {
        function onScroll() {
            setIsScrolled(window.scrollY > 8);
        }

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const ids = ['menu', 'atmosphere', 'story', 'location'];
        const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
        if (!elements.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
                if (visible[0]?.target?.id) setActiveSection(visible[0].target.id);
            },
            { rootMargin: '-20% 0px -65% 0px', threshold: [0.05, 0.15, 0.25] },
        );

        for (const el of elements) observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const ids = (menu?.categories ?? []).map((c) => c.id).filter(Boolean);
        if (!ids.length) return;
        if (!ids.includes(activeCategory)) setActiveCategory(ids[0]);
    }, [activeCategory, menu]);

    const categories = useMemo(() => {
        return menu?.categories ?? [];
    }, [menu]);

    const categoryById = useMemo(() => {
        const map = new Map();
        for (const c of categories) map.set(c.id, c);
        return map;
    }, [categories]);

    const categoriesForRender = useMemo(() => {
        if (categories.length) return categories;
        return [
            { id: 'coffee', label: 'Coffee • القهوة' },
            { id: 'iced-cold', label: 'Iced & Cold • بارد' },
            { id: 'non-coffee', label: 'Non Coffee • بدون قهوة' },
            { id: 'tea', label: 'Tea Selection • شاي' },
            { id: 'fresh-squeeze', label: 'Fresh Squeeze • عصائر' },
            { id: 'bakery', label: 'Bakery • المخبوزات' },
            { id: 'crepes-waffles', label: 'Crepes & Waffles • كريب' },
            { id: 'toppings', label: 'Toppings • إضافات' },
            { id: 'eatery', label: 'Eatery • المأكولات' },
        ];
    }, [categories]);

    const categoriesForTabs = useMemo(() => {
        if (loading) return categoriesForRender;
        return categoriesForRender.filter((c) => (categoryById.get(c.id)?.items ?? []).length > 0);
    }, [categoriesForRender, categoryById, loading]);

    const activeCategoryData = useMemo(() => {
        return categoryById.get(activeCategory) ?? categoriesForTabs[0] ?? null;
    }, [activeCategory, categoryById, categoriesForTabs]);

    useEffect(() => {
        const ids = categoriesForTabs.map((c) => c.id).filter(Boolean);
        if (!ids.length) return;
        if (!ids.includes(activeCategory)) setActiveCategory(ids[0]);
    }, [activeCategory, categoriesForTabs]);

    const categoryIcons = useMemo(
        () => ({
            coffee: 'coffee',
            'iced-cold': 'ac_unit',
            'non-coffee': 'local_cafe',
            tea: 'emoji_food_beverage',
            'fresh-squeeze': 'local_drink',
            bakery: 'bakery_dining',
            'crepes-waffles': 'breakfast_dining',
            toppings: 'layers',
            eatery: 'restaurant',
        }),
        [],
    );

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filterMenuItems = (items) => {
        const list = items ?? [];
        if (!normalizedQuery) return list;
        return list.filter((item) => {
            const haystack = [item?.name, item?.description, item?.price].filter(Boolean).join(' ').toLowerCase();
            return haystack.includes(normalizedQuery);
        });
    };

    const heroTexture = "url('assets/images/ui/hero-texture.jpg')";

    const highlights = useMemo(
        () => [
            {
                id: 'signature',
                title: 'Signature Coffee',
                subtitle: 'Our warmest pour, your calmest moment',
                imageUrl: 'assets/images/ui/highlight-signature.jpg',
                badge: 'Featured',
            },
            {
                id: 'offer',
                title: 'Special Offer',
                subtitle: 'Coffee + dessert this week',
                imageUrl: 'assets/images/ui/highlight-offer.jpg',
                badge: 'Limited',
            },
            {
                id: 'bakery',
                title: 'Fresh Bakery',
                subtitle: 'Baked daily, served warm',
                imageUrl: 'assets/images/ui/highlight-bakery.jpg',
                badge: 'New',
            },
        ],
        [],
    );

    const reviews = useMemo(
        () => [
            {
                id: 'r1',
                name: 'Amina',
                title: 'Best morning stop',
                text: 'Calm atmosphere, premium taste, and the menu is super easy to browse from the QR.',
                rating: 5,
            },
            {
                id: 'r2',
                name: 'Karim',
                title: 'Clean & elegant',
                text: 'Everything feels crafted. Great coffee, and the digital menu looks premium.',
                rating: 5,
            },
            {
                id: 'r3',
                name: 'Sara',
                title: 'Smooth experience',
                text: 'Fast loading, beautiful photos, and I found what I wanted instantly.',
                rating: 4,
            },
        ],
        [],
    );

    return (
        <div
            dir="rtl"
            className="font-body-md text-body-md overflow-x-hidden pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0 bg-background text-on-background"
        >
            <motion.div
                className="fixed top-0 left-0 right-0 h-[3px] z-[70] origin-left"
                style={{
                    scaleX: reduceMotion ? 0 : scrollProgressX,
                    background: 'linear-gradient(90deg, rgba(148,51,6,0.0), rgba(148,51,6,1), rgba(148,51,6,0.0))',
                }}
            />
            <header
                className={[
                    'sticky top-0 z-50 transition-all glass-nav',
                    isScrolled ? 'shadow-sm' : '',
                ].join(' ')}
            >
                <div className="w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
                    <div className="flex items-center justify-center">
                        <a href="#" className="flex items-center gap-3 shrink-0">
                            <motion.img
                                src="assets/wordmark.png"
                                alt="العنوان • el ounwan"
                                className="h-9 md:h-10 w-auto"
                                whileHover={{ y: -1, scale: 1.01 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                            />
                        </a>
                    </div>
                </div>
            </header>

            <main className="space-y-10 md:space-y-16">
                <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto pt-6 md:pt-8">
                    <TopSlider
                        reduceMotion={reduceMotion}
                        slides={[
                            { src: 'assets/images/ui/slider-1.png', alt: 'el ounwan slider 1' },
                            { src: 'assets/images/ui/slider-2.png', alt: 'el ounwan slider 2' },
                        ]}
                    />
                </section>

            <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto" id="highlights">
                <div className="px-2 md:px-0">
                    <Reveal>
                        <div className="text-center">
                            <div className="font-label-sm text-label-sm text-on-surface-variant">Featured</div>
                            <h2 className="font-headline-lg text-headline-lg text-on-surface">Moments at el ounwan</h2>
                        </div>
                    </Reveal>
                </div>
                <div className="mt-6 flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory px-4">
                    {highlights.map((h) => (
                        <motion.div
                            key={h.id}
                            className="min-w-[82%] sm:min-w-[420px] md:min-w-[520px] snap-start"
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <Tilt className="rounded-3xl overflow-hidden" tilt={10} perspective={1000} glareSize={520}>
                                <div className="relative h-56 md:h-64 rounded-3xl overflow-hidden border border-outline-variant/40 bg-surface-container-lowest shadow-sm">
                                    <img
                                        src={h.imageUrl}
                                        alt={h.title}
                                        className="absolute inset-0 h-full w-full object-cover opacity-95"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-on-primary text-xs font-bold shadow-sm">
                                        {h.badge}
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        <div className="text-white font-bold text-xl">{h.title}</div>
                                        <div className="text-white/80 text-sm mt-1">{h.subtitle}</div>
                                    </div>
                                </div>
                            </Tilt>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto" id="menu">
                <div className="rounded-3xl glass-strong p-6 md:p-10">
                    <div className="flex items-end justify-between gap-6">
                        <div>
                            <div className="font-label-sm text-label-sm text-on-surface-variant">Menu</div>
                            <h2 className="font-headline-lg text-headline-lg text-primary">Explore the menu</h2>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
                            <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                            QR ready
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="relative max-w-2xl">
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                                search
                            </span>
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="ابحث في القائمة… Search"
                                className="w-full rounded-full glass-chip pr-11 pl-4 py-2 text-on-surface placeholder:text-on-surface-variant/70 focus-visible:outline-none focus:ring-4 focus:ring-primary/15"
                            />
                        </div>
                    </div>

                    <div className="mt-6 sticky top-[84px] z-20 -mx-2 px-2 py-2 rounded-3xl glass-nav border border-outline-variant/30">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                            {(categoriesForTabs.length ? categoriesForTabs : categoriesForRender).map((c) => (
                                <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => setActiveCategory(c.id)}
                                    className={[
                                        'w-full px-3 py-3 rounded-2xl border font-label-sm text-[12px] leading-snug text-center whitespace-normal min-h-[48px] transition-colors',
                                        activeCategory === c.id
                                            ? 'bg-primary text-on-primary border-primary'
                                            : 'glass-chip text-on-surface border-outline-variant/50 hover:bg-white/75',
                                    ].join(' ')}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div id="menu-items" className="mt-8 rounded-3xl glass p-6">
                        <Reveal>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary text-[26px]">
                                        {activeCategoryData?.id ? categoryIcons[activeCategoryData.id] ?? 'menu_book' : 'menu_book'}
                                    </span>
                                    <h3 className="font-headline-lg text-headline-lg text-on-surface">
                                        {activeCategoryData?.label ?? 'Menu'}
                                    </h3>
                                </div>
                                <span className="inline-flex items-center gap-2 rounded-full glass-chip px-4 py-2 text-on-surface-variant font-label-sm text-label-sm w-fit">
                                    <span className="material-symbols-outlined text-[18px] text-primary">menu_book</span>
                                    {filterMenuItems(categoryById.get(activeCategoryData?.id)?.items).length} items
                                </span>
                            </div>
                        </Reveal>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeCategoryData?.id ?? 'menu'}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                                className="mt-6 grid md:grid-cols-2 gap-3"
                            >
                                {loading
                                    ? Array.from({ length: 10 }).map((_, idx) => (
                                          <div
                                              key={`menu-skeleton-${idx}`}
                                              className="h-[78px] rounded-2xl bg-surface-container-low animate-pulse"
                                          />
                                      ))
                                    : filterMenuItems(categoryById.get(activeCategoryData?.id)?.items).map((item, idx) => (
                                          <Reveal key={item.id} delay={idx * 0.02}>
                                              <MenuRow item={item} />
                                          </Reveal>
                                      ))}
                            </motion.div>
                        </AnimatePresence>

                        {!loading &&
                        normalizedQuery &&
                        filterMenuItems(categoryById.get(activeCategoryData?.id)?.items).length === 0 ? (
                            <div className="mt-4 text-sm text-on-surface-variant">
                                No results for “{searchQuery}”.
                            </div>
                        ) : null}

                        {error ? (
                            <div className="mt-4 text-sm text-on-surface-variant">Menu API not reachable. Check backend.</div>
                        ) : null}
                    </div>
                </div>
            </section>

            <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto md:!mt-8" id="atmosphere">
                <div className="rounded-3xl bg-surface-container-lowest border border-outline-variant/40 p-6 md:p-10 shadow-sm">
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <Reveal>
                            <div className="space-y-6" dir="rtl">
                                <div className="inline-flex items-center gap-3 rounded-full bg-surface-container-low border border-outline-variant/40 px-4 py-2">
                                    <span className="material-symbols-outlined text-[18px] text-primary">auto_stories</span>
                                    <span className="font-label-sm text-label-sm text-on-surface-variant">Our Story</span>
                                </div>
                                <h2 className="font-headline-lg text-headline-lg text-on-surface">أجواءنا • Our Atmosphere</h2>
                                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                                    Between the warmth of terracotta and the scent of freshly roasted beans, we've
                                    crafted a sanctuary for slow moments. Every bite and every pour is a tribute to the
                                    artisanal heritage of Algiers.
                                </p>
                                <div className="flex gap-4">
                                    <div className="w-16 h-1 bg-primary rounded-full" />
                                    <div className="w-8 h-1 bg-tertiary-container rounded-full" />
                                </div>
                            </div>
                        </Reveal>
                        <Reveal delay={0.05}>
                            <Tilt className="rounded-3xl overflow-hidden" tilt={8} perspective={1000} glareSize={560}>
                                <div className="relative">
                                    <div className="absolute -inset-2 bg-primary/10 rounded-3xl rotate-1" />
                                    <img
                                        className="relative w-full h-[360px] md:h-[420px] object-cover rounded-3xl shadow-xl border border-outline-variant/40"
                                        src="assets/images/ui/atmosphere.jpg"
                                        alt="Our atmosphere"
                                        loading="lazy"
                                    />
                                </div>
                            </Tilt>
                        </Reveal>
                    </div>
                </div>
            </section>

            <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto md:!mt-8" id="story">
                <div className="rounded-3xl glass-strong glass-liquid p-6 md:p-10">
                    <Reveal>
                        <div className="flex items-end justify-between gap-6">
                            <div>
                                <div className="font-label-sm text-label-sm text-on-surface-variant">Must Try</div>
                                <h2 className="font-headline-lg text-headline-lg text-on-surface">لا بد من تجربته</h2>
                            </div>
                            <div className="hidden md:flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
                                <span className="material-symbols-outlined text-[18px]">favorite</span>
                                Customer favorites
                            </div>
                        </div>
                    </Reveal>
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <motion.div
                            className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden aspect-square group border border-outline-variant/30 shadow-sm"
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                        >
                            <img
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                src="assets/images/menu/coffee.jpg"
                                alt="House Blend Coffee"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
                                <h4 className="text-white font-headline-lg text-headline-lg-mobile mb-1">House Blend Coffee</h4>
                                <p className="text-white/80 text-sm">Our most loved signature craft</p>
                            </div>
                        </motion.div>
                        <motion.div
                            className="relative rounded-2xl overflow-hidden aspect-square group border border-outline-variant/30 shadow-sm"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: 'spring', stiffness: 240, damping: 24 }}
                        >
                            <img
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                src="assets/images/ui/fav-spanish.jpg"
                                alt="Spanish Latte"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/25 flex items-center justify-center p-4">
                                <span className="text-white font-bold text-center">Spanish Latte</span>
                            </div>
                        </motion.div>
                        <motion.div
                            className="relative rounded-2xl overflow-hidden aspect-square group border border-outline-variant/30 shadow-sm"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: 'spring', stiffness: 240, damping: 24 }}
                        >
                            <img
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                src="assets/images/ui/fav-tiramisu.jpg"
                                alt="House Tiramisu"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/25 flex items-center justify-center p-4">
                                <span className="text-white font-bold text-center">House Tiramisu</span>
                            </div>
                        </motion.div>
                        <motion.div
                            className="col-span-2 relative rounded-2xl overflow-hidden aspect-[2/1] group border border-outline-variant/30 shadow-sm"
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                        >
                            <img
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                src="assets/images/ui/fav-club.jpg"
                                alt="Club Sandwich Pesto Chicken"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/10 to-transparent flex flex-col justify-center p-6">
                                <h4 className="text-white font-bold text-xl">Club Sandwich Pesto Chicken</h4>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto" id="info">
                <div className="grid md:grid-cols-3 gap-6">
                    <Reveal>
                        <div className="rounded-3xl glass glass-liquid p-6">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">qr_code_2</span>
                                <div className="font-bold text-on-surface">QR Menu</div>
                            </div>
                            <div className="mt-3 text-on-surface-variant text-sm leading-relaxed">
                                Customers scan the QR and browse instantly. Fast, clean, and mobile-first.
                            </div>
                        </div>
                    </Reveal>
                    <Reveal delay={0.05}>
                        <div className="rounded-3xl glass glass-liquid p-6">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">call</span>
                                <div className="font-bold text-on-surface">Contact</div>
                            </div>
                            <div className="mt-3 space-y-2 text-on-surface-variant text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">alternate_email</span>
                                    <span>@ounwan_coffee</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">video_library</span>
                                    <span>@ounwan_coffee</span>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <div className="rounded-3xl glass glass-liquid p-6">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">schedule</span>
                                <div className="font-bold text-on-surface">Opening Times</div>
                            </div>
                            <div className="mt-3 text-on-surface-variant text-sm leading-relaxed">
                                Daily 08:00–22:00
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto" id="location">
                <Reveal>
                    <div className="rounded-3xl overflow-hidden flex flex-col md:flex-row glass-strong glass-liquid">
                        <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center space-y-8" dir="rtl">
                            <div>
                                <div className="font-label-sm text-label-sm text-on-surface-variant">Find Us</div>
                                <h3 className="font-headline-lg text-headline-lg text-primary mb-4">تفضلوا بزيارتنا • Find Us</h3>
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-primary">location_on</span>
                                    <p className="font-body-lg text-body-lg text-on-surface">17, Rue Dr Cherif Saadane, Alger</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined text-primary">schedule</span>
                                    <p className="text-on-surface-variant">Daily: 08:00 AM - 10:00 PM</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined text-primary">call</span>
                                    <p className="text-on-surface-variant">+213 (0) 23 XX XX XX</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <a className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors" href="https://instagram.com/ounwan_coffee" target="_blank" rel="noreferrer">
                                    <span className="material-symbols-outlined">alternate_email</span>
                                    <span>Instagram</span>
                                </a>
                                <a className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors" href="https://www.tiktok.com/@ounwan_coffee" target="_blank" rel="noreferrer">
                                    <span className="material-symbols-outlined">video_library</span>
                                    <span>TikTok</span>
                                </a>
                            </div>
                        </div>
                        <div className="md:w-1/2 h-64 md:h-auto min-h-[320px] grayscale hover:grayscale-0 transition-all duration-700">
                            <iframe
                                title="Map"
                                allowFullScreen
                                frameBorder="0"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.6416!2d3.0588!3d36.7538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fb2f3e!2sAlgiers!5e0!3m2!1sen!2sdz!4v123456789"
                                style={{ border: 0 }}
                                width="100%"
                                height="100%"
                            />
                        </div>
                    </div>
                </Reveal>
            </section>

            <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto" id="reviews">
                <div className="rounded-3xl glass-strong glass-liquid p-6 md:p-10">
                    <div className="flex items-end justify-between gap-6">
                        <div>
                            <div className="font-label-sm text-label-sm text-on-surface-variant">Customer Reviews</div>
                            <h2 className="font-headline-lg text-headline-lg text-on-surface">What people say</h2>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary text-on-primary px-4 py-2 font-label-sm text-label-sm">
                            <span className="material-symbols-outlined text-[18px]">star</span>
                            4.8
                        </div>
                    </div>
                    <div className="mt-6 flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory">
                        {reviews.map((r) => (
                            <motion.div
                                key={r.id}
                                className="min-w-[86%] sm:min-w-[420px] snap-start"
                                initial={{ opacity: 0, y: 14 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <Tilt className="rounded-3xl" tilt={8} perspective={1100} glareSize={420}>
                                    <div className="rounded-3xl bg-surface-container-low border border-outline-variant/40 p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="font-bold text-on-surface">{r.name}</div>
                                            <div className="inline-flex items-center gap-1 text-on-surface-variant text-sm">
                                                {Array.from({ length: 5 }).map((_, idx) => (
                                                    <span
                                                        key={idx}
                                                        className={[
                                                            'material-symbols-outlined text-[18px]',
                                                            idx < r.rating ? 'text-primary' : 'text-on-surface-variant/50',
                                                        ].join(' ')}
                                                    >
                                                        {idx < r.rating ? 'star' : 'star_outline'}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mt-2 font-bold text-on-surface">{r.title}</div>
                                        <div className="mt-2 text-on-surface-variant text-sm leading-relaxed">{r.text}</div>
                                    </div>
                                </Tilt>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="w-full pb-24 md:pb-10">
                <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
                    <div className="rounded-3xl glass-strong glass-liquid p-6 md:p-10">
                        <div className="grid gap-8 md:grid-cols-[1fr_auto] items-start">
                            <div className="text-center md:text-left">
                                <img src="assets/wordmark.png" alt="العنوان • el ounwan" className="h-10 md:h-12 w-auto mx-auto md:mx-0" />
                                <p className="mt-2 text-on-surface-variant font-label-sm text-label-sm">Crafted in Algiers.</p>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-3">
                                <a className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary transition-colors" href="#">
                                    Privacy Policy
                                </a>
                                <a className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary transition-colors" href="#">
                                    Terms of Service
                                </a>
                                <a className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary transition-colors" href="#">
                                    Press Kit
                                </a>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <p className="text-on-surface-variant font-label-sm text-label-sm opacity-70">
                                © 2026 العنوان • el ounwan. All Rights Reserved.
                            </p>
                            <div className="text-on-surface-variant font-label-sm text-label-sm opacity-70">
                                Coffee shop • Eatery • Alger
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            </main>

            <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] px-4 border-t border-primary/20 shadow-[0_-10px_26px_rgba(0,0,0,0.16)] md:hidden z-50 h-16 bg-gradient-to-r from-[#f3e2cf]/95 via-[#fff8f3]/95 to-[#ead1ba]/95 backdrop-blur-md">
                <a
                    className={[
                        'flex flex-col items-center justify-center font-bold transition-transform active:scale-95',
                        activeSection === 'menu' ? 'text-primary' : 'text-on-surface-variant',
                    ].join(' ')}
                    href="#menu"
                >
                    <span className="material-symbols-outlined" data-weight="fill">
                        menu_book
                    </span>
                    <span className="font-label-sm text-label-sm">Menu</span>
                </a>
                <a
                    className={[
                        'flex flex-col items-center justify-center transition-transform active:scale-95',
                        activeSection === 'atmosphere' ? 'text-primary font-bold' : 'text-on-surface-variant',
                    ].join(' ')}
                    href="#atmosphere"
                >
                    <span className="material-symbols-outlined">auto_stories</span>
                    <span className="font-label-sm text-label-sm">Story</span>
                </a>
                <a
                    className={[
                        'flex flex-col items-center justify-center transition-transform active:scale-95',
                        activeSection === 'location' ? 'text-primary font-bold' : 'text-on-surface-variant',
                    ].join(' ')}
                    href="#location"
                >
                    <span className="material-symbols-outlined">location_on</span>
                    <span className="font-label-sm text-label-sm">Find Us</span>
                </a>
                <a className="flex flex-col items-center justify-center text-on-surface-variant transition-transform active:scale-95" href="tel:+213000000">
                    <span className="material-symbols-outlined">call</span>
                    <span className="font-label-sm text-label-sm">Call</span>
                </a>
            </nav>
        </div>
    );
}
