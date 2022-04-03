import numpy as np
import cv2
import pandas as pd
import matplotlib.pyplot as plt


def increase_brightness(img, value=30):
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)

    lim = 360 - value
    h[h > lim] = 360
    h[h <= lim] += value

    final_hsv = cv2.merge((h, s, v))
    img = cv2.cvtColor(final_hsv, cv2.COLOR_HSV2BGR)
    return img


# read image
img = cv2.imread('python/assets/mick.png')
img = cv2.resize(img, (600, 600))

# Generate Grey Value Image
grey = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

# Show Images
plt.figure(figsize=(20, 5))

# ---Row 1---
original = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
plt.subplot(3, 5, 1), plt.imshow(original)
plt.title('Fake Mick'), plt.xticks([]), plt.yticks([])

plt.subplot(3, 5, 2), plt.imshow(grey, cmap='gray')
plt.title('Grey'), plt.xticks([]), plt.yticks([])

plt.subplot(3, 5, 3), plt.hist(grey.ravel(), 256, [0, 256])
plt.title('Histogram'), plt.xticks([]), plt.yticks([])

equalizedHist = cv2.equalizeHist(grey)
plt.subplot(3, 5, 4), plt.imshow(equalizedHist, cmap='gray')
plt.title('Histogram Equalization'), plt.xticks([]), plt.yticks([])

plt.subplot(3, 5, 5), plt.hist(equalizedHist.ravel(), 256, [0, 256])
plt.title('Histogram after Equalization'), plt.xticks([]), plt.yticks([])

# ---Row 2---
mean_blur = cv2.blur(equalizedHist, (5, 5))
plt.subplot(3, 5, 7), plt.imshow(mean_blur, cmap='gray')
plt.title('Mean Blur'), plt.xticks([]), plt.yticks([])

mean_blur_2x = cv2.blur(equalizedHist, (10, 10))
plt.subplot(3, 5, 8), plt.imshow(mean_blur_2x, cmap='gray')
plt.title('Mean Blur (2x)'), plt.xticks([]), plt.yticks([])

median_blur = cv2.medianBlur(equalizedHist, 5)
plt.subplot(3, 5, 9), plt.imshow(median_blur, cmap='gray')
plt.title('Median Blur'), plt.xticks([]), plt.yticks([])

gauss_blur = cv2.GaussianBlur(equalizedHist, (5, 5), 0)
plt.subplot(3, 5, 10), plt.imshow(gauss_blur, cmap='gray')
plt.title('Gaussian Blur'), plt.xticks([]), plt.yticks([])

# ---Row 3---
# laplace = cv2.Laplacian(gauss_blur, cv2.CV_64F)
# plt.subplot(3, 5, 11), plt.imshow(laplace, cmap='gray')
# plt.title('Laplacian'), plt.xticks([]), plt.yticks([])

# plt.subplot(3, 5, 11), plt.imshow(original)
# plt.title('Fake Mick'), plt.xticks([]), plt.yticks([])

mick_hsv = cv2.cvtColor(original, cv2.COLOR_RGB2HSV)
plt.subplot(3, 5, 12), plt.imshow(mick_hsv)
plt.title('Zombified Mick'), plt.xticks([]), plt.yticks([])

lsd_mick = cv2.applyColorMap(gauss_blur, cv2.COLORMAP_JET)
plt.subplot(3, 5, 13), plt.imshow(lsd_mick)
plt.title('LSD Mick'), plt.xticks([]), plt.yticks([])

smurf_mick = increase_brightness(img, 5)
plt.subplot(3, 5, 14), plt.imshow(smurf_mick)
plt.title('Smurf Mick'), plt.xticks([]), plt.yticks([])

blood_lo = np.array([0, 130, 32])
blood_hi = np.array([10, 180, 140])
blood_mask = cv2.inRange(mick_hsv, blood_lo, blood_hi)
original[blood_mask > 0] = (234, 220, 192)
plt.subplot(3, 5, 15), plt.imshow(original)
plt.title('Actual Mick'), plt.xticks([]), plt.yticks([])

# laplace_thr_bin, dst = cv2.threshold(img, 127, 255, cv2.THRESH_BINARY)
# plt.subplot(3, 5, 13), plt.imshow(laplace_thr_bin, cmap='gray')
# plt.title('Laplacian [Binary]'), plt.xticks([]), plt.yticks([])

# laplace_thr_trunc = cv2.threshold(laplace, 127, 255, cv2.THRESH_TRUNC)
# plt.subplot(3, 5, 14), plt.imshow(laplace_thr_trunc, cmap='gray')
# plt.title('Laplacian [Trunc]'), plt.xticks([]), plt.yticks([])

# laplace_thr_tozero = cv2.threshold(laplace, 127, 255,  cv2.THRESH_TOZERO)
# plt.subplot(3, 5, 15), plt.imshow(laplace_thr_trunc, cmap='gray')
# plt.title('Laplacian [ToZero]'), plt.xticks([]), plt.yticks([])

plt.show()
