import { Section } from "@/components/layout/Section/Section";
import styles from "./page.module.scss";

export default function DesignSystemPage() {
  return (
    <div className={styles.page}>
      <Section
        as="header"
        className={styles.hero}
        containerClassName={styles.heroInner}
      >
        <div>
          <p className={styles.heroEyebrow}>Design system foundation</p>
          <h1 className={styles.heroTitle}>Design System Preview</h1>
        </div>
        <p className={styles.heroCopy}>
          Page de présentation et de contrôle pour valider les fondations Figma,
          leur adaptation Next.js, les sections pleine largeur et les gouttières
          responsive avant l’intégration des composants réels.
        </p>
        <div className={styles.metrics} aria-label="Layout metrics">
          <article className={styles.metric}>
            <span className={styles.tokenLabel}>Mobile grid</span>
            <strong className={styles.metricValue}>4 col</strong>
          </article>
          <article className={styles.metric}>
            <span className={styles.tokenLabel}>Tablet grid</span>
            <strong className={styles.metricValue}>8 col</strong>
          </article>
          <article className={styles.metric}>
            <span className={styles.tokenLabel}>Desktop grid</span>
            <strong className={styles.metricValue}>12 col</strong>
          </article>
        </div>
      </Section>

      <main>
        <Section containerClassName={styles.mainInner}>
          <div className={styles.blockGrid}>
            <article className={styles.layoutBlock}>
              <span className={styles.blockLabel}>Header block</span>
              <h2 className={styles.blockTitle}>Full viewport border</h2>
              <p className={styles.blockText}>
                La bordure appartient à la section et s’étend sur toute la
                largeur du viewport.
              </p>
            </article>
            <article className={styles.layoutBlock}>
              <span className={styles.blockLabel}>Main block</span>
              <h2 className={styles.blockTitle}>Constrained content</h2>
              <p className={styles.blockText}>
                Le contenu est centré dans un container plafonné à 1280px, avec
                des gouttières pilotées par les tokens.
              </p>
            </article>
          </div>
        </Section>

        <Section containerClassName={styles.mainInner}>
          <div className={styles.tokenGrid}>
            <article className={styles.tokenCard}>
              <span className={styles.tokenLabel}>mobile</span>
              <code className={styles.tokenValue}>4 col / 16px margin</code>
            </article>
            <article className={styles.tokenCard}>
              <span className={styles.tokenLabel}>tablet</span>
              <code className={styles.tokenValue}>8 col / 32px margin</code>
            </article>
            <article className={styles.tokenCard}>
              <span className={styles.tokenLabel}>desktop</span>
              <code className={styles.tokenValue}>12 col / 80px margin</code>
            </article>
          </div>
        </Section>
      </main>

      <Section
        as="footer"
        className={styles.footer}
        containerClassName={styles.footerInner}
      >
        <p>Footer block — validation du rythme vertical et des limites.</p>
      </Section>
    </div>
  );
}
