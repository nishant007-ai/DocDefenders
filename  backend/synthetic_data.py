import cv2, numpy as np, random

def add_noise(img):
    noise = np.random.normal(0,25,img.shape).astype(np.uint8)
    return cv2.add(img, noise)

def fake_signature(img):
    cv2.rectangle(img, (50,50), (150,100), (0,0,0), -1)
    return img

def generate_synthetic(img_path, out_path):
    img = cv2.imread(img_path)
    choice = random.choice([add_noise, fake_signature])
    out = choice(img.copy())
    cv2.imwrite(out_path, out)
