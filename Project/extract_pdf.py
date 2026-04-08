import PyPDF2

with open('Advanced_Midterm_Project_AdFlow_Pro.pdf', 'rb') as file:
    reader = PyPDF2.PdfReader(file)
    text = ''
    for page in reader.pages:
        text += page.extract_text()
print(text)