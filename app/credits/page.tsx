import type { Metadata } from "next";
import Link from "next/link";
import { AppLogo } from "@/components/branding/app-logo";
import { Icon } from "@/components/ui/icon";
import { ASSET_CREDITS, DESIGN_CREDIT } from "@/config/credits";
import "./credits.css";

export const metadata: Metadata = {
  title: "Credits & attribution — Nova AI",
  description:
    "Original design credit to Sheikh Raihan UI, source links, asset provenance and font license information for Nova AI.",
};

export default function CreditsPage() {
  return (
    <main className="credits-page">
      <header className="credits-header">
        <Link className="credits-brand" href="/" aria-label="Nova home">
          <AppLogo size={36} alt="" />
          <span>Nova</span>
        </Link>
        <nav aria-label="Credits page navigation">
          <Link href="/">
            Back to chat <Icon name="arrow" size={16} />
          </Link>
          <Link href="/design-system">
            Design system <Icon name="grid" size={16} />
          </Link>
        </nav>
      </header>

      <div className="credits-intro">
        <h1>Credits & attribution</h1>
        <p>
          The original design, the implementation, and the sources behind this
          interface.
        </p>
      </div>

      <section
        className="credits-source"
        aria-labelledby="original-design-heading"
      >
        <span className="credits-source-label">Original UI design</span>
        <h2 id="original-design-heading">{DESIGN_CREDIT.title}</h2>
        <p className="credits-designer">
          By{" "}
          <a
            href={DESIGN_CREDIT.designerUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {DESIGN_CREDIT.designer}
            <Icon name="diagonal" size={15} />
          </a>
        </p>
        <p>
          This frontend recreates and adapts the linked visual design. Original
          visual-design credit belongs to {DESIGN_CREDIT.designer}.
        </p>
        <a
          className="credits-source-link"
          href={DESIGN_CREDIT.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          View original on Dribbble <Icon name="diagonal" size={16} />
        </a>
      </section>

      <section
        className="credits-section"
        aria-labelledby="implementation-heading"
      >
        <h2 id="implementation-heading">Frontend implementation</h2>
        <p>
          The reusable components, responsive layouts, chat outline, seeded API
          demo and interactive behavior are implemented in the{" "}
          <a
            href={DESIGN_CREDIT.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Nova repository
          </a>
          . The original visual design is credited separately above.
        </p>
        <p>
          No affiliation with or endorsement by the designer or Dribbble is
          claimed.
        </p>
      </section>

      <section className="credits-section" aria-labelledby="assets-heading">
        <h2 id="assets-heading">Assets & sources</h2>
        <dl className="credits-assets">
          {ASSET_CREDITS.map((asset) => (
            <div key={asset.name}>
              <dt>{asset.name}</dt>
              <dd>
                <p>{asset.source}</p>
                <p className="credits-asset-note">{asset.note}</p>
                <details>
                  <summary>Files covered</summary>
                  <ul>
                    {asset.files.map((file) => (
                      <li key={file}>
                        <code>{file}</code>
                      </li>
                    ))}
                  </ul>
                </details>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="credits-section" aria-labelledby="fonts-heading">
        <h2 id="fonts-heading">Typography</h2>
        <p>
          Geist Sans and Geist Mono are by{" "}
          <a
            href="https://vercel.com/font"
            target="_blank"
            rel="noopener noreferrer"
          >
            The Geist Project Authors / Vercel
          </a>{" "}
          and are distributed under the SIL Open Font License 1.1. The font
          copyright and full license are included with this project.
        </p>
        <a href="/licenses/geist-OFL.txt">
          Read the bundled font license <Icon name="arrow" size={15} />
        </a>
      </section>

      <section
        className="credits-permission"
        aria-labelledby="permission-heading"
      >
        <h2 id="permission-heading">Attribution & permission</h2>
        <p>
          Attribution alone does not establish reuse rights. This repository
          does not document permission or a reuse license for the reference
          design or reference-derived imagery.
        </p>
        <p>
          Before redistributing these assets or using the design commercially,
          confirm the applicable licenses or obtain permission from the relevant
          rights holders. A demonstration or educational purpose alone does not
          establish that permission.
        </p>
        <p>
          These credits do not relicense third-party work. See{" "}
          <a
            href={DESIGN_CREDIT.termsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Dribbble’s terms
          </a>{" "}
          and the original designer’s usage terms.
        </p>
      </section>
    </main>
  );
}
