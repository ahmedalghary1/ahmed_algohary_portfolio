# تقرير إعادة تصميم البورتفوليو

تاريخ التنفيذ: 15 نوفمبر 2026. جرى تطوير المشروع الحالي دون تغيير الإطار التقني
أو إعدادات الدومين والنشر. احتُفظ بالتعديلات المحلية السابقة والبيانات الحقيقية.

## ما اكتُشف وما تغيّر

كانت الواجهة السابقة تستخدم ألوان الورق والأحمر وتجمع عدة طبقات CSS متعارضة،
وتعرض صورة شخصية صغيرة في المقدمة، بلا تصفية للمشاريع. النموذج كان يجمع الاسم
والرسالة فقط. أصبح التصميم كحليًا بلمسات سماوية وفق المرجع، مع عناصر HTML فعلية
قابلة للتفاعل؛ لم تُستخدم الصورة المرجعية كخلفية للصفحة.

- نظام ألوان مركزي، Inter إنجليزي وIBM Plex Sans Arabic عربي مستضافان محليًا.
- تنقل ثابت بستة أقسام، حالة نشطة، قائمة هاتف تدعم Escape، وزر طلب مشروع.
- مقدمة منقسمة بنص مختصر وصورة مساحة عمل توضيحية، وزرين أساسيين.
- خمسة مشاريع حقيقية، مشروع مصنع مميز، صور فعلية وفلاتر لأربع فئات ممتلئة.
- عشر صفحات تفاصيل مترجمة مع المشكلة والحل والوظائف والمعرض وروابط التنقل.
- 13 تقنية في مجموعات مصغرة وأربع خدمات مبنية على المحتوى الموجود.
- نبذة مختصرة وصورة شخصية وسيرة ذاتية وخبرات عمل موثقة؛ لا تقييمات أو أرقام مختلقة.
- نموذج باسم وبريد ونوع مشروع ورسالة، تحقق وأخطاء وحالة تجهيز ونسخ احتياطي.
  يُفتح WhatsApp بمسودة؛ لا يدّعي الموقع إرسال الرسالة أو استلامها.
- صورة مشاركة اجتماعية جديدة، مع الحفاظ على canonical وhreflang وsitemap
  والبيانات المنظمة وروابط المشاريع والروابط القديمة داخل الصفحة.
- تحميل كسول للصور التالية للمقدمة، أحجام صور محددة، وصورة WebP متجاوبة.
  خُفض خط Inter من 352240 إلى 48256 بايت. لا اعتماديات JavaScript إنتاجية جديدة.
- يستبعد البناء ملفات CSS القديمة غير المستخدمة، مع الاحتفاظ بمصادرها في المشروع.

## الملفات الأساسية

| المجال | الملفات |
| --- | --- |
| البيانات | `data/portfolio.json` |
| التصميم | `css/tokens.css`, `css/neon.css`, الناتج `css/site.css` |
| التوليد | `scripts/render.py`, `scripts/redesign_markup.py`, `scripts/render_projects.py` |
| التفاعل | `js/main.js`, `js/projects.js`, `js/contact.js`, `js/preference.js` |
| الصفحات | `index.html`, `ar/index.html`, الصفحات العشر تحت `projects/` و`ar/projects/` |
| الصور والخط | صورتا workspace، `social-card.png`، Inter وترخيصه |
| البناء والفحص | `scripts/package.py`, اختبارات layout/contact، `scripts/measure.mjs`, `scripts/capture-redesign.mjs` |
| التوثيق | `REDESIGN_PLAN.md`, `DESIGN_SYSTEM.md`, `MOTION_SYSTEM.md`, `README.md`, `THIRD_PARTY.md` |

هذه قائمة بالتغييرات المتعلقة بالتصميم؛ بعض ملفات المشروع كانت معدلة مسبقًا.

## التحقق الفعلي

نُفذت الاختبارات على Chrome المثبت ونسخة `dist/` المخدومة محليًا على المنفذ 8018.

| الفحص | النتيجة |
| --- | --- |
| `npm.cmd run check` | اجتاز: الصياغة، تطابق الترجمات، الصور والروابط والسيرة |
| `npm.cmd run test:data` | اجتازت الاختبارات الثمانية |
| `npm.cmd run test:layouts` | 16 حالة للرئيسية و80 حالة للمشاريع، بلا تجاوز أفقي |
| المقاسات | 360، 390، 480، 768، 1024، 1280، 1440، 1920 في اللغتين |
| الوصول | 24 فحص axe للصفحات بلا مخالفات مسجلة، وفحوص إضافية للنموذج والمعرض |
| التفاعل | الفلاتر، القائمة، تبديل اللغة، روابط التفاصيل، الروابط القديمة، no-JS |
| `npm.cmd run test:contact` | التحقق من الحقول الأربعة والبريد غير الصحيح، نسخ فعلي وبديل عند الرفض |
| تسليم المسودة | رابط WhatsApp وترميز البيانات عبر محاكاة محلية؛ لم تُرسل رسائل حقيقية |
| `npm.cmd run test:v3` | تركيز نافذة المعرض، Escape، لوحة المفاتيح، اللمس، ملء الشاشة وفشل الصورة |
| `npm.cmd run test:motion` | لوحة المفاتيح وتقليل الحركة وفشل تحميل JS والسيرة الأصلية |
| `npm.cmd run test:deployment` | 12 صفحة، 68 ملفًا، 568 فحص HTTP/روابط/موارد، وتطابق ZIP مع dist |
| أخطاء المتصفح | صفر أخطاء JavaScript أو console في الجولة النهائية |
| المراجعة البصرية | 32 لقطة ضمن `reports/redesign/screenshots/`، تشمل الكمبيوتر والهاتف والتابلت |

أُعيدت الجولة النهائية بعد تثبيت ملفات البناء؛ جولة سابقة تزامنت مع إعادة البناء
وتوقفت بسبب طلبات 404 مؤقتة. جميع أرقام النجاح أعلاه من الجولة اللاحقة الناجحة.

ملفات الأدلة: `reports/redesign/checks.json`, `interactions.json`,
`contact/checks.json`, `media/checks.json`.

## الأداء

قياسات Lighthouse محلية لنسخة الإنتاج، بمحاكاة هاتف وشبكة بطيئة. لا تمثل بيانات
Core Web Vitals من مستخدمين حقيقيين، ولا قياسات خادم الإنتاج المنشور.
القياس الأول بعد ضغط الخط: الأداء 92 للإنجليزية و88 للعربية، وبقية الفئات 100
للنسختين، وCLS يساوي صفرًا. أُجريت ثلاث جولات إضافية لتوثيق تباين القياس؛
ملفاتها التفصيلية في `reports/redesign/performance/`.

| اللغة | نتائج الأداء في الجولات الثلاث | الوسيط | الوصول / أفضل الممارسات / SEO |
| --- | --- | --- | --- |
| الإنجليزية | 94، 90، 94 | 94 | 100 / 100 / 100 |
| العربية | 91، 95، 91 | 91 | 100 / 100 / 100 |

CLS صفر في الجولات الثلاث. تحقق هدف الأداء 90+ في هذه الجولات، مع وجود تذبذب
في TBT وتأخر عرض أكبر عنصر إلى نحو 2.9–3.3 ثانية؛ لا تعني الدرجة أن جميع مؤشرات
الأداء مثالية أو أن نتيجة 90+ مضمونة على كل جهاز وشبكة.

## الحدود المتبقية والنشر

- المتصفح المُدار ألغى تنزيل PDF. تحقق HTTP نجح، والملف 78847 بايت مطابق
  للأصل وبصمة SHA256 موثقة؛ حفظه من واجهة المتصفح العادية يحتاج تحققًا يدويًا.
- لا backend لتسليم الرسائل؛ الإرسال النهائي يتم بقرار الزائر داخل WhatsApp.
- أطر عمل المشاريع غير الموثقة لم تُضف، ولا شهادات عملاء أو نسب رضا غير متاحة.
- إرشادات cache والضغط في Lighthouse تتأثر بخادم Python المحلي؛ إعدادات خادم
  الإنتاج لم تتغير. الفحوص الآلية لا تعادل اعتماد WCAG أو تحقق قارئ شاشة بشري.
- لم يُنشر الموقع أو تتغير إعدادات الوصول. الناتج الجاهز `dist/` و`portfolio-static.zip`.

للتشغيل: `npm.cmd start` ثم `http://127.0.0.1:8017/ar/`.
للبناء: `npm.cmd run build`. للمعاينة الإنتاجية: `npm.cmd run preview`.
للنشر، ارفع محتويات `dist/` إلى المضيف الحالي أو استخدم إعدادات Vercel الموجودة
(`npm run build` ومجلد `dist`). لا تُرفع مجلدات البيانات الداخلية أو التقارير.

## مصدر الصورة المولدة

أداة الإنشاء: imagegen المدمجة، دون API أو CLI خارجي. الصورة للزينة فقط.
الملفات النهائية: `assets/images/developer-workspace.webp` و
`assets/images/developer-workspace-800.webp`. لم تُستبدل صور المشاريع أو الصورة الشخصية.

النص المستخدم:

> Use case: photorealistic-natural. Asset type: decorative developer portfolio hero photograph, not a website screenshot. Create a premium cinematic wide 1536x1024 photograph of a software developer's desk at night. Open dark silver laptop at three-quarter angle showing an abstract syntax highlighted code editor (no readable paragraphs), matte black over-ear headphones to the right, small white ceramic coffee cup and a few technical books to the left, leafy plant at upper left, warm desk lamp illuminating wood, dark navy room with blue/cyan ambient light and a very subtle glowing code bracket symbol on distant monitor. Rich realistic materials, sharp laptop, shallow background depth, tasteful professional studio photography, dark edges fade into #080F18. Composition laptop centrally weighted to left, enough breathing room, restrained cyan accents, no people, no logos, no watermarks, no website layout, no titles, no buttons, no UI overlay outside laptop.
