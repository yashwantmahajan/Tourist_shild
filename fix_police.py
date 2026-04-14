#!/usr/bin/env python3
"""Quick fix for police dashboard template"""

# Read police dashboard
with open('templates/police_dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix line 3 - add missing {% endblock %}
content = content.replace(
    '{% block title %}Police Command Center - Smart Tourist Shield AI\r\n\r\n{% block extra_css %}',
    '{% block title %}Police Command Center - Smart Tourist Shield AI{% endblock %}\r\n\r\n{% block extra_css %}'
)

# Find and close extra_css block before content block
import re
content = re.sub(
    r'(</style>\r?\n)(\r?\n)({% block content %})',
    r'\1{% endblock %}\2\3',
    content
)

# Find and close content block before extra_js block
content = re.sub(
    r'(</button>\r?\n)({% block extra_js %})',
    r'\1{% endblock %}\n\n\2',
    content
)

# Ensure extra_js block is closed at end
if not content.rstrip().endswith('{% endblock %}'):
    content = content.rstrip() + '\n{% endblock %}\n'

# Write back
with open('templates/police_dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Police dashboard fixed!")

# Validate
from jinja2 import Environment, FileSystemLoader
env = Environment(loader=FileSystemLoader('templates'))
try:
    env.get_template('police_dashboard.html')
    print("✅ Template validation: PASSED")
except Exception as e:
    print(f"❌ Template validation: FAILED - {e}")
