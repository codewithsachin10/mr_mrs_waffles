export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  badge?: string; // Popular, Hot, Sweet, Signature
}

export interface Category {
  id: string;
  name: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export const categories: Category[] = [
  { id: "classic-waffles", name: "Classic Waffles" },
  { id: "milky-waffles", name: "Milky Waffles" },
  { id: "choco-waffles", name: "Choco Waffles" },
  { id: "hot-chocolate-waffle", name: "Hot Chocolate Waffle" },
  { id: "red-romance", name: "Red Romance" },
  { id: "signature-waffles", name: "Signature Waffles" },
  { id: "pancake-hot-choco", name: "Pancake with Hot Chocolate" },
  { id: "hot-chocolate-drink", name: "Hot Chocolate Drink" },
  { id: "dessert", name: "Dessert" },
  { id: "homemade-brownie", name: "Homemade Brownie" },
  { id: "brownie-hot-choco", name: "Brownie with Hot Chocolate" },
  { id: "brownie-ice-cream", name: "Brownie with Ice Cream" },
  { id: "weekend-offers", name: "Weekend Offers" },
  { id: "add-ons", name: "Add-ons" },
];

export const menuItems: MenuItem[] = [
  // CLASSIC WAFFLES
  { id: "cw-1", name: "Caramel Butter", category: "Classic Waffles", price: 50, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&auto=format&fit=crop&q=80" },
  { id: "cw-2", name: "Honey Butter", category: "Classic Waffles", price: 50, isAvailable: true, isFeatured: false, badge: "Popular",
    image: "https://images.unsplash.com/photo-1598214886806-c87b84b7078b?w=600&auto=format&fit=crop&q=80" },
  { id: "cw-3", name: "Maple Syrup", category: "Classic Waffles", price: 50, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1504113888839-1c8eb50233d3?w=600&auto=format&fit=crop&q=80" },

  // MILKY WAFFLES
  { id: "mw-1", name: "Milk Waffle Milk", category: "Milky Waffles", price: 79, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1568051243851-f9b136146e97?w=600&auto=format&fit=crop&q=80" },
  { id: "mw-2", name: "Milk Waffle Dark", category: "Milky Waffles", price: 79, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=600&auto=format&fit=crop&q=80" },
  { id: "mw-3", name: "Milk Waffle White", category: "Milky Waffles", price: 79, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1560008581-09826d1de69e?w=600&auto=format&fit=crop&q=80" },
  { id: "mw-4", name: "Butterscotch", category: "Milky Waffles", price: 79, isAvailable: true, isFeatured: false, badge: "Sweet",
    image: "https://images.unsplash.com/photo-1459789034005-ba29c5783491?w=600&auto=format&fit=crop&q=80" },

  // CHOCO WAFFLES
  { id: "chw-1", name: "Choco Milk Waffle", category: "Choco Waffles", price: 89, isAvailable: true, isFeatured: true, badge: "Popular",
    image: "https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=600&auto=format&fit=crop&q=80" },
  { id: "chw-2", name: "Choco Dark Waffle", category: "Choco Waffles", price: 89, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&auto=format&fit=crop&q=80" },
  { id: "chw-3", name: "Choco White Waffle", category: "Choco Waffles", price: 89, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1550950158-d0d960dff51b?w=600&auto=format&fit=crop&q=80" },
  { id: "chw-4", name: "Dark White Waffle", category: "Choco Waffles", price: 89, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80" },
  { id: "chw-5", name: "Triple Choco Waffle", category: "Choco Waffles", price: 89, isAvailable: true, isFeatured: true, badge: "Hot",
    image: "https://images.unsplash.com/photo-1606188074044-fcd750f6996a?w=600&auto=format&fit=crop&q=80" },

  // HOT CHOCOLATE WAFFLE
  { id: "hcw-1", name: "Milk Hot Chocolate Dark", category: "Hot Chocolate Waffle", price: 89, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600&auto=format&fit=crop&q=80" },
  { id: "hcw-2", name: "Choco Hot Chocolate Dark", category: "Hot Chocolate Waffle", price: 89, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&auto=format&fit=crop&q=80" },

  // RED ROMANCE
  { id: "rr-1", name: "Red Velvet", category: "Red Romance", price: 110, isAvailable: true, isFeatured: true, badge: "Popular",
    image: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=600&auto=format&fit=crop&q=80" },
  { id: "rr-2", name: "Red Velvet + Hazelnut", category: "Red Romance", price: 110, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=600&auto=format&fit=crop&q=80" },
  { id: "rr-3", name: "Red Velvet + Nuts", category: "Red Romance", price: 110, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&auto=format&fit=crop&q=80" },
  { id: "rr-4", name: "Red Velvet with Cheese", category: "Red Romance", price: 110, isAvailable: true, isFeatured: false, badge: "Signature",
    image: "https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=600&auto=format&fit=crop&q=80" },

  // SIGNATURE WAFFLES
  { id: "sw-1", name: "Kitkat", category: "Signature Waffles", price: 99, isAvailable: true, isFeatured: true, badge: "Popular",
    image: "https://images.unsplash.com/photo-1560008581-09826d1de69e?w=600&auto=format&fit=crop&q=80" },
  { id: "sw-2", name: "Oreo", category: "Signature Waffles", price: 99, isAvailable: true, isFeatured: true, badge: "Popular",
    image: "https://images.unsplash.com/photo-1582716401301-b2407dc7563d?w=600&auto=format&fit=crop&q=80" },
  { id: "sw-3", name: "Dairy Milk", category: "Signature Waffles", price: 99, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=600&auto=format&fit=crop&q=80" },
  { id: "sw-4", name: "Nutella", category: "Signature Waffles", price: 99, isAvailable: true, isFeatured: true, badge: "Signature",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop&q=80" },
  { id: "sw-5", name: "Strawberry", category: "Signature Waffles", price: 99, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1565299543923-37dd37887442?w=600&auto=format&fit=crop&q=80" },
  { id: "sw-6", name: "Blueberry", category: "Signature Waffles", price: 99, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80" },
  { id: "sw-7", name: "Lotus Biscoff", category: "Signature Waffles", price: 110, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&auto=format&fit=crop&q=80" },
  { id: "sw-8", name: "Lotus Biscoff with Cheese", category: "Signature Waffles", price: 120, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600&auto=format&fit=crop&q=80" },

  // PANCAKE WITH HOT CHOCOLATE
  { id: "panc-1", name: "Milk Pan Cake", category: "Pancake with Hot Chocolate", price: 89, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&auto=format&fit=crop&q=80" },
  { id: "panc-2", name: "Choco Pan Cake", category: "Pancake with Hot Chocolate", price: 99, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1574085733277-851d9d856a3a?w=600&auto=format&fit=crop&q=80" },
  { id: "panc-3", name: "Red Velvet Pan Cake", category: "Pancake with Hot Chocolate", price: 110, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=600&auto=format&fit=crop&q=80" },

  // HOT CHOCOLATE DRINK
  { id: "hcd-1", name: "Hot Chocolate", category: "Hot Chocolate Drink", price: 69, isAvailable: true, isFeatured: false, badge: "Hot",
    image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop&q=80" },
  { id: "hcd-2", name: "Golden Hot Chocolate", category: "Hot Chocolate Drink", price: 99, isAvailable: true, isFeatured: true, badge: "Signature",
    image: "https://images.unsplash.com/photo-1461009312844-e80697a81cc7?w=600&auto=format&fit=crop&q=80" },

  // DESSERT
  { id: "d-1", name: "Brownie Laddu", category: "Dessert", price: 10, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1558326567-98ae2405596b?w=600&auto=format&fit=crop&q=80" },
  { id: "d-2", name: "Chocolate Cupcake", category: "Dessert", price: 10, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=600&auto=format&fit=crop&q=80" },
  { id: "d-3", name: "Vanilla Cupcake", category: "Dessert", price: 10, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=80" },
  { id: "d-4", name: "Red Velvet Cupcake", category: "Dessert", price: 15, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=600&auto=format&fit=crop&q=80" },

  // HOMEMADE BROWNIE
  { id: "hb-1", name: "Eggless Brownie", category: "Homemade Brownie", price: 40, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80" },
  { id: "hb-2", name: "Lava Brownie", category: "Homemade Brownie", price: 40, isAvailable: true, isFeatured: false, badge: "Hot",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&auto=format&fit=crop&q=80" },
  { id: "hb-3", name: "Oreo Brownie", category: "Homemade Brownie", price: 50, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=600&auto=format&fit=crop&q=80" },
  { id: "hb-4", name: "Kitkat Brownie", category: "Homemade Brownie", price: 50, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80" },
  { id: "hb-5", name: "Nuttes Brownie", category: "Homemade Brownie", price: 60, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=600&auto=format&fit=crop&q=80" },
  { id: "hb-6", name: "Triple Chocolate Brownie", category: "Homemade Brownie", price: 60, isAvailable: true, isFeatured: true, badge: "Popular",
    image: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=600&auto=format&fit=crop&q=80" },
  { id: "hb-7", name: "Sizzler Brownie", category: "Homemade Brownie", price: 80, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1611293388250-580b08c4a145?w=600&auto=format&fit=crop&q=80" },

  // HOMEMADE BROWNIE WITH HOT CHOCOLATE
  { id: "hbh-1", name: "Eggless Brownie with Hot Chocolate", category: "Brownie with Hot Chocolate", price: 50, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&auto=format&fit=crop&q=80" },
  { id: "hbh-2", name: "Oreo Brownie with Hot Chocolate", category: "Brownie with Hot Chocolate", price: 60, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&auto=format&fit=crop&q=80" },
  { id: "hbh-3", name: "Kitkat Brownie with Hot Chocolate", category: "Brownie with Hot Chocolate", price: 60, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80" },
  { id: "hbh-4", name: "Nuttes Brownie with Hot Chocolate", category: "Brownie with Hot Chocolate", price: 70, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=600&auto=format&fit=crop&q=80" },
  { id: "hbh-5", name: "Triple Chocolate Brownie with Hot Chocolate", category: "Brownie with Hot Chocolate", price: 70, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80" },

  // HOMEMADE BROWNIE WITH ICE CREAM
  { id: "hbi-1", name: "Eggless Brownie with Ice Cream", category: "Brownie with Ice Cream", price: 50, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80" },
  { id: "hbi-2", name: "Oreo Brownie with Ice Cream", category: "Brownie with Ice Cream", price: 60, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&auto=format&fit=crop&q=80" },
  { id: "hbi-3", name: "Kitkat Brownie with Ice Cream", category: "Brownie with Ice Cream", price: 60, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1604152135912-04a022e23696?w=600&auto=format&fit=crop&q=80" },
  { id: "hbi-4", name: "Nuttes Brownie with Ice Cream", category: "Brownie with Ice Cream", price: 70, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80" },
  { id: "hbi-5", name: "Triple Chocolate Brownie with Ice Cream", category: "Brownie with Ice Cream", price: 70, isAvailable: true, isFeatured: false,
    image: "https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?w=600&auto=format&fit=crop&q=80" },

  // WEEKEND OFFERS
  { id: "wo-1", name: "Fruit Fondue", category: "Weekend Offers", price: 169, description: "Banana, apple, strawberry, kiwi with hot chocolate sauce", isAvailable: true, isFeatured: true, badge: "Special",
    image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600&auto=format&fit=crop&q=80" },
  { id: "wo-2", name: "Signature Brownie Combo", category: "Weekend Offers", price: 200, description: "Nuts/Choco Brownie + Choco Waffle + Hot Chocolate", isAvailable: true, isFeatured: true, badge: "Value",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80" },
  { id: "wo-3", name: "Combo Waffles", category: "Weekend Offers", price: 250, description: "Milk + Chocolate + Red + Add-on", isAvailable: true, isFeatured: true, badge: "Value",
    image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&auto=format&fit=crop&q=80" },
];

export const addOns: AddOn[] = [
  { id: "ao-1", name: "Choco Chips", price: 10 },
  { id: "ao-2", name: "Oreo", price: 10 },
  { id: "ao-3", name: "Nutella", price: 10 },
  { id: "ao-4", name: "Gems", price: 10 },
  { id: "ao-5", name: "Munch", price: 10 },
  { id: "ao-6", name: "Choco Sprinkles", price: 10 },
  { id: "ao-7", name: "Kitkat", price: 10 },
  { id: "ao-8", name: "Dairy Milk", price: 10 },
];

export const siteSettings = {
  shopName: "Mr. & Mrs. Waffle and Brownie",
  tagline: "Fresh waffles, brownies, pancakes and dessert treats",
  phone: "96770 13898",
  whatsapp: "9677013898",
  instagram: "mr_mrs_waffles_browns",
  address: "Shop No. 7, Chocolate Street, Dessert Town",
  announcementText: "Weekend Specials Available! | Buy 2 Waffles, Get 1 Brownie FREE!",
  heroText: "Indulge in our freshly made treats. Pre-order available for special occasions.",
};
