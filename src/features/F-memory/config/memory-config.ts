// [F-memory/R0/C2] Memory physics constants
// R0: zero dependencies. All constants that govern learning, decay, and diffusion live here.
// To tune the system: adjust one constant, observe vital signs, nothing else.
//
// ─── GOVERNING INVARIANT ────────────────────────────────────────────────────
// A structure survives iff time-averaged reinforcement ≥ decay pressure.
// Equilibrium weight:
//   w* = (α · u · E[a_i · a_j]) / (λ + α · u · E[a_i · a_j])
//
// Current constants target w* ≈ 0.5–0.8 for frequently co-activated pairs.
// If λ too high relative to α: all structure decays → memory loss.
// If α too high relative to λ: saturation everywhere → plasticity death.
// ────────────────────────────────────────────────────────────────────────────

// Diffusion
export const STEPS              = 3        // propagation hops
export const GLOBAL_DECAY       = 0.6      // activation attenuation per hop
export const MIN_ACTIVATION     = 1e-5     // pruning floor during diffusion
export const COMPETITION_BETA   = 0.1      // lateral inhibition — prevents hub monopoly

// Reinforcement (Δw = α · coactivation · utility · (1-w))
export const BASE_ALPHA         = 0.2      // base learning rate

// Decay (w ← w · (1 - λ))
export const STRUCTURAL_DECAY   = 0.05     // per session boundary
export const MIN_EDGE_WEIGHT    = 0.001    // deletion floor

// Graph topology
export const MAX_DEGREE         = 50       // degree cap per node
export const CONCEPT_DEDUP_THRESHOLD = 0.85  // cosine threshold for concept reuse

// Concept extraction
export const MAX_CONCEPTS_PER_EVENT  = 8
export const MIN_CONCEPT_CHARS       = 3
export const CONCEPT_PROMOTE_AT      = 2   // occurrences before embedding fires
export const PMI_THRESHOLD           = Math.log(2)  // n-gram signal floor — pair must be 2× more likely than chance

// Persistence tiers
export const PERSISTENCE_HIGH   = 0.95    // identity, backbone
export const PERSISTENCE_MED    = 0.60    // stable facts
export const PERSISTENCE_LOW    = 0.10    // transient concepts, episodes

// Backbone — fixed identity concepts, always seeded at session open
export const BACKBONE_CONCEPTS  = [
  'user', 'liv', 'living-architecture',
  'f-memory', 'f-chat', 'deepseek',
  'living-memory', 'constitution'
] as const

// Stopwords — minimal, do not over-filter
export const STOPWORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for',
  'of','with','by','from','is','are','was','were','be','been',
  'has','have','had','do','does','did','will','would','can',
  'could','should','may','might','not','no','its','it','this',
  'that','these','those','i','you','we','they','he','she'
])

// Vital sign safe operating ranges
export const VITAL_RANGES = {
  activationEntropy:   { min: 1.5,  max: 4.0  },
  top1ActivationRatio: { min: 0.05, max: 0.30 },
  meanDegree:          { min: 2.0,  max: 30.0 },
  p95Degree:           { min: 5.0,  max: MAX_DEGREE },
  saturationRatio:     { min: 0.0,  max: 0.15 },
  identityDensity:     { min: 0.4,  max: 0.95 },
  utilityCorrelation:  { min: 0.3,  max: 1.0  },
} as const
