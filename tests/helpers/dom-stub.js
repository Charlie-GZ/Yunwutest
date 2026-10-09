// 测试辅助：在 Node 环境为浏览器脚本提供最小 DOM/BOM 桩。
// 目的：让 js/script.js、js/custom-exam.js 可以被 require 后取用其中的纯函数。
// 说明：这是"可测性改造"白名单允许的做法，仅在测试进程内生效，
//       不修改任何产品代码逻辑，也不改变浏览器内的行为。

function createStubElement() {
  const noop = () => {};
  return {
    style: {},
    dataset: {},
    classList: {
      add: noop,
      remove: noop,
      toggle: noop,
      contains: () => false,
    },
    setAttribute: noop,
    removeAttribute: noop,
    getAttribute: () => null,
    addEventListener: noop,
    removeEventListener: noop,
    appendChild: noop,
    removeChild: noop,
    insertBefore: noop,
    querySelector: () => null,
    querySelectorAll: () => [],
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 0, height: 0 }),
    focus: noop,
    remove: noop,
    getAnimations: () => [],
  };
}

function installDomStub() {
  if (globalThis.__examClockDomStubInstalled) return;
  const noop = () => {};

  globalThis.document = {
    addEventListener: noop,
    removeEventListener: noop,
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: createStubElement,
    body: createStubElement(),
    documentElement: createStubElement(),
    readyState: "complete",
  };

  // 脚本中会访问 window.AudioContext / window.customExams 等
  globalThis.window = globalThis;
  if (!globalThis.navigator) globalThis.navigator = { userAgent: "node" };

  // 带真实存储的 localStorage 桩
  const store = Object.create(null);
  globalThis.localStorage = {
    getItem: (key) =>
      Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null,
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      for (const key of Object.keys(store)) delete store[key];
    },
  };

  globalThis.__examClockDomStubInstalled = true;
}

module.exports = { installDomStub };
