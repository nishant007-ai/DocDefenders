import cv2
from pdf2image import convert_from_path
import numpy as np

def preprocess_file(filepath):
    images = []
    try:
        pages = convert_from_path(filepath, dpi=300)
    except:
        # Not a PDF, try image
        pages = [filepath]

    for p in pages:
        img = np.array(p) if not isinstance(p, str) else cv2.imread(p)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, binarized = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        images.append({
            "color": img,
            "binarized": binarized
        })
    return images
