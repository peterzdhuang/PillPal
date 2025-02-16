import os
from dotenv import load_dotenv
import json
import requests
from pprint import pprint

load_dotenv()

def complete(prompt, text_input):
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.environ.get('OPENAI_API_KEY')}",
    }

    payload = {
        "model": "gpt-4o-mini-2024-07-18",
        "temperature": 0,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": f"{prompt}\n\nReceipt Text:\n{text_input}",
                    },
                ],
            }
        ],
        "max_tokens": 1000,
    }

    response = requests.post(
        "https://api.openai.com/v1/chat/completions", 
        headers=headers, 
        json=payload
    )

    try:
        response.raise_for_status()
        response_data = response.json()

        if 'choices' in response_data and response_data['choices']:
            content = response_data["choices"][0]["message"]["content"]
            print(content)
            print(json.loads(content))
            return json.loads(content)
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def analyze_text(receipt_text):
    prompt = """
    Analyze the provided pill prescription text. Identify the pill name, number of pills, frequency of pill ingestion, 
    directions to take the pill, refills remaining, the address of the pharmacy, date, and the pharmacy name.
    Input "" if the field doesn't exist.
    Output in this JSON format:
    {
        "pharmacy_name": "[pharmacy name]",
        "address" : "[address of the pharmacy]",
        "pill_name": "[pill name]",
        "date" : ["date"]
        "number_of_pills": [number/quantity of pills],
        "frequency" : "[frequency of pill ingestion]",
        "directions" : "[direction to take the pill including when]",
        "refills" : ["refills remaining"]
    }
    Return ONLY valid JSON starting with '{'. Ensure proper JSON formatting.
    """
    
    response = complete(prompt, receipt_text)
    
    if response:
        print("Backend repsonse:", response)
    return response

if __name__ == "__main__":
    test_prescription_text = """
    PHARMACY: City Pharmacy
    ADDRESS: 123 Main St, Springfield, ST 12345
    DATE: 2023-11-15

    PRESCRIPTION DETAILS:
    Patient: John Doe
    Medication: Lisinopril 10mg tablets
    Quantity: 30
    Directions: Take one tablet by mouth daily in the morning
    Refills Remaining: 3
    Prescribing Physician: Dr. Sarah Smith

    ADDITIONAL INFO:
    This medication should be taken with food
    Pharmacy Phone: (555) 123-4567
    """

    result = analyze_text(test_prescription_text)
    if result:
        print("\nFull JSON Output:")
        pprint(result)