/**
 * Mock LLM response fixtures.
 *
 * These return real-looking JSON so the entire pipeline — callLLM → parseForks
 * → setVersions → render — can be exercised without an API key.
 *
 * Used by the "mock" provider (see providers.ts).
 */

import type { RawFork } from "../spawnPrompt"

interface SpawnInput {
  name: string
  age: number
  bio: string
  nodes: Array<{ age: number; moment?: string; event: string }>
}

/**
 * Generate fork data from the user's actual seed.
 * We don't have a real LLM, but we can use the user's nodes to make the result
 * feel personalized: each fork diverges from one of their real nodes.
 */
export function buildSpawnFixture(input: SpawnInput, locale: string): { forks: RawFork[] } {
  const isCJK =
    locale.startsWith("zh") || locale.startsWith("ja") || locale.startsWith("ko")
  const t = isCJK ? cnTemplates : enTemplates

  const subjectAge = input.age || 30
  const subject = input.name || (isCJK ? "你" : "you")

  // Pull from user nodes if available, else fall back to generic forks
  const nodesOrFallback =
    input.nodes.length > 0
      ? input.nodes
      : [
          { age: Math.max(18, subjectAge - 10), event: t.fallbackNode1 },
          { age: Math.max(20, subjectAge - 5), event: t.fallbackNode2 },
          { age: Math.max(22, subjectAge - 2), event: t.fallbackNode3 },
        ]

  const vibes: RawFork["vibe"][] = ["shine", "ash", "drift", "quiet", "burn", "shine"]

  const forks: RawFork[] = vibes.map((vibe, i) => {
    const node = nodesOrFallback[i % nodesOrFallback.length]
    const startAge = node.age
    const span = Math.max(2, subjectAge - startAge)
    const t1 = startAge + Math.round(span * 0.2)
    const t2 = startAge + Math.round(span * 0.5)
    const t3 = startAge + Math.round(span * 0.8)
    const tNow = subjectAge

    const template = t.forkTemplates[i]
    return {
      divergence: {
        age: startAge,
        moment: node.moment || template.moment,
        event: node.event,
        alternative: template.alternative(subject),
      },
      trajectory: [
        { age: t1, moment: template.tj1Moment, state: template.tj1() },
        { age: t2, moment: template.tj2Moment, state: template.tj2() },
        { age: t3, moment: template.tj3Moment, state: template.tj3() },
        { age: tNow, moment: template.tjNowMoment, state: template.tjNow() },
      ],
      outcome: template.outcome(),
      vibe,
    }
  })

  return { forks }
}

const enTemplates = {
  fallbackNode1: "Picked a path you weren't sure about",
  fallbackNode2: "Moved to a new city for someone",
  fallbackNode3: "Said yes when you wanted to say no",
  forkTemplates: [
    {
      moment: "the spring after",
      alternative: (s: string) =>
        `${s} chose the road less travelled — a smaller life, a quieter one, but one that fit.`,
      tj1Moment: "two years in",
      tj1: () => "Settled into a job at a co-op bookstore. Knew every regular by name.",
      tj2Moment: "by their thirties",
      tj2: () => "Married someone they met in the philosophy section. A small wedding.",
      tj3Moment: "a decade on",
      tj3: () => "A child. Long walks. Began writing essays on Sunday mornings.",
      tjNowMoment: "now",
      tjNow: () =>
        "Still in the same town, the same store. Owns it now. Sleeps without an alarm.",
      outcome: () =>
        "Small life, fully lived. Not famous, not rich, not lost. Some mornings you'd envy them; some mornings they'd envy you.",
    },
    {
      moment: "by the following winter",
      alternative: (s: string) =>
        `${s} took the offer everyone said no to — the one that ended badly.`,
      tj1Moment: "year one",
      tj1: () => "Burned hot, slept little. The new city felt like air.",
      tj2Moment: "year three",
      tj2: () => "The thing collapsed. Investors lawyered up. The friendship didn't survive.",
      tj3Moment: "year five",
      tj3: () => "Two years on antidepressants. A series of unsatisfying contract gigs.",
      tjNowMoment: "now",
      tjNow: () =>
        "Quiet apartment, careful hours. Doesn't talk about that period anymore.",
      outcome: () =>
        "What was lost: the certainty that risk is always worth it. What was kept: an unmistakable line in the sand.",
    },
    {
      moment: "the summer they were 25",
      alternative: (s: string) =>
        `${s} drifted — quit, moved abroad, slept on couches, taught English.`,
      tj1Moment: "a few months later",
      tj1: () => "Lisbon. Then Bangkok. Then a small town outside of Kyoto.",
      tj2Moment: "by year three",
      tj2: () => "Stopped answering family emails. Lost touch with everyone.",
      tj3Moment: "by year seven",
      tj3: () => "Came back briefly for a funeral. Couldn't sit through it.",
      tjNowMoment: "now",
      tjNow: () =>
        "On an island, somewhere. Reads more than speaks. Doesn't miss what they left.",
      outcome: () =>
        "Unanchored is a kind of freedom. So is being needed. They picked one. You picked the other.",
    },
    {
      moment: "Tuesday morning, autumn",
      alternative: (s: string) =>
        `${s} stayed exactly where they were. Said no to every drift.`,
      tj1Moment: "after a year",
      tj1: () => "Promotion. Then another. Their parents called more.",
      tj2Moment: "by 32",
      tj2: () => "House. Partner. A dog named after a writer.",
      tj3Moment: "by 40",
      tj3: () => "The job stopped being interesting. They didn't notice for a long time.",
      tjNowMoment: "now",
      tjNow: () =>
        "Comfortable. A specific kind of comfortable. Wonders, sometimes, on long drives.",
      outcome: () =>
        "Built well, on land that didn't move. The view from there is mostly clear. Sometimes the wonder gets loud.",
    },
    {
      moment: "the night they almost didn't go",
      alternative: (s: string) =>
        `${s} went anyway — the party, the trip, the call — and met someone who broke them open.`,
      tj1Moment: "six months in",
      tj1: () => "Found themselves doing things they'd never have done alone.",
      tj2Moment: "year two",
      tj2: () => "It collapsed dramatically, the way only first big loves do.",
      tj3Moment: "year five",
      tj3: () => "Built something — a band, a small company, a child — out of the rubble.",
      tjNowMoment: "now",
      tjNow: () =>
        "Brighter than the original version. More scars too. They wouldn't trade.",
      outcome: () =>
        "A version who burned through the careful container. Not everyone survives this fork. They did, mostly.",
    },
    {
      moment: "the morning of the interview",
      alternative: (s: string) =>
        `${s} got the thing — the big one, the one you were also up for — and never looked back.`,
      tj1Moment: "a year in",
      tj1: () => "Stock options. Glass building. A boss who said their name in meetings.",
      tj2Moment: "five years on",
      tj2: () => "Promotion track. A second apartment. A divorce, eventually.",
      tj3Moment: "by their forties",
      tj3: () => "Tired in a particular way. Stopped reading novels.",
      tjNowMoment: "now",
      tjNow: () =>
        "Wealthy. Successful. Lonely in the way ambitious people are lonely.",
      outcome: () =>
        "Got the thing. Paid the price the thing always costs. Wouldn't undo it, mostly.",
    },
  ],
}

const cnTemplates = {
  fallbackNode1: "选了一条不太确定的路",
  fallbackNode2: "为某个人搬去了另一座城",
  fallbackNode3: "本来想说不,却说了好",
  forkTemplates: [
    {
      moment: "那年春天",
      alternative: (s: string) =>
        `${s}选了人迹更少的那条 —— 一种更小、更安静、却更合身的生活。`,
      tj1Moment: "两年后",
      tj1: () => "在一家合作社书店稳定下来。每个老主顾的名字都记得。",
      tj2Moment: "三十几岁",
      tj2: () => "和在哲学书架前遇见的人结了婚。一场小婚礼。",
      tj3Moment: "十年过去",
      tj3: () => "有了孩子。长长的散步。开始在周日早上写随笔。",
      tjNowMoment: "现在",
      tjNow: () =>
        "还在那个小镇,那家书店。现在是他/她自己的。不需要闹钟。",
      outcome: () =>
        "小生活,完整地活过。不出名、不富有、不迷茫。有些早晨你会羡慕他;有些早晨他会羡慕你。",
    },
    {
      moment: "次年冬天",
      alternative: (s: string) =>
        `${s}接受了所有人都劝阻的那个 offer —— 结局不好的那个。`,
      tj1Moment: "第一年",
      tj1: () => "烧得很猛,睡得很少。新城市像空气一样。",
      tj2Moment: "第三年",
      tj2: () => "项目崩了。投资人请了律师。友谊没熬过去。",
      tj3Moment: "第五年",
      tj3: () => "吃了两年抗抑郁药。一连串没意思的合同活。",
      tjNowMoment: "现在",
      tjNow: () => "安静的公寓,克制的作息。不再提起那段时间。",
      outcome: () =>
        "失去的:相信冒险总值得的笃定。留下的:一条不容置疑的底线。",
    },
    {
      moment: "他/她 25 岁那个夏天",
      alternative: (s: string) =>
        `${s}漂走了 —— 辞职、出国、睡沙发、教英语。`,
      tj1Moment: "几个月后",
      tj1: () => "里斯本。然后曼谷。然后京都郊外一个小镇。",
      tj2Moment: "第三年",
      tj2: () => "不再回家人的邮件。和所有人都失联了。",
      tj3Moment: "第七年",
      tj3: () => "为一场葬礼短暂回来过。坐不完那场仪式。",
      tjNowMoment: "现在",
      tjNow: () => "在某个岛上。读得比说得多。不怀念离开的那一切。",
      outcome: () =>
        "无根是一种自由。被需要也是。他/她选了一种,你选了另一种。",
    },
    {
      moment: "秋天那个周二早上",
      alternative: (s: string) =>
        `${s}哪儿都没去。每一次漂移都拒绝了。`,
      tj1Moment: "一年后",
      tj1: () => "升职。然后又一次。父母打电话变得更勤。",
      tj2Moment: "32 岁",
      tj2: () => "房子。伴侣。一只用作家名字命名的狗。",
      tj3Moment: "40 岁",
      tj3: () => "工作不再有意思。很久之后他/她才注意到。",
      tjNowMoment: "现在",
      tjNow: () =>
        "舒适。一种很具体的舒适。偶尔,在长途开车时,会有些怅然。",
    outcome: () =>
        "在不会移动的土地上,稳稳地建起。从那里看出去多半是清楚的。偶尔,那个怅然变大声。",
    },
    {
      moment: "差点没去的那一晚",
      alternative: (s: string) =>
        `${s}还是去了 —— 那个聚会、那次旅行、那通电话 —— 遇见了一个让他/她崩开的人。`,
      tj1Moment: "六个月后",
      tj1: () => "做了些自己一个人永远不会做的事。",
      tj2Moment: "第二年",
      tj2: () => "戏剧性地崩了 —— 只有第一次大爱才会那么崩。",
      tj3Moment: "第五年",
      tj3: () => "从废墟里建出了点东西 —— 一支乐队、一家小公司、或者一个孩子。",
      tjNowMoment: "现在",
      tjNow: () =>
        "比原版亮一些。也多一些伤疤。他/她不会换回去。",
      outcome: () =>
        "一个烧穿了精致容器的版本。不是每个人能从这个岔路活下来。他/她活下来了,大体上。",
    },
    {
      moment: "面试那天早上",
      alternative: (s: string) =>
        `${s}拿到了那个 —— 那个大的、那个你也在争的 —— 然后再也没回头。`,
      tj1Moment: "一年后",
      tj1: () => "股权。玻璃大楼。一个会在会议上提起他/她名字的老板。",
      tj2Moment: "五年后",
      tj2: () => "升职轨道。第二套公寓。最后是一场离婚。",
      tj3Moment: "四十岁",
      tj3: () => "一种特定的疲惫。不再读小说。",
      tjNowMoment: "现在",
      tjNow: () =>
        "有钱。成功。野心勃勃的人特有的那种孤独。",
      outcome: () =>
        "拿到了。也付了它一向要的那个价。他/她大体上不会撤销。",
    },
  ],
}

/**
 * Fixture for the Importer (extract from text → seed).
 */
export const extractFixture = (locale: string) => {
  const isCJK =
    locale.startsWith("zh") || locale.startsWith("ja") || locale.startsWith("ko")
  if (isCJK) {
    return {
      name: "未命名",
      age: 32,
      bio: "一段从导入文本里抽出来的简短画像。换成真 API key 后,这里会用模型实际解析的内容。",
      nodes: [
        { age: 18, event: "选了一所离家很远的大学" },
        { age: 22, event: "拒绝了第一个 offer,选了第二个" },
        { age: 28, event: "搬去了另一座城" },
      ],
    }
  }
  return {
    name: "untitled",
    age: 32,
    bio: "A brief sketch extracted from the input text. With a real API key, this will be what the model actually parsed.",
    nodes: [
      { age: 18, event: "Picked a college far from home" },
      { age: 22, event: "Turned down the first offer, took the second" },
      { age: 28, event: "Moved to a different city" },
    ],
  }
}
