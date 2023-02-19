from transformers import ViltProcessor, ViltForQuestionAnswering
import requests
from PIL import Image

"""
This class handles the caption/description generation of images.
"""

def describe_image(url, prompt):
    """
    Describes an image based on a given prompt.

    @param: image: URL of the image
    @param: prompt: question about the image (i.e. "What type of top is the person wearing?")

    @return: answer: response to prompt
    @return: probability: confidence in answer in range [0,1]
    """

    image = Image.open(requests.get(url, stream=True).raw)

    processor = ViltProcessor.from_pretrained("dandelin/vilt-b32-finetuned-vqa")
    model = ViltForQuestionAnswering.from_pretrained("dandelin/vilt-b32-finetuned-vqa")

    # prepare inputs
    encoding = processor(image, prompt, return_tensors="pt")

    # forward pass
    outputs = model(**encoding)
    logits = outputs.logits

    # Change logits to probabilities
    probs = logits.softmax(-1)

    # Get the top prediction
    probs, idxs = probs.topk(1)

    return {
        "answer": model.config.id2label[idxs[0][0].item()],
        "probability": probs[0].item()
    }

def describe_image_expanded(url, prompt, n):
    """
    Describes an image based on a given prompt.

    @param: image: URL of the image
    @param: prompt: question about the image (i.e. "What type of top is the person wearing?")
    @parm: n: number of results outputted

    @return: answer: response to prompt
    @return: probability: confidence in answer in range [0,1]
    """

    image = Image.open(requests.get(url, stream=True).raw)

    processor = ViltProcessor.from_pretrained("dandelin/vilt-b32-finetuned-vqa")
    model = ViltForQuestionAnswering.from_pretrained("dandelin/vilt-b32-finetuned-vqa")

    # prepare inputs
    encoding = processor(image, prompt, return_tensors="pt")

    # forward pass
    outputs = model(**encoding)
    logits = outputs.logits

    # Change logits to probabilities
    probs = logits.softmax(-1)

    # Get the top 5 predictions
    probs, idxs = probs.topk(n)

    res = []
    for idx, prob in zip(idxs[0], probs[0]):
        # Print probability to 2 decimal places
        curr_item = model.config.id2label[idx.item()]
        curr_prob = prob.item()
        print("answer:", curr_item, "\t | probability: {0:.2f}".format(curr_prob))
        res += [(curr_prob, curr_item)]
    return res

"""
def main():
    print('wassup')
    plaid_url = "https://as2.ftcdn.net/v2/jpg/02/97/30/87/1000_F_297308730_IlO1Ip9t10AesX1wnj4HZhnZJwJYgt0o.jpg?"
    black_url = "http://cdn.shopify.com/s/files/1/0565/7352/6189/products/2_e66a209f-cb60-478a-9be8-36fd559b5cd7_800x.jpg?v=1634212997"
    prep_url = "https://pbs.twimg.com/profile_images/567118737384280065/jdjGNGBl_400x400.jpeg"
    rave_girl = "https://i.etsystatic.com/9275559/r/il/c2027c/2198309083/il_570xN.2198309083_cyij.jpg"

    #plaid_img = Image.open(requests.get(plaid_url, stream=True).raw)
    #black_img = Image.open(requests.get(black_url, stream=True).raw)

    res = describe_image(rave_girl, "What accessories is this person wearing?", 5)
    print(res)

    #generate_depth(plaid_url)
    #multiply(url1,url2)
    print('done')

if __name__ == "__main__":
    main()
"""