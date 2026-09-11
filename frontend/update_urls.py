import os
import glob
import re

dir_path = r'c:\Users\Admin\QuanLyDongTienWeb\frontend\src'
pattern = re.compile(r"'https://quanlydongtien\.onrender\.com(.*?)'")
pattern2 = re.compile(r'"https://quanlydongtien\.onrender\.com(.*?)"')
pattern3 = re.compile(r'`https://quanlydongtien\.onrender\.com(.*?)`')

for filepath in glob.glob(dir_path + '/**/*.jsx', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Single quotes
    content = pattern.sub(r'`${import.meta.env.VITE_API_URL}\1`', content)
    # Double quotes
    content = pattern2.sub(r'`${import.meta.env.VITE_API_URL}\1`', content)
    # Template literals
    content = pattern3.sub(r'`${import.meta.env.VITE_API_URL}\1`', content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {filepath}')
