import os

# Files to scan for legibility fixes
files = [
    r"d:\Websites\Echoes v1.1\src\app\episode\op-01\page.tsx",
    r"d:\Websites\Echoes v1.1\src\app\episode\op-01\transcript\page.tsx",
    r"d:\Websites\Echoes v1.1\src\app\the-opponents\page.tsx"
]

reps = [
    # General bg-[#00E5FF] with text-wtf-black needs to be text-black
    ("bg-[#00E5FF] text-wtf-black", "bg-[#00E5FF] text-black"),
    ("text-wtf-black bg-[#00E5FF]", "text-black bg-[#00E5FF]"),

    # The outer Project Silverback container
    ("bg-[#00E5FF] border-y-4 border-wtf-black text-wtf-black", "bg-[#00E5FF] border-y-4 border-wtf-black text-black"),
    
    # The inner "The Protocol" card resetting to text-wtf-black
    ("bg-wtf-white border-4 border-wtf-black shadow-[8px_8px_0px_#000]", "bg-wtf-white text-wtf-black border-4 border-wtf-black shadow-[8px_8px_0px_#000]"),

    # Polaroid images replacements in op-01/page.tsx
    ('image: "/images/guests/vic-williamson.png"', 'image: "/images/guests/vic.avif"'),
    ('{ name: "The Opponents", role: "Podcast Platform", rotation: "rotate(4deg) translateY(-8px)", image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=400&h=400" }',
     '{ name: "Iona", role: "Podcast Host", rotation: "rotate(4deg) translateY(-8px)", image: "/images/guests/iona.jpg" }')
]

for fpath in files:
    if os.path.exists(fpath):
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        for old, new in reps:
            content = content.replace(old, new)

        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {fpath}")
