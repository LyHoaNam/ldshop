import { useEffect } from 'react';
import { CONFETTI_COLORS } from '../../config/constants';

interface ConfettiProps {
  count: number;
  duration: number;
}

export function Confetti({ count, duration }: ConfettiProps) {
  useEffect(() => {
    const container = document.createElement('div');
    container.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
    document.body.appendChild(container);

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      const size = 6 + Math.random() * 8;
      const x = Math.random() * 100;
      const delay = Math.random() * 1000;
      el.style.cssText = `
        position:absolute;
        width:${size}px;height:${size}px;
        background:${color};
        left:${x}%;top:-10px;
        border-radius:${Math.random() > 0.5 ? '50%' : '0'};
        animation:confettiFall ${1500 + Math.random() * 1500}ms ${delay}ms ease-in forwards;
        transform:rotate(${Math.random() * 360}deg);
      `;
      container.appendChild(el);
    }

    const style = document.createElement('style');
    style.textContent = `
      @keyframes confettiFall {
        to { transform: translateY(100vh) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    const timer = setTimeout(() => {
      container.remove();
      style.remove();
    }, duration + 2500);

    return () => {
      clearTimeout(timer);
      container.remove();
      style.remove();
    };
  }, [count, duration]);

  return null;
}
