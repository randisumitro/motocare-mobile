import os

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Determine correct relative path to theme.ts
    depth = filepath.count('/')
    if depth == 1: # app/file.tsx
        rel = './src/stores/theme'
    elif depth == 2: # app/(app)/file.tsx
        rel = '../../src/stores/theme'
    elif depth == 3: # app/(app)/expenses/file.tsx
        rel = '../../../src/stores/theme'
    elif 'src/components/ui' in filepath:
        rel = '../../stores/theme'
    elif 'src/components' in filepath:
        rel = '../stores/theme'
    else:
        rel = 'UNKNOWN'

    if '@react-navigation/native' in content and 'import { useTheme }' in content:
        new_content = content.replace("import { useTheme } from '@react-navigation/native';", f"import {{ useTheme }} from '{rel}';")
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

for root, _, files in os.walk('.'):
    if 'node_modules' in root: continue
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            fix_file(os.path.join(root, file))

