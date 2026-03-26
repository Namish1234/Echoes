import os

files = [
    r"d:\Websites\Echoes v1.1\src\app\the-opponents\page.tsx",
    r"d:\Websites\Echoes v1.1\src\app\episode\op-01\page.tsx",
    r"d:\Websites\Echoes v1.1\src\app\episode\op-01\transcript\page.tsx",
    r"d:\Websites\Echoes v1.1\src\components\LandingPage.tsx",
    r"d:\Websites\Echoes v1.1\src\app\podcasts\page.tsx"
]

reps = [
    (" dark:bg-bg-dark", ""),
    (" dark:text-wtf-white", ""),
    (" dark:border-wtf-white", ""),
    (" dark:shadow-[4px_4px_0px_var(--text-primary)]", ""),
    (" dark:shadow-[4px_4px_0px_#111]", ""),
    (" dark:shadow-[12px_12px_0px_#333]", ""),
    (" dark:opacity-10", ""),
    ("bg-[#00E5FF] text-wtf-black border-[#00E5FF]", "bg-wtf-black text-wtf-white border-wtf-black"),
    ("bg-[#00E5FF] text-black", "bg-wtf-black text-wtf-white"),
    ("bg-wtf-white dark:bg-bg-dark text-wtf-black dark:text-wtf-white border-wtf-black dark:border-wtf-white", "bg-wtf-white text-wtf-black border-wtf-black"),
    (" dark:shadow-[4px_4px_0px_#333]", ""),
    ("text-wtf-black dark:text-wtf-white", "text-wtf-black"),
    ("bg-wtf-white dark:bg-bg-dark", "bg-wtf-white"),
    ("border-wtf-black dark:border-wtf-white", "border-wtf-black"),
    ("bg-wtf-black text-wtf-white dark:bg-wtf-white dark:text-wtf-black", "bg-wtf-black text-wtf-white"),
    ("text-[#00E5FF] dark:text-[#00E5FF]", "text-[#00E5FF]"),
    ("<Image", "<img"),
    ("</Image>", "</img>"),
    ("fill ", ""),
    ("objectFit=\"cover\"", "style={{ objectFit: 'cover', width: '100%', height: '100%' }}"),
    ("import Image from 'next/image';\n", "")
]

for fpath in files:
    if os.path.exists(fpath):
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        for old, new in reps:
            content = content.replace(old, new)
            
        # Grid fix for the-opponents
        if "repeating-linear-gradient" in content:
            start_str = '{/* Finish Line Checkered Grid Background */}'
            end_str = '</div>'
            s_idx = content.find(start_str)
            if s_idx != -1:
                e_idx = content.find(end_str, s_idx) + len(end_str)
                grid_div = "{/* Decorative Grid Pattern layered behind */}\n          <div className=\"absolute inset-0 opacity-10\" style={{ backgroundImage: 'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>"
                content = content[:s_idx] + grid_div + content[e_idx:]

        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {fpath}")
