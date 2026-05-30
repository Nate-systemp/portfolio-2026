/**
 * ROLE CUSTOMIZER — Bespoke Portfolio Experience Engine
 * 
 * Personalizes the portfolio based on the employer's hiring track:
 *   - UI/UX Designer
 *   - Frontend Developer
 *   - Technical Support
 * 
 * Controls: resume PDF paths, experience accordion highlights,
 * project sorting signals, loading curtain portal, floating switcher,
 * and deep-linking via URL params.
 * 
 * Must load BEFORE script.js so it can intercept the curtain flow.
 */

(function () {
  'use strict';

  // ── Role Definitions ──
  const ROLES = {
    uiux: {
      key: 'uiux',
      label: 'UI/UX Designer',
      shortLabel: 'UI/UX',
      icon: '✦',
      resume: 'assets/PANGILINAN_UIUXDESIGNER.pdf',
      accentHue: '14',        // warm terracotta
      expKeyword: 'UI/UX Designer',
      projectTypes: ['casestudy', 'development'],
      description: 'Design-focused view — UX case studies first',
    },
    frontend: {
      key: 'frontend',
      label: 'Frontend Developer',
      shortLabel: 'Frontend',
      icon: '⟨/⟩',
      resume: 'assets/PANGILINAN_FRONT-ENDDEV.pdf',
      accentHue: '142',       // dev green
      expKeyword: 'Lead Frontend Developer',
      projectTypes: ['development', 'casestudy'],
      description: 'Engineering-focused view — dev projects first',
    },
    support: {
      key: 'support',
      label: 'Technical Support',
      shortLabel: 'Tech Support',
      icon: '⚙',
      resume: 'assets/PANGILINAN_TECHSUPPORT.pdf',
      accentHue: '210',       // cool blue
      expKeyword: 'IT Intern',
      projectTypes: ['development', 'casestudy'],
      description: 'Support & systems view — IT experience first',
    },
  };

  const DEFAULT_ROLE = 'frontend';
  const LS_KEY = 'portfolio_role';

  // ── State ──
  let activeRole = null;

  // ── Utility ──
  function getUrlRole() {
    const params = new URLSearchParams(window.location.search);
    const r = params.get('role');
    return r && ROLES[r] ? r : null;
  }

  function getSavedRole() {
    try {
      const r = localStorage.getItem(LS_KEY);
      return r && ROLES[r] ? r : null;
    } catch { return null; }
  }

  function saveRole(key) {
    try { localStorage.setItem(LS_KEY, key); } catch {}
  }

  // ── Apply Role ──
  function applyRole(roleKey, options = {}) {
    const role = ROLES[roleKey];
    if (!role) return;
    activeRole = roleKey;

    // 1. Update all resume links & download buttons
    const resumeLinks = document.querySelectorAll(
      'a.resume-link, a.rv-download-btn'
    );
    resumeLinks.forEach(link => {
      link.href = role.resume;
    });

    // 2. Set the global PDF path so the viewer picks it up
    window.currentResumePdf = role.resume;

    // 3. Reset cached pdfDoc so next peek reloads the correct file
    window.__resetResumePdf = true;

    // 4. Highlight the matching experience accordion item
    highlightExperience(role.expKeyword);

    // 5. Signal project sorting preference to firestore-loader
    window.__roleProjectTypes = role.projectTypes;
    window.__activePortfolioRole = roleKey;

    // 6. Re-render projects if the loader has already run
    if (typeof window.renderProjectsForRole === 'function') {
      window.renderProjectsForRole(roleKey);
    }

    // 7. Update switcher UI
    updateSwitcherUI(roleKey);

    // 8. Update body data attribute for CSS hooks
    document.body.setAttribute('data-role', roleKey);

    // 9. Save to localStorage
    saveRole(roleKey);

    // 10. Show toast if requested
    if (options.showToast) {
      showToast(role);
    }
  }

  // ── Experience Accordion Highlight ──
  function highlightExperience(keyword) {
    const items = document.querySelectorAll('.exp-item');
    items.forEach(item => {
      const roleEl = item.querySelector('.exp-role');
      if (roleEl && roleEl.textContent.trim() === keyword) {
        // Auto-open matching item
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      }
    });
  }

  // ── Toast Notification ──
  function showToast(role) {
    // Remove existing toast
    const old = document.querySelector('.bespoke-toast');
    if (old) old.remove();

    const toast = document.createElement('div');
    toast.className = 'bespoke-toast';
    toast.innerHTML = `
      <div class="bespoke-toast-icon">${role.icon}</div>
      <div class="bespoke-toast-body">
        <span class="bespoke-toast-title">Portfolio tailored for ${role.label}</span>
        <span class="bespoke-toast-desc">${role.description}</span>
      </div>
    `;
    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });

    // Auto-dismiss
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  }

  // ── Floating Quick-Switcher ──
  function createSwitcher() {
    const switcher = document.createElement('div');
    switcher.className = 'bespoke-switcher';
    switcher.id = 'bespokeSwitcher';
    switcher.innerHTML = `
      <button class="bespoke-pill" id="bespokePill" aria-label="Switch portfolio view">
        <span class="bespoke-pill-icon"></span>
        <span class="bespoke-pill-label"></span>
      </button>
      <div class="bespoke-dropdown" id="bespokeDropdown">
        <div class="bespoke-dropdown-header">TAILOR EXPERIENCE</div>
        ${Object.values(ROLES).map(r => `
          <button class="bespoke-dropdown-item" data-role="${r.key}">
            <span class="bdi-icon">${r.icon}</span>
            <span class="bdi-label">${r.label}</span>
            <span class="bdi-check">✓</span>
          </button>
        `).join('')}
      </div>
    `;
    document.body.appendChild(switcher);

    // Pill click toggles dropdown
    const pill = document.getElementById('bespokePill');
    const dropdown = document.getElementById('bespokeDropdown');

    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      switcher.classList.toggle('open');
    });

    // Dropdown item clicks
    dropdown.querySelectorAll('.bespoke-dropdown-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const key = btn.dataset.role;
        if (key !== activeRole) {
          applyRole(key, { showToast: true });
        }
        switcher.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', () => {
      switcher.classList.remove('open');
    });
  }

  function updateSwitcherUI(roleKey) {
    const role = ROLES[roleKey];
    if (!role) return;

    const pill = document.getElementById('bespokePill');
    if (pill) {
      pill.querySelector('.bespoke-pill-icon').textContent = role.icon;
      pill.querySelector('.bespoke-pill-label').textContent = role.shortLabel;
    }

    // Update check marks
    document.querySelectorAll('.bespoke-dropdown-item').forEach(item => {
      item.classList.toggle('active', item.dataset.role === roleKey);
    });
  }

  // ── Loading Curtain Portal ──
  function injectPortal() {
    const curtain = document.getElementById('loadingCurtain');
    if (!curtain) return;

    const portal = document.createElement('div');
    portal.className = 'role-portal';
    portal.id = 'rolePortal';
    portal.innerHTML = `
      <div class="portal-content">
        <div class="portal-eyebrow">WELCOME</div>
        <h2 class="portal-heading">Tailor your<br><em>experience</em></h2>
        <p class="portal-subtext">I've prepared role-specific résumés and curated content.<br>Choose your path, or explore freely.</p>
        <div class="portal-options">
          ${Object.values(ROLES).map(r => `
            <button class="portal-opt-btn" data-role="${r.key}">
              <span class="portal-opt-icon">${r.icon}</span>
              <span class="portal-opt-label">${r.label}</span>
              <span class="portal-opt-arrow">→</span>
            </button>
          `).join('')}
          <button class="portal-opt-btn portal-opt-skip" data-role="skip">
            <span class="portal-opt-icon">◇</span>
            <span class="portal-opt-label">Just explore</span>
            <span class="portal-opt-arrow">→</span>
          </button>
        </div>
      </div>
    `;
    curtain.appendChild(portal);

    // Wire up portal buttons
    portal.querySelectorAll('.portal-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.role;

        // Hide portal with animation
        portal.classList.add('portal-exiting');

        if (key !== 'skip') {
          applyRole(key, { showToast: false });
        } else {
          applyRole(DEFAULT_ROLE, { showToast: false });
        }

        // Trigger curtain dismissal after portal exit
        setTimeout(() => {
          window.__portalComplete = true;
          // Dispatch a custom event that script.js listens for
          window.dispatchEvent(new CustomEvent('portal-selected'));
        }, 500);
      });
    });
  }

  // ── Initialization ──
  function init() {
    const urlRole = getUrlRole();
    const savedRole = getSavedRole();
    const isReturning = new URLSearchParams(window.location.search).get('from') === 'project';

    // Create the quick-switcher (always available)
    createSwitcher();

    if (urlRole) {
      // Deep link: apply immediately, skip portal, auto-dismiss curtain
      applyRole(urlRole, { showToast: true });
      window.__skipPortal = true;
    } else if (savedRole) {
      // Returning user with saved preference
      applyRole(savedRole, { showToast: false });
      window.__skipPortal = true;
    } else if (isReturning) {
      // Coming back from project page, use default
      applyRole(DEFAULT_ROLE, { showToast: false });
      window.__skipPortal = true;
    } else {
      // First-time visitor: inject portal into curtain
      applyRole(DEFAULT_ROLE, { showToast: false });
      window.__skipPortal = false;
      injectPortal();
    }
  }

  // Run on DOMContentLoaded if DOM isn't ready, else immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for external use
  window.PORTFOLIO_ROLES = ROLES;
  window.applyPortfolioRole = applyRole;
})();
