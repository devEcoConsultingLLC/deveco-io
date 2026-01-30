<script setup lang="ts">
defineProps<{
  animation?: 'breathe' | 'pulse' | 'glow' | 'float';
  size?: 'sm' | 'md' | 'lg';
}>();

const sizeClasses = {
  sm: 'h-12 w-[41px]',
  md: 'h-20 w-[69px]',
  lg: 'h-24 w-[83px]',
};
</script>

<template>
  <svg
    :class="[
      sizeClasses[size || 'md'],
      animation === 'breathe' ? 'anim-breathe' : '',
      animation === 'glow' ? 'anim-glow' : '',
      animation === 'float' ? 'anim-float' : '',
      animation === 'pulse' ? 'anim-pulse' : '',
    ]"
    viewBox="0 0 100 115"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="translate(4, 8) scale(0.18)">
      <path
        fill="#ffffff"
        fill-rule="evenodd"
        d="M262,22 L492.8,155.25 L492.8,421.75 L262,555 L31.2,421.75 L31.2,155.25 Z M262,84 L439.1,186.25 L439.1,390.75 L262,493 L84.9,390.75 L84.9,186.25 Z"
      />
      <polygon
        points="211.11,146.74 255.28,172.24 255.28,223.24 211.11,248.74 166.94,223.24 166.94,172.24"
        fill="#e85a85"
      />
      <polygon
        points="315.85,146.72 360.01,172.22 360.01,223.22 315.85,248.72 271.68,223.22 271.68,172.22"
        fill="#f4c84b"
      />
      <polygon
        points="159.06,237.57 203.23,263.07 203.23,314.07 159.06,339.57 114.9,314.07 114.9,263.07"
        fill="#6ab4a8"
      />
      <polygon
        points="263.14,237.57 307.31,263.07 307.31,314.07 263.14,339.57 218.98,314.07 218.98,263.07"
        fill="#ffffff"
      />
      <polygon
        points="367.56,237.57 411.73,263.07 411.73,314.07 367.56,339.57 323.39,314.07 323.39,263.07"
        fill="#5bc5e8"
      />
      <polygon
        points="211.13,327.96 255.3,353.46 255.3,404.46 211.13,429.96 166.96,404.46 166.96,353.46"
        fill="#4db3a8"
      />
      <polygon
        points="315.84,327.95 360.01,353.45 360.01,404.45 315.84,429.95 271.67,404.45 271.67,353.45"
        fill="#ffffff"
      />
    </g>
  </svg>
</template>

<style scoped>
/* Breathe Animation — smooth scale (exact from mockup) */
.anim-breathe {
  animation: breathe 3s ease-in-out infinite;
}
@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

/* Pulse Animation — sequential opacity (exact from mockup) */
.anim-pulse :deep(polygon) {
  animation: pulseFade 2.4s ease-in-out infinite;
}
.anim-pulse :deep(polygon:nth-child(2)) { animation-delay: 0s; }
.anim-pulse :deep(polygon:nth-child(3)) { animation-delay: 0.3s; }
.anim-pulse :deep(polygon:nth-child(4)) { animation-delay: 0.6s; }
.anim-pulse :deep(polygon:nth-child(5)) { animation-delay: 0.9s; }
.anim-pulse :deep(polygon:nth-child(6)) { animation-delay: 1.2s; }
.anim-pulse :deep(polygon:nth-child(7)) { animation-delay: 0.3s; }
.anim-pulse :deep(polygon:nth-child(8)) { animation-delay: 0.6s; }
@keyframes pulseFade {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Glow Animation — soft glow pulse (exact from mockup) */
.anim-glow {
  animation: glowPulse 2s ease-in-out infinite;
  filter: drop-shadow(0 0 0 transparent);
}
@keyframes glowPulse {
  0%, 100% { filter: drop-shadow(0 0 4px rgba(0,231,173,0.2)); }
  50% { filter: drop-shadow(0 0 20px rgba(0,231,173,0.6)) drop-shadow(0 0 40px rgba(0,231,173,0.3)); }
}

/* Float Animation — gentle hover (exact from mockup) */
.anim-float {
  animation: floatUp 3s ease-in-out infinite;
}
@keyframes floatUp {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
</style>
