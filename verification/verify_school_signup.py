from playwright.sync_api import sync_playwright, expect
import time

def test_school_signup(page):
    page.add_init_script("""
        localStorage.setItem('mindflow-settings', JSON.stringify({
            state: {
                targetAudience: 'school',
                schoolOnboardingSeen: false
            },
            version: 1
        }));
    """)
    page.goto("http://localhost:4173/MindFlow/")
    page.wait_for_timeout(2000)
    page.screenshot(path="verification/school_debug.png")
    print("Screenshot saved to verification/school_debug.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        try:
            test_school_signup(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
