import asyncio,sys
from playwright.async_api import async_playwright
async def main(html,pairs,scale=2,vw=1200):
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':vw,'height':900},device_scale_factor=scale)
        await pg.goto('file://'+html); await pg.wait_for_timeout(400)
        for sel,out in pairs:
            await pg.locator(sel).screenshot(path=out)
        await b.close()
if __name__=='__main__':
    html=sys.argv[1]; pairs=[a.split('=') for a in sys.argv[2:]]
    asyncio.run(main(html,pairs))
