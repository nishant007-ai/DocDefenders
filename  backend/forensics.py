import cv2, numpy as np

def error_level_analysis(img, quality=90):
    temp = "temp.jpg"
    cv2.imwrite(temp, img, [cv2.IMWRITE_JPEG_QUALITY, quality])
    compressed = cv2.imread(temp)
    ela = cv2.absdiff(img, compressed)
    return ela

def run_forensics(images):
    evidence = []
    for idx, im in enumerate(images):
        ela = error_level_analysis(im["color"])
        score = float(np.mean(ela)) / 255.0
        evidence.append({
            "type": "ela",
            "page": idx+1,
            "score": score,
            "note": "Basic ELA demo score"
        })
    return {"evidence": evidence}
