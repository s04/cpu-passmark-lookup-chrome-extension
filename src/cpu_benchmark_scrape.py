import requests
from bs4 import BeautifulSoup
import json

def scrape_cpu_benchmarks(url):
    # Sending a GET request to the webpage
    response = requests.get(url)
    response.raise_for_status()  # This will raise an exception for HTTP errors

    # Parsing the HTML content
    soup = BeautifulSoup(response.text, 'html.parser')

    # Finding the table - you might need to adjust this selector based on the actual table structure
    table = soup.find('table', id='cputable')  # Adjust if the table has a specific ID or class
    
    # Initializing the list to store data
    data = []

    # Assuming the first row is the header and the rest are data rows
    headers = [header.text.strip() for header in table.find('thead').find_all('th')]
    for row in table.find('tbody').find_all('tr'):
        cols = row.find_all('td')
        if cols:
            # Creating a dictionary for each row
            item = {headers[i]: cols[i].text.strip() for i in range(len(cols))}
            data.append(item)

    return data

# URL of the webpage containing the CPU table
url = 'https://www.cpubenchmark.net/cpu_list.php'
# Scraping the table
cpu_data = scrape_cpu_benchmarks(url)

# Save the data into a JSON file
with open('cpu_benchmarks.json', 'w') as file:
    json.dump(cpu_data, file, indent=4)

print("Data has been saved to 'cpu_benchmarks.json'")
