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