import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 }
  });
  
  try {
    console.log('Navigating to localhost:5173...');
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    
    console.log('Switching to Google Stitch...');
    await page.click('button:has-text("GOOGLE STITCH")');
    await page.waitForTimeout(500);

    console.log('Clicking Prueba 1...');
    await page.click('button:has-text("Adulteración y pH")');
    
    // Wait for the animation to finish
    await page.waitForTimeout(1000);
    
    console.log('Taking screenshot...');
    await page.screenshot({ path: 'snapshot_stitch.png' });
    console.log('Screenshot saved to snapshot_stitch.png');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();