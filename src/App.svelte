<script lang="ts">
  import Header from "./components/Header.svelte";
  import Hero from "./components/Hero.svelte";
  import Services from "./components/Services.svelte";
  import Projects from "./components/Projects.svelte";
  import About from "./components/About.svelte";
  import Contact from "./components/Contact.svelte";
  import Footer from "./components/Footer.svelte";
  import PlasmaBackground from "./components/PlasmaBackground.svelte";

  import profile from "./data/profile.json";
  import socials from "./data/socials.json";
  import skills from "./data/skills.json";
  import services from "./data/services.json";
  import projects from "./data/projects.json";
  import experiences from "./data/experiences.json";
</script>

<div class="page">
  <PlasmaBackground />
  <Header profile={profile} />

  <main>
    <Hero profile={profile} />
    <Services profile={profile} services={services} />
    <Projects profile={profile} projects={projects} />
    <About profile={profile} experiences={experiences} skills={skills} />
    <Contact profile={profile} socials={socials} />
  </main>

  <Footer profile={profile} />
</div>

<style lang="scss">
  @use "./styles/variables" as *;

  .page {
    min-height: 100vh;
    background: $color-bg-primary;
    color: $color-text-primary;
    transition: background-color $transition-base, color $transition-base;
    position: relative;
    z-index: 1;
  }

  :global(.light) .page {
    background-color: $color-bg-primary-light;
    color: $color-text-primary-light;
  }

  main {
    display: block;
  }

  :global(html) {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }

  :global(*) {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
