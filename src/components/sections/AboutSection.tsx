import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';

const AboutSection = () => {
  return (
    <section id="about" className="section-padding relative z-10">
      <div className="container-custom glass-card rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16">
        <div className="grid lg:grid-cols-[5fr_7fr] gap-8 md:gap-12 lg:gap-16 items-start">
          {/* Image Side */}
          <div className="relative mx-auto lg:mx-0 max-w-sm lg:max-w-none render-stable">
            
            <div className="aspect-[3/4] overflow-hidden rounded-2xl render-stable-media">
              <OptimizedImage
                alt="Сергій Миргородський — психолог"
                className="w-full h-full object-cover render-stable-media"
                height={1200}
                src="/lovable-uploads/acde4692-2fdc-4ae7-aa62-bef757163856.jpg"
                width={900}
              />
            </div>
          </div>

          {/* Content Side */}
          <div className="flex flex-col render-stable">
            
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
              Привіт, мене звуть Сергій
            </h2>
            <div className="space-y-3 md:space-y-4 text-muted-foreground leading-relaxed text-sm md:text-base render-stable-text">
              <p>
                Я захопився психологією ще в 10 років. Вже тоді сидів із зошитом і психологічними підручниками та намагався розібратись у своїх питаннях — чому ми робимо те, що робимо, що нами рухає, як все влаштовано і що насправді працює. Роками шукав підходи та інструменти, які дають результат, а не просто красиво звучать.
              </p>
              <p>
                Сьогодні я працюю в інтегративному підході — який поєднує когнітивно-поведінкову терапію, схема-терапію, IFS, юнгіанський аналіз і транзактний аналіз. Для мене це найбільш ефективний набір інструментів. Мені важливо, щоб ти побачив цілу картину: як ти думаєш, чому реагуєш саме так, і що з цим робити далі.
              </p>
              <p>
                Мій головний принцип — я працюю на те, щоб ти більше не потребував терапевта. Щоб після нашої роботи ти мав інструменти, розуміння і внутрішню опору, аби справлятися з більшістю ситуацій самостійно. Я не хочу, щоб ти приходив до мене роками. Я хочу, щоб ти навчився бути психологом для себе сам. 
              </p>
              

              
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 mt-6 md:mt-8">
              <div className="bg-card/80 border border-border rounded-xl p-4 md:p-5 text-center">
                <p className="font-display text-2xl md:text-3xl font-bold text-secondary">5+</p>
                <p className="text-muted-foreground text-xs md:text-sm mt-1">років практики</p>
              </div>
              <div className="bg-card/80 border border-border rounded-xl p-4 md:p-5 text-center">
                <p className="font-display text-2xl md:text-3xl font-bold text-secondary">3500+</p>
                <p className="text-muted-foreground text-xs md:text-sm mt-1">проведених сесій</p>
              </div>
            </div>

            <div className="mt-6 md:mt-8 render-stable">
              
              <Button variant="cta" size="lg" asChild>
                <a href="#help" className="inline-flex items-center gap-2">
                  Більше
                  <ArrowDown size={18} />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default AboutSection;