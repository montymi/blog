import { Kicker, Meta, PageHeader } from '@/components/ui';
import { contact } from '@/config';
import { activities } from '@/content';

function About() {
  return (
    <div className="flex flex-col gap-12">
      <Meta title="About" description="Who Michael Montanaro is, and what fills his time." />
      <PageHeader kicker="Michael Montanaro" title="About">
        I build complex systems and then explain them, to clients, to engineers, and to whoever
        opens the repo next.
      </PageHeader>

      <div className="grid gap-10 sm:grid-cols-2">
        <section aria-label="As a programmer" className="flex flex-col gap-3">
          <Kicker as="h2">As a programmer</Kicker>
          <ul className="flex flex-col gap-2">
            <li>
              Trained as a computer engineer, so I tend to draw the system before I write the code.
            </li>
            <li>Backend by trade. The plumbing between services, noticed only when it leaks.</li>
            <li>I’ve taken enterprise work from the first sales call all the way to production.</li>
          </ul>
        </section>
        <section aria-label="As a teammate" className="flex flex-col gap-3">
          <Kicker as="h2">As a teammate</Kicker>
          <ul className="flex flex-col gap-2">
            <li>Taught high school. Nothing tests clarity like a room of teenagers.</li>
            <li>
              Been on every side of the table: engineer, support lead, consultant, PM, teacher.
            </li>
            <li>Docs-first. Anything explained twice gets written down.</li>
            <li>
              Played Division I college soccer. I was a teammate long before I was a programmer.
            </li>
          </ul>
        </section>
      </div>

      <section aria-label="Languages" className="flex flex-col gap-3">
        <Kicker as="h2">Languages</Kicker>
        <p>English (native) · Español (C1) · Italiano (B1)</p>
      </section>

      <section aria-label="Away from the keyboard" className="flex flex-col gap-4">
        <Kicker as="h2">Away from the keyboard</Kicker>
        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {activities.map((activity) => (
            <div key={activity.title} className="flex flex-col gap-1">
              <dt className="font-semibold">{activity.title}</dt>
              <dd className="text-sm text-muted">{activity.description}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="max-w-prose border-t border-line pt-6">
        Most technical language is harder than it needs to be, and clearing it up is how other
        people get room to build. I learn the most from outside my own field. If you work in a
        different one,{' '}
        <a href={`mailto:${contact.email}`} className="link">
          say hello
        </a>
        .
      </p>
    </div>
  );
}

export default About;
