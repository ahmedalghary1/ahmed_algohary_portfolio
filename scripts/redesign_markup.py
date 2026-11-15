"""Small reusable SVG components, no icon runtime or network dependency."""
from html import escape

PATHS = {
    'code': '<path d="m8 5-7 7 7 7m8-14 7 7-7 7m-3-18-2 22"/>',
    'layers': '<path d="m12 2 10 6-10 6L2 8l10-6Zm-10 10 10 6 10-6M2 16l10 6 10-6"/>',
    'store': '<path d="M3 10v11h18V10M2 10l3-7h14l3 7M8 21v-7h8v7M2 10c0 4 5 4 5 0 0 4 5 4 5 0 0 4 5 4 5 0 0 4 5 4 5 0"/>',
    'api': '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="m7 9-3 3 3 3m10-6 3 3-3 3m-6 1 2-8"/>',
    'send': '<path d="m22 2-7 20-4-9L2 9 22 2ZM11 13 22 2"/>',
    'eye': '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    'mail': '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="m3 6 9 7 9-7"/>',
    'check': '<circle cx="12" cy="12" r="10"/><path d="m7 12 3 3 7-7"/>',
}

def icon(name, cls=''):
    return f'<svg class="{escape(cls)}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{PATHS[name]}</svg>'

def filter_markup(copy):
    buttons=''.join(f'<button type="button" data-filter="{key}" aria-pressed="{"true" if key=="all" else "false"}">{copy("work."+key)}</button>' for key in ['all','websites','commerce','systems'])
    return f'<div class="project-filters" role="group" data-copy-aria-label="work.filterLabel" aria-label="Filter projects by type" hidden>{buttons}</div>'
