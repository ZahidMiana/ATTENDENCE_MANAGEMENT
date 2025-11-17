import { useEffect, useMemo } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export function ParticleNetwork() {
  useEffect(() => {
    loadSlim(undefined as any);
  }, []);

  const options = useMemo(() => ({
        background: {
          color: {
            value: 'transparent',
          },
        },
        fpsLimit: 60,
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              width: 1920,
              height: 1080,
            },
          },
          color: {
            value: ['#00f5ff', '#bf40bf', '#00ff88'],
          },
          shape: {
            type: 'circle',
          },
          opacity: {
            value: { min: 0.3, max: 0.8 },
            animation: {
              enable: true,
              speed: 0.5,
              sync: false,
            },
          },
          size: {
            value: { min: 1, max: 3 },
            animation: {
              enable: true,
              speed: 2,
              sync: false,
            },
          },
          links: {
            enable: true,
            distance: 150,
            color: '#00f5ff',
            opacity: 0.3,
            width: 1,
            triangles: {
              enable: true,
              opacity: 0.05,
            },
          },
          move: {
            enable: true,
            speed: 1,
            direction: 'none' as const,
            random: true,
            straight: false,
            outModes: {
              default: 'bounce' as const,
            },
          },
        },
        interactivity: {
          detectsOn: 'canvas' as const,
          events: {
            onHover: {
              enable: true,
              mode: 'grab',
            },
            onClick: {
              enable: true,
              mode: 'push',
            },
            resize: {
              enable: true,
            },
          },
          modes: {
            grab: {
              distance: 200,
              links: {
                opacity: 0.5,
                color: '#bf40bf',
              },
            },
            push: {
              quantity: 4,
            },
          },
        },
        detectRetina: true,
      }), []);

  return (
    <Particles
      id="tsparticles"
      options={options}
      className="absolute inset-0 -z-10"
    />
  );
}
