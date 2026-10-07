import asyncio,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1700,'height':1000},device_scale_factor=2)
        msgs=[]; pg.on('console',lambda m:msgs.append(m.text)); pg.on('pageerror',lambda e:msgs.append(str(e)))
        await pg.goto('file:///home/claude/ui/ui.html'); await pg.add_style_tag(content='body{background:transparent !important}'); await pg.wait_for_timeout(600)
        ids=await pg.eval_on_selector_all('.shot','els=>els.map(e=>e.id)')
        only=sys.argv[1:]
        for i in ids:
            if only and i not in only: continue
            await pg.locator('#'+i).screenshot(path=f'out/{i}.png',omit_background=True)
        print(len(ids),'shots',msgs)
        await b.close()
asyncio.run(main())
