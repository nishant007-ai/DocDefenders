from PyPDF2 import PdfReader

def parse_pdf(filepath):
    metadata = {}
    fonts = []
    try:
        reader = PdfReader(filepath)
        metadata = reader.metadata
        for page in reader.pages:
            if "/Font" in page.get("/Resources", {}):
                fonts.append(page["/Resources"]["/Font"].keys())
    except Exception as e:
        metadata["error"] = str(e)

    return {
        "metadata": dict(metadata),
        "fonts": fonts
    }
