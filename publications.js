(() => {
  const list = document.getElementById('publication-list');
  if (!list) return;

  const searchInput = document.getElementById('publication-search');
  const sortSelect = document.getElementById('publication-sort');
  const entries = Array.from(list.querySelectorAll('.publication-entry'));
  const groups = Array.from(list.querySelectorAll('.publication-group, .publication-accordion'));
  const accordions = Array.from(list.querySelectorAll('.publication-accordion'));
  const resultCount = document.getElementById('publication-result-count');
  const categoryCounts = document.getElementById('publication-category-counts');
  const emptyState = document.getElementById('publication-empty');
  const categories = ['Published', 'Accepted / In Press', 'Under Review', 'In Preparation', 'Technical Reports', 'Invited Presentations', 'Conferences'];

  const normalize = value => value.toLowerCase().replace(/\s+/g, ' ').trim();
  const setAccordion = (accordion, open) => {
    const button = accordion.querySelector('.publication-accordion-toggle');
    const panel = accordion.querySelector('.publication-accordion-panel');
    accordion.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  };

  accordions.forEach(accordion => {
    accordion.querySelector('.publication-accordion-toggle').addEventListener('click', () => {
      setAccordion(accordion, accordion.querySelector('.publication-accordion-toggle').getAttribute('aria-expanded') !== 'true');
    });
  });

  const updateCounts = visibleEntries => {
    resultCount.textContent = `${visibleEntries.length} item${visibleEntries.length === 1 ? '' : 's'}`;
    categoryCounts.innerHTML = categories.map(category => {
      const count = visibleEntries.filter(entry => entry.dataset.category === category).length;
      return `<span>${category}: ${count}</span>`;
    }).join('');
  };

  const sortEntries = () => {
    const direction = sortSelect.value === 'oldest' ? 1 : -1;
    list.querySelectorAll('.publication-items').forEach(container => {
      Array.from(container.children)
        .sort((first, second) => (Number(first.dataset.year) - Number(second.dataset.year)) * direction)
        .forEach(entry => container.appendChild(entry));
    });
  };

  const applyFilter = () => {
    const query = normalize(searchInput.value);
    const visibleEntries = entries.filter(entry => normalize(entry.textContent).includes(query));
    const visibleSet = new Set(visibleEntries);

    entries.forEach(entry => { entry.hidden = !visibleSet.has(entry); });
    groups.forEach(group => {
      const groupEntries = entries.filter(entry => group.contains(entry));
      const hasMatch = groupEntries.some(entry => visibleSet.has(entry));
      group.hidden = !hasMatch;
      if (group.classList.contains('publication-accordion') && query) setAccordion(group, hasMatch);
    });
    emptyState.hidden = visibleEntries.length > 0;
    updateCounts(visibleEntries);
  };

  document.getElementById('show-all-publications').addEventListener('click', () => {
    accordions.forEach(accordion => setAccordion(accordion, true));
  });
  document.getElementById('collapse-all-publications').addEventListener('click', () => {
    accordions.forEach(accordion => setAccordion(accordion, false));
  });
  searchInput.addEventListener('input', applyFilter);
  sortSelect.addEventListener('change', () => { sortEntries(); applyFilter(); });

  const openDeepLink = () => {
    const targetId = window.location.hash.slice(1);
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (!target) return;
    const parentAccordion = target.closest('.publication-accordion');
    if (parentAccordion) setAccordion(parentAccordion, true);
    window.setTimeout(() => target.scrollIntoView({ block: 'center' }), 0);
  };

  sortEntries();
  applyFilter();
  openDeepLink();
  window.addEventListener('hashchange', openDeepLink);
})();
