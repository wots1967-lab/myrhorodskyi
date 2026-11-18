import { GraduationCap } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import { credentialGroups } from '@/data/credentials';

const CredentialsSection = () => {
  const { ref, revealed } = useReveal();
  const groups = credentialGroups.filter((group) => group.items.length > 0);

  // Поки дані не заповнені, блок не показується.
  if (groups.length === 0) return null;

  return (
    <section id="credentials" className="section-padding relative z-10">
      <div className="container-custom glass-card rounded-3xl p-8 md:p-12 lg:p-16">
        <div ref={ref} className={`reveal${revealed ? ' revealed' : ''} text-center mb-10 md:mb-14`}>
          <GraduationCap className="w-9 h-9 text-secondary mx-auto mb-4" strokeWidth={1.5} />
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Освіта і підготовка
          </h2>
        </div>
        <div
          className={`reveal${revealed ? ' revealed' : ''} grid gap-5 md:gap-6 ${
            groups.length === 1 ? 'max-w-2xl mx-auto' : groups.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-3'
          }`}
          style={{ transitionDelay: '120ms' }}
        >
          {groups.map((group) => (
            <div key={group.title} className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="text-secondary font-medium tracking-widest uppercase text-sm mb-4">{group.title}</h3>
              <ul className="space-y-4">
                {group.items.map((item) => (
                  <li key={item.title}>
                    <p className="font-display font-semibold text-foreground leading-snug">{item.title}</p>
                    {item.details && <p className="text-muted-foreground text-sm mt-1">{item.details}</p>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CredentialsSection;
