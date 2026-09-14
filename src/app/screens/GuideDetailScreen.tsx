import { AlertTriangle, ArrowLeft, BookMarked, ExternalLink, Phone } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { guideById } from '@/data/guides';
import { GUIDE_CATEGORY_LABELS } from '../lib/labels';

/** Detail rady. Naléhavé rady mají červený rám a tísňové číslo nahoře. */
export function GuideDetailScreen(): ReactNode {
  const { id } = useParams();
  const guide = id === undefined ? undefined : guideById.get(id);
  if (guide === undefined) return <Navigate to="/rady" replace />;
  const urgent = guide.urgent === true;

  return (
    <article className="flex flex-col gap-5">
      <Link
        to="/rady"
        data-testid="zpet-na-rady"
        className="inline-flex min-h-touch items-center gap-1 self-start text-sm font-medium text-accent"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Zpět na rady
      </Link>

      <header className="flex flex-col gap-2">
        <span className="inline-block self-start rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-semibold text-accent">
          {GUIDE_CATEGORY_LABELS[guide.category]}
        </span>
        <h1 className="text-2xl font-bold leading-tight">{guide.titleCz}</h1>
        <p className="text-sm leading-relaxed text-muted">{guide.summary}</p>
      </header>

      {urgent && (
        <a
          href="tel:155"
          className="flex items-center gap-3 rounded-2xl border-2 border-risk/40 bg-risk-soft p-4"
        >
          <Phone aria-hidden="true" className="h-6 w-6 shrink-0 text-risk" />
          <span>
            <span className="block text-base font-bold text-risk">Zdravotnická záchranná služba 155</span>
            <span className="block text-xs text-ink/75">
              Volej při neúčinném kašli, bezvědomí nebo po zásahu stlačením.
            </span>
          </span>
        </a>
      )}

      {guide.keyPoints.length > 0 && (
        <section
          data-testid="klicove-body"
          className={`rounded-2xl border p-4 shadow-soft ${
            urgent ? 'border-risk/30 bg-surface' : 'border-line bg-surface'
          }`}
        >
          <h2 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
            {urgent && <AlertTriangle aria-hidden="true" className="h-4 w-4 text-risk" />}
            Nejdůležitější
          </h2>
          <ul className="mt-2 flex flex-col gap-2">
            {guide.keyPoints.map((point) => (
              <li key={point} className="flex gap-2 text-sm leading-snug">
                <span
                  aria-hidden="true"
                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${urgent ? 'bg-risk' : 'bg-accent'}`}
                />
                <span className="font-medium">{point}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {guide.sections.map((section) => (
        <section key={section.heading} className="flex flex-col gap-2">
          <h2 className="text-base font-bold">{section.heading}</h2>
          {section.asList === true ? (
            <ul className="flex flex-col gap-2">
              {section.body.map((line) => (
                <li
                  key={line}
                  className="rounded-xl border border-line bg-surface px-3 py-2.5 text-sm leading-relaxed shadow-soft"
                >
                  {line}
                </li>
              ))}
            </ul>
          ) : (
            section.body.map((line) => (
              <p key={line} className="text-sm leading-relaxed">
                {line}
              </p>
            ))
          )}
        </section>
      ))}

      <section className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4 shadow-soft">
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-muted">Zdroje</h2>
        <ul className="flex flex-col gap-2">
          {guide.sources.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-start gap-2 text-sm text-accent underline-offset-2 hover:underline"
              >
                <ExternalLink aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {source.org}: {source.title}
                  <span className="block text-xs text-muted">
                    ověřeno {source.accessedAt}, tier {source.tier}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        {guide.literature !== undefined && guide.literature.length > 0 && (
          <>
            <h3 className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
              Literatura
            </h3>
            <ul className="flex flex-col gap-1">
              {guide.literature.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted">
                  <BookMarked aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <p className="rounded-2xl bg-surface/60 px-4 py-3 text-xs leading-relaxed text-muted">
        Tenhle text nenahrazuje kurz první pomoci ani pediatra. Konkrétní postup u tvého dítěte
        patří dětskému lékaři.
      </p>
    </article>
  );
}
