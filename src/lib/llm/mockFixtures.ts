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
      moment: "the spring of '73, his second semester at Reed",
      event: "Dropped out of Reed College after one semester",
      alternative: "He stayed. Followed Robert Palladino through every calligraphy class the man ever taught at Reed, and let typography become the shape of his life.",
    },
    trajectory: [
      {
        age: 19, moment: "the autumn of 1975",
        brief: "Hand-set his senior thesis at the Marrowstone letterpress under Palladino's red pencil.",
        state: "In the basement of Eliot Hall in Portland he hand-set every poem of his senior thesis on a 1923 Vandercook proofing press, watching Palladino's loose-jointed hand correct his serifs in red pencil after class. He slept four hours a night through that year, ate brown-rice bowls at the Reed Commons, and started carrying a small black Moleskine in his back pocket — the same notebook, replaced thirty-eight times, that still sits in his hip pocket now. The smell of ink and white pine became, for him, the smell of working honestly.",
      },
      {
        age: 24, moment: "the rainy spring of 1980, in Darmstadt",
        brief: "A Fulbright took him to Hermann Zapf's studio for eighteen months.",
        state: "He went to Darmstadt on a Fulbright and apprenticed under Hermann Zapf, who was sixty-two then and openly indulgent of an American with rough Latin. He drew the bowls of an a on tracing paper, never on a computer, even though Zapf had already begun digitizing Optima down the hall. He lived in a one-room apartment above a Turkish bakery on Hochstrasse, ate the same Käsekuchen every Saturday, and missed America in a way that had no name yet.",
      },
      {
        age: 28, moment: "March 1983, the spring PostScript shipped",
        brief: "Adobe hired him as a junior type designer the month PostScript was born.",
        state: "Sumner Stone was assembling a tiny type group on the third floor of the Adobe building in Mountain View, and they hired him in March, on the strength of three faces he'd drawn at night in Darmstadt. He drew his first commercial face — a slim slab he called Mercer, after a street in San Francisco — through that summer, with the office windows open to the sound of the 101. He drove a 1976 Volvo with a calligraphy nib taped to the dashboard. He had not yet met the woman he would marry.",
      },
      {
        age: 33, moment: "the December he turned thirty-three",
        brief: "Married Carol, a violist, and bought a Craftsman on Pine Street in Mountain View.",
        state: "He married Carol Wen, second violist with the San Jose Symphony, in a small ceremony at the Stanford chapel just before Christmas. They bought a 1923 Craftsman bungalow on Pine Street in Mountain View for a hundred and twelve thousand dollars — the same year Sculley took Apple to a billion in revenue, a number he barely noticed. Two children came in three years, Daniel and Emi. The notebook in his back pocket filled up with their first sentences.",
      },
      {
        age: 42, moment: "the long August of 1997",
        brief: "Hoefler & Co. tried to hire him three times that summer. He stayed at Adobe.",
        state: "Jonathan Hoefler called him three times across June, July, and August 1997 from a brownstone in New York, asking him to come east and run a foundry of his own. He stayed at Adobe the third time because Daniel was twelve and on a baseball team in Mountain View that took itself seriously. He drew Garamond Premier in the evenings, after the kids were down, the kitchen light still on, the dishwasher running its long final cycle. He never owned a mobile phone.",
      },
      {
        age: 48, moment: "the wet winter of 2004",
        brief: "Lost his father; took six months off and drove the coast slowly with Carol.",
        state: "His father, Paul Jobs, died of cancer in March 2004 — a death he had half-prepared for and was wholly undone by. He took six months of unpaid leave, drove the Volvo down Highway 1 in the rain with Carol, ate fish at every roadside place from Manchester to Big Sur, and did not draw a single letter for the full six months. On the way home he began a face he eventually called Reed Pro, in honor of nothing he could name.",
      },
      {
        age: 56, moment: "this past November",
        brief: "Runs a four-person foundry in Portland — the typeface you're reading might be his.",
        state: "He runs a four-person foundry called Wishbone Type on SE Division Street in Portland now, in a converted bungalow with a wood floor that creaks the same way every November. The typeface you are reading on this screen, with the half-thin terminals and the warm a, may very well be one of his — Reed Pro, drawn over six years and released in 2019. He has heard of iPhones in the same way he has heard of Mars rovers; he carries a Nokia 3310 and reads paper books.",
      },
    ],
    outcome: "This morning he ate steel-cut oats with stewed apples in the kitchen on Pine Street while Carol practiced the Brahms F-minor sonata in the living room and the November light came through the kitchen window the way it always does in Portland — milky, faintly green, indifferent. Daniel called from Oakland just before lunch (he teaches eighth-grade math at a charter school there) and they talked for sixteen minutes about nothing in particular, mostly about a sink that wouldn't drain. Last Tuesday he sat in the back of Powell's for forty minutes rereading the same John Berger essay he has been reading for thirty years. He sleeps eight hours a night and his hands shake less than the other version's. The world does not know his name in any specific sense. The world reads in his letterforms every day, on this screen and a hundred million others, and on most evenings that feels like enough.",
    vibe: "quiet",
  },
  {
    divergence: {
      age: 21,
      moment: "the summer of '76, the Cupertino garage",
      event: "Co-founded Apple with Wozniak in a garage",
      alternative: "He stayed at Atari. Let Woz build the Apple I alone, then refused to sell his Atari stock to invest in the partnership.",
    },
    trajectory: [
      {
        age: 23, moment: "the West Coast Computer Faire, April 1977",
        brief: "Watched Woz demo the Apple II from the back row, pretended not to feel it.",
        state: "He stood at the back of the Brooks Hall floor in San Francisco the weekend of the Computer Faire, wearing the same blue Atari shirt he'd worn to work all that week, watching Woz demonstrate the Apple II to a small crowd by the side wall. His stomach flipped twice — once when Woz hit the BASIC prompt, once when a man from National Semiconductor said quietly, this is going to be something. He bought a hot dog on the walk back to the BART and ate it slowly so he would not have to think about anything in particular.",
      },
      {
        age: 27, moment: "an August screening of Star Wars in San Jose, 1981",
        brief: "Married Janet, a high-school physics teacher, after a Star Wars screening.",
        state: "He met Janet at the Century Dome theater in San Jose at an anniversary screening of Star Wars and married her seven months later in her parents' backyard in Sunnyvale. She taught high-school physics at Wilcox and made him laugh in a way nobody at Atari ever had. A daughter, Lisa Marie, came in the spring of '82, named after Janet's grandmother and no one else in the universe.",
      },
      {
        age: 32, moment: "the Monday after Labor Day, 1987",
        brief: "Mid-level engineer at Atari Coin-Op, married, daughter starting kindergarten.",
        state: "On the Monday after Labor Day 1987 he drove the gray Civic he'd bought from a guy named Marco to Atari Coin-Op in Milpitas and worked the morning on the sound chip for a driving game nobody would remember. He ate a turkey sandwich from the same vending row by the loading dock. Lisa was starting kindergarten that week at Westmoor; Janet had taken Polaroids of her in front of the door. He thought, in the specific way he thought when he was tired and thirty-two, that this was a perfectly fine life.",
      },
      {
        age: 35, moment: "after the great video-game crash, spring 1990",
        brief: "Atari Coin-Op folded; he took a defense contract at Lockheed-Sunnyvale.",
        state: "Atari Coin-Op finally folded in March 1990, three years late, and he took a contract job through a body shop called Volt at Lockheed-Sunnyvale, writing guidance firmware for the AGM-65 Maverick. The carpet-glue smell of the engineering wing got into his shirts. He hated every Monday in a particular way that involved the KFOG morning show and the parking lot's sodium lights. The 1976 Volvo had been replaced by a 1989 Camry; he ate the same turkey sandwich.",
      },
      {
        age: 42, moment: "the divorce, the spring of 1997",
        brief: "Janet left him for a Stanford geophysicist. He kept Lisa on weekends.",
        state: "Janet left him in March 1997 for a Stanford geophysicist named David, a man who hiked Mission Peak twice a week and made Janet laugh more than he had managed in a decade. He moved into a one-bedroom in Sunnyvale with bad afternoon light and kept Lisa on weekends, driving her up to Big Basin most Sundays to walk the same loop trail. He did not date anyone for four years. He kept a small Sony radio on the kitchen counter and listened to KFOG even on Saturdays.",
      },
      {
        age: 52, moment: "the layoff, the fall of 2007",
        brief: "Laid off from Lockheed; took small pension. Lisa was at Stanford by then.",
        state: "Lockheed laid him off in October 2007 along with thirty other contractors — a Tuesday, with two weeks' notice and a small severance. He took the early-retirement bridge and the pension and bought a slightly larger apartment in the same complex in Sunnyvale. Lisa was at Stanford on a partial scholarship, studying electrical engineering, and called him on Sunday evenings. He started walking three miles a day along Mary Avenue and reading library books about the Civil War.",
      },
      {
        age: 56, moment: "this past November",
        brief: "Lives alone in Sunnyvale on a small pension; daughter is senior staff at Google.",
        state: "He lives alone now in a 720-square-foot apartment in the same complex on Mary Avenue he moved into after the divorce, twenty years ago, and the carpet still smells faintly of the previous tenant's cat. Lisa is senior staff at Google over in Mountain View, with two children of her own; she comes by every other Sunday for dinner, often takeout from the Cantonese place on El Camino. The PBS documentary about the man who built Apple in some other version of the world came out last spring; he watched it twice.",
      },
    ],
    outcome: "He ate scrambled eggs and a slice of pumpernickel toast this morning in the kitchen of the small Sunnyvale apartment, with the Sony radio playing the same KFOG morning show he has somehow not turned off in forty years. The window looks onto a parking lot and a row of date palms that need trimming. Lisa came by last Sunday with the boys and they ordered the usual from Wang's on El Camino — egg rolls and house-special noodles — and the boys ate at the kitchen counter while Lisa stood at the sink. He has not spoken to Janet in eight years and is not certain why. Some Sundays, walking out by the Lockheed buildings he no longer enters, he can almost hear it — the company he did not build, the dent he did not make. Lisa does not know what he gave up, and probably never will. He thinks of this, on the long way home, as a kind of mercy.",
    vibe: "ash",
  },
  {
    divergence: {
      age: 30,
      moment: "the long board meeting of May 1985",
      event: "Pushed out of Apple after a board fight",
      alternative: "He won the fight. John Sculley resigned the next morning, and he kept the company.",
    },
    trajectory: [
      {
        age: 32, moment: "a Tuesday in March 1987",
        brief: "Fired half the Mac team in a single morning at Bandley 3.",
        state: "He fired forty-one engineers across the Mac team in a single morning at Bandley 3, beginning at seven and finishing by noon. He did it himself, one office at a time, in the same gray turtleneck he had been wearing since Tuesday. By Thursday, six of the best had gone to Sun and three to a place in Redwood Shores that did not have a name yet. The Newton shipped early under his lash, recognized thirty percent of handwriting on a good day, and was returned by Christmas in such volume that the Cupertino mail room ran out of forms.",
      },
      {
        age: 38, moment: "the autumn of 1993, Windows 95 in beta",
        brief: "Windows 95 ate the market while he refused, line by line, to license Mac OS.",
        state: "Windows 95 was in beta and looking better than it had any right to, and IBM had quietly stopped returning his calls. He refused, line by line, to license Mac OS to any clone maker, citing dilution; the stock dropped seventy percent across the back half of that year. He drove a black 1989 Mercedes 500SL without plates and the highway patrol stopped him three times in eighteen months. Once, in October, he made an engineer cry in the cafeteria over a font size, and afterward he could not remember the engineer's name.",
      },
      {
        age: 45, moment: "the hostile bid of summer 2000",
        brief: "Survived a hostile takeover by Sun Microsystems by a hair, and a board vote.",
        state: "Scott McNealy at Sun made a hostile run for Apple in June 2000, and a 4-3 board vote in Cupertino held it off — by half a million shares, by one phone call to Larry Ellison at three in the morning. The company was a quarter of its 1985 size by then, fifteen hundred people in three buildings. He drank a glass of wine alone in his office the night the vote came in, looked at the lights of the 280, and did not call anybody.",
      },
      {
        age: 50, moment: "the divorce, the spring of 2005",
        brief: "Laurene left, took the children, kept the Palo Alto house.",
        state: "Laurene left him in May 2005, took the children to a house on Waverley in Palo Alto, and asked, through her lawyer, that he not contact Eve directly. He kept the Woodside house, the one with the long drive, and lived in three rooms of it. Sundays he ate alone at Madera in Menlo Park, table by the window, the same Caesar salad and the same flatbread. He did not date anyone for the rest of the decade.",
      },
      {
        age: 53, moment: "the diagnosis, late 2008",
        brief: "Caught the same cancer. Caught it later. The Whipple was no longer an option.",
        state: "He found the lump in the autumn of 2008, eighteen months after he should have, because he had been firing his oncologist's referrals and trying a juice protocol he had read about in Marin. By the time UCSF confirmed it, the pancreatic neuroendocrine tumor had broken through. The Whipple procedure that had given the other version of him eight years was no longer surgical. He went on insulin and continued to come to work.",
      },
      {
        age: 56, moment: "this past Monday",
        brief: "Still CEO of a smaller, harder, lonelier Apple. Still right about everything.",
        state: "He is still CEO of a smaller, harder Apple, with twelve hundred employees in two buildings on Bandley, and a workstation line that costs sixteen thousand dollars and ships eight hundred units a year to design studios. He came in at six this past Monday, made a young engineer cry over the kerning on a help dialog, and was correct about it. The black turtleneck has been replaced by a charcoal one because his cardiologist asked. The company has not had a new product line in nine years.",
      },
    ],
    outcome: "He woke at five in the Woodside house this morning, ate half a grapefruit standing at the kitchen island, and was at the desk in Bandley 3 by six-twenty in the same charcoal cashmere turtleneck he has been wearing all month. The fog had not yet burned off the I-280. Laurene has not spoken to him in eleven years; Eve and Reed visit twice a year and the visits are formal. No exile means no NeXT means no Pixar means no Toy Story; no Toy Story means no animation renaissance and no Mark and Andrew Stanton's quiet kingdom in Emeryville. There is no iPhone in any room in any city in the world. The young engineers at Apple are afraid of him and a number of them, in private, hate him; they are also right to. Power without the bend, he understands at three in the morning sometimes, is just stubbornness wearing a turtleneck. He won the room and he lost the arc.",
    vibe: "burn",
  },
  {
    divergence: {
      age: 17,
      moment: "the autumn of 1973, after the seven months in India",
      event: "Dropped out of Reed College after one semester",
      alternative: "He stayed in India past the seven months. Never came back.",
    },
    trajectory: [
      {
        age: 19, moment: "the long monsoon of 1974, in Nainital",
        brief: "Took vows at a small monastery outside Nainital. Took the name Sri Anand.",
        state: "He stayed at the ashram of Neem Karoli Baba's successor outside Nainital through the long monsoon of 1974, burned his American clothes in the courtyard one Tuesday in July, and took the name Sri Anand from the abbot's wife. He slept on a coir mat in a long shared room with seven men, woke at three-forty, and learned Hindi from a young monk named Ramesh who had been a railway clerk in Lucknow. He had not yet written to his mother.",
      },
      {
        age: 25, moment: "the dry spring of 1980",
        brief: "Translated Ramana Maharshi into halting English; circulated by mail.",
        state: "He translated the Forty Verses on Reality of Ramana Maharshi into halting English on the porch of the ashram across three years, on a small Olivetti someone had carried up from Delhi. The translations were typed in three copies and circulated by mail to a handful of seekers in California and Vermont, including a woman in Cambridge who would, decades later, write his obituary. He drank chai twice a day, walked the same kilometer of road, and stopped dreaming of America.",
      },
      {
        age: 30, moment: "the wet winter of 1985, Berkeley",
        brief: "Opened a meditation hall in a converted garage on Sacramento Street, Berkeley.",
        state: "In the wet winter of 1985 he opened a meditation hall in a converted Edwardian garage on Sacramento Street in Berkeley, painting the walls a chalky white with a Vermont woman named Anne who had read the Olivetti translations. He wore the same maroon robe for the next eleven years, even when it began to thin at the shoulders, and sat with thirty-five people most Wednesday evenings on cushions Anne had sewn from old wool blankets. He did not own a phone.",
      },
      {
        age: 39, moment: "the long August of 1994",
        brief: "Sat with a dying man in a hospice in Marin, and understood his life had narrowed.",
        state: "In the long August of 1994 he sat with a fifty-eight-year-old hospice patient named Walter, a recently retired car salesman from Petaluma who had asked for him, in a small room in San Rafael with cream-colored walls and a window onto a single lemon tree. Walter died at three-twelve on a Sunday afternoon while he held Walter's left hand. He understood, walking back to the BART that evening, that his life had narrowed in a way that was indistinguishable from having broadened. He never told this to anybody.",
      },
      {
        age: 46, moment: "the spring of 2001",
        brief: "Founded a hospice in Marin called Long Light. Eight beds; never more.",
        state: "He founded a small inpatient hospice called Long Light in a converted farmhouse outside Point Reyes in the spring of 2001, with eight beds and the conviction that there would never be more. Anne ran the kitchen and the books; he sat with the dying and read aloud to those who wanted it, mostly Rilke and a little Berry. The state of California gave him a license. The state of California audited him every two years thereafter, and they ate the auditors lunch and showed them the citrus grove.",
      },
      {
        age: 52, moment: "the quiet July of 2007",
        brief: "Anne died of a stroke in the kitchen at Long Light. He kept the hospice open.",
        state: "Anne died of a stroke in the Long Light kitchen one quiet July afternoon in 2007 while making lemonade for two of the beds, and he found her on the linoleum at four-ten, the lemons still on the cutting board. He kept the hospice open through the funeral and the audit, and through the six months after, when he could not eat in the kitchen. He moved his cushion into the citrus grove that autumn and sat there, evenings, until December.",
      },
      {
        age: 56, moment: "this past Thursday",
        brief: "Still at Long Light. Has held the hand of just under three thousand people.",
        state: "He still lives at Long Light, in a single small room behind the kitchen, and has by his rough count held the hand of just under three thousand people at the moment of their death. The hospice has nine beds now — one more than the original vow, and the breaking of that vow does not trouble him in the way it once would have. He does not know what an Apple is in any specific sense. He has heard of the towers, and the wars, and the small bright rectangles people carry. He does not need to know more.",
      },
    ],
    outcome: "He woke at three-forty this morning in the small room behind the Long Light kitchen, drank a glass of warm water with lemon, sat zazen in the citrus grove for forty minutes while the fog came in off Tomales Bay, and at six made congee for the two beds that could still eat. Bed Three, a former dental hygienist from Stockton named Marisol, asked him to read aloud and he read Rilke in English for twelve minutes. The morning light through the kitchen window was the same milk-and-green light that comes off the Pacific in any November. The other version of his life — the one with the towers and the rectangles and the keynote stages — is a shape he would not miss if shown, because he would not be able to imagine it. Some lives are measured in attention, and not in scale. He thinks of this not in words but in the steady weight of Marisol's hand in his while she fell asleep again.",
    vibe: "shine",
  },
  {
    divergence: {
      age: 41,
      moment: "December 1996, the NeXT acquisition meeting that didn't happen",
      event: "Came back to Apple via the NeXT acquisition",
      alternative: "Apple chose BeOS instead. NeXT limped on as a research lab in Redwood City.",
    },
    trajectory: [
      {
        age: 43, moment: "the autumn of 1998",
        brief: "NeXT had 47 employees and missed payroll twice that year.",
        state: "NeXT had forty-seven employees in the Redwood City office on Twin Dolphin Drive in the autumn of 1998, and missed payroll twice that year — once in March, once on a Friday in October when the SVB line of credit got pulled. He let a third of the staff go in November and sold the office furniture to a startup downstairs. He drove a Mercedes 500SL with a slow oil leak and a copy of Steinbeck's East of Eden on the passenger seat.",
      },
      {
        age: 47, moment: "the spring of 2002",
        brief: "Sold what was left of NeXT to Sun for thirty-eight million. Started a small fund.",
        state: "He sold what remained of NeXT to Sun Microsystems for thirty-eight million dollars in the spring of 2002, took five of it, and opened a small consulting and seed firm above a sushi place on University Avenue in Palo Alto. He hired one analyst — a woman named Patricia who had been his assistant at NeXT since 1991 — and they ate lunch at the same Cambodian place on Lytton every Wednesday for three years. The fund made a small bet on a search company called Google in mid-2002, which is the only thing about that decade he later regretted not telling anybody about.",
      },
      {
        age: 50, moment: "the long summer of 2005",
        brief: "Took a board seat at Pixar. Lost it the next year when Disney bought Pixar.",
        state: "He took a board seat at Pixar in the summer of 2005, mostly to be near Lasseter and the small good kingdom they had built in Emeryville. He lost the seat in early 2006 when Disney bought Pixar for seven and a half billion dollars and reshuffled the board down to four insiders. He flew to Burbank twice in February, ate at Musso & Frank with Iger and Lasseter, and afterward took a long walk on Hollywood Boulevard alone. Patricia thought he came back changed.",
      },
      {
        age: 53, moment: "the autumn of 2008, two years too late",
        brief: "Caught the same pancreatic cancer two years later than the other version did.",
        state: "He felt the same vague abdominal wrongness in the spring of 2008 and ignored it the way he had ignored most things about his body since the mid-eighties, and by the time UCSF imaged it in October the islet-cell tumor had migrated to the liver. The Whipple procedure that worked, in some other timeline, in 2004 was no longer surgical. He started gemcitabine in January, walked the long hill behind the Woodside house most afternoons, and read East of Eden again from the beginning.",
      },
      {
        age: 54, moment: "the quiet of late 2009",
        brief: "Wrote a long letter to Lisa he kept in a drawer; closed the fund.",
        state: "He wrote a long letter to Lisa, his eldest, across November and December 2009 — twenty-two pages on Crane stock, in the kitchen, in the long afternoons of the chemo weeks — and then put it in a drawer of the desk in Woodside without sending it. He closed the fund in January 2010 and sent Patricia a fifty-thousand-dollar gift and a Murakami first edition. He stopped going to the office in February. The Mercedes sat in the drive with the slow leak still slowly leaking.",
      },
      {
        age: 55, moment: "the spring of 2011",
        brief: "Died in the Woodside house on a Wednesday afternoon in early May.",
        state: "He died on a Wednesday afternoon in early May 2011, in the bedroom of the Woodside house, with Laurene and Reed and Erin and Eve in the room and Lisa on a flight back from Chicago that landed an hour too late. The room had a vase of garden roses on the bureau and an early-light, late-spring quality. He had been listening to Glenn Gould playing the Goldberg Variations.",
      },
      {
        age: 56, moment: "this past spring",
        brief: "Buried at Alta Mesa, Palo Alto. The headstone is small and unadorned.",
        state: "He is buried in section H at Alta Mesa Memorial Park on Arastradero Road in Palo Alto, under a small flat granite stone with his name and the dates and no epitaph. Laurene visits twice a year, usually with a bunch of garden roses from the Waverley house; Lisa flies in from Chicago each May. The letter from late 2009 was found in the desk drawer by Eve in 2014 and never opened, on Lisa's instruction. The iPhone never happened. The black turtleneck never happened. The keynote stages, the small bright rectangles in the pockets of seven billion people — none of those.",
      },
    ],
    outcome: "There is no morning to describe — he is, in this version, gone for almost a year now, buried in section H of Alta Mesa under a flat stone the color of pine bark. The Woodside house was sold by Laurene the summer after, to a hedge-fund family from Greenwich, who repainted everything off-white. Patricia, his analyst, runs a small early-stage fund of her own now from an office above the same sushi place on University, and on Wednesdays she still goes to the Cambodian place on Lytton. Pixar happened to him; the rest did not. He drifted, in those last ten years, into being a man who watched other people's empires from a small office above a fish counter. Then he ran out of years. The world without the seven billion small rectangles in its pockets looks almost the same as the world with them, and almost no one ever notices.",
    vibe: "drift",
  },
  {
    divergence: {
      age: 21,
      moment: "early 1976, the week before the LLC paperwork",
      event: "Co-founded Apple with Wozniak in a garage",
      alternative: "He kept Woz on equal footing forever — refused, on principle, every venture round that would have diluted them.",
    },
    trajectory: [
      {
        age: 25, moment: "the IPO of December 1980",
        brief: "Apple went public smaller, slower, engineer-led. The IPO raised half as much.",
        state: "Apple went public in December 1980 at a valuation half what the other version of the company reached — sixty million instead of a hundred and seventeen — because they had refused two A rounds and three B rounds over four years on the principle that the engineers should own the work. Woz stayed CTO with thirty-three percent. He kept twenty-eight. They cried, together, in the parking lot on Bandley after the bell, and ate at the same Marie Callender's they had been eating at since 1977.",
      },
      {
        age: 30, moment: "the autumn of 1985",
        brief: "No exile, no Sculley war. The Macintosh shipped a year later but didn't break.",
        state: "There was no exile in 1985 because there was no Sculley — they had hired a quieter operator named Markkula's friend Mike Murray, who ran the company as a number-two while the two founders led product. The Macintosh shipped fourteen months later than the real version did, more carefully, with twice the memory and a price point of two thousand four hundred dollars, and did not break under its own weight. They sold half a million units in the first eighteen months and were not in a hurry.",
      },
      {
        age: 35, moment: "the long spring of 1990",
        brief: "A quieter, smaller, deeply beloved company. Apple II line lived twelve more years.",
        state: "By 1990 Apple was a quieter, smaller, deeply beloved company of nine hundred people in four buildings on Bandley, with an Apple II line that had been refined into a beige museum piece for schools and would keep selling, somehow, until 2002. They opened the first Apple store on University Avenue in Palo Alto in 1989, with the long wood tables and the friendly geniuses behind them. Woz drove a different used car every six months and built his own laser tag system in the basement of Bandley 3.",
      },
      {
        age: 41, moment: "the wet winter of 1996",
        brief: "Refused a Microsoft cross-license that would have made them rich.",
        state: "Bill Gates flew down in January 1996 and offered a five-year cross-licensing deal that would have made them both rich, and they refused it at a meeting in Murray's office on a wet Wednesday afternoon, with Woz drawing schematics on the whiteboard and him pacing. They walked Gates to his car together and shook his hand and went back inside and ate cold lasagna. The stock did not move that quarter or the next. Woz said, on the way out, that he was glad they had done it.",
      },
      {
        age: 47, moment: "the long summer of 2002",
        brief: "Shipped the original Mac mini at $499. Sold eleven million in three years.",
        state: "They shipped the original Mac mini in June 2002 at four hundred and ninety-nine dollars, in a small extruded-aluminum case the size of a hardback book, and sold eleven million units in the first three years to schools and households who did not know they had wanted one. The iPod did not happen in this version because Jon Rubinstein had no need to invent it. Music remained a thing one bought on CDs from Tower Records on University, which did not, in this version, close.",
      },
      {
        age: 52, moment: "the wet spring of 2007",
        brief: "The mobile phone team built two prototypes and shelved both.",
        state: "A small mobile team in Bandley 5 built two phone prototypes between 2005 and 2007 — a slab and a hinge — and shelved both after the second design review with Woz, who could not bring himself to release a device that locked the user out of their own machine. They wrote a long internal memo that ended with the line nothing of ours should be a thing you cannot fix in your own kitchen. They shipped, instead, the iBook G5 at thirteen hundred dollars, with a hinge so good it lasted ten years.",
      },
      {
        age: 56, moment: "the wet October just past",
        brief: "Both alive, both at Apple. Took a sabbatical together to write a book about the garage.",
        state: "Both of them are alive and both still at Apple in late October 2026, the only two original employees over fifty-five still in the building, and last spring they took a five-month sabbatical together to write a book — a memoir of the garage, mostly Woz's voice with his interjections — published by Norton in September. The Mac mini is now twelve generations old and the schools that bought the first one in 2002 still use them. There is no iPhone. There is a small device called the Wishbone, which Apple has never advertised, that costs three hundred dollars and tells time.",
      },
    ],
    outcome: "He drove the same 2004 Acura down the same stretch of Stevens Creek Boulevard this morning at six-twenty, listened to Woz on the speakerphone for nine minutes about a routing bug in a Bandley 3 build, and walked into the building at six-fifty in the same gray Patagonia fleece he has worn every day this year. The October sky over Cupertino was that pale-pearl color it gets after a wet night. Laurene was already at the foundation; Reed flew home from Princeton last weekend. The world has fewer of his objects in its pockets and probably needs them less. Apple in this version is smaller and slower and less revolutionary and far more loved, with one product line a decade and a hundred and forty-six retail stores instead of five hundred and eleven. He sleeps better than the other version of him slept. The friendship held. Almost everything else that follows from that follows from that.",
    vibe: "shine",
  },
]

const steveJobsZH: ForkSpec[] = [
  {
    divergence: {
      age: 17,
      moment: "1973 年春,他在 Reed 学院的第二学期",
      event: "Dropped out of Reed College after one semester",
      alternative: "他没退学。把 Robert Palladino 每一节 calligraphy 课都修完,让排字术成了他这辈子的形状。",
    },
    trajectory: [
      {
        age: 19, moment: "1975 年秋",
        brief: "在 Marrowstone 工坊亲手排印毕业论文。",
        state: "波特兰 Eliot Hall 的地下室里,他在一台 1923 年的 Vandercook 校样机上亲手排好毕业论文里的每一首诗,看着 Palladino 课后用红铅笔修他的衬线。那一年他每晚睡四小时,在 Reed 食堂吃糙米加豆腐,后兜里开始揣一本小黑 Moleskine —— 同样的本子,三十八年里换了三十八次,现在还在他后兜里。墨水和白松木屑的气味,从此对他就是诚实工作的气味。",
      },
      {
        age: 24, moment: "1980 年湿冷的春天,德国达姆施塔特",
        brief: "拿了 Fulbright 在 Hermann Zapf 工作室学了十八个月。",
        state: "他靠一份 Fulbright 奖学金去了达姆施塔特,跟 Hermann Zapf 学了一年半。Zapf 那年六十二,对一个拉丁字底子粗糙的美国年轻人意外宽容。他在描图纸上画 a 的肚子,从不碰电脑 —— 哪怕 Zapf 自己已经开始把 Optima 数字化。他住在 Hochstrasse 一家土耳其面包店楼上的一居室,每周六吃同样的 Käsekuchen 起司蛋糕,以一种当时还没名字的方式想念美国。",
      },
      {
        age: 28, moment: "1983 年 3 月,PostScript 发布那个春天",
        brief: "Adobe 在 PostScript 发布那个月雇他做了初级字体设计师。",
        state: "Sumner Stone 那时正在 Adobe 山景城办公楼三楼组一个小小的字体团队,凭他在达姆施塔特夜里画的三套字稿,把他三月份招了进去。整个夏天,他画完了第一款商业字体 —— 一款叫 Mercer 的窄宽板字,以旧金山一条街命名,办公室窗户开着,外面是 101 高速的声音。他开一辆 1976 年的 Volvo,仪表盘上用胶带粘着一支羽毛笔尖。他还没遇到那个后来娶的女人。",
      },
      {
        age: 33, moment: "三十三岁那年的十二月",
        brief: "娶了中提琴手 Carol,在山景城买了栋 Craftsman 老房。",
        state: "他在临近圣诞的一个安静仪式上,在斯坦福小教堂娶了圣何塞交响乐团的中提琴手 Carol Wen。两人花十一万二买下山景城 Pine 街一栋 1923 年的 Craftsman 小屋 —— 就在 Sculley 把 Apple 推过十亿美元营收的那一年,他几乎没注意。三年里来了两个孩子,Daniel 和 Emi。后兜里那本本子,逐渐写满了他们第一次说的句子。",
      },
      {
        age: 42, moment: "1997 年漫长的八月",
        brief: "Hoefler & Co. 那个夏天三次想挖他,他没动。",
        state: "Jonathan Hoefler 从纽约一栋褐石公寓里,在 1997 年六月、七月、八月各打过一次电话,想让他东渡去管一家自己的字铸厂。第三次他还是没去,因为 Daniel 那年十二,在山景城打一支严肃对待自己的少年棒球队。他在厨房灯还亮着、洗碗机跑着最后一轮长循环的晚上,画完了 Garamond Premier。他从没买过手机。",
      },
      {
        age: 48, moment: "2004 年湿冷的冬天",
        brief: "父亲去世;他请了半年假,跟 Carol 慢慢沿 1 号公路开下去。",
        state: "他父亲 Paul Jobs 在 2004 年三月死于癌症 —— 他半准备好的一种死,临到了又完全没准备好。他申请了六个月无薪假,在雨里跟 Carol 沿 1 号公路开下去,在从 Manchester 到 Big Sur 一路上的每一家路边小馆吃鱼,整整六个月没画一个字母。返程路上他开始画一款字,后来叫 Reed Pro,纪念他自己也说不清的东西。",
      },
      {
        age: 56, moment: "刚过去的十一月",
        brief: "在波特兰开着一家四人字铸厂,你现在读到的字可能就是他画的。",
        state: "他现在在波特兰东南 Division 街开着一家叫 Wishbone Type 的四人字铸厂,改建过的小屋里,木地板每年十一月以同样的方式吱呀作响。你现在屏幕上读到的这套字,那种带半细收笔、暖暖的 a 的字 —— 很可能就是他的 Reed Pro,他画了六年,2019 年发布。他知道 iPhone 是什么的方式,跟他知道火星车是什么的方式差不多;他用一台 Nokia 3310,读纸质书。",
      },
    ],
    outcome: "今天早上他在 Pine 街那间厨房吃了燕麦粥配焖苹果,Carol 在客厅练勃拉姆斯 f 小调奏鸣曲,波特兰十一月那种乳白色、微微带绿的光像从前一样从窗户进来。Daniel 在午饭前从奥克兰打来电话 —— 他现在在那边一家特许学校教八年级数学 —— 父子俩聊了十六分钟没什么要紧的事,大半是个堵着的水槽。上个礼拜二他在 Powell's 书店后面坐了四十分钟,重读那篇他读了三十年的 John Berger 文章。他每晚睡八个小时,手比那个版本的他要稳。这世界以任何具体的方式都不知道他的名字。这世界每一天都在读他的字 —— 在这块屏幕上,在另外一亿块屏幕上 —— 大多数傍晚,这对他来说,已经够了。",
    vibe: "quiet",
  },
  {
    divergence: {
      age: 21,
      moment: "1976 年夏天,库比蒂诺那间车库",
      event: "Co-founded Apple with Wozniak in a garage",
      alternative: "他留在了 Atari。让 Woz 一个人鼓捣出 Apple I,然后拒绝卖掉自己的 Atari 股票去入伙。",
    },
    trajectory: [
      {
        age: 23, moment: "1977 年 4 月,西海岸电脑展",
        brief: "站在 Brooks Hall 后排看 Woz 一个人 demo Apple II,装作没事。",
        state: "他穿着那件整周都穿着的蓝色 Atari 衫,站在旧金山 Brooks Hall 后排,看 Woz 在侧墙边上给一小圈人 demo Apple II。他胃翻了两次 —— 一次在 Woz 按出 BASIC 提示符那刻,一次在国半导体一个男人轻声说「这个会成事」的时候。他在回 BART 的路上买了根热狗,慢慢吃,这样就不用想任何具体的事。",
      },
      {
        age: 27, moment: "1981 年八月,圣何塞一场《星球大战》放映",
        brief: "在《星球大战》放映会上认识了高中物理老师 Janet,半年后结婚。",
        state: "他在圣何塞 Century Dome 影院的一场《星球大战》纪念放映上认识了 Janet,七个月后两人在她父母 Sunnyvale 的后院结了婚。她在 Wilcox 高中教物理,以一种 Atari 没人能做到的方式把他逗笑。1982 年春天来了个女儿,Lisa Marie,以 Janet 外祖母的名字命名 —— 跟宇宙里任何别的人没关系。",
      },
      {
        age: 32, moment: "1987 年劳动节后那个周一",
        brief: "Atari Coin-Op 中层工程师,结婚,女儿上幼儿园。",
        state: "1987 年劳动节后那个周一,他开着从一个叫 Marco 的家伙那儿买来的灰色 Civic 去 Milpitas 的 Atari Coin-Op,整个上午调一款没人会记得的赛车游戏的声音芯片。他在装货平台边那排自动售货机买了个火鸡三明治。Lisa 那周开始在 Westmoor 上幼儿园;Janet 在门口给她拍了张 Polaroid。他以一种三十二岁累极了的人的方式想到,这就是一种完美正常的生活。",
      },
      {
        age: 35, moment: "1990 年春,电子游戏大崩盘三年后",
        brief: "Atari Coin-Op 倒了;他在洛克希德接了导弹固件的合同。",
        state: "Atari Coin-Op 终于在 1990 年三月倒了,晚了整整三年。他通过一家叫 Volt 的派遣公司接到洛克希德 Sunnyvale 工厂的合同,写 AGM-65 Maverick 的制导固件。工程楼那股地毯胶水味钻进他的衬衫。他以一种很具体的方式讨厌每一个星期一,那种讨厌里头有 KFOG 早晨节目,有停车场的钠灯。1976 年的 Volvo 换成了 1989 年的 Camry。他还是吃同一种火鸡三明治。",
      },
      {
        age: 42, moment: "1997 年春天,离婚",
        brief: "Janet 跟一个斯坦福地球物理学家走了,他周末带 Lisa。",
        state: "Janet 在 1997 年三月离开了他,跟一个叫 David 的斯坦福地球物理学家结合 —— 那男人每周登两次 Mission Peak,把 Janet 逗笑的次数比他十年里加起来还多。他搬到 Sunnyvale 一栋下午光线很差的一居室,周末带 Lisa,大多数星期天开车上 Big Basin 走同一条 loop trail。后来四年没跟任何人约会。他在厨房台面放了一台小小的 Sony 收音机,连周六也在听 KFOG。",
      },
      {
        age: 52, moment: "2007 年秋,被裁",
        brief: "洛克希德裁员;拿了一笔小养老金。Lisa 那时在斯坦福。",
        state: "洛克希德 2007 年十月连他在内裁了三十个外包 —— 是个星期二,提前两周通知,给了一小笔遣散费。他领了提前退休的过渡金和养老金,在原来 Sunnyvale 那栋楼里换了套稍微大一点的房子。Lisa 那时在斯坦福靠半奖读电子工程,每周日晚上给他打电话。他开始沿 Mary Avenue 每天走三英里,在图书馆借美国南北战争的书读。",
      },
      {
        age: 56, moment: "刚过去的十一月",
        brief: "独居 Sunnyvale 靠一笔小养老金;女儿在 Google 做高级工程师。",
        state: "他现在独自住在 Mary Avenue 那栋公寓楼里一套 67 平米的房子,二十年前离婚后搬进来,地毯到现在还带着前住户那只猫的淡淡气味。Lisa 在山景城那边 Google 做到高级员工,自己也有两个孩子,每隔一个星期天来吃晚饭,经常带 El Camino 上那家广东馆子的外卖。PBS 去年春天那部关于「另一个版本的他在另一个宇宙建了 Apple」的纪录片,他看了两遍。",
      },
    ],
    outcome: "今天早上他在 Sunnyvale 那间小公寓的厨房吃了炒蛋和一片黑麦面包,那台不知道为什么四十年没关过的 Sony 收音机播着同一档 KFOG 早晨节目。窗户外是停车场和一排需要修剪的椰枣树。Lisa 上个礼拜天带两个孩子来过,叫了 El Camino 上王家馆子的老三样 —— 春卷和招牌面 —— 孩子们在厨房台子边吃,Lisa 站在水池前。他已经八年没跟 Janet 说过话,自己也说不清为什么。有些星期天,他从那些再也不进去的洛克希德大楼旁走过,几乎能听见 —— 那个他没建的公司、那个他没敲下的凹痕。Lisa 不知道他放弃了什么,也大概永远不会知道。他回去的长路上想这件事,把它想成一种慈悲。",
    vibe: "ash",
  },
  {
    divergence: {
      age: 30,
      moment: "1985 年 5 月那场漫长的董事会",
      event: "Pushed out of Apple after a board fight",
      alternative: "他赢了那场仗。第二天早上 John Sculley 递了辞呈,公司留在了他手里。",
    },
    trajectory: [
      {
        age: 32, moment: "1987 年三月一个星期二",
        brief: "在 Bandley 3 一上午开掉了 Mac 团队一半的人。",
        state: "他在 Bandley 3 一上午开掉了 Mac 团队四十一个工程师,从早晨七点开始,中午前结束。他亲自做的,一间办公室一间办公室,穿着从星期二就没换过的那件灰色高领。星期四前,最好的六个已经去了 Sun,三个去了 Redwood Shores 一个还没起名字的地方。Newton 在他的鞭子下提前上市,识别率三成是好日子的标准,圣诞节前的退货量大到 Cupertino 邮件房的退货单都印不及。",
      },
      {
        age: 38, moment: "1993 年秋,Windows 95 内测中",
        brief: "Windows 95 一行一行吃掉市场,他一行一行拒绝授权 Mac OS。",
        state: "Windows 95 那时还在内测,看着比谁预期的都好,IBM 已经悄悄不再回他电话。他逐行拒绝任何 clone 厂商授权 Mac OS,理由是「稀释品牌」;那一年下半年股价跌了七成。他开一辆没挂牌的黑色 1989 款奔驰 500SL,十八个月里被高速巡警拦过三次。十月里有一次,他在咖啡厅里因为字号问题把一个工程师骂哭,事后他想不起那工程师叫什么名字。",
      },
      {
        age: 45, moment: "2000 年夏天的恶意收购",
        brief: "Sun 想恶意收购,差五十万股就成。一个 4 比 3 的董事会票决挡住了。",
        state: "Sun 的 Scott McNealy 在 2000 年六月对 Apple 发起恶意收购,库比蒂诺董事会上一个 4 比 3 的票把它挡了下来 —— 中间差五十万股,差他凌晨三点打给 Larry Ellison 的那一通电话。公司那时已经只剩 1985 年的四分之一大,一千五百号人,分在三栋楼。投票结果落定那晚,他一个人在办公室喝了杯酒,看着 280 高速上的灯,没给任何人打电话。",
      },
      {
        age: 50, moment: "2005 年春天,离婚",
        brief: "Laurene 走了,带走了孩子,留下 Palo Alto 那栋房子。",
        state: "Laurene 在 2005 年五月离开了他,把孩子带去 Palo Alto Waverley 街的一栋房子,通过她的律师要求他不要直接联系 Eve。他留下了 Woodside 那栋有长长车道的房子,只住其中三间屋子。星期天他独自在 Menlo Park 的 Madera 餐厅吃饭,坐窗边那张桌子,固定那份 Caesar 沙拉和那份扁面包。整个剩下的十年他没跟任何人约会过。",
      },
      {
        age: 53, moment: "2008 年秋,晚了两年的诊断",
        brief: "得了同样的胰腺癌,晚了两年。Whipple 手术这次不再是选项。",
        state: "他在 2008 年秋天发现腹部那种说不清的不对劲,以他从八十年代中期开始就一直对自己身体的态度,拖了半年。等到 UCSF 十月份做完影像,那颗胰岛细胞瘤已经突破到肝脏。在另一条时间线里给那个版本的他撑了八年的 Whipple 手术,这次已经不再是外科选项。他开始打吉西他滨,午后在 Woodside 房后的长坡上走路,从头重读《伊甸园之东》。",
      },
      {
        age: 56, moment: "刚过去的星期一",
        brief: "还是那个更小、更硬、更孤独的 Apple 的 CEO。还是对所有他对的事情依然对。",
        state: "他还在做一个更小、更硬的 Apple 的 CEO,公司一千两百号人,缩在 Bandley 上的两栋楼里,主打那条一万六千美元一台、一年只卖八百台给设计工作室的工作站线。这周一他六点就到了,把一个年轻工程师在帮助对话框上的字距骂哭了 —— 他骂对了。黑色高领因为心内科医生的请求换成了炭灰色高领。公司已经九年没出新产品线了。",
      },
    ],
    outcome: "今天早上他五点在 Woodside 那栋房子醒过来,在厨房中岛站着吃了半个西柚,六点二十坐进了 Bandley 3 的办公桌,穿的还是那件整月都穿的炭灰色羊绒高领。280 高速上的雾还没散。Laurene 已经十一年没跟他说过话;Eve 和 Reed 一年来看他两次,而且来得礼貌而拘谨。没有被流放,就没有 NeXT,就没有 Pixar,就没有《玩具总动员》;没有《玩具总动员》,就没有那场动画电影复兴,也没有 Mark Andrews 和 Andrew Stanton 在 Emeryville 那个安静的小王国。这个世界任何房间、任何城市里都没有 iPhone。Apple 那些年轻工程师怕他,其中几个私下恨他;他们怕得对、恨得对。凌晨三点偶尔他会想明白:权力不带弯腰,就只是穿了高领的固执。他赢了那间会议室,输了那条弧。",
    vibe: "burn",
  },
  {
    divergence: {
      age: 17,
      moment: "1973 年秋,印度那七个月之后",
      event: "Dropped out of Reed College after one semester",
      alternative: "他在印度待过了那七个月。再也没回来。",
    },
    trajectory: [
      {
        age: 19, moment: "1974 年漫长的雨季,奈尼塔尔",
        brief: "在奈尼塔尔郊外一座小寺院受了戒,取名 Sri Anand。",
        state: "他在 1974 年漫长的雨季里留在了 Neem Karoli Baba 继承者位于奈尼塔尔郊外的道场,七月里的一个周二在院子里烧掉了所有美国衣服,从住持的妻子那里得了 Sri Anand 这个名字。他睡在一间长长的合宿房里、一张椰棕垫上,跟七个男人同住,三点四十起床,跟一位曾经在 Lucknow 做铁路职员、叫 Ramesh 的年轻僧人学印地语。他还没给母亲写信。",
      },
      {
        age: 25, moment: "1980 年干燥的春天",
        brief: "把 Ramana Maharshi 译成磕磕绊绊的英文,靠邮件流通。",
        state: "他用别人从德里搬上来的一台小 Olivetti 打字机,在道场前廊上花了三年,把 Ramana Maharshi 的《现实四十诗》译成磕磕绊绊的英文。译稿打成三份,通过邮件寄给加州和佛蒙特的一小撮求道者,其中包括剑桥一个女人 —— 几十年后写他讣告的人。他每天喝两次 chai,沿同一公里的路走,不再做关于美国的梦。",
      },
      {
        age: 30, moment: "1985 年湿冷的冬天,伯克利",
        brief: "在伯克利 Sacramento 街一个改装的车库里开了冥想堂。",
        state: "1985 年湿冷的冬天,他在伯克利 Sacramento 街一个改装过的爱德华时代车库里开了一间冥想堂,跟一个读过那批 Olivetti 译稿、从佛蒙特来的女人 Anne 一起,把墙刷成了带粉感的白。他穿了同一件枣红色袈裟整整十一年,哪怕肩部已经磨薄,大多数星期三晚上跟三十五个人坐在一起 —— 坐垫是 Anne 用旧毛毯缝的。他没装电话。",
      },
      {
        age: 39, moment: "1994 年漫长的八月",
        brief: "在 Marin 一家临终关怀院陪一个垂死的人,明白了自己的生活变窄了。",
        state: "1994 年漫长的八月里,他在 San Rafael 一间临终关怀院、一间奶白墙、窗外只有一棵柠檬树的小房间里,陪一个五十八岁、从佩塔卢马退休的二手车销售员 Walter。Walter 是被点名要他来的。Walter 在一个礼拜天下午三点十二死去,他握着 Walter 的左手。他那天傍晚走回 BART 的路上明白,自己的生活已经窄到一种再难分辨「窄」和「宽」的程度。他从没把这件事告诉任何人。",
      },
      {
        age: 46, moment: "2001 年春",
        brief: "在 Marin 办了家叫 Long Light 的临终关怀院,八张床,不会再多。",
        state: "2001 年春,他在 Point Reyes 外一栋改造过的农舍里办了一家叫 Long Light 的住院型临终关怀院,八张床 —— 他立下的誓是不会再多。Anne 管厨房和账,他陪垂死的人,愿意听的就给他们读 Rilke 和一点 Wendell Berry。加州政府给了他们牌照。加州政府从此每两年来审一次,他们请审计员吃午饭,带他们看那片柚子林。",
      },
      {
        age: 52, moment: "2007 年沉默的七月",
        brief: "Anne 在 Long Light 厨房中风过世;他把关怀院继续开了下去。",
        state: "Anne 在 2007 年沉默的七月一个下午,正在 Long Light 厨房给两张床做柠檬水,突然中风过世,他四点十分在油毡地上找到她,柠檬还摊在砧板上。他撑过葬礼、撑过审计、撑过之后那六个月 —— 那六个月里他没法在那间厨房吃饭。秋天他把蒲团搬到了柚子林里,傍晚坐在那里,一直坐到十二月。",
      },
      {
        age: 56, moment: "刚过去的星期四",
        brief: "还在 Long Light。粗算握过差不多三千个人临终时的手。",
        state: "他还住在 Long Light,厨房后面那间小屋,粗算下来,他握过差不多三千个人在死亡那一刻的手。关怀院现在有九张床 —— 比当年的誓多了一张,这件事不再像从前那样困扰他。他不知道 Apple 是什么的程度,跟一个普通人差不多。他听说过那些塔楼、那些战争、那些被人揣在口袋里的小亮方块。他不需要知道更多。",
      },
    ],
    outcome: "他今天早上三点四十在 Long Light 厨房后那间小屋醒来,喝了一杯温水加柠檬,在柚子林里坐了四十分钟禅,听 Tomales 湾上的雾涌进来,六点给两张还能吃东西的床熬了粥。三号床,一个从 Stockton 退休的牙科保健员 Marisol,请他读一段,他用英文给她读了十二分钟 Rilke。厨房窗外那道光,是十一月任何一天从太平洋飘进来的那种带奶白和淡绿的光。他另一条人生里那些 —— 那些塔楼、那些小亮方块、那些主旨演讲的舞台 —— 是一种就算给他看,他也无法想象的形状,因为他根本不会去想象。有些人生用注意力衡量,不用规模。他不是用语言这样想,而是借着 Marisol 在他手里又睡过去时手心那点稳重的分量,这样想。",
    vibe: "shine",
  },
  {
    divergence: {
      age: 41,
      moment: "1996 年 12 月,那场没发生的 NeXT 收购会议",
      event: "Came back to Apple via the NeXT acquisition",
      alternative: "Apple 选了 BeOS。NeXT 作为一家研究实验室,在 Redwood City 苟延残喘。",
    },
    trajectory: [
      {
        age: 43, moment: "1998 年秋",
        brief: "NeXT 那时 47 个员工,那年两次发不出工资。",
        state: "1998 年秋,NeXT 的 Redwood City 办公室,Twin Dolphin 路上,47 个员工,那年两次发不出工资 —— 三月一次,十月里一个星期五,SVB 的额度突然抽了。十一月他裁了三分之一的人,把办公家具卖给了楼下一家初创。他开一辆漏机油的奔驰 500SL,副驾上摊着一本 Steinbeck 的《伊甸园之东》。",
      },
      {
        age: 47, moment: "2002 年春",
        brief: "把 NeXT 剩下的部分以三千八百万卖给了 Sun,开了一家小基金。",
        state: "2002 年春,他把 NeXT 剩下的部分以三千八百万美元卖给了 Sun Microsystems,自己拿了其中五百万,在 Palo Alto 大学路一家寿司店楼上开了一家小型咨询兼种子投资公司。他只招了一个分析师 —— 1991 年起就给他做助理的女人 Patricia —— 两人接下来三年,每个礼拜三都去 Lytton 街那家柬埔寨馆子吃午饭。那只基金在 2002 年中期下了一小笔注给一家叫 Google 的搜索公司,这是他在那个十年里唯一后悔没跟任何人提过的事。",
      },
      {
        age: 50, moment: "2005 年漫长的夏天",
        brief: "进了 Pixar 董事会。第二年迪士尼收购 Pixar 时他丢了席位。",
        state: "2005 年夏天,他进了 Pixar 董事会,主要是想离 Lasseter 和他们在 Emeryville 建起来的那个小小好王国近一点。2006 年初迪士尼以七十五亿收购 Pixar 时,董事会被重组到只剩四个内部人,他的位置就这样没了。他二月飞了两次伯班克,跟 Iger 和 Lasseter 在 Musso & Frank 吃饭,后来一个人沿 Hollywood Boulevard 走了很久。Patricia 觉得他回来时人不一样了。",
      },
      {
        age: 53, moment: "2008 年秋,晚了两年",
        brief: "得了同样的胰腺癌,比另一个版本晚了两年。",
        state: "他在 2008 年春就感到了同样那种说不清的腹部不对劲,以他从八十年代中期就开始的对自己身体的忽视,继续忽视了一阵。等到 UCSF 在十月做完影像,那颗胰岛细胞瘤已经迁移到肝。在另一条时间线里 2004 年治好那个版本的他的 Whipple 手术,这次已经不能做。一月他开始打吉西他滨,大部分下午沿 Woodside 房后那座长山走,从头又读了一遍《伊甸园之东》。",
      },
      {
        age: 54, moment: "2009 年末的安静",
        brief: "给 Lisa 写了一封长信塞在抽屉里;关掉了基金。",
        state: "2009 年十一月到十二月间,他在化疗周漫长的下午里,在厨房,在 Crane 信纸上,给大女儿 Lisa 写了一封二十二页的长信 —— 然后把它放在 Woodside 那张书桌的抽屉里,没寄。2010 年一月他关了基金,给 Patricia 送了五万美元和一本村上春树的初版书。二月起他不再去办公室。那辆奔驰停在车道上,机油继续慢慢漏着。",
      },
      {
        age: 55, moment: "2011 年春",
        brief: "5 月初一个星期三下午,在 Woodside 那栋房子里过世。",
        state: "他在 2011 年 5 月初一个星期三下午,在 Woodside 那栋房子的卧室里过世。Laurene 和 Reed、Erin、Eve 都在房里,Lisa 那班从芝加哥回来的飞机晚了一小时落地。房间梳妆台上摆了一束花园里的玫瑰,有那种春末清晨的光。他临走前一直在听 Glenn Gould 弹的哥德堡变奏曲。",
      },
      {
        age: 56, moment: "刚过去的春天",
        brief: "葬在 Palo Alto Alta Mesa。墓碑小而朴素。",
        state: "他葬在 Palo Alto Arastradero 路上 Alta Mesa Memorial Park 的 H 区,一块小小的、低矮的花岗岩石,只刻名字和生卒,没有墓志铭。Laurene 一年来两次,通常带一束 Waverley 那栋房子花园里的玫瑰;Lisa 每年五月从芝加哥飞来一次。2009 年末抽屉里那封信,2014 年被 Eve 找到,按 Lisa 的意思,没拆。没有 iPhone 这件事发生过。没有那件黑高领发生过。没有主旨演讲的舞台,没有七十亿人口袋里那块小亮方 —— 都没有。",
      },
    ],
    outcome: "没有「今天早上」可以描述 —— 在这个版本里,他已经走了快一年,葬在 Alta Mesa H 区一块松树皮色的石头底下。Woodside 那栋房子那年夏天被 Laurene 卖给了一家从格林尼治来的对冲基金家庭,他们把所有屋子重新粉成了淡灰白。Patricia,他原来的分析师,现在在大学路那家寿司店楼上一个小早期基金里独立运营,礼拜三还是去 Lytton 街那家柬埔寨馆子。Pixar 这件事是发生在他身上的;别的都没有。在最后那十年里,他漂成了一个从一家鱼柜上头的小办公室里,看别人帝国的人。然后他没年头了。一个口袋里没有那七十亿块小亮方的世界,跟有那些小亮方的世界,看起来几乎一样,而几乎没有人会注意到这一点。",
    vibe: "drift",
  },
  {
    divergence: {
      age: 21,
      moment: "1976 年初,LLC 文件签下之前那个礼拜",
      event: "Co-founded Apple with Wozniak in a garage",
      alternative: "他让 Woz 永远跟自己平起平坐 —— 出于原则,拒绝任何会稀释他们俩的融资。",
    },
    trajectory: [
      {
        age: 25, moment: "1980 年 12 月,IPO",
        brief: "Apple IPO 时更小、更慢、工程师主导。募的钱只有另一个版本的一半。",
        state: "Apple 在 1980 年 12 月 IPO,估值是另一个版本里那家公司的一半 —— 六千万,而不是一亿一千七百万 —— 因为他们四年间出于「工程师该拥有自己的工作」这条原则,拒了两轮 A、三轮 B。Woz 留了三成三,他自己留了两成八。那天敲钟之后,两人在 Bandley 的停车场一起哭了一场,然后去他们 1977 年起就常去的 Marie Callender's 吃饭。",
      },
      {
        age: 30, moment: "1985 年秋",
        brief: "没有流放,没有 Sculley 战争。Macintosh 晚一年上市,但没崩。",
        state: "1985 年没有发生流放,因为没有 Sculley —— 他们雇了一个比较安静的二号位,Markkula 推荐的人 Mike Murray,让他做管理层老二,两位创始人专心带产品。Macintosh 比真实那条时间线晚了十四个月才上市,更小心、内存翻倍、定价两千四,没在自己重量底下崩。前十八个月卖了五十万台,他们不着急。",
      },
      {
        age: 35, moment: "1990 年漫长的春天",
        brief: "一家更安静、更小、被深深喜爱的公司。Apple II 系列又活了十二年。",
        state: "到 1990 年,Apple 是一家更安静、更小、被深深喜爱的公司,九百号人,分在 Bandley 的四栋楼里,一条 Apple II 系列被打磨成了一台米色的博物馆级机器,卖给学校,继续莫名其妙地一路卖到 2002 年。1989 年他们在 Palo Alto 大学路开了第一家 Apple 零售店,长木桌,桌后是友善的 Genius。Woz 每六个月换一辆不同的二手车,在 Bandley 3 地下室自己搭了套激光枪战系统。",
      },
      {
        age: 41, moment: "1996 年湿冷的冬天",
        brief: "拒了一个本可让两家都赚翻的微软交叉授权。",
        state: "Bill Gates 1996 年一月飞到库比蒂诺,提了一个本可让两家都赚翻的五年交叉授权方案,他们在一个湿冷的星期三下午、在 Murray 办公室里拒了 —— Woz 在白板上画电路图,他自己来回踱步。两人送 Gates 上车,握手,回到屋里吃了顿冷千层面。那一季度股价没动,下一季度也没动。Woz 走出去时说,他很高兴他们这么做了。",
      },
      {
        age: 47, moment: "2002 年漫长的夏天",
        brief: "原版 Mac mini 上市,定价 499 美元。三年卖了一千一百万台。",
        state: "他们 2002 年六月把第一代 Mac mini 推出来,定价四百九十九美元,小小一只挤压成型的铝壳,精装书大小,头三年给学校和不知道自己想要它的家庭卖了一千一百万台。iPod 在这个版本里没出现,因为 Jon Rubinstein 没有理由去发明它。音乐还是从 Tower Records 大学路那家店买 CD —— 在这个版本里,那家店没关。",
      },
      {
        age: 52, moment: "2007 年湿冷的春天",
        brief: "手机团队做了两台原型机,两台都被搁了。",
        state: "Bandley 5 一个小的手机团队在 2005 到 2007 年间做出来两台原型 —— 一台平板、一台翻盖 —— 两台都在跟 Woz 的第二次设计评审里被搁了。Woz 没法接受发布一台「把用户锁在自己机器外面」的东西。他们写了一份长备忘录,结尾那句是「我们做的任何东西,都不应该是一个你没法在自己厨房里修好的东西」。他们那年改去发了 iBook G5,1300 美元,铰链好到能用十年。",
      },
      {
        age: 56, moment: "刚过去那个湿冷的十月",
        brief: "两人都还活着、都在 Apple。一起请了五个月假写了一本关于车库的书。",
        state: "2026 年十月下旬,他们两人都还活着、都还在 Apple,是楼里仅有的两个还在岗的、超过五十五岁的原始员工。去年春天两人一起请了五个月假写了一本书 —— 关于那个车库的回忆录,主要是 Woz 的声音,他偶尔插话 —— 九月由 Norton 出版。Mac mini 现在到了第十二代,2002 年买了第一代的那些学校还在用。没有 iPhone。有一个叫 Wishbone 的小设备,Apple 从没打过广告,卖三百美元,只能看时间。",
      },
    ],
    outcome: "今天早上六点二十,他开同一辆 2004 年的 Acura,沿同一段 Stevens Creek 大道,在免提里听 Woz 说了九分钟一个 Bandley 3 编译版本里的路由 bug,六点五十穿着今年每天都穿那件灰色 Patagonia 抓绒走进楼。Cupertino 那块天空,湿了一夜之后,是那种淡珍珠色。Laurene 已经在基金会;Reed 上周末从普林斯顿回来。这世界口袋里他的东西更少,大概也不那么需要那些。这一版的 Apple 更小、更慢、不那么革命、被爱得更深 —— 一个十年一条产品线,一百四十六家零售店而不是五百一十一家。他睡得比另一个版本的他要好。友谊还在。从这件事之后所有发生的事,几乎都是从这件事来的。",
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
