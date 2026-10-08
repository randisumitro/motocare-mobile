import os
import re

def update_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Skip if already imported
    if 'useTheme' in content and '@react-navigation/native' in content:
        return

    # 1. Add imports if we need them
    if 'StyleSheet.create' in content:
        if 'import { useTheme }' not in content:
            content = re.sub(r"import (.*?) from 'react-native';", r"import \1 from 'react-native';\nimport { useTheme } from '@react-navigation/native';", content)
        
        # 2. Inject useTheme into the main component
        # Find the default export function
        match = re.search(r'export default function (\w+)\((.*?)\)\s*{', content)
        if match:
            component_name = match.group(1)
            params = match.group(2)
            injection = f"export default function {component_name}({params}) {{\n  const {{ colors, dark }} = useTheme();\n"
            content = content.replace(f"export default function {component_name}({params}) {{", injection)

            # 3. Replace static styles in JSX with dynamic ones
            # Example: style={styles.container} -> style={[styles.container, { backgroundColor: colors.background }]}
            content = re.sub(r'style=\{styles\.container\}', r'style={[styles.container, { backgroundColor: colors.background }]}', content)
            content = re.sub(r'style=\{styles\.card\}', r'style={[styles.card, { backgroundColor: colors.card }]}', content)
            content = re.sub(r'style=\{styles\.title\}', r'style={[styles.title, { color: colors.text }]}', content)
            content = re.sub(r'style=\{styles\.name\}', r'style={[styles.name, { color: colors.text }]}', content)
            content = re.sub(r'style=\{styles\.greeting\}', r'style={[styles.greeting, { color: colors.text }]}', content)
            
            with open(filepath, 'w') as f:
                f.write(content)
            print(f"Updated {filepath}")

for root, _, files in os.walk('app'):
    for file in files:
        if file.endswith('.tsx'):
            update_file(os.path.join(root, file))

for root, _, files in os.walk('src/components'):
    for file in files:
        if file.endswith('.tsx'):
            update_file(os.path.join(root, file))

