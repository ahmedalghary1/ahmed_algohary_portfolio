"""Create a separate ATS-friendly review draft. Never changes the live CV.

Optional authoring tool: requires ReportLab. Not part of the deployment build.
Contact values follow the original CV pending owner confirmation.
"""
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / 'output/pdf/ahmed-algohary-cv-review.pdf'


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4, rightMargin=42, leftMargin=42,
                            topMargin=32, bottomMargin=30,
                            title='Ahmed Algohary - CV review draft', author='Ahmed Algohary')
    base = ParagraphStyle('body', fontName='Helvetica', fontSize=9.5, leading=13.3,
                          textColor=colors.HexColor('#202020'), spaceAfter=5, alignment=TA_LEFT)
    title = ParagraphStyle('name', parent=base, fontName='Helvetica-Bold', fontSize=24, leading=28, spaceAfter=5)
    heading = ParagraphStyle('heading', parent=base, fontName='Helvetica-Bold', fontSize=10, leading=14, spaceBefore=11, spaceAfter=6)
    role = ParagraphStyle('role', parent=base, fontName='Helvetica-Bold', fontSize=10, leading=14, spaceBefore=5)
    note = ParagraphStyle('note', parent=base, fontSize=8, leading=11, textColor=colors.HexColor('#7c251b'), spaceAfter=9)
    story = []
    def p(text, style=base):
        story.append(Paragraph(text, style))
    def section(text):
        p(text, heading)
        story.append(HRFlowable(width='100%', thickness=.5, color=colors.HexColor('#bcbcb5'), spaceAfter=5))

    p('REVIEW DRAFT - not the published website download. Confirm contact details and current role status before use.', note)
    p('Ahmed Algohary', title)
    p('Full-Stack Python Developer', role)
    p('+201552810113 | <link href="mailto:ahmedalgohary1170@gmail.com">ahmedalgohary1170@gmail.com</link>')
    p('<link href="https://www.ahmedalgohary.com/">www.ahmedalgohary.com</link> | '
      '<link href="https://github.com/ahmedalgohary1170">github.com/ahmedalgohary1170</link> | '
      '<link href="https://www.linkedin.com/in/ahmed-algohary-124396396/">LinkedIn</link>')
    section('PROFILE')
    p('Software developer focused on websites, e-commerce and business management systems. '
      'Experience with Python, Django, REST APIs, relational databases and modern web interfaces.')
    section('PROFESSIONAL EXPERIENCE')
    p('ROCKS ELECTRIC - Full-Stack Developer', role)
    p('Started February 2025 | End date/current status requires confirmation', note)
    p('Worked on a Django and React SaaS platform, database structure and cloud deployment pipelines.')
    p('VIVEM COMPANY - Backend Developer | July 2024 - January 2025', role)
    p('Developed REST APIs using Django REST Framework and PostgreSQL schemas. Implemented JWT authentication '
      'and role-based access control; integrated Redis caching and Celery background tasks with frontend teams.')
    section('SELECTED PROJECTS')
    p('Garment factory management system - Private company system', role)
    p('Arabic operational dashboard connecting sales, purchasing, inventory and accounts. Public case study uses a redacted screenshot.')
    p('<link href="https://www.ahmedalgohary.com/projects/garment-factory/">ahmedalgohary.com/projects/garment-factory/</link>')
    p('ROCKS EV - E-commerce website', role)
    p('Storefront presenting EV charging products, product navigation, buying guidance and customer support paths.')
    p('<link href="https://rocks-ev.com/">rocks-ev.com</link>')
    p('Company and professional websites', role)
    p('Bonyan, Ahmed Nabil and Ahmed Gamal: company information, professional profiles, CV access and contact journeys. '
      'Case studies: <link href="https://www.ahmedalgohary.com/#work">ahmedalgohary.com/#work</link>.')
    section('CORE SKILLS')
    p('<b>Backend:</b> Python, Django, Django REST Framework, FastAPI, REST APIs<br/>'
      '<b>Interfaces:</b> JavaScript, React, HTML, CSS<br/>'
      '<b>Data and delivery:</b> PostgreSQL, Redis, Celery, Docker, Git, GitHub Actions')
    section('TRAINING &amp; EDUCATION')
    p('<b>CODE4LEARN - Python Full-Stack Advanced Bootcamp</b> | June 2023 - January 2025<br/>'
      'Training in APIs, databases, frontend development, testing and deployment.')
    p('<b>Advanced Industrial Art School - Electronics Department</b> | September 2020 - May 2025')
    section('LANGUAGES')
    p('Arabic: Native | English: Intermediate')
    story.append(Spacer(1,6))
    p('Review note: phone and GitHub above follow the original CV. The website uses a different phone and GitHub account. '
      'Original CV is retained unchanged; employment continuity and current education status are not assumed.', note)
    doc.build(story)
    print(f'Created {OUTPUT.relative_to(ROOT)} (review only).')


if __name__ == '__main__':
    main()
