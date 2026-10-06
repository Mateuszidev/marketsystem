import assert from "node:assert/strict";
import { test } from "node:test";
import { discountPercentage } from "./promotion";
import { createProductSchema } from "./validations";

const product = {
  name: "Produto teste", sku: "TEST", active: true, categoryId: 1,
  quantity: 10, minQuantity: 0, flavors: [], price: 120,
};

test("calculates discounts in cents and rounds down", () => {
  assert.equal(discountPercentage(120, 150), 20);
  assert.equal(discountPercentage(99.9, 129.9), 23);
  assert.equal(discountPercentage(0.07, 0.1), 30);
  assert.equal(discountPercentage(99.99, 100), 0);
});

test("does not display a discount without a valid comparison price", () => {
  for (const original of [null, undefined, 0, 119, 120]) {
    assert.equal(discountPercentage(120, original), null);
  }
  assert.equal(discountPercentage(0, 150), null);
});

test("accepts regular prices and valid promotions", () => {
  assert.equal(createProductSchema.safeParse(product).success, true);
  assert.equal(createProductSchema.safeParse({ ...product, originalPrice: null }).success, true);
  assert.equal(createProductSchema.safeParse({ ...product, originalPrice: 150 }).success, true);
});

test("rejects invalid promotions and fractions of a cent", () => {
  for (const originalPrice of [0, -1, 119, 120, 150.001]) {
    assert.equal(createProductSchema.safeParse({ ...product, originalPrice }).success, false);
  }
  assert.equal(createProductSchema.safeParse({ ...product, price: 0, originalPrice: 150 }).success, false);
  assert.equal(createProductSchema.safeParse({ ...product, price: 119.999, originalPrice: 150 }).success, false);
});
