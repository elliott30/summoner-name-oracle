import { useState, useCallback, useRef, useEffect } from 'react';
import Head from 'next/head';

// ============================================================
// DATA — 168 champions (cleaned for username use)
// ============================================================

const CHAMPIONS = [
  'Aatrox','Ahri','Akali','Akshan','Alistar','Ambessa','Amumu','Anivia','Annie',
  'Aphelios','Ashe','AurelionSol','Azir','Bard','BelVeth','Blitzcrank','Brand',
  'Braum','Briar','Caitlyn','Camille','Cassiopeia','ChoGath','Corki','Darius',
  'Diana','DrMundo','Draven','Ekko','Elise','Evelynn','Ezreal','Fiddlesticks',
  'Fiora','Fizz','Galio','Gangplank','Garen','Gnar','Gragas','Graves','Gwen',
  'Hecarim','Heimerdinger','Hwei','Illaoi','Irelia','Ivern','Janna','JarvanIV',
  'Jax','Jayce','Jhin','Jinx','KSante','KaiSa','Kalista','Karma','Karthus',
  'Kassadin','Katarina','Kayle','Kayn','Kennen','KhaZix','Kindred','Kled',
  'KogMaw','LeBlanc','LeeSin','Leona','Lillia','Lissandra','Lucian','Lulu',
  'Lux','Malphite','Malzahar','Maokai','MasterYi','Milio','MissFortune',
  'Mordekaiser','Morgana','Naafiri','Nami','Nasus','Nautilus','Neeko','Nidalee',
  'Nilah','Nocturne','Nunu','Olaf','Orianna','Ornn','Pantheon','Poppy','Pyke',
  'Qiyana','Quinn','Rakan','Rammus','RekSai','Rell','RenataGlasc','Renekton',
  'Rengar','Riven','Rumble','Ryze','Samira','Sejuani','Senna','Seraphine',
  'Sett','Shaco','Shen','Shyvana','Singed','Sion','Sivir','Skarner','Smolder',
  'Sona','Soraka','Swain','Sylas','Syndra','TahmKench','Taliyah','Talon',
  'Taric','Teemo','Thresh','Tristana','Trundle','Tryndamere','TwistedFate',
  'Twitch','Udyr','Urgot','Varus','Vayne','Veigar','VelKoz','Vex','Vi',
  'Viego','Viktor','Vladimir','Volibear','Warwick','Wukong','Xayah','Xerath',
  'XinZhao','Yasuo','Yone','Yorick','Yuumi','Zac','Zed','Zeri','Ziggs',
  'Zilean','Zoe','Zyra','Aurora',
];

// ============================================================
// DATA — 220+ adjectives / descriptors
// ============================================================

const ADJECTIVES = [
  // Physical / Appearance
  'Stout','Lanky','Thicc','Soggy','Crispy','Fluffy','Chubby','Bald','Bearded',
  'Musty','Crusty','Damp','Juicy','Crunchy','Spicy','Zesty','Funky','Burly',
  'Scrawny','Stubby','Pudgy','Slimy','Gooey','Sticky','Greasy','Wobbly',
  'Lumpy','Jiggly','Twitchy','Clammy','Prickly','Hairy','Bony','Plump',
  'Stringy','Hollow','Brittle','Squeaky','Wrinkled','Floppy',

  // Gaming / Skill
  'Hardstuck','Boosted','Inting','Feeding','Bronze','Iron','Unranked',
  'Tilted','Smurfing','Reformed','Toxic','Tryhard','Onetricking',
  'Climbing','Griefing','Stomping','Splitpushing','Roaming','Camping',
  'Spamming','Blaming','Malding','Seething','Sweating','Grinding','Flaming',
  'Ragequitting','Carrying','Trolling','Coinflipping','Turbointing',
  'Ghosting','Warding','Cheesing','Scaling','Snowballing','Afk',
  'Surrendering','Reporting','Permabannable','Hardfeeding','Softfeeding',

  // Personality / Mood
  'Grumpy','Sneaky','Dramatic','Anxious','Chaotic','Reckless','Impulsive',
  'Stubborn','Silly','Goofy','Awkward','Clumsy','Frantic','Bewildered',
  'Melancholy','Determined','Oblivious','Delusional','Confused','Lost',
  'Overconfident','Paranoid','Sleepy','Exhausted','Hyper','Clueless',
  'Menacing','Harmless','Forgotten','Cowardly','Noble','Wholesome','Corrupted',
  'Passive','Restless','Serene','Gleeful','Brooding','Unhinged','Frugal',
  'Territorial','Lukewarm','Apathetic','Petty','Vindictive','Lonesome',

  // Internet / Slang
  'Based','Cringe','Goated','Sigma','Sus','Salty','Vibing','Lowelo','Highelo',
  'Certified','Verified','Official','Premium','Budget','Discount','Generic',
  'Local','Actual','Fake','Cursed','Blessed','Ancient','Eternal',
  'Broken','Nerfed','Buffed','Vintage','Classic','Legendary','Doomed',
  'Haunted','Mythical','Patched','Outdated','Retro','Experimental',
  'Bestie','Iconic','Cooked','Slay','Unalived','Delulu','Chronically',

  // Misc / Funny
  'Unlucky','Lucky','Average','Mediocre','Forgettable','Invincible',
  'Unstoppable','Absolute','Complete','Pure','Secret','Hidden','Alternate',
  'Random','Spontaneous','Accidental','Reluctant','Enthusiastic','Definitely',
  'Probably','Objectively','Professionally','Amateur','Veteran',
  'Novice','Expert','Honored','Banned','Irredeemable','Redeemed','Notorious',
  'Anonymous','Humble','Mighty','Divine','Unholy','Benevolent','Malevolent',
  'Shiny','Rusty','Soft','Dark','Bright','Magical','Ordinary','Magnificent',
  'Pathetic','Glorious','Disgraced','Loyal','Treacherous','Dreadful',
  'Charming','Dashing','Ominous','Suspicious','Peculiar','Mysterious',
  'Remarkable','Unremarkable','Questionable','Respectable','Infamous',
  'Beloved','Despised','Tolerated','Feared','Pitied','Envied','Ignored',
  'Alleged','Aspiring','Retired','Returning','Backup','Spare','Colossal',
  'Rotting','Ascending','Descending','Floating','Sinking','Hovering',
];

// ============================================================
// DATA — verbs, nouns, suffixes for "i[verb][noun][suffix]" pattern
// ============================================================

const VERBS = [
  'eat','drink','sleep','play','feed','carry','tilt','rage','cry','yell',
  'forget','miss','fail','lose','give','break','dodge','flash','roam',
  'spam','steal','ignore','report','mute','throw','grind','troll','ward',
  'recall','buy','cook','bake','touch','pet','read','watch','smell','lick',
  'hoard','collect','drop','carry','yeet','build','destroy','fix','miss',
];

const NOUNS = [
  'toast','pizza','soup','noodles','rice','cake','cookies','milk','coffee',
  'tea','bread','cheese','tacos','sushi','ramen','cereal','waffles','pancakes',
  'burgers','fries','chicken','fish','salad','carrots','broccoli','pasta',
  'donuts','muffins','bagels','pretzels','nachos','burritos','hotdogs','pickles',
  'avocado','tofu','ketchup','granola','crayons','socks','blankets','pillows',
  'keyboards','headphones','hoodies','slippers','napkins','monitors','chairs',
  'mousepads','potions','wards','items','runes','shards','hextech','poro',
  'pentakills','nexuses','turrets','dragons','barons','minions','rift',
];

const SUFFIXES = [
  'Daily','Always','Irl','Online','Sometimes','Never','Forever','Tonight',
  'Now','Still','Again','Only','Mostly','Usually','Rarely','Weekly',
  'Nonstop','Constantly','Already','Eventually','Occasionally','Competitively',
];

// ============================================================
// DATA — ranks and taglines
// ============================================================

const RANKS = [
  'Bronze','Iron','Silver','Gold','Plat','Emerald','Diamond',
  'Master','GrandMaster','Challenger',
];

const TAGLINES = [
  'EUW','NA','KR','BR','TR','OCE','RU','LAN','LAS','JP',
  'GG','EZ','FF','INT','AFK','YAS','ZED','LUX','GAR',
  'NPC','BOT','GOD','PRO','NEW','ALT','SMF','LAG','BUG',
  'TILT','FEED','INTS','AFKS','MALD','COPE','SEETHE','SLAY',
  'MAIN','SUPP','JGL','MID','TOP','ADC',
  'FF15','FF20','GGWP','GGNP','GGEZ',
];

// ============================================================
// DATA — fun flavor text shown after generating
// ============================================================

const QUIPS = [
  'The stars have revealed your destiny.',
  'The Oracle has spoken. Embarrassingly.',
  'Your new identity awaits, summoner.',
  'Teemo approved this message.',
  'Yasuo mains, beware.',
  '99% guaranteed untaken. The other 1% is also hardstuck.',
  'The Rift will remember this name. Your teammates will not.',
  'Certified fresh from the Oracle.',
  'May your games be short and your deaths painless.',
  'Baron has been slain. Along with your dignity.',
  'GG WP. Now pick a name.',
  'The void calls to you, summoner.',
  'Your jungle diff has been calculated.',
  'Please report my teammates.',
  'First time every game. Legendary every game.',
  'It\'s giving main character energy.',
  'Your lane opponent is already laughing.',
  'The nexus has been destroyed. But your name lives on.',
  'Singed has been reported. Singed does not care.',
  'Support diff. Mid diff. Top diff. You diff.',
  'A name so unique, even your jungler will gank for you.',
  'All 9 of your teammates have voted yes on this name.',
  'This is your villain origin story.',
  'Win rate: unknown. Name rate: 10/10.',
  'The enemy team has surrendered (to the name).',
];

// ============================================================
// NAME GENERATION PATTERNS — 16 total
// ============================================================

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function maybeNum(chanceOfNumber = 0.6, maxDigits = 3) {
  if (Math.random() > chanceOfNumber) return '';
  const max = Math.pow(10, maxDigits);
  const min = Math.pow(10, maxDigits - 1);
  return String(Math.floor(Math.random() * (max - min)) + min);
}

function randSmallNum() {
  const pool = [1, 2, 3, 4, 7, 9, 11, 13, 42, 69, 77, 99, 100, 420, 666, 777, 1337, 9999];
  return rand(pool);
}

const PATTERNS = [
  {
    name: 'The Classic',
    desc: 'Adjective + Champion + optional number',
    fn: () => {
      const num = Math.random() < 0.55 ? randSmallNum() : '';
      return `${rand(ADJECTIVES)}${rand(CHAMPIONS)}${num}`;
    },
  },
  {
    name: 'The Accusation',
    desc: 'Champion Is Adjective',
    fn: () => `${rand(CHAMPIONS)}Is${rand(ADJECTIVES)}`,
  },
  {
    name: 'The Confessional',
    desc: 'i + verb + noun + suffix',
    fn: () => `i${rand(VERBS)}${rand(NOUNS)}${rand(SUFFIXES)}`,
  },
  {
    name: 'The Denial',
    desc: 'not + Champion',
    fn: () => `not${rand(CHAMPIONS)}`,
  },
  {
    name: 'The Fervent Denial',
    desc: 'definitelyNot + Champion',
    fn: () => `definitelyNot${rand(CHAMPIONS)}`,
  },
  {
    name: 'The Main',
    desc: 'Adjective + Champion + Main',
    fn: () => `${rand(ADJECTIVES)}${rand(CHAMPIONS)}Main`,
  },
  {
    name: 'The Struggle',
    desc: 'hardstuck + Champion',
    fn: () => `hardstuck${rand(CHAMPIONS)}`,
  },
  {
    name: 'The Honest',
    desc: 'actual + Champion + optional number',
    fn: () => {
      const num = Math.random() < 0.4 ? randSmallNum() : '';
      return `actual${rand(CHAMPIONS)}${num}`;
    },
  },
  {
    name: 'The Rank Shame',
    desc: 'Rank + Champion',
    fn: () => `${rand(RANKS)}${rand(CHAMPIONS)}`,
  },
  {
    name: 'The Self Report',
    desc: 'iAm + Adjective + Champion',
    fn: () => `iAm${rand(ADJECTIVES)}${rand(CHAMPIONS)}`,
  },
  {
    name: 'The Callout',
    desc: 'your + Champion + Is + Adjective',
    fn: () => `your${rand(CHAMPIONS)}Is${rand(ADJECTIVES)}`,
  },
  {
    name: 'The Headline',
    desc: 'Champion + verb + Games',
    fn: () => `${rand(CHAMPIONS)}${cap(rand(VERBS))}Games`,
  },
  {
    name: 'The Testimony',
    desc: 'my + Champion + is + Adjective',
    fn: () => `my${rand(CHAMPIONS)}is${rand(ADJECTIVES)}`,
  },
  {
    name: 'The Humble',
    desc: 'notA + Champion + Main',
    fn: () => {
      const num = Math.random() < 0.35 ? randSmallNum() : '';
      return `notA${rand(CHAMPIONS)}Main${num}`;
    },
  },
  {
    name: 'The Double Down',
    desc: 'Adjective + Adjective + Champion',
    fn: () => {
      const a1 = rand(ADJECTIVES);
      let a2 = rand(ADJECTIVES);
      while (a2 === a1) a2 = rand(ADJECTIVES);
      return `${a1}${a2}${rand(CHAMPIONS)}`;
    },
  },
  {
    name: 'The Rank Main',
    desc: 'Rank + Adjective + Main',
    fn: () => `${rand(RANKS)}${rand(ADJECTIVES)}Main`,
  },
];

function generateName() {
  let name, pattern;
  let attempts = 0;
  do {
    pattern = rand(PATTERNS);
    name = pattern.fn();
    attempts++;
  } while ((name.length < 3 || name.length > 16) && attempts < 100);
  const tag = rand(TAGLINES);
  return { name, tag, patternName: pattern.name, patternDesc: pattern.desc };
}

// ============================================================
// COMPONENT
// ============================================================

export default function Home() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(null); // stores what was copied
  const [isGenerating, setIsGenerating] = useState(false);
  const [quip, setQuip] = useState('');
  const [animKey, setAnimKey] = useState(0);
  const timeoutRef = useRef(null);

  const handleGenerate = useCallback(() => {
    if (isGenerating) return;
    setIsGenerating(true);

    // Brief slot-machine flash
    let flashes = 0;
    const flash = () => {
      setResult(generateName());
      setAnimKey(k => k + 1);
      flashes++;
      if (flashes < 6) {
        timeoutRef.current = setTimeout(flash, 70);
      } else {
        const final = generateName();
        setResult(final);
        setAnimKey(k => k + 1);
        setHistory(prev => [{ ...final, id: Date.now() }, ...prev].slice(0, 9));
        setQuip(rand(QUIPS));
        setIsGenerating(false);
      }
    };
    flash();
  }, [isGenerating]);

  useEffect(() => {
    handleGenerate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = useCallback((text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    }).catch(() => {
      // fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    });
  }, []);

  const charCount = result?.name?.length || 0;
  const totalCombinations = (() => {
    // rough estimate
    const classic = ADJECTIVES.length * CHAMPIONS.length * 10;
    return (classic * PATTERNS.length / 3).toLocaleString();
  })();

  return (
    <>
      <Head>
        <title>Summoner Name Oracle</title>
        <meta name="description" content="Generate funny & unique League of Legends summoner names. No API needed." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Open+Sans:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="app">

        {/* ── Header ── */}
        <header className="header">
          <div className="header-inner">
            <span className="ornament">◆</span>
            <h1 className="title">Summoner Name Oracle</h1>
            <span className="ornament">◆</span>
          </div>
          <p className="subtitle">For when "xXDarkLord99Xx" is already taken (again)</p>
          <div className="header-rule" />
        </header>

        {/* ── Main Generator ── */}
        <main className="main">

          {/* Name display panel */}
          <div className={`panel ${isGenerating ? 'panel--generating' : ''}`}>
            <div className="panel-corner panel-corner--tl" />
            <div className="panel-corner panel-corner--tr" />
            <div className="panel-corner panel-corner--bl" />
            <div className="panel-corner panel-corner--br" />

            {result ? (
              <div className="result" key={animKey}>
                <div className="result-name">{result.name}</div>
                <div className="result-tag">#{result.tag}</div>
                <div className="result-meta">
                  <span className="char-badge char-badge--ok">
                    {charCount}/16 chars ✓
                  </span>
                  <span className="pattern-badge">
                    {result.patternName}
                  </span>
                </div>
              </div>
            ) : (
              <div className="panel-placeholder">
                <span className="placeholder-rune">✦</span>
                <span>Your destiny awaits, summoner...</span>
              </div>
            )}
          </div>

          {/* Quip */}
          {quip && !isGenerating && (
            <p className="quip">{quip}</p>
          )}

          {/* Action buttons */}
          <div className="actions">
            <button
              className={`btn-generate ${isGenerating ? 'btn-generate--busy' : ''}`}
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <span className="btn-generating-text">Consulting the Stars...</span>
              ) : (
                <>⚔&nbsp;&nbsp;Change Your Destiny&nbsp;&nbsp;⚔</>
              )}
            </button>

            {result && !isGenerating && (
              <div className="copy-buttons">
                <button
                  className="btn-copy"
                  onClick={() => handleCopy(result.name, 'name')}
                  title="Copy game name only"
                >
                  {copied === 'name' ? '✓ Copied!' : 'Copy Name'}
                </button>
                <button
                  className="btn-copy btn-copy--secondary"
                  onClick={() => handleCopy(`${result.name}#${result.tag}`, 'id')}
                  title="Copy full Riot ID"
                >
                  {copied === 'id' ? '✓ Copied!' : 'Copy Riot ID'}
                </button>
              </div>
            )}
          </div>

          {/* Pattern description */}
          {result && !isGenerating && (
            <p className="pattern-desc">
              <span className="pattern-desc-label">Pattern:</span> {result.patternDesc}
            </p>
          )}
        </main>

        {/* ── History ── */}
        {history.length > 0 && (
          <section className="history">
            <div className="history-header">
              <span className="history-rule" />
              <h2 className="history-title">Previously Forsaken</h2>
              <span className="history-rule" />
            </div>
            <ul className="history-list">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="history-item"
                  onClick={() => handleCopy(item.name, item.id)}
                  title="Click to copy"
                >
                  <span className="history-name">{item.name}</span>
                  <span className="history-tag">#{item.tag}</span>
                  <span className="history-copy-hint">
                    {copied === item.id ? '✓' : 'copy'}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Footer ── */}
        <footer className="footer">
          <div className="footer-rule" />
          <p className="footer-stats">
            {CHAMPIONS.length} champions&ensp;·&ensp;
            {ADJECTIVES.length} adjectives&ensp;·&ensp;
            {PATTERNS.length} patterns&ensp;·&ensp;
            ~{totalCombinations} possible names
          </p>
          <p className="footer-disclaimer">
            Not affiliated with Riot Games · Names not guaranteed to be available ·
            The Oracle accepts no responsibility for your MMR
          </p>
          <p className="footer-legal">
            <a href="https://elliott30.github.io/legal.html" target="_blank" rel="noopener noreferrer" className="footer-legal-link">Privacy Policy &amp; Terms</a>
          </p>
        </footer>
      </div>

      {/* ─────────────────────────────────────────────── STYLES */}
      <style jsx global>{`

        .app {
          font-family: 'Open Sans', sans-serif;
          max-width: 680px;
          margin: 0 auto;
          padding: 48px 24px 64px;
          display: flex;
          flex-direction: column;
          gap: 36px;
          min-height: 100vh;
        }

        /* ── Header ── */
        .header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .header-inner {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .ornament {
          color: #C89B3C;
          font-size: 18px;
          opacity: 0.7;
        }

        .title {
          font-family: 'Cinzel', serif;
          font-size: clamp(26px, 6vw, 44px);
          font-weight: 900;
          color: #C89B3C;
          letter-spacing: 0.04em;
          text-shadow: 0 0 40px rgba(200, 155, 60, 0.35),
                       0 2px 4px rgba(0,0,0,0.8);
          line-height: 1.1;
        }

        .subtitle {
          color: #6A5A3A;
          font-size: 13px;
          font-style: italic;
          letter-spacing: 0.02em;
        }

        .header-rule {
          width: 100%;
          max-width: 400px;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(200, 155, 60, 0.4) 30%,
            rgba(200, 155, 60, 0.4) 70%,
            transparent 100%
          );
          margin-top: 6px;
        }

        /* ── Main ── */
        .main {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
        }

        /* ── Panel (name display) ── */
        .panel {
          width: 100%;
          min-height: 150px;
          position: relative;
          background: rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(200, 155, 60, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 28px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .panel--generating {
          border-color: rgba(200, 155, 60, 0.65);
          box-shadow: 0 0 32px rgba(200, 155, 60, 0.1),
                      inset 0 0 32px rgba(200, 155, 60, 0.04);
        }

        /* corner ornaments */
        .panel-corner {
          position: absolute;
          width: 14px;
          height: 14px;
          border-color: #C89B3C;
          border-style: solid;
          opacity: 0.8;
        }
        .panel-corner--tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
        .panel-corner--tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; }
        .panel-corner--bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; }
        .panel-corner--br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

        /* ── Result ── */
        .result {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          animation: nameReveal 0.35s ease-out;
          text-align: center;
        }

        @keyframes nameReveal {
          from {
            opacity: 0;
            transform: translateY(6px);
            letter-spacing: 0.15em;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            letter-spacing: normal;
          }
        }

        .result-name {
          font-family: 'Cinzel', serif;
          font-size: clamp(20px, 5vw, 34px);
          font-weight: 700;
          color: #F0E6D3;
          word-break: break-all;
          line-height: 1.2;
          text-shadow: 0 0 20px rgba(240, 230, 211, 0.1);
        }

        .result-tag {
          font-family: 'Open Sans', sans-serif;
          font-size: 15px;
          color: #6A5A3A;
          letter-spacing: 0.08em;
          font-weight: 300;
        }

        .result-meta {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 4px;
        }

        .char-badge {
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 2px;
        }
        .char-badge--ok {
          color: #5BAD5E;
          background: rgba(91, 173, 94, 0.1);
          border: 1px solid rgba(91, 173, 94, 0.25);
        }
        .char-badge--warn {
          color: #E09F3E;
          background: rgba(224, 159, 62, 0.1);
          border: 1px solid rgba(224, 159, 62, 0.25);
        }

        .pattern-badge {
          font-size: 11px;
          color: #6A5A3A;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-style: italic;
        }

        /* ── Placeholder ── */
        .panel-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: #2E2418;
          font-family: 'Cinzel', serif;
          font-size: 17px;
          letter-spacing: 0.04em;
          text-align: center;
        }

        .placeholder-rune {
          font-size: 28px;
          color: #2E2418;
          animation: rune-pulse 3s ease-in-out infinite;
        }

        @keyframes rune-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }

        /* ── Quip ── */
        .quip {
          font-size: 13px;
          color: #6A5A3A;
          font-style: italic;
          text-align: center;
          max-width: 440px;
          animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* ── Actions ── */
        .actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        /* ── Generate Button ── */
        .btn-generate {
          font-family: 'Cinzel', serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #010A13;
          background: linear-gradient(180deg,
            #F5C542 0%,
            #C89B3C 45%,
            #8B6914 100%
          );
          border: none;
          padding: 15px 40px;
          cursor: pointer;
          position: relative;
          transition: filter 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
          clip-path: polygon(10px 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0% 50%);
          min-width: 260px;
        }

        .btn-generate::before {
          content: '';
          position: absolute;
          inset: 1px;
          background: linear-gradient(180deg,
            rgba(255,255,255,0.15) 0%,
            transparent 60%
          );
          clip-path: inherit;
          pointer-events: none;
        }

        .btn-generate:hover:not(:disabled) {
          filter: brightness(1.15);
          box-shadow: 0 0 24px rgba(200, 155, 60, 0.5),
                      0 4px 12px rgba(0,0,0,0.4);
          transform: translateY(-1px);
        }

        .btn-generate:active:not(:disabled) {
          transform: translateY(1px);
          filter: brightness(0.95);
        }

        .btn-generate:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }

        .btn-generating-text {
          animation: dotdot 1s steps(4, end) infinite;
        }

        @keyframes dotdot {
          0%  { content: 'Consulting the Stars'; }
          33% { content: 'Consulting the Stars.'; }
          66% { content: 'Consulting the Stars..'; }
          100%{ content: 'Consulting the Stars...'; }
        }

        /* ── Copy Buttons ── */
        .copy-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }

        .btn-copy {
          font-family: 'Open Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #C89B3C;
          background: transparent;
          border: 1px solid rgba(200, 155, 60, 0.45);
          padding: 9px 18px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-copy:hover {
          background: rgba(200, 155, 60, 0.08);
          border-color: rgba(200, 155, 60, 0.75);
          box-shadow: 0 0 12px rgba(200, 155, 60, 0.15);
        }

        .btn-copy--secondary {
          color: #8A7045;
          border-color: rgba(138, 112, 69, 0.3);
        }

        .btn-copy--secondary:hover {
          color: #C89B3C;
          border-color: rgba(200, 155, 60, 0.5);
        }

        /* ── Pattern description ── */
        .pattern-desc {
          font-size: 12px;
          color: #4A3C28;
          text-align: center;
          letter-spacing: 0.02em;
        }

        .pattern-desc-label {
          color: #6A5030;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.1em;
          margin-right: 4px;
        }

        /* ── History ── */
        .history {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .history-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .history-rule {
          flex: 1;
          height: 1px;
          background: rgba(200, 155, 60, 0.15);
        }

        .history-title {
          font-family: 'Cinzel', serif;
          font-size: 11px;
          font-weight: 600;
          color: #5A4A30;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .history-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .history-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 14px;
          background: rgba(200, 155, 60, 0.02);
          border: 1px solid rgba(200, 155, 60, 0.08);
          cursor: pointer;
          transition: all 0.15s ease;
          border-radius: 1px;
        }

        .history-item:hover {
          background: rgba(200, 155, 60, 0.06);
          border-color: rgba(200, 155, 60, 0.2);
        }

        .history-name {
          font-family: 'Cinzel', serif;
          font-size: 14px;
          color: #9A7A3C;
          flex: 1;
        }

        .history-tag {
          font-size: 12px;
          color: #4A3C28;
          letter-spacing: 0.05em;
        }

        .history-copy-hint {
          font-size: 10px;
          color: #4A3C28;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .history-item:hover .history-copy-hint {
          opacity: 1;
        }

        /* ── Footer ── */
        .footer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .footer-rule {
          width: 100%;
          height: 1px;
          background: rgba(200, 155, 60, 0.08);
          margin-bottom: 6px;
        }

        .footer-stats {
          font-size: 11px;
          color: #4A3C28;
          letter-spacing: 0.05em;
          text-align: center;
        }

        .footer-disclaimer {
          font-size: 10px;
          color: #2E2418;
          letter-spacing: 0.03em;
          text-align: center;
        }

        .footer-legal {
          font-size: 10px;
          text-align: center;
          margin-top: 2px;
        }

        .footer-legal-link {
          color: #3A2E1E;
          text-decoration: none;
          letter-spacing: 0.03em;
          opacity: 0.6;
          transition: opacity 0.2s;
        }

        .footer-legal-link:hover {
          opacity: 1;
        }

        /* ── Responsive ── */
        @media (max-width: 480px) {
          .app {
            padding: 32px 16px 48px;
          }

          .panel {
            padding: 24px 16px;
          }

          .btn-generate {
            min-width: 220px;
            padding: 14px 28px;
          }

          .header-inner {
            gap: 10px;
          }
        }

      `}</style>
    </>
  );
}
