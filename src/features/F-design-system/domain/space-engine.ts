// @liv-standard v1.3
// [F-design-system/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-design-system
// layer:      R1
// wires-in:   none
// wires-out:  (internal — consumed by F-design-system barrel)
// deps:
//   R0 ../config/board
// validated:  pending
// note:       Pure function. 24 CSS custom properties: spacing, dimensions, radii, component sizes.

import {
  SPACE_UNIT,
  RADIUS_BUBBLE,
  COL_WIDTH, COL_WIDTH_LG, LOGIN_WIDTH,
  DOT_SIZE, SPINNER_SIZE, SPINNER_SIZE_SM, DASH_MIN_H, PANEL_WIDTH,
} from '../config/board'

export function deriveSpace(): Record<string, string> {
  const u05 = SPACE_UNIT * 0.5
  const u1  = SPACE_UNIT * 1
  const u15 = SPACE_UNIT * 1.5
  const u2  = SPACE_UNIT * 2
  const u25 = SPACE_UNIT * 2.5
  const u3  = SPACE_UNIT * 3
  const u4  = SPACE_UNIT * 4
  const u5  = SPACE_UNIT * 5
  const u55 = SPACE_UNIT * 5.5
  const u6  = SPACE_UNIT * 6

  const headerH  = u6
  const inputH   = u55
  const inputHSm = u4

  return {
    '--u05':            u05 + 'px',
    '--u1':             u1 + 'px',
    '--u15':            u15 + 'px',
    '--u2':             u2 + 'px',
    '--u25':            u25 + 'px',
    '--u3':             u3 + 'px',
    '--u4':             u4 + 'px',
    '--u5':             u5 + 'px',
    '--u55':            u55 + 'px',
    '--u6':             u6 + 'px',
    '--header-h':       headerH + 'px',
    '--input-h':        inputH + 'px',
    '--input-h-sm':     inputHSm + 'px',
    '--radius-pill':    (inputH / 2) + 'px',
    '--radius-surface': u15 + 'px',
    '--radius-bubble':  RADIUS_BUBBLE + 'px',
    '--col-width':      COL_WIDTH + 'px',
    '--col-width-lg':   COL_WIDTH_LG + 'px',
    '--login-width':    LOGIN_WIDTH + 'px',
    '--dot-size':       DOT_SIZE + 'px',
    '--spinner-size':   SPINNER_SIZE + 'px',
    '--spinner-size-sm': SPINNER_SIZE_SM + 'px',
    '--dash-min-h':     DASH_MIN_H + 'px',
    '--panel-width':    PANEL_WIDTH + 'px',
  }
}
