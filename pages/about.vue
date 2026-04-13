<script setup lang="ts">
useSeoMeta({
  title: 'About -- devEco.io',
  description: 'devEco.io is an open-source edge AI project sharing and community platform.',
});

const { hubs: hubsEnabled, contests: contestsEnabled } = useFeatures();
</script>

<template>
  <div class="de-about">
    <div class="de-about-hero">
      <div class="de-about-hero-bg" />
      <div class="de-about-hero-inner">
        <span class="de-about-badge"><i class="fa-solid fa-code-branch"></i> Open Source</span>
        <h1 class="de-about-title">dev<span>Eco</span>.io</h1>
        <p class="de-about-subtitle">An open platform for edge AI project sharing, community building, and collaborative learning. Backed by Edge AI Foundation.</p>
      </div>
    </div>

    <div class="de-about-body">
      <div class="de-about-grid">
        <div class="de-about-card">
          <div class="de-about-card-icon"><i class="fa-solid fa-microchip"></i></div>
          <h3>Edge AI Projects</h3>
          <p>Document your edge AI builds with rich editors. Parts lists, wiring diagrams, build steps, code blocks, and deployment guides.</p>
        </div>
        <div v-if="hubsEnabled" class="de-about-card">
          <div class="de-about-card-icon"><i class="fa-solid fa-users"></i></div>
          <h3>Communities</h3>
          <p>Create spaces for your team, product, or interest group. Discussions, content galleries, and shared resources.</p>
        </div>
        <div v-if="contestsEnabled" class="de-about-card">
          <div class="de-about-card-icon"><i class="fa-solid fa-trophy"></i></div>
          <h3>Contests</h3>
          <p>Run build contests with prizes, judges, and community voting. Competitions that push the boundaries of what edge AI can do.</p>
        </div>
        <div class="de-about-card">
          <div class="de-about-card-icon"><i class="fa-solid fa-pen-nib"></i></div>
          <h3>Blog</h3>
          <p>Write articles, tutorials, deep dives, and opinion pieces. Rich text editing with embedded media and code.</p>
        </div>
        <div class="de-about-card">
          <div class="de-about-card-icon"><i class="fa-solid fa-code"></i></div>
          <h3>Open Source</h3>
          <p>Built on CommonPub, an open ActivityPub protocol for maker communities. Self-hostable, extensible, and transparent.</p>
        </div>
        <div class="de-about-card">
          <div class="de-about-card-icon"><i class="fa-solid fa-server"></i></div>
          <h3>Self-Hosted</h3>
          <p>Deploy with Docker. PostgreSQL, Redis, and your choice of S3-compatible storage. Full control over your data.</p>
        </div>
      </div>

      <div class="de-about-cta">
        <h2>Join the community</h2>
        <p>devEco.io is free and open source. Create an account and start sharing your edge AI projects.</p>
        <div class="de-about-cta-actions">
          <NuxtLink to="/auth/register" class="de-btn de-btn-accent"><i class="fa-solid fa-user-plus"></i> Create Account</NuxtLink>
          <a href="https://github.com/edge-ai-foundation/deveco-io" target="_blank" rel="noopener" class="de-btn de-btn-outline"><i class="fa-brands fa-github"></i> GitHub</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.de-about-hero {
  position: relative;
  background: linear-gradient(135deg, var(--deveco-dark-green), var(--deveco-dark-blue, #1b357d));
  padding: 72px 32px;
  text-align: center;
  overflow: hidden;
}
.de-about-hero-bg {
  position: absolute; inset: 0;
  background-image:
    radial-gradient(circle at 30% 70%, rgba(0, 231, 173, 0.12), transparent 50%),
    radial-gradient(circle at 70% 30%, rgba(91, 197, 232, 0.08), transparent 50%);
}
.de-about-hero-inner { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; }
.de-about-badge {
  font-size: 0.6875rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.05em; padding: 5px 14px; border-radius: 20px;
  background: rgba(0, 231, 173, 0.15); border: 1px solid rgba(0, 231, 173, 0.3);
  color: var(--accent); display: inline-flex; align-items: center; gap: 6px;
  margin-bottom: 20px;
}
.de-about-title {
  font-family: var(--font-display); font-size: 2.5rem; font-weight: 800;
  margin-bottom: 16px; color: #fff;
}
.de-about-title span { color: var(--accent); }
.de-about-subtitle { font-size: 1.0625rem; color: rgba(255, 255, 255, 0.7); line-height: 1.6; }

.de-about-body { max-width: 1000px; margin: 0 auto; padding: 48px 32px; }
.de-about-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 48px; }
.de-about-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 28px; transition: box-shadow 0.2s;
}
.de-about-card:hover { box-shadow: var(--shadow-md); }
.de-about-card-icon { font-size: 24px; color: var(--deveco-dark-green); margin-bottom: 14px; }
.de-about-card h3 { font-size: 0.9375rem; font-weight: 700; margin-bottom: 8px; }
.de-about-card p { font-size: 0.8125rem; color: var(--text-dim); line-height: 1.6; }

.de-about-cta {
  text-align: center; padding: 40px;
  background: var(--surface2); border: 1px solid var(--border); border-radius: 16px;
}
.de-about-cta h2 { font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; margin-bottom: 8px; }
.de-about-cta p { font-size: 0.9375rem; color: var(--text-dim); margin-bottom: 24px; }
.de-about-cta-actions { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }

.de-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 20px; font-size: 0.875rem; font-weight: 600;
  border-radius: 8px; border: none; cursor: pointer;
  text-decoration: none; transition: all 0.15s;
}
.de-btn-accent { background: var(--accent); color: var(--deveco-dark-green); }
.de-btn-accent:hover { background: #00d49f; }
.de-btn-outline { background: transparent; color: var(--text); border: 1px solid var(--border); }
.de-btn-outline:hover { background: var(--surface2); }

@media (max-width: 768px) { .de-about-grid { grid-template-columns: 1fr; } }
</style>
