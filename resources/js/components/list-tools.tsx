import type { JSX } from 'react';
import { PiFileArrowDown, PiGitMerge, PiImage, PiScissors, PiSignature } from 'react-icons/pi';

export default function ListTools() {
  interface Tool {
    name: string;
    icon: JSX.Element;
    slug: string;
    enable: boolean;
  }

  const tools: Tool[] = [
    { name: 'Sign PDF', icon: <PiSignature />, slug: 'sign-pdf', enable: true },
    { name: 'Merge PDF', icon: <PiGitMerge />, slug: 'merge-pdf', enable: false },
    { name: 'Split PDF', icon: <PiScissors />, slug: 'split-pdf', enable: false },
    { name: 'Compress PDF', icon: <PiFileArrowDown />, slug: 'compress-pdf', enable: false },
    { name: 'Convert to PNG', icon: <PiImage />, slug: 'convert-to-png', enable: true },
    { name: 'Convert to JPG', icon: <PiImage />, slug: 'convert-to-jpg', enable: false },
  ];

  const cols = { mobile: 2, desktop: 3 };

  return (
    <div className="relative mx-auto my-6 max-w-screen-xl border-t border-neutral-200 lg:border-x dark:border-neutral-700">
      <div className="grid grid-cols-2 md:grid-cols-3">
        {tools.map((tool, index) => {
          const isLastColMobile = (index + 1) % cols.mobile === 0;
          const isLastColDesktop = (index + 1) % cols.desktop === 0;

          const showCrossMobile = index % cols.mobile !== 0;
          const showCrossDesktop = index % cols.desktop !== 0;

          const lastRowStartMobile = tools.length - (tools.length % cols.mobile || cols.mobile);
          const lastRowStartDesktop = tools.length - (tools.length % cols.desktop || cols.desktop);
          const isLastRowMobile = index >= lastRowStartMobile;
          const isLastRowDesktop = index >= lastRowStartDesktop;

          const disabledStyle = !tool.enable
            ? {
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.05) 4px, rgba(0,0,0,0.05) 5px)',
              }
            : {};

          return (
            <a
              key={tool.slug}
              className={`group relative flex flex-col items-center gap-2 border-b border-neutral-200 p-4 py-6 md:px-3 lg:p-8 dark:border-neutral-700 ${isLastColMobile ? '' : 'border-r'} ${isLastColDesktop ? 'md:border-r-0' : 'md:border-r'} ${!tool.enable ? 'pointer-events-none cursor-not-allowed opacity-50' : ''}`}
              href={tool.enable ? `/tools/${tool.slug}` : undefined}
              aria-disabled={!tool.enable}
              style={disabledStyle}
            >
              <span className="text-2xl">{tool.icon}</span>
              <p className="text-lg font-medium">{tool.name}</p>
              {!tool.enable && <span className="text-xs text-neutral-500">Coming soon</span>}

              {/* Decorative cross element - mobile (2 cols) - top */}
              {showCrossMobile && (
                <div className="pointer-events-none absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 md:hidden">
                  <div className="absolute top-1/2 left-1/2 h-px w-6 -translate-x-1/2 -translate-y-1/2 bg-[#A3A3A3]" />
                  <div className="absolute top-1/2 left-1/2 h-6 w-px -translate-x-1/2 -translate-y-1/2 bg-[#A3A3A3]" />
                </div>
              )}

              {/* Decorative cross element - mobile (2 cols) - bottom (last row only) */}
              {showCrossMobile && isLastRowMobile && (
                <div className="pointer-events-none absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 md:hidden">
                  <div className="absolute top-1/2 left-1/2 h-px w-6 -translate-x-1/2 -translate-y-1/2 bg-[#A3A3A3]" />
                  <div className="absolute top-1/2 left-1/2 h-6 w-px -translate-x-1/2 -translate-y-1/2 bg-[#A3A3A3]" />
                </div>
              )}

              {/* Decorative cross element - desktop (3 cols) - top */}
              {showCrossDesktop && (
                <div className="pointer-events-none absolute top-0 left-0 hidden -translate-x-1/2 -translate-y-1/2 md:block">
                  <div className="absolute top-1/2 left-1/2 h-px w-8 -translate-x-1/2 -translate-y-1/2 bg-[#A3A3A3]" />
                  <div className="absolute top-1/2 left-1/2 h-8 w-px -translate-x-1/2 -translate-y-1/2 bg-[#A3A3A3]" />
                </div>
              )}

              {/* Decorative cross element - desktop (3 cols) - bottom (last row only) */}
              {showCrossDesktop && isLastRowDesktop && (
                <div className="pointer-events-none absolute bottom-0 left-0 hidden -translate-x-1/2 translate-y-1/2 md:block">
                  <div className="absolute top-1/2 left-1/2 h-px w-8 -translate-x-1/2 -translate-y-1/2 bg-[#A3A3A3]" />
                  <div className="absolute top-1/2 left-1/2 h-8 w-px -translate-x-1/2 -translate-y-1/2 bg-[#A3A3A3]" />
                </div>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
