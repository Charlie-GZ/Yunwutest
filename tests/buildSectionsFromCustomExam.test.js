// buildSectionsFromCustomExam 单元测试
// 对应 js/script.js 中 T1 抽离的"自定义考试 → 环节链"纯函数
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { installDomStub } = require("./helpers/dom-stub");

installDomStub();
const { buildSectionsFromCustomExam } = require(
  path.join(__dirname, "..", "js", "script.js"),
);

// 随题 fixture：科目一 90（计入） / 休息 10（不计入） / 科目二 30（计入）
function createFixture() {
  return {
    name: "模拟测评-综合卷",
    startTime: "09:00",
    date: "2026-10-15",
    sections: [
      { name: "科目一", duration: 90, description: "科目一", countInTotal: true },
      { name: "休息", duration: 10, description: "休息", countInTotal: false },
      { name: "科目二", duration: 30, description: "科目二", countInTotal: true },
    ],
  };
}

test("T1 回归：fixture 下每个环节的 start / end / realTime", () => {
  const { sections, totalMinutes } = buildSectionsFromCustomExam(createFixture());

  assert.equal(totalMinutes, 120);

  assert.equal(sections[0].name, "科目一");
  assert.equal(sections[0].start, 0);
  assert.equal(sections[0].end, 90);
  assert.equal(sections[0].realTime, "09:00-10:30");

  // 不计入环节：零时长占位，start === end，位置=其前计入环节之和
  assert.equal(sections[1].name, "休息");
  assert.equal(sections[1].start, 90);
  assert.equal(sections[1].end, 90);
  assert.equal(sections[1].realTime, "10:30-10:30");

  assert.equal(sections[2].name, "科目二");
  assert.equal(sections[2].start, 90);
  assert.equal(sections[2].end, 120);
  assert.equal(sections[2].realTime, "10:30-11:00");
});

test('T1 回归："考试结束"位置 = 120 = totalMinutes', () => {
  const { sections, totalMinutes } = buildSectionsFromCustomExam(createFixture());
  const endSection = sections[sections.length - 1];

  assert.equal(endSection.name, "考试结束");
  assert.equal(endSection.start, 120);
  assert.equal(endSection.end, 120);
  assert.equal(endSection.start, totalMinutes);
});

test("防御用例：全部环节 countInTotal=false 时不抛错且总时长为 0", () => {
  const exam = {
    name: "全是休息",
    startTime: "09:00",
    sections: [
      { name: "A", duration: 30, description: "A", countInTotal: false },
      { name: "B", duration: 20, description: "B", countInTotal: false },
    ],
  };

  let result;
  assert.doesNotThrow(() => {
    result = buildSectionsFromCustomExam(exam);
  });

  assert.equal(result.totalMinutes, 0);
  // 所有环节均为零时长占位
  assert.equal(result.sections[0].start, 0);
  assert.equal(result.sections[0].end, 0);
  assert.equal(result.sections[1].start, 0);
  assert.equal(result.sections[1].end, 0);
  // "考试结束"位于 0
  const endSection = result.sections[result.sections.length - 1];
  assert.equal(endSection.name, "考试结束");
  assert.equal(endSection.start, 0);
  assert.equal(endSection.end, 0);
});

test('去重：输入 sections 已含"考试结束"时，输出仍只保留唯一结束环节', () => {
  // 自定义考试表单会自动带一个"考试结束"卡片，保存后 sections 末尾即含它
  const exam = {
    name: "含结束环节的自定义考试",
    startTime: "09:00",
    sections: [
      { name: "科目一", duration: 90, description: "a", countInTotal: true },
      { name: "休息", duration: 10, description: "b", countInTotal: false },
      { name: "科目二", duration: 30, description: "c", countInTotal: true },
      { name: "考试结束", duration: 0, description: "收卷", countInTotal: false },
    ],
  };

  const { sections, totalMinutes } = buildSectionsFromCustomExam(exam);
  const endSections = sections.filter((s) => s.name === "考试结束");

  assert.equal(endSections.length, 1);
  assert.equal(sections.length, 4);
  assert.equal(totalMinutes, 120);
  assert.equal(endSections[0].start, 120);
  assert.equal(endSections[0].end, 120);
});
