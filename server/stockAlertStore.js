import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'stock_alerts.json');

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    const initial = { subscriptions: [], productStock: {} };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading stock_alerts.json, resetting to empty store:', err.message);
    return { subscriptions: [], productStock: {} };
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing stock_alerts.json:', err.message);
  }
}

/**
 * Register a new stock alert subscription
 */
export function addSubscription({ productId, email, productName, price, image, externalLink }) {
  const data = loadData();
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanProductId = String(productId).trim();

  // Avoid duplicate active subscriptions
  const existing = data.subscriptions.find(
    s => s.productId === cleanProductId && s.email === cleanEmail && s.status === 'pending'
  );

  if (existing) {
    return { subscription: existing, isNew: false };
  }

  const newSub = {
    id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    productId: cleanProductId,
    productName: productName || `Product #${cleanProductId}`,
    email: cleanEmail,
    price: price || null,
    image: image || null,
    externalLink: externalLink || null,
    status: 'pending', // 'pending' | 'notified'
    createdAt: new Date().toISOString(),
    notifiedAt: null
  };

  data.subscriptions.push(newSub);
  saveData(data);
  return { subscription: newSub, isNew: true };
}

/**
 * Get all subscriptions with optional filter
 */
export function getSubscriptions(filter = {}) {
  const data = loadData();
  let list = data.subscriptions;

  if (filter.productId) {
    list = list.filter(s => s.productId === String(filter.productId));
  }
  if (filter.email) {
    list = list.filter(s => s.email === filter.email.trim().toLowerCase());
  }
  if (filter.status) {
    list = list.filter(s => s.status === filter.status);
  }

  return list;
}

/**
 * Mark a subscription as notified
 */
export function markAsNotified(id) {
  const data = loadData();
  const sub = data.subscriptions.find(s => s.id === id);
  if (sub) {
    sub.status = 'notified';
    sub.notifiedAt = new Date().toISOString();
    saveData(data);
    return sub;
  }
  return null;
}

/**
 * Get or update product stock flag
 */
export function setProductStock(productId, inStock) {
  const data = loadData();
  const prevStatus = data.productStock[productId] !== undefined ? data.productStock[productId].inStock : true;
  data.productStock[productId] = {
    inStock: Boolean(inStock),
    updatedAt: new Date().toISOString()
  };
  saveData(data);
  return {
    productId,
    inStock: Boolean(inStock),
    flippedFromFalseToTrue: prevStatus === false && Boolean(inStock) === true
  };
}

export function getProductStock(productId) {
  const data = loadData();
  if (data.productStock[productId]) {
    return data.productStock[productId].inStock;
  }
  return true; // Default in stock
}

export default {
  addSubscription,
  getSubscriptions,
  markAsNotified,
  setProductStock,
  getProductStock
};
