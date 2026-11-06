import test from "node:test";
import assert from "node:assert/strict";
import { quote, settle, couponMessage } from "../pricing.ts";
import { signAuthToken, verifyAuthToken, extractBearerToken, checkRole } from "../auth-jwt.ts";
import { createPaymentIntent } from "../payment-gateway.ts";

test("Commerce Pricing Engine - quote calculations", () => {
  const highQuote = quote(200, null);
  assert.equal(highQuote.discount, 0);
  assert.equal(highQuote.shipping, 0);
  assert.equal(highQuote.tax, 10);
  assert.equal(highQuote.total, 210);

  const standardQuote = quote(100, null);
  assert.equal(standardQuote.discount, 0);
  assert.equal(standardQuote.shipping, 12);
  assert.equal(standardQuote.tax, 5);
  assert.equal(standardQuote.total, 117);

  const studentQuote = quote(100, "STUDENT20");
  assert.equal(studentQuote.discount, 20);
  assert.equal(studentQuote.after, 80);
  assert.equal(studentQuote.shipping, 12);
  assert.equal(studentQuote.tax, 4);
  assert.equal(studentQuote.total, 96);
  assert.equal(studentQuote.code, "STUDENT20");

  const flatQuote = quote(100, "SAVE15");
  assert.equal(flatQuote.discount, 15);
  assert.equal(flatQuote.after, 85);
  assert.equal(flatQuote.shipping, 12);
  assert.equal(flatQuote.tax, 4.25);
  assert.equal(flatQuote.total, 101.25);
});

test("Commerce Pricing Engine - coupon message display", () => {
  assert.equal(couponMessage(null), null);
  assert.match(couponMessage("STUDENT20") || "", /20% off/);
  assert.match(couponMessage("SAVE15") || "", /\$15 off/);
});

test("Commerce Settlement Engine - loyalty points and wallet tenders", () => {
  const res1 = settle(100, 90, 50, 2000, { useWallet: false, points: 0 });
  assert.equal(res1.loyaltyDiscount, 0);
  assert.equal(res1.walletApplied, 0);
  assert.equal(res1.due, 100);

  const res2 = settle(100, 90, 50, 5000, { useWallet: false, points: 3000 });
  assert.equal(res2.loyaltyDiscount, 27);
  assert.equal(res2.pointsUsed, 2700);
  assert.equal(res2.due, 73);

  const res3 = settle(100, 90, 50, 5000, { useWallet: true, points: 3000 });
  assert.equal(res3.loyaltyDiscount, 27);
  assert.equal(res3.walletApplied, 50);
  assert.equal(res3.due, 23);
});

test("JWT & RBAC Security Module", async () => {
  const token = await signAuthToken({
    userId: "USR-001",
    email: "admin@shopsphere.studio",
    role: "admin",
    name: "Admin Studio",
  });
  assert.ok(token);

  const payload = await verifyAuthToken(token);
  assert.ok(payload);
  assert.equal(payload.email, "admin@shopsphere.studio");
  assert.equal(payload.role, "admin");

  const extracted = extractBearerToken(`Bearer ${token}`);
  assert.equal(extracted, token);
  assert.equal(extractBearerToken("InvalidHeader"), null);

  assert.equal(checkRole("admin", "admin"), true);
  assert.equal(checkRole("customer", "admin"), false);
  assert.equal(checkRole("admin", "customer"), true);
  assert.equal(checkRole("customer", "customer"), true);
});

test("Payment Gateway Integration Adapters", async () => {
  const stripeRes = await createPaymentIntent({
    orderId: "ORD-001",
    amount: 145.5,
    currency: "USD",
    provider: "stripe",
    customer: { name: "Client Test", email: "client@test.com" },
  });
  assert.equal(stripeRes.success, true);
  assert.equal(stripeRes.provider, "stripe");
  assert.ok(stripeRes.clientSecret);

  const paypalRes = await createPaymentIntent({
    orderId: "ORD-002",
    amount: 89.0,
    currency: "USD",
    provider: "paypal",
    customer: { name: "Client Test", email: "client@test.com" },
  });
  assert.equal(paypalRes.success, true);
  assert.equal(paypalRes.provider, "paypal");
  assert.ok(paypalRes.approvalUrl);

  const codRes = await createPaymentIntent({
    orderId: "ORD-003",
    amount: 50.0,
    currency: "USD",
    provider: "cod",
    customer: { name: "Client Test", email: "client@test.com" },
  });
  assert.equal(codRes.success, true);
  assert.equal(codRes.status, "succeeded");
});
