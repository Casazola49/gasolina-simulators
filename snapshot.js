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
    
    console.log('Clicking Prueba 1...');
    // Click the button for Prueba 1
    await page.click('button:has-text("Adulteración y pH")');
    
    // Wait for the animation to finish
    await page.waitForTimeout(1000);
    
    console.log('Taking screenshot...');
    await page.screenshot({ path: 'snapshot.png' });
    console.log('Screenshot saved to snapshot.png');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();