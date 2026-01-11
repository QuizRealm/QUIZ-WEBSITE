import time
import random
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

def check_deep_rank(keyword, my_domain, max_pages=5):
    # Setup Chrome options
    options = webdriver.ChromeOptions()
    # options.add_argument("--headless") 
    
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    try:
        print(f"--- Searching for '{keyword}' ---")
        
        # 1. Go to Google
        driver.get("https://www.google.com")
        time.sleep(random.uniform(2, 4))
        
        # 2. Search
        try:
            search_box = driver.find_element(By.NAME, "q")
            search_box.send_keys(keyword)
            time.sleep(random.uniform(0.5, 1.5))
            search_box.send_keys(Keys.RETURN)
        except:
            print("Could not find search box. Google might have served a different layout.")
            return

        time.sleep(random.uniform(3, 5))
        
        found = False
        current_page = 1
        
        # --- THE LOOP ---
        while current_page <= max_pages:
            print(f"Scanning Page {current_page}...")
            
            # Get all links
            search_results = driver.find_elements(By.CSS_SELECTOR, 'div.g')
            
            # Check results on this page
            for index, result in enumerate(search_results, start=1):
                try:
                    link_element = result.find_element(By.TAG_NAME, "a")
                    url = link_element.get_attribute("href")
                    
                    if my_domain in url:
                        # Math to calculate absolute rank across pages
                        # (This assumes 10 results per page, which varies)
                        approx_rank = ((current_page - 1) * 10) + index
                        
                        print(f"\n★ SUCCESS! Found {my_domain}")
                        print(f"  • Page: {current_page}")
                        print(f"  • Position on page: {index}")
                        print(f"  • Approx Total Rank: {approx_rank}")
                        print(f"  • URL: {url}\n")
                        found = True
                        break # Break the inner loop (results)
                except:
                    continue
            
            if found:
                break # Break the outer loop (pages)
            
            # Logic to go to the Next Page
            if current_page < max_pages:
                try:
                    # Look for the "Next" button (id="pnnext" is the standard ID for the Next button)
                    next_button = driver.find_element(By.ID, "pnnext")
                    
                    # Scroll to bottom to make it look human
                    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                    time.sleep(random.uniform(1, 3))
                    
                    next_button.click()
                    current_page += 1
                    
                    # IMPORTANT: Wait for next page to load
                    time.sleep(random.uniform(4, 7)) 
                    
                except:
                    print("End of results reached (No 'Next' button found).")
                    break
            else:
                break

        if not found:
            print(f"Result: {my_domain} not found in the first {max_pages} pages.")
            
    except Exception as e:
        print(f"An error occurred: {e}")
        
    finally:
        print("Closing browser...")
        driver.quit()

if __name__ == "__main__":
    target_domain = "thequizrealm.com"
    search_keyword = "best online quiz website"
    
    # CHANGE THIS NUMBER to check more pages (e.g., 50)
    # WARNING: Setting this to 50 increases risk of IP Ban
    pages_to_check = 5 
    
    check_deep_rank(search_keyword, target_domain, pages_to_check)