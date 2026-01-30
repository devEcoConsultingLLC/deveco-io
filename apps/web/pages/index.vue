<script setup lang="ts">
useHead({
  title: 'devEco.io — Build Edge AI Projects That Matter',
});

// TODO: Fetch from tRPC when connected
const featuredProjects = [
  {
    slug: 'esp32-object-detection',
    title: 'Real-time Object Detection on ESP32-S3',
    summary: 'Deploy a custom trained TensorFlow Lite model for real-time object detection.',
    author: { username: 'alice', displayName: 'Alice Chen' },
    difficulty: 'advanced',
    likeCount: 89,
    viewCount: 1247,
    commentCount: 23,
    tags: ['ESP32', 'TensorFlow Lite', 'Computer Vision'],
  },
  {
    slug: 'voice-controlled-robot-arm',
    title: 'Voice-Controlled Robot Arm with Edge AI',
    summary: 'Build a robot arm that responds to voice commands using on-device speech recognition.',
    author: { username: 'bob', displayName: 'Bob Martinez' },
    difficulty: 'intermediate',
    likeCount: 67,
    viewCount: 856,
    commentCount: 15,
    tags: ['ESP32', 'Voice Recognition'],
  },
  {
    slug: 'gesture-recognition-glove',
    title: 'Gesture Recognition Glove for Sign Language',
    summary: 'A wearable glove that translates sign language gestures to text.',
    author: { username: 'alice', displayName: 'Alice Chen' },
    difficulty: 'advanced',
    likeCount: 156,
    viewCount: 2103,
    commentCount: 41,
    tags: ['TinyML', 'Sensor Fusion'],
  },
  {
    slug: 'smart-garden-monitor',
    title: 'Smart Garden Monitor with Anomaly Detection',
    summary: 'An intelligent garden monitoring system using TinyML on Arduino Nano 33 BLE.',
    author: { username: 'carol', displayName: 'Carol Williams' },
    difficulty: 'beginner',
    likeCount: 34,
    viewCount: 432,
    commentCount: 8,
    tags: ['Arduino', 'TinyML'],
  },
  {
    slug: 'wildlife-camera-trap',
    title: 'AI-Powered Wildlife Camera Trap',
    summary: 'A battery-powered camera trap that classifies animals on-device.',
    author: { username: 'bob', displayName: 'Bob Martinez' },
    difficulty: 'intermediate',
    likeCount: 52,
    viewCount: 678,
    commentCount: 12,
    tags: ['Raspberry Pi', 'Computer Vision'],
  },
  {
    slug: 'smart-doorbell',
    title: 'Edge AI Smart Doorbell with Person Detection',
    summary: 'Detect and identify visitors at your door without cloud dependency.',
    author: { username: 'carol', displayName: 'Carol Williams' },
    difficulty: 'intermediate',
    likeCount: 45,
    viewCount: 589,
    commentCount: 9,
    tags: ['ESP32', 'Computer Vision'],
  },
];
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-brand-dark to-brand-dark-blue py-20 sm:py-28">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-3xl text-center">
          <DevEcoLogoAnimated animation="float" size="lg" class="mx-auto mb-8" />
          <h1 class="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Build Edge AI Projects<br />That Matter
          </h1>
          <p class="mt-6 text-lg text-white/70">
            Share projects with code, schematics, and bills of materials.
            Browse hardware. Join contests. Connect with the Edge AI community.
          </p>
          <div class="mt-10 flex items-center justify-center gap-4">
            <NuxtLink
              to="/projects"
              class="rounded-md bg-brand-light px-6 py-3 text-sm font-bold text-brand-dark hover:bg-brand-light/90 transition-colors"
            >
              Explore Projects
            </NuxtLink>
            <NuxtLink
              to="/auth/register"
              class="rounded-md border-2 border-white/30 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
            >
              Join Community
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Projects -->
    <section class="py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="font-display text-2xl font-extrabold text-foreground">Featured Projects</h2>
            <p class="mt-1 text-sm text-muted-foreground">Discover the latest Edge AI creations</p>
          </div>
          <NuxtLink
            to="/projects"
            class="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            View all &rarr;
          </NuxtLink>
        </div>

        <ProjectGrid :projects="featuredProjects" />
      </div>
    </section>

    <!-- Stats & Community -->
    <section class="border-y border-border bg-muted/50 py-16">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div class="text-center">
            <div class="font-display text-3xl font-extrabold text-primary">150+</div>
            <div class="mt-1 text-sm text-muted-foreground">Projects</div>
          </div>
          <div class="text-center">
            <div class="font-display text-3xl font-extrabold text-brand-pink">50+</div>
            <div class="mt-1 text-sm text-muted-foreground">Hardware Items</div>
          </div>
          <div class="text-center">
            <div class="font-display text-3xl font-extrabold text-brand-yellow">1.2k</div>
            <div class="mt-1 text-sm text-muted-foreground">Community Members</div>
          </div>
          <div class="text-center">
            <div class="font-display text-3xl font-extrabold text-brand-blue">12</div>
            <div class="mt-1 text-sm text-muted-foreground">Active Contests</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Foundation Banner -->
    <section class="py-12">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="rounded-xl bg-gradient-to-r from-brand-dark to-brand-dark-blue p-8 sm:p-12">
          <div class="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <DevEcoLogoAnimated animation="glow" size="lg" />
            <div>
              <h3 class="font-display text-xl font-extrabold text-white">Backed by Edge AI Foundation</h3>
              <p class="mt-2 text-sm text-white/70">
                devEco.io is part of the portalNetwork "Internet of Communities" — connecting makers, engineers,
                and researchers building the future of Edge AI.
              </p>
            </div>
            <NuxtLink
              to="/communities"
              class="shrink-0 rounded-md bg-brand-light px-6 py-3 text-sm font-bold text-brand-dark hover:bg-brand-light/90 transition-colors"
            >
              Join the Network
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
