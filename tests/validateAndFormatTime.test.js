// validateAndFormatTime 单元测试（对应 js/custom-exam.js 中的 validateAndFormatTime）
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { installDomStub } = require("./helpers/dom-stub");

installDomStub();
const { validateAndFormatTime } = require(
  path.join(__dirname, "..", "js", "custom-exam.js"),
);

test("validateAndFormatTime：合法时间字符串被规范化为 HH:MM", () => {
  assert.equal(validateAndFormatTime("09:30"), "09:30");
  assert.equal(validateAndFormatTime("9:30"), "09:30");
  assert.equal(validateAndFormatTime("0930"), "09:30");
});

test("validateAndFormatTime：非法/越界时间返回 null", () => {
  assert.equal(validateAndFormatTime("25:99"), null);
  assert.equal(validateAndFormatTime("24:00"), null);
  assert.equal(validateAndFormatTime("abc"), null);
});

test("validateAndFormatTime：空值与 null 返回 null", () => {
  assert.equal(validateAndFormatTime(""), null);
  assert.equal(validateAndFormatTime(null), null);
});
