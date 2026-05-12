// @liv-standard v1.3
// [F-output/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-output
// category:   Modality
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  OUTPUT_CONST  →  F-output/R1, F-output/R4
// deps:       none
// validated:  2026-03-12

export const OUTPUT_CONST = {
  // Zip assembly limits
  MAX_FILES:          2_000,         // hard cap — beyond this, something went wrong upstream
  MAX_FILE_BYTES:     5_000_000,     // 5 MB per file — R1 rejects single files over this
  MAX_TOTAL_BYTES:    200_000_000,   // 200 MB total zip payload

  // Push limits
  MAX_PUSH_FILES:     1_000,         // GitHub API tree limit per commit
  COMMIT_MSG_MAX:     72,            // conventional commit subject line limit

  // Supported push venues — venue-agnostic, detected from remoteUrl pattern
  VENUE_GITHUB:       'github'  as const,
  VENUE_GITLAB:       'gitlab'  as const,
  VENUE_GENERIC:      'generic' as const,

  // HTTP push — GitHub Blob/Tree/Commit API
  GITHUB_API_BASE:    'https://api.github.com',
  GITLAB_API_BASE:    'https://gitlab.com/api/v4',

  // Output zip filename pattern
  ZIP_FILENAME_TPL:   (jobId: string) => `liv-output-${jobId.slice(0, 8)}.zip`,
} as const
