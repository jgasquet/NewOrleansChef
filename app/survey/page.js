'use client';

import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// COMPLETE RECIPE DATABASE - From "Healthy New Orleans Cuisine"
// by Chef Mark C. Gasquet + Classic NOLA Dishes
// ═══════════════════════════════════════════════════════════════
const RECIPES = [
  // ── Appetizers (4) ──
  { id: 2, name: "Oysters Rockefeller", category: "Appetizers", taste: ["briny","rich","aromatic"], spice: 0, cuisine: ["creole","french"], emoji: "🦪", desc: "Antoine's legendary baked oysters with spinach and Pernod" },
  { id: 5, name: "Caponata with Garlic Crostini", category: "Appetizers", taste: ["tangy","savory","fresh"], spice: 0, cuisine: ["creole","french"], emoji: "🍆", desc: "Sicilian-inspired eggplant spread on crispy toast" },
  { id: 6, name: "BBQ Shrimp", category: "Appetizers", taste: ["rich","savory","spicy"], spice: 2, cuisine: ["creole"], emoji: "🍤", desc: "New Orleans-style butter-bathed peppery shrimp" },
  { id: 7, name: "Muffuletta", category: "Appetizers", taste: ["savory","tangy","rich"], spice: 1, cuisine: ["creole"], emoji: "🥪", desc: "Central Grocery's iconic olive salad sandwich" },

  // ── Soups & Gumbos (3) ──
  { id: 10, name: "Seafood Gumbo", category: "Soups & Gumbos", taste: ["savory","smoky","rich"], spice: 2, cuisine: ["creole","cajun"], emoji: "🍲", desc: "Dark roux gumbo with shrimp, crab, and okra" },
  { id: 11, name: "Chicken & Sausage Gumbo", category: "Soups & Gumbos", taste: ["savory","smoky","earthy"], spice: 2, cuisine: ["cajun"], emoji: "🍲", desc: "Classic Cajun gumbo with andouille and dark roux" },
  { id: 13, name: "Crawfish Bisque", category: "Soups & Gumbos", taste: ["rich","savory","aromatic"], spice: 2, cuisine: ["creole","cajun"], emoji: "🦞", desc: "Velvety crawfish soup with stuffed heads" },

  // ── Seafood Entrées (8) ──
  { id: 20, name: "Shrimp Creole", category: "Seafood Entrées", taste: ["tangy","savory","spicy"], spice: 2, cuisine: ["creole"], emoji: "🍤", desc: "Gulf shrimp in spicy Creole tomato sauce" },
  { id: 22, name: "Crawfish Étouffée", category: "Seafood Entrées", taste: ["rich","savory","earthy"], spice: 2, cuisine: ["cajun"], emoji: "🦞", desc: "Louisiana crawfish tails in butter-roux heaven" },
  { id: 25, name: "Blackened Redfish", category: "Seafood Entrées", taste: ["smoky","spicy","savory"], spice: 3, cuisine: ["cajun"], emoji: "🐟", desc: "Chef Prudhomme's legendary cast-iron creation" },
  { id: 27, name: "Pompano en Papillote", category: "Seafood Entrées", taste: ["rich","aromatic","fresh"], spice: 0, cuisine: ["creole","french"], emoji: "📜", desc: "Gulf pompano baked in parchment with crabmeat" },
  { id: 28, name: "Creole Crab Cakes", category: "Seafood Entrées", taste: ["savory","briny","fresh"], spice: 1, cuisine: ["creole"], emoji: "🦀", desc: "Lump crabmeat cakes with Creole tartar sauce" },
  { id: 31, name: "Trout Amandine", category: "Seafood Entrées", taste: ["rich","sweet","aromatic"], spice: 0, cuisine: ["creole","french"], emoji: "🐟", desc: "Pan-fried speckled trout with toasted almonds" },
  { id: 36, name: "Crawfish Boil", category: "Seafood Entrées", taste: ["spicy","briny","earthy"], spice: 3, cuisine: ["cajun"], emoji: "🦞", desc: "The backyard Louisiana tradition with corn and potatoes" },
  { id: 37, name: "Viet-Cajun Crawfish", category: "Seafood Entrées", taste: ["spicy","rich","aromatic"], spice: 4, cuisine: ["cajun","vietnamese"], emoji: "🌶️", desc: "Garlic-butter crawfish with lemongrass and chili" },

  // ── Traditional Entrées (6) — Chicken, Poultry & Jambalaya ──
  { id: 40, name: "Jambalaya", category: "Traditional Entrées", taste: ["savory","smoky","spicy"], spice: 2, cuisine: ["creole","cajun"], emoji: "🍚", desc: "The one-pot Creole masterpiece with the holy trinity" },
  { id: 43, name: "Poulet Grand-Mère", category: "Traditional Entrées", taste: ["savory","aromatic","rich"], spice: 0, cuisine: ["french","creole"], emoji: "🍗", desc: "Grandmother's style herb-roasted chicken" },
  { id: 45, name: "Coq au Vin Vite", category: "Traditional Entrées", taste: ["rich","savory","aromatic"], spice: 0, cuisine: ["french","creole"], emoji: "🍷", desc: "Quick French braised chicken in red wine" },
  { id: 47, name: "Turkey Sauce Piquant", category: "Traditional Entrées", taste: ["tangy","spicy","savory"], spice: 3, cuisine: ["cajun"], emoji: "🦃", desc: "Fiery Cajun turkey in piquant tomato sauce" },
  { id: 48, name: "Smothered Chicken", category: "Traditional Entrées", taste: ["rich","savory","earthy"], spice: 1, cuisine: ["soulFood","creole"], emoji: "🍗", desc: "Slow-braised chicken in onion gravy" },
  { id: 50, name: "Duck à l'Orange", category: "Traditional Entrées", taste: ["rich","sweet","aromatic"], spice: 0, cuisine: ["french","creole"], emoji: "🦆", desc: "Classic French duck with citrus glaze" },

  // ── Meat Entrées (4) ──
  { id: 55, name: "Grillades N' Grits", category: "Meat Entrées", taste: ["savory","tangy","rich"], spice: 2, cuisine: ["creole"], emoji: "🥩", desc: "Braised beef medallions over creamy stone-ground grits" },
  { id: 56, name: "Boeuf Bourguignonne", category: "Meat Entrées", taste: ["rich","savory","aromatic"], spice: 0, cuisine: ["french","creole"], emoji: "🍷", desc: "Burgundy-braised beef, Creole-style" },
  { id: 59, name: "Garlic-Chili Flank Steak", category: "Meat Entrées", taste: ["smoky","spicy","savory"], spice: 3, cuisine: ["cajun"], emoji: "🥩", desc: "Fire-grilled steak with garlic-chili rub" },
  { id: 61, name: "Mable's Meat Pie in Phyllo", category: "Meat Entrées", taste: ["savory","earthy","rich"], spice: 1, cuisine: ["cajun"], emoji: "🥧", desc: "Old-fashioned Cajun meat pie in flaky phyllo" },

  // ── Po-Boys (2) ──
  { id: 65, name: "Shrimp Po-Boy", category: "Po-Boys", taste: ["savory","briny","fresh"], spice: 1, cuisine: ["creole"], emoji: "🥖", desc: "Crispy fried shrimp on dressed French bread" },
  { id: 67, name: "Roast Beef Po-Boy", category: "Po-Boys", taste: ["rich","savory","earthy"], spice: 1, cuisine: ["creole","soulFood"], emoji: "🥖", desc: "Slow-roasted beef debris in rich gravy" },

  // ── Sides & Vegetables (5) ──
  { id: 70, name: "Red Beans and Rice", category: "Sides & Vegetables", taste: ["savory","smoky","earthy"], spice: 1, cuisine: ["creole","soulFood"], emoji: "🫘", desc: "Monday's tradition — creamy red beans with andouille" },
  { id: 71, name: "Dirty Rice", category: "Sides & Vegetables", taste: ["savory","earthy","smoky"], spice: 2, cuisine: ["cajun"], emoji: "🍚", desc: "Rice 'dirtied' with chicken liver and giblets" },
  { id: 72, name: "Cajun Maque Choux", category: "Sides & Vegetables", taste: ["sweet","savory","fresh"], spice: 1, cuisine: ["cajun"], emoji: "🌽", desc: "Sweet corn smothered with peppers and onions" },
  { id: 73, name: "Mirliton Casserole", category: "Sides & Vegetables", taste: ["savory","earthy","rich"], spice: 1, cuisine: ["creole"], emoji: "🥒", desc: "Stuffed chayote squash baked with shrimp dressing" },
  { id: 76, name: "Stuffed Peppers", category: "Sides & Vegetables", taste: ["savory","earthy","tangy"], spice: 1, cuisine: ["creole"], emoji: "🫑", desc: "Bell peppers packed with Creole rice dressing" },

  // ── Brunch (2) ──
  { id: 85, name: "Eggs Sardou", category: "Brunch", taste: ["rich","savory","aromatic"], spice: 0, cuisine: ["creole","french"], emoji: "🥚", desc: "Poached eggs on artichoke hearts with hollandaise" },
  { id: 87, name: "Beignets", category: "Brunch", taste: ["sweet","rich","aromatic"], spice: 0, cuisine: ["creole","french"], emoji: "☁️", desc: "Pillowy fried dough clouds under powdered sugar" },

  // ── Desserts (5) ──
  { id: 90, name: "Bananas Foster", category: "Desserts", taste: ["sweet","rich","aromatic"], spice: 0, cuisine: ["creole"], emoji: "🍌", desc: "Brennan's flambéed bananas in rum-butter sauce" },
  { id: 91, name: "Bread Pudding with Bourbon Sauce", category: "Desserts", taste: ["sweet","rich","aromatic"], spice: 0, cuisine: ["creole"], emoji: "🍮", desc: "Custardy bread pudding drowned in bourbon cream" },
  { id: 92, name: "Crème Brûlée", category: "Desserts", taste: ["sweet","rich","aromatic"], spice: 0, cuisine: ["french","creole"], emoji: "🍮", desc: "Torched vanilla custard with caramel crust" },
  { id: 94, name: "Pralines", category: "Desserts", taste: ["sweet","rich","earthy"], spice: 0, cuisine: ["creole"], emoji: "🍬", desc: "Buttery pecan candy, a Crescent City confection" },
  { id: 95, name: "King Cake", category: "Desserts", taste: ["sweet","aromatic","rich"], spice: 0, cuisine: ["creole"], emoji: "👑", desc: "Purple, gold, and green — Mardi Gras in pastry form" },
];

// ── Restaurant Database ──
const RESTAURANTS = [
  { id: 1, name: "Commander's Palace", neighborhood: "Garden District", style: ["creole","french"], priceRange: "$$$$", tastes: ["rich","savory","aromatic"], img: "🏛️", desc: "Fine Creole dining since 1893. White-linen elegance.", matchTags: ["french","creole"] },
  { id: 2, name: "Dooky Chase's", neighborhood: "Tremé", style: ["creole","soulFood"], priceRange: "$$$", tastes: ["rich","savory","earthy"], img: "👑", desc: "Leah Chase's legendary Creole soul food.", matchTags: ["soulFood","creole"] },
  { id: 3, name: "Cochon", neighborhood: "Warehouse District", style: ["cajun"], priceRange: "$$$", tastes: ["smoky","savory","earthy"], img: "🐷", desc: "Donald Link's temple of Southern cooking.", matchTags: ["cajun","smoky"] },
  { id: 4, name: "Galatoire's", neighborhood: "French Quarter", style: ["creole","french"], priceRange: "$$$$", tastes: ["rich","aromatic","savory"], img: "🎩", desc: "Friday lunch institution since 1905.", matchTags: ["french","creole"] },
  { id: 5, name: "Jacques-Imo's", neighborhood: "Oak Street", style: ["cajun","creole"], priceRange: "$$", tastes: ["smoky","spicy","savory"], img: "🎷", desc: "Funky Cajun-Creole with serious flavor.", matchTags: ["cajun","spicy"] },
  { id: 6, name: "Parkway Bakery", neighborhood: "Mid-City", style: ["creole"], priceRange: "$", tastes: ["savory","rich","briny"], img: "🥖", desc: "Legendary po-boys since 1911.", matchTags: ["creole","casual"] },
  { id: 7, name: "Brennan's", neighborhood: "French Quarter", style: ["creole","french"], priceRange: "$$$$", tastes: ["sweet","rich","aromatic"], img: "🔥", desc: "Birthplace of Bananas Foster. Brunch royalty.", matchTags: ["french","sweet","brunch"] },
  { id: 8, name: "Willie Mae's Scotch House", neighborhood: "Tremé", style: ["soulFood"], priceRange: "$", tastes: ["savory","rich","smoky"], img: "🍗", desc: "James Beard Award-winning fried chicken.", matchTags: ["soulFood"] },
  { id: 9, name: "Herbsaint", neighborhood: "Warehouse District", style: ["french","creole"], priceRange: "$$$", tastes: ["aromatic","savory","fresh"], img: "🌿", desc: "Modern Southern-French bistro by Donald Link.", matchTags: ["french","fresh","aromatic"] },
  { id: 10, name: "Café Du Monde", neighborhood: "French Quarter", style: ["creole","french"], priceRange: "$", tastes: ["sweet","rich","aromatic"], img: "☕", desc: "Beignets and chicory coffee since 1862.", matchTags: ["sweet","brunch"] },
  { id: 11, name: "Tan Dinh", neighborhood: "Gretna", style: ["vietnamese","cajun"], priceRange: "$$", tastes: ["spicy","aromatic","fresh"], img: "🍜", desc: "Viet-Cajun fusion on the West Bank.", matchTags: ["vietnamese","spicy","fresh"] },
  { id: 12, name: "Peche Seafood Grill", neighborhood: "Warehouse District", style: ["seafood","cajun"], priceRange: "$$$", tastes: ["briny","smoky","fresh"], img: "🐟", desc: "James Beard-winning Gulf seafood temple.", matchTags: ["seafood","briny","smoky"] },
  { id: 13, name: "Compère Lapin", neighborhood: "Warehouse District", style: ["creole","caribbean"], priceRange: "$$$", tastes: ["spicy","aromatic","rich"], img: "🐰", desc: "Nina Compton's Caribbean-Creole magic.", matchTags: ["creole","spicy","aromatic"] },
  { id: 14, name: "Boucherie", neighborhood: "Uptown", style: ["cajun","soulFood"], priceRange: "$$", tastes: ["smoky","savory","sweet"], img: "🔪", desc: "Nose-to-tail Cajun with Southern soul.", matchTags: ["cajun","soulFood","smoky"] },
  { id: 15, name: "Brigtsen's", neighborhood: "Riverbend", style: ["cajun","creole"], priceRange: "$$$", tastes: ["rich","earthy","aromatic"], img: "🏡", desc: "Frank Brigtsen's cottage of Cajun-Creole cuisine.", matchTags: ["cajun","creole","earthy"] },
];

// ── Taste Profile Colors ──
const TASTE_COLORS = {
  spicy: { bg: "#DC2626", text: "#fff" },
  savory: { bg: "#92400E", text: "#fff" },
  smoky: { bg: "#78350F", text: "#fff" },
  sweet: { bg: "#DB2777", text: "#fff" },
  tangy: { bg: "#EA580C", text: "#fff" },
  rich: { bg: "#7C3AED", text: "#fff" },
  fresh: { bg: "#059669", text: "#fff" },
  earthy: { bg: "#65A30D", text: "#fff" },
  briny: { bg: "#0891B2", text: "#fff" },
  aromatic: { bg: "#D97706", text: "#fff" },
};

const CATEGORIES = [...new Set(RECIPES.map(r => r.category))];

// ═══════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════
export default function NewOrleansChefSurvey() {
  const [screen, setScreen] = useState("landing");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState([]);
  const [disliked, setDisliked] = useState([]);
  const [swipeDir, setSwipeDir] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showTasteProfile, setShowTasteProfile] = useState(false);
  const cardRef = useRef(null);
  const touchStart = useRef(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const filteredRecipes = selectedCategory === "All"
    ? RECIPES
    : RECIPES.filter(r => r.category === selectedCategory);

  const currentRecipe = filteredRecipes[currentIndex];
  const progress = ((liked.length + disliked.length) / Math.min(filteredRecipes.length, 20)) * 100;
  const canSeeResults = liked.length >= 5;

  const handleSwipe = useCallback((direction) => {
    if (!currentRecipe) return;
    setSwipeDir(direction);
    setTimeout(() => {
      if (direction === "right") {
        setLiked(prev => [...prev, currentRecipe]);
      } else {
        setDisliked(prev => [...prev, currentRecipe]);
      }
      setCurrentIndex(prev => prev + 1);
      setSwipeDir(null);
      setDragX(0);
    }, 300);
  }, [currentRecipe]);

  const handleDragStart = (clientX) => { touchStart.current = clientX; setIsDragging(true); };
  const handleDragMove = (clientX) => { if (touchStart.current === null) return; setDragX(clientX - touchStart.current); };
  const handleDragEnd = () => {
    if (Math.abs(dragX) > 100) handleSwipe(dragX > 0 ? "right" : "left");
    else setDragX(0);
    touchStart.current = null; setIsDragging(false);
  };

  const tasteProfile = (() => {
    if (liked.length === 0) return {};
    const counts = {};
    liked.forEach(r => { r.taste.forEach(t => { counts[t] = (counts[t] || 0) + 1; }); });
    const max = Math.max(...Object.values(counts));
    const profile = {};
    Object.keys(counts).forEach(t => { profile[t] = Math.round((counts[t] / max) * 100); });
    return profile;
  })();

  const matchedRestaurants = (() => {
    if (liked.length < 3) return [];
    const userTastes = {};
    const userCuisines = {};
    liked.forEach(r => {
      r.taste.forEach(t => { userTastes[t] = (userTastes[t] || 0) + 1; });
      r.cuisine.forEach(c => { userCuisines[c] = (userCuisines[c] || 0) + 1; });
    });
    return RESTAURANTS.map(rest => {
      let score = 0;
      rest.tastes.forEach(t => { if (userTastes[t]) score += userTastes[t] * 15; });
      rest.matchTags.forEach(tag => {
        if (userCuisines[tag]) score += userCuisines[tag] * 20;
        if (userTastes[tag]) score += userTastes[tag] * 10;
      });
      const maxPossible = liked.length * 45;
      const pct = Math.min(99, Math.round((score / maxPossible) * 100) + 40);
      return { ...rest, score: pct };
    }).sort((a, b) => b.score - a.score).slice(0, 8);
  })();

  // ═══════════════════════════════════
  // LANDING PAGE
  // ═══════════════════════════════════
  if (screen === "landing") {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(170deg, #1a0a0a 0%, #2D0A0A 25%, #1a0a0a 50%, #0a0a1a 100%)", fontFamily: "'Playfair Display', Georgia, serif", color: "#F5E6D3", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,0,0,0.15) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(212,175,55,0.05) 0%, transparent 40%)", pointerEvents: "none" }} />
        <div style={{ height: "4px", background: "linear-gradient(90deg, transparent, #D4AF37, #8B6914, #D4AF37, transparent)", opacity: 0.6 }} />

        <header style={{ textAlign: "center", padding: "40px 20px 0", position: "relative" }}>
          <div style={{ display: "inline-block", padding: "8px 32px", border: "1px solid rgba(212,175,55,0.3)", borderRadius: "2px", marginBottom: "16px", letterSpacing: "6px", fontSize: "10px", textTransform: "uppercase", color: "#D4AF37", fontFamily: "'Georgia', serif" }}>Est. New Orleans, Louisiana</div>
          <h1 style={{ fontSize: "clamp(2.8rem, 8vw, 5rem)", fontWeight: 400, letterSpacing: "-1px", lineHeight: 1, margin: "0 0 4px", background: "linear-gradient(180deg, #FFE8A0 0%, #D4AF37 40%, #B8941F 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>NewOrleansChef</h1>
          <div style={{ fontSize: "clamp(0.7rem, 2vw, 0.85rem)", letterSpacing: "5px", textTransform: "uppercase", color: "rgba(212,175,55,0.7)", fontFamily: "'Georgia', serif", marginTop: "8px" }}>Healthy New Orleans Cuisine</div>
        </header>

        <main style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 24px", position: "relative" }}>
          <div style={{ textAlign: "center", margin: "0 0 40px", fontSize: "1.6rem", opacity: 0.4 }}>&#9874;</div>

          <h2 style={{ fontSize: "clamp(1.5rem, 4.5vw, 2.2rem)", fontWeight: 400, textAlign: "center", lineHeight: 1.3, margin: "0 0 16px", color: "#F5E6D3" }}>
            Discover Your<br /><span style={{ color: "#D4AF37", fontStyle: "italic" }}>Taste of New Orleans</span>
          </h2>

          <p style={{ textAlign: "center", fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)", color: "rgba(245,230,211,0.65)", lineHeight: 1.7, margin: "0 auto 40px", fontFamily: "'Georgia', serif", maxWidth: "440px" }}>
            Swipe through {RECIPES.length} authentic Creole-Cajun dishes from the cookbook <em style={{ color: "rgba(212,175,55,0.7)" }}>Healthy New Orleans Cuisine</em>. We'll match your palate to the perfect New Orleans restaurants.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", margin: "0 0 48px" }}>
            {[
              { num: "01", icon: "🃏", title: "Swipe", desc: "Like or pass on iconic NOLA dishes" },
              { num: "02", icon: "🎭", title: "Profile", desc: "We build your unique taste fingerprint" },
              { num: "03", icon: "🍽️", title: "Match", desc: "Get your perfect restaurant pairings" },
            ].map((step, i) => (
              <div key={i} style={{ textAlign: "center", padding: "20px 8px", borderRadius: "8px", background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.1)" }}>
                <div style={{ fontSize: "1.8rem", marginBottom: "8px" }}>{step.icon}</div>
                <div style={{ fontSize: "0.6rem", letterSpacing: "3px", color: "#D4AF37", marginBottom: "4px", fontFamily: "'Georgia', serif" }}>{step.num}</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#F5E6D3", marginBottom: "4px" }}>{step.title}</div>
                <div style={{ fontSize: "0.72rem", color: "rgba(245,230,211,0.5)", lineHeight: 1.4, fontFamily: "'Georgia', serif" }}>{step.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", margin: "0 0 40px" }}>
            {CATEGORIES.map(cat => {
              const count = RECIPES.filter(r => r.category === cat).length;
              return (
                <div key={cat} style={{ padding: "6px 14px", borderRadius: "20px", background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)", fontSize: "0.72rem", color: "rgba(212,175,55,0.8)", letterSpacing: "0.5px", fontFamily: "'Georgia', serif" }}>
                  {cat} <span style={{ color: "#D4AF37", fontWeight: 700 }}>({count})</span>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center" }}>
            <button onClick={() => setScreen("survey")} style={{ padding: "18px 56px", fontSize: "1rem", fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: "#1a0a0a", background: "linear-gradient(135deg, #FFE8A0, #D4AF37, #B8941F)", border: "none", borderRadius: "4px", cursor: "pointer", boxShadow: "0 4px 24px rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.2)" }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 32px rgba(212,175,55,0.4)"; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 24px rgba(212,175,55,0.3)"; }}
            >Begin Tasting &#9874;</button>
            <p style={{ marginTop: "16px", fontSize: "0.75rem", color: "rgba(245,230,211,0.35)", fontFamily: "'Georgia', serif" }}>Takes about 2 minutes · No account needed</p>
          </div>
        </main>

        <div style={{ textAlign: "center", padding: "40px 20px 24px", borderTop: "1px solid rgba(212,175,55,0.08)" }}>
          <div style={{ fontSize: "0.65rem", letterSpacing: "4px", textTransform: "uppercase", color: "rgba(212,175,55,0.3)", fontFamily: "'Georgia', serif" }}>Powered by NewOrleansChef.com · A GetNth Experience</div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════
  // SURVEY / SWIPE PAGE
  // ═══════════════════════════════════
  if (screen === "survey") {
    const noMoreCards = currentIndex >= filteredRecipes.length;
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(170deg, #1a0a0a 0%, #2D0A0A 30%, #1a0a0a 100%)", fontFamily: "'Playfair Display', Georgia, serif", color: "#F5E6D3", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: "1px solid rgba(212,175,55,0.1)" }}>
          <button onClick={() => setScreen("landing")} style={{ background: "none", border: "none", color: "#D4AF37", cursor: "pointer", fontSize: "0.8rem", fontFamily: "'Georgia', serif", letterSpacing: "1px" }}>&#8592; Back</button>
          <span style={{ fontSize: "1.1rem", fontWeight: 600, background: "linear-gradient(180deg, #FFE8A0, #D4AF37)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>NewOrleansChef</span>
          {canSeeResults ? (
            <button onClick={() => setScreen("results")} style={{ background: "linear-gradient(135deg, #D4AF37, #B8941F)", border: "none", color: "#1a0a0a", cursor: "pointer", padding: "6px 16px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, fontFamily: "'Georgia', serif", letterSpacing: "1px" }}>Results &#8594;</button>
          ) : <div style={{ width: "60px" }} />}
        </div>

        <div style={{ padding: "0 20px", marginTop: "12px" }}>
          <div style={{ height: "3px", background: "rgba(212,175,55,0.1)", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(progress, 100)}%`, background: "linear-gradient(90deg, #D4AF37, #FFE8A0)", transition: "width 0.5s ease", borderRadius: "2px" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px", fontSize: "0.65rem", color: "rgba(245,230,211,0.4)", fontFamily: "'Georgia', serif" }}>
            <span>&#10084;&#65039; {liked.length} liked</span>
            <span>{liked.length + disliked.length} / {filteredRecipes.length} dishes</span>
            <span>&#128078; {disliked.length} passed</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "6px", padding: "12px 20px", overflowX: "auto", scrollbarWidth: "none" }}>
          {["All", ...CATEGORIES].map(cat => (
            <button key={cat} onClick={() => { setSelectedCategory(cat); setCurrentIndex(0); }} style={{ padding: "5px 14px", borderRadius: "20px", border: `1px solid ${selectedCategory === cat ? "#D4AF37" : "rgba(212,175,55,0.15)"}`, background: selectedCategory === cat ? "rgba(212,175,55,0.15)" : "transparent", color: selectedCategory === cat ? "#D4AF37" : "rgba(245,230,211,0.5)", cursor: "pointer", fontSize: "0.7rem", whiteSpace: "nowrap", fontFamily: "'Georgia', serif", transition: "all 0.2s" }}>{cat}</button>
          ))}
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px 20px" }}>
          {noMoreCards ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "16px" }}>&#9874;</div>
              <h3 style={{ fontSize: "1.4rem", color: "#D4AF37", marginBottom: "8px" }}>All Dishes Tasted!</h3>
              <p style={{ color: "rgba(245,230,211,0.5)", fontFamily: "'Georgia', serif", fontSize: "0.9rem" }}>You've gone through all {filteredRecipes.length} dishes in this category.</p>
              {canSeeResults && (
                <button onClick={() => setScreen("results")} style={{ marginTop: "24px", padding: "14px 40px", background: "linear-gradient(135deg, #FFE8A0, #D4AF37, #B8941F)", border: "none", borderRadius: "4px", cursor: "pointer", color: "#1a0a0a", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "2px", fontFamily: "'Playfair Display', serif", boxShadow: "0 4px 24px rgba(212,175,55,0.3)" }}>See My Matches &#9874;</button>
              )}
            </div>
          ) : currentRecipe ? (
            <>
              <div ref={cardRef}
                onMouseDown={e => handleDragStart(e.clientX)}
                onMouseMove={e => isDragging && handleDragMove(e.clientX)}
                onMouseUp={handleDragEnd}
                onMouseLeave={() => isDragging && handleDragEnd()}
                onTouchStart={e => handleDragStart(e.touches[0].clientX)}
                onTouchMove={e => isDragging && handleDragMove(e.touches[0].clientX)}
                onTouchEnd={handleDragEnd}
                style={{
                  width: "100%", maxWidth: "380px", borderRadius: "16px", overflow: "hidden",
                  background: "linear-gradient(160deg, rgba(45,20,20,0.95), rgba(30,10,10,0.98))",
                  border: `2px solid ${dragX > 50 ? "rgba(34,197,94,0.6)" : dragX < -50 ? "rgba(239,68,68,0.6)" : "rgba(212,175,55,0.15)"}`,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                  cursor: isDragging ? "grabbing" : "grab", userSelect: "none",
                  transform: `translateX(${swipeDir === "right" ? 400 : swipeDir === "left" ? -400 : dragX}px) rotate(${(swipeDir === "right" ? 15 : swipeDir === "left" ? -15 : dragX * 0.05)}deg)`,
                  opacity: swipeDir ? 0 : 1,
                  transition: swipeDir || !isDragging ? "all 0.3s ease" : "none",
                  position: "relative"
                }}>
                {(dragX > 50 || dragX < -50) && (
                  <div style={{ position: "absolute", top: "20px", left: dragX > 0 ? "20px" : "auto", right: dragX < 0 ? "20px" : "auto", padding: "8px 20px", borderRadius: "4px", border: `3px solid ${dragX > 0 ? "#22C55E" : "#EF4444"}`, color: dragX > 0 ? "#22C55E" : "#EF4444", fontWeight: 700, fontSize: "1.2rem", letterSpacing: "3px", transform: `rotate(${dragX > 0 ? -15 : 15}deg)`, zIndex: 10 }}>
                    {dragX > 0 ? "LOVE" : "PASS"}
                  </div>
                )}
                <div style={{ height: "160px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem", background: "linear-gradient(180deg, rgba(212,175,55,0.06), transparent)", position: "relative" }}>
                  {currentRecipe.emoji}
                  <div style={{ position: "absolute", top: "12px", right: "12px", padding: "4px 10px", borderRadius: "12px", background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.2)", fontSize: "0.65rem", color: "#D4AF37", fontFamily: "'Georgia', serif" }}>{currentRecipe.category}</div>
                </div>
                <div style={{ padding: "20px 24px 24px" }}>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 600, margin: "0 0 8px", color: "#F5E6D3", lineHeight: 1.2 }}>{currentRecipe.name}</h3>
                  <p style={{ fontSize: "0.85rem", color: "rgba(245,230,211,0.55)", margin: "0 0 16px", lineHeight: 1.5, fontFamily: "'Georgia', serif" }}>{currentRecipe.desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                    {currentRecipe.taste.map(t => (
                      <span key={t} style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "0.68rem", fontWeight: 600, background: TASTE_COLORS[t]?.bg || "#555", color: TASTE_COLORS[t]?.text || "#fff", letterSpacing: "0.5px" }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.75rem", color: "rgba(245,230,211,0.4)", fontFamily: "'Georgia', serif" }}>
                    <span>Heat:</span>
                    {[...Array(5)].map((_, i) => (<span key={i} style={{ opacity: i < currentRecipe.spice ? 1 : 0.2, fontSize: "0.9rem" }}>🌶️</span>))}
                    {currentRecipe.spice === 0 && <span style={{ color: "rgba(245,230,211,0.3)" }}>Mild</span>}
                  </div>
                  <div style={{ display: "flex", gap: "6px", marginTop: "10px", flexWrap: "wrap" }}>
                    {currentRecipe.cuisine.map(c => (
                      <span key={c} style={{ padding: "2px 8px", borderRadius: "8px", fontSize: "0.62rem", letterSpacing: "1px", textTransform: "uppercase", border: "1px solid rgba(212,175,55,0.2)", color: "rgba(212,175,55,0.6)", fontFamily: "'Georgia', serif" }}>{c}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "32px", marginTop: "24px", alignItems: "center" }}>
                <button onClick={() => handleSwipe("left")} style={{ width: "64px", height: "64px", borderRadius: "50%", border: "2px solid rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.08)", cursor: "pointer", fontSize: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", color: "#EF4444" }}
                  onMouseEnter={e => { e.target.style.background = "rgba(239,68,68,0.2)"; e.target.style.transform = "scale(1.1)"; }}
                  onMouseLeave={e => { e.target.style.background = "rgba(239,68,68,0.08)"; e.target.style.transform = "scale(1)"; }}>&#10005;</button>
                <button onClick={() => setShowTasteProfile(!showTasteProfile)} style={{ width: "48px", height: "48px", borderRadius: "50%", border: "1px solid rgba(212,175,55,0.3)", background: "rgba(212,175,55,0.05)", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", color: "#D4AF37" }}>🎭</button>
                <button onClick={() => handleSwipe("right")} style={{ width: "64px", height: "64px", borderRadius: "50%", border: "2px solid rgba(34,197,94,0.4)", background: "rgba(34,197,94,0.08)", cursor: "pointer", fontSize: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", color: "#22C55E" }}
                  onMouseEnter={e => { e.target.style.background = "rgba(34,197,94,0.2)"; e.target.style.transform = "scale(1.1)"; }}
                  onMouseLeave={e => { e.target.style.background = "rgba(34,197,94,0.08)"; e.target.style.transform = "scale(1)"; }}>&#9829;</button>
              </div>
              <p style={{ marginTop: "12px", fontSize: "0.7rem", color: "rgba(245,230,211,0.25)", textAlign: "center", fontFamily: "'Georgia', serif" }}>Swipe right to love · Swipe left to pass</p>
            </>
          ) : null}
        </div>

        {showTasteProfile && Object.keys(tasteProfile).length > 0 && (
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(20,8,8,0.97)", borderTop: "1px solid rgba(212,175,55,0.2)", padding: "20px 24px 28px", backdropFilter: "blur(12px)", zIndex: 100 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h4 style={{ margin: 0, fontSize: "0.9rem", color: "#D4AF37" }}>Your Taste Fingerprint</h4>
              <button onClick={() => setShowTasteProfile(false)} style={{ background: "none", border: "none", color: "rgba(245,230,211,0.4)", cursor: "pointer", fontSize: "1.2rem" }}>&#10005;</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {Object.entries(tasteProfile).sort(([,a],[,b]) => b - a).map(([taste, pct]) => (
                <div key={taste} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ width: "70px", fontSize: "0.72rem", color: "rgba(245,230,211,0.6)", textTransform: "capitalize", fontFamily: "'Georgia', serif" }}>{taste}</span>
                  <div style={{ flex: 1, height: "8px", borderRadius: "4px", background: "rgba(212,175,55,0.08)" }}>
                    <div style={{ height: "100%", borderRadius: "4px", width: `${pct}%`, background: TASTE_COLORS[taste]?.bg || "#D4AF37", transition: "width 0.5s ease" }} />
                  </div>
                  <span style={{ width: "35px", textAlign: "right", fontSize: "0.7rem", color: "rgba(212,175,55,0.6)", fontFamily: "'Georgia', serif" }}>{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════
  // RESULTS PAGE
  // ═══════════════════════════════════
  if (screen === "results") {
    const topTastes = Object.entries(tasteProfile).sort(([,a],[,b]) => b - a).slice(0, 5);
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(170deg, #1a0a0a 0%, #2D0A0A 25%, #0a0a1a 100%)", fontFamily: "'Playfair Display', Georgia, serif", color: "#F5E6D3" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: "1px solid rgba(212,175,55,0.1)" }}>
          <button onClick={() => setScreen("survey")} style={{ background: "none", border: "none", color: "#D4AF37", cursor: "pointer", fontSize: "0.8rem", fontFamily: "'Georgia', serif" }}>&#8592; Keep Swiping</button>
          <span style={{ fontSize: "1.1rem", fontWeight: 600, background: "linear-gradient(180deg, #FFE8A0, #D4AF37)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Your Results</span>
          <div style={{ width: "80px" }} />
        </div>

        <div style={{ maxWidth: "560px", margin: "0 auto", padding: "32px 20px" }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>&#9874;</div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 400, margin: "0 0 8px", color: "#D4AF37" }}>Your New Orleans Palate</h2>
            <p style={{ fontSize: "0.85rem", color: "rgba(245,230,211,0.5)", fontFamily: "'Georgia', serif" }}>Based on {liked.length} dishes you loved</p>
          </div>

          <div style={{ background: "rgba(45,20,20,0.5)", border: "1px solid rgba(212,175,55,0.12)", borderRadius: "12px", padding: "24px", marginBottom: "32px" }}>
            <h3 style={{ fontSize: "0.7rem", letterSpacing: "3px", textTransform: "uppercase", color: "#D4AF37", margin: "0 0 20px", fontFamily: "'Georgia', serif" }}>Taste Fingerprint</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {topTastes.map(([taste, pct]) => (
                <div key={taste} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ width: "80px", fontSize: "0.8rem", color: "rgba(245,230,211,0.7)", textTransform: "capitalize", fontFamily: "'Georgia', serif" }}>{taste}</span>
                  <div style={{ flex: 1, height: "12px", borderRadius: "6px", background: "rgba(212,175,55,0.06)" }}>
                    <div style={{ height: "100%", borderRadius: "6px", width: `${pct}%`, background: `linear-gradient(90deg, ${TASTE_COLORS[taste]?.bg || "#D4AF37"}, ${TASTE_COLORS[taste]?.bg || "#D4AF37"}88)`, transition: "width 0.8s ease", boxShadow: `0 0 12px ${TASTE_COLORS[taste]?.bg || "#D4AF37"}33` }} />
                  </div>
                  <span style={{ width: "40px", textAlign: "right", fontSize: "0.8rem", color: TASTE_COLORS[taste]?.bg || "#D4AF37", fontWeight: 700 }}>{pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.12)", borderRadius: "12px", padding: "20px 24px", marginBottom: "32px" }}>
            <h3 style={{ fontSize: "0.7rem", letterSpacing: "3px", textTransform: "uppercase", color: "#22C55E", margin: "0 0 16px", fontFamily: "'Georgia', serif" }}>Dishes You Loved</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {liked.map(r => (
                <span key={r.id} style={{ padding: "5px 12px", borderRadius: "16px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)", fontSize: "0.73rem", color: "rgba(245,230,211,0.7)", fontFamily: "'Georgia', serif" }}>{r.emoji} {r.name}</span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ fontSize: "0.7rem", letterSpacing: "3px", textTransform: "uppercase", color: "#D4AF37", margin: "0 0 20px", fontFamily: "'Georgia', serif" }}>Your Restaurant Matches</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {matchedRestaurants.map((r, i) => (
                <div key={r.id} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", background: i === 0 ? "linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.02))" : "rgba(45,20,20,0.4)", border: `1px solid ${i === 0 ? "rgba(212,175,55,0.25)" : "rgba(212,175,55,0.08)"}`, borderRadius: "12px", position: "relative", overflow: "hidden" }}>
                  {i === 0 && <div style={{ position: "absolute", top: "8px", right: "12px", fontSize: "0.55rem", letterSpacing: "2px", color: "#D4AF37", textTransform: "uppercase", fontFamily: "'Georgia', serif" }}>&#9733; Top Match</div>}
                  <div style={{ fontSize: "2rem", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", background: "rgba(212,175,55,0.06)", flexShrink: 0 }}>{r.img}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "1rem", fontWeight: 600, color: "#F5E6D3" }}>{r.name}</span>
                      <span style={{ fontSize: "0.65rem", color: "rgba(212,175,55,0.5)", fontFamily: "'Georgia', serif" }}>{r.priceRange}</span>
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(245,230,211,0.45)", fontFamily: "'Georgia', serif", marginBottom: "6px" }}>{r.neighborhood} · {r.desc}</div>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                      {r.style.map(s => (
                        <span key={s} style={{ padding: "2px 7px", borderRadius: "8px", fontSize: "0.58rem", textTransform: "capitalize", border: "1px solid rgba(212,175,55,0.15)", color: "rgba(212,175,55,0.5)", fontFamily: "'Georgia', serif" }}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign: "center", minWidth: "50px" }}>
                    <div style={{ fontSize: "1.3rem", fontWeight: 700, color: r.score >= 90 ? "#22C55E" : r.score >= 75 ? "#D4AF37" : "rgba(245,230,211,0.6)" }}>{r.score}%</div>
                    <div style={{ fontSize: "0.55rem", color: "rgba(245,230,211,0.3)", fontFamily: "'Georgia', serif" }}>match</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: "center", padding: "24px", background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.1)", borderRadius: "12px", marginBottom: "24px" }}>
            <p style={{ fontSize: "0.85rem", color: "rgba(245,230,211,0.6)", fontFamily: "'Georgia', serif", margin: "0 0 16px", lineHeight: 1.6 }}>Ready to explore New Orleans with your personalized taste profile?</p>
            <button style={{ padding: "14px 40px", background: "linear-gradient(135deg, #FFE8A0, #D4AF37, #B8941F)", border: "none", borderRadius: "4px", cursor: "pointer", color: "#1a0a0a", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "2px", fontFamily: "'Playfair Display', serif", boxShadow: "0 4px 24px rgba(212,175,55,0.3)" }}>Get the App — It's Free &#9874;</button>
          </div>

          <div style={{ textAlign: "center", padding: "20px 0", borderTop: "1px solid rgba(212,175,55,0.08)" }}>
            <div style={{ fontSize: "0.6rem", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(212,175,55,0.25)", fontFamily: "'Georgia', serif" }}>Powered by NewOrleansChef.com · A GetNth Experience</div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
