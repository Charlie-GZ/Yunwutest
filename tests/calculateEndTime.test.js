// calculateEndTime 单元测试（对应 js/script.js 中的 calculateEndTime）
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { installDomStub } = require("./helpers/dom-stub");

installDomStub();
const { calculateEndTime } = require(
  path.join(__dirname, "..", "js", "script.js"),
);

test('calculateEndTime：("09:00", 120) → 11:00', () => {
  assert.equal(calculateEndTime("09:00", 120), "11:00");
});

test('calculateEndTime：("23:30", 120) → 01:30 (次日)，处理跨午夜', () => {
  assert.equal(calculateEndTime("23:30", 120), "01:30 (次日)");
});

test('calculateEndTime：("00:00", 0) → 00:00', () => {
  assert.equal(calculateEndTime("00:00", 0), "00:00");
});
