import os
import re

for root, _, files in os.walk('.'):
    if 'node_modules' in root: continue
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            if 'UNKNOWN' in content:
                new_content = content.replace("import { useTheme } from 'UNKNOWN';", "import { useTheme } from '../../../src/stores/theme';")
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Fixed {filepath}")
