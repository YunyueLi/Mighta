/**
 * Mock LLM response fixtures.
 *
 * Used by the "mock" provider — returns realistic JSON so the entire
 * callLLM → parseForks → render pipeline can be exercised without a key.
 *
 * Famous-life presets (Steve Jobs, Elon Musk, etc.) get HAND-WRITTEN
 * hero fixtures — six specific counterfactuals tied to their real life
 * nodes, with concrete people, places, dates. This is the demo content
 * users see before deciding to bring a real key.
 *
 * Unknown seeds fall back to slightly-generic templates that still try
 * to reference the user's actual nodes.
 */

import type { RawFork } from "../spawnPrompt"

interface SpawnInput {
  name: string
  age: number
  bio: string
  nodes: Array<{ age: number; moment?: string; event: string }>
}

type ForkSpec = Omit<RawFork, "id">

// ─────────────────────────────────────────────────────────────────────
// Steve Jobs — hand-written hero fixture
// ─────────────────────────────────────────────────────────────────────

const steveJobsEN: ForkSpec[] = [
  {
    divergence: {
      age: 17,
      moment: "the spring of '73, his second semester",
      event: "Dropped out of Reed College after one semester",
      alternative: "stayed at Reed. Followed Robert Palladino through every calligraphy class he ever taught.",
    },
    trajectory: [
      { age: 19, moment: "junior year", state: "Hand-set every poem in his senior thesis at the Marrowstone letterpress. Slept four hours a night, ate bowls of brown rice." },
      { age: 28, moment: "1983", state: "Adobe hired him as a type designer the year PostScript shipped. Drew the bowls of an a. Didn't draw a computer." },
      { age: 40, moment: "late 90s", state: "Hoefler & Co. tried to hire him three times. He stayed at Adobe, raised two kids in Mountain View, never owned a mobile phone." },
      { age: 56, moment: "today", state: "Runs a four-person foundry in Portland. The typeface you're reading might be his. Doesn't know about the iPhone." },
    ],
    outcome: "A smaller life, fully built. The world doesn't know his name. The world reads in his letterforms anyway. He sleeps eight hours a night and his hands shake less than the other version's.",
    vibe: "quiet",
  },
  {
    divergence: {
      age: 21,
      moment: "summer of '76, Cupertino",
      event: "Co-founded Apple with Wozniak in a garage",
      alternative: "stayed at Atari. Let Woz build the Apple I alone, then refused to sell his Atari stock to invest.",
    },
    trajectory: [
      { age: 23, moment: "summer of '77", state: "Watched from the back of the West Coast Computer Faire as Woz demoed the Apple II alone. Felt his stomach flip and pretended not to." },
      { age: 28, moment: "early 80s", state: "Mid-level engineer at Atari. Married a woman he met at a Star Wars screening. A daughter, Lisa, named after no one in particular." },
      { age: 35, moment: "after the 1983 video game crash", state: "Atari collapsed. Took a contract gig at Lockheed writing missile guidance firmware. Hated every Monday." },
      { age: 56, moment: "today", state: "Retired early on a small pension. Watches PBS specials about the parallel-universe version of himself. His daughter is a senior engineer at Google." },
    ],
    outcome: "Some Sundays he can almost hear it — the company he didn't build, the dent he didn't make. His daughter doesn't know what he gave up, and would never know. Maybe that's mercy.",
    vibe: "ash",
  },
  {
    divergence: {
      age: 30,
      moment: "May 1985, the long board meeting",
      event: "Pushed out of Apple after a board fight",
      alternative: "won the fight. John Sculley resigned. He kept the company.",
    },
    trajectory: [
      { age: 32, moment: "1987", state: "Fired half the Mac team in a single day. The Newton shipped early, recognized 30% of handwriting, and broke." },
      { age: 38, moment: "1993", state: "Windows 95 ate the market while he refused to license Mac OS. Stock down 70% in five years." },
      { age: 45, moment: "2000", state: "Survived a hostile takeover by Sun by a hair. The company was a quarter of its 1985 size." },
      { age: 56, moment: "today", state: "Still CEO. Still hated, still feared, still right about everything he was right about. Apple makes specialty workstations for design studios. No iPhone exists." },
    ],
    outcome: "No exile means no NeXT means no Pixar means no Toy Story. Power without the bend is just stubbornness. He won the room and lost the arc.",
    vibe: "burn",
  },
  {
    divergence: {
      age: 17,
      moment: "the autumn after Reed",
      event: "Dropped out of Reed College after one semester",
      alternative: "stayed in India past the seven months. Never came back.",
    },
    trajectory: [
      { age: 22, moment: "1977", state: "Lived in a small monastery outside Nainital. Burned his American clothes. Took the name Sri Anand." },
      { age: 30, moment: "1985", state: "Opened a meditation hall in a converted garage in Berkeley. Wore the same robe for eleven years." },
      { age: 45, moment: "2000", state: "Founded a hospice in Marin. Walked the corridors at night, holding hands with the dying." },
      { age: 56, moment: "today", state: "Has touched, by name, fewer than 10,000 people. Has touched all of them deeply. Doesn't know what an Apple is, and doesn't need to." },
    ],
    outcome: "The small life lived all the way down. The other version is a shape he would never miss because he would never imagine it. Some lives are measured in attention, not in scale.",
    vibe: "shine",
  },
  {
    divergence: {
      age: 41,
      moment: "December '96, the NeXT acquisition meeting",
      event: "Came back to Apple via the NeXT acquisition",
      alternative: "Apple bought BeOS instead. NeXT limped on as a research lab.",
    },
    trajectory: [
      { age: 43, moment: "late '98", state: "NeXT had 47 employees and couldn't make payroll twice that year. Sold to Sun Microsystems for parts." },
      { age: 50, moment: "2005", state: "Started a small consulting firm. Took a board seat at Pixar (still his, until Disney bought it in '06)." },
      { age: 53, moment: "2008", state: "Caught the same pancreatic cancer. Caught it later. The Whipple procedure that worked in the original timeline came two years too late." },
      { age: 56, moment: "today", state: "Gone. Buried in Alta Mesa, Palo Alto. No iPhone keynote. No black turtleneck moment. A footnote." },
    ],
    outcome: "Pixar happened to him; the rest didn't. He drifted into being a man who watched other people's empires. Then he ran out of years.",
    vibe: "drift",
  },
  {
    divergence: {
      age: 21,
      moment: "early '76, just before the LLC paperwork",
      event: "Co-founded Apple with Wozniak in a garage",
      alternative: "kept Woz on equal footing forever. Refused every venture round that would dilute him.",
    },
    trajectory: [
      { age: 25, moment: "1980", state: "Apple went public smaller, slower, engineer-led. The IPO raised half as much. Woz stayed CTO until the day he chose to leave (he never did)." },
      { age: 35, moment: "1990", state: "A quieter, smaller, deeply beloved company. The Apple II line lived twelve more years than it did in our world." },
      { age: 45, moment: "2000", state: "No iPhone — but a small, perfect Mac that lasted ten years per machine. Software updated for two decades. The Genius Bar was the only place you visited." },
      { age: 56, moment: "today", state: "Both alive, both at Apple, both old. Took a leave together in 2024 to write a book about the garage." },
    ],
    outcome: "A version where the friendship held. The company is smaller, slower, less revolutionary, more loved. He sleeps better. The world has fewer of his objects in its pockets, and probably needs them less.",
    vibe: "shine",
  },
]

const steveJobsZH: ForkSpec[] = [
  {
    divergence: {
      age: 17,
      moment: "1973 年春,他的第二学期",
      event: "Dropped out of Reed College after one semester",
      alternative: "他没退学。把 Robert Palladino 每一节 calligraphy 课都修完。",
    },
    trajectory: [
      { age: 19, moment: "大三", state: "在 Marrowstone 印刷工作室,亲手排了毕业论文里每一首诗。每天睡四个小时,吃糙米饭。" },
      { age: 28, moment: "1983 年", state: "Adobe 在 PostScript 发布那年雇了他做字体设计师。他画 a 的圆弧,不画电脑。" },
      { age: 40, moment: "九十年代末", state: "Hoefler & Co. 三次想挖他过去,他没动。在山景城养了两个孩子,从没买过手机。" },
      { age: 56, moment: "现在", state: "在波特兰开着一家四个人的字体工作室。你现在读到的字体可能是他的。他不知道 iPhone 是什么。" },
    ],
    outcome: "一种小生活,完整地建起来。世界不知道他的名字。世界读着他的字。他每晚睡八个小时,手比那个版本的他抖得少。",
    vibe: "quiet",
  },
  {
    divergence: {
      age: 21,
      moment: "1976 年夏天,库比蒂诺",
      event: "Co-founded Apple with Wozniak in a garage",
      alternative: "他留在 Atari。让 Woz 一个人弄出 Apple I,拒绝卖掉 Atari 股票去投资。",
    },
    trajectory: [
      { age: 23, moment: "1977 年夏", state: "在西海岸电脑展的后排,看着 Woz 一个人 demo Apple II。胃翻了一下,装作没事。" },
      { age: 28, moment: "八十年代初", state: "Atari 中层工程师。和在《星球大战》放映会上认识的女人结了婚。女儿叫 Lisa,不是为了纪念谁。" },
      { age: 35, moment: "1983 年视频游戏崩盘之后", state: "Atari 垮了。在洛克希德接了个合同写导弹制导固件。讨厌每个星期一。" },
      { age: 56, moment: "现在", state: "提前退休,靠一笔小养老金。看 PBS 拍的关于平行宇宙里那个自己的纪录片。女儿在谷歌做高级工程师。" },
    ],
    outcome: "有些周日,他几乎能听见 —— 那个他没建的公司、那个他没留下的痕迹。女儿不知道他放弃了什么,也永远不会知道。也许这是一种慈悲。",
    vibe: "ash",
  },
  {
    divergence: {
      age: 30,
      moment: "1985 年 5 月,那场漫长的董事会",
      event: "Pushed out of Apple after a board fight",
      alternative: "他赢了。John Sculley 辞职。公司留在他手里。",
    },
    trajectory: [
      { age: 32, moment: "1987 年", state: "一天之内开掉了一半 Mac 团队。Newton 提前上市,识别 30% 的手写,然后崩了。" },
      { age: 38, moment: "1993 年", state: "Windows 95 吞掉了市场,他始终不肯授权 Mac OS。五年股价跌 70%。" },
      { age: 45, moment: "2000 年", state: "Sun 想恶意收购,差一点就成功。公司只剩 1985 年的四分之一大。" },
      { age: 56, moment: "现在", state: "还是 CEO,还被恨着、被怕着、对所有他对的事情依然对。Apple 在做设计工作室用的专业工作站。没有 iPhone 这个东西。" },
    ],
    outcome: "没被流放就没有 NeXT,没有 NeXT 就没有 Pixar,没有 Pixar 就没有玩具总动员。没有那个弯腰的瞬间,权力就只剩固执。他赢了那间会议室,输了那条弧线。",
    vibe: "burn",
  },
  {
    divergence: {
      age: 17,
      moment: "Reed 之后那个秋天",
      event: "Dropped out of Reed College after one semester",
      alternative: "他在印度待过了那七个月。再也没回来。",
    },
    trajectory: [
      { age: 22, moment: "1977 年", state: "住在奈尼塔尔郊外一座小寺院。烧掉了所有美国衣服。取名 Sri Anand。" },
      { age: 30, moment: "1985 年", state: "在伯克利一个改造过的车库里开了冥想堂。同一件袈裟穿了十一年。" },
      { age: 45, moment: "2000 年", state: "在 Marin 县办了一家临终关怀院。夜里走廊里走来走去,握着将死之人的手。" },
      { age: 56, moment: "现在", state: "亲手触碰过的人不到一万。这一万人都被深深触碰过。他不知道 Apple 是什么,也不需要知道。" },
    ],
    outcome: "一种小生活,一寸一寸地活下去。另一个版本对他是一个永远不会想念的形状,因为他根本不会想象。有些人生用注意力衡量,不用规模。",
    vibe: "shine",
  },
  {
    divergence: {
      age: 41,
      moment: "1996 年 12 月,NeXT 收购谈判桌上",
      event: "Came back to Apple via the NeXT acquisition",
      alternative: "Apple 选了 BeOS。NeXT 作为一个研究实验室苟延残喘下来。",
    },
    trajectory: [
      { age: 43, moment: "1998 年末", state: "NeXT 47 个员工,那年两次发不出工资。最后把公司零售给 Sun Microsystems。" },
      { age: 50, moment: "2005 年", state: "开了一家小咨询公司。在 Pixar 拿了董事席位(还是他的,直到 2006 年迪士尼收购为止)。" },
      { age: 53, moment: "2008 年", state: "得了一样的胰腺癌。发现晚了。原本时间线里救了他的 Whipple 手术,这次晚了两年。" },
      { age: 56, moment: "现在", state: "没了。葬在帕罗奥图 Alta Mesa。没有 iPhone 发布会。没有黑色高领的那个时刻。一个脚注。" },
    ],
    outcome: "Pixar 在他身上发生了;别的都没有。他漂成了一个看别人帝国的人。然后他没年头了。",
    vibe: "drift",
  },
  {
    divergence: {
      age: 21,
      moment: "1976 年初,LLC 文件签下之前",
      event: "Co-founded Apple with Wozniak in a garage",
      alternative: "他让 Woz 永远跟自己平起平坐。拒绝任何会稀释他俩股份的融资。",
    },
    trajectory: [
      { age: 25, moment: "1980 年", state: "Apple 上市时更小、更慢、工程师主导。IPO 募了一半的钱。Woz 一直是 CTO,直到自己想走那天(那天没来)。" },
      { age: 35, moment: "1990 年", state: "一家更安静、更小、被深深喜爱的公司。Apple II 系列比我们这个世界多活了十二年。" },
      { age: 45, moment: "2000 年", state: "没有 iPhone —— 但一台小而完美的 Mac,一台能用十年。软件更新两个十年。Genius Bar 是你唯一需要去的地方。" },
      { age: 56, moment: "现在", state: "两人都还活着,都还在 Apple,都老了。2024 年一起请了假,合写一本关于那个车库的书。" },
    ],
    outcome: "一个友谊没有破裂的版本。公司更小、更慢、不那么革命、被爱得更深。他睡得更好。世界口袋里他的东西更少了,世界大概也不那么需要那些。",
    vibe: "shine",
  },
]

// ─────────────────────────────────────────────────────────────────────
// Generic improved fallback — for non-preset seeds.
// References the user's actual nodes when possible.
// ─────────────────────────────────────────────────────────────────────

function genericFixture(input: SpawnInput, locale: string): { forks: RawFork[] } {
  const isCJK = locale.startsWith("zh") || locale.startsWith("ja") || locale.startsWith("ko")
  const subject = input.name || (isCJK ? "你" : "you")
  const subjectAge = input.age || 30

  const userNodes = input.nodes.length > 0 ? input.nodes : null
  const vibes: RawFork["vibe"][] = ["shine", "ash", "burn", "quiet", "drift", "shine"]

  const forks: RawFork[] = vibes.map((vibe, i) => {
    const node = userNodes ? userNodes[i % userNodes.length] : null
    const startAge = node?.age ?? Math.max(18, subjectAge - 15 + i * 2)
    const event = node?.event ?? (isCJK ? "一个你做过的关键选择" : "a real choice you made")
    const span = Math.max(2, subjectAge - startAge)
    const t1 = startAge + Math.round(span * 0.2)
    const t2 = startAge + Math.round(span * 0.5)
    const t3 = startAge + Math.round(span * 0.85)

    const tpl = isCJK ? cnGenericTemplates[i] : enGenericTemplates[i]
    return {
      divergence: {
        age: startAge,
        moment: node?.moment ?? tpl.moment,
        event,
        alternative: tpl.alternative(subject),
      },
      trajectory: [
        { age: t1, moment: tpl.tj1Moment, state: tpl.tj1() },
        { age: t2, moment: tpl.tj2Moment, state: tpl.tj2() },
        { age: t3, moment: tpl.tj3Moment, state: tpl.tj3() },
        { age: subjectAge, moment: tpl.tjNowMoment, state: tpl.tjNow() },
      ],
      outcome: tpl.outcome(),
      vibe,
    }
  })

  return { forks }
}

const enGenericTemplates = [
  {
    moment: "the spring after",
    alternative: (s: string) => `${s} said no. Walked back to the apartment with a different feeling in the chest.`,
    tj1Moment: "six months later", tj1: () => "Took a smaller job in the same town. The rent was a third. The hours were human.",
    tj2Moment: "year three", tj2: () => "Met someone at a Tuesday book club. They moved in slowly, with one box at a time.",
    tj3Moment: "year seven", tj3: () => "A second cat. A backyard. A small column for the local literary magazine.",
    tjNowMoment: "today", tjNow: () => "Walks to a job they understand. Sleeps eight hours. Counts the years not in milestones but in the trees on their street.",
    outcome: () => "A life sized to fit. Not what they imagined at twenty-two. Smaller, denser, full of the names of bakers and pharmacists.",
  },
  {
    moment: "by Christmas",
    alternative: (s: string) => `${s} took the offer that everyone warned against. The big one. The one that ended badly.`,
    tj1Moment: "year one", tj1: () => "Burned hot, slept little. The new city felt like inhaling cold air.",
    tj2Moment: "year three", tj2: () => "The thing imploded in a way that involved lawyers and the cancellation of a friendship.",
    tj3Moment: "year six", tj3: () => "Two years on antidepressants. A small studio. Contract work for a sympathy hire.",
    tjNowMoment: "now", tjNow: () => "Careful, quiet, smaller. Doesn't talk about that period. Reads a lot.",
    outcome: () => "The price of full effort, paid in full. They kept their integrity and lost three years to recover. The story they tell themselves is a useful story now.",
  },
  {
    moment: "the Tuesday they almost stayed home",
    alternative: (s: string) => `${s} went to the thing — the party, the trip, the call — and met someone who broke them open.`,
    tj1Moment: "six months in", tj1: () => "Found themselves doing things their old self would have rolled eyes at. Laughed in supermarket aisles.",
    tj2Moment: "year two", tj2: () => "It ended like only first big loves end: violently, slowly, with mutual friends choosing sides.",
    tj3Moment: "year five", tj3: () => "Built something good out of the wreckage. A band, a child, a small company. The ash had vitamins.",
    tjNowMoment: "today", tjNow: () => "Brighter than the original version. More scars too. Would not trade either.",
    outcome: () => "A version that burned through the careful container. Not everyone survives this fork. They did, mostly, and the version that came out the other side knows things the polite version never will.",
  },
  {
    moment: "Sunday morning, the month they were 25",
    alternative: (s: string) => `${s} stayed exactly where they were. Said no to every drift, every shimmer.`,
    tj1Moment: "after a year", tj1: () => "Promotion. Then another. Parents called more often.",
    tj2Moment: "by 32", tj2: () => "House, partner, a dog named after a writer their book club liked.",
    tj3Moment: "by 40", tj3: () => "The job stopped being interesting. They didn't notice for a long time.",
    tjNowMoment: "today", tjNow: () => "Comfortable. A specific kind of comfortable. Wonders, sometimes, on long drives, when the music gets quiet.",
    outcome: () => "Built well on ground that didn't shift. The view from there is mostly clear. Sometimes the wonder gets loud on a Tuesday in October, then quiets.",
  },
  {
    moment: "the summer everything was supposed to start",
    alternative: (s: string) => `${s} drifted instead. Quit, moved abroad, slept on couches, taught English.`,
    tj1Moment: "a few months later", tj1: () => "Lisbon. Then Bangkok. Then a small town outside Kyoto where everyone called them by a shortened name.",
    tj2Moment: "year three", tj2: () => "Stopped answering family emails. Lost touch with everyone slowly, then all at once.",
    tj3Moment: "year seven", tj3: () => "Came back briefly for a funeral. Couldn't sit through it. Left after the church part.",
    tjNowMoment: "now", tjNow: () => "On an island somewhere, in a half-renovated apartment. Reads more than they speak. Doesn't miss the leaving anymore.",
    outcome: () => "Unanchored is a kind of freedom. So is being needed. They picked one. The other version picked the other. Neither would say they regret it. Both would be lying.",
  },
  {
    moment: "the morning of the call from the recruiter",
    alternative: (s: string) => `${s} got the thing — the big role, the named one — and never looked back.`,
    tj1Moment: "a year in", tj1: () => "Options, badge, a boss who said their name in meetings full of names.",
    tj2Moment: "five years on", tj2: () => "Promotion track. A second apartment. A divorce, eventually, that nobody saw clearly.",
    tj3Moment: "by their forties", tj3: () => "Tired in a particular way. Stopped reading novels. Started a journaling app.",
    tjNowMoment: "now", tjNow: () => "Wealthy. Successful. Lonely in the very specific way ambitious people get lonely.",
    outcome: () => "Got the thing. Paid the thing's price. Wouldn't undo it, mostly. The mostly is the whole story.",
  },
]

const cnGenericTemplates = [
  {
    moment: "那年春天",
    alternative: (s: string) => `${s}说了不。回到公寓时,胸口有种不一样的感觉。`,
    tj1Moment: "半年后", tj1: () => "在同一个城市,找了一份更小的工作。房租少了三分之一,时间是人能过的。",
    tj2Moment: "第三年", tj2: () => "周二的读书俱乐部认识了一个人。慢慢搬进来,一次一个纸箱。",
    tj3Moment: "第七年", tj3: () => "第二只猫。后院。一份给本地文学杂志写的小专栏。",
    tjNowMoment: "现在", tjNow: () => "走着上下班,工作能搞懂。睡八个小时。年头不靠里程碑数,靠这条街上的树数。",
    outcome: () => "一种合身的生活。不是 22 岁那时想的样子。更小、更密、装满了面包师和药剂师的名字。",
  },
  {
    moment: "圣诞节前",
    alternative: (s: string) => `${s}接受了所有人劝阻的那个 offer。那个大的。那个结局不好的。`,
    tj1Moment: "第一年", tj1: () => "烧得很猛,睡得很少。新城市像呼入冷空气一样。",
    tj2Moment: "第三年", tj2: () => "事情塌了,塌的方式涉及律师,和一段友谊的终止。",
    tj3Moment: "第六年", tj3: () => "吃了两年抗抑郁药。一个小工作室。给一个同情他的人做合同活。",
    tjNowMoment: "现在", tjNow: () => "小心、安静、变小了。不再说起那段时间。读了很多书。",
    outcome: () => "全力以赴的代价,付得不剩。完整保住了底线,失了三年才缓过来。他现在跟自己讲的那个故事,是一个有用处的故事了。",
  },
  {
    moment: "差点没出门的那个周二",
    alternative: (s: string) => `${s}去了那个事情 —— 那个聚会、那次旅行、那通电话 —— 遇见了一个让他/她崩开的人。`,
    tj1Moment: "六个月后", tj1: () => "做了些他/她过去的自己会翻白眼的事。在超市过道里笑出来。",
    tj2Moment: "第二年", tj2: () => "结束的方式像只有第一次大爱结束的方式:激烈、缓慢、共同朋友选边。",
    tj3Moment: "第五年", tj3: () => "从废墟里建出了点好东西。一个乐队、一个孩子、一家小公司。灰烬里有维生素。",
    tjNowMoment: "现在", tjNow: () => "比原版的他/她更亮一些。也多了一些伤疤。两样都不会想换掉。",
    outcome: () => "一个烧穿了精致容器的版本。不是每个人能从这个岔路活下来。他/她活下来了,大体上。穿过去的那个版本,知道礼貌版本永远不会知道的事。",
  },
  {
    moment: "他/她 25 岁那个月的某个周日早晨",
    alternative: (s: string) => `${s}哪儿都没去。每一次漂移、每一次微光,都拒绝了。`,
    tj1Moment: "一年后", tj1: () => "升职。又一次。父母打电话变得更勤。",
    tj2Moment: "32 岁", tj2: () => "房子、伴侣、一只用读书俱乐部喜欢的作家命名的狗。",
    tj3Moment: "40 岁", tj3: () => "工作不再有意思。很久之后才注意到。",
    tjNowMoment: "现在", tjNow: () => "舒适。一种很具体的舒适。偶尔,长途开车、音乐变小的时候,会想起来。",
    outcome: () => "在不会摇的土地上,稳稳地建起。从那里看出去多半是清楚的。十月的某个周二,那个怅然会变大声,然后又安静下去。",
  },
  {
    moment: "一切本该开始的那个夏天",
    alternative: (s: string) => `${s}漂走了。辞职、出国、睡沙发、教英语。`,
    tj1Moment: "几个月后", tj1: () => "里斯本。然后曼谷。然后京都郊外一个小镇,所有人都叫他/她一个缩短了的名字。",
    tj2Moment: "第三年", tj2: () => "不再回家人的邮件。慢慢失联,然后突然全部失联。",
    tj3Moment: "第七年", tj3: () => "为一场葬礼短暂回来。坐不完那场仪式,教堂部分之后就走了。",
    tjNowMoment: "现在", tjNow: () => "在某个岛上、一间半装修的公寓里。读得比说得多。不再想念离开本身了。",
    outcome: () => "无根是一种自由。被需要也是。他/她选了一个,另一个版本选了另一个。谁都不会承认后悔。两个都在说谎。",
  },
  {
    moment: "猎头打来电话那个早上",
    alternative: (s: string) => `${s}拿到了那个 —— 那个大职位、那个有头衔的 —— 然后再也没回头。`,
    tj1Moment: "一年后", tj1: () => "股权、工牌、一个会在满是名字的会议里念到他/她名字的老板。",
    tj2Moment: "五年后", tj2: () => "升职轨道。第二套公寓。最后是一场没人看得清的离婚。",
    tj3Moment: "四十岁", tj3: () => "一种特定的疲惫。不再读小说。开了一个日记 app。",
    tjNowMoment: "现在", tjNow: () => "有钱。成功。野心勃勃的人特有的那种孤独。",
    outcome: () => "拿到了。也付了它要的那个价。大体上不会撤销。'大体上'这三个字,就是整个故事。",
  },
]

// ─────────────────────────────────────────────────────────────────────
// Preset dispatch
// ─────────────────────────────────────────────────────────────────────

function isSteveJobs(name: string): boolean {
  const n = name.trim().toLowerCase()
  return n === "steve jobs" || n === "史蒂夫·乔布斯" || n === "賈伯斯" || n === "史蒂夫·賈伯斯" || n === "スティーブ・ジョブズ" || n === "스티브 잡스"
}

export function buildSpawnFixture(
  input: SpawnInput,
  locale: string,
  chain: Array<{ vibe: string; alternative: string; outcome: string; divergence: { age: number; moment?: string; event: string } }> = []
): { forks: RawFork[] } {
  const isCJK = locale.startsWith("zh") || locale.startsWith("ja") || locale.startsWith("ko")

  // Re-fork: at depth > 0, return weirder, deeper-into-counterfactual forks.
  // We rotate the templates so each layer feels distinct, and reference the chain.
  if (chain.length > 0) {
    return reForkFixture(input, locale, chain)
  }

  // Hero fixture: Steve Jobs preset → hand-written
  if (isSteveJobs(input.name)) {
    const specs = isCJK ? steveJobsZH : steveJobsEN
    return { forks: specs.map((s) => ({ ...s })) }
  }

  // Fallback: generic improved templates referencing user nodes
  return genericFixture(input, locale)
}

/**
 * Re-fork fixture — when the user descends into a fork and asks "what now?"
 * The model should know we're branching from THAT version's outcome, not the original.
 *
 * For mock, we rotate the template index so it doesn't repeat literally, and we
 * use the chain's last layer as the divergence anchor.
 */
function reForkFixture(
  input: SpawnInput,
  locale: string,
  chain: Array<{ vibe: string; alternative: string; outcome: string; divergence: { age: number; moment?: string; event: string } }>
): { forks: RawFork[] } {
  const isCJK = locale.startsWith("zh") || locale.startsWith("ja") || locale.startsWith("ko")
  const depth = chain.length
  const last = chain[chain.length - 1]
  const subject = input.name || (isCJK ? "你" : "you")
  const subjectAge = input.age || 30

  // Start ages for the deeper forks are after the last divergence
  const baseAge = last.divergence.age + 3
  const span = Math.max(2, subjectAge - baseAge)

  const vibes: RawFork["vibe"][] = ["shine", "ash", "burn", "quiet", "drift", "shine"]
  // Rotate template start so each layer's forks feel different
  const tplStart = depth * 2
  const templates = isCJK ? cnGenericTemplates : enGenericTemplates

  const forks: RawFork[] = vibes.map((vibe, i) => {
    const tpl = templates[(tplStart + i) % templates.length]
    const startAge = baseAge + i * 2
    const t1 = startAge + Math.round(span * 0.25)
    const t2 = startAge + Math.round(span * 0.5)
    const t3 = startAge + Math.round(span * 0.85)

    // Use the chain context as the "instead of" — the user already chose that branch
    const deeperEvent = isCJK
      ? `沿着上一层(${last.divergence.moment ?? `~${last.divergence.age}`})——"${last.alternative.slice(0, 50)}..."`
      : `descending from the prior layer (${last.divergence.moment ?? `~age ${last.divergence.age}`}): "${last.alternative.slice(0, 60)}..."`

    return {
      divergence: {
        age: startAge,
        moment: tpl.moment,
        event: deeperEvent,
        alternative: tpl.alternative(subject),
      },
      trajectory: [
        { age: t1, moment: tpl.tj1Moment, state: tpl.tj1() },
        { age: t2, moment: tpl.tj2Moment, state: tpl.tj2() },
        { age: t3, moment: tpl.tj3Moment, state: tpl.tj3() },
        { age: subjectAge, moment: tpl.tjNowMoment, state: tpl.tjNow() },
      ],
      outcome: tpl.outcome(),
      vibe,
    }
  })

  return { forks }
}

// ─────────────────────────────────────────────────────────────────────
// Importer fixture — text extraction stub
// ─────────────────────────────────────────────────────────────────────

export const extractFixture = (locale: string) => {
  const isCJK = locale.startsWith("zh") || locale.startsWith("ja") || locale.startsWith("ko")
  if (isCJK) {
    return {
      name: "未命名",
      age: 32,
      bio: "(演示数据 · 这是 mock fixture。换成真 API 密钥后,这里会显示模型实际从你粘贴的文本里解析出来的画像。)",
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
    bio: "(demo data · this is a mock fixture. With a real API key, this is where the model's actual extraction of your pasted text would appear.)",
    nodes: [
      { age: 18, event: "Picked a college far from home" },
      { age: 22, event: "Turned down the first offer, took the second" },
      { age: 28, event: "Moved to a different city" },
    ],
  }
}
