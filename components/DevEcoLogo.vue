<script setup lang="ts">
defineProps<{
  variant?: 'light-bg' | 'dark-bg' | 'gradient-bg';
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}>();

const sizeMap: Record<string, string> = {
  sm: '32px',
  md: '48px',
  lg: '64px',
};
</script>

<template>
  <div class="deveco-logo">
    <svg
      :style="{ height: sizeMap[size || 'md'] }"
      viewBox="0 0 100 115"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(4, 8) scale(0.18)">
        <!-- Hexagon ring -->
        <path
          :fill="variant === 'light-bg' ? '#004e53' : '#ffffff'"
          fill-rule="evenodd"
          d="M262,22 L492.8,155.25 L492.8,421.75 L262,555 L31.2,421.75 L31.2,155.25 Z M262,84 L439.1,186.25 L439.1,390.75 L262,493 L84.9,390.75 L84.9,186.25 Z"
        />
        <!-- Top-left: Pink -->
        <polygon
          points="211.11,146.74 255.28,172.24 255.28,223.24 211.11,248.74 166.94,223.24 166.94,172.24"
          fill="#e85a85"
        />
        <!-- Top-right: Yellow -->
        <polygon
          points="315.85,146.72 360.01,172.22 360.01,223.22 315.85,248.72 271.68,223.22 271.68,172.22"
          fill="#f4c84b"
        />
        <!-- Middle-left: Teal Light -->
        <polygon
          points="159.06,237.57 203.23,263.07 203.23,314.07 159.06,339.57 114.9,314.07 114.9,263.07"
          fill="#6ab4a8"
        />
        <!-- Middle-center: matches background -->
        <polygon
          points="263.14,237.57 307.31,263.07 307.31,314.07 263.14,339.57 218.98,314.07 218.98,263.07"
          :fill="variant === 'light-bg' ? '#004e53' : '#ffffff'"
        />
        <!-- Middle-right: Blue -->
        <polygon
          points="367.56,237.57 411.73,263.07 411.73,314.07 367.56,339.57 323.39,314.07 323.39,263.07"
          fill="#5bc5e8"
        />
        <!-- Bottom-left: Teal -->
        <polygon
          points="211.13,327.96 255.3,353.46 255.3,404.46 211.13,429.96 166.96,404.46 166.96,353.46"
          fill="#4db3a8"
        />
        <!-- Bottom-right: matches background -->
        <polygon
          points="315.84,327.95 360.01,353.45 360.01,404.45 315.84,429.95 271.67,404.45 271.67,353.45"
          :fill="variant === 'light-bg' ? '#004e53' : '#ffffff'"
        />
      </g>
    </svg>

    <span
      v-if="showText !== false"
      class="deveco-logo-text"
      :class="variant === 'light-bg' ? 'deveco-logo-text--dark' : 'deveco-logo-text--light'"
    >
      dev<span class="deveco-logo-accent">Eco</span>
    </span>
  </div>
</template>

<style scoped>
.deveco-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.deveco-logo svg {
  flex-shrink: 0;
}

.deveco-logo-text {
  font-family: var(--font-display, 'Nunito', sans-serif);
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1;
}

.deveco-logo-text--dark {
  color: #004e53;
}

.deveco-logo-text--light {
  color: #ffffff;
}

.deveco-logo-accent {
  color: #00e7ad;
}
</style>
