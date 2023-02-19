import requests
from PIL import Image, ImageChops
import numpy as np
import torch
from transformers import DPTForDepthEstimation, DPTFeatureExtractor

"""
This class handles the processing/cleaning of images before caption generation.
"""

def generate_depth(url):
    """
    Generates a depth perception mask, where black is far & white is near.

    @param: image: URL of the image

    @return: answer: Image of depth perception mask
    """
    model = DPTForDepthEstimation.from_pretrained("Intel/dpt-hybrid-midas", low_cpu_mem_usage=True)
    feature_extractor = DPTFeatureExtractor.from_pretrained("Intel/dpt-hybrid-midas")

    image = Image.open(requests.get(url, stream=True).raw)

    # prepare image for the model
    inputs = feature_extractor(images=image, return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs)
        predicted_depth = outputs.predicted_depth

    # interpolate to original size
    prediction = torch.nn.functional.interpolate(
        predicted_depth.unsqueeze(1),
        size=image.size[::-1],
        mode="bicubic",
        align_corners=False,
    )

    # visualize the prediction
    output = prediction.squeeze().cpu().numpy()
    formatted = (output * 255 / np.max(output)).astype("uint8")
    depth = Image.fromarray(formatted)
    #depth.show()
    return depth

def multiply(im1, im2):  
    """
    Multiplies two images

    @param: im1: first Image
    @param: im2: second Image

    @return: im3: multiplied Image
    """
    # creating a image1 object
    #im1 = Image.open(requests.get(url1, stream=True).raw)
        
    # creating a image2 object
    #im2 = Image.open(requests.get(url2, stream=True).raw)
    
    # applying multiply method
    im3 = ImageChops.multiply(im1, im2)
    return im3
    #im3.show()

def isolate_foreground(url):
    depth_mask = generate_depth(url)
    whole_image = Image.open(requests.get(url, stream=True).raw)

    #whole_image.show()
    #depth_mask.show()
    isolated_image = multiply(whole_image.convert('RGB'), depth_mask.convert('RGB'))
    return isolated_image


#testing below


def main():
    print('wassup')
    plaid_url = "https://as2.ftcdn.net/v2/jpg/02/97/30/87/1000_F_297308730_IlO1Ip9t10AesX1wnj4HZhnZJwJYgt0o.jpg?"
    black_url = "http://cdn.shopify.com/s/files/1/0565/7352/6189/products/2_e66a209f-cb60-478a-9be8-36fd559b5cd7_800x.jpg?v=1634212997"
    skirt_url = "https://cdn.repeller.com/wp-content/uploads/2018/01/Amelia-30-Days-of-Outfit-Mirror-Selfies-Man-Repeller-20-954x1272.jpg"
    skirts = "https://cdn.cliqueinc.com/posts/298692/streetwear-outfits-for-women-298692-1647978616132-main.700x0c.jpg"
    #plaid_img = Image.open(requests.get(plaid_url, stream=True).raw)
    #black_img = Image.open(requests.get(black_url, stream=True).raw)

    #multiply_outfits = multiply(plaid_img, black_img)
    #multiply_outfits.show()

    #generate_depth(plaid_url)
    #multiply(url1,url2)
    isolated_image = isolate_foreground(skirts)
    isolated_image.show()
    print('done')

if __name__ == "__main__":
    main()
