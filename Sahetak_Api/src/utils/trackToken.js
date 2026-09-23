const crypto = require("crypto");

// Short-lived signed token issued after a successful /orders/track. Mutations
// (update/cancel) must present it, so the (trackingCode, phone) pair can no
// longer be replayed directly and a leaked link expires quickly.
const TRACK_TOKEN_TTL =
  Number(process.env.TRACK_TOKEN_TTL_SECONDS) || 15 * 60; // 15 minutes

const getSecret = () =>
  process.env.TRACK_TOKEN_SECRET || process.env.JWT_SECRET || "track-secret";

const hmac = (payload) =>
  crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");

// token := "<orderId>:<phone>:<expMs>.<hexSignature>"
const signTrackToken = ({ orderId, phone, now = Date.now() }) => {
  const exp = now + TRACK_TOKEN_TTL * 1000;
  const payload = `${String(orderId)}:${String(phone).trim()}:${exp}`;

  return `${payload}.${hmac(payload)}`;
};

const verifyTrackToken = (token, { orderId, phone }) => {
  if (typeof token !== "string" || token.length > 512) {
    return false;
  }

  const dot = token.lastIndexOf(".");

  if (dot <= 0) {
    return false;
  }

  const payload = token.slice(0, dot);
  const givenSignature = token.slice(dot + 1);

  const [tokenOrderId, tokenPhone, expStr] = payload.split(":");

  if (!tokenOrderId || tokenOrderId !== String(orderId)) {
    return false;
  }

  if (tokenPhone !== String(phone).trim()) {
    return false;
  }

  const exp = Number(expStr);

  if (!Number.isFinite(exp) || exp < Date.now()) {
    return false;
  }

  const expected = hmac(payload);
  const a = Buffer.from(givenSignature, "utf8");
  const b = Buffer.from(expected, "utf8");

  if (a.length !== b.length) {
    return false;
  }

  return crypto.timingSafeEqual(a, b);
};

module.exports = { signTrackToken, verifyTrackToken };