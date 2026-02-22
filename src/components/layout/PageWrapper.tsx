import patternBg from '@/assets/pattern-bg.jpg';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const PageWrapper = ({ children, className = '' }: PageWrapperProps) => {
  return (
    <div
      className={`min-h-[100dvh] relative ${className}`}
      style={{
        backgroundColor: 'hsl(var(--background))',
      }}
    >
      {/* Pattern background with seamless blending */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${patternBg})`,
          backgroundSize: '100% auto',
          backgroundPosition: 'center top',
          backgroundRepeat: 'repeat-y',
          backgroundAttachment: 'scroll',
          maskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          maskSize: '100% 100vh',
          maskRepeat: 'repeat-y',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 90%, black 100%)',
          WebkitMaskSize: '100% 100%',
          opacity: 0.92,
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
