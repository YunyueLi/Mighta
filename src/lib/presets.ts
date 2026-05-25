import type { TFunction } from "i18next"

export type PresetCategory = "famous" | "scenario"

export interface PresetDef {
  id: string
  category: PresetCategory
  name: string
  age: number
  bio: string
  nodes: Array<{ age: number; event: string }>
}

/**
 * Presets are i18n-keyed only for name + scenario titles.
 * Bio + nodes are written in English (Claude adapts output to user's language anyway).
 * This keeps locale files manageable.
 */
export function getPresets(t: TFunction): PresetDef[] {
  return [
    // ─── Famous people ───
    {
      id: "steve",
      category: "famous",
      name: t("preset.steve.name"),
      age: 56,
      bio: "Co-founded a personal computer company in a garage. Adopted. Dropped in and out of formal education.",
      nodes: [
        { age: 17, event: "Dropped out of Reed College after one semester" },
        { age: 21, event: "Co-founded Apple with Wozniak in a garage" },
        { age: 30, event: "Pushed out of Apple after a board fight" },
        { age: 41, event: "Came back to Apple via the NeXT acquisition" },
      ],
    },
    {
      id: "musk",
      category: "famous",
      name: t("preset.musk.name"),
      age: 53,
      bio: "South African-born entrepreneur. Built fortunes in software, payments, electric cars, and rockets. Controversial public persona.",
      nodes: [
        { age: 17, event: "Left South Africa for Canada to avoid mandatory military service" },
        { age: 24, event: "Sold first startup Zip2 for $307M" },
        { age: 31, event: "Founded SpaceX with $100M of his own money" },
        { age: 37, event: "Took over Tesla as CEO during financial crisis" },
        { age: 51, event: "Bought Twitter for $44B and rebranded it X" },
      ],
    },
    {
      id: "haruki",
      category: "famous",
      name: t("preset.haruki.name"),
      age: 75,
      bio: "Japanese novelist. Owned a jazz bar in Tokyo before writing. Translator, marathon runner.",
      nodes: [
        { age: 25, event: "Opened a jazz bar called Peter Cat with his wife" },
        { age: 29, event: "Decided to become a novelist while watching a baseball game" },
        { age: 38, event: "Published Norwegian Wood — sold over 4 million copies" },
        { age: 50, event: "Moved abroad and lived in Princeton, Boston, then back to Japan" },
      ],
    },
    {
      id: "woolf",
      category: "famous",
      name: t("preset.woolf.name"),
      age: 59,
      bio: "English modernist novelist. Co-founded Hogarth Press. Suffered lifelong depression.",
      nodes: [
        { age: 22, event: "Father died — began writing for the Times Literary Supplement" },
        { age: 30, event: "Married Leonard Woolf and joined the Bloomsbury Group" },
        { age: 35, event: "Co-founded Hogarth Press with Leonard, published her own work and Eliot's" },
        { age: 43, event: "Published Mrs Dalloway, defined stream-of-consciousness style" },
        { age: 59, event: "Walked into the River Ouse with stones in her pockets" },
      ],
    },

    // ─── Life scenarios ───
    {
      id: "scenario_emigrate",
      category: "scenario",
      name: t("preset.scenario_emigrate.name"),
      age: 32,
      bio: "Someone who emigrated in their twenties for love or work. Misses something they can't quite name. Comfortable but unanchored.",
      nodes: [
        { age: 22, event: "Took a graduate scholarship abroad instead of a job at home" },
        { age: 25, event: "Married someone from the host country" },
        { age: 28, event: "Bought a house — passport became a different color" },
        { age: 31, event: "Last living grandparent back home died; couldn't fly back in time" },
      ],
    },
    {
      id: "scenario_unmarried",
      category: "scenario",
      name: t("preset.scenario_unmarried.name"),
      age: 36,
      bio: "Mid-thirties, never married. Career intact. Family asks too often. Sometimes relieved, sometimes lonely.",
      nodes: [
        { age: 24, event: "Broke up with the college sweetheart everyone expected to marry" },
        { age: 28, event: "Turned down a proposal from someone safe and kind" },
        { age: 32, event: "Said no to a baby with a partner who wanted one" },
        { age: 35, event: "Stopped going to weddings" },
      ],
    },
    {
      id: "scenario_startup_failed",
      category: "scenario",
      name: t("preset.scenario_startup_failed.name"),
      age: 34,
      bio: "Software engineer. Founded a startup, ran it for three years, ran out of money. Now back at a big company. Quieter now.",
      nodes: [
        { age: 27, event: "Quit a senior engineer role to start a company with a college friend" },
        { age: 29, event: "Raised a $2M seed round, hired 8 people" },
        { age: 32, event: "Ran out of runway, laid off the team, returned investor money" },
        { age: 33, event: "Took an L7 offer at a big tech company. Stopped tweeting" },
      ],
    },
    {
      id: "scenario_phd",
      category: "scenario",
      name: t("preset.scenario_phd.name"),
      age: 38,
      bio: "Stayed in academia after the PhD. Tenure-track somewhere. Sometimes wonders what the industry money would've felt like.",
      nodes: [
        { age: 23, event: "Turned down a quant job in NYC to start a PhD" },
        { age: 28, event: "Finished thesis on a niche topic three people in the world read" },
        { age: 30, event: "Took the first postdoc that came, moved to a small college town" },
        { age: 36, event: "Got tenure-track at a state school. Started losing hair" },
      ],
    },
    {
      id: "scenario_caretaker",
      category: "scenario",
      name: t("preset.scenario_caretaker.name"),
      age: 41,
      bio: "Gave up on a career or city to take care of a parent. Doesn't regret it on most days.",
      nodes: [
        { age: 28, event: "Was about to move abroad when a parent got a diagnosis" },
        { age: 30, event: "Moved back home, took a remote job that paid half" },
        { age: 35, event: "Watched the parent die slowly" },
        { age: 38, event: "Stayed in the same town, never quite started over" },
      ],
    },
  ]
}
