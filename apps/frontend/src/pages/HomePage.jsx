export function HomePage({ apiStatus }) {
  return (
    <main id="main-content">
      <section className="hero section panel" id="home">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Alok Kumar Mishra</p>
            <h1>TRANSFORM YOUR LIFE THROUGH PRECISION-DRIVEN ASTRO-VASTU GUIDANCE</h1>
            <p className="lead">"This is not prediction. This is alignment."</p>
            <p className="lead">
              Most people struggle not because of lack of effort, but because of misalignment in thinking, environment,
              and decision-making.
            </p>
            <div className="micro-grid">
              <span>Career & Financial Growth</span>
              <span>Relationships & Stability</span>
              <span>Business Direction</span>
              <span>Mental Clarity</span>
            </div>
            <div className="cta-row" id="book">
              <a className="btn btn-primary" href="#contact">Book Consultation</a>
              <a className="btn btn-outline" href="#services">Explore Services</a>
            </div>
          </div>
          <div className="hero-art">
            <img src="/assets/hero-placeholder.svg" alt="Astro-Vastu visual" />
          </div>
        </div>
      </section>

      <section className="section panel" id="about"><div className="container"><p className="section-kicker">About The Approach</p><h2>Most Problems Are Not Random</h2><p className="section-intro">Most problems are not random. They are structured patterns caused by wrong decisions, a misaligned environment, and lack of clarity.</p><div className="three-grid"><article className="why-card"><h3>Identify exact root cause</h3><p>Pinpointing the origin of the problem, not symptoms.</p></article><article className="why-card"><h3>Understand the pattern</h3><p>Analyzing why repeated blocks continue in life and work.</p></article><article className="why-card"><h3>Apply precise correction</h3><p>Situation-specific action, not generic temporary fixes.</p></article></div><div className="stats-grid compact"><article className="stat-card"><h3>4+</h3><p>Years</p></article><article className="stat-card"><h3>100+</h3><p>Cases</p></article><article className="stat-card"><h3>98%</h3><p>Success</p></article><article className="stat-card"><h3>24h</h3><p>Response</p></article></div></div></section>
      <section className="section panel" id="framework"><div className="container"><p className="section-kicker">Core Framework</p><h2>Every solution is built on three layers</h2><div className="three-grid"><article className="service-card"><h3>1. Mindset & Decision Intelligence</h3><ul><li>How you process situations</li><li>Where judgment falls</li><li>Why mistakes repeat</li></ul></article><article className="service-card"><h3>2. Energy Alignment</h3><ul><li>Space alignment</li><li>Planetary influences</li><li>Directional balance</li></ul></article><article className="service-card"><h3>3. Action Framework</h3><ul><li>Exact steps to follow</li><li>What to do/avoid</li><li>How to maintain consistency</li></ul></article></div><div className="highlight-strip">When these three layers align, results stop being uncertain and start becoming <strong>predictable</strong>.</div></div></section>
      <section className="section panel" id="services"><div className="container"><p className="section-kicker">Services</p><h2>Four core service categories</h2><p className="section-intro">The process is designed to diagnose the root issue and deliver structured correction, not surface-level advice.</p><div className="services-grid"><article className="service-card"><h3>Personal Guidance</h3><p>For confusion, overthinking, and lack of direction.</p><p><strong>Outcome:</strong> Clear thinking and confident decisions.</p></article><article className="service-card"><h3>Career & Growth</h3><p>For stagnation and unclear career path.</p><p><strong>Outcome:</strong> Focused direction and consistent growth.</p></article><article className="service-card"><h3>Relationships</h3><p>For conflicts, emotional instability, and compatibility issues.</p><p><strong>Outcome:</strong> Stability, understanding, and balance.</p></article><article className="service-card"><h3>Business & Prosperity</h3><p>For losses, instability, and poor decision-making.</p><p><strong>Outcome:</strong> Better decisions and sustainable financial growth.</p></article></div></div></section>
      <section className="section panel" id="specialized"><div className="container"><p className="section-kicker">Specialized Services</p><h2>Specialized Vastu & Energy Services</h2><div className="services-grid three-col"><article className="service-card"><h3>Basic Vastu</h3><p>Space correction for stability.</p></article><article className="service-card"><h3>Numero Vastu</h3><p>Number alignment with environment.</p></article><article className="service-card"><h3>Astro Vastu</h3><p>Planetary and spatial alignment.</p></article><article className="service-card"><h3>Devta Energy Activation</h3><p>Strengthening directional energies.</p></article><article className="service-card"><h3>Advanced Remedies</h3><p>Root-cause-based corrections.</p></article><article className="service-card"><h3>Industrial Vastu</h3><p>Business and factory alignment.</p></article></div></div></section>
      <section className="section panel" id="why"><div className="container"><p className="section-kicker">Why This Works</p><h2>Five key differentiators</h2><div className="services-grid five-col"><article className="why-card"><h3>Experience-Driven</h3><p>4+ years of real case work and pattern-based understanding.</p></article><article className="why-card"><h3>Root Cause Focus</h3><p>Works on the actual issue, not surface-level symptoms.</p></article><article className="why-card"><h3>Fully Personalized</h3><p>Solutions are based on your unique life and environment.</p></article><article className="why-card"><h3>Long-Term Results</h3><p>Designed for lasting stability and measurable growth.</p></article></div><div className="stats-grid compact"><article className="stat-card"><h3>95%</h3><p>Success Rate</p></article><article className="stat-card"><h3>100+</h3><p>Cases Resolved</p></article><article className="stat-card"><h3>4.9</h3><p>Client Rating</p></article><article className="stat-card"><h3>24/7</h3><p>Support</p></article></div></div></section>
      <section className="section panel" id="positioning"><div className="container"><p className="section-kicker">Positioning</p><h2>This is not astrology in the traditional sense</h2><div className="position-grid"><p>Not about telling what will happen.</p><p>Understand why your current situation exists.</p><p>Identify what is misaligned.</p><p>Correct what needs correction.</p><p>Define exact actions that create change.</p><p>Maintain consistency for sustainable results.</p></div><div className="highlight-strip">This is a structured system for clarity, control, and strategic life alignment.</div></div></section>
      <section className="cta-band section panel" id="contact"><div className="container cta-band-wrap"><div><p className="section-kicker">Call To Action</p><h2>The Next Step</h2><p>If you are serious about clarity, direction, and long-term stability, take the first step now.</p><p className="api-status">Server status: {apiStatus}</p></div><div className="cta-row"><a className="btn btn-primary" href="tel:+916394222987">Book Consultation</a><a className="btn btn-outline" href="https://wa.me/916394222987">WhatsApp</a></div></div></section>
    </main>
  );
}
