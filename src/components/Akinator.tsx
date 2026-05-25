/**
 * Akinator-reverse: instead of filling out a form, the user answers
 * seven binary fork-style questions and we construct a seed for them.
 *
 * The questions are designed to surface ACTUAL forks people remember —
 * regret, leaving, risk, family — not personality traits.
 */

import { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Sparkles } from "./Icons"

export interface AkinatorSeed {
  name: string
  age: number
  bio: string
  nodes: Array<{ age: number; moment?: string; event: string }>
}

interface Q {
  id: string
  prompt: string
  options: Array<{
    key: string
    label: string
    // When this option is picked, contribute these to the seed
    bioFragment?: string
    node?: { age: number; moment?: string; event: string }
  }>
}

function buildQuestions(t: (k: string) => string): Q[] {
  return [
    {
      id: "regret",
      prompt: t("akinator.q1"),
      options: [
        {
          key: "did",
          label: t("akinator.q1_a"),
          bioFragment: t("akinator.q1_a_bio"),
          node: { age: 22, moment: t("akinator.q1_a_moment"), event: t("akinator.q1_a_event") },
        },
        {
          key: "didnt",
          label: t("akinator.q1_b"),
          bioFragment: t("akinator.q1_b_bio"),
          node: { age: 22, moment: t("akinator.q1_b_moment"), event: t("akinator.q1_b_event") },
        },
      ],
    },
    {
      id: "fear",
      prompt: t("akinator.q2"),
      options: [
        { key: "exam", label: t("akinator.q2_a"), bioFragment: t("akinator.q2_a_bio") },
        { key: "love", label: t("akinator.q2_b"), bioFragment: t("akinator.q2_b_bio") },
      ],
    },
    {
      id: "leave",
      prompt: t("akinator.q3"),
      options: [
        {
          key: "willing",
          label: t("akinator.q3_a"),
          bioFragment: t("akinator.q3_a_bio"),
          node: { age: 25, moment: t("akinator.q3_a_moment"), event: t("akinator.q3_a_event") },
        },
        {
          key: "stay",
          label: t("akinator.q3_b"),
          bioFragment: t("akinator.q3_b_bio"),
          node: { age: 25, moment: t("akinator.q3_b_moment"), event: t("akinator.q3_b_event") },
        },
      ],
    },
    {
      id: "missed",
      prompt: t("akinator.q4"),
      options: [
        {
          key: "died",
          label: t("akinator.q4_a"),
          bioFragment: t("akinator.q4_a_bio"),
          node: { age: 28, moment: t("akinator.q4_a_moment"), event: t("akinator.q4_a_event") },
        },
        {
          key: "drifted",
          label: t("akinator.q4_b"),
          bioFragment: t("akinator.q4_b_bio"),
          node: { age: 28, moment: t("akinator.q4_b_moment"), event: t("akinator.q4_b_event") },
        },
      ],
    },
    {
      id: "work",
      prompt: t("akinator.q5"),
      options: [
        { key: "yes", label: t("akinator.q5_a"), bioFragment: t("akinator.q5_a_bio") },
        { key: "no", label: t("akinator.q5_b"), bioFragment: t("akinator.q5_b_bio") },
      ],
    },
    {
      id: "parent",
      prompt: t("akinator.q6"),
      options: [
        {
          key: "become",
          label: t("akinator.q6_a"),
          bioFragment: t("akinator.q6_a_bio"),
          node: { age: 30, moment: t("akinator.q6_a_moment"), event: t("akinator.q6_a_event") },
        },
        {
          key: "not_become",
          label: t("akinator.q6_b"),
          bioFragment: t("akinator.q6_b_bio"),
          node: { age: 30, moment: t("akinator.q6_b_moment"), event: t("akinator.q6_b_event") },
        },
      ],
    },
    {
      id: "time",
      prompt: t("akinator.q7"),
      options: [
        { key: "past", label: t("akinator.q7_a"), bioFragment: t("akinator.q7_a_bio") },
        { key: "future", label: t("akinator.q7_b"), bioFragment: t("akinator.q7_b_bio") },
      ],
    },
  ]
}

export default function Akinator({
  onComplete,
  onBack,
}: {
  onComplete: (seed: AkinatorSeed) => void
  onBack: () => void
}) {
  const { t, i18n } = useTranslation()
  const questions = useMemo(() => buildQuestions(t), [t, i18n.language])

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const q = questions[step]
  const isLast = step === questions.length - 1
  const progress = ((step + 1) / questions.length) * 100

  function pick(option: Q["options"][number]) {
    const newAnswers = { ...answers, [q.id]: option.key }
    setAnswers(newAnswers)
    if (isLast) {
      // Build seed from all answers
      const seed = buildSeedFromAnswers(questions, newAnswers, t)
      onComplete(seed)
    } else {
      setStep((s) => s + 1)
    }
  }

  function goBack() {
    if (step === 0) {
      onBack()
    } else {
      setStep((s) => s - 1)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress strip */}
      <div className="mb-12">
        <div className="flex items-baseline justify-between mb-2 folio">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 hover:text-fg transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            {step === 0 ? t("akinator.back_to_form") : t("akinator.back_one")}
          </button>
          <span>
            {step + 1} / {questions.length}
          </span>
        </div>
        <div className="h-px bg-line relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-accent transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="small-caps text-[10.5px] text-fg-dim mb-4">
            {t("akinator.question")} {step + 1}
          </p>
          <h2
            className="text-fg leading-[1.15] text-balance mb-12"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)",
              fontWeight: 430,
              letterSpacing: "-0.02em",
            }}
          >
            {q.prompt}
          </h2>

          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <motion.button
                key={opt.key}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.4, ease: "easeOut" }}
                onClick={() => pick(opt)}
                className="group w-full text-left px-6 py-5 rounded-lg border border-line bg-bg-elevated hover:border-line-bright hover:bg-bg-soft/60 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <span className="script text-fg-dim group-hover:text-accent text-[1.4rem] leading-none transition-colors duration-300">
                    {String.fromCharCode(97 + i)}.
                  </span>
                  <span className="serif-italic text-fg text-[16px] leading-snug flex-1">
                    {opt.label}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-fg-faint group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-300 mt-1.5" />
                </div>
              </motion.button>
            ))}
          </div>

          {isLast && (
            <p className="mt-8 folio text-fg-faint text-center inline-flex items-center justify-center w-full gap-2">
              <Sparkles className="w-3 h-3" />
              {t("akinator.last_hint")}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function buildSeedFromAnswers(
  questions: Q[],
  answers: Record<string, string>,
  t: (k: string) => string
): AkinatorSeed {
  const bioParts: string[] = []
  const nodes: AkinatorSeed["nodes"] = []
  for (const q of questions) {
    const a = q.options.find((o) => o.key === answers[q.id])
    if (!a) continue
    if (a.bioFragment) bioParts.push(a.bioFragment)
    if (a.node) nodes.push(a.node)
  }
  return {
    name: t("akinator.subject_name"),
    age: 30,
    bio: bioParts.join(" "),
    nodes,
  }
}
