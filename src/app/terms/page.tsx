// @liv-standard v1.3
// [app/R4]
// Built with LIV · livai.dev
import Link from 'next/link'
import { Brand, Label, Text } from '@/features/F-design-system/contract/primitives'

export default function TermsPage() {
  return (
    <div className="page visible" data-page="terms">
      <main className="account-main">
        <div className="col account-content">

          <div className="account-section">
            <Link href="/" className="btn-text btn-text-accent" style={{ textDecoration: 'none' }}>
              ← BACK
            </Link>
          </div>

          <div className="account-section">
            <Brand variant="header" />
          </div>

          <div className="account-section">
            <Label>TERMS & PRIVACY</Label>
          </div>

          <div className="account-section">
            <Text role="body">Your data stays on our server. We don't sell it.</Text>
          </div>

          <div className="account-section">
            <Text role="body">Per-user memory — your memory graph is yours alone.</Text>
          </div>

          <div className="account-section">
            <Text role="body">API keys are encrypted at rest.</Text>
          </div>

          <div className="account-section">
            <Text role="body">LIV is in active development. Features may change.</Text>
          </div>

          <div className="account-section">
            <Text role="body">Feedback: use the feedback button in your account panel.</Text>
          </div>

        </div>
      </main>
    </div>
  )
}
