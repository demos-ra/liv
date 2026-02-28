// [F-memory/R0/C2] Memory domain types
// R0: zero dependencies. All shapes that flow through F-memory live here.

export type NodeType = 'concept' | 'episode'

export type MemNode = {
  id:          string
  type:        NodeType
  persistence: number       // [0,1] — modulates effective decay
  embedding?:  number[]     // concept only — stored once on promotion
  timestamp?:  number       // episode only — unix ms
}

export type MemEdge = {
  fromId:  string
  toId:    string
  weight:  number           // (0,1] — governed by unified physics
}

export type MemGraph = {
  nodes: Map<string, MemNode>
  edges: Map<string, MemEdge[]>  // nodeId → outgoing edges
}

export type MemEvent = {
  timestamp:         number
  concepts:          string[]     // concept node ids
  episodeId:         string
  incomingEmbedding: number[]    // mean embedding of this event's concepts
}

export type GraphMutation = {
  nodeUpserts: MemNode[]
  edgeUpserts: MemEdge[]
  edgeDeletes: string[]          // edge ids (fromId:toId) to remove
}

export type MemoryVitalSigns = {
  activationEntropy:    number
  top1ActivationRatio:  number
  meanDegree:           number
  p95Degree:            number
  saturationRatio:      number
  identityDensity:      number
  utilityCorrelation:   number
}
