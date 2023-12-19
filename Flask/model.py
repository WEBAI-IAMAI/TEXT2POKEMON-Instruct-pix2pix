import os
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.image as mpimg

import torch
from diffusers import StableDiffusionInstructPix2PixPipeline
from diffusers.utils import load_image

from flask import jsonify



def generate_image(checkpoint_path, image_path, prompt, result_path):
    pipeline = StableDiffusionInstructPix2PixPipeline.from_pretrained(
        checkpoint_path, torch_dtype=torch.float16,
        safety_checker = None,
        requires_safety_checker = False
    ).to("cuda:0")
    
    image = load_image(image_path)
    file_name = "result_" + image_path.split('/')[-1].split('.')[0] + ".jpg"
    image = pipeline(prompt, image=image).images[0]
    image.save(f"{os.path.join(result_path, file_name)}")
    
    
    
    
    
    