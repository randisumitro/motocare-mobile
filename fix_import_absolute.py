import os

target_path = os.path.abspath('src/stores/theme')

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # We need to replace ANY import { useTheme } from '.../stores/theme' with the precise relative path
    if 'import { useTheme }' in content:
        # Calculate correct relative path
        file_dir = os.path.dirname(os.path.abspath(filepath))
        rel_path = os.path.relpath(target_path, file_dir)
        
        # Avoid backslashes on Windows, ensure forward slashes
        rel_path = rel_path.replace('\\', '/')
        
        # Ensure it starts with ./ or ../
        if not rel_path.startswith('.'):
            rel_path = './' + rel_path

        import re
        new_content = re.sub(r"import\s+\{\s*useTheme\s*\}\s+from\s+['\"].*?theme['\"];", f"import {{ useTheme }} from '{rel_path}';", content)
        
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed {filepath} -> {rel_path}")

for root, _, files in os.walk('.'):
    if 'node_modules' in root: continue
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            fix_file(os.path.join(root, file))

