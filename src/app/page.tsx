"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// Inject global responsive styles once
const GLOBAL_CSS = `
  @media (max-width: 640px) {
    .unfs-nav-desktop { display: none !important; }
    .unfs-nav-hamburger { display: flex !important; }
    .unfs-register-sidebar { flex: 1 1 100% !important; min-width: 0 !important; display: flex; justify-content: center; margin-top: 16px; }
    .unfs-register-sidebar > div { width: 100%; max-width: 400px; }
  }
  @media (min-width: 641px) {
    .unfs-nav-desktop { display: flex !important; }
    .unfs-nav-hamburger { display: none !important; }
  }
  .unfs-mobile-drawer {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(15,31,48,0.98);
    backdrop-filter: blur(16px);
    z-index: 999;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 8px;
    transform: translateY(-100%);
    transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
  }
  .unfs-mobile-drawer.open { transform: translateY(0); }
`;


const COLORS = {
  navy: "#1B2F45",
  navyLight: "#243B56",
  gold: "#C8964A",
  goldLight: "#D4A95F",
  forest: "#2D5F3E",
  forestLight: "#3A7A50",
  linen: "#F5F0E8",
  cream: "#FAF7F2",
  charcoal: "#2C2C2C",
  warmGray: "#8B7D6B",
  white: "#FFFFFF",
};

const LOGO_URL =
  "https://i.imgur.com/placeholder.png"; // Will be replaced dynamically

const PHOTOS_2022 = [
  "https://lh3.googleusercontent.com/pw/AP1GczPzDAPwuj7QrAybtsPeYCzYPEgdaGnn5mJDzvq6XTz8Jcl8LIDKKZj0gDKYzt1ZHUnckoDcORrfjxu8ff6cHzIfWK0HTt72cC66oTAoIOfJpyyX-WlpB8I9BU2gYcMBsVaWhthPOgEP6ZAxygeVdF8gLw=w618-h824-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPEM0WaXWV1Kx_iuk68mCQ-hS2IOVl8OtyjuNabk3F_eD98xs4DGEmunE45_KzjB90O0ndg0oE-rWQmiAMEy-qrxsTijnHeGyv02XuuEu8KeNszA6Ze0lGoTN5Tk3iiyDNSE19T6r2wxlgtRoQmHvDGTA=w1099-h824-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMP8C2u-fQHoXKRGOHAceNN3Iajai2dEhNMf4MQtE1pwyGyS3KdhsUQqNFPrDo9Nsvs8trd2CXeEVoK478o4llpHmz6JdfLz-bUe1MAU0bpHfxCz4Kx06VDKw0mBJNoKHzA9o_CnweQsbPM_BtnshmfKQ=w1099-h824-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMScsObPiOHH2-nU341iuUcSCnY90Rxrh98rlZ_k1e3x1VkwLgewyOgwmCaWE-XGAgQi68b_JuzoLFgHlO9cYhB86hG7LmNbxuyqsxwuZYCPu3Il1ddIB24YaEcu0422M-s8iWCNjuX9ksC6a3sjduxXQ=w1099-h824-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczM7vPslKSN5kJi3ytJLQEgFBq5oVjtqCvu0eV5uHAnwUWe6SKHP71vfKuuSDzmdxl6_mTGU2GXGlotmx_7sHFhs1HRAgQRi6CtgiKBScXgc-Z2mhhC1bORk8HGx-8VRc-yz04qVKbo4OIMclN0UAUBkcg=w1099-h824-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMI_cCk8fH2HrgbSTo0LIXRm70BFFMmMOc9hi26JUqXEs3ZTRfqmX_-Ym4pGh6QlH2Qn5F47r_J-TOPSAwWJPaJE7t6UOYQGOsN-rN3Q9WJfU_94b9pKL67h87aeRFvUCTJi9bbQuheD0i6hEcqL9vV_g=w1099-h824-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPpjkszBZOALZLX8ngFpMZFTbYFKdAHOGRaCzhiaQqLt2tV22ivjqF7iMehITBaNcnyjyKKHo3Z_4JtUmZK2iNtl054N07o9ycD5C1EAD-fbiDoI99Y5e6AKvhXxLK54cQwgq2PMdKLs5PROU9vV9Rh3g=w1099-h824-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPsZIx4vM-aGWJi6jdYLbW9KwDKUzPiGsPaPDs-wTAlc0-wt4cnYXZVc9Y8V-kGKLyq5n3NFzrwmG7dD_QLYYfseYzr5ys-S4cQNe4TarJvH_buParX88koxnCHUBSUxEOhp2RnzttBKPmy_GCOwDeVhQ=w1099-h824-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMHO2rAU8U7E4AXoIq4D0-YjtR832Cj-hZ7YSyLQPPNTucRHeHD-Vt9BsO9CK8KrHz19wu5Qz5uLmXS1dV0p1pPNuGR7_g5vxGzEI2yH5dbSMtpDjCi7GClfBuRZTqAKRIrnEr7RcMchvNhVSXqrtPozA=w1099-h824-s-no-gm?authuser=0"
];

const PHOTOS_2023 = [
  "https://lh3.googleusercontent.com/pw/AP1GczPM0EKOTgEGOFCZlxiP_p0D6JptNS4znJXh5D0WFChn-59FN7BlF6OtPJ0FNy0aVUYskVYVX-D2ElHUXvryBqte06kAsVVoqijELDPOmUcZi1sqeKhRaCJDQ6beTG7cs1nHk1NnIxfU2bJGxXEEaA3cJQ=w1000-h666-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNJrx0XLQLRS_WSEbek2Slvtp2uSljn9uIGVPk1CaK_IH_3lhLrfN2Di_H7LoMgHJYcvxf2IoxHOyH5rj89xc7nFAV5RTRTqDSnKXhI0c2eOLHK1TxmO7C2GMLUi6NPBOCLGy1Dfejpm8IE3hMfZdbNKg=w1000-h666-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczObh__mphycO1_Z7gkLA9Ce1WEDYq2kPTaw_EI2AtInGxZyzPvdyhGBIuj8QQWP1eyZq10Je5LFliv7My5JCoKvR01LHqMJpgB2d434z5wz2AqxgyWN5bGPl7SpKz0kbje7kx_c7R-rrqJH5ZkFpUe7FA=w1000-h666-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMqiGRSorax8n1lty_aYBBpHWksVwWKQwP5mIEaW41x-DlhY7Zi4RlJeirlGzVfcV5Bx6uAznZX8XhzokSGi3lOWxj8N_zPbncMfp_22BYSUmV5A1yNqxxKyJXu5s5Ws72XWN4dHbVIVZiexWoK-rViYg=w1000-h666-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOMZdh7WHgx12YzEe1VuEtU4JDhot1LiUYNMqujBTxO1--mtjA98a-MNAqE7hiOcpaP8a20hqdlZv25YJYBmAJOwQE3XKnfsCCFOJ7ANRLTBSkyWuk06D7iUEEdfFENRCFLGAGcdUdOD3FYAOCMLnY-QQ=w1000-h666-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczP-lMPkFYhdRarYUnG9cutUDuhCnrYVF_hhSVV_BcInkoJ24rH8J3GelarYNyEx56YGIeIZGShOk67lv2gA89Tfdf0jHu9Vp4IE3oD4ZddxEZ4Wh-omimcrqT_OaLE1yqG6XsZLUaFQVT5ILfjIEwfphg=w1000-h666-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOrWs88-BCmnVusvHo-anGD_YYbS86j7SzwSBb2I9O0zj3eeG1-HDsKOaaNF6XoEZsj048nuFZ5sk3fbpSwwwndiw003wJvzjJGD62QnI359WYGyMVBfhaloZwvoNCyCIEq4160TJBDE1d7okGQiLtwZg=w1000-h819-s-no-gm?authuser=0"
];

const PHOTOS_2025 = [
  "https://lh3.googleusercontent.com/pw/AP1GczMnAns3RKcXnKwFqDA7AKCBvUOPm92J354cA5470Lnxoc29AGGwh3GKa0Ml9hMAWD_avn_gneqhUUFuH6xvHtCOcLVn1VVRuCce8BOAjVYnX_u19z9pLVocvnMiEptYB6qxPvgXGFc1q8r0YNqnX2Kp2Q=w1000-h666-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPOt9-yHzPHMDkHV3hGm4Y_MnEOs39JGTuQjfGpo12DujWpz-nRe6wCAbF3aCa_Ci4s9N-oBiNIIopWZMgwJkdLDTEFh3KeDz_zkmlsaKc8ZKN8yi-F70YgcK7qYUAB3D46wGQcE46_qxg-r3OLh2uh5A=w798-h968-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMRzn1d8e_TiKxZv8vh4qpGdXJFiJQqPqiwe9QcjPJlPJr9tQ7ueizV3JxUlnkkhiXoYPoq5ppGDo2LfrWr8qt_6jgHlvXDrHQ6CCVRHlAQSaz7lk3mfy8RJ2jILvqzVqZAWLvOJsMLrdG33zEmXO5fSw=w1080-h608-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczN6XUcpRWsJ5Hzh1rFIZA8on2Prm0XS641TmZtgj2SWdl8M9r45eFJqrEWT4ydM1LAzNwo4FdtJpAvVkStVRWTFf0MPnD3BE1nlMEo4SAMQk8coPC-ojfjGZpZW0Q24ANSeRAknSEvOcu_kKO_eL1kPxw=w1080-h810-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNCRXWTpfIssizU6PUt-61uoj8y9iwIekiBpmUjnpRKnwM5hFcBxmwkQTDrrkaoPX3E5pRSU4FKZPuEGlb3_3PWLfmiU2_i5oXScXtxoeGzgmnYEzLFQW_SpvalfYeI-Qea1uxWki1sUQpdqkoL-LbqeQ=w1080-h810-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOIKjeCtsNmnFyuFpX1llvwlmjelRV84sdXevq0RezFn8SaiVfRP2nX485SEccJ4zH-o3vb0fYXwbgm9ki7NYDyI6XaHs-_MBYzDXUQhADrurbUSpgCwPsNTMi_khQSprs2DgHkrssIopwMMWr3_UJiJQ=w726-h968-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOUxhhDw_M1i1fWQFuoZuhkl6rJnOZccNTeziGnGvsCiL2Vg1SVI1e1pm9A4IYDajt6bxGkxpjfO4jZzC6xNqPx79A02ZBLjw3lBvI9nGDU6-tr6m2ogzsjVM1TQqboVM1loiqyjenOmZUae2Fea2Qq-g=w1080-h810-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPukqlmbzyPKJYXGtg96qjJZe3iZuryNt_mS_EYQ1p6IJdLl8vgmmu1rMR-TpPq6IONnFOeLVBMZvxS2oRGB-y4hLI2FJ7GGh-edcUnar6GwVShniUUepVPgYtJMoC-gAPN2P3PG8iygCCUafnIxHw7vg=w1080-h810-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMmAghi4pcJIBGxnd4rDVXFWteUGCpesGmWfwO9d0NvEucNfaB2lv4uovoUjNhHtKjCDe_oT3dC2tIq65z-RoTzTHEj_GKnH00q4MeW_MZdERiizmbyzCV34RdyUSOFo6YmHO61OVn247vKsg0s6rvmSg=w726-h968-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczMcDRPTFyawoylpDKShfVWjygdMukgj2SO2OuJhUtT4IAfQKZsWOaH2L5kGQX8SUKgc4NfnngaGfIbvx0UA9vkpzZqu3W-7dzjEX2dt231ptdKA8ro4zCkj7XySDnPlavZgzzf_D8lJW-05B0crKD5jBg=w726-h968-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczNydm0kzfyr_Bqddh4kLfvuXTA4eV62RI0345TFGit3EI32ovzc7aEQ2meAuulZ01VIGhBgjOV9mq95vYoQyETe8Wewu49u67GYw1yOpojKF4V770-sG1LvkNPofZL2FibLCCwixZIXC8HQn5jbdTqHPg=w1080-h810-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczPbYa35YUPhMa6-gLcnw94qj7EIw9wd49LijKMZXD4VlDLORJ1kjj5lvrkmg1MGuNS0pfXzp3LhuBG19HZvhd1O7KhIPDg9rzalQ5ygus5g7UOLz8aFnX5ct61OAkRXETDwN5utbzBDAaAD25qgmIznaw=w1000-h666-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczOh2lZZWtj8mnRSUqyKDG1q34BXp-3-NVrdYXXIXMIl7NS7HfCkHa2QCyArKEH802o6CDRWeYmS_P3LQQIDg7eS_Bpf6WIkOxCtCj-JWUthoy4CyCqnxeuiW7Ms_BxMhqE1fdMI2bcg8hv34PTcZ7EiyQ=w1000-h666-s-no-gm?authuser=0",
  "https://lh3.googleusercontent.com/pw/AP1GczO4vhtFF3rOpZpiKPVXkoHiZaHKQLCFAVVpt9Q2xsoU5L9vTj6DO2I1zm3aZvPI3t6xg4Mme1fry4FGLktVnBiu2EUdDWnpV-tuRHREn9rTimAUv6l0YLKdlwBdrvgh4h9FKIcup-1--9EFGHr-k-5ykA=w1000-h666-s-no-gm?authuser=0"
];

// Topographic SVG pattern
const TopoPattern = ({ opacity = 0.04, color = "#fff" }: { opacity?: number; color?: string }) => (
  <svg
    width="100%"
    height="100%"
    style={{ position: "absolute", top: 0, left: 0, opacity, pointerEvents: "none", zIndex: 0 }}
  >
    <defs>
      <pattern id="topo" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
        <path d="M20 80 Q60 20 100 80 T180 80" fill="none" stroke={color} strokeWidth="1" />
        <path d="M10 120 Q50 60 90 120 T170 120" fill="none" stroke={color} strokeWidth="0.8" />
        <path d="M30 160 Q70 100 110 160 T190 160" fill="none" stroke={color} strokeWidth="0.6" />
        <path d="M0 40 Q40 -10 80 40 T160 40" fill="none" stroke={color} strokeWidth="0.5" />
        <circle cx="150" cy="50" r="20" fill="none" stroke={color} strokeWidth="0.4" />
        <circle cx="150" cy="50" r="35" fill="none" stroke={color} strokeWidth="0.3" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#topo)" />
  </svg>
);

const Counter = ({ end, label, suffix = "" }: { end: number; label: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          let start = 0;
          const duration = 1500;
          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);
  return (
    <div ref={ref} style={{ textAlign: "center", flex: 1, minWidth: 140 }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 52, fontWeight: 900, color: COLORS.gold, lineHeight: 1 }}>
        {count}{suffix}
      </div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginTop: 8 }}>
        {label}
      </div>
    </div>
  );
};

const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid rgba(27,47,69,0.1)`, cursor: "pointer", userSelect: "none" }} onClick={() => setOpen(!open)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0" }}>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 600, color: COLORS.navy }}>{q}</span>
        <span style={{ fontSize: 24, color: COLORS.gold, transition: "transform 0.3s", transform: open ? "rotate(45deg)" : "rotate(0deg)", flexShrink: 0, marginLeft: 16 }}>+</span>
      </div>
      <div style={{ maxHeight: open ? 300 : 0, overflow: "hidden", transition: "max-height 0.4s ease", paddingBottom: open ? 16 : 0 }}>
        <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 15, color: COLORS.warmGray, lineHeight: 1.7, margin: 0 }}>{a}</p>
      </div>
    </div>
  );
};

const DayCard = ({ day, title, items, accent }: { day: string; title: string; items: string[]; accent: string }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      style={{ background: COLORS.white, borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 20px rgba(0,0,0,0.06)", border: `1px solid rgba(0,0,0,0.04)`, transition: "transform 0.3s, box-shadow 0.3s" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 20px rgba(0,0,0,0.06)"; }}
    >
      <div style={{ background: accent, padding: "16px 24px", display: "flex", alignItems: "baseline", gap: 12 }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: COLORS.white }}>{day}</span>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.85)" }}>{title}</span>
      </div>
      <div style={{ padding: "16px 24px" }}>
        {items.slice(0, expanded ? items.length : 3).map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < (expanded ? items.length : 3) - 1 ? "1px solid rgba(0,0,0,0.05)" : "none" }}>
            <span style={{ color: accent, fontWeight: 700, fontSize: 13, fontFamily: "'Barlow Condensed', sans-serif", minWidth: 20 }}>{String(i + 1).padStart(2, "0")}</span>
            <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: 14, color: COLORS.charcoal, lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
        {items.length > 3 && (
          <button onClick={() => setExpanded(!expanded)} style={{ background: "none", border: "none", color: accent, cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, padding: "12px 0 4px", display: "flex", alignItems: "center", gap: 6 }}>
            {expanded ? "Show Less" : `Show All ${items.length} Activities`}
            <span style={{ transition: "transform 0.3s", transform: expanded ? "rotate(180deg)" : "rotate(0)", display: "inline-block" }}>▼</span>
          </button>
        )}
      </div>
    </div>
  );
};

const PillarCard = ({ icon, title, items }: { icon: string; title: string; items: string[] }) => (
  <div
    style={{ background: COLORS.white, borderRadius: 12, padding: "32px 24px", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.04)", flex: "1 1 220px", minWidth: 220, transition: "transform 0.3s" }}
    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-6px)"}
    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
  >
    <div style={{ fontSize: 36, marginBottom: 16 }}>{icon}</div>
    <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700, color: COLORS.navy, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 12px" }}>{title}</h3>
    {items.map((item, i) => (
      <p key={i} style={{ fontFamily: "'Source Serif 4', serif", fontSize: 14, color: COLORS.warmGray, lineHeight: 1.6, margin: "6px 0" }}>{item}</p>
    ))}
  </div>
);

export default function UNFSWebsite() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileNav, setMobileNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", attendees: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [logoSrc, setLogoSrc] = useState("");
  
  // Gallery Modal State
  const [galleryYear, setGalleryYear] = useState<string | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Barlow+Condensed:wght@400;500;600;700&family=Source+Serif+4:wght@300;400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    // Use the base64 logo from the original code
    setLogoSrc("/logo.png");
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-slide effect for gallery
  useEffect(() => {
    let interval: any;
    if (galleryYear) {
      const activePhotos = galleryYear === "2022" ? PHOTOS_2022 : galleryYear === "2023" ? PHOTOS_2023 : PHOTOS_2025;
      interval = setInterval(() => {
        setGalleryIndex((prev) => (prev + 1) % activePhotos.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [galleryYear]);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navItems = [
    { id: "about", label: "About" },
    { id: "retreat", label: "The Retreat" },
    { id: "gallery", label: "Gallery" },
    { id: "register", label: "Register" },
    { id: "donate", label: "Donate" },
    { id: "faq", label: "FAQs" },
    { id: "contact", label: "Contact" },
  ];

  const sectionBg = (bg = COLORS.cream) => ({ padding: "80px 24px", background: bg, position: "relative" as const, overflow: "hidden" });
  const container = { maxWidth: 1100, margin: "0 auto", position: "relative" as const, zIndex: 1 };

  const sectionTitle = (pre: string, main: string) => (
    <div style={{ marginBottom: 48, textAlign: "center" }}>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: 4, textTransform: "uppercase" as const, color: COLORS.gold, marginBottom: 8, fontWeight: 600 }}>{pre}</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 900, color: COLORS.navy, margin: 0, lineHeight: 1.2 }}>{main}</h2>
      <div style={{ width: 60, height: 3, background: COLORS.gold, margin: "16px auto 0", borderRadius: 2 }} />
    </div>
  );

  const btn = (primary = true) => ({
    display: "inline-block", padding: "14px 32px", borderRadius: 6, cursor: "pointer",
    fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 600, letterSpacing: 2,
    textTransform: "uppercase" as const, border: primary ? "none" : `2px solid ${COLORS.white}`,
    background: primary ? COLORS.gold : "transparent", color: COLORS.white,
    transition: "all 0.3s",
  });

  const inp = {
    width: "100%", padding: "14px 16px", borderRadius: 8, border: `1px solid rgba(27,47,69,0.15)`,
    fontFamily: "'Source Serif 4', serif", fontSize: 15, color: COLORS.charcoal,
    background: COLORS.white, outline: "none", boxSizing: "border-box" as const, transition: "border-color 0.3s",
  };

  return (
    <div style={{ fontFamily: "'Source Serif 4', serif", color: COLORS.charcoal, background: COLORS.cream, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{GLOBAL_CSS}</style>

      {/* Mobile Drawer */}
      <div className={`unfs-mobile-drawer${mobileNav ? " open" : ""}`}>
        <button onClick={() => setMobileNav(false)} style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", cursor: "pointer", color: COLORS.white, fontSize: 28, lineHeight: 1 }}>✕</button>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: COLORS.gold, marginBottom: 24, opacity: 0.7 }}>Navigation</div>
        {navItems.map(item => (
          <button key={item.id} onClick={() => scrollTo(item.id)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: COLORS.white, padding: "8px 0", letterSpacing: 0.5, transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = COLORS.gold}
            onMouseLeave={e => e.currentTarget.style.color = COLORS.white}>
            {item.label}
          </button>
        ))}
        <button onClick={() => scrollTo("register")} style={{ marginTop: 24, background: COLORS.gold, border: "none", borderRadius: 6, color: COLORS.white, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", padding: "14px 32px", cursor: "pointer" }}>Register for 2026</button>
      </div>

      {/* Gallery Modal Overlay */}
      {galleryYear && (() => {
        const activePhotos = galleryYear === "2022" ? PHOTOS_2022 : galleryYear === "2023" ? PHOTOS_2023 : PHOTOS_2025;
        const title = galleryYear === "2022" ? "The Beginning • 2022 Retreat" : galleryYear === "2023" ? "Growing Strong • 2023 Retreat" : "On The Wheel • 2025 Retreat";
        return (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000, background: "rgba(15,31,48,0.95)", backdropFilter: "blur(8px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <button onClick={() => setGalleryYear(null)} style={{ position: "absolute", top: 24, right: 32, background: "none", border: "none", color: COLORS.white, fontSize: 36, cursor: "pointer", zIndex: 2001 }}>✕</button>
            
            <div style={{ width: "90%", maxWidth: 1000, height: "75vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* Using Next Image for optimized rendering, unoptimized to allow external Google urls without config */}
              <Image 
                src={activePhotos[galleryIndex]} 
                alt={`UNFS ${galleryYear} Retreat Photo ${galleryIndex + 1}`} 
                fill 
                unoptimized
                style={{ objectFit: "contain", transition: "opacity 0.4s ease" }}
              />
            </div>
            
            <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap", justifyContent: "center", maxWidth: "80%" }}>
              {activePhotos.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setGalleryIndex(i)}
                  style={{ width: 12, height: 12, borderRadius: "50%", padding: 0, border: "none", background: i === galleryIndex ? COLORS.gold : "rgba(255,255,255,0.3)", cursor: "pointer", transition: "background 0.3s" }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "white", marginTop: 16, letterSpacing: 2, textTransform: "uppercase" }}>
              {title}
            </div>
          </div>
        );
      })()}

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: scrolled ? "rgba(27,47,69,0.97)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", transition: "all 0.4s", padding: scrolled ? "10px 24px" : "16px 24px", borderBottom: scrolled ? `1px solid rgba(200,150,74,0.2)` : "none" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div onClick={() => scrollTo("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", border: `2px solid ${COLORS.gold}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700, color: COLORS.gold }}>U</div>
            <div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, color: COLORS.white, letterSpacing: 2, lineHeight: 1.1 }}>UNFS</div>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 10, color: COLORS.goldLight, letterSpacing: 1 }}>FOUNDATION</div>
            </div>
          </div>

          {/* Desktop links */}
          <div className="unfs-nav-desktop" style={{ gap: 4, alignItems: "center", flexWrap: "wrap" }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => scrollTo(item.id)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", color: activeSection === item.id ? COLORS.gold : "rgba(255,255,255,0.75)", padding: "8px 10px", transition: "color 0.3s" }}>
                {item.label}
              </button>
            ))}
          </div>

          {/* Hamburger button (mobile) */}
          <button className="unfs-nav-hamburger" onClick={() => setMobileNav(true)} style={{ background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: 5, padding: 4 }} aria-label="Open navigation">
            <span style={{ display: "block", width: 24, height: 2, background: COLORS.white, borderRadius: 2 }} />
            <span style={{ display: "block", width: 24, height: 2, background: COLORS.white, borderRadius: 2 }} />
            <span style={{ display: "block", width: 16, height: 2, background: COLORS.gold, borderRadius: 2 }} />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(160deg, ${COLORS.navy} 0%, #0F1F30 50%, #162D42 100%)`, position: "relative", overflow: "hidden", padding: "120px 24px 80px" }}>
        <TopoPattern opacity={0.06} />
        <div style={{ position: "absolute", top: "10%", right: "-5%", width: 400, height: 400, borderRadius: "50%", border: `1px solid rgba(200,150,74,0.08)` }} />
        <div style={{ position: "absolute", bottom: "5%", left: "-8%", width: 500, height: 500, borderRadius: "50%", border: `1px solid rgba(200,150,74,0.05)` }} />
        <div style={{ position: "absolute", top: "50%", right: "15%", width: 8, height: 8, borderRadius: "50%", background: COLORS.gold, opacity: 0.3 }} />
        <div style={{ position: "absolute", top: "30%", left: "10%", width: 4, height: 4, borderRadius: "50%", background: COLORS.gold, opacity: 0.2 }} />

        <div style={{ textAlign: "center", position: "relative", zIndex: 1, maxWidth: 800 }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: 6, textTransform: "uppercase", color: COLORS.gold, marginBottom: 24, fontWeight: 600 }}>
            Est. 2022 &nbsp;·&nbsp; Fredericksburg, VA
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 7vw, 72px)", fontWeight: 900, color: COLORS.white, lineHeight: 1.05, margin: "0 0 8px", letterSpacing: -1 }}>
            Uncle Nephew<br />Father Son
          </h1>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 500, color: COLORS.gold, letterSpacing: 4, textTransform: "uppercase", margin: "16px 0 32px" }}>
            FOUNDATION
          </div>
          <div style={{ width: 180, height: 180, borderRadius: 16, margin: "0 auto 28px", boxShadow: "0 8px 40px rgba(0,0,0,0.4)", border: `2px solid rgba(200,150,74,0.3)`, overflow: "hidden", position: "relative" }}>
            <Image src="/unfs-logo.png" alt="UNFS Foundation Logo" fill style={{ objectFit: "cover" }} priority />
          </div>
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 18, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 40px" }}>
            Empowering young men to reach their full potential through mentorship, brotherhood, and the timeless principles of manhood.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => scrollTo("register")} style={btn(true)} onMouseEnter={e => e.currentTarget.style.background = COLORS.goldLight} onMouseLeave={e => e.currentTarget.style.background = COLORS.gold}>Register for 2026</button>
            <button onClick={() => scrollTo("about")} style={btn(false)} onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>Our Mission</button>
          </div>
          <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 14, fontStyle: "italic", color: COLORS.gold, marginTop: 48, opacity: 0.8, letterSpacing: 1 }}>
            "UNFS: On The Wheel"
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: `linear-gradient(135deg, ${COLORS.forest} 0%, ${COLORS.forestLight} 100%)`, padding: "48px 24px", position: "relative" }}>
        <TopoPattern opacity={0.05} />
        <div style={{ ...container, display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
          <Counter end={4} label="Years Strong" />
          <Counter end={50} label="Attendees Annually" suffix="+" />
          <Counter end={1} label="Powerful Weekend" />
          <Counter end={3} label="Generations United" />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={sectionBg()}>
        <div style={container}>
          {sectionTitle("Our Story", "About UNFS Foundation")}
          <div style={{ background: COLORS.white, borderLeft: `4px solid ${COLORS.gold}`, borderRadius: "0 12px 12px 0", padding: "32px 36px", marginBottom: 48, boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: COLORS.gold, marginBottom: 12, fontWeight: 600 }}>Our Mission</div>
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 17, color: COLORS.charcoal, lineHeight: 1.8, margin: 0, fontStyle: "italic" }}>
              The Uncle Nephew Father Son (UNFS) Mentoring Program empowers young men to reach their full potential by providing positive male role models from their family and community. We nurture responsible, respectful, and resilient individuals by teaching timeless principles of manhood, breaking down stereotypes, and fostering a robust, productive future for the next generation.
            </p>
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: 4, textTransform: "uppercase", color: COLORS.gold, marginBottom: 24, fontWeight: 600, textAlign: "center" }}>Program Pillars</div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 48 }}>
            <PillarCard icon="📚" title="Educational Enrichment" items={["College preparation & career exposure", "Leadership development & skill-building"]} />
            <PillarCard icon="🤝" title="Mentorship & Guidance" items={["One-on-one mentoring with positive role models", "Communication skills & conflict resolution"]} />
            <PillarCard icon="🛡️" title="Safety & Awareness" items={["Navigating interactions with authority", "Understanding rights & responsibilities"]} />
            <PillarCard icon="⚽" title="Athletic Excellence" items={["Team cohesion & sportsmanship", "Leadership through athletic participation"]} />
            <PillarCard icon="🏘️" title="Community Citizenship" items={["Promoting unity through initiative", "Active community engagement"]} />
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: 4, textTransform: "uppercase", color: COLORS.gold, marginBottom: 24, fontWeight: 600, textAlign: "center" }}>Core Beliefs</div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              { num: "01", title: "Mentorship Is Essential", desc: "Positive male role models help boys develop integrity, respect, accountability, and emotional intelligence. Boys need to feel supported, listened to, and valued." },
              { num: "02", title: "Safe, Non-Judgmental Spaces", desc: "UNFS creates circles where young men can share openly without fear of judgment, building trust and helping them process emotions and build stronger relationships." },
              { num: "03", title: "Accountability & Positive Masculinity", desc: "Being a good man means integrity, respect, responsibility, and compassion. We redefine masculinity to include emotional awareness and breaking negative cycles." },
            ].map((item, i) => (
              <div key={i} style={{ flex: "1 1 300px", minWidth: 280, padding: "28px 24px", background: COLORS.white, borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, color: `rgba(27,47,69,0.08)`, marginBottom: 8 }}>{item.num}</div>
                <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 17, fontWeight: 700, color: COLORS.navy, margin: "0 0 8px" }}>{item.title}</h4>
                <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 14, color: COLORS.warmGray, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RETREAT */}
      <section id="retreat" style={sectionBg(COLORS.linen)}>
        <div style={container}>
          {sectionTitle("June 2026 · Fredericksburg, VA", "The Retreat")}
          <div style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})`, borderRadius: 16, padding: "36px 32px", marginBottom: 48, position: "relative", overflow: "hidden" }}>
            <TopoPattern opacity={0.06} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: COLORS.gold, fontWeight: 600, marginBottom: 8 }}>Location</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: COLORS.white, margin: "0 0 8px" }}>Wilderness Presidential Resort</h3>
              <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 15, color: "rgba(255,255,255,0.7)", margin: "0 0 16px" }}>Fredericksburg, Virginia</p>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {[["When", "3rd Weekend in June"], ["Duration", "Thursday – Sunday"], ["Attendance", "50–60 Attendees"]].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, color: COLORS.gold, letterSpacing: 2, textTransform: "uppercase" }}>{l}</div>
                    <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 15, color: COLORS.white }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: 4, textTransform: "uppercase", color: COLORS.gold, marginBottom: 24, fontWeight: 600, textAlign: "center" }}>Weekend Schedule</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            <DayCard day="THU" title="Travel Day" accent={COLORS.navy} items={["Cabin inventory & inspection", "1700 HRS – Resort orientation, Meet & Greet", "Introduce yourselves, tell your story", "Fix your own dinners upon arriving"]} />
            <DayCard day="FRI" title="Orientation Day" accent={COLORS.forest} items={["0800 HRS – Individual cabins breakfast & orientation", "Intro Kickboxing with Merrick Lee", "Plan your own activities", "1800 HRS – Pot Luck food preparation", "1900 HRS – Meal blessings and serve", "Roll call and attendance", "Discussion Chat-It-Up UTC"]} />
            <DayCard day="SAT" title="Team Activity Day" accent={COLORS.gold} items={["0600 HRS – Fishing (VA license required)", "0800 HRS – Individual cabins breakfast", "WEAR YOUR TEE SHIRTS DAY", "0930 HRS – Team & individual activities", "Swimming, Archery, Basketball, Soccer", "Horseshoe, Obstacle Course, Mini-Golf", "1700 HRS – BBQ Grill Master food prep", "1900 HRS – Meal blessings & serve", "2000 HRS – Discussion Chat-It-Up UTC"]} />
            <DayCard day="SUN" title="Check-Out Day" accent={COLORS.warmGray} items={["0800 HRS – Cold breakfast / leftovers", "Cabin inventory & appliance check", "0900 HRS – Clean up & pack", "0930 HRS – After Action Report (AAR)", "1000 HRS – Registration check-out", "Continue enjoying resort activities after checkout"]} />
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 40, flexWrap: "wrap" }}>
            {[{ icon: "🎣", title: "Fishing", desc: "Early morning fishing on Saturday with LT." }, { icon: "🔥", title: "After-Supper Talks", desc: "Evening discussions where generations connect, share wisdom, and build lasting bonds." }].map((t, i) => (
              <div key={i} style={{ flex: "1 1 280px", background: COLORS.white, borderRadius: 12, padding: "24px 28px", display: "flex", gap: 16, alignItems: "flex-start", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: 32, flexShrink: 0 }}>{t.icon}</div>
                <div>
                  <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 17, fontWeight: 700, color: COLORS.navy, margin: "0 0 6px" }}>{t.title}</h4>
                  <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 14, color: COLORS.warmGray, lineHeight: 1.6, margin: 0 }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" style={sectionBg()}>
        <div style={container}>
          {sectionTitle("Memories", "Photo Gallery")}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {[
              { year: "2025", label: "On The Wheel", color: COLORS.warmGray, span: 2 },
              { year: "2023", label: "Growing Strong", color: COLORS.forest, span: 1 },
              { year: "2022", label: "The Beginning", color: COLORS.navy, span: 1 }
            ].map((item, i) => {
              const hasPhotos = item.year === "2022" || item.year === "2023" || item.year === "2025";
              return (
              <div key={i} onClick={() => { if (hasPhotos) { setGalleryIndex(0); setGalleryYear(item.year); } }} style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`, borderRadius: 12, aspectRatio: item.span === 2 ? "1.5/1" : "1/1", gridColumn: `span ${item.span}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", cursor: hasPhotos ? "pointer" : "default", transition: "transform 0.3s" }} onMouseEnter={e => { if (hasPhotos) e.currentTarget.style.transform = "scale(1.02)" }} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                <TopoPattern opacity={0.08} />
                <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 900, color: "rgba(255,255,255,0.15)" }}>{item.year}</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{item.label}</div>
                  {hasPhotos && <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, color: COLORS.gold, marginTop: 8, letterSpacing: 1, textTransform: "uppercase" }}>Click to view photos</div>}
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* REGISTER */}
      <section id="register" style={sectionBg(COLORS.linen)}>
        <div style={container}>
          {sectionTitle("Join Us", "Register for 2026")}
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap", alignItems: "flex-start" }}>
            <div style={{ flex: "1 1 420px", minWidth: 300 }}>
              {formSubmitted ? (
                <div style={{ background: COLORS.white, borderRadius: 16, padding: "48px 32px", textAlign: "center", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: COLORS.navy, margin: "0 0 12px" }}>You&apos;re Registered!</h3>
                  <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 15, color: COLORS.warmGray }}>We&apos;ll be in touch with more details as the retreat approaches.</p>
                </div>
              ) : (
                <div style={{ background: COLORS.white, borderRadius: 16, padding: "36px 32px", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
                  {[{ label: "Full Name", key: "name", type: "text", placeholder: "Your full name" }, { label: "Email", key: "email", type: "email", placeholder: "your@email.com" }, { label: "Phone", key: "phone", type: "tel", placeholder: "(555) 555-5555" }, { label: "Number of Attendees", key: "attendees", type: "number", placeholder: "How many in your group?" }].map((field, i) => (
                    <div key={i} style={{ marginBottom: 20 }}>
                      <label style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: COLORS.navy, display: "block", marginBottom: 6 }}>{field.label}</label>
                      <input type={field.type} placeholder={field.placeholder} value={formData[field.key as keyof typeof formData]} onChange={e => setFormData({ ...formData, [field.key]: e.target.value })} style={inp} onFocus={e => e.target.style.borderColor = COLORS.gold} onBlur={e => e.target.style.borderColor = "rgba(27,47,69,0.15)"} />
                    </div>
                  ))}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: COLORS.navy, display: "block", marginBottom: 6 }}>Special Needs / Dietary Restrictions</label>
                    <textarea rows={3} placeholder="Anything we should know?" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} style={{ ...inp, resize: "vertical" }} onFocus={e => e.target.style.borderColor = COLORS.gold} onBlur={e => e.target.style.borderColor = "rgba(27,47,69,0.15)"} />
                  </div>
                  <button onClick={() => setFormSubmitted(true)} style={{ ...btn(true), width: "100%", textAlign: "center", padding: "16px 32px", fontSize: 16 }} onMouseEnter={e => e.currentTarget.style.background = COLORS.goldLight} onMouseLeave={e => e.currentTarget.style.background = COLORS.gold}>Submit Registration</button>
                </div>
              )}
            </div>
            <div style={{ flex: "0 1 300px", minWidth: 260 }}>
              <div style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})`, borderRadius: 16, padding: "32px 28px", position: "relative", overflow: "hidden" }}>
                <TopoPattern opacity={0.06} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, letterSpacing: 3, textTransform: "uppercase", color: COLORS.gold, fontWeight: 600, margin: "0 0 20px" }}>Event Details</h4>
                  {[["When", "3rd Weekend, June 2026"], ["Where", "Wilderness Presidential Resort, Fredericksburg, VA"], ["Duration", "Thursday – Sunday"], ["Who", "Uncles, nephews, fathers, sons & mentors"]].map(([l, v]) => (
                    <div key={l} style={{ marginBottom: 16 }}>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: COLORS.gold }}>{l}</div>
                      <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 15, color: COLORS.white, lineHeight: 1.5 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DONATE */}
      <section id="donate" style={{ ...sectionBg(), background: `linear-gradient(160deg, ${COLORS.navy} 0%, #0F1F30 100%)` }}>
        <TopoPattern opacity={0.05} />
        <div style={container}>
          <div style={{ marginBottom: 48, textAlign: "center" }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, letterSpacing: 4, textTransform: "uppercase", color: COLORS.gold, marginBottom: 8, fontWeight: 600 }}>Make an Impact</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 900, color: COLORS.white, margin: 0 }}>Support UNFS</h2>
            <div style={{ width: 60, height: 3, background: COLORS.gold, margin: "16px auto 0", borderRadius: 2 }} />
          </div>
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 17, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}>
            Your generous support helps us provide mentoring, activities, and resources to young men who need it most. Every dollar goes directly toward creating transformative experiences.
          </p>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
            {[{ amount: "$25", label: "Supplies weekend materials" }, { amount: "$100", label: "Sponsors a cabin for the retreat" }, { amount: "$250", label: "Funds a full scholarship attendee" }, { amount: "$500", label: "Become a Title Sponsor" }].map((tier, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: `1px solid rgba(200,150,74,0.2)`, borderRadius: 12, padding: "28px 24px", textAlign: "center", width: 200, cursor: "pointer", transition: "all 0.3s" }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(200,150,74,0.1)"; e.currentTarget.style.borderColor = COLORS.gold; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(200,150,74,0.2)"; }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, color: COLORS.gold }}>{tier.amount}</div>
                <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 14, color: "rgba(255,255,255,0.6)", margin: "8px 0 0", lineHeight: 1.5 }}>{tier.label}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button style={btn(true)} onMouseEnter={e => e.currentTarget.style.background = COLORS.goldLight} onMouseLeave={e => e.currentTarget.style.background = COLORS.gold}>Donate Now</button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={sectionBg()}>
        <div style={{ ...container, maxWidth: 720 }}>
          {sectionTitle("Questions?", "Frequently Asked")}
          <FAQItem q="Who can attend the UNFS retreat?" a="The retreat is designed for uncles, nephews, fathers, sons, and positive male mentors from the family and community. All generations are welcome." />
          <FAQItem q="What is the cost to attend?" a="Costs vary each year and cover cabin accommodations and shared meals. Contact us for the latest pricing and scholarship opportunities." />
          <FAQItem q="What should I bring?" a="Bring comfortable outdoor clothing, personal toiletries, a sleeping bag or linens if preferred, and a VA state fishing license if you plan to fish Saturday morning. Don't forget your UNFS tee shirt!" />
          <FAQItem q="What if it rains during the weekend?" a="The Wilderness Presidential Resort has plenty of indoor facilities. We adapt the schedule with indoor activities, breakout sessions, and extended discussion time." />
          <FAQItem q="Can I attend for just one day?" a="Yes! While the full weekend experience is recommended, you're welcome to join for individual days. Please let us know in advance when registering." />
          <FAQItem q="Is the retreat safe for younger children?" a="Safety is a top priority. All activities are supervised, and the resort is a family-friendly environment." />
          <FAQItem q="How do I get to the Wilderness Presidential Resort?" a="The resort is located in Fredericksburg, VA, accessible by car. Detailed directions and travel tips will be shared after registration." />
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={sectionBg(COLORS.linen)}>
        <div style={container}>
          {sectionTitle("Get in Touch", "Contact Us")}
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 400px", minWidth: 300 }}>
              {contactSubmitted ? (
                <div style={{ background: COLORS.white, borderRadius: 16, padding: "48px 32px", textAlign: "center", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: COLORS.navy, margin: "0 0 12px" }}>Message Sent!</h3>
                  <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 15, color: COLORS.warmGray }}>We&apos;ll get back to you as soon as possible.</p>
                </div>
              ) : (
                <div style={{ background: COLORS.white, borderRadius: 16, padding: "36px 32px", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
                  {[{ label: "Name", placeholder: "Your name", type: "text" }, { label: "Email", placeholder: "your@email.com", type: "email" }, { label: "Subject", placeholder: "What's this about?", type: "text" }].map((f, i) => (
                    <div key={i} style={{ marginBottom: 20 }}>
                      <label style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: COLORS.navy, display: "block", marginBottom: 6 }}>{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder} style={inp} onFocus={e => e.target.style.borderColor = COLORS.gold} onBlur={e => e.target.style.borderColor = "rgba(27,47,69,0.15)"} />
                    </div>
                  ))}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: COLORS.navy, display: "block", marginBottom: 6 }}>Message</label>
                    <textarea rows={4} placeholder="Your message..." style={{ ...inp, resize: "vertical" }} onFocus={e => e.target.style.borderColor = COLORS.gold} onBlur={e => e.target.style.borderColor = "rgba(27,47,69,0.15)"} />
                  </div>
                  <button onClick={() => setContactSubmitted(true)} style={{ ...btn(true), width: "100%", textAlign: "center", padding: "16px 32px" }} onMouseEnter={e => e.currentTarget.style.background = COLORS.goldLight} onMouseLeave={e => e.currentTarget.style.background = COLORS.gold}>Send Message</button>
                </div>
              )}
            </div>
            <div style={{ flex: "0 1 300px", minWidth: 260 }}>
              <div style={{ marginBottom: 32 }}>
                <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, letterSpacing: 3, textTransform: "uppercase", color: COLORS.gold, fontWeight: 600, margin: "0 0 16px" }}>Reach Out Directly</h4>
                <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 15, color: COLORS.charcoal, lineHeight: 1.8, margin: 0 }}>
                  <strong>Ray Brown</strong> &amp; <strong>Merrick Lee</strong><br />UNFS Foundation Organizers
                </p>
              </div>
              <div style={{ marginBottom: 32 }}>
                <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, letterSpacing: 3, textTransform: "uppercase", color: COLORS.gold, fontWeight: 600, margin: "0 0 16px" }}>Connect With Us</h4>
                <button style={{ display: "flex", alignItems: "center", gap: 10, background: "#25D366", color: COLORS.white, border: "none", borderRadius: 8, padding: "12px 20px", cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: 1 }}>
                  💬 Join Our WhatsApp Group
                </button>
              </div>
              <div>
                <h4 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, letterSpacing: 3, textTransform: "uppercase", color: COLORS.gold, fontWeight: 600, margin: "0 0 16px" }}>Stay Updated</h4>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <input placeholder="Your email" style={{ ...inp, flex: 1, padding: "10px 12px", fontSize: 14 }} onFocus={e => e.target.style.borderColor = COLORS.gold} onBlur={e => e.target.style.borderColor = "rgba(27,47,69,0.15)"} />
                  <button style={{ background: COLORS.navy, color: COLORS.white, border: "none", borderRadius: 8, padding: "10px 16px", cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>Go</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: COLORS.navy, padding: "40px 24px", borderTop: `1px solid rgba(200,150,74,0.15)` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, color: COLORS.white, letterSpacing: 3 }}>UNFS Foundation</div>
            <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4, fontStyle: "italic" }}>"UNFS: On The Wheel"</div>
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => scrollTo(item.id)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", padding: 0, transition: "color 0.3s" }} onMouseEnter={e => e.currentTarget.style.color = COLORS.gold} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
                {item.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
              © {new Date().getFullYear()} UNFS Foundation. All rights reserved.
            </div>
            <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
              Powered by <a href="https://croesave.com" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.gold, textDecoration: "none", transition: "opacity 0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity = "0.8"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>Croes Ave</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
