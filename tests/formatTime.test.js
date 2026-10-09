// formatTime 单元测试（对应 js/script.js 中的 formatTime）
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { installDomStub } = require("./helpers/dom-stub");

installDomStub();
const { formatTime } = require(path.join(__dirname, "..", "js", "script.js"));

test("formatTime：0 秒 → 00:00:00", () => {
  assert.equal(formatTime(0), "00:00:00");
});

test("formatTime：7325 秒 → 02:02:05", () => {
  assert.equal(formatTime(7325), "02:02:05");
});

test("formatTime：负数按实现钳制为 0 → 00:00:00", () => {
  // 本实现选择"负数钳制为 0"的防御性语义，测试据此断言
  assert.equal(formatTime(-1), "00:00:00");
  assert.equal(formatTime(-600), "00:00:00");
});
