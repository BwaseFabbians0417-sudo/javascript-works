import { useEffect, useMemo, useState } from 'react'
import supabase, { supabaseEnabled } from './lib/supabase.js'
import { createLocalOrder, getLocalOrders, getLocalSession, registerLocalAccount, signInLocalAccount, signOutLocalAccount, updateLocalProfile } from './lib/localAccounts.js'
import { countries as deliveryCountries, formatRegionalPrice, getInitialLocalePreferences, languages, translate } from './lib/storefrontLocale.js'

const supportEmail = 'OLORUNNIYIOLUWAPELUMI0417@GMAIL.COM'
const supportPhone = '+7 952 243-27-85'
const opayAccountName = 'olorunniyi oluwapelumi victor'
const opayAccountNumber = '8145501592'
const opayWebsite = 'https://www.opayweb.com'
const orderStatuses = ['Requested', 'Confirmed', 'Preparing', 'Shipped', 'Delivered', 'Cancelled']

const products = [
  { id: 1, name: 'Satin evening dress', category: 'Clothing', price: 4290, oldPrice: 6190, rating: 4.9, reviews: 128, image: 'photo-1539109136881-3be0616acf4b', badge: 'BESTSELLER' },
  { id: 2, name: 'Everyday tailored blazer', category: 'Clothing', price: 5890, oldPrice: 8290, rating: 4.8, reviews: 94, image: 'photo-1591369822096-ffd140ec948f', badge: 'NEW' },
  { id: 3, name: 'Minimal leather shoulder bag', category: 'Accessories', price: 3690, oldPrice: 5490, rating: 4.7, reviews: 217, image: 'photo-1566150905458-1bf1fc113f0d', badge: 'POPULAR' },
  { id: 4, name: 'Sculpted gold-tone earrings', category: 'Accessories', price: 1490, oldPrice: 2290, rating: 4.8, reviews: 163, image: 'photo-1535632066927-ab7c9ab60908', badge: '' },
  { id: 5, name: 'Soft-glow skincare collection', category: 'Beauty', price: 2790, oldPrice: 3990, rating: 4.9, reviews: 306, image: 'photo-1570172619644-dfd03ed5d881', badge: 'TOP RATED' },
  { id: 6, name: 'Velvet rose eau de parfum', category: 'Fragrances', price: 3190, oldPrice: 4490, rating: 4.7, reviews: 181, image: 'photo-1541643600914-78b084683601', badge: 'NEW' },
  { id: 7, name: 'Cloud-knit lounge set', category: 'Clothing', price: 3490, oldPrice: 4990, rating: 4.8, reviews: 112, image: 'photo-1551488831-00ddcb6c6bd3', badge: '' },
  { id: 8, name: 'Classic leather loafers', category: 'Shoes', price: 4890, oldPrice: 6990, rating: 4.9, reviews: 145, image: 'photo-1543163521-1bf539c55dd2', badge: 'BESTSELLER' },
  { id: 9, name: 'Modern ceramic vase', category: 'Home & Living', price: 1890, oldPrice: 2690, rating: 4.6, reviews: 88, image: 'photo-1610701596007-11502861dcfa', badge: '' },
  { id: 10, name: 'Wireless studio headphones', category: 'Electronics', price: 6290, oldPrice: 8990, rating: 4.8, reviews: 273, image: 'photo-1590658268037-6bf12165a8df', badge: 'POPULAR' },
  { id: 11, name: 'Amber glass candle set', category: 'Home & Living', price: 2190, oldPrice: 3190, rating: 4.7, reviews: 76, image: 'photo-1602874801007-bd458bb1b8b6', badge: 'NEW' },
  { id: 12, name: 'Fresh market fruit box', category: 'Fresh Produce', price: 1290, oldPrice: 1790, rating: 4.8, reviews: 62, image: 'photo-1542838132-92c53300491e', badge: '' },
  { id: 13, name: 'Retro square sunglasses', category: 'Accessories', price: 1790, oldPrice: 2590, rating: 4.6, reviews: 139, image: 'photo-1577803645773-f96470509666', badge: '' },
  { id: 14, name: 'Lightweight city sneakers', category: 'Shoes', price: 3990, oldPrice: 5690, rating: 4.8, reviews: 192, image: 'photo-1495555961986-6d4c1ecb7be3', badge: 'POPULAR' },
  { id: 15, name: 'Compact instant camera', category: 'Electronics', price: 7890, oldPrice: 10990, rating: 4.7, reviews: 101, image: 'photo-1526170375885-4d8ecf77b99f', badge: 'NEW' },
  { id: 16, name: 'Woven weekend tote', category: 'Accessories', price: 2390, oldPrice: 3490, rating: 4.7, reviews: 124, image: 'photo-1591561954557-26941169b49e', badge: '' },
  { id: 17, name: 'Relaxed linen button shirt', category: 'Clothing', price: 3290, oldPrice: 4690, rating: 4.7, reviews: 83, image: 'photo-1598033129183-c4f50c736f10', badge: '' },
  { id: 18, name: 'Everyday straight-leg denim', category: 'Clothing', price: 4490, oldPrice: 6290, rating: 4.8, reviews: 157, image: 'photo-1541099649105-f69ad21f3246', badge: 'POPULAR' },
  { id: 19, name: 'Soft ribbed knit sweater', category: 'Clothing', price: 3890, oldPrice: 5590, rating: 4.9, reviews: 201, image: 'photo-1576566588028-4147f3842f27', badge: 'TOP RATED' },
  { id: 20, name: 'Classic trench coat', category: 'Clothing', price: 8490, oldPrice: 11990, rating: 4.8, reviews: 72, image: 'photo-1591369822096-ffd140ec948f', badge: 'NEW' },
  { id: 21, name: 'Flowing floral midi skirt', category: 'Clothing', price: 2990, oldPrice: 4290, rating: 4.6, reviews: 96, image: 'photo-1583496661160-fb5886a0aaaa', badge: '' },
  { id: 22, name: 'Everyday cotton tee, 2-pack', category: 'Clothing', price: 1690, oldPrice: 2490, rating: 4.7, reviews: 324, image: 'photo-1521572163474-6864f9cf17ab', badge: 'GREAT VALUE' },
  { id: 23, name: 'Cozy fleece zip hoodie', category: 'Clothing', price: 3690, oldPrice: 5290, rating: 4.7, reviews: 142, image: 'photo-1556821840-3a63f95609a7', badge: '' },
  { id: 24, name: 'Elegant pleated blouse', category: 'Clothing', price: 2790, oldPrice: 3990, rating: 4.8, reviews: 118, image: 'photo-1539109136881-3be0616acf4b', badge: '' },
  { id: 25, name: 'Minimal white leather trainers', category: 'Shoes', price: 4590, oldPrice: 6590, rating: 4.8, reviews: 236, image: 'photo-1542291026-7eec264c27ff', badge: 'BESTSELLER' },
  { id: 26, name: 'Strappy evening sandals', category: 'Shoes', price: 3790, oldPrice: 5490, rating: 4.7, reviews: 109, image: 'photo-1515347619252-60a4bf4fff4f', badge: '' },
  { id: 27, name: 'Weekend ankle boots', category: 'Shoes', price: 6290, oldPrice: 8990, rating: 4.8, reviews: 88, image: 'photo-1543163521-1bf539c55dd2', badge: 'NEW' },
  { id: 28, name: 'Comfy slip-on canvas shoes', category: 'Shoes', price: 2490, oldPrice: 3590, rating: 4.6, reviews: 192, image: 'photo-1525966222134-fcfa99b8ae77', badge: '' },
  { id: 29, name: 'Soft leather card holder', category: 'Accessories', price: 1290, oldPrice: 1890, rating: 4.6, reviews: 172, image: 'photo-1627123424574-724758594e93', badge: '' },
  { id: 30, name: 'Delicate layered necklace', category: 'Accessories', price: 1590, oldPrice: 2390, rating: 4.8, reviews: 231, image: 'photo-1611652022419-a9419f74343d', badge: 'POPULAR' },
  { id: 31, name: 'Everyday crossbody camera bag', category: 'Accessories', price: 3190, oldPrice: 4590, rating: 4.7, reviews: 154, image: 'photo-1548036328-c9fa89d128fa', badge: '' },
  { id: 32, name: 'Woven straw sun hat', category: 'Accessories', price: 1890, oldPrice: 2790, rating: 4.6, reviews: 93, image: 'photo-1521369909029-2afed882baee', badge: 'SUMMER PICK' },
  { id: 33, name: 'Soft-touch makeup brush set', category: 'Beauty', price: 1790, oldPrice: 2590, rating: 4.8, reviews: 263, image: 'photo-1522335789203-aabd1fc54bc9', badge: 'POPULAR' },
  { id: 34, name: 'Daily hydration face cream', category: 'Beauty', price: 1390, oldPrice: 1990, rating: 4.7, reviews: 189, image: 'photo-1556229010-6c3f2c9ca5f8', badge: '' },
  { id: 35, name: 'Gentle facial cleansing balm', category: 'Beauty', price: 1590, oldPrice: 2290, rating: 4.8, reviews: 143, image: 'photo-1608248543803-ba4f8c70ae0b', badge: '' },
  { id: 36, name: 'Everyday lip color trio', category: 'Beauty', price: 1190, oldPrice: 1790, rating: 4.6, reviews: 208, image: 'photo-1586495777744-4413f21062fa', badge: 'GREAT VALUE' },
  { id: 37, name: 'Fresh citrus eau de parfum', category: 'Fragrances', price: 2890, oldPrice: 4190, rating: 4.7, reviews: 114, image: 'photo-1594035910387-fea47794261f', badge: '' },
  { id: 38, name: 'Warm amber perfume mist', category: 'Fragrances', price: 1990, oldPrice: 2890, rating: 4.6, reviews: 87, image: 'photo-1592945403244-b3fbafd7f539', badge: 'NEW' },
  { id: 39, name: 'Floral discovery fragrance set', category: 'Fragrances', price: 3490, oldPrice: 4990, rating: 4.9, reviews: 76, image: 'photo-1592945403244-b3fbafd7f539', badge: 'GIFT PICK' },
  { id: 40, name: 'Hand-poured botanical candle', category: 'Home & Living', price: 1290, oldPrice: 1890, rating: 4.8, reviews: 208, image: 'photo-1603006905003-be475563bc59', badge: '' },
  { id: 41, name: 'Textured cotton cushion cover', category: 'Home & Living', price: 990, oldPrice: 1490, rating: 4.7, reviews: 167, image: 'photo-1584100936595-c0654b55a2e2', badge: 'GREAT VALUE' },
  { id: 42, name: 'Minimal bedside table lamp', category: 'Home & Living', price: 3290, oldPrice: 4690, rating: 4.7, reviews: 122, image: 'photo-1507473885765-e6ed057f782c', badge: '' },
  { id: 43, name: 'Soft woven throw blanket', category: 'Home & Living', price: 2890, oldPrice: 4190, rating: 4.9, reviews: 249, image: 'photo-1600369671236-e74521d4b6ad', badge: 'TOP RATED' },
  { id: 44, name: 'Stoneware breakfast mug set', category: 'Home & Living', price: 1790, oldPrice: 2590, rating: 4.7, reviews: 94, image: 'photo-1514228742587-6b1558fcca3d', badge: '' },
  { id: 45, name: 'Stackable glass food containers', category: 'Home & Living', price: 2190, oldPrice: 3190, rating: 4.8, reviews: 153, image: 'photo-1490645935967-10de6ba17061', badge: '' },
  { id: 46, name: 'Portable mini Bluetooth speaker', category: 'Electronics', price: 2990, oldPrice: 4290, rating: 4.7, reviews: 271, image: 'photo-1608043152269-423dbba4e7e1', badge: 'POPULAR' },
  { id: 47, name: 'Foldable phone and tablet stand', category: 'Electronics', price: 890, oldPrice: 1290, rating: 4.6, reviews: 342, image: 'photo-1511707171634-5f897ff02aa9', badge: 'GREAT VALUE' },
  { id: 48, name: 'Compact wireless charging pad', category: 'Electronics', price: 1690, oldPrice: 2490, rating: 4.7, reviews: 183, image: 'photo-1586953208448-b95a79798f07', badge: '' },
  { id: 49, name: 'Smart desk light', category: 'Electronics', price: 2590, oldPrice: 3790, rating: 4.6, reviews: 119, image: 'photo-1507473885765-e6ed057f782c', badge: 'NEW' },
  { id: 50, name: 'Travel-ready power bank', category: 'Electronics', price: 2290, oldPrice: 3290, rating: 4.7, reviews: 207, image: 'photo-1609091839311-d5365f9ff1c5', badge: '' },
  { id: 51, name: 'Wireless on-ear headphones', category: 'Electronics', price: 4890, oldPrice: 6990, rating: 4.8, reviews: 318, image: 'photo-1505740420928-5e560c06d30e', badge: 'BESTSELLER' },
  { id: 52, name: 'Fresh seasonal fruit selection', category: 'Fresh Produce', price: 1590, oldPrice: 2190, rating: 4.8, reviews: 74, image: 'photo-1490474418585-ba9bad8fd0ea', badge: '' },
  { id: 53, name: 'Artisan tea sampler', category: 'Groceries', price: 990, oldPrice: 1490, rating: 4.7, reviews: 91, image: 'photo-1544787219-7f47ccb76574', badge: 'GIFT PICK' },
  { id: 54, name: 'Roasted coffee beans', category: 'Groceries', price: 1190, oldPrice: 1690, rating: 4.9, reviews: 168, image: 'photo-1445116572660-236099ec97a0', badge: 'POPULAR' },
  { id: 55, name: 'Pantry pasta and sauce set', category: 'Groceries', price: 1390, oldPrice: 1990, rating: 4.6, reviews: 58, image: 'photo-1551462147-ff29053bfc14', badge: '' },
  { id: 56, name: 'Honey and breakfast spread duo', category: 'Groceries', price: 1090, oldPrice: 1590, rating: 4.7, reviews: 82, image: 'photo-1587049352851-8d4e89133924', badge: '' },
  { id: 57, name: 'Lightweight weekend backpack', category: 'Travel', price: 3290, oldPrice: 4790, rating: 4.8, reviews: 176, image: 'photo-1622560480654-d96214fdc887', badge: 'POPULAR' },
  { id: 58, name: 'Compact travel organizer set', category: 'Travel', price: 1490, oldPrice: 2190, rating: 4.6, reviews: 113, image: 'photo-1553062407-98eeb64c6a62', badge: '' },
  { id: 59, name: 'Everyday insulated water bottle', category: 'Sports', price: 1290, oldPrice: 1890, rating: 4.7, reviews: 224, image: 'photo-1602143407151-7111542de6e8', badge: 'GREAT VALUE' },
  { id: 60, name: 'Comfort grip yoga mat', category: 'Sports', price: 2490, oldPrice: 3590, rating: 4.8, reviews: 137, image: 'photo-1592432678016-e910b452f9a2', badge: '' },
  { id: 61, name: 'Soft plush pet blanket', category: 'Pets', price: 1590, oldPrice: 2290, rating: 4.8, reviews: 189, image: 'photo-1541599540903-216a46ca1dc0', badge: 'TOP RATED' },
  { id: 62, name: 'Everyday pet walking set', category: 'Pets', price: 1390, oldPrice: 1990, rating: 4.7, reviews: 127, image: 'photo-1548199973-03cce0bbc87b', badge: '' },
  { id: 63, name: 'Silky wrap occasion dress', category: 'Clothing', price: 5490, oldPrice: 7890, rating: 4.8, reviews: 119, image: 'photo-1566174053879-31528523f8ae', badge: 'NEW' },
  { id: 64, name: 'Relaxed everyday cardigan', category: 'Clothing', price: 3190, oldPrice: 4590, rating: 4.7, reviews: 143, image: 'photo-1434389677669-e08b4cac3105', badge: '' },
  { id: 65, name: 'High-rise tailored trousers', category: 'Clothing', price: 3790, oldPrice: 5390, rating: 4.8, reviews: 91, image: 'photo-1594633312681-425c7b97ccd1', badge: '' },
  { id: 66, name: 'Soft cotton sleepwear set', category: 'Clothing', price: 2890, oldPrice: 4190, rating: 4.7, reviews: 166, image: 'photo-1578681994506-b8f463449011', badge: 'COMFORT PICK' },
  { id: 67, name: 'Polished everyday ballet flats', category: 'Shoes', price: 3390, oldPrice: 4890, rating: 4.6, reviews: 135, image: 'photo-1535043934128-cf0b28d52f95', badge: '' },
  { id: 68, name: 'Classic lace-up ankle boots', category: 'Shoes', price: 5790, oldPrice: 8290, rating: 4.8, reviews: 107, image: 'photo-1608256246200-53e635b5b65f', badge: 'NEW' },
  { id: 69, name: 'Minimal gold-tone watch', category: 'Accessories', price: 2890, oldPrice: 4190, rating: 4.7, reviews: 186, image: 'photo-1524592094714-0f0654e20314', badge: '' },
  { id: 70, name: 'Soft everyday scarf', category: 'Accessories', price: 1390, oldPrice: 1990, rating: 4.6, reviews: 116, image: 'photo-1601924994987-69e26d50dc26', badge: 'GREAT VALUE' },
  { id: 71, name: 'Travel jewelry organizer', category: 'Accessories', price: 1590, oldPrice: 2290, rating: 4.8, reviews: 98, image: 'photo-1617038220319-276d3cfab638', badge: '' },
  { id: 72, name: 'Nourishing hair care duo', category: 'Beauty', price: 1890, oldPrice: 2790, rating: 4.8, reviews: 203, image: 'photo-1600612253971-422e7f7faeb6', badge: 'POPULAR' },
  { id: 73, name: 'Daily SPF skincare fluid', category: 'Beauty', price: 1490, oldPrice: 2190, rating: 4.7, reviews: 241, image: 'photo-1556228720-195a672e8a03', badge: '' },
  { id: 74, name: 'Soft matte eye palette', category: 'Beauty', price: 1690, oldPrice: 2490, rating: 4.6, reviews: 159, image: 'photo-1512496015851-a90fb38ba796', badge: '' },
  { id: 75, name: 'Clean musk eau de parfum', category: 'Fragrances', price: 2990, oldPrice: 4290, rating: 4.8, reviews: 121, image: 'photo-1595425970377-c9703cf48b6d', badge: 'NEW' },
  { id: 76, name: 'Relaxing lavender candle', category: 'Home & Living', price: 1190, oldPrice: 1790, rating: 4.8, reviews: 182, image: 'photo-1603905179139-d25a792de16c', badge: '' },
  { id: 77, name: 'Minimal wall art print set', category: 'Home & Living', price: 1990, oldPrice: 2890, rating: 4.7, reviews: 89, image: 'photo-1579783902614-a3fb3927b6a5', badge: 'HOME EDIT' },
  { id: 78, name: 'Compact rechargeable reading light', category: 'Electronics', price: 1790, oldPrice: 2590, rating: 4.7, reviews: 151, image: 'photo-1507473885765-e6ed057f782c', badge: '' },
  { id: 79, name: 'Braided fast-charge cable set', category: 'Electronics', price: 790, oldPrice: 1190, rating: 4.6, reviews: 292, image: 'photo-1558618666-fcd25c85cd64', badge: 'GREAT VALUE' },
  { id: 80, name: 'Reusable market produce bags', category: 'Groceries', price: 690, oldPrice: 990, rating: 4.7, reviews: 110, image: 'photo-1542838132-92c53300491e', badge: 'ECO PICK' },
  { id: 81, name: 'Travel packing cube set', category: 'Travel', price: 1790, oldPrice: 2590, rating: 4.8, reviews: 198, image: 'photo-1581553680321-4fffae59fccd', badge: 'POPULAR' },
  { id: 82, name: 'Compact everyday umbrella', category: 'Travel', price: 1390, oldPrice: 1990, rating: 4.6, reviews: 102, image: 'photo-1534274988757-a28bf1a57c17', badge: '' },
  { id: 83, name: 'Lightweight resistance bands', category: 'Sports', price: 990, oldPrice: 1490, rating: 4.7, reviews: 217, image: 'photo-1598289431512-b97b0917affc', badge: '' },
  { id: 84, name: 'Compact travel yoga block', category: 'Sports', price: 890, oldPrice: 1290, rating: 4.6, reviews: 87, image: 'photo-1599447421416-3414500d18a5', badge: 'GREAT VALUE' },
  { id: 85, name: 'Adjustable pet comfort harness', category: 'Pets', price: 1490, oldPrice: 2190, rating: 4.8, reviews: 131, image: 'photo-1548199973-03cce0bbc87b', badge: '' },
  { id: 86, name: 'Interactive pet play bundle', category: 'Pets', price: 1290, oldPrice: 1890, rating: 4.7, reviews: 149, image: 'photo-1541599540903-216a46ca1dc0', badge: 'PLAYTIME PICK' },
  { id: 87, name: 'Sweet citrus fruit basket', category: 'Fresh Produce', price: 1390, oldPrice: 1990, rating: 4.8, reviews: 68, image: 'photo-1547514701-42782101795e', badge: 'FRESH PICK' },
  { id: 88, name: 'Golden pineapple selection', category: 'Fresh Produce', price: 1190, oldPrice: 1690, rating: 4.7, reviews: 54, image: 'photo-1550258987-190a2d41a8ba', badge: '' },
  { id: 89, name: 'Seasonal berry medley', category: 'Fresh Produce', price: 1790, oldPrice: 2490, rating: 4.9, reviews: 83, image: 'photo-1498557850523-fd3d118b962e', badge: 'SEASONAL' },
  { id: 90, name: 'Ripe banana bunch', category: 'Fresh Produce', price: 790, oldPrice: 1090, rating: 4.7, reviews: 72, image: 'photo-1571771894821-ce9b6c11b08e', badge: '' },
]

const categories = [
  'All Products',
  'Fresh Produce',
  'Clothing',
  'Shoes',
  'Accessories',
  'Beauty',
  'Fragrances',
  'Home & Living',
  'Electronics',
  'Groceries',
  'Travel',
  'Sports',
  'Pets',
]

const categoryTranslationKeys = {
  'All Products': 'category.all',
  'Fresh Produce': 'category.produce',
  Clothing: 'category.clothing',
  Shoes: 'category.shoes',
  Accessories: 'category.accessories',
  Beauty: 'category.beauty',
  Fragrances: 'category.fragrances',
  'Home & Living': 'category.home',
  Electronics: 'category.electronics',
  Groceries: 'category.groceries',
  Travel: 'category.travel',
  Sports: 'category.sports',
  Pets: 'category.pets',
}

const imageUrl = (photo, width = 720) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&q=85`

function hideUnavailableImage(event) {
  event.currentTarget.style.display = 'none'
}

function readStorage(key, fallback, isValid) {
  try {
    const stored = window.localStorage.getItem(key)
    if (stored === null) return fallback
    const value = JSON.parse(stored)
    if (isValid(value)) return value
    console.warn(`Ignoring invalid saved ${key} data.`)
  } catch (error) {
    console.warn(`Could not read saved ${key} data.`, error)
  }
  return fallback
}

function isValidCart(value) {
  return value !== null
    && typeof value === 'object'
    && !Array.isArray(value)
    && Object.entries(value).every(([key, quantity]) => /^\d+:.+$/.test(key) && Number.isSafeInteger(quantity) && quantity > 0)
}

function getVariants(product) {
  if (product.category === 'Clothing') return { label: 'Size', options: ['XS', 'S', 'M', 'L', 'XL'] }
  if (product.category === 'Shoes') return { label: 'Size', options: ['36', '37', '38', '39', '40', '41'] }
  if (product.category === 'Fragrances') return { label: 'Size', options: ['30 ml', '50 ml', '100 ml'] }
  if (product.category === 'Groceries' || product.category === 'Fresh Produce') return { label: 'Pack', options: ['Single selection', 'Small basket', 'Family basket'] }
  if (product.category === 'Electronics') return { label: 'Color', options: ['Black', 'White', 'Rose gold'] }
  if (product.category === 'Sports' || product.category === 'Pets') return { label: 'Color', options: ['Sage', 'Sand', 'Black'] }
  return { label: 'Color', options: ['Cream', 'Black', 'Chocolate'] }
}

function getProductCare(product) {
  if (product.category === 'Groceries' || product.category === 'Fresh Produce') {
    if (product.id === 80) return { guidance: 'product.longevityReusable', isFood: false }
    const isFreshProduce = product.category === 'Fresh Produce'
    return { guidance: isFreshProduce ? 'product.longevityFoodFresh' : 'product.longevityFoodPantry', isFood: true }
  }
  const guidanceByCategory = {
    Clothing: 'product.longevityClothing',
    Shoes: 'product.longevityShoes',
    Accessories: 'product.longevityAccessories',
    Beauty: 'product.longevityBeauty',
    Fragrances: 'product.longevityFragrances',
    'Home & Living': 'product.longevityHome',
    Electronics: 'product.longevityElectronics',
  }
  return { guidance: guidanceByCategory[product.category] || 'product.longevityGeneral', isFood: false }
}

function getInitialLocalUser() {
  if (supabase) return null
  try {
    return getLocalSession()
  } catch (error) {
    console.error('Could not restore local FENGS account session.', error)
    return null
  }
}

function Icon({ name, size = 20, fill = 'none' }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m16 16 4 4" /></>,
    bag: <><path d="M5 8h14l1 12H4L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
    heart: <path d="M20.8 8.7c0 5-8.8 10.3-8.8 10.3S3.2 13.7 3.2 8.7A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.8 2.3Z" />,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
    truck: <><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" /><circle cx="7.5" cy="18" r="1.5" /><circle cx="17.5" cy="18" r="1.5" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    minus: <path d="M5 12h14" />,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  }

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={name === 'heart' && fill !== 'none' ? fill : 'none'}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

function ProductCard({ product, favorite, quantity, highlighted, t, formatPrice, onFavorite, onAdd, onOpenCart, onView }) {
  const discount = Math.round((1 - product.price / product.oldPrice) * 100)

  return (
    <article className={`product-card ${highlighted ? 'product-highlight' : ''}`} id={`product-${product.id}`}>
      <div className="product-image-wrap">
        <button className="product-view-button" type="button" onClick={() => onView(product)} aria-label={`View ${product.name}`}>
          <img className="product-image" src={imageUrl(product.image)} alt={product.name} loading="lazy" onError={hideUnavailableImage} />
        </button>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <span className="product-number">#{String(product.id).padStart(3, '0')}</span>
        <span className="discount-badge">-{discount}%</span>
        <button
          className={`favorite-button ${favorite ? 'is-favorite' : ''}`}
          type="button"
          onClick={() => onFavorite(product.id)}
          aria-label={t(favorite ? 'product.favoriteRemove' : 'product.favoriteAdd', { name: product.name })}
        >
          <Icon name="heart" size={19} fill={favorite ? 'currentColor' : 'none'} />
        </button>
        <button className="quick-add" type="button" onClick={() => quantity ? onOpenCart() : onAdd(product, getVariants(product).options[0])}>
          {quantity ? t('product.inCart', { count: quantity }) : t('product.add')}
        </button>
      </div>
      <div className="product-info">
        <span className="product-category">{t(categoryTranslationKeys[product.category] || product.category)}</span>
        <h3><button className="product-title-button" type="button" onClick={() => onView(product)}>{product.name}</button></h3>
        <div className="product-rating"><Icon name="star" size={14} /><strong>{product.rating}</strong><span>({product.reviews})</span></div>
        <div className="product-prices"><strong>{formatPrice(product.price)}</strong><del>{formatPrice(product.oldPrice)}</del></div>
      </div>
    </article>
  )
}

function buildOrderEmailHref(order, t, formatPrice) {
  const countryName = deliveryCountries.find((country) => country.code === order.countryCode)?.name || order.countryCode
  const body = [
    'FENGS LUXE EMPIRE',
    t('slip.emailOrderIntro'),
    `${t('slip.reference')}: ${order.id}`,
    `${t('checkout.name')}: ${order.customerName}`,
    `${t('checkout.email')}: ${order.customerEmail}`,
    `${t('checkout.phone')}: ${order.customerPhone}`,
    `${t('checkout.country')}: ${countryName}`,
    `${t('checkout.city')}: ${order.city}`,
    `${t('checkout.region')}: ${order.region || '-'}`,
    `${t('checkout.street')}: ${order.streetAddress}`,
    `${t('checkout.postal')}: ${order.postalCode || '-'}`,
    `${t('checkout.carrier')}: ${order.carrierPreference}`,
    '',
    `${t('slip.items')}:`,
    ...order.items.map((item) => `- ${item.name} · ${item.variant} × ${item.quantity} = ${formatPrice(item.unit_price_rub * item.quantity)}`),
    `${t('slip.subtotal')}: ${formatPrice(order.subtotal)}`,
    '',
    t('slip.emailManualPayment'),
  ].join('\n')
  return `mailto:${supportEmail}?subject=${encodeURIComponent(t('slip.emailOrderSubject', { id: order.id }))}&body=${encodeURIComponent(body)}`
}

function buildPaymentEmailHref(order, paymentReference, t) {
  const body = [
    'FENGS LUXE EMPIRE',
    t('slip.emailPaymentIntro'),
    `${t('slip.reference')}: ${order.id}`,
    `${t('slip.paymentReference')}: ${paymentReference.trim() || '-'}`,
    '',
    t('slip.emailVerifyWarning'),
  ].join('\n')
  return `mailto:${supportEmail}?subject=${encodeURIComponent(t('slip.emailPaymentSubject', { id: order.id }))}&body=${encodeURIComponent(body)}`
}

function CheckoutForm({ user, guest = false, initialCountry, t, onSubmit, submitting }) {
  const [customerName, setCustomerName] = useState(user?.user_metadata?.full_name || '')
  const [customerEmail, setCustomerEmail] = useState(user?.email || '')
  const [customerPhone, setCustomerPhone] = useState(user?.user_metadata?.phone || '')
  const [countryCode, setCountryCode] = useState(initialCountry)
  const [city, setCity] = useState('')
  const [region, setRegion] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [streetAddress, setStreetAddress] = useState('')
  const [carrierPreference, setCarrierPreference] = useState('No preference')

  function submit(event) {
    event.preventDefault()
    onSubmit({ customerName, customerEmail, customerPhone, countryCode, city, region, postalCode, streetAddress, carrierPreference })
  }

  return (
    <form className="checkout-form" onSubmit={submit}>
      <div className="checkout-form-heading"><span className="eyebrow">{t('checkout.eyebrow')}</span><strong>{t('checkout.title')}</strong><p>{t('checkout.description')}</p></div>
      <label>{t('checkout.name')}<input required minLength={2} maxLength={120} autoComplete="name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} /></label>
      <label>{t('checkout.email')}<input required type="email" maxLength={254} autoComplete="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} /></label>
      <label>{t('checkout.phone')}<input required minLength={5} maxLength={40} autoComplete="tel" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} /></label>
      <label>{t('checkout.country')}<select required value={countryCode} onChange={(event) => setCountryCode(event.target.value)}>{deliveryCountries.map((country) => <option key={country.code} value={country.code}>{country.flag} {country.name}</option>)}</select></label>
      <div className="address-row"><label>{t('checkout.city')}<input required minLength={2} maxLength={120} autoComplete="address-level2" value={city} onChange={(event) => setCity(event.target.value)} /></label><label>{t('checkout.region')}<input maxLength={120} autoComplete="address-level1" value={region} onChange={(event) => setRegion(event.target.value)} /></label></div>
      <div className="address-row"><label>{t('checkout.street')}<input required minLength={5} maxLength={300} autoComplete="street-address" value={streetAddress} onChange={(event) => setStreetAddress(event.target.value)} /></label><label>{t('checkout.postal')}<input maxLength={24} autoComplete="postal-code" value={postalCode} onChange={(event) => setPostalCode(event.target.value)} /></label></div>
      <label>{t('checkout.carrier')}<select value={carrierPreference} onChange={(event) => setCarrierPreference(event.target.value)}><option>No preference</option><option>CDEK</option><option>Russian Post</option><option>DHL</option><option>EMS</option></select></label>
      <p className="delivery-request-note">{t('checkout.carrierNote')}</p>
      {guest && <p className="guest-email-note">{t('checkout.guestNote')}</p>}
      <p className="payment-pending-note">{t('checkout.paymentNote')}</p>
      <button className="button-primary checkout-button" type="submit" disabled={submitting}>{submitting ? t('checkout.submitting') : t(guest ? 'checkout.prepareEmail' : 'checkout.submit')} <Icon name="arrow" size={17} /></button>
    </form>
  )
}

function CartDrawer({ cart, user, initialCountry, t, formatPrice, submitting, orderNotice, orderError, onClose, onChangeQuantity, onSubmitOrder, onLogin }) {
  const [accountNumberCopied, setAccountNumberCopied] = useState(false)
  const [copyError, setCopyError] = useState('')
  const [paymentReference, setPaymentReference] = useState('')
  const cartItems = Object.entries(cart).flatMap(([key, quantity]) => {
    const [id, variant] = key.split(':')
    const product = products.find((item) => item.id === Number(id))
    return product ? [{ product, quantity, variant, key }] : []
  })
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const orderEmailHref = orderNotice ? buildOrderEmailHref(orderNotice, t, formatPrice) : ''
  const paymentEmailHref = orderNotice ? buildPaymentEmailHref(orderNotice, paymentReference, t) : ''

  return (
    <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="drawer-heading">
          <div><span className="eyebrow">{t('cart.selection')}</span><h2 id="cart-title">{t('cart.title')}</h2></div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close cart"><Icon name="close" /></button>
        </div>
        {orderNotice && <div className="order-success" role="status"><strong>{t(orderNotice.guest ? 'order.guestPrepared' : 'order.success')}</strong><span>{t('order.reference', { id: orderNotice.id })}</span><p>{t(orderNotice.guest ? 'slip.emailGuestNote' : 'order.followup')}</p></div>}
        {cartItems.length === 0 ? (
          orderNotice ? (
            <section className="order-slip" aria-label={t('slip.eyebrow')}>
              <div className="slip-brand"><img src="/fengs-luxe-mark.svg" alt="" /><span>FENGS <b>LUXE EMPIRE</b></span></div>
              <span className="eyebrow">{t('slip.eyebrow')}</span>
              <h3>{t('slip.title')}</h3>
              <div className="slip-meta"><span>{t('slip.reference')}</span><strong>{orderNotice.id}</strong></div>
              <div className="slip-meta"><span>{t('slip.destination')}</span><strong>{deliveryCountries.find((country) => country.code === orderNotice.countryCode)?.flag} {deliveryCountries.find((country) => country.code === orderNotice.countryCode)?.name}</strong></div>
              <section className="opay-payment">
                <h4><span className="payment-brand-mark" aria-label="OPay">O</span>{t('slip.opayTitle')}</h4>
                <div className="slip-meta"><span>{t('slip.opayRecipient')}</span><strong>{opayAccountName}</strong></div>
                <div className="slip-meta"><span>{t('slip.opayNumber')}</span><strong>{opayAccountNumber}</strong></div>
                <button className="copy-account-number" type="button" onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(opayAccountNumber)
                    setAccountNumberCopied(true)
                    setCopyError('')
                    window.setTimeout(() => setAccountNumberCopied(false), 1800)
                  } catch (error) {
                    console.error('Could not copy the OPay account number.', error)
                    setCopyError(t('slip.copyFailed'))
                  }
                }}>{accountNumberCopied ? t('slip.numberCopied') : t('slip.copyNumber')}</button>
                {copyError && <p className="form-error" role="alert">{copyError}</p>}
                <a className="button-primary opay-link" href={opayWebsite} target="_blank" rel="noopener noreferrer">{t('slip.openOpay')} <Icon name="arrow" size={16} /></a>
                <p>{t('slip.opayAmountNote')}</p>
              </section>
              <div className="slip-items">
                <strong>{t('slip.items')}</strong>
                {orderNotice.items.map((item) => <div className="slip-item" key={`${item.product_id}:${item.variant}`}><span>{item.name} · {item.variant} × {item.quantity}</span><b>{formatPrice(item.unit_price_rub * item.quantity)}</b></div>)}
              </div>
              <div className="slip-total"><span>{t('slip.subtotal')}</span><strong>{formatPrice(orderNotice.subtotal)}</strong></div>
              <p className="slip-status">{t(orderNotice.guest ? 'slip.emailDraftStatus' : 'slip.status')}</p>
              <p className="payment-pending-note">{t('slip.paymentPending')}</p>
              <section className="email-session">
                <h4><span className="email-brand-mark" aria-hidden="true">✉</span>{t('slip.emailTitle')}</h4>
                <p>{t(orderNotice.guest ? 'slip.emailGuestNote' : 'slip.emailNote')}</p>
                <a className="button-primary email-session-button" href={orderEmailHref}>{t('slip.emailOrder')} <Icon name="arrow" size={16} /></a>
                <label>{t('slip.paymentReference')}<input maxLength={120} value={paymentReference} onChange={(event) => setPaymentReference(event.target.value)} placeholder={t('slip.paymentReferencePlaceholder')} /></label>
                <a className="email-payment-link" href={paymentEmailHref}>{t('slip.emailPaymentNotice')}</a>
              </section>
              <button className="button-primary order-slip-print" type="button" onClick={() => window.print()}>{t('slip.print')}</button>
              <button className="order-slip-continue" type="button" onClick={onClose}>{t('slip.continue')}</button>
            </section>
          ) : <div className="empty-cart"><span className="empty-cart-icon"><Icon name="bag" size={32} /></span><h3>{t('cart.emptyTitle')}</h3><p>{t('cart.emptyDescription')}</p><button className="button-primary" type="button" onClick={onClose}>{t('cart.continue')}</button></div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map(({ product, quantity, variant, key }) => (
                <article className="cart-item" key={key}>
                  <img src={imageUrl(product.image, 240)} alt="" onError={hideUnavailableImage} />
                  <div className="cart-item-details"><span>{t(categoryTranslationKeys[product.category] || product.category)} · {variant}</span><strong>{product.name}</strong><b>{formatPrice(product.price * quantity)}</b><div className="quantity-controls"><button type="button" onClick={() => onChangeQuantity(key, -1)} aria-label={`Remove one ${product.name}`}><Icon name="minus" size={14} /></button><span>{quantity}</span><button type="button" onClick={() => onChangeQuantity(key, 1)} aria-label={`Add one ${product.name}`}><Icon name="plus" size={14} /></button></div></div>
                </article>
              ))}
            </div>
            <div className="cart-summary"><div><span>{t('cart.subtotal')}</span><strong>{formatPrice(subtotal)}</strong></div><p>{t('cart.deliveryNote')}</p></div>
            {user
              ? <><CheckoutForm user={user} initialCountry={initialCountry} t={t} submitting={submitting} onSubmit={onSubmitOrder} />{orderError && <p className="form-error checkout-error" role="alert">{orderError}</p>}</>
              : <><div className="guest-checkout-note"><span className="guest-checkout-mark" aria-hidden="true">✓</span><p>{t('cart.guestPrompt')}</p><button className="guest-signin-link" type="button" onClick={onLogin}>{t('cart.login')}</button></div><CheckoutForm user={null} guest initialCountry={initialCountry} t={t} submitting={submitting} onSubmit={onSubmitOrder} />{orderError && <p className="form-error checkout-error" role="alert">{orderError}</p>}{!supabaseEnabled && <p className="setup-notice">{t('auth.localMode')}</p>}</>}
          </>
        )}
      </aside>
    </div>
  )
}

function AccountDialog({ user, recoveryMode, isStoreAdmin, localMode, orders, ordersLoading, ordersError, t, formatPrice, dateLocale, onLocalSignIn, onLocalProfileUpdate, onClose, onSignOut, onLoadOrders, onUpdateOrderStatus, onRecoveryComplete }) {
  const [mode, setMode] = useState(recoveryMode ? 'updatePassword' : 'signin')
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '')
  const [phone, setPhone] = useState(user?.user_metadata?.phone || '')
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [updatingOrderId, setUpdatingOrderId] = useState('')
  const [orderActionError, setOrderActionError] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  async function submitAuth(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (!supabase && mode === 'reset') {
      setError(t('auth.localPasswordReset'))
      return
    }
    if (!supabase && mode === 'updatePassword') {
      setError(t('auth.localPasswordReset'))
      return
    }
    if (!supabase && mode === 'signup' && password !== confirmPassword) {
      setError(t('auth.passwordMismatch'))
      return
    }
    if (!supabase && mode === 'signup') {
      setBusy(true)
      try {
        const user = await registerLocalAccount({ email, password, fullName })
        onLocalSignIn(user)
        setMessage(t('auth.accountReady'))
      } catch (authError) {
        setError(authError.message || t('auth.tryAgain'))
      } finally {
        setBusy(false)
      }
      return
    }
    if (!supabase && mode === 'signin') {
      setBusy(true)
      try {
        const user = await signInLocalAccount({ email, password })
        onLocalSignIn(user)
        setMessage(t('auth.signedIn'))
      } catch (authError) {
        setError(authError.message || t('auth.tryAgain'))
      } finally {
        setBusy(false)
      }
      return
    }
    if (!supabase) {
      setError(t('auth.setupError'))
      return
    }
    if (mode === 'signup' && password !== confirmPassword) {
      setError(t('auth.passwordMismatch'))
      return
    }
    setBusy(true)
    try {
      let result
      if (mode === 'signup') {
        result = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: fullName.trim() }, emailRedirectTo: window.location.origin },
        })
      } else if (mode === 'reset') {
        result = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin })
      } else if (mode === 'updatePassword') {
        result = await supabase.auth.updateUser({ password })
      } else {
        result = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      }
      if (result.error) throw result.error
      if (mode === 'signup') setMessage(result.data.session ? t('auth.accountReady') : t('auth.confirmEmail'))
      else if (mode === 'reset') setMessage(t('auth.resetSent'))
      else if (mode === 'updatePassword') {
        setMessage(t('auth.passwordUpdated'))
        setMode('signin')
        setPassword('')
        setConfirmPassword('')
        onRecoveryComplete()
      } else setMessage(t('auth.signedIn'))
    } catch (authError) {
      console.error('FENGS account action failed.', authError)
      setError(authError.message || t('auth.tryAgain'))
    } finally {
      setBusy(false)
    }
  }

  async function saveProfile(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setBusy(true)
    try {
      if (!supabase && localMode) {
        const updatedUser = updateLocalProfile(user.id, { fullName, phone })
        onLocalProfileUpdate(updatedUser)
        setMessage(t('auth.profileSaved'))
        return
      }
      const { error: profileError } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim(), phone: phone.trim() },
      })
      if (profileError) throw profileError
      setMessage(t('auth.profileSaved'))
    } catch (profileError) {
      console.error('FENGS profile update failed.', profileError)
      setError(profileError.message || t('auth.profileError'))
    } finally {
      setBusy(false)
    }
  }

  async function updateOrderStatus(orderId, status) {
    setUpdatingOrderId(orderId)
    setOrderActionError('')
    try {
      await onUpdateOrderStatus(orderId, status)
    } catch (statusError) {
      console.error('FENGS order status update failed.', statusError)
      setOrderActionError(statusError.message || t('auth.statusError'))
    } finally {
      setUpdatingOrderId('')
    }
  }

  return (
    <div className="overlay account-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="account-dialog" role="dialog" aria-modal="true" aria-labelledby="account-title">
        <button className="icon-button dialog-close" type="button" onClick={onClose} aria-label="Close account"><Icon name="close" /></button>
        <span className="eyebrow">FENGS LUXE EMPIRE</span>
        <h2 id="account-title">{mode === 'updatePassword' ? t('auth.newPassword') : user ? t('auth.account') : mode === 'signup' ? t('auth.signup') : mode === 'reset' ? t('auth.reset') : t('auth.signin')}</h2>
        {!supabaseEnabled && <div className="setup-notice">{t('auth.localMode')}</div>}
        {user && mode !== 'updatePassword' ? (
          <>
            <form className="account-form" onSubmit={saveProfile}>
              <label>{t('auth.fullName')}<input required minLength={2} maxLength={120} autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} /></label>
              <label>{t('auth.accountEmail')}<input value={email} readOnly /></label>
              <label>{t('auth.phone')}<input maxLength={40} autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} /></label>
              <button className="button-primary" type="submit" disabled={busy}>{busy ? t('auth.saving') : t('auth.saveProfile')}</button>
            </form>
            <div className="account-orders">
              <div className="account-orders-heading"><div><span className="eyebrow">{isStoreAdmin ? t('auth.admin') : t('auth.orders')}</span><h3>{isStoreAdmin ? t('auth.customerOrders') : t('auth.yourOrders')}</h3></div><button type="button" onClick={onLoadOrders}>{t('auth.refresh')}</button></div>
              {ordersLoading ? <p>{t('auth.loadingOrders')}</p> : ordersError ? <p className="form-error">{ordersError}</p> : orders.length === 0 ? <p>{isStoreAdmin ? t('auth.noCustomerOrders') : t('auth.noOrders')}</p> : !isStoreAdmin && <div className="order-list">{orders.map((order) => <article className="order-history-item" key={order.id}><div><strong>{t('auth.request', { id: order.id.slice(0, 8).toUpperCase() })}</strong><span>{new Date(order.created_at).toLocaleDateString(dateLocale)}</span></div><span className={`order-status ${order.status === 'Delivered' ? 'order-status-delivered' : ''}`}>{order.status === 'Delivered' && <span className="delivery-check" aria-label="Delivery confirmed">✓</span>}{order.status}</span><p>{order.items.length === 1 ? t('auth.item') : t('auth.items', { count: order.items.length })} · {deliveryCountries.find((country) => country.code === order.country_code)?.flag} {order.city}, {deliveryCountries.find((country) => country.code === order.country_code)?.name}</p><strong>{formatPrice(Number(order.subtotal))}</strong></article>)}</div>}
              {orderActionError && <p className="form-error" role="alert">{orderActionError}</p>}
              {isStoreAdmin && orders.length > 0 && <div className="admin-orders-list">{orders.map((order) => <article className="admin-order-item" key={order.id}><div className="admin-order-title"><strong>#{order.id.slice(0, 8).toUpperCase()} · {order.customer_name}</strong><span>{new Date(order.created_at).toLocaleString(dateLocale)}</span></div><p>{order.customer_email} · {order.customer_phone}</p><p>{order.street_address}, {order.city}{order.region ? `, ${order.region}` : ''}{order.postal_code ? ` ${order.postal_code}` : ''} · {deliveryCountries.find((country) => country.code === order.country_code)?.flag} {deliveryCountries.find((country) => country.code === order.country_code)?.name}</p><p>{order.items.map((item) => `${item.name} (${item.variant}) × ${item.quantity}`).join(' · ')}</p><div className="admin-order-footer"><strong>{formatPrice(Number(order.subtotal))}</strong><label>{t('auth.status')}<select value={order.status} disabled={updatingOrderId === order.id} onChange={(event) => updateOrderStatus(order.id, event.target.value)}>{orderStatuses.map((status) => <option key={status}>{status}</option>)}</select></label></div></article>)}</div>}
            </div>
            <button className="signout-button" type="button" onClick={onSignOut}>{t('auth.signout')}</button>
          </>
        ) : (
          <>
            <form className="account-form" onSubmit={submitAuth}>
              {mode === 'signup' && <label>{t('auth.fullName')}<input required minLength={2} maxLength={120} autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} /></label>}
              <label>{t('auth.email')}<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
              {mode !== 'reset' && <label>{mode === 'updatePassword' ? t('auth.newPasswordField') : t('auth.password')}<input required type="password" minLength={8} autoComplete={mode === 'signup' || mode === 'updatePassword' ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} /></label>}
              {(mode === 'signup' || mode === 'updatePassword') && <label>{t('auth.confirm')}<input required type="password" minLength={8} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></label>}
              {error && <p className="form-error" role="alert">{error}</p>}
              {message && <p className="form-message" role="status">{message}</p>}
              <button className="button-primary" type="submit" disabled={busy}>{busy ? t('auth.wait') : mode === 'signup' ? t('auth.create') : mode === 'reset' ? t('auth.sendReset') : mode === 'updatePassword' ? t('auth.updatePassword') : t('auth.signinButton')}</button>
            </form>
            <div className="account-mode-links">
              {mode === 'signin' && <><button type="button" onClick={() => { setMode('signup'); setError(''); setMessage('') }}>{t('auth.createLink')}</button><button type="button" onClick={() => { setMode('reset'); setError(''); setMessage('') }}>{t('auth.forgot')}</button></>}
              {mode !== 'signin' && mode !== 'updatePassword' && <button type="button" onClick={() => { setMode('signin'); setError(''); setMessage('') }}>{t('auth.back')}</button>}
              {mode === 'updatePassword' && <button type="button" onClick={() => { setMode('signin'); setError(''); setMessage('') }}>{t('auth.back')}</button>}
            </div>
            <p className="password-safety-note"><Icon name="shield" size={15} /> {t('auth.safety')}</p>
          </>
        )}
        {error && user && <p className="form-error" role="alert">{error}</p>}
        {message && user && <p className="form-message" role="status">{message}</p>}
      </section>
    </div>
  )
}

function ProductDetailsDialog({ product, relatedProducts, favorite, t, formatPrice, onClose, onAdd, onFavorite, onView }) {
  const variants = getVariants(product)
  const care = getProductCare(product)
  const [selectedVariant, setSelectedVariant] = useState(variants.options[0])

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  const description = product.description
    || `${product.name} is one of our carefully selected ${product.category.toLowerCase()} finds. Choose your preferred ${variants.label.toLowerCase()} and add it to your bag.`
  const discount = Math.round((1 - product.price / product.oldPrice) * 100)

  return (
    <div className="overlay product-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="product-dialog" role="dialog" aria-modal="true" aria-labelledby="product-dialog-title">
        <button className="icon-button dialog-close" type="button" onClick={onClose} aria-label="Close product details"><Icon name="close" /></button>
        <div className="product-dialog-image"><img src={imageUrl(product.image, 900)} alt={product.name} onError={hideUnavailableImage} /></div>
        <div className="product-dialog-content">
          <span className="eyebrow">{t(categoryTranslationKeys[product.category] || product.category)}</span>
          <h2 id="product-dialog-title">{product.name}</h2>
          <div className="product-rating"><Icon name="star" size={15} /><strong>{product.rating}</strong><span>({product.reviews.toLocaleString()} {t('product.reviews')})</span></div>
          <div className="product-dialog-prices"><strong>{formatPrice(product.price)}</strong><del>{formatPrice(product.oldPrice)}</del><span>{t('product.discount', { percent: discount })}</span></div>
          <p>{description}</p>
          <section className="product-care" aria-labelledby="product-care-title">
            <h3 id="product-care-title">{t('product.longevityTitle')}</h3>
            <p>{t(care.guidance)}</p>
            {care.isFood && <><p>{t('product.foodGuidance')}</p><p>{t('product.foodAllergenNote')}</p></>}
            <small>{t('product.lifespanNotice')}</small>
          </section>
          <label className="variant-picker"><span>{t('product.optionsTitle')} · {t(`product.${variants.label.toLowerCase()}`)}</span><select value={selectedVariant} onChange={(event) => setSelectedVariant(event.target.value)}>{variants.options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
          <div className="product-dialog-actions">
            <button className="button-primary" type="button" onClick={() => { onAdd(product, selectedVariant); onClose() }}>{t('product.addDetails')}</button>
            <button className={`save-product-button ${favorite ? 'is-favorite' : ''}`} type="button" onClick={() => onFavorite(product.id)}><Icon name="heart" size={18} fill={favorite ? 'currentColor' : 'none'} />{favorite ? t('product.saved') : t('product.save')}</button>
          </div>
          {relatedProducts.length > 0 && <section className="product-related"><h3>{t('product.relatedTitle')}</h3><div className="product-related-grid">{relatedProducts.map((related) => <button className="product-related-card" key={related.id} type="button" onClick={() => onView(related)}><img src={imageUrl(related.image, 240)} alt="" onError={hideUnavailableImage} /><span>#{String(related.id).padStart(3, '0')} · {related.name}</span><strong>{formatPrice(related.price)}</strong></button>)}</div></section>}
          <span className="product-dialog-note"><Icon name="truck" size={16} /> {t('product.deliveryNote')}</span>
        </div>
      </section>
    </div>
  )
}

function App() {
  const [localePreferences] = useState(getInitialLocalePreferences)
  const [language, setLanguage] = useState(localePreferences.language)
  const [destinationCountry, setDestinationCountry] = useState(localePreferences.countryCode)
  const t = (key, values) => translate(language, key, values)
  const formatPrice = (amount) => formatRegionalPrice(amount, destinationCountry, language)
  const selectedCountry = deliveryCountries.find((country) => country.code === destinationCountry) || deliveryCountries[0]
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All Products')
  const [favorites, setFavorites] = useState(() => readStorage(
    'fengs-favorites-v1',
    [],
    (value) => Array.isArray(value) && value.every((id) => Number.isSafeInteger(id)),
  ))
  const [savedOnly, setSavedOnly] = useState(false)
  const [cart, setCart] = useState(() => readStorage('fengs-cart-v1', {}, isValidCart))
  const [cartOpen, setCartOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [authUser, setAuthUser] = useState(getInitialLocalUser)
  const [authRecoveryMode, setAuthRecoveryMode] = useState(false)
  const [storeAdminUserId, setStoreAdminUserId] = useState(null)
  const [orders, setOrders] = useState([])
  const [ordersUserId, setOrdersUserId] = useState(null)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState('')
  const [ordersRefresh, setOrdersRefresh] = useState(0)
  const [detailProduct, setDetailProduct] = useState(null)
  const [toast, setToast] = useState('')
  const [orderError, setOrderError] = useState('')
  const [orderSubmitting, setOrderSubmitting] = useState(false)
  const [orderNotice, setOrderNotice] = useState('')
  const [sort, setSort] = useState('featured')
  const [dealsOnly, setDealsOnly] = useState(false)
  const [giftEditOnly, setGiftEditOnly] = useState(false)
  const [underBudget, setUnderBudget] = useState(false)
  const [visibleCount, setVisibleCount] = useState(16)
  const [pendingProductJump, setPendingProductJump] = useState(null)
  const [highlightedProductId, setHighlightedProductId] = useState(null)
  const isStoreAdmin = storeAdminUserId === authUser?.id

  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)
  const cartQuantityByProduct = useMemo(() => Object.entries(cart).reduce((quantities, [key, quantity]) => {
    const id = key.split(':')[0]
    quantities[id] = (quantities[id] || 0) + quantity
    return quantities
  }, {}), [cart])
  const filteredProducts = useMemo(() => {
    const matches = products.filter((product) => {
      const matchesCategory = activeCategory === 'All Products' || product.category === activeCategory
      const matchesSearch = `${product.name} ${product.category}`.toLowerCase().includes(search.trim().toLowerCase())
      const matchesFavorites = !savedOnly || favorites.includes(product.id)
      const matchesDeals = !dealsOnly || (product.oldPrice - product.price) / product.oldPrice >= 0.3
      const matchesGiftEdit = !giftEditOnly || ['Accessories', 'Beauty', 'Fragrances', 'Home & Living'].includes(product.category)
      const matchesBudget = !underBudget || product.price <= 3000
      return matchesCategory && matchesSearch && matchesFavorites && matchesDeals && matchesGiftEdit && matchesBudget
    })
    if (sort === 'price-low') matches.sort((a, b) => a.price - b.price)
    if (sort === 'price-high') matches.sort((a, b) => b.price - a.price)
    if (sort === 'rating') matches.sort((a, b) => b.rating - a.rating)
    if (sort === 'popular') matches.sort((a, b) => b.reviews - a.reviews)
    return matches
  }, [activeCategory, dealsOnly, favorites, giftEditOnly, savedOnly, search, sort, underBudget])
  const visibleProducts = filteredProducts.slice(0, visibleCount)

  useEffect(() => {
    try {
      window.localStorage.setItem('fengs-country-v1', destinationCountry)
      window.localStorage.setItem('fengs-language-v1', language)
      document.documentElement.lang = language
    } catch (error) {
      console.warn('Could not save the FENGS region preference.', error)
    }
  }, [destinationCountry, language])

  function changeCountry(countryCode) {
    const country = deliveryCountries.find((item) => item.code === countryCode)
    if (!country) return
    setDestinationCountry(countryCode)
    setLanguage(country.language)
  }

  useEffect(() => {
    if (!supabase) return undefined
    let active = true
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) throw error
      if (active) setAuthUser(data.session?.user || null)
    }).catch((error) => {
      console.error('Could not restore the FENGS account session.', error)
      if (active) setToast('Could not restore your sign-in. Please sign in again.')
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthUser(session?.user || null)
      if (event === 'PASSWORD_RECOVERY') {
        setAuthRecoveryMode(true)
        setAccountOpen(true)
      }
    })
    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!authUser || !accountOpen) return undefined
    if (!supabase) {
      let active = true
      Promise.resolve()
        .then(() => getLocalOrders(authUser.id))
        .then((localOrders) => {
          if (!active) return
          setOrdersError('')
          setOrders(localOrders)
          setOrdersUserId(authUser.id)
        })
        .catch((error) => {
          console.error('Could not load local FENGS orders.', error)
          if (!active) return
          setOrdersError(error.message || 'Local order history could not be loaded.')
          setOrdersUserId(authUser.id)
        })
        .finally(() => {
          if (active) setOrdersLoading(false)
        })
      return () => { active = false }
    }
    let active = true
    const request = Promise.resolve().then(() => {
      if (active) {
        setOrdersLoading(true)
        setOrdersError('')
        setOrdersUserId(null)
        setStoreAdminUserId(null)
      }
      return supabase.from('storefront_admins').select('user_id').maybeSingle()
    })
    request.then(({ data: adminData, error: adminError }) => {
      if (adminError) throw adminError
      const isAdmin = Boolean(adminData)
      if (active && isAdmin) setStoreAdminUserId(authUser.id)
      return supabase
        .from('storefront_orders')
        .select('id, created_at, status, items, country_code, city, region, postal_code, street_address, carrier_preference, customer_name, customer_email, customer_phone, subtotal')
        .order('created_at', { ascending: false })
        .limit(isAdmin ? 100 : 25)
        .then(({ data, error }) => {
          if (error) throw error
          return data || []
        })
    }).then((data) => {
      if (active) {
        setOrders(data)
        setOrdersUserId(authUser.id)
      }
    })
      .catch((error) => {
        console.error('Could not load FENGS order history.', error)
        if (active) {
          setOrdersError(error.message || 'Order history could not be loaded.')
          setOrdersUserId(authUser.id)
        }
      })
      .finally(() => {
        if (active) setOrdersLoading(false)
      })
    return () => { active = false }
  }, [accountOpen, authUser, ordersRefresh])

  useEffect(() => {
    if (pendingProductJump === null) return undefined
    const frame = window.requestAnimationFrame(() => {
      const productElement = document.getElementById(`product-${pendingProductJump}`)
      if (!productElement) return
      productElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setHighlightedProductId(pendingProductJump)
      window.setTimeout(() => setHighlightedProductId(null), 2400)
      setPendingProductJump(null)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [pendingProductJump, visibleCount, filteredProducts])

  useEffect(() => {
    try {
      window.localStorage.setItem('fengs-cart-v1', JSON.stringify(cart))
    } catch (error) {
      console.error('Could not save your FENGS cart.', error)
    }
  }, [cart])

  useEffect(() => {
    try {
      window.localStorage.setItem('fengs-favorites-v1', JSON.stringify(favorites))
    } catch (error) {
      console.error('Could not save your FENGS favorites.', error)
    }
  }, [favorites])

  function addToCart(product, variant) {
    const key = `${product.id}:${variant}`
    setCart((currentCart) => ({ ...currentCart, [key]: (currentCart[key] || 0) + 1 }))
    setToast(t('toast.added'))
    window.setTimeout(() => setToast(''), 2200)
  }

  function changeQuantity(key, amount) {
    setCart((currentCart) => {
      const nextQuantity = (currentCart[key] || 0) + amount
      const nextCart = { ...currentCart }
      if (nextQuantity > 0) nextCart[key] = nextQuantity
      else delete nextCart[key]
      return nextCart
    })
  }

  function toggleFavorite(id) {
    setFavorites((currentFavorites) => currentFavorites.includes(id)
      ? currentFavorites.filter((favoriteId) => favoriteId !== id)
      : [...currentFavorites, id])
  }

  function selectCategory(category) {
    setActiveCategory(category)
    setSavedOnly(false)
    setGiftEditOnly(false)
    setVisibleCount(16)
  }

  function clearFilters() {
    setSearch('')
    setSavedOnly(false)
    setDealsOnly(false)
    setGiftEditOnly(false)
    setUnderBudget(false)
    setSort('featured')
    selectCategory('All Products')
  }

  function submitSearch(event) {
    event.preventDefault()
    const productNumber = search.trim().match(/^#?(\d+)$/)
    if (productNumber) {
      const productId = Number(productNumber[1])
      const productIndex = products.findIndex((product) => product.id === productId)
      if (productIndex === -1) {
        setToast(t('search.notFound', { id: productId }))
        window.setTimeout(() => setToast(''), 2600)
        return
      }
      setActiveCategory('All Products')
      setSavedOnly(false)
      setDealsOnly(false)
      setGiftEditOnly(false)
      setUnderBudget(false)
      setSort('featured')
      setSearch('')
      setVisibleCount(Math.max(16, productIndex + 1))
      setPendingProductJump(productId)
      return
    }
    setVisibleCount(16)
  }

  function shopBlackFriday() {
    setSearch('')
    setSavedOnly(false)
    setGiftEditOnly(false)
    setDealsOnly(true)
    setUnderBudget(false)
    setSort('featured')
    setActiveCategory('All Products')
    setVisibleCount(16)
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  function shopDecemberGifts() {
    setSearch('')
    setSavedOnly(false)
    setGiftEditOnly(true)
    setDealsOnly(false)
    setUnderBudget(false)
    setSort('featured')
    setActiveCategory('All Products')
    setVisibleCount(16)
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  function shopFreshProduce() {
    setSearch('')
    setSavedOnly(false)
    setDealsOnly(false)
    setGiftEditOnly(false)
    setUnderBudget(false)
    setSort('featured')
    selectCategory('Fresh Produce')
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  function prepareContactEmail(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const subject = `${t('contact.subject')} - ${String(formData.get('name')).trim()}`
    const body = [
      `${t('contact.name')}: ${String(formData.get('name')).trim()}`,
      `${t('contact.replyEmail')}: ${String(formData.get('email')).trim()}`,
      '',
      String(formData.get('message')).trim(),
    ].join('\n')
    window.location.href = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  async function submitOrderRequest(address) {
    setOrderError('')
    setOrderNotice('')
    const items = Object.entries(cart).flatMap(([key, quantity]) => {
      const [id, variant] = key.split(':')
      const product = products.find((item) => item.id === Number(id))
      return product ? [{ product_id: product.id, name: product.name, variant, quantity, unit_price_rub: product.price }] : []
    })
    if (items.length === 0) {
      setOrderError(t('order.emptyError'))
      return
    }
    const subtotal = items.reduce((sum, item) => sum + item.unit_price_rub * item.quantity, 0)
    setOrderSubmitting(true)
    try {
      if (!authUser) {
        const notice = {
          id: window.crypto.randomUUID().slice(0, 8).toUpperCase(),
          guest: true,
          customerName: address.customerName.trim(),
          customerEmail: address.customerEmail.trim(),
          customerPhone: address.customerPhone.trim(),
          countryCode: address.countryCode,
          city: address.city.trim(),
          region: address.region.trim(),
          postalCode: address.postalCode.trim(),
          streetAddress: address.streetAddress.trim(),
          carrierPreference: address.carrierPreference,
          items,
          subtotal,
        }
        setOrderNotice(notice)
        setCart({})
        window.location.href = buildOrderEmailHref(notice, t, formatPrice)
        return
      }
      if (!supabase) {
        const data = createLocalOrder({
          user_id: authUser.id,
          customer_name: address.customerName.trim(),
          customer_phone: address.customerPhone.trim(),
          customer_email: address.customerEmail.trim(),
          country_code: address.countryCode,
          city: address.city.trim(),
          region: address.region.trim(),
          postal_code: address.postalCode.trim(),
          street_address: address.streetAddress.trim(),
          carrier_preference: address.carrierPreference,
          items,
          subtotal,
        })
        setOrders((currentOrders) => [data, ...currentOrders])
        setOrderNotice({
          id: data.id.slice(0, 8).toUpperCase(),
          items,
          subtotal,
          countryCode: address.countryCode,
          customerName: address.customerName.trim(),
          customerEmail: address.customerEmail.trim(),
          customerPhone: address.customerPhone.trim(),
          city: address.city.trim(),
          region: address.region.trim(),
          postalCode: address.postalCode.trim(),
          streetAddress: address.streetAddress.trim(),
          carrierPreference: address.carrierPreference,
        })
        setCart({})
        return
      }
      const { data, error } = await supabase
        .from('storefront_orders')
        .insert({
          user_id: authUser.id,
          customer_name: address.customerName.trim(),
          customer_phone: address.customerPhone.trim(),
          customer_email: address.customerEmail.trim(),
          country_code: address.countryCode,
          city: address.city.trim(),
          region: address.region.trim(),
          postal_code: address.postalCode.trim(),
          street_address: address.streetAddress.trim(),
          carrier_preference: address.carrierPreference,
          items,
          subtotal,
        })
        .select('id, created_at, status, items, country_code, city, subtotal')
        .single()
      if (error) throw error
      setOrders((currentOrders) => [data, ...currentOrders].slice(0, 25))
      setOrderNotice({
        id: data.id.slice(0, 8).toUpperCase(),
        items,
        subtotal,
        countryCode: address.countryCode,
        customerName: address.customerName.trim(),
        customerEmail: address.customerEmail.trim(),
        customerPhone: address.customerPhone.trim(),
        city: address.city.trim(),
        region: address.region.trim(),
        postalCode: address.postalCode.trim(),
        streetAddress: address.streetAddress.trim(),
        carrierPreference: address.carrierPreference,
      })
      setCart({})
    } catch (error) {
      console.error('Could not submit FENGS order request.', error)
      setOrderError(error.message || t('order.submitError'))
    } finally {
      setOrderSubmitting(false)
    }
  }

  async function signOut() {
    if (!supabase) {
      try {
        signOutLocalAccount()
        setAuthUser(null)
        setOrders([])
        setOrdersUserId(null)
        setAccountOpen(false)
      } catch (error) {
        console.error('Could not sign out of local FENGS account.', error)
        setToast(error.message || 'Could not sign out. Please try again.')
      }
      return
    }
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Could not sign out of FENGS account.', error)
      setToast(error.message || 'Could not sign out. Please try again.')
      window.setTimeout(() => setToast(''), 3000)
      return
    }
    setAccountOpen(false)
  }

  function reloadOrders() {
    if (authUser) setOrdersRefresh((value) => value + 1)
  }

  async function updateOrderStatus(orderId, status) {
    if (!supabase || !isStoreAdmin) throw new Error('You do not have permission to manage store orders.')
    const { data, error } = await supabase
      .from('storefront_orders')
      .update({ status })
      .eq('id', orderId)
      .select('id, status')
      .single()
    if (error) throw error
    setOrders((currentOrders) => currentOrders.map((order) => order.id === data.id ? { ...order, status: data.status } : order))
  }

  return (
    <div className="storefront" id="top">
      <div className="announcement">
        <span>{t('announcement')}</span>
        <span className="announcement-note">A little luxury, every day <span aria-hidden="true">✦</span></span>
        <div className="announcement-actions">
          <label className="locale-picker"><span>{t('region.label')}</span><select aria-label={t('region.label')} value={destinationCountry} onChange={(event) => changeCountry(event.target.value)}>{deliveryCountries.map((country) => <option key={country.code} value={country.code}>{country.flag} {country.name}</option>)}</select></label>
          <label className="locale-picker language-picker"><span>{t('language.label')}</span><select aria-label={t('language.label')} value={language} onChange={(event) => setLanguage(event.target.value)}>{languages.map((option) => <option key={option.code} value={option.code}>{option.label}</option>)}</select></label>
          <a href="#contact">{t('contact')} <span>→</span></a>
        </div>
      </div>

      <header className="site-header">
        <a className="brand" href="#" aria-label="FENGS LUXE EMPIRE home">
          <img className="brand-mark-image" src="/fengs-luxe-mark.svg" alt="" /><span className="brand-name">FENGS <b>LUXE EMPIRE</b></span>
        </a>
        <form className="search-form" role="search" onSubmit={submitSearch}>
          <Icon name="search" size={18} />
          <input value={search} onChange={(event) => { setSearch(event.target.value); setVisibleCount(16) }} placeholder={t('search.placeholder')} aria-label={t('search.label')} />
          {search && <button className="clear-search" type="button" onClick={() => setSearch('')} aria-label="Clear search"><Icon name="close" size={16} /></button>}
          <button className="search-submit" type="submit">{t('search.button')}</button>
        </form>
        <div className="header-actions">
          <button className="header-action" type="button" onClick={() => setAccountOpen(true)}><Icon name="truck" /><span>{t('nav.orders')}</span></button>
          <button className={`header-action ${savedOnly ? 'active-action' : ''}`} type="button" onClick={() => { setSavedOnly((value) => !value); setActiveCategory('All Products') }}><span className="icon-wrap"><Icon name="heart" fill={savedOnly ? 'currentColor' : 'none'} />{favorites.length > 0 && <span className="count-bubble">{favorites.length}</span>}</span><span>{t('nav.favorites')}</span></button>
          <button className="header-action" type="button" onClick={() => setCartOpen(true)}><span className="icon-wrap"><Icon name="bag" />{cartCount > 0 && <span className="count-bubble">{cartCount}</span>}</span><span>{t('nav.cart')}</span></button>
          <button className="header-action" type="button" onClick={() => setAccountOpen(true)}><Icon name="user" /><span>{authUser?.user_metadata?.full_name?.split(' ')[0] || t('nav.account')}</span></button>
        </div>
      </header>

      <nav className="category-nav" aria-label="Product categories">
        <div className="nav-inner">
          {categories.map((category) => <button key={category} className={`nav-category ${activeCategory === category && !savedOnly ? 'active' : ''}`} type="button" onClick={() => selectCategory(category)}>{t(categoryTranslationKeys[category])}</button>)}
          <span className="nav-promo">{t('nav.curated')}</span>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="hero-eyebrow"><span className="eyebrow-dot" /> {t('hero.eyebrow')}</span>
            <h1>{t('hero.title')}<br /><em>{t('hero.titleAccent')}</em></h1>
            <p>{t('hero.description')}</p>
            <a className="hero-cta" href="#products">{t('hero.cta')} <Icon name="arrow" size={17} /></a>
            <div className="hero-note"><Icon name="shield" size={16} /> {t('hero.note')}</div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="hero-circle" />
            <div className="hero-photo hero-photo-one"><img src={imageUrl('photo-1529139574466-a303027c1d8b', 700)} alt="" onError={hideUnavailableImage} /></div>
            <div className="hero-photo hero-photo-two"><img src={imageUrl('photo-1566150905458-1bf1fc113f0d', 600)} alt="" onError={hideUnavailableImage} /></div>
            <div className="hero-sticker"><span>{t('hero.madeFor')}</span><strong>{t('hero.you')}</strong><b>✦</b></div>
          </div>
        </section>

        <section className="fresh-market" aria-labelledby="fresh-market-title">
          <div className="fresh-market-image"><img src={imageUrl('photo-1490474418585-ba9bad8fd0ea', 800)} alt="" loading="lazy" onError={hideUnavailableImage} /></div>
          <div className="fresh-market-copy">
            <span className="eyebrow">{t('fruit.eyebrow')}</span>
            <h2 id="fresh-market-title">{t('fruit.title')}</h2>
            <p>{t('fruit.description')}</p>
            <button type="button" className="fresh-market-button" onClick={shopFreshProduce}>{t('fruit.cta')} <Icon name="arrow" size={16} /></button>
          </div>
        </section>

        <section className="seasonal-promos" aria-label="Seasonal promotions">
          <article className="promo-card promo-blackfriday">
            <span className="promo-eyebrow">{t('promo.blackFridayLabel')}</span>
            <h2>{t('promo.blackFridayTitle')}</h2>
            <p>{t('promo.blackFridayDescription')}</p>
            <button type="button" onClick={shopBlackFriday}>{t('promo.blackFridayButton')} <Icon name="arrow" size={16} /></button>
            <span className="promo-decoration" aria-hidden="true">F</span>
          </article>
          <article className="promo-card promo-december">
            <span className="promo-eyebrow">{t('promo.decemberLabel')}</span>
            <h2>{t('promo.decemberTitle')}</h2>
            <p>{t('promo.decemberDescription')}</p>
            <button type="button" onClick={shopDecemberGifts}>{t('promo.decemberButton')} <Icon name="arrow" size={16} /></button>
            <span className="promo-decoration" aria-hidden="true">✦</span>
          </article>
        </section>

        <section className="benefits" aria-label="Shopping benefits">
          <div className="benefit"><span className="benefit-icon"><Icon name="truck" size={19} /></span><div><strong>{t('benefit.delivery')}</strong><span>{t('benefit.deliveryNote')}</span></div></div>
          <div className="benefit"><span className="benefit-icon"><Icon name="shield" size={19} /></span><div><strong>{t('benefit.shopping')}</strong><span>{t('benefit.shoppingNote')}</span></div></div>
          <div className="benefit"><span className="benefit-icon"><Icon name="heart" size={19} /></span><div><strong>{t('benefit.picked')}</strong><span>{t('benefit.pickedNote')}</span></div></div>
        </section>

        <section className="products-section" id="products">
          <div className="section-heading">
            <div><span className="eyebrow">{t('catalog.eyebrow')}</span><h2>{giftEditOnly ? t('promo.decemberLabel') : savedOnly ? t('catalog.favorites') : search ? t('catalog.search') : t(categoryTranslationKeys[activeCategory])}</h2></div>
            <span className="heading-note">{t('catalog.count', { count: filteredProducts.length })}</span>
          </div>
          <div className="mobile-category-list" aria-label="Filter products by category">
            {categories.map((category) => <button key={category} className={activeCategory === category && !savedOnly ? 'active' : ''} type="button" onClick={() => selectCategory(category)}>{t(categoryTranslationKeys[category])}</button>)}
          </div>
          <div className="catalog-controls">
            <div className="filter-buttons" aria-label="Product filters">
              <button className={dealsOnly ? 'filter-chip active' : 'filter-chip'} type="button" aria-pressed={dealsOnly} onClick={() => { setDealsOnly((value) => !value); setVisibleCount(16) }}>{t('filter.deals')}</button>
              <button className={underBudget ? 'filter-chip active' : 'filter-chip'} type="button" aria-pressed={underBudget} onClick={() => { setUnderBudget((value) => !value); setVisibleCount(16) }}>{t('filter.budget', { price: formatPrice(3000) })}</button>
            </div>
            <label className="sort-picker"><span>{t('sort.label')}</span><select value={sort} onChange={(event) => { setSort(event.target.value); setVisibleCount(16) }}><option value="featured">{t('sort.featured')}</option><option value="popular">{t('sort.popular')}</option><option value="rating">{t('sort.rating')}</option><option value="price-low">{t('sort.low')}</option><option value="price-high">{t('sort.high')}</option></select></label>
          </div>
          {filteredProducts.length ? (
            <>
              <div className="product-grid">
                {visibleProducts.map((product) => <ProductCard key={product.id} product={product} favorite={favorites.includes(product.id)} quantity={cartQuantityByProduct[product.id] || 0} highlighted={highlightedProductId === product.id} t={t} formatPrice={formatPrice} onFavorite={toggleFavorite} onAdd={addToCart} onOpenCart={() => setCartOpen(true)} onView={setDetailProduct} />)}
              </div>
              {visibleCount < filteredProducts.length && <div className="load-more-wrap"><button className="load-more-button" type="button" onClick={() => setVisibleCount((count) => count + 16)}>{t('catalog.more')} <span>({t('catalog.remaining', { count: filteredProducts.length - visibleCount })})</span></button></div>}
            </>
          ) : (
            <div className="no-results"><span>✦</span><h3>{t('empty.title')}</h3><p>{t('empty.description')}</p><button className="button-primary" type="button" onClick={clearFilters}>{t('empty.browse')}</button></div>
          )}
        </section>

        <section className="newsletter">
          <div><span className="eyebrow">{t('newsletter.eyebrow')}</span><h2>{t('newsletter.title')}</h2><p>{t('newsletter.description')}</p></div>
          <a className="newsletter-button" href="#contact">{t('newsletter.contact')} <Icon name="arrow" size={17} /></a>
        </section>

        <section className="about-section" id="about">
          <div className="about-copy">
            <span className="eyebrow">{t('about.eyebrow')}</span>
            <h2>{t('about.title')}</h2>
            <p>{t('about.body')}</p>
            <div className="about-promise">
              <span className="about-promise-icon"><Icon name="heart" size={19} /></span>
              <div><h3>{t('about.promiseTitle')}</h3><p>{t('about.promiseBody')}</p></div>
            </div>
            <a className="about-contact-link" href="#contact">{t('newsletter.contact')} <Icon name="arrow" size={16} /></a>
          </div>
          <div className="about-brand-art" aria-hidden="true">
            <img src="/fengs-luxe-mark.svg" alt="" />
            <span>FENGS LUXE EMPIRE</span>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-intro">
            <span className="eyebrow">{t('contact.eyebrow')}</span>
            <h2>{t('contact.title')}</h2>
            <p>{t('contact.description')}</p>
            <div className="contact-details">
              <a className="contact-detail" href={`mailto:${supportEmail}`}>
                <span className="contact-detail-icon" aria-hidden="true">@</span>
                <span><small>{t('contact.email')}</small><strong>{supportEmail}</strong></span>
              </a>
              <a className="contact-detail" href={`tel:${supportPhone.replaceAll(' ', '').replaceAll('-', '')}`}>
                <span className="contact-detail-icon" aria-hidden="true">☎</span>
                <span><small>{t('contact.phone')}</small><strong>{supportPhone}</strong></span>
              </a>
            </div>
          </div>
          <form className="contact-form" onSubmit={prepareContactEmail}>
            <h3>{t('contact.formTitle')}</h3>
            <label>{t('contact.name')}<input name="name" autoComplete="name" required maxLength={120} /></label>
            <label>{t('contact.replyEmail')}<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
            <label>{t('contact.message')}<textarea name="message" rows={4} required maxLength={3000} /></label>
            <button className="button-primary" type="submit">{t('contact.send')} <Icon name="arrow" size={16} /></button>
            <p>{t('contact.formNote')}</p>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand"><a className="brand" href="#top"><img className="brand-mark-image" src="/fengs-luxe-mark.svg" alt="" /><span className="brand-name">FENGS <b>LUXE EMPIRE</b></span></a><p>{t('footer.description')}</p></div>
          <div className="footer-column"><h3>{t('footer.explore')}</h3><button type="button" onClick={() => { selectCategory('All Products'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>{t('footer.all')}</button><button type="button" onClick={() => { setSavedOnly(true); setActiveCategory('All Products'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>{t('footer.favorites')}</button><button type="button" onClick={() => setCartOpen(true)}>{t('footer.shoppingCart')}</button><a href="#about">{t('footer.about')}</a></div>
          <div className="footer-column"><h3>{t('footer.support')}</h3><a href="#contact">{t('contact')}</a><a href={`mailto:${supportEmail}`}>{supportEmail}</a><a href={`tel:${supportPhone.replaceAll(' ', '').replaceAll('-', '')}`}>{supportPhone}</a><button type="button" onClick={() => setAccountOpen(true)}>{t('footer.account')}</button></div>
        </div>
        <div className="footer-delivery">
          <div className="footer-delivery-heading"><div><span className="eyebrow">{t('footer.delivery')}</span><h3>{t('footer.destinationTitle')}</h3><p>{t('footer.destinationDescription')}</p></div><div className="footer-locale-pickers"><label className="footer-country-picker"><span>{t('footer.destination')}</span><select value={destinationCountry} onChange={(event) => changeCountry(event.target.value)}>{deliveryCountries.map((country) => <option key={country.code} value={country.code}>{country.flag} {country.name}</option>)}</select></label><label className="footer-country-picker"><span>{t('footer.language')}</span><select value={language} onChange={(event) => setLanguage(event.target.value)}>{languages.map((option) => <option key={option.code} value={option.code}>{option.label}</option>)}</select></label></div></div>
          <div className="country-flags" aria-label="Currently listed destinations">{deliveryCountries.map((country) => <span className={destinationCountry === country.code ? 'country-flag selected' : 'country-flag'} key={country.code} title={country.name} aria-label={country.name}>{country.flag}</span>)}</div>
          <div className="delivery-brands" aria-label="Delivery preferences available to request"><span className="delivery-brand cdek">CDEK</span><span className="delivery-brand russian-post">ПОЧТА РОССИИ</span><span className="delivery-brand dhl">DHL</span><span className="delivery-brand ems">EMS</span><span className="delivery-terms">{t('footer.carrierNote')}</span></div>
          <p className="currency-disclaimer">{t('footer.currencyNote')}</p>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} FENGS LUXE EMPIRE</span><span>{t('footer.made')} <span aria-hidden="true">✦</span></span></div>
      </footer>

      {cartOpen && <CartDrawer cart={cart} user={authUser} initialCountry={destinationCountry} t={t} formatPrice={formatPrice} submitting={orderSubmitting} orderNotice={orderNotice} orderError={orderError} onClose={() => setCartOpen(false)} onChangeQuantity={changeQuantity} onSubmitOrder={submitOrderRequest} onLogin={() => { setCartOpen(false); setAccountOpen(true) }} />}
      {accountOpen && <AccountDialog key={authUser?.id || (authRecoveryMode ? 'password-recovery' : 'signed-out')} user={authUser} recoveryMode={authRecoveryMode} isStoreAdmin={isStoreAdmin} localMode={!supabaseEnabled} orders={ordersUserId === authUser?.id ? orders : []} ordersLoading={ordersLoading || (Boolean(authUser) && ordersUserId !== authUser.id)} ordersError={ordersUserId === authUser?.id ? ordersError : ''} t={t} formatPrice={formatPrice} dateLocale={selectedCountry.locale} onLocalSignIn={setAuthUser} onLocalProfileUpdate={setAuthUser} onClose={() => setAccountOpen(false)} onSignOut={signOut} onLoadOrders={reloadOrders} onUpdateOrderStatus={updateOrderStatus} onRecoveryComplete={() => setAuthRecoveryMode(false)} />}
      {detailProduct && <ProductDetailsDialog key={detailProduct.id} product={detailProduct} relatedProducts={products.filter((product) => product.category === detailProduct.category && product.id !== detailProduct.id).slice(0, 4)} favorite={favorites.includes(detailProduct.id)} t={t} formatPrice={formatPrice} onClose={() => setDetailProduct(null)} onAdd={addToCart} onFavorite={toggleFavorite} onView={setDetailProduct} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}

export default App
