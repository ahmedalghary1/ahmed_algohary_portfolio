# Interaction policy — dark portfolio

Native anchor scrolling, disclosure navigation, active section observation, project
category buttons and case image dialog. Content remains available without JavaScript.
Buttons/cards use 180–300ms feedback. Cards have a subtle CSS view-timeline reveal
where supported (opacity never below .7); no effect gates viewing. Reduced motion
disables animation, transforms from reveal, transitions and smooth scrolling.

The contact composer validates four fields, copies a draft or hands it to WhatsApp.
The status never claims delivery. Clipboard denial exposes a selectable draft.
No animation runtime, canvas, autoplay, parallax or pinned sequences are loaded.

Current verification: npm run test:layouts, test:motion, test:contact and test:v3.
Historical reports describe previous iterations; current evidence is in reports/redesign.
