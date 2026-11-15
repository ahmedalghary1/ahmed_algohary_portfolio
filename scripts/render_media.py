"""Progressively enhanced project media; absent media produces no empty UI."""
from html import escape


def gallery_markup(record, index, copy, locale, localized):
    if not record.get('screenshots'):
        return ''
    groups = {}
    for j, media in enumerate(record['screenshots']):
        key = f'projects.{index}.media.{j}'
        thumbnail = escape(media.get('thumbnail') or media['src'], quote=True)
        figure = f'''<figure class="feature-preview">
<a href="{escape(media['src'],quote=True)}" data-gallery-index="{j}" target="_blank" rel="noopener noreferrer">
<img src="{thumbnail}" width="{media.get('width',1600)}" height="{media.get('height',900)}" alt="{escape(localized['media'][j]['alt'],quote=True)}" data-copy-alt="{key}.alt" loading="lazy" decoding="async">
<span class="gallery-open-label">{copy('projectUI.openImage')}<span aria-hidden="true"> ↗</span></span></a>
<figcaption>{copy(key+'.title','h3')}{copy(key+'.caption','p')}</figcaption></figure>'''
        groups.setdefault(media.get('group', 'overview'), []).append(figure)
    galleries = ''.join(f'<div class="gallery-grid{" gallery-single" if len(items)==1 else ""}">{"".join(items)}</div>' for items in groups.values())
    return f'<section class="gallery-section" aria-labelledby="gallery-title">{copy("work.gallery","h2",attrs="id=\"gallery-title\"")}{galleries}</section>'


def videos_markup(record, index, copy, locale, localized):
    if not record.get('videos'):
        return ''
    videos = []
    for j, video in enumerate(record['videos']):
        key = f'projects.{index}.videos.{j}'
        tracks = ''.join(f'<track kind="captions" src="{escape(t["src"],quote=True)}" srclang="{t["lang"]}" label="{"العربية" if t["lang"]=="ar" else "English"}">' for t in video.get('captions', []))
        videos.append(f'''<figure class="project-video">{copy(key+'.title','h3')}
<video controls playsinline preload="none" poster="{escape(video['poster'],quote=True)}" width="{video.get('width',1600)}" height="{video.get('height',900)}" aria-label="{escape(localized['videos'][j]['title'],quote=True)}" data-copy-aria-label="{key}.title">
<source src="{escape(video['src'],quote=True)}" type="{escape(video.get('type','video/mp4'),quote=True)}">{tracks}</video>
<figcaption>{copy(key+'.caption','p')}<a class="text-link" href="{escape(video['src'],quote=True)}">{copy('projectUI.videoFallback')}</a></figcaption></figure>''')
    return f'<section class="video-section">{copy("projectUI.video","h2")}{"".join(videos)}</section>'


def lightbox_markup(copy):
    return f'''<dialog class="lightbox" id="project-lightbox" aria-labelledby="lightbox-title">
<div class="lightbox-panel"><div class="lightbox-toolbar"><h2 id="lightbox-title">{copy('projectUI.gallery')}</h2>
<button type="button" class="lightbox-fullscreen" data-gallery-fullscreen hidden>{copy('projectUI.fullscreen')}</button>
<button type="button" class="lightbox-close" data-gallery-close autofocus>{copy('projectUI.close')}<span aria-hidden="true"> ×</span></button></div>
<figure class="lightbox-figure"><img id="lightbox-image" alt="" width="1600" height="900"><figcaption id="lightbox-caption"></figcaption></figure>
<p class="lightbox-error" hidden><a id="lightbox-original" target="_blank" rel="noopener noreferrer">{copy('projectUI.imageError')}</a></p>
<div class="lightbox-navigation"><button type="button" data-gallery-previous>{copy('projectUI.previousImage')}</button>
<p id="lightbox-counter" role="status" aria-live="polite" aria-atomic="true"></p>
<button type="button" data-gallery-next>{copy('projectUI.nextImage')}</button></div></div></dialog>'''
