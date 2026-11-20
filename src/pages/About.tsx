import { Link } from 'react-router-dom';

import { Meta } from '@/components/ui';
import { contact } from '@/config';

function About() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10 py-2 sm:gap-14 sm:py-6">
      <Meta
        title="About"
        description="Michael Montanaro: computer engineer, teacher, and builder of software people can understand and use."
      />

      <header className="flex flex-col gap-5 border-l border-accent/40 pl-5 sm:gap-6 sm:pl-8">
        <p className="text-sm text-muted">About</p>
        <h1 className="font-display text-[2.5rem] font-medium leading-[1.1] tracking-[-0.015em] sm:text-5xl">
          Michael Montanaro
        </h1>
        <p className="max-w-md font-display text-2xl leading-8 text-ink sm:text-[1.75rem] sm:leading-9">
          I build software and help people make sense of it.
        </p>
        <p className="max-w-lg text-base leading-7 text-muted">
          Computer engineer, teacher, and former Division I athlete. My work moves between
          engineering, customers, and the people who use what we build.
        </p>
      </header>

      <section
        aria-label="Current work and résumé"
        className="flex flex-col gap-5 border-y border-line py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-6"
      >
        <div className="flex flex-col gap-1 text-sm">
          <p className="text-ink">Member of Technical Staff</p>
          <a
            href="https://blitzy.com"
            className="focus-ring w-fit rounded-sm text-muted underline decoration-line-strong underline-offset-4 hover:text-accent"
          >
            Blitzy
          </a>
        </div>
        <nav
          aria-label="Explore my work"
          className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm"
        >
          <Link
            to="/projects"
            className="focus-ring inline-flex min-h-11 items-center rounded-sm text-muted hover:text-accent"
          >
            Projects
          </Link>
          <Link
            to="/writing"
            className="focus-ring inline-flex min-h-11 items-center rounded-sm text-muted hover:text-accent"
          >
            Writing
          </Link>
          <a
            href="/library/Resume-MichaelMontanaro.pdf"
            className="focus-ring inline-flex min-h-11 items-center rounded-sm text-accent underline decoration-accent/35 underline-offset-4 hover:decoration-accent"
          >
            Résumé (PDF)
          </a>
        </nav>
      </section>

      <div className="divide-y divide-line">
        <details className="group">
          <summary className="focus-ring flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 rounded-sm py-4 text-base [&::-webkit-details-marker]:hidden">
            <h2 className="flex w-full items-center justify-between gap-6 font-normal">
              How I work
              <span
                aria-hidden="true"
                className="text-xl font-light text-muted motion-safe:transition-transform group-open:rotate-45"
              >
                +
              </span>
            </h2>
          </summary>
          <div className="flex max-w-lg flex-col gap-4 pb-7 pt-2 text-base leading-7 text-muted">
            <p>
              Most of my work starts with a problem described in someone else’s terms. I listen,
              work out how the pieces fit, and build something people can use.
            </p>
            <p>
              I work across software, enterprise deployments, developer experience, and technical
              education. What we learn becomes tools, demos, documentation, or training that a team
              can carry forward.
            </p>
            <p>
              Teaching has shaped that approach as much as engineering. An explanation is useful
              when someone can take the next step on their own.
            </p>
          </div>
        </details>

        <details className="group">
          <summary className="focus-ring flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 rounded-sm py-4 text-base [&::-webkit-details-marker]:hidden">
            <h2 className="flex w-full items-center justify-between gap-6 font-normal">
              Outside work
              <span
                aria-hidden="true"
                className="text-xl font-light text-muted motion-safe:transition-transform group-open:rotate-45"
              >
                +
              </span>
            </h2>
          </summary>
          <div className="flex max-w-lg flex-col gap-4 pb-7 pt-2 text-base leading-7 text-muted">
            <p>
              I played Division I soccer at Northeastern and still make time for the game. Hiking,
              running, lifting, books, and live music are part of the rest of the week.
            </p>
            <p>
              I speak English, Spanish, and Italian, and I’m learning my dad’s dialect from
              Monopoli.
            </p>
            <p className="text-sm">English (native) · Español (C1) · Italiano (B1)</p>
          </div>
        </details>
      </div>

      <p className="max-w-lg text-sm leading-7 text-muted">
        I like conversations that cross fields.{' '}
        <a
          href={`mailto:${contact.email}`}
          className="focus-ring rounded-sm text-accent underline decoration-accent/35 underline-offset-4 hover:decoration-accent"
        >
          Say hello
        </a>
        .
      </p>
    </div>
  );
}

export default About;
