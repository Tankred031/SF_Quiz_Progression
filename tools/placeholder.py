from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, os

W, H = 220, 300
S = 4
w, h = W * S, H * S

img = Image.new("RGBA", (w, h), (0, 0, 0, 0))

# Rounded mask
radius = 16 * S
mask = Image.new("L", (w, h), 0)
mask_draw = ImageDraw.Draw(mask)
mask_draw.rounded_rectangle((0, 0, w - 1, h - 1), radius=radius, fill=255)

def lerp(a, b, t):
    return int(a + (b - a) * t)

def blend(c1, c2, t):
    return tuple(lerp(c1[i], c2[i], t) for i in range(4))

# Background
top = (12, 35, 58, 255)
mid = (9, 20, 36, 255)
bottom = (5, 7, 13, 255)
cyan = (103, 232, 249, 255)
amber = (250, 204, 21, 255)

bg = Image.new("RGBA", (w, h), (0, 0, 0, 0))
pix = bg.load()

cx1, cy1 = w * 0.25, h * 0.08
cx2, cy2 = w * 0.82, h * 0.82

for y in range(h):
    for x in range(w):
        v = y / h
        c = blend(top, mid, min(v / 0.55, 1)) if v < 0.55 else blend(mid, bottom, (v - 0.55) / 0.45)

        d1 = math.sqrt(((x - cx1) / w) ** 2 + ((y - cy1) / h) ** 2)
        d2 = math.sqrt(((x - cx2) / w) ** 2 + ((y - cy2) / h) ** 2)

        g1 = max(0, 1 - d1 * 3.0)
        g2 = max(0, 1 - d2 * 3.8)

        c = blend(c, cyan, g1 * 0.17)
        c = blend(c, amber, g2 * 0.08)

        pix[x, y] = c

img = Image.composite(bg, img, mask)

# Vignette
vignette = Image.new("RGBA", (w, h), (0, 0, 0, 0))
vp = vignette.load()
for y in range(h):
    for x in range(w):
        nx = (x - w / 2) / (w / 2)
        ny = (y - h / 2) / (h / 2)
        d = min(1, math.sqrt(nx * nx + ny * ny))
        a = int(max(0, (d - 0.35) / 0.65) * 120)
        vp[x, y] = (0, 0, 0, a)

img = Image.alpha_composite(img, Image.composite(vignette, Image.new("RGBA", (w, h), (0, 0, 0, 0)), mask))

# Soft central panel glow
glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow)
for r, a in [(90, 14), (65, 24), (42, 34)]:
    gd.ellipse(
        (w / 2 - r * S, h / 2 - r * S, w / 2 + r * S, h / 2 + r * S),
        fill=(103, 232, 249, a)
    )
glow = glow.filter(ImageFilter.GaussianBlur(8 * S))
img = Image.alpha_composite(img, glow)

draw = ImageDraw.Draw(img)

# Border
draw.rounded_rectangle((1*S, 1*S, w-2*S, h-2*S), radius=radius, outline=(103, 232, 249, 80), width=1*S)
draw.rounded_rectangle((12*S, 12*S, w-13*S, h-13*S), radius=12*S, outline=(103, 232, 249, 90), width=1*S)

# Corner details
corner_col = (103, 232, 249, 115)
l = 24 * S
p = 22 * S
for sx, sy in [(1,1), (-1,1), (1,-1), (-1,-1)]:
    x0 = p if sx == 1 else w - p
    y0 = p if sy == 1 else h - p
    draw.line((x0, y0, x0 + sx * l, y0), fill=corner_col, width=1*S)
    draw.line((x0, y0, x0, y0 + sy * l), fill=corner_col, width=1*S)

# Scanlines
for y in range(0, h, 5*S):
    draw.line((0, y, w, y), fill=(255, 255, 255, 9), width=1*S)

# Diagonal placeholder grid
grid = Image.new("RGBA", (w, h), (0, 0, 0, 0))
grid_draw = ImageDraw.Draw(grid)
for x in range(-h, w, 28*S):
    grid_draw.line((x, h, x+h, 0), fill=(103, 232, 249, 25), width=1*S)
for x in range(0, w+h, 28*S):
    grid_draw.line((x, 0, x-h, h), fill=(250, 204, 21, 13), width=1*S)
grid = Image.composite(grid, Image.new("RGBA", (w, h), (0,0,0,0)), mask)
img = Image.alpha_composite(img, grid)
draw = ImageDraw.Draw(img)

# Center icon: simple image placeholder frame
icon_w, icon_h = 88*S, 62*S
ix0, iy0 = w//2 - icon_w//2, h//2 - icon_h//2 - 12*S
ix1, iy1 = ix0 + icon_w, iy0 + icon_h

draw.rounded_rectangle((ix0, iy0, ix1, iy1), radius=8*S, fill=(0, 0, 0, 70), outline=(103, 232, 249, 150), width=2*S)
draw.ellipse((ix0+10*S, iy0+10*S, ix0+22*S, iy0+22*S), fill=(250, 204, 21, 180))
draw.polygon(
    [
        (ix0+10*S, iy1-8*S),
        (ix0+34*S, iy0+34*S),
        (ix0+50*S, iy1-8*S),
    ],
    fill=(103, 232, 249, 110)
)
draw.polygon(
    [
        (ix0+35*S, iy1-8*S),
        (ix0+58*S, iy0+30*S),
        (ix1-8*S, iy1-8*S),
    ],
    fill=(250, 204, 21, 70)
)

# Fonts
def load_font(size, bold=False):
    paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for path in paths:
        if os.path.exists(path):
            return ImageFont.truetype(path, size * S)
    return ImageFont.load_default()

font_title = load_font(14, True)
font_sub = load_font(9, True)
font_code = load_font(8, False)

def center_text(y, text, font, fill):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text((w/2 - tw/2, y - th/2), text, font=font, fill=fill)

center_text(55*S, "PLACEHOLDER", font_title, (150, 238, 255, 230))
center_text(205*S, "PRIVATE REWARD IMAGE", font_sub, (253, 230, 138, 210))
center_text(222*S, "NOT INCLUDED ON GIT", font_sub, (220, 247, 255, 165))
center_text(258*S, "reward-M-W.png", font_code, (140, 230, 255, 130))

# Save
img = img.resize((W, H), Image.Resampling.LANCZOS)
out = "/mnt/data/placeholder.png"
img.save(out)
out
