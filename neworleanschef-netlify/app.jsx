import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChefHat, Heart, Star, Clock, Users, Flame, Leaf, MapPin, Calendar, 
  Search, Filter, TrendingUp, ThumbsUp, X, Info, Utensils, Music,
  Coffee, Wine, Fish, Award, Sparkles, ArrowRight
} from 'lucide-react';

// Custom hamburger menu icon
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

/**
 * NewOrleansChef.com - Complete Integrated Application
 * Combines recipes from "Healthy New Orleans Cuisine" with smart taste matching
 * for restaurant and event recommendations
 */

// ============================================================================
// COOKBOOK DATABASE
// ============================================================================

const cookbook = {
  title: "Healthy New Orleans Cuisine",
  author: "Mark C. Gasquet",
  tagline: "Cut the Fat, Cut the Salt, Keep the Flavor!",
  
  recipes: [
    {
      id: 1,
      name: "Mark's Creole Seasoning",
      category: "Seasonings & Basics",
      image: "https://images.unsplash.com/photo-1596040033229-a0b525909e53?w=800&q=80",
      prepTime: 5, cookTime: 0, servings: 48,
      calories: 5, protein: "0g", carbs: "1g", fat: "0g", sodium: "45mg",
      exchanges: "Free",
      tags: ["essential", "pantry-staple", "salt-free"],
      ingredients: ["2 tablespoons paprika", "2 tablespoons garlic powder", "1 tablespoon onion powder", "1 tablespoon dried oregano", "1 tablespoon dried thyme", "1 teaspoon cayenne pepper", "1 teaspoon black pepper", "1 teaspoon white pepper", "1 teaspoon kosher salt"],
      instructions: ["Combine all ingredients in a small bowl.", "Mix well until thoroughly blended.", "Store in an airtight container.", "Use in place of salt in most recipes."],
      chefNote: "Use kosher salt because less is needed, and freshly ground black pepper has freshness and a kick.",
      flavorProfile: { heat: 6, richness: 1, tangy: 2, smoky: 3, savory: 8 }
    },
    {
      id: 2,
      name: "Oven Roux (No-Fat Roux)",
      category: "Seasonings & Basics",
      image: "https://images.unsplash.com/photo-1611137378722-0a29c7595a15?w=800&q=80",
      prepTime: 5, cookTime: 30, servings: 16,
      calories: 25, protein: "1g", carbs: "5g", fat: "0g", sodium: "0mg",
      exchanges: "1/3 starch",
      tags: ["essential", "fat-free", "technique"],
      ingredients: ["1 cup all-purpose flour"],
      instructions: ["Preheat oven to 400°F.", "Spread flour evenly in a cast iron skillet.", "Bake, stirring every 10 minutes, until flour is the color of peanut butter (about 30 minutes).", "Cool and store in an airtight container."],
      chefNote: "This technique gives a deep, nutty flavor without the fat. Store in a jar and it will last for months.",
      flavorProfile: { heat: 0, richness: 2, tangy: 0, smoky: 7, savory: 6 }
    },
    {
      id: 3,
      name: "Cajun Gumbo",
      category: "Soups & Gumbos",
      image: "https://images.unsplash.com/photo-1604908815825-4b190e1d4f70?w=800&q=80",
      prepTime: 30, cookTime: 90, servings: 8,
      calories: 285, protein: "28g", carbs: "22g", fat: "8g", sodium: "520mg",
      exchanges: "1 starch, 3 lean meat, 2 vegetable",
      tags: ["traditional", "one-pot", "comfort-food"],
      ingredients: ["1/4 cup Oven Roux", "1 cup onion, diced", "1 cup celery, diced", "1 cup bell pepper, diced", "4 cloves garlic, minced", "1 pound chicken breast, cubed", "1/2 pound turkey andouille", "6 cups low-sodium chicken broth", "1 can diced tomatoes", "2 bay leaves", "1 tsp thyme", "1 tbsp Mark's Creole Seasoning", "2 cups okra, sliced", "Filé powder to taste"],
      instructions: ["Heat pot and add oven roux.", "Add trinity and cook until softened.", "Add garlic and cook 1 minute.", "Add chicken and sausage, cook until browned.", "Slowly stir in broth, tomatoes, bay leaves, thyme, and Creole seasoning.", "Bring to boil, reduce heat and simmer 45 minutes.", "Add okra and simmer 30 more minutes.", "Remove bay leaves, season with filé powder.", "Serve over rice."],
      chefNote: "Using the oven roux eliminates most of the fat while maintaining that deep, rich gumbo flavor.",
      flavorProfile: { heat: 7, richness: 6, tangy: 5, smoky: 8, savory: 10 }
    },
    {
      id: 4,
      name: "Seafood Gumbo",
      category: "Soups & Gumbos",
      image: "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?w=800&q=80",
      prepTime: 30, cookTime: 75, servings: 8,
      calories: 245, protein: "26g", carbs: "18g", fat: "6g", sodium: "480mg",
      exchanges: "1 starch, 3 very-lean meat, 1 vegetable",
      tags: ["seafood", "traditional", "special-occasion"],
      ingredients: ["1/4 cup Oven Roux", "1 cup onion, diced", "1 cup celery, diced", "1 cup bell pepper, diced", "4 cloves garlic, minced", "6 cups seafood stock", "1 can diced tomatoes", "2 bay leaves", "1 tsp thyme", "1 tbsp Mark's Creole Seasoning", "2 cups okra", "1 pound shrimp", "1/2 pound lump crabmeat", "1 pint fresh oysters"],
      instructions: ["Heat pot and add oven roux.", "Add trinity and cook until softened.", "Add garlic and cook 1 minute.", "Add stock, tomatoes, bay leaves, thyme, and seasoning.", "Bring to boil, reduce heat and simmer 45 minutes.", "Add okra and simmer 20 minutes.", "Add shrimp and cook 3 minutes.", "Add crabmeat and oysters, cook 5 minutes until oysters curl.", "Serve over rice."],
      chefNote: "Add the seafood at the end to prevent overcooking. Fresh oysters add incredible flavor.",
      flavorProfile: { heat: 6, richness: 5, tangy: 5, smoky: 7, savory: 10 }
    },
    {
      id: 5,
      name: "Shrimp Creole",
      category: "Shellfish & Fish",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80",
      prepTime: 20, cookTime: 35, servings: 6,
      calories: 265, protein: "24g", carbs: "32g", fat: "5g", sodium: "420mg",
      exchanges: "1.5 starch, 3 very-lean meat, 2 vegetable",
      tags: ["traditional", "main-dish", "tomato-based"],
      ingredients: ["2 tbsp olive oil", "1 cup onion, diced", "1 cup celery, diced", "1 cup bell pepper, diced", "4 cloves garlic, minced", "1 can (28 oz) crushed tomatoes", "1 can (8 oz) tomato sauce", "1 cup low-sodium chicken broth", "1 tbsp Mark's Creole Seasoning", "1 tsp thyme", "2 bay leaves", "1/4 tsp cayenne", "2 pounds shrimp"],
      instructions: ["Heat oil in large skillet.", "Add trinity and cook until softened, 8 minutes.", "Add garlic and cook 1 minute.", "Stir in tomatoes, sauce, broth, seasoning, thyme, bay leaves, and cayenne.", "Bring to boil, reduce heat and simmer 20 minutes.", "Add shrimp and cook 5-7 minutes until pink.", "Remove bay leaves.", "Serve over rice."],
      chefNote: "The secret is letting the sauce simmer to develop deep flavors before adding the shrimp.",
      flavorProfile: { heat: 7, richness: 4, tangy: 8, smoky: 4, savory: 9 }
    },
    {
      id: 6,
      name: "Blackened Redfish",
      category: "Shellfish & Fish",
      image: "https://images.unsplash.com/photo-1580959375944-0ef17862a393?w=800&q=80",
      prepTime: 10, cookTime: 8, servings: 4,
      calories: 210, protein: "34g", carbs: "2g", fat: "7g", sodium: "180mg",
      exchanges: "5 very-lean meat, 1 fat",
      tags: ["cajun", "quick", "high-protein", "low-carb"],
      ingredients: ["4 redfish fillets (6 oz each)", "2 tbsp Mark's Creole Seasoning", "1 tsp paprika", "1/2 tsp cayenne", "2 tbsp melted butter or olive oil", "Lemon wedges"],
      instructions: ["Heat cast iron skillet over high heat until smoking.", "Mix Creole seasoning, paprika, and cayenne.", "Brush fish with butter or oil.", "Dredge fish in spice mixture, coating both sides heavily.", "Place fish in hot skillet and cook 3-4 minutes per side until blackened.", "Serve with lemon wedges."],
      chefNote: "This technique works with any firm white fish. The high heat creates a flavorful crust while keeping the fish moist inside. Warning: This will smoke!",
      flavorProfile: { heat: 9, richness: 5, tangy: 3, smoky: 10, savory: 8 }
    },
    {
      id: 7,
      name: "Crab Cakes",
      category: "Shellfish & Fish",
      image: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=800&q=80",
      prepTime: 20, cookTime: 10, servings: 6,
      calories: 185, protein: "20g", carbs: "12g", fat: "6g", sodium: "340mg",
      exchanges: "1 starch, 3 very-lean meat",
      tags: ["elegant", "appetizer", "main-dish"],
      ingredients: ["1 pound lump crabmeat", "1/2 cup Italian breadcrumbs", "1/4 cup green onions, chopped", "1/4 cup bell pepper, diced", "2 tbsp light mayonnaise", "1 egg white", "1 tbsp Dijon mustard", "1 tbsp Mark's Creole Seasoning", "2 tbsp olive oil", "Lemon wedges"],
      instructions: ["Pick through crabmeat for shells.", "Combine breadcrumbs, green onions, bell pepper, mayo, egg white, mustard, and seasoning.", "Gently fold in crabmeat.", "Form into 12 patties.", "Refrigerate 15 minutes.", "Heat oil in skillet.", "Cook cakes 4-5 minutes per side until golden.", "Serve with lemon."],
      chefNote: "The key is to use mostly crab with minimal filler. Handle gently to keep the lump crabmeat intact.",
      flavorProfile: { heat: 5, richness: 6, tangy: 4, smoky: 2, savory: 9 }
    },
    {
      id: 8,
      name: "Jambalaya",
      category: "Chicken & Poultry",
      image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80",
      prepTime: 20, cookTime: 45, servings: 8,
      calories: 310, protein: "24g", carbs: "38g", fat: "8g", sodium: "480mg",
      exchanges: "2 starch, 3 lean meat, 1 vegetable",
      tags: ["traditional", "one-pot", "rice"],
      ingredients: ["2 tbsp olive oil", "1 pound chicken breast, cubed", "1/2 pound turkey andouille", "1 cup onion, diced", "1 cup celery, diced", "1 cup bell pepper, diced", "4 cloves garlic, minced", "1 can diced tomatoes", "2 cups low-sodium chicken broth", "1.5 cups long-grain rice", "2 tbsp Mark's Creole Seasoning", "1 tsp thyme", "2 bay leaves", "1/4 tsp cayenne", "Green onions"],
      instructions: ["Heat oil in large pot.", "Add chicken and sausage, cook until browned. Remove.", "Add trinity and cook until softened.", "Add garlic and cook 1 minute.", "Stir in tomatoes, broth, rice, seasoning, thyme, bay leaves, and cayenne.", "Return chicken and sausage to pot.", "Bring to boil, reduce heat, cover and simmer 30-35 minutes.", "Remove bay leaves. Garnish with green onions."],
      chefNote: "The rice should absorb all the liquid and be slightly crispy on the bottom. Don't stir too much during cooking.",
      flavorProfile: { heat: 7, richness: 6, tangy: 6, smoky: 5, savory: 9 }
    },
    {
      id: 9,
      name: "Red Beans and Rice",
      category: "Vegetables & Grains",
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80",
      prepTime: 15, cookTime: 120, servings: 8,
      calories: 285, protein: "14g", carbs: "45g", fat: "5g", sodium: "420mg",
      exchanges: "3 starch, 1 lean meat",
      tags: ["traditional", "comfort-food", "monday"],
      ingredients: ["1 pound dried red kidney beans", "1 tbsp olive oil", "1 cup onion, diced", "1 cup celery, diced", "1 cup bell pepper, diced", "4 cloves garlic, minced", "1/2 pound turkey andouille", "6 cups low-sodium chicken broth", "2 bay leaves", "1 tbsp Mark's Creole Seasoning", "1 tsp thyme", "1/2 tsp cayenne", "Green onions"],
      instructions: ["Soak beans overnight. Drain.", "Heat oil in large pot.", "Add trinity and cook until softened.", "Add garlic and cook 1 minute.", "Add sausage and cook until browned.", "Add beans, broth, bay leaves, seasoning, thyme, and cayenne.", "Bring to boil, reduce heat and simmer 2 hours.", "Mash some beans against pot to create creaminess.", "Remove bay leaves. Serve over rice with green onions."],
      chefNote: "The key is slow cooking and mashing some of the beans to create that creamy texture. Traditionally served on Mondays.",
      flavorProfile: { heat: 6, richness: 7, tangy: 3, smoky: 6, savory: 9 }
    },
    {
      id: 10,
      name: "Bread Pudding with Bourbon Sauce",
      category: "Desserts",
      image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800&q=80",
      prepTime: 20, cookTime: 50, servings: 12,
      calories: 245, protein: "6g", carbs: "42g", fat: "6g", sodium: "220mg",
      exchanges: "3 carbohydrate, 1 fat",
      tags: ["dessert", "traditional", "special-occasion"],
      ingredients: ["8 cups day-old French bread, cubed", "3 cups skim milk", "3/4 cup sugar substitute", "3 eggs", "2 egg whites", "1 tbsp vanilla", "1 tsp cinnamon", "1/2 tsp nutmeg", "1/2 cup raisins", "Bourbon Sauce: 1/2 cup sugar substitute, 2 tbsp cornstarch, 1 cup skim milk, 2 tbsp bourbon, 1 tsp vanilla"],
      instructions: ["Preheat oven to 350°F. Spray 9x13 dish.", "Place bread in dish.", "Whisk milk, sugar substitute, eggs, egg whites, vanilla, cinnamon, and nutmeg.", "Pour over bread. Stir in raisins. Let soak 10 minutes.", "Bake 45-50 minutes until set and golden.", "For sauce: Combine sugar substitute and cornstarch. Whisk in milk. Cook over medium heat until thickened. Stir in bourbon and vanilla.", "Serve warm with sauce."],
      chefNote: "Day-old French bread works best as it soaks up the custard without getting mushy. The bourbon sauce makes this special.",
      flavorProfile: { heat: 0, richness: 7, tangy: 1, smoky: 2, savory: 1 }
    },
    {
      id: 11,
      name: "Bananas Foster",
      category: "Desserts",
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80",
      prepTime: 5, cookTime: 10, servings: 4,
      calories: 185, protein: "2g", carbs: "35g", fat: "4g", sodium: "30mg",
      exchanges: "2 carbohydrate, 1 fat",
      tags: ["dessert", "quick", "flambé"],
      ingredients: ["2 tbsp butter", "1/4 cup brown sugar substitute", "1/2 tsp cinnamon", "2 bananas, sliced lengthwise", "1/4 cup dark rum"],
      instructions: ["Melt butter in skillet over medium heat.", "Add brown sugar substitute and cinnamon, stir until dissolved.", "Add bananas and cook 2-3 minutes per side.", "Carefully add rum and ignite with long match.", "Shake pan gently until flames subside.", "Serve immediately over low-fat vanilla ice cream."],
      chefNote: "Created in 1951 at Brennan's Restaurant. Be careful when flambéing - have a lid nearby to smother flames if needed.",
      flavorProfile: { heat: 1, richness: 8, tangy: 1, smoky: 3, savory: 1 }
    },
    {
      id: 12,
      name: "Grilled Shrimp",
      category: "Appetizers",
      image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&q=80",
      prepTime: 15, cookTime: 5, servings: 4,
      calories: 124, protein: "23g", carbs: "1g", fat: "3g", sodium: "168mg",
      exchanges: "3 very-lean meat",
      tags: ["quick", "high-protein", "low-carb", "grilled"],
      ingredients: ["1 pound medium shrimp, peeled", "1 tbsp Mark's Creole Seasoning", "Extra-virgin olive oil"],
      instructions: ["Preheat grill to medium-high.", "Combine shrimp, seasoning and oil in bowl.", "Thread shrimp onto skewers.", "Grill 2 minutes per side until cooked through.", "Serve on salads or as appetizers."],
      chefNote: "Shrimp are fantastic. Fish and shellfish are generally the leanest sources of protein you can find.",
      flavorProfile: { heat: 6, richness: 3, tangy: 2, smoky: 7, savory: 8 }
    },
    {
      id: 13,
      name: "Chicken & Sausage Gumbo",
      category: "Soups & Gumbos",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
      prepTime: 30, cookTime: 90, servings: 8,
      calories: 295, protein: "26g", carbs: "24g", fat: "9g", sodium: "540mg",
      exchanges: "1 starch, 3 lean meat, 2 vegetable",
      tags: ["traditional", "one-pot", "comfort-food"],
      ingredients: ["1/4 cup Oven Roux", "1 cup onion, diced", "1 cup celery, diced", "1 cup bell pepper, diced", "4 cloves garlic, minced", "1.5 pounds chicken thighs, boneless skinless", "1/2 pound turkey andouille", "6 cups low-sodium chicken broth", "2 bay leaves", "1 tbsp Mark's Creole Seasoning", "1 tsp thyme", "1/2 tsp cayenne", "2 cups okra", "Green onions", "Filé powder"],
      instructions: ["Heat pot and add oven roux.", "Add trinity and cook until softened.", "Add garlic and cook 1 minute.", "Add chicken and sausage, brown on all sides.", "Add broth, bay leaves, seasoning, thyme, and cayenne.", "Bring to boil, reduce heat and simmer 60 minutes.", "Add okra and simmer 30 more minutes.", "Remove bay leaves, season with filé.", "Serve over rice with green onions."],
      chefNote: "Chicken thighs add more flavor than breast meat. The long simmer creates a rich, complex gumbo.",
      flavorProfile: { heat: 7, richness: 7, tangy: 4, smoky: 8, savory: 10 }
    },
    {
      id: 14,
      name: "Crawfish Étouffée",
      category: "Shellfish & Fish",
      image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80",
      prepTime: 20, cookTime: 35, servings: 6,
      calories: 255, protein: "22g", carbs: "28g", fat: "6g", sodium: "460mg",
      exchanges: "1.5 starch, 3 very-lean meat, 1 vegetable",
      tags: ["traditional", "seafood", "cajun"],
      ingredients: ["2 tbsp olive oil", "1 cup onion, diced", "1/2 cup celery, diced", "1/2 cup bell pepper, diced", "3 cloves garlic, minced", "2 tbsp all-purpose flour", "2 cups low-sodium seafood stock", "1 can (8 oz) tomato sauce", "1 tbsp Mark's Creole Seasoning", "1/2 tsp cayenne", "2 bay leaves", "1.5 pounds crawfish tails", "1/4 cup green onions, chopped", "2 tbsp fresh parsley"],
      instructions: ["Heat oil in large skillet.", "Add trinity and cook until softened.", "Add garlic and cook 1 minute.", "Stir in flour and cook 2 minutes.", "Gradually add stock, stirring constantly.", "Add tomato sauce, seasoning, cayenne, and bay leaves.", "Simmer 20 minutes until thickened.", "Add crawfish and simmer 8-10 minutes.", "Remove bay leaves. Stir in green onions and parsley.", "Serve over rice."],
      chefNote: "Don't overcook the crawfish or they'll become tough. Fresh Louisiana crawfish are best, but frozen works well too.",
      flavorProfile: { heat: 7, richness: 6, tangy: 6, smoky: 5, savory: 9 }
    },
    {
      id: 15,
      name: "Grilled Chicken Breast",
      category: "Chicken & Poultry",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
      prepTime: 10, cookTime: 15, servings: 4,
      calories: 165, protein: "31g", carbs: "1g", fat: "4g", sodium: "180mg",
      exchanges: "4 very-lean meat",
      tags: ["simple", "high-protein", "low-carb", "grilled"],
      ingredients: ["4 boneless, skinless chicken breasts (6 oz each)", "2 tbsp Mark's Creole Seasoning", "1 tbsp olive oil", "Lemon wedges"],
      instructions: ["Preheat grill to medium-high.", "Brush chicken with olive oil.", "Season both sides generously with Creole seasoning.", "Grill 6-7 minutes per side until internal temp reaches 165°F.", "Let rest 5 minutes before slicing.", "Serve with lemon wedges."],
      chefNote: "This is your go-to protein for meal prep. Slice it for salads, sandwiches, or serve whole with vegetables.",
      flavorProfile: { heat: 6, richness: 2, tangy: 2, smoky: 7, savory: 8 }
    },
    {
      id: 16,
      name: "Maque Choux",
      category: "Vegetables & Grains",
      image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&q=80",
      prepTime: 15, cookTime: 25, servings: 6,
      calories: 145, protein: "4g", carbs: "28g", fat: "3g", sodium: "220mg",
      exchanges: "1.5 starch, 1 vegetable",
      tags: ["vegetarian", "side-dish", "traditional"],
      ingredients: ["1 tbsp olive oil", "1 cup onion, diced", "1/2 cup bell pepper, diced", "2 cloves garlic, minced", "4 cups fresh or frozen corn kernels", "1 can (14.5 oz) diced tomatoes, drained", "1/2 cup low-sodium vegetable broth", "1 tsp Mark's Creole Seasoning", "1/4 tsp cayenne", "2 tbsp fresh parsley", "Salt and pepper to taste"],
      instructions: ["Heat oil in large skillet.", "Add onion and bell pepper, cook until softened.", "Add garlic and cook 1 minute.", "Stir in corn, tomatoes, broth, seasoning, and cayenne.", "Bring to simmer and cook 15-20 minutes, stirring occasionally.", "Stir in parsley.", "Season with salt and pepper.", "Serve hot."],
      chefNote: "This Cajun corn dish is perfect as a side or can be a vegetarian main course. Fresh summer corn is amazing here.",
      flavorProfile: { heat: 5, richness: 4, tangy: 6, smoky: 3, savory: 7 }
    },
    {
      id: 17,
      name: "Mirliton (Chayote) Casserole",
      category: "Vegetables & Grains",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
      prepTime: 25, cookTime: 45, servings: 8,
      calories: 185, protein: "12g", carbs: "22g", fat: "6g", sodium: "380mg",
      exchanges: "1 starch, 1 lean meat, 1 vegetable",
      tags: ["traditional", "casserole", "comfort-food"],
      ingredients: ["4 mirlitons (chayote squash)", "1 tbsp olive oil", "1/2 pound ground turkey breast", "1 cup onion, diced", "1/2 cup celery, diced", "1/2 cup bell pepper, diced", "2 cloves garlic, minced", "1 cup Italian breadcrumbs", "1 tbsp Mark's Creole Seasoning", "1/4 tsp cayenne", "1/2 cup low-sodium chicken broth", "2 tbsp fresh parsley", "Cooking spray"],
      instructions: ["Boil mirlitons whole until tender, about 45 minutes. Cool, peel, remove seeds, and chop.", "Preheat oven to 350°F. Spray 9x13 dish.", "Heat oil in skillet. Brown turkey.", "Add trinity and cook until softened.", "Add garlic and cook 1 minute.", "Combine mirlitons, turkey mixture, 3/4 cup breadcrumbs, seasoning, cayenne, broth, and parsley.", "Transfer to baking dish. Top with remaining breadcrumbs.", "Bake 30 minutes until golden."],
      chefNote: "Mirlitons are a New Orleans staple. This traditional casserole is lighter than the original but just as satisfying.",
      flavorProfile: { heat: 5, richness: 5, tangy: 3, smoky: 4, savory: 8 }
    },
    {
      id: 18,
      name: "Chicken Sauce Piquant",
      category: "Chicken & Poultry",
      image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80",
      prepTime: 25, cookTime: 60, servings: 6,
      calories: 275, protein: "28g", carbs: "24g", fat: "7g", sodium: "520mg",
      exchanges: "1 starch, 3 lean meat, 2 vegetable",
      tags: ["traditional", "spicy", "one-pot"],
      ingredients: ["2 tbsp olive oil", "2 pounds chicken thighs, boneless skinless, cubed", "1 cup onion, diced", "1 cup celery, diced", "1 cup bell pepper, diced", "4 cloves garlic, minced", "1 can (28 oz) crushed tomatoes", "1 cup low-sodium chicken broth", "2 tbsp tomato paste", "1 tbsp Mark's Creole Seasoning", "1 tsp cayenne pepper", "1 tsp hot sauce", "2 bay leaves", "1/4 cup green onions"],
      instructions: ["Heat oil in large pot. Brown chicken, remove.", "Add trinity and cook until softened.", "Add garlic and cook 1 minute.", "Stir in tomatoes, broth, tomato paste, seasoning, cayenne, hot sauce, and bay leaves.", "Return chicken to pot.", "Bring to boil, reduce heat and simmer 45 minutes.", "Remove bay leaves.", "Garnish with green onions.", "Serve over rice."],
      chefNote: "Sauce piquant means 'spicy sauce' - this dish has a kick! Adjust cayenne and hot sauce to your heat preference.",
      flavorProfile: { heat: 9, richness: 6, tangy: 7, smoky: 5, savory: 9 }
    },
    {
      id: 19,
      name: "Shrimp Étouffée",
      category: "Shellfish & Fish",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80",
      prepTime: 20, cookTime: 30, servings: 6,
      calories: 198, protein: "22g", carbs: "16g", fat: "6g", sodium: "420mg",
      exchanges: "1 starch, 3 lean meat",
      tags: ["cajun", "traditional", "étouffée"],
      ingredients: ["1.5 pounds medium shrimp, peeled", "2 tbsp canola oil", "2 tbsp oven roux flour", "1 cup onion, diced", "1/2 cup celery, diced", "1/2 cup bell pepper, diced", "3 cloves garlic, minced", "1 cup low-sodium chicken broth", "1/2 cup water", "1 tbsp Mark's Creole Seasoning", "1/4 cup green onions", "2 tbsp fresh parsley"],
      instructions: ["Heat oil in large skillet.", "Add trinity and sauté 8 minutes.", "Add garlic and cook 1 minute.", "Stir in oven roux flour, cook 1 minute.", "Gradually add broth and water, stirring constantly.", "Add Creole seasoning; simmer 15 minutes.", "Add shrimp; cook 5-7 minutes until pink.", "Stir in green onions and parsley.", "Serve over rice."],
      chefNote: "Étouffée means 'smothered' - the key is cooking the trinity until soft before adding liquid.",
      flavorProfile: { heat: 6, richness: 6, tangy: 4, smoky: 5, savory: 9 }
    },
    {
      id: 20,
      name: "BBQ Shrimp",
      category: "Shellfish & Fish",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80",
      prepTime: 10, cookTime: 20, servings: 4,
      calories: 285, protein: "24g", carbs: "8g", fat: "18g", sodium: "520mg",
      exchanges: "3 lean meat, 2 fat",
      tags: ["quick", "new-orleans-style", "buttery"],
      ingredients: ["2 pounds large shrimp with heads on", "1/2 cup light butter", "2 tbsp Worcestershire sauce", "2 tbsp lemon juice", "2 tsp Mark's Creole Seasoning", "1 tsp paprika", "4 cloves garlic, minced", "1/4 tsp cayenne pepper", "2 bay leaves", "French bread for dipping"],
      instructions: ["Melt butter in large skillet over medium heat.", "Add Worcestershire, lemon juice, seasoning, paprika, garlic, cayenne, and bay leaves.", "Bring to simmer.", "Add shrimp and cook 5-7 minutes, turning once.", "Remove bay leaves.", "Serve with plenty of sauce and French bread for dipping."],
      chefNote: "Despite the name, this isn't barbecued - it's a New Orleans buttery, spicy shrimp dish. Keep the heads on for more flavor!",
      flavorProfile: { heat: 7, richness: 9, tangy: 5, smoky: 3, savory: 8 }
    },
    {
      id: 21,
      name: "Baked Oysters Rockefeller",
      category: "Shellfish & Fish",
      image: "https://images.unsplash.com/photo-1625944228130-927e2df79e1e?w=800&q=80",
      prepTime: 20, cookTime: 30, servings: 4,
      calories: 219, protein: "15g", carbs: "23g", fat: "5g", sodium: "449mg",
      exchanges: "1 starch, 3/4 other carb, 3 very-lean meat",
      tags: ["elegant", "classic", "appetizer"],
      ingredients: ["16 oysters on half shell", "1 box rock salt", "1/4 cup shallots", "1 tbsp fresh thyme", "1 cup spinach", "1/2 cup celery", "1 cup oyster liquor", "1 tbsp Worcestershire sauce", "2 tbsp light margarine", "1 oz Herbsaint or Pernod", "1/2 cup Italian breadcrumbs"],
      instructions: ["Place rock salt 1/2-inch thick on platter and heat in oven.", "Place oysters on half shell on hot salt.", "Broil 5 minutes.", "In food processor, pulse shallots, thyme, spinach, and celery.", "Transfer to saucepan with oyster liquor, Worcestershire, and margarine.", "Simmer until reduced by half.", "Add Herbsaint.", "Spoon mixture over oysters.", "Top with breadcrumbs.", "Broil until golden, about 5 minutes."],
      chefNote: "This Antoine's Restaurant classic is 'as rich as Rockefeller' - this lighter version maintains the elegance.",
      flavorProfile: { heat: 3, richness: 7, tangy: 3, smoky: 2, savory: 9 }
    },
    {
      id: 22,
      name: "Roasted Oysters",
      category: "Appetizers",
      image: "https://images.unsplash.com/photo-1625944228130-927e2df79e1e?w=800&q=80",
      prepTime: 10, cookTime: 15, servings: 4,
      calories: 145, protein: "12g", carbs: "8g", fat: "7g", sodium: "280mg",
      exchanges: "1/2 starch, 2 very-lean meat, 1 fat",
      tags: ["appetizer", "simple", "grilled"],
      ingredients: ["24 fresh oysters in shell", "1/4 cup light butter, melted", "2 cloves garlic, minced", "1 tbsp lemon juice", "1 tsp Mark's Creole Seasoning", "2 tbsp fresh parsley", "Lemon wedges"],
      instructions: ["Preheat grill to high.", "Scrub oyster shells clean.", "Place oysters on grill, cup side down.", "Grill until shells start to open, about 5-8 minutes.", "Carefully pry shells open fully.", "Mix butter, garlic, lemon juice, and seasoning.", "Drizzle over oysters.", "Grill 2-3 more minutes.", "Garnish with parsley and serve with lemon."],
      chefNote: "These are fantastic at outdoor gatherings. The oysters steam in their own juices!",
      flavorProfile: { heat: 4, richness: 6, tangy: 5, smoky: 8, savory: 8 }
    },
    {
      id: 23,
      name: "Dirty Rice",
      category: "Vegetables & Grains",
      image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800&q=80",
      prepTime: 15, cookTime: 35, servings: 8,
      calories: 195, protein: "10g", carbs: "28g", fat: "4g", sodium: "380mg",
      exchanges: "2 starch, 1 lean meat",
      tags: ["cajun", "side-dish", "rice"],
      ingredients: ["1/2 pound ground turkey", "1/4 pound chicken livers, chopped", "2 tbsp olive oil", "1 cup onion, diced", "1/2 cup celery, diced", "1/2 cup bell pepper, diced", "3 cloves garlic, minced", "2 cups long-grain rice", "3 cups low-sodium chicken broth", "1 tbsp Mark's Creole Seasoning", "1/2 tsp thyme", "1/4 cup green onions", "2 tbsp parsley"],
      instructions: ["Heat oil in large pot.", "Add ground turkey and liver; cook until browned.", "Add trinity and cook until softened.", "Add garlic and cook 1 minute.", "Stir in rice and toast 2 minutes.", "Add broth, seasoning, and thyme.", "Bring to boil, reduce heat, cover and simmer 20 minutes.", "Fluff with fork.", "Stir in green onions and parsley."],
      chefNote: "The chopped liver gives this rice its distinctive 'dirty' appearance and rich flavor.",
      flavorProfile: { heat: 6, richness: 7, tangy: 2, smoky: 4, savory: 9 }
    },
    {
      id: 24,
      name: "Shrimp and Corn Bisque",
      category: "Soups & Gumbos",
      image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&q=80",
      prepTime: 20, cookTime: 35, servings: 6,
      calories: 245, protein: "18g", carbs: "28g", fat: "7g", sodium: "480mg",
      exchanges: "1.5 starch, 2 lean meat, 1 vegetable",
      tags: ["soup", "creamy", "seafood"],
      ingredients: ["1 pound shrimp, peeled", "2 tbsp olive oil", "1 cup onion, diced", "1/2 cup celery, diced", "3 cloves garlic, minced", "3 cups fresh corn kernels", "3 cups low-sodium chicken broth", "1 cup skim milk", "1 tbsp Mark's Creole Seasoning", "1/4 tsp cayenne", "2 tbsp cornstarch", "1/4 cup water", "2 tbsp fresh parsley"],
      instructions: ["Heat oil in large pot.", "Add onion and celery; cook until softened.", "Add garlic and cook 1 minute.", "Add corn and cook 3 minutes.", "Add broth and seasoning; simmer 15 minutes.", "Use immersion blender to partially puree soup.", "Add milk and shrimp; simmer 5 minutes.", "Mix cornstarch and water; stir into soup to thicken.", "Garnish with parsley."],
      chefNote: "Fresh summer corn makes this soup amazing, but frozen works well too.",
      flavorProfile: { heat: 5, richness: 6, tangy: 3, smoky: 3, savory: 8 }
    },
    {
      id: 25,
      name: "Stuffed Bell Peppers",
      category: "Vegetables & Grains",
      image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80",
      prepTime: 20, cookTime: 50, servings: 8,
      calories: 265, protein: "18g", carbs: "32g", fat: "7g", sodium: "420mg",
      exchanges: "1.5 starch, 2 lean meat, 2 vegetable",
      tags: ["comfort-food", "one-dish", "traditional"],
      ingredients: ["4 large red bell peppers, halved", "1 pound ground lean sirloin", "1 cup cooked rice", "1 cup onion, diced", "2 cloves garlic, minced", "1 can (14.5 oz) diced tomatoes", "1 cup tomato sauce", "1 tsp Mark's Creole Seasoning", "1/2 tsp paprika", "1/4 cup Parmesan cheese", "Cooking spray"],
      instructions: ["Preheat oven to 375°F.", "Cut peppers in half lengthwise; remove seeds.", "Microwave peppers 3 minutes until crisp-tender.", "Brown ground beef with onion and garlic.", "Stir in rice, diced tomatoes, 1/2 cup tomato sauce, and seasonings.", "Stuff pepper halves with meat mixture.", "Place in baking dish.", "Pour remaining sauce around peppers.", "Cover with foil and bake 35 minutes.", "Uncover, sprinkle with cheese, bake 10 more minutes."],
      chefNote: "These freeze beautifully - make a double batch!",
      flavorProfile: { heat: 5, richness: 6, tangy: 6, smoky: 3, savory: 8 }
    },
    {
      id: 26,
      name: "Shrimp Salad Stuffed Tomatoes",
      category: "Salads",
      image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=800&q=80",
      prepTime: 15, cookTime: 5, servings: 4,
      calories: 192, protein: "26g", carbs: "12g", fat: "5g", sodium: "504mg",
      exchanges: "1 vegetable, 3 very-lean meat",
      tags: ["salad", "light", "lunch"],
      ingredients: ["1 pound cooked shrimp, chopped", "1 celery stalk, diced", "1/4 cup fresh basil, minced", "10 Kalamata olives, chopped", "2 tbsp shallot, minced", "2 tbsp light mayonnaise", "1 tbsp white wine vinegar", "Pinch black pepper", "4 large ripe tomatoes"],
      instructions: ["Combine shrimp, celery, basil, olives, shallot, mayo, vinegar, and pepper.", "Core tomatoes.", "Carefully hollow out with melon baller.", "Fill each tomato with 1/2 cup shrimp salad.", "Serve chilled."],
      chefNote: "Save the scooped tomato insides for soup or sauce - refrigerate up to 3 days or freeze 6 months.",
      flavorProfile: { heat: 2, richness: 4, tangy: 6, smoky: 1, savory: 7 }
    },
    {
      id: 27,
      name: "Haricots Verts with Browned Garlic",
      category: "Vegetables & Grains",
      image: "https://images.unsplash.com/photo-1587411768427-f54fb3d1ce73?w=800&q=80",
      prepTime: 10, cookTime: 10, servings: 4,
      calories: 54, protein: "2g", carbs: "8.5g", fat: "3g", sodium: "226mg",
      exchanges: "1 vegetable, 1/2 fat",
      tags: ["vegetarian", "side-dish", "french"],
      ingredients: ["3/4 pound haricots verts", "2 tsp unsalted butter", "3 cloves garlic, sliced", "1 tbsp shallots, chopped", "1 tsp fresh basil", "1 tsp fresh tarragon", "1/2 tsp kosher salt", "1/4 tsp black pepper"],
      instructions: ["Bring salted water to boil.", "Add beans; cook 2-3 minutes until crisp-tender.", "Drain and plunge into ice bath.", "Melt butter in pan.", "Add garlic and shallots; cook 4 minutes until golden.", "Add beans, herbs, salt, and pepper.", "Cook 4 minutes until heated."],
      chefNote: "Haricots verts are slender French green beans - if unavailable, use regular thin green beans and cook 4 minutes.",
      flavorProfile: { heat: 1, richness: 3, tangy: 1, smoky: 2, savory: 6 }
    },
    {
      id: 28,
      name: "Roasted Tomato and Olive Stuffed Portobello Caps",
      category: "Vegetables & Grains",
      image: "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&q=80",
      prepTime: 15, cookTime: 15, servings: 4,
      calories: 122, protein: "8g", carbs: "9g", fat: "7g", sodium: "339mg",
      exchanges: "1.5 vegetable, 1/3 fat",
      tags: ["vegetarian", "grilled", "mediterranean"],
      ingredients: ["4 portobello mushroom caps (5 inches wide)", "1/3 cup sun-dried tomatoes, chopped", "1/2 cup part-skim mozzarella", "1/4 cup Kalamata olives, chopped", "1 tsp garlic, minced", "2 tsp olive oil, divided", "1/2 tsp fresh rosemary", "1/8 tsp black pepper", "2 tbsp lemon juice", "2 tsp reduced-sodium soy sauce"],
      instructions: ["Combine tomatoes, cheese, olives, garlic, 1 tsp oil, rosemary, and pepper.", "Remove mushroom stems and gills.", "Mix remaining oil, lemon juice, and soy sauce.", "Brush over mushroom caps.", "Grill caps 5 minutes per side.", "Fill with tomato mixture.", "Return to grill, cover, cook until cheese melts, 3 minutes."],
      chefNote: "These are perfect with whole-wheat couscous or grilled bread and a mixed green salad.",
      flavorProfile: { heat: 2, richness: 5, tangy: 5, smoky: 6, savory: 8 }
    },
    {
      id: 29,
      name: "Turkey Sauce Piquant",
      category: "Chicken & Poultry",
      image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80",
      prepTime: 20, cookTime: 50, servings: 6,
      calories: 245, protein: "26g", carbs: "22g", fat: "6g", sodium: "480mg",
      exchanges: "1 starch, 3 lean meat, 2 vegetable",
      tags: ["traditional", "spicy", "turkey"],
      ingredients: ["2 pounds turkey breast, cubed", "2 tbsp olive oil", "1 cup onion, diced", "1 cup celery, diced", "1 cup bell pepper, diced", "4 cloves garlic, minced", "1 can (28 oz) crushed tomatoes", "1 cup low-sodium chicken broth", "2 tbsp tomato paste", "1 tbsp Mark's Creole Seasoning", "1 tsp cayenne", "1 tsp hot sauce", "2 bay leaves", "1/4 cup green onions"],
      instructions: ["Heat oil in large pot.", "Brown turkey; remove.", "Add trinity and cook until softened.", "Add garlic; cook 1 minute.", "Stir in tomatoes, broth, paste, seasonings, cayenne, hot sauce, and bay leaves.", "Return turkey to pot.", "Simmer 40 minutes.", "Remove bay leaves.", "Garnish with green onions.", "Serve over rice."],
      chefNote: "Using turkey instead of chicken makes this dish even leaner while maintaining authentic flavor.",
      flavorProfile: { heat: 9, richness: 5, tangy: 7, smoky: 4, savory: 9 }
    },
    {
      id: 30,
      name: "Rice Pudding",
      category: "Desserts",
      image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800&q=80",
      prepTime: 10, cookTime: 60, servings: 8,
      calories: 195, protein: "5g", carbs: "38g", fat: "3g", sodium: "75mg",
      exchanges: "2.5 carbohydrate, 1/2 fat",
      tags: ["dessert", "comfort-food", "traditional"],
      ingredients: ["3 cups skim milk", "1/2 cup long-grain rice", "1/3 cup sugar substitute", "2 eggs", "1 tsp vanilla", "1/2 tsp cinnamon", "1/4 tsp nutmeg", "1/3 cup raisins", "Pinch salt"],
      instructions: ["Combine milk, rice, and salt in saucepan.", "Bring to boil, reduce heat, simmer 45 minutes, stirring occasionally.", "In bowl, whisk sugar substitute, eggs, vanilla, cinnamon, and nutmeg.", "Gradually whisk in 1 cup hot rice mixture.", "Return to pan and cook over low heat 5 minutes, stirring constantly.", "Remove from heat; stir in raisins.", "Serve warm or chilled."],
      chefNote: "This creamy, comforting dessert is perfect served warm on a cool evening or chilled in summer.",
      flavorProfile: { heat: 0, richness: 6, tangy: 1, smoky: 1, savory: 0 }
    },
    {
      id: 31,
      name: "Pain Perdu (French Toast)",
      category: "Desserts",
      image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80",
      prepTime: 10, cookTime: 15, servings: 6,
      calories: 215, protein: "8g", carbs: "36g", fat: "4g", sodium: "285mg",
      exchanges: "2 carbohydrate, 1/2 milk, 1/2 fat",
      tags: ["breakfast", "dessert", "traditional"],
      ingredients: ["6 slices day-old French bread (1-inch thick)", "2 cups skim milk", "2 eggs", "2 egg whites", "1/4 cup sugar substitute", "1 tsp vanilla", "1/2 tsp cinnamon", "1/4 tsp nutmeg", "Cooking spray", "Powdered sugar", "Fresh berries"],
      instructions: ["Whisk milk, eggs, egg whites, sugar substitute, vanilla, cinnamon, and nutmeg.", "Place bread in shallow dish.", "Pour egg mixture over bread; let soak 5 minutes per side.", "Heat griddle or skillet over medium heat; coat with cooking spray.", "Cook bread 3-4 minutes per side until golden.", "Dust with powdered sugar.", "Serve with fresh berries."],
      chefNote: "Pain Perdu means 'lost bread' - it's a wonderful way to use day-old French bread!",
      flavorProfile: { heat: 0, richness: 6, tangy: 1, smoky: 2, savory: 1 }
    },
    {
      id: 32,
      name: "Crépes Suzette",
      category: "Desserts",
      image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=800&q=80",
      prepTime: 30, cookTime: 20, servings: 8,
      calories: 245, protein: "6g", carbs: "38g", fat: "7g", sodium: "95mg",
      exchanges: "2.5 carbohydrate, 1.5 fat",
      tags: ["dessert", "elegant", "flambé", "french"],
      ingredients: ["1 cup all-purpose flour", "2 tbsp sugar", "1/4 tsp salt", "3 eggs", "1.5 cups skim milk", "2 tbsp melted butter", "Suzette Sauce: 1/4 cup butter", "1/4 cup sugar", "Juice of 2 oranges", "Zest of 1 orange", "2 oz Grand Marnier", "2 oz brandy"],
      instructions: ["Make crêpes: Whisk flour, sugar, salt, eggs, milk, and butter.", "Let rest 30 minutes.", "Heat crêpe pan; make 16 thin crêpes.", "For sauce: Melt butter with sugar until caramelized.", "Add orange juice and zest; simmer 3 minutes.", "Fold crêpes in quarters and arrange in pan.", "Add Grand Marnier and brandy.", "Carefully ignite with long match.", "Shake pan until flames subside.", "Serve immediately."],
      chefNote: "This classic French dessert is dramatic and delicious - be careful when flambéing!",
      flavorProfile: { heat: 1, richness: 8, tangy: 7, smoky: 4, savory: 1 }
    },
    {
      id: 33,
      name: "Melon Soup",
      category: "Desserts",
      image: "https://images.unsplash.com/photo-1587049332274-5af92ce9bda6?w=800&q=80",
      prepTime: 15, cookTime: 0, servings: 4,
      calories: 85, protein: "1g", carbs: "21g", fat: "0g", sodium: "15mg",
      exchanges: "1.5 fruit",
      tags: ["dessert", "refreshing", "no-cook", "summer"],
      ingredients: ["3 cups honeydew melon, cubed", "1 cup cantaloupe, cubed", "2 tbsp fresh lime juice", "1 tbsp honey", "1/4 cup fresh mint leaves", "1/2 cup plain low-fat yogurt", "Fresh mint for garnish"],
      instructions: ["Combine honeydew, cantaloupe, lime juice, honey, and mint in blender.", "Blend until smooth.", "Chill at least 2 hours.", "Pour into bowls.", "Top each with dollop of yogurt.", "Garnish with fresh mint."],
      chefNote: "This refreshing dessert soup is perfect for hot summer days - light, healthy, and elegant!",
      flavorProfile: { heat: 0, richness: 2, tangy: 6, smoky: 0, savory: 0 }
    }
  ]
};

// ============================================================================
// RESTAURANTS DATABASE
// ============================================================================

const restaurants = [
  {
    id: 1,
    name: "Commander's Palace",
    neighborhood: "Garden District",
    type: "fine-dining",
    rating: 4.7,
    priceLevel: "$$$",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    cuisines: ["Creole", "Contemporary"],
    specialties: ["Turtle Soup", "Pecan Crusted Gulf Fish", "Shrimp & Tasso Henican", "Bread Pudding Soufflé"],
    flavorProfile: { heat: 4, richness: 7, tangy: 5, smoky: 4, savory: 9 },
    dietaryOptions: { diabeticFriendly: true, glutenFree: true, healthyOptions: true, lowSodium: true },
    menu: [
      { name: "Gulf Fish Pontchartrain", ingredients: ["gulf-fish", "lump-crab", "butter", "herbs"], calories: 420, healthy: true },
      { name: "Shrimp & Tasso Henican", ingredients: ["shrimp", "tasso", "cream", "pasta"], calories: 580 }
    ],
    features: ["Outdoor seating", "Jazz brunch", "Healthy menu section"],
    cookingMethods: ["grilled", "sautéed", "roasted"],
    address: "1403 Washington Ave",
    phone: "(504) 899-8221"
  },
  {
    id: 2,
    name: "Peche Seafood Grill",
    neighborhood: "Warehouse District",
    type: "casual",
    rating: 4.6,
    priceLevel: "$$",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80",
    cuisines: ["Seafood", "Coastal"],
    specialties: ["Whole Grilled Fish", "Wood-Grilled Oysters", "Blackened Redfish", "Grilled Shrimp"],
    flavorProfile: { heat: 5, richness: 4, tangy: 4, smoky: 9, savory: 8 },
    dietaryOptions: { diabeticFriendly: true, glutenFree: true, healthyOptions: true, lowSodium: false },
    menu: [
      { name: "Whole Grilled Redfish", ingredients: ["redfish", "lemon", "herbs", "olive-oil"], calories: 340, healthy: true },
      { name: "Blackened Gulf Fish", ingredients: ["gulf-fish", "creole-seasoning", "butter"], calories: 380, healthy: true }
    ],
    features: ["Wood-fired grill", "Sustainable seafood", "Open kitchen"],
    cookingMethods: ["grilled", "blackened", "wood-fired"],
    address: "800 Magazine St",
    phone: "(504) 522-1744"
  },
  {
    id: 3,
    name: "GW Fins",
    neighborhood: "French Quarter",
    type: "fine-dining",
    rating: 4.8,
    priceLevel: "$$$",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
    cuisines: ["Seafood", "Contemporary"],
    specialties: ["Scalibut", "Wood-Grilled Gulf Fish", "Louisiana Bouillabaisse", "Lobster Dumplings"],
    flavorProfile: { heat: 3, richness: 6, tangy: 4, smoky: 6, savory: 9 },
    dietaryOptions: { diabeticFriendly: true, glutenFree: true, healthyOptions: true, lowSodium: true },
    menu: [
      { name: "Wood-Grilled Fish", ingredients: ["fresh-fish", "seasonal-vegetables", "lemon-butter"], calories: 410, healthy: true },
      { name: "Seared Scallops", ingredients: ["scallops", "sweet-potato", "brussels-sprouts"], calories: 390, healthy: true }
    ],
    features: ["Fresh fish daily", "Healthy preparations", "Wine pairings"],
    cookingMethods: ["grilled", "seared", "steamed"],
    address: "808 Bienville St",
    phone: "(504) 581-3467"
  },
  {
    id: 4,
    name: "Cochon",
    neighborhood: "Warehouse District",
    type: "casual",
    rating: 4.5,
    priceLevel: "$$",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    cuisines: ["Cajun", "Southern"],
    specialties: ["Wood-Fired Oysters", "Fried Boudin", "Cochon de Lait Po-Boy", "Louisiana Rabbit"],
    flavorProfile: { heat: 6, richness: 8, tangy: 4, smoky: 8, savory: 9 },
    dietaryOptions: { diabeticFriendly: false, glutenFree: false, healthyOptions: false, lowSodium: false },
    menu: [
      { name: "Wood-Fired Oysters", ingredients: ["oysters", "garlic-butter", "herbs"], calories: 480 },
      { name: "Fried Boudin", ingredients: ["boudin", "creole-mustard"], calories: 620 }
    ],
    features: ["Wood-fired cooking", "Cajun classics", "Craft cocktails"],
    cookingMethods: ["fried", "wood-fired", "braised"],
    address: "930 Tchoupitoulas St",
    phone: "(504) 588-2123"
  },
  {
    id: 5,
    name: "Compère Lapin",
    neighborhood: "Warehouse District",
    type: "casual",
    rating: 4.4,
    priceLevel: "$$",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    cuisines: ["Caribbean-Creole", "Fusion"],
    specialties: ["Curried Goat", "Grilled Gulf Shrimp", "Jerk Chicken", "Sweet Potato Gnocchi"],
    flavorProfile: { heat: 7, richness: 6, tangy: 6, smoky: 7, savory: 8 },
    dietaryOptions: { diabeticFriendly: true, glutenFree: true, healthyOptions: true, lowSodium: false },
    menu: [
      { name: "Grilled Gulf Shrimp", ingredients: ["gulf-shrimp", "jerk-spice", "mango"], calories: 350, healthy: true },
      { name: "Jerk Chicken", ingredients: ["chicken", "caribbean-spices", "plantains"], calories: 480, healthy: true }
    ],
    features: ["Caribbean fusion", "Bold spices", "Healthy options"],
    cookingMethods: ["grilled", "jerk", "roasted"],
    address: "535 Tchoupitoulas St",
    phone: "(504) 599-2119"
  },
  {
    id: 6,
    name: "Dooky Chase's Restaurant",
    neighborhood: "Treme",
    type: "casual",
    rating: 4.6,
    priceLevel: "$$",
    cuisines: ["Creole", "Soul Food"],
    specialties: ["Gumbo Z'Herbes", "Fried Chicken", "Shrimp Clemenceau", "Stuffed Shrimp"],
    flavorProfile: { heat: 6, richness: 8, tangy: 5, smoky: 5, savory: 10 },
    dietaryOptions: { diabeticFriendly: false, glutenFree: false, healthyOptions: false, lowSodium: false },
    menu: [
      { name: "Gumbo Z'Herbes", ingredients: ["greens", "seafood", "roux"], calories: 420 },
      { name: "Fried Chicken", ingredients: ["chicken", "seasoning"], calories: 580 }
    ],
    features: ["Historic restaurant", "Traditional Creole", "Art gallery"],
    cookingMethods: ["fried", "stewed", "sautéed"],
    address: "2301 Orleans Ave",
    phone: "(504) 821-0600"
  }
];

// ============================================================================
// EVENTS DATABASE
// ============================================================================

const events = [
  {
    id: 1,
    name: "French Quarter Festival",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
    type: "festival",
    date: "April 10-13, 2025",
    location: "French Quarter",
    cuisines: ["Creole", "Cajun", "Regional"],
    featuredIngredients: ["shrimp", "oysters", "crawfish", "catfish"],
    style: "festival",
    price: "Free admission",
    description: "Louisiana's largest free music festival featuring 60+ food booths",
    dietaryOptions: { healthyOptions: true, vegetarian: true },
    highlights: ["Grilled shrimp po-boys", "Crawfish Monica", "Oyster shooters", "Fresh seafood plates"],
    flavorProfile: { heat: 6, richness: 6, smoky: 7 }
  },
  {
    id: 2,
    name: "Oak Street Po-Boy Festival",
    type: "festival",
    date: "November 15, 2025",
    location: "Oak Street",
    cuisines: ["Creole", "Traditional"],
    featuredIngredients: ["shrimp", "oysters", "roast-beef", "catfish"],
    style: "street",
    price: "Free admission",
    description: "Celebrating New Orleans' iconic sandwich",
    dietaryOptions: { healthyOptions: false, vegetarian: false },
    highlights: ["Fried shrimp po-boys", "Grilled fish po-boys", "Creative variations", "Live music"],
    flavorProfile: { heat: 5, richness: 8, smoky: 6 }
  },
  {
    id: 3,
    name: "New Orleans School of Cooking Class",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80",
    type: "cooking-class",
    date: "Ongoing - Book anytime",
    location: "French Quarter",
    cuisines: ["Creole"],
    featuredIngredients: ["trinity", "roux", "shrimp", "okra"],
    style: "casual",
    price: "$35-75",
    description: "Learn to make authentic Creole dishes from expert chefs",
    dietaryOptions: { diabeticFriendly: true, healthyOptions: true, customizable: true },
    highlights: ["Learn the holy trinity", "Master roux techniques", "Make gumbo from scratch", "Healthy cooking tips"],
    flavorProfile: { heat: 6, richness: 5, smoky: 6 }
  },
  {
    id: 4,
    name: "Tales of the Cocktail",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
    type: "fine-dining-event",
    date: "July 22-27, 2025",
    location: "Various locations",
    cuisines: ["Contemporary", "Fine Dining"],
    featuredIngredients: ["seasonal", "local", "premium"],
    style: "fine-dining",
    price: "$$$",
    description: "Premier cocktail and culinary event with top chefs and mixologists",
    dietaryOptions: { diabeticFriendly: true, healthyOptions: true, vegetarian: true },
    highlights: ["Celebrity chef dinners", "Craft cocktail seminars", "Food & drink pairings", "Industry networking"],
    flavorProfile: { heat: 4, richness: 8, smoky: 5 }
  },
  {
    id: 5,
    name: "Crescent City Blues & BBQ Festival",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    type: "bbq-festival",
    date: "October 17-19, 2025",
    location: "Lafayette Square",
    cuisines: ["BBQ", "Southern"],
    featuredIngredients: ["pork", "chicken", "beef", "fish"],
    style: "festival",
    price: "Free admission",
    description: "Blues music and authentic BBQ from local pitmasters",
    dietaryOptions: { healthyOptions: false, vegetarian: false },
    highlights: ["Smoked meats", "Grilled seafood", "Local BBQ competitions", "Live blues music"],
    flavorProfile: { heat: 6, richness: 9, smoky: 10 }
  }
];

// ============================================================================
// TASTE MATCHING ENGINE
// ============================================================================

class TasteProfile {
  constructor() {
    this.preferences = {
      dietary: { diabeticFriendly: false, heartHealthy: false, lowSodium: false },
      flavors: { heat: 5, richness: 5, tangy: 5, smoky: 5, savory: 5 },
      ingredients: { loved: [], liked: [], disliked: [] },
      dishTypes: { gumbo: 5, seafood: 5, blackened: 5, grilled: 5, desserts: 5 },
      cookingMethods: { grilled: 5, blackened: 5, fried: 5, stewed: 5 }
    };
    this.recipeHistory = [];
  }
  
  learnFromRecipe(recipe, rating) {
    this.recipeHistory.push({ recipe, rating, timestamp: new Date() });
    
    // Update flavor preferences based on rating
    const profile = recipe.flavorProfile;
    const impact = (rating - 5) * 0.3;
    
    this.preferences.flavors.heat += profile.heat * impact / 10;
    this.preferences.flavors.richness += profile.richness * impact / 10;
    this.preferences.flavors.tangy += profile.tangy * impact / 10;
    this.preferences.flavors.smoky += profile.smoky * impact / 10;
    this.preferences.flavors.savory += profile.savory * impact / 10;
    
    // Update dish type preferences
    if (recipe.category === 'Soups & Gumbos') {
      this.preferences.dishTypes.gumbo += impact;
    }
    if (recipe.category === 'Shellfish & Fish') {
      this.preferences.dishTypes.seafood += impact;
    }
    if (recipe.tags.includes('blackened') || recipe.tags.includes('cajun')) {
      this.preferences.dishTypes.blackened += impact;
    }
    if (recipe.tags.includes('grilled')) {
      this.preferences.dishTypes.grilled += impact;
    }
    if (recipe.category === 'Desserts') {
      this.preferences.dishTypes.desserts += impact;
    }
    
    // Update ingredient preferences
    recipe.ingredients.forEach(ingredient => {
      const key = ingredient.toLowerCase().split(/[\s,]+/).find(w => 
        ['shrimp', 'crab', 'oysters', 'redfish', 'chicken', 'andouille', 'okra'].includes(w)
      );
      if (key) {
        if (rating >= 8 && !this.preferences.ingredients.loved.includes(key)) {
          this.preferences.ingredients.loved.push(key);
        } else if (rating >= 6 && !this.preferences.ingredients.liked.includes(key)) {
          this.preferences.ingredients.liked.push(key);
        } else if (rating <= 3 && !this.preferences.ingredients.disliked.includes(key)) {
          this.preferences.ingredients.disliked.push(key);
        }
      }
    });
    
    // Update dietary preferences
    if (recipe.calories < 250) this.preferences.dietary.heartHealthy = true;
    if (parseInt(recipe.sodium) < 400) this.preferences.dietary.lowSodium = true;
    
    // Normalize
    Object.keys(this.preferences.flavors).forEach(k => {
      this.preferences.flavors[k] = Math.max(0, Math.min(10, this.preferences.flavors[k]));
    });
    Object.keys(this.preferences.dishTypes).forEach(k => {
      this.preferences.dishTypes[k] = Math.max(0, Math.min(10, this.preferences.dishTypes[k]));
    });
  }
  
  calculateRestaurantMatch(restaurant) {
    let score = 0;
    
    // Dietary (30%)
    let dietaryScore = 10;
    if (this.preferences.dietary.diabeticFriendly && !restaurant.dietaryOptions.diabeticFriendly) dietaryScore -= 3;
    if (this.preferences.dietary.heartHealthy && !restaurant.dietaryOptions.healthyOptions) dietaryScore -= 2;
    if (this.preferences.dietary.lowSodium && !restaurant.dietaryOptions.lowSodium) dietaryScore -= 2;
    score += (dietaryScore / 10) * 30;
    
    // Flavor match (25%)
    const heatDiff = Math.abs(this.preferences.flavors.heat - restaurant.flavorProfile.heat);
    const richDiff = Math.abs(this.preferences.flavors.richness - restaurant.flavorProfile.richness);
    const smokyDiff = Math.abs(this.preferences.flavors.smoky - restaurant.flavorProfile.smoky);
    const flavorScore = (10 - heatDiff + 10 - richDiff + 10 - smokyDiff) / 3;
    score += (flavorScore / 10) * 25;
    
    // Ingredient match (20%)
    let ingredientScore = 5;
    this.preferences.ingredients.loved.forEach(ing => {
      if (restaurant.menu.some(m => m.ingredients.some(i => i.includes(ing)))) ingredientScore += 1.5;
    });
    this.preferences.ingredients.disliked.forEach(ing => {
      if (restaurant.menu.some(m => m.ingredients.some(i => i.includes(ing)))) ingredientScore -= 1;
    });
    score += (Math.min(10, Math.max(0, ingredientScore)) / 10) * 20;
    
    // Cooking method match (15%)
    let methodScore = 5;
    if (restaurant.cookingMethods.includes('grilled') && this.preferences.dishTypes.grilled >= 7) methodScore += 2;
    if (restaurant.cookingMethods.includes('blackened') && this.preferences.dishTypes.blackened >= 7) methodScore += 2;
    if (restaurant.cookingMethods.includes('fried') && this.preferences.dishTypes.grilled >= 7) methodScore -= 1;
    score += (methodScore / 10) * 15;
    
    // Specialty match (10%)
    let specialtyScore = 5;
    restaurant.specialties.forEach(spec => {
      const lower = spec.toLowerCase();
      if (lower.includes('seafood') && this.preferences.dishTypes.seafood >= 7) specialtyScore += 1;
      if (lower.includes('gumbo') && this.preferences.dishTypes.gumbo >= 7) specialtyScore += 1;
      if (lower.includes('blackened') && this.preferences.dishTypes.blackened >= 7) specialtyScore += 1;
    });
    score += (Math.min(10, specialtyScore) / 10) * 10;
    
    return Math.round(score);
  }
  
  calculateEventMatch(event) {
    let score = 0;
    
    // Dietary (25%)
    let dietaryScore = 10;
    if (this.preferences.dietary.diabeticFriendly && !event.dietaryOptions?.diabeticFriendly) dietaryScore -= 2;
    if (this.preferences.dietary.heartHealthy && !event.dietaryOptions?.healthyOptions) dietaryScore -= 2;
    score += (dietaryScore / 10) * 25;
    
    // Featured ingredients (35%)
    let ingredientScore = 5;
    event.featuredIngredients?.forEach(ing => {
      if (this.preferences.ingredients.loved.includes(ing)) ingredientScore += 2;
      if (this.preferences.ingredients.liked.includes(ing)) ingredientScore += 1;
      if (this.preferences.ingredients.disliked.includes(ing)) ingredientScore -= 1;
    });
    score += (Math.min(10, Math.max(0, ingredientScore)) / 10) * 35;
    
    // Flavor match (20%)
    if (event.flavorProfile) {
      const heatDiff = Math.abs(this.preferences.flavors.heat - event.flavorProfile.heat);
      const richDiff = Math.abs(this.preferences.flavors.richness - event.flavorProfile.richness);
      const smokyDiff = Math.abs(this.preferences.flavors.smoky - event.flavorProfile.smoky);
      const flavorScore = (10 - heatDiff + 10 - richDiff + 10 - smokyDiff) / 3;
      score += (flavorScore / 10) * 20;
    } else {
      score += 10;
    }
    
    // Event type match (20%)
    let typeScore = 5;
    if (event.type === 'cooking-class') typeScore += 3;
    if (event.type === 'festival' && event.featuredIngredients?.some(i => this.preferences.ingredients.loved.includes(i))) typeScore += 2;
    score += (typeScore / 10) * 20;
    
    return Math.round(score);
  }
  
  getMatchReasons(restaurant) {
    const reasons = [];
    
    if (restaurant.dietaryOptions.diabeticFriendly && this.preferences.dietary.diabeticFriendly) {
      reasons.push({ icon: <Heart className="w-4 h-4" />, text: "Diabetic-friendly menu" });
    }
    
    if (restaurant.dietaryOptions.healthyOptions && this.preferences.dietary.heartHealthy) {
      reasons.push({ icon: <Leaf className="w-4 h-4" />, text: "Heart-healthy options" });
    }
    
    const loved = this.preferences.ingredients.loved.filter(ing =>
      restaurant.menu.some(m => m.ingredients.some(i => i.includes(ing)))
    );
    if (loved.length > 0) {
      reasons.push({ icon: <Star className="w-4 h-4" />, text: `Features ${loved.slice(0, 2).join(', ')}` });
    }
    
    if (restaurant.cookingMethods.includes('grilled') || restaurant.cookingMethods.includes('blackened')) {
      reasons.push({ icon: <Flame className="w-4 h-4" />, text: "Grilled & blackened specialties" });
    }
    
    return reasons.slice(0, 3);
  }
}

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

const NewOrleansChefApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [neighborhoodFilter, setNeighborhoodFilter] = useState('All');
  const [tasteProfile] = useState(() => new TasteProfile());
  const [recipeRatings, setRecipeRatings] = useState({});
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Get unique categories
  const categories = ['All', ...new Set(cookbook.recipes.map(r => r.category))];
  
  // Filter recipes
  const filteredRecipes = useMemo(() => {
    return cookbook.recipes.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = categoryFilter === 'All' || recipe.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);
  
  // Calculate restaurant matches
  const restaurantMatches = useMemo(() => {
    return restaurants.map(r => ({
      ...r,
      matchScore: tasteProfile.calculateRestaurantMatch(r),
      matchReasons: tasteProfile.getMatchReasons(r)
    })).sort((a, b) => b.matchScore - a.matchScore);
  }, [tasteProfile.recipeHistory.length]);
  
  // Calculate event matches
  const eventMatches = useMemo(() => {
    return events.map(e => ({
      ...e,
      matchScore: tasteProfile.calculateEventMatch(e)
    })).sort((a, b) => b.matchScore - a.matchScore);
  }, [tasteProfile.recipeHistory.length]);
  
  // Handle recipe rating
  const handleRecipeRating = (recipe, rating) => {
    setRecipeRatings(prev => ({ ...prev, [recipe.id]: rating }));
    tasteProfile.learnFromRecipe(recipe, rating);
  };
  
  // Recipe Card Component
  const RecipeCard = ({ recipe }) => (
    <div 
      onClick={() => setSelectedRecipe(recipe)}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-burgundy"
    >
      <div className="h-48 bg-gradient-to-br from-burgundy to-gold overflow-hidden">
        <img 
          src={recipe.image} 
          alt={recipe.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-burgundy mb-2 group-hover:text-gold transition-colors">
          {recipe.name}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Clock className="w-4 h-4" />
          <span>{recipe.prepTime + recipe.cookTime} min</span>
          <Users className="w-4 h-4 ml-2" />
          <span>{recipe.servings} servings</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-600" />
            <span className="text-sm font-bold text-burgundy">{recipe.calories} cal</span>
          </div>
          {recipeRatings[recipe.id] && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span className="text-sm font-bold text-amber-600">{recipeRatings[recipe.id]}/10</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {recipe.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-xs bg-cream text-burgundy px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
  
  // Recipe Detail Modal
  const RecipeDetail = ({ recipe, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="relative h-64 bg-gradient-to-br from-burgundy to-gold overflow-hidden">
          <img 
            src={recipe.image} 
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <h2 className="absolute bottom-6 left-8 text-4xl font-bold text-white">{recipe.name}</h2>
          <button onClick={onClose} className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-8">
          <p className="text-gray-600 mb-6">{recipe.category}</p>
          
          {/* Rating */}
          <div className="bg-cream rounded-2xl p-6 mb-6">
            <p className="text-burgundy font-semibold mb-3">Rate this recipe:</p>
            <div className="flex gap-2">
              {[1,2,3,4,5,6,7,8,9,10].map(rating => (
                <button
                  key={rating}
                  onClick={() => handleRecipeRating(recipe, rating)}
                  className={`w-10 h-10 rounded-lg font-bold transition-all ${
                    recipeRatings[recipe.id] === rating
                      ? 'bg-gold text-white scale-110'
                      : 'bg-white text-burgundy hover:bg-burgundy hover:text-white'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>
          
          {/* Nutrition */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <Flame className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{recipe.calories}</div>
              <div className="text-xs text-gray-600">Calories</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{recipe.protein}</div>
              <div className="text-xs text-gray-600">Protein</div>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">{recipe.carbs}</div>
              <div className="text-xs text-gray-600">Carbs</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{recipe.fat}</div>
              <div className="text-xs text-gray-600">Fat</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{recipe.sodium}</div>
              <div className="text-xs text-gray-600">Sodium</div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Ingredients */}
            <div>
              <h3 className="text-2xl font-bold text-burgundy mb-4 flex items-center gap-2">
                <Utensils className="w-6 h-6" /> Ingredients
              </h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-gold mt-1">⚜</span>
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Instructions */}
            <div>
              <h3 className="text-2xl font-bold text-burgundy mb-4">Instructions</h3>
              <ol className="space-y-3">
                {recipe.instructions.map((step, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-burgundy text-white rounded-full flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span className="pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          
          {/* Chef's Note */}
          {recipe.chefNote && (
            <div className="mt-6 bg-amber-50 border-l-4 border-gold p-6 rounded-r-xl">
              <div className="flex gap-3">
                <ChefHat className="w-6 h-6 text-gold flex-shrink-0" />
                <div>
                  <p className="font-bold text-burgundy mb-2">Chef Mark's Note:</p>
                  <p className="text-gray-700 italic">{recipe.chefNote}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  // Restaurant Card Component
  const RestaurantCard = ({ restaurant }) => (
    <div 
      onClick={() => setSelectedRestaurant(restaurant)}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-burgundy"
    >
      <div className="h-48 bg-gradient-to-br from-burgundy via-red-800 to-burgundy overflow-hidden relative">
        {restaurant.image ? (
          <img 
            src={restaurant.image} 
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat className="w-24 h-24 text-cream opacity-30" />
          </div>
        )}
        <div className="absolute top-3 right-3 bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-bold shadow-lg">
          {restaurant.matchScore}%
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-xl font-bold text-burgundy">{restaurant.name}</h3>
            <p className="text-sm text-gray-600">{restaurant.neighborhood} • {restaurant.priceLevel}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-amber-500 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < Math.floor(restaurant.rating) ? 'fill-current' : ''}`} />
          ))}
          <span className="text-gray-600 text-sm ml-1">{restaurant.rating}</span>
        </div>
        
        <div className="space-y-2 mb-4">
          <p className="text-xs font-semibold text-gray-700 uppercase">Why you'll love it:</p>
          {restaurant.matchReasons.map((reason, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
              {reason.icon}
              <span>{reason.text}</span>
            </div>
          ))}
        </div>
        
        <div className="pt-4 border-t border-gray-200 space-y-3">
          <div className="flex flex-wrap gap-1">
            {restaurant.cuisines.map(cuisine => (
              <span key={cuisine} className="text-xs bg-cream text-burgundy px-2 py-1 rounded-full">
                {cuisine}
              </span>
            ))}
          </div>
          
          <a 
            href={`tel:${restaurant.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-burgundy font-semibold hover:text-gold transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {restaurant.phone}
          </a>
        </div>
      </div>
    </div>
  );
  
  // Event Card Component
  const EventCard = ({ event }) => {
    const getEventMatchReasons = () => {
      const reasons = [];
      
      if (tasteProfile.recipeHistory.length > 0) {
        // Check featured ingredients
        const lovedIngredients = event.featuredIngredients?.filter(ing =>
          tasteProfile.preferences.ingredients.loved.includes(ing)
        ) || [];
        
        if (lovedIngredients.length > 0) {
          reasons.push(`Features ${lovedIngredients.slice(0, 2).join(', ')}`);
        }
        
        // Check dietary options
        if (tasteProfile.preferences.dietary.heartHealthy && event.dietaryOptions?.healthyOptions) {
          reasons.push('Offers healthy options');
        }
        
        // Check heat preference match
        if (event.flavorProfile && Math.abs(tasteProfile.preferences.flavors.heat - event.flavorProfile.heat) <= 2) {
          reasons.push('Matches your spice preference');
        }
      }
      
      return reasons.slice(0, 3);
    };
    
    const matchReasons = getEventMatchReasons();
    
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-gold">
        <div className="h-48 bg-gradient-to-br from-purple-600 to-pink-600 overflow-hidden relative">
          {event.image ? (
            <img 
              src={event.image} 
              alt={event.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="w-16 h-16 text-white opacity-30" />
            </div>
          )}
          {tasteProfile.recipeHistory.length > 0 && (
            <div className="absolute top-3 right-3 bg-purple-100 text-purple-800 px-3 py-2 rounded-full text-sm font-bold shadow-lg">
              {event.matchScore}%
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-burgundy mb-1">{event.name}</h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Calendar className="w-4 h-4" /> {event.date}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {event.location}
              </p>
            </div>
          </div>
          
          <p className="text-gray-700 text-sm mb-3">{event.description}</p>
          
          {matchReasons.length > 0 && (
            <div className="mb-3 p-3 bg-purple-50 rounded-lg">
              <p className="text-xs font-semibold text-purple-900 uppercase mb-2">Why you'll enjoy this:</p>
              {matchReasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-gray-700 mb-1">
                  <Star className="w-3 h-3 text-gold mt-1 flex-shrink-0" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="space-y-1 mb-3">
            <p className="text-xs font-semibold text-gray-700">Highlights:</p>
            {event.highlights.slice(0, 3).map((highlight, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-gold mt-0.5">⚜</span>
                <span>{highlight}</span>
              </div>
            ))}
          </div>
          
          <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm font-bold text-burgundy">{event.price}</span>
            <div className="flex gap-2">
              {event.dietaryOptions.healthyOptions && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Healthy options
                </span>
              )}
              {event.dietaryOptions.vegetarian && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Vegetarian
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Home Tab Content
  const HomeContent = () => (
    <div>
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-burgundy via-red-900 to-burgundy text-white rounded-3xl p-12 mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <ChefHat className="w-16 h-16 text-gold" />
            <div>
              <h1 className="text-5xl font-bold mb-2 text-white">NewOrleansChef.com</h1>
              <p className="text-2xl text-amber-300">A Guide to Healthy(er) Dining in the Crescent City</p>
            </div>
          </div>
          <p className="text-xl text-white max-w-2xl mb-6">
            Discover restaurants and food events perfectly matched to YOUR taste! Rate our healthy 
            Creole-Cajun recipes to unlock personalized recommendations across New Orleans.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setActiveTab('dining')}
              className="px-8 py-4 bg-gold text-burgundy rounded-xl font-bold hover:bg-amber-400 transition-all text-lg"
            >
              Explore Restaurants →
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className="px-8 py-4 bg-white text-burgundy rounded-xl font-bold hover:bg-gray-100 transition-all text-lg"
            >
              Find Events →
            </button>
          </div>
        </div>
      </div>
      
      {/* Quick Stats */}
      {tasteProfile.recipeHistory.length > 0 && (
        <div className="bg-cream rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-burgundy mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" /> Your Taste Journey
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-burgundy">{tasteProfile.recipeHistory.length}</div>
              <div className="text-sm text-gray-600">Recipes Rated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gold">{tasteProfile.preferences.ingredients.loved.length}</div>
              <div className="text-sm text-gray-600">Loved Ingredients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600">{Math.round(tasteProfile.preferences.flavors.heat)}/10</div>
              <div className="text-sm text-gray-600">Heat Preference</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">{restaurantMatches.filter(r => r.matchScore >= 80).length}</div>
              <div className="text-sm text-gray-600">Great Matches</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Featured Recipes */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-burgundy mb-6 flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-gold" /> Featured Recipes
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {cookbook.recipes.slice(2, 5).map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
      
      {/* Top Restaurant Match */}
      {tasteProfile.recipeHistory.length > 0 && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-burgundy mb-6 flex items-center gap-2">
            <Award className="w-8 h-8 text-gold" /> Your Top Match
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <RestaurantCard restaurant={restaurantMatches[0]} />
            {eventMatches[0] && <EventCard event={eventMatches[0]} />}
          </div>
        </div>
      )}
      
      {/* About */}
      <div className="bg-gradient-to-r from-amber-50 to-red-50 rounded-3xl p-8 border-2 border-gold">
        <div className="flex gap-6">
          <ChefHat className="w-16 h-16 text-gold flex-shrink-0" />
          <div>
            <h3 className="text-2xl font-bold text-burgundy mb-3">About Our Healthy Recipes</h3>
            <p className="text-gray-700 mb-4">
              Our recipe collection revolutionizes New Orleans cooking with diabetic-friendly dishes 
              that maintain authentic Creole-Cajun flavors. Using innovative techniques like oven-roasted 
              roux and reduced-sodium seasonings, we prove you can 
              <strong> Cut the Fat, Cut the Salt, and Keep the Flavor!</strong>
            </p>
            <p className="text-gray-700">
              Each recipe includes nutritional values and diabetic exchanges based on American Diabetes 
              Association guidelines. Your recipe preferences power personalized restaurant and event 
              recommendations across New Orleans!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Recipes Tab Content
  const RecipesContent = () => (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-burgundy mb-2">Healthy Recipes</h1>
        <p className="text-gray-600 text-lg">
          From Chef Mark C. Gasquet's "Healthy New Orleans Cuisine" • Rate recipes to unlock personalized dining recommendations
        </p>
      </div>
      
      {/* Rating Callout */}
      <div className="bg-gradient-to-r from-gold to-amber-400 text-white rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="bg-white bg-opacity-20 rounded-full p-3">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">How Rating Works</h3>
            <p className="mb-3 text-white text-opacity-90">
              Each recipe you rate teaches our algorithm about your preferences. We analyze:
            </p>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4" />
                <span>Heat & spice levels</span>
              </div>
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4" />
                <span>Ingredient preferences</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>Dish type preferences</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4" />
                <span>Dietary needs</span>
              </div>
            </div>
            {tasteProfile.recipeHistory.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white border-opacity-30">
                <p className="font-semibold">
                  ✓ You've rated {tasteProfile.recipeHistory.length} recipe{tasteProfile.recipeHistory.length !== 1 ? 's' : ''} 
                  {' '}• {restaurantMatches.filter(r => r.matchScore >= 80).length} restaurant matches unlocked!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Search & Filter */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-burgundy focus:outline-none"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-6 py-3 border-2 border-gray-200 rounded-xl focus:border-burgundy focus:outline-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Recipe Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
      
      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No recipes found. Try different filters!</p>
        </div>
      )}
    </div>
  );
  
  // Dining Tab Content
  const DiningContent = () => (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-burgundy mb-2">Dining in New Orleans</h1>
        <p className="text-gray-600 text-lg">
          {tasteProfile.recipeHistory.length > 0 
            ? `${tasteProfile.recipeHistory.length} recipe rating${tasteProfile.recipeHistory.length !== 1 ? 's' : ''} analyzed • Personalized matches below`
            : 'Rate recipes in the "Healthy Recipes" tab to unlock personalized restaurant recommendations!'}
        </p>
      </div>
      
      {/* How It Works */}
      {tasteProfile.recipeHistory.length === 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 mb-8 border-2 border-gold">
          <div className="flex items-start gap-4">
            <div className="bg-gold rounded-full p-3">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-burgundy mb-2">How It Works</h3>
              <ol className="space-y-2 text-gray-700">
                <li className="flex gap-2">
                  <span className="font-bold text-burgundy">1.</span>
                  <span>Browse recipes in the <strong>Healthy Recipes</strong> tab</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-burgundy">2.</span>
                  <span>Rate recipes 1-10 based on your preferences</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-burgundy">3.</span>
                  <span>Our algorithm learns your taste profile (heat level, richness, ingredients)</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-burgundy">4.</span>
                  <span>Get personalized restaurant recommendations with match scores</span>
                </li>
              </ol>
              <button
                onClick={() => setActiveTab('recipes')}
                className="mt-4 px-6 py-3 bg-burgundy text-white rounded-xl font-semibold hover:bg-red-900 transition-all"
              >
                Start Rating Recipes →
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Taste Profile Summary */}
      {tasteProfile.recipeHistory.length > 0 && (
        <div className="bg-cream rounded-2xl p-6 mb-8 border-2 border-gold">
          <h3 className="text-xl font-bold text-burgundy mb-4">Your Taste Profile</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Heat Preference</p>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-600" />
                <span className="text-2xl font-bold text-burgundy">{Math.round(tasteProfile.preferences.flavors.heat)}/10</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Loved Ingredients</p>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600" />
                <span className="text-2xl font-bold text-burgundy">{tasteProfile.preferences.ingredients.loved.length}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Recipes Rated</p>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                <span className="text-2xl font-bold text-burgundy">{tasteProfile.recipeHistory.length}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Great Matches</p>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-gold" />
                <span className="text-2xl font-bold text-burgundy">{restaurantMatches.filter(r => r.matchScore >= 80).length}</span>
              </div>
            </div>
          </div>
          {tasteProfile.preferences.ingredients.loved.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gold">
              <p className="text-sm text-gray-600 mb-2">You love:</p>
              <div className="flex flex-wrap gap-2">
                {tasteProfile.preferences.ingredients.loved.map(ing => (
                  <span key={ing} className="bg-white text-burgundy px-3 py-1 rounded-full text-sm font-semibold border-2 border-burgundy">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Neighborhood Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-burgundy mb-3">Filter by Neighborhood:</h3>
        <div className="flex flex-wrap gap-2">
          {['All', 'French Quarter', 'Garden District', 'Warehouse District', 'Treme'].map(neighborhood => (
            <button
              key={neighborhood}
              onClick={() => setNeighborhoodFilter(neighborhood)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                neighborhoodFilter === neighborhood
                  ? 'bg-burgundy text-white'
                  : 'bg-white text-burgundy border-2 border-burgundy hover:bg-burgundy hover:text-white'
              }`}
            >
              {neighborhood}
            </button>
          ))}
        </div>
      </div>
      
      {/* Restaurant Grid */}
      <h2 className="text-2xl font-bold text-burgundy mb-4">
        {tasteProfile.recipeHistory.length > 0 ? 'Your Personalized Matches' : 'Featured Restaurants'}
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurantMatches
          .filter(r => neighborhoodFilter === 'All' || r.neighborhood === neighborhoodFilter)
          .map(restaurant => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
      </div>
    </div>
  );
  
  // Events Tab Content
  const EventsContent = () => (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-burgundy mb-2">Food Events & Festivals</h1>
        <p className="text-gray-600 text-lg">
          {tasteProfile.recipeHistory.length > 0 
            ? `Events matched to your taste preferences • ${eventMatches.filter(e => e.matchScore >= 80).length} great matches found`
            : 'Discover New Orleans food culture! Rate recipes to get personalized event recommendations.'}
        </p>
      </div>
      
      {/* How Events Are Matched */}
      {tasteProfile.recipeHistory.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border-2 border-purple-300">
          <div className="flex items-start gap-4">
            <Calendar className="w-12 h-12 text-purple-600 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-burgundy mb-2">Events Matched to Your Taste</h3>
              <p className="text-gray-700 mb-3">
                Based on your {tasteProfile.recipeHistory.length} recipe ratings, we're recommending events that feature 
                ingredients you love and match your flavor preferences.
              </p>
              {tasteProfile.preferences.ingredients.loved.length > 0 && (
                <p className="text-sm text-gray-600">
                  <strong>Looking for:</strong> Events featuring {tasteProfile.preferences.ingredients.loved.slice(0, 3).join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        {eventMatches.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      
      {tasteProfile.recipeHistory.length === 0 && (
        <div className="mt-8 text-center bg-cream rounded-2xl p-8">
          <Calendar className="w-16 h-16 text-burgundy mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-burgundy mb-2">Want Personalized Event Recommendations?</h3>
          <p className="text-gray-700 mb-4">
            Rate some recipes to help us understand your preferences, and we'll recommend 
            events that match your taste!
          </p>
          <button
            onClick={() => setActiveTab('recipes')}
            className="px-8 py-4 bg-burgundy text-white rounded-xl font-bold hover:bg-red-900 transition-all"
          >
            Rate Recipes Now →
          </button>
        </div>
      )}
    </div>
  );
  
  // Explore NOLA Tab Content
  const ExploreContent = () => {
    const neighborhoods = [
      {
        name: 'French Quarter',
        description: 'Historic heart of New Orleans with iconic restaurants and jazz clubs',
        highlights: ['Café Du Monde', 'Central Grocery (Muffuletta)', 'Court of Two Sisters', 'Bourbon Street'],
        icon: '🎺',
        color: 'from-purple-600 to-indigo-600'
      },
      {
        name: 'Garden District',
        description: 'Elegant mansions and upscale dining in a picturesque setting',
        highlights: ["Commander's Palace", 'Magazine Street cafes', 'Lafayette Cemetery', 'Architectural tours'],
        icon: '🌺',
        color: 'from-green-600 to-emerald-600'
      },
      {
        name: 'Warehouse District',
        description: 'Modern art galleries, craft breweries, and contemporary cuisine',
        highlights: ['Peche Seafood Grill', 'Cochon', 'Compère Lapin', 'WWII Museum area'],
        icon: '🎨',
        color: 'from-orange-600 to-red-600'
      },
      {
        name: 'Treme',
        description: "America's oldest Black neighborhood with soul food and jazz heritage",
        highlights: ["Dooky Chase's Restaurant", "Li'l Dizzy's", 'Backstreet Cultural Museum', 'Congo Square'],
        icon: '🎷',
        color: 'from-yellow-600 to-amber-600'
      },
      {
        name: 'Bywater',
        description: 'Hip, artistic neighborhood with eclectic eateries and live music',
        highlights: ['The Joint BBQ', "Elizabeth's Restaurant", 'Bacchanal Wine', 'Street art tours'],
        icon: '🎪',
        color: 'from-pink-600 to-rose-600'
      },
      {
        name: 'Marigny',
        description: 'Bohemian vibe with Frenchmen Street jazz and Creole cuisine',
        highlights: ['Frenchmen Street clubs', "Adolfo's", 'The Spotted Cat', 'Washington Square Park'],
        icon: '🎭',
        color: 'from-blue-600 to-cyan-600'
      }
    ];
    
    const culinaryTrails = [
      {
        name: 'Po-Boy Trail',
        description: 'Follow the best traditional po-boy shops across the city',
        stops: ['Parkway Bakery', "Domilise's", "Mother's Restaurant", 'Killer Poboys'],
        icon: '🥖'
      },
      {
        name: 'Beignet & Coffee Route',
        description: 'Experience New Orleans coffee culture and sweet treats',
        stops: ['Café Du Monde', 'Café Beignet', 'Morning Call', 'French Truck Coffee'],
        icon: '☕'
      },
      {
        name: 'Seafood Journey',
        description: 'Gulf Coast seafood at its finest locations',
        stops: ["Casamento's", "Drago's Charbroiled Oysters", 'GW Fins', 'Peche'],
        icon: '🦐'
      },
      {
        name: 'Classic Cocktail Circuit',
        description: 'Historic bars where iconic cocktails were invented',
        stops: ['Carousel Bar (Sazerac)', "Tujague's (Grasshopper)", "Napoleon House (Pimm's Cup)", "Pat O'Brien's (Hurricane)"],
        icon: '🍸'
      }
    ];
    
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-burgundy mb-2">Explore New Orleans</h1>
          <p className="text-gray-600">Discover neighborhoods and culinary trails in the Crescent City</p>
        </div>
        
        {/* Neighborhoods */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-burgundy mb-6 flex items-center gap-2">
            <MapPin className="w-8 h-8 text-gold" /> Neighborhoods
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {neighborhoods.map(neighborhood => (
              <div key={neighborhood.name} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
                <div className={`h-32 bg-gradient-to-br ${neighborhood.color} flex items-center justify-center`}>
                  <span className="text-6xl">{neighborhood.icon}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-burgundy mb-2">{neighborhood.name}</h3>
                  <p className="text-gray-700 mb-4">{neighborhood.description}</p>
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-800 text-sm">Must-Visit:</p>
                    {neighborhood.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-gold mt-0.5">⚜</span>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Culinary Trails */}
        <div>
          <h2 className="text-3xl font-bold text-burgundy mb-6 flex items-center gap-2">
            <Coffee className="w-8 h-8 text-gold" /> Culinary Trails
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {culinaryTrails.map(trail => (
              <div key={trail.name} className="bg-gradient-to-br from-cream to-amber-50 rounded-2xl p-6 border-2 border-gold shadow-lg">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-5xl">{trail.icon}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-burgundy mb-1">{trail.name}</h3>
                    <p className="text-gray-700">{trail.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-burgundy text-sm">Route Stops:</p>
                  {trail.stops.map((stop, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-burgundy text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <span className="text-gray-700">{stop}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-cream to-red-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-burgundy to-red-900 text-white shadow-2xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <ChefHat className="w-10 h-10 text-gold" />
              <div className="hidden md:block">
                <div className="text-2xl font-bold">NewOrleansChef.com</div>
                <div className="text-xs text-amber-200">By Chef Mark C. Gasquet</div>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'home' 
                    ? 'bg-gold text-burgundy' 
                    : 'text-white hover:bg-red-800'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveTab('dining')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'dining' 
                    ? 'bg-gold text-burgundy' 
                    : 'text-white hover:bg-red-800'
                }`}
              >
                Dining
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'events' 
                    ? 'bg-gold text-burgundy' 
                    : 'text-white hover:bg-red-800'
                }`}
              >
                Events
              </button>
              <button
                onClick={() => setActiveTab('explore')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'explore' 
                    ? 'bg-gold text-burgundy' 
                    : 'text-white hover:bg-red-800'
                }`}
              >
                Explore NOLA
              </button>
              <button
                onClick={() => setActiveTab('recipes')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'recipes' 
                    ? 'bg-gold text-burgundy' 
                    : 'text-white hover:bg-red-800'
                }`}
              >
                Healthy Recipes
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
          
          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col gap-2">
                {['home', 'dining', 'events', 'explore', 'recipes'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setShowMobileMenu(false);
                    }}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all text-left ${
                      activeTab === tab 
                        ? 'bg-gold text-burgundy' 
                        : 'text-white hover:bg-red-800'
                    }`}
                  >
                    {tab === 'home' && 'Home'}
                    {tab === 'dining' && 'Dining'}
                    {tab === 'events' && 'Events'}
                    {tab === 'explore' && 'Explore NOLA'}
                    {tab === 'recipes' && 'Healthy Recipes'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'home' && <HomeContent />}
        {activeTab === 'dining' && <DiningContent />}
        {activeTab === 'events' && <EventsContent />}
        {activeTab === 'explore' && <ExploreContent />}
        {activeTab === 'recipes' && <RecipesContent />}
      </main>
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-burgundy to-red-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">⚜</div>
          <h3 className="text-2xl font-bold mb-2">NewOrleansChef.com</h3>
          <p className="text-amber-200 mb-4">Your Personalized Guide to New Orleans Dining & Events</p>
          <p className="text-cream italic text-lg mb-6">
            Powered by "Healthy New Orleans Cuisine" by Chef Mark C. Gasquet
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto text-sm text-cream mb-6">
            <div>
              <h4 className="font-bold mb-2">Discover</h4>
              <p className="text-gray-300">Personalized restaurant recommendations</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Experience</h4>
              <p className="text-gray-300">Food events matched to your taste</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Learn</h4>
              <p className="text-gray-300">Healthy Creole-Cajun recipes</p>
            </div>
          </div>
          <p className="text-sm text-gray-300">© 2007 Mark C. Gasquet • NewOrleansChef.com</p>
          <p className="text-xs text-gray-400 mt-4">
            Recipe ratings power personalized recommendations • GetNth technology
          </p>
        </div>
      </footer>
      
      {/* Modals */}
      {selectedRecipe && <RecipeDetail recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
      
      <style jsx>{`
        .text-burgundy { color: #800020; }
        .bg-burgundy { background-color: #800020; }
        .border-burgundy { border-color: #800020; }
        .hover\\:border-burgundy:hover { border-color: #800020; }
        .hover\\:bg-burgundy:hover { background-color: #800020; }
        .hover\\:bg-burgundy-dark:hover { background-color: #600018; }
        .text-gold { color: #FFD700; }
        .bg-gold { background-color: #FFD700; }
        .border-gold { border-color: #FFD700; }
        .text-cream { color: #FFFEF0; }
        .bg-cream { background-color: #FFF8DC; }
      `}</style>
    </div>
  );
};



// Render the app to the DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<NewOrleansChefApp />);
